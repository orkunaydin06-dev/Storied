# 06 — AUDIO PIPELINE
## Storied: Recording, Storage, Privacy

> **Purpose of this document:**
> This file defines exactly how audio flows through Storied — from the user's microphone to private storage, through transcription to AI feedback, and back as playable archive. Privacy and reliability are non-negotiable.
>
> **Read after:** `00-master-vibe.md`, `05-ai-feedback-system.md`
> **Referenced by:** Antigravity when implementing any audio functionality
>
> **The rule:** Audio is the most personal data in Storied. Every technical decision here prioritizes privacy, then reliability, then experience. Never sacrifice privacy for any other goal.

---

## 1. THE AUDIO LIFECYCLE

Every recording goes through this exact sequence:

```
1. CAPTURE          Browser MediaRecorder API records to memory.
2. ENCODE           Audio is encoded to webm/opus (browser native) 
                    or mp3 (server-side fallback).
3. UPLOAD           Chunked upload to Supabase Storage private bucket.
4. PERSIST          Row written to database with storage path, 
                    duration, metadata.
5. TRANSCRIBE       Whisper API generates transcript.
6. ANALYZE          Claude generates feedback from transcript + context.
7. STORE FEEDBACK   Scores and narrative persisted in database.
8. NOTIFY UI        Frontend reads the new state, renders feedback.
9. PLAYBACK READY   Signed URL generated on-demand for any future 
                    playback (15-min expiry).
```

Each step is documented in detail below.

---

## 2. STEP 1: BROWSER RECORDING

### 2.1 — The MediaRecorder API

Storied uses the browser's native **MediaRecorder API**. No third-party libraries. This is supported on:

- iOS Safari 14.5+ (covers ~98% of iOS users)
- Android Chrome (all modern versions)
- Desktop Chrome, Firefox, Safari, Edge (all modern versions)

### 2.2 — Permission Request

Before any recording, the browser must grant microphone permission. Storied's flow:

1. User taps "Start recording"
2. Browser shows native permission dialog
3. If granted → recording begins
4. If denied → show error message from `02-brand-voice.md` §8.5

```typescript
// Pseudocode for permission + recording start
try {
  const stream = await navigator.mediaDevices.getUserMedia({ 
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100,
    }
  });
  
  // Permission granted — proceed to record
  startRecording(stream);
  
} catch (error) {
  if (error.name === 'NotAllowedError') {
    showPermissionError();
  } else if (error.name === 'NotFoundError') {
    showNoMicrophoneError();
  } else {
    showGenericError();
  }
}
```

### 2.3 — Audio Format

Storied records in **webm/opus** by default, with **mp4/aac** fallback for iOS Safari (which doesn't support webm).

```typescript
const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
  ? 'audio/webm;codecs=opus'
  : 'audio/mp4;codecs=mp4a.40.2';

const recorder = new MediaRecorder(stream, {
  mimeType,
  audioBitsPerSecond: 64000,  // 64 kbps — speech quality, small files
});
```

**Why 64 kbps:**
- Speech is fully intelligible at this bitrate
- A 60-second recording is ~480 KB
- Mono audio (we don't need stereo for voice)
- Cheap storage, cheap upload, fast transcription

**Why opus codec:**
- Best speech codec in 2026 (free, modern, efficient)
- Native browser support
- Whisper API accepts webm/opus directly

### 2.4 — Real-Time Waveform Visualization

While recording, the UI shows a live waveform (see `03-user-journey.md` §5.4). Implementation:

```typescript
// Web Audio API for visualization (separate from MediaRecorder)
const audioContext = new AudioContext();
const source = audioContext.createMediaStreamSource(stream);
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
source.connect(analyser);

const dataArray = new Uint8Array(analyser.frequencyBinCount);

function draw() {
  analyser.getByteFrequencyData(dataArray);
  // Render dataArray as a bar waveform
  // 32 bars, amber color (#E8B547), smooth transitions
  requestAnimationFrame(draw);
}
```

The waveform is decorative — it doesn't drive any logic. It exists to give the user the feeling of being heard.

### 2.5 — Timer and Limits

A circular progress ring around the breathing dot shows time elapsed:

```
Target duration this week:    {target}
- Week 1: 60s
- Week 2: 75s  
- Week 3-4: 90s
- Week 5: 120s

At target:           Soft chime, ring completes
At target + 25%:     Ring turns terracotta (#C9885E)
At target + 50%:     Prompt: "Wrapping up?"
At target + 100%:    Hard cutoff — recording stops automatically
```

The hard cutoff prevents runaway recordings (mistakes, accidents, abuse).

### 2.6 — Storing the Audio Blob

When the user taps "Stop":

```typescript
recorder.addEventListener('dataavailable', (event) => {
  audioChunks.push(event.data);
});

recorder.addEventListener('stop', () => {
  const audioBlob = new Blob(audioChunks, { type: mimeType });
  uploadRecording(audioBlob);
});

recorder.stop();
```

The Blob lives in memory only until upload begins. Once uploaded successfully, it's released. **Audio never persists in the browser** beyond the active session.

---

## 3. STEP 2-3: UPLOAD TO SUPABASE STORAGE

### 3.1 — Storage Bucket Structure

Supabase Storage uses **one private bucket** called `recordings`. Structure:

```
recordings/
├── {user_id}/
│   ├── day-01/
│   │   ├── recording-1.webm
│   │   └── recording-2.webm
│   ├── day-02/
│   │   ├── recording-1.webm
│   │   └── recording-2.webm
│   ├── ...
│   └── day-30/
│       └── recording-1.webm  ← Day 30 only has one recording
```

Each user has their own folder. The folder structure mirrors the database structure.

### 3.2 — Bucket Configuration

```sql
-- Create bucket as PRIVATE
insert into storage.buckets (id, name, public)
values ('recordings', 'recordings', false);

-- Row-level security policy
create policy "Users can only access their own recordings"
on storage.objects for all
using (
  bucket_id = 'recordings' 
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

**Critical:** The bucket MUST be private. **Public buckets are forbidden.** A misconfigured public bucket is the most common audio privacy breach in SaaS. Antigravity must verify this at deploy time.

### 3.3 — Upload Implementation

Direct upload from browser to Supabase Storage using the Supabase JS client:

```typescript
const filePath = `${userId}/day-${dayNumber.toString().padStart(2, '0')}/recording-${recordingNumber}.webm`;

const { data, error } = await supabase.storage
  .from('recordings')
  .upload(filePath, audioBlob, {
    contentType: 'audio/webm',
    cacheControl: '3600',
    upsert: false,  // Never overwrite — if recording exists, error
  });

if (error) {
  handleUploadError(error);
}
```

### 3.4 — Upload Progress and Retry

For larger recordings (90-120s = ~720-960 KB), show upload progress. Supabase's upload API doesn't have native progress yet, so we use a simulated indicator:

```typescript
// While upload is in progress, show "Processing..." 
// (not "Uploading..." — too technical, breaks the calm)

setUiState('listening');  // The "Listening..." screen
const uploadResult = await uploadWithRetry(audioBlob, 3);  // 3 retries
```

Retry logic:
- Attempt 1: immediate
- Attempt 2: 2-second delay
- Attempt 3: 5-second delay
- All failed: show "Upload took too long" error (from `02-brand-voice.md` §8.2)

If all retries fail, the audio Blob is **kept in browser memory** until the user explicitly cancels or refreshes. They can retry the upload manually.

### 3.5 — Database Record

After successful upload, write a row to the `recordings` table:

```sql
insert into recordings (
  user_id,
  day_number,
  recording_number,
  storage_path,
  duration_seconds,
  mime_type,
  file_size_bytes,
  created_at
) values (
  'user-uuid',
  1,
  1,
  'user-uuid/day-01/recording-1.webm',
  47,
  'audio/webm',
  376832,
  now()
);
```

The full schema lives in `07-technical-architecture.md`.

---

## 4. STEP 5: WHISPER TRANSCRIPTION

### 4.1 — The Whisper API Call

After upload completes, server-side code generates a transcription via OpenAI's Whisper API:

```typescript
// Server-side (Next.js API route or Edge Function)
const audioFile = await downloadFromStorage(storagePath);

const transcription = await openai.audio.transcriptions.create({
  file: audioFile,
  model: 'whisper-1',
  language: 'en',          // English only in v1
  response_format: 'verbose_json',
  timestamp_granularities: ['word'],  // Word-level timestamps for delivery analysis
});

// transcription returns:
// {
//   text: "The coffee was still hot when I sat down...",
//   language: "en",
//   duration: 47.3,
//   words: [
//     { word: "The", start: 0.0, end: 0.15 },
//     { word: "coffee", start: 0.15, end: 0.42 },
//     ...
//   ]
// }
```

### 4.2 — Language Detection

If Whisper detects a non-English language (rare but possible), Storied handles this as an edge case (see `05-ai-feedback-system.md` §8.5).

```typescript
if (transcription.language !== 'en') {
  await markRecordingAsNonEnglish(recordingId);
  await notifyUser('non_english_recording');
  return;
}
```

### 4.3 — Whisper Cost Management

Whisper pricing (as of 2026): **$0.006 per minute of audio**.

Average Storied recording: 60-90 seconds. Per practice = 2 recordings × ~75s avg = 2.5 minutes total.

Per practice cost: **~$0.015**
Per user lifetime (30 days): **~$0.45**

This is acceptable and scales linearly. No optimization needed in v1.

### 4.4 — Transcription Storage

Transcriptions are stored in the database, not in Storage:

```sql
update recordings
set 
  transcript = 'The coffee was still hot when I sat down...',
  transcript_language = 'en',
  transcript_word_count = 89,
  word_timestamps = '[{"word":"The","start":0,"end":0.15},...]'::jsonb,
  transcription_completed_at = now()
where id = 'recording-id';
```

**Why store word timestamps:** Future features (like highlighting words during playback) need them. They're cheap to store and impossible to regenerate cheaply.

### 4.5 — Whisper Confidence Handling

Whisper doesn't return explicit confidence scores, but its accuracy can be inferred from:
- Output text quality (very short, malformed responses suggest issues)
- Presence of `[inaudible]` or `[?]` markers
- Detected language mismatch

If transcription quality is poor:

```typescript
if (transcription.text.length < 30 || transcription.text.includes('[inaudible]')) {
  await markRecordingAsTranscriptionUnclear(recordingId);
  await notifyUser('transcription_unclear');
}
```

---

## 5. STEP 6-7: AI FEEDBACK GENERATION

After transcription completes, the AI feedback pipeline begins. Full prompt details in `05-ai-feedback-system.md`. Here's the integration flow:

```typescript
async function generateFeedback(recordingId: string) {
  const recording = await getRecording(recordingId);
  const day = await getDayContent(recording.day_number);
  const user = await getUser(recording.user_id);
  
  // Build the prompt
  const systemPrompt = MASTER_SYSTEM_PROMPT;
  const userPrompt = buildFeedbackPrompt({
    dayNumber: recording.day_number,
    weekNumber: getWeekFromDay(recording.day_number),
    methodology: day.methodology,
    question: day.question,
    miniTeaching: day.mini_teaching,
    transcript: recording.transcript,
    duration: recording.duration_seconds,
    userName: user.first_name,
  });
  
  // Choose model (Sonnet for Day 1/30, Haiku otherwise)
  const model = shouldUseSonnet(recording.day_number) 
    ? 'claude-sonnet-4-7' 
    : 'claude-haiku-4-5';
  
  // Call Claude API
  const response = await anthropic.messages.create({
    model,
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    temperature: 0.7,
  });
  
  // Parse JSON response
  const feedback = parseJsonResponse(response.content[0].text);
  
  // Persist to database
  await saveFeedback({
    recording_id: recordingId,
    scores: feedback.scores,
    narrative: feedback.narrative,
    structure_breakdown: feedback.structure_breakdown,
    model_used: model,
    prompt_version: 'MASTER_V1+FEEDBACK_V1',
    generated_at: new Date(),
  });
  
  // Trigger UI update via Supabase Realtime
  await notifyFeedbackReady(recordingId);
}
```

---

## 6. STEP 8: REAL-TIME UI UPDATES

When feedback is ready, the UI must update without a manual refresh. We use **Supabase Realtime** for this.

```typescript
// Frontend subscribes to recording status changes
const channel = supabase
  .channel(`recording:${recordingId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'recordings',
    filter: `id=eq.${recordingId}`,
  }, (payload) => {
    if (payload.new.feedback_status === 'ready') {
      navigateToFeedback(recordingId);
    }
  })
  .subscribe();
```

This is how the "Listening..." screen transitions to the feedback screen — when the database row's `feedback_status` flips to `ready`, the UI knows.

---

## 7. STEP 9: PLAYBACK

The user plays back their recordings on:
- The feedback screen (R1 playback)
- The comparison screen (R1 vs R2)
- The archive
- The Day 30 graduation flow

### 7.1 — Signed URL Generation

Audio files are **never** served from a public URL. Every playback uses a **signed URL** that expires in 15 minutes:

```typescript
const { data, error } = await supabase.storage
  .from('recordings')
  .createSignedUrl(storagePath, 900);  // 900 seconds = 15 minutes

// data.signedUrl is valid for exactly 15 minutes
```

If the URL expires while the user is still on the page, the next play action requests a fresh URL. This is invisible to the user.

### 7.2 — HTML5 Audio Element

Playback uses the native HTML5 `<audio>` element:

```typescript
<audio
  src={signedUrl}
  controls={false}            // Hide native controls (we use custom)
  preload="metadata"          // Only load metadata, not full audio
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
  onEnded={() => setIsPlaying(false)}
/>
```

Custom playback UI:
- Play/pause button (amber, minimal)
- Waveform with playhead position
- Time display (current / total in monospace)

### 7.3 — Waveform Pre-Generation

Generating a waveform on every playback is expensive. Instead, generate it **once** during upload and store the waveform data:

```typescript
// During upload, generate waveform data
const audioBuffer = await blobToAudioBuffer(audioBlob);
const waveformData = generateWaveformPeaks(audioBuffer, 64);  // 64 peaks total

// Store waveform_data as int[] in database (much smaller than re-decoding audio)
await updateRecording(recordingId, { waveform_data: waveformData });
```

The waveform is just 64 numbers per recording. Tiny. Renders instantly. Identical every playback.

### 7.4 — Day 1 vs Day 30 Comparison Playback

On the graduation screen, both Day 1 and Day 30 recordings play **sequentially**, not simultaneously:

```typescript
// Auto-play Day 1, then prompt for Day 30
1. Show Day 1 recording with auto-play
2. Wait for completion
3. Show a small "Now Day 30:" transition
4. Auto-play Day 30 recording
5. Show the comparison screen with both waveforms
```

This is intentional. Hearing both back-to-back creates the emotional weight of the journey.

---

## 8. PRIVACY ARCHITECTURE

### 8.1 — Row-Level Security (RLS)

Every database table and storage object enforces RLS. Users can only access their own data.

```sql
-- Recordings table
create policy "Users can read their own recordings"
on recordings for select
using (auth.uid() = user_id);

create policy "Users can insert their own recordings"
on recordings for insert
with check (auth.uid() = user_id);

create policy "Users can update their own recordings"
on recordings for update
using (auth.uid() = user_id);

create policy "Users can delete their own recordings"
on recordings for delete
using (auth.uid() = user_id);
```

**Even Storied admins cannot read user recordings via the standard API.** Admin access requires explicit, logged, service-role bypass — and is reserved for legal/compliance edge cases only.

### 8.2 — Encryption

- **In transit:** All API calls use HTTPS (Supabase, OpenAI, Anthropic enforce this).
- **At rest:** Supabase Storage encrypts all files using AES-256 by default.
- **Database:** Supabase Postgres encrypts at rest by default.

No additional encryption is needed for v1. If enterprise customers later demand customer-managed keys (CMK), this can be added.

### 8.3 — The "Delete Everything" Flow

When the user clicks "Delete everything" in settings:

```typescript
async function deleteAllUserData(userId: string) {
  // Step 1: Mark for deletion (7-day grace period)
  await markUserForDeletion(userId);
  
  // Step 2: Hide from UI immediately
  await archiveUserSession(userId);
  
  // Step 3: Send confirmation email with recovery link
  await sendDeletionConfirmation(userId);
  
  // After 7 days (cron job):
  // Step 4: Delete all audio files from storage
  await deleteAllRecordingsFromStorage(userId);
  
  // Step 5: Delete all database rows
  await deleteAllUserRows(userId);
  
  // Step 6: Audit log entry (anonymized)
  await logDeletion({ user_id_hash: hash(userId), deleted_at: now() });
}
```

The 7-day grace period gives users a recovery window if they change their mind. After 7 days, deletion is **permanent and unrecoverable**.

### 8.4 — Data Export ("Export My Archive")

Users can export their entire archive as a ZIP file:

```typescript
async function exportUserData(userId: string) {
  const recordings = await getAllRecordings(userId);
  const zip = new JSZip();
  
  for (const rec of recordings) {
    const audioFile = await downloadFromStorage(rec.storage_path);
    zip.file(`day-${rec.day_number}/recording-${rec.recording_number}.webm`, audioFile);
    
    const feedback = await getFeedback(rec.id);
    zip.file(`day-${rec.day_number}/feedback-${rec.recording_number}.json`, JSON.stringify(feedback, null, 2));
  }
  
  // Include a README explaining the export
  zip.file('README.md', generateReadme());
  
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, 'storied-archive.zip');
}
```

The README explains:
- What's in the archive
- The audio format (webm/opus, playable in VLC and any modern browser)
- The feedback JSON structure
- "These files are yours. Storied no longer has any obligation to them."

### 8.5 — No AI Training. Aggregate Insights & Opt-In Testimonials Allowed.

The privacy promise from `00-master-vibe.md` §18 is hybrid: **audio content is sacred and untouchable**, but **anonymized aggregate data and explicit-consent text testimonials** are permitted.

**What is FORBIDDEN (no exceptions, no consent overrides):**

1. **Audio files are never used for AI training.** Whisper and Claude APIs do not train on data sent via their paid endpoints (confirmed in their terms of service).
2. **Audio files are never used as marketing case studies.** Even if a user says "you can use my recording" — we don't. The risk of accidental exposure is too high.
3. **Transcripts are never used for marketing analysis.** No "let's see what stories users tell" research. The transcripts are private to the user and the AI feedback loop.
4. **Audio is never shared publicly via any product feature.** No public links, no embedding, no SEO indexing.

**What is ALLOWED (with appropriate safeguards):**

1. **Anonymized aggregate analysis.** Examples:
   - "Average Authenticity score climbs from 65 to 80 over 30 days"
   - "Users who complete Week 1 are 4x more likely to reach Day 30"
   - "Average recording duration on Day 1 is 47 seconds"
   
   These insights inform product decisions and may appear in marketing — but only at the aggregate level, never tied to a specific user.

2. **Opt-in text testimonials.** Users who finish Day 30 may explicitly consent (via a clear checkbox in the graduation flow) to allow:
   - Their **written words** (testimonial they submit) to be used in marketing
   - Their **first name and city** (optional — never last name)
   - Their **score progression** (e.g., "Daniel, Berlin: 60 → 87")
   
   Audio is never included. The user's actual recordings stay private even if they consent to a written testimonial.

3. **Anonymized score statistics in marketing.** "Storied graduates improve their Authenticity scores by an average of 28%" — drawn from anonymized aggregate data — is permitted on the landing page once we have data.

**The technical implementation:**

```typescript
// User table includes consent fields
{
  consent_marketing_testimonial: boolean,        // default false
  consent_marketing_testimonial_at: timestamptz, // when they consented
  testimonial_text: text,                        // their submitted text (nullable)
  testimonial_approved: boolean,                 // admin review before display
}
```

The testimonial flow appears at the end of graduation (after the Quiet Ending screen), framed simply:

> "Was Storied worth it? If you'd like to share your experience with future storytellers, you can — in your own words. Audio stays private; only your written reflection would be used. Skip this if you'd rather not."

**This is not a compliance checkbox. This is a brand value.**

The default is privacy. The exception requires explicit, specific, opt-in action. If an engineer ever proposes "let's broaden this scope," the answer is **no** — broaden requires a product-level decision, not an implementation choice.

The privacy promise to the user is:

> Your audio is yours, always. We never use it for AI training, never use it as a case study, never analyze it for marketing. If you want to share your written reflection at the end of your journey, you can — but only if you explicitly say yes. Otherwise, your entire practice remains between you and Storied.

---

## 9. PERFORMANCE OPTIMIZATION

### 9.1 — File Size Targets

```
60-second recording (webm/opus @ 64kbps mono):  ~480 KB
90-second recording:                            ~720 KB
120-second recording:                           ~960 KB

Average user (30 practices × 2 recordings × ~75s): ~50 MB lifetime
```

These are tiny. Storage is not a bottleneck.

### 9.2 — Upload Speed

On a typical 3G mobile connection (1 Mbps upload):
- 480 KB recording: ~4 seconds upload
- 720 KB recording: ~6 seconds upload

On WiFi (10+ Mbps upload):
- Any recording: < 1 second

The "Listening..." screen masks this time naturally.

### 9.3 — Whisper Latency

Whisper API typically returns transcription in:
- 60-second recording: ~3-5 seconds
- 90-second recording: ~5-8 seconds
- 120-second recording: ~7-10 seconds

### 9.4 — Total "Listening..." Duration

End-to-end:
- Upload (1-6s) + Whisper (3-10s) + Claude feedback (2-8s) = **6-24 seconds**

This is acceptable. The "Listening..." screen evolves through 3 phases:
- 0-5 sec: "Listening..."
- 5-15 sec: "Reading your story..."
- 15+ sec: "Almost there..."

If total time exceeds 30 seconds, surface the error from `02-brand-voice.md` §8.6.

### 9.5 — Bandwidth Cost

Supabase Storage egress: ~$0.09 per GB after free tier.

Average user lifetime egress (re-listening + Day 1 vs Day 30 comparison): ~100 MB = **$0.009 per user**.

Negligible.

---

## 10. MOBILE-SPECIFIC CONSIDERATIONS

Recording on mobile has quirks. Antigravity must handle these explicitly.

### 10.1 — iOS Safari Quirks

**Issue 1: iOS requires user gesture to play audio.**

When the user taps "Play" on a recording, the audio plays. But if we try to auto-play (like on the Day 30 graduation flow), iOS blocks it.

**Solution:** Always require an explicit tap for playback on iOS. The Day 30 graduation should say "Tap to hear Day 1" rather than auto-playing.

**Issue 2: iOS Safari requires audio/mp4 instead of webm.**

```typescript
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const mimeType = isIOS && !isMacOS()
  ? 'audio/mp4;codecs=mp4a.40.2'
  : 'audio/webm;codecs=opus';
```

**Issue 3: iOS Safari sometimes drops microphone access in background.**

If the user switches apps mid-recording, the audio stream can be interrupted. Detect this:

```typescript
document.addEventListener('visibilitychange', () => {
  if (document.hidden && isRecording) {
    stopRecording();
    showMessage('Recording stopped — Storied paused when you switched apps.');
  }
});
```

### 10.2 — Android Chrome

Generally well-behaved. Webm/opus works. No special handling needed beyond mobile-responsive UI.

### 10.3 — Touch Targets

All recording UI buttons are minimum 44px × 44px (Apple's minimum touch target). Some are larger:
- "Start recording" button: 64px height
- "Stop" button (mid-recording): 56px height
- Play buttons in archive: 48px diameter

### 10.4 — Network Resilience

Mobile networks drop. Storied handles this:

1. Audio Blob remains in browser memory until upload succeeds
2. If upload fails, Blob is preserved across screen renders (using React state + IndexedDB fallback)
3. If user navigates away and returns, Blob is gone — they must re-record
4. The user is warned before navigating away: "You haven't uploaded your recording yet. Leave anyway?"

---

## 11. THE PRODUCTION CHECKLIST

Before launching, Antigravity must verify these items. They are grouped by priority:

### Tier 1 — Critical (MUST be checked before launch)

These items protect user privacy and core functionality. **Cannot launch without all of these checked.**

```
PRIVACY (8 items — non-negotiable)
☐ Supabase Storage bucket 'recordings' is PRIVATE (not public)
☐ RLS policies are enforced on storage.objects
☐ RLS policies are enforced on recordings table
☐ Signed URLs expire after 15 minutes (not longer)
☐ "Delete everything" deletes from storage AND database
☐ Whisper API key is server-side only (never exposed to browser)
☐ Anthropic API key is server-side only (never exposed to browser)
☐ HTTPS is enforced everywhere

CORE FUNCTIONALITY (5 items — must work for launch)
☐ iOS Safari recording tested on real device (iPhone)
☐ Android Chrome recording tested on real device
☐ Mobile waveform renders correctly at 375px width
☐ Failed upload retry logic tested
☐ Day 1 → Day 30 happy path tested end-to-end
```

### Tier 2 — Should be checked, can patch post-launch

These items improve the experience but won't break the product if missed initially.

```
EDGE CASES & POLISH (5 items — fix within first week)
☐ Audio Blob is cleared from browser memory after successful upload
☐ Export feature includes ALL recordings + feedback
☐ Privacy policy on the public site reflects what code does
☐ Slow connection (3G simulation) tested — UI doesn't break
☐ Recording interruption (background app switch) handled gracefully
☐ Long recording (120s) tested for memory leaks
```

**The Rule:**
- **Tier 1 must be 100% complete before launch.** No exceptions.
- **Tier 2 can be patched in the first week after launch** while Storied has small user count.
- After 50 paying customers, Tier 2 must also be complete.

---

## 12. FUTURE CONSIDERATIONS (NOT V1)

These are out of scope for v1 but worth noting for future planning:

- **Offline support:** PWA with offline recording, sync when back online (currently: requires online for recording)
- **Audio enhancement:** Background noise removal (currently: relies on browser's built-in)
- **Multi-language support:** Whisper supports 90+ languages; transcription and feedback in user's language
- **Native mobile apps:** React Native with native MediaRecorder API
- **Voice cloning (heavily considered, currently rejected):** "Hear your Day 30 voice today" — too creepy, breaks Storied's trust contract
- **Audio sharing (heavily considered, currently rejected):** Public links to "share my Day 30 story" — privacy risk too high, defeats the private-by-default brand

The rejected features are noteworthy: Storied deliberately chooses **privacy over virality**, **trust over engagement**. These are brand decisions, not technical limitations.

---

## 13. WHAT THIS DOCUMENT GUARANTEES

If Antigravity implements this pipeline correctly:

✅ Every recording is captured cleanly, in modern formats.
✅ Every upload is private, encrypted, and access-controlled.
✅ Every playback uses time-limited signed URLs.
✅ Every transcription is accurate (within Whisper's limits) and stored securely.
✅ Every privacy promise made in marketing is technically enforced in code.
✅ Mobile recording works on iOS Safari and Android Chrome.
✅ The "Listening..." moment is calm and explained, not anxious.
✅ Users can delete or export their entire archive at any time.

This is not just a technical pipeline. This is **the audio trust system**.

---

*End of audio pipeline. Privacy first. Reliability second. Experience third. Never reorder these priorities.*
