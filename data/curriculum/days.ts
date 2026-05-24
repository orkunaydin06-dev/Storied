export type PricingTier = 'founding' | 'standard' | 'premium';

export interface DayContent {
  day: number;
  week: number;
  weekTheme: string;
  methodologyName: string;
  methodologyAnchor: string;
  shortTitle: string;
  question: string;
  miniTeaching: string;
  revisionExamples: [string, string, string];
  closureMessage: string;
  targetSeconds: number;
  isSynthesisWeek?: boolean;
  isGraduationDay?: boolean;
}

const WEEK_1_ANCHOR = `This week, evaluate stories against Aristotle's framework. Listen for: clear three-act structure (beginning, middle, end), the inciting incident, conflict (internal or external), the moment of recognition (anagnorisis), the reversal (peripeteia), and emotional release (catharsis). Reward stories that have shape. Be honest when a story is shapeless.`;

const WEEK_2_ANCHOR = `This week, evaluate stories against the Pixar Story Spine. Listen for the six beats: "Once upon a time" (setup), "Every day" (ordinary world), "One day" (inciting incident), "Because of that" (chain reaction), "Until finally" (climax/crisis), "Ever since then" (resolution/transformation). Reward stories that hit the beats clearly. Be honest when beats are skipped or rushed.`;

const WEEK_3_ANCHOR = `This week, evaluate stories against the Hero's Journey framework. Listen for: the call to adventure, the refusal, the meeting with the mentor, crossing the threshold, the ordeal (belly of the whale), the return changed. Reward stories that follow this mythic shape — even if the user doesn't name the stages. Be honest when transformation is claimed but not earned.`;

const WEEK_4_ANCHOR = `This week, evaluate stories against Cicero's rhetorical framework. Listen for: inventio (a clear argument or stake), dispositio (intentional structure), elocutio (style and word choice), movere (emotional impact). The three duties: docere (teaches), delectare (engages), movere (moves). Reward stories that don't just narrate — they persuade. Be honest when a story is well-told but has no stake.`;

const WEEK_5_ANCHOR = `This week, evaluate stories with all four frameworks available — but reward stories that don't follow any of them exactly. Look for: a voice that has its own rhythm, choices that feel native to the speaker, language that doesn't sound borrowed. Authenticity is the highest score this week. Be honest when the user is still imitating; be specific when they've found something genuinely their own.`;

export const CURRICULUM: DayContent[] = [
  // ── WEEK 1: ARISTOTLE ────────────────────────────────────────────────────
  {
    day: 1,
    week: 1,
    weekTheme: "Structure & Conflict",
    methodologyName: "Aristotle's Poetics",
    methodologyAnchor: WEEK_1_ANCHOR,
    shortTitle: "Ordinary day, unforgettable turn.",
    question: "Tell me about the most ordinary day in your life that turned into something unforgettable. Sixty seconds — beginning, middle, end.",
    miniTeaching: "Aristotle said it 2,300 years ago: \"Every story is made of three parts — a beginning, a middle, and an end.\" It sounds simple. But most people start in the middle, blur through the action, and skip the end. Today: count all three.",
    revisionExamples: [
      "The coffee was still hot when I sat down.",
      "It was 9:47 on a Monday.",
      "I remember the rain.",
    ],
    closureMessage: "What to carry forward: when you tell stories today — in meetings, in messages, over dinner — start with one concrete detail. Not a summary. A sensation.",
    targetSeconds: 60,
  },
  {
    day: 2,
    week: 1,
    weekTheme: "Structure & Conflict",
    methodologyName: "Aristotle's Poetics",
    methodologyAnchor: WEEK_1_ANCHOR,
    shortTitle: "A disagreement you held your ground in.",
    question: "Tell me about a time someone in your life disagreed with you — and you had to hold your ground. Don't moralize. Just tell the story.",
    miniTeaching: "Aristotle saw conflict as the engine of drama. The most common kind: human against human. But a good story doesn't ask \"who was right?\" It says: \"two people had real positions, and they collided.\" Don't resolve too fast. Let the collision happen.",
    revisionExamples: [
      "She said the words I'd been waiting for, and they weren't what I expected.",
      "He didn't raise his voice. That's how I knew it was serious.",
      "The conversation took eleven minutes. It changed everything.",
    ],
    closureMessage: "What to carry forward: when you tell a story about disagreement, don't tell us who was right. Tell us where the collision happened.",
    targetSeconds: 60,
  },
  {
    day: 3,
    week: 1,
    weekTheme: "Structure & Conflict",
    methodologyName: "Aristotle's Poetics",
    methodologyAnchor: WEEK_1_ANCHOR,
    shortTitle: "The fight inside your own head.",
    question: "Tell me about a moment when the biggest fight wasn't with someone else — it was inside you. What were the two voices saying?",
    miniTeaching: "Aristotle didn't name it, but every great story has internal conflict at its core. Two voices. Both yours. Both true. The art is not in resolving them — it's in letting them speak. Today: name the two voices honestly. The story will follow.",
    revisionExamples: [
      "One part of me said no. The other part was already moving.",
      "I read the message twice. Then I read it eight more times.",
      "The room was quiet. My head was not.",
    ],
    closureMessage: "What to carry forward: the strongest stories aren't about external dramas. They're about the moment you almost made a different choice.",
    targetSeconds: 60,
  },
  {
    day: 4,
    week: 1,
    weekTheme: "Structure & Conflict",
    methodologyName: "Aristotle's Poetics",
    methodologyAnchor: WEEK_1_ANCHOR,
    shortTitle: "The moment you finally saw it.",
    question: "Tell me about a moment you suddenly realized something you'd been missing for a long time. The moment of recognition. Sixty seconds.",
    miniTeaching: "Aristotle called it anagnorisis — the recognition moment. The instant the character (or you) sees what they've been blind to. It's the heart of every tragedy and every coming-of-age story. Hollywood calls it the \"aha moment.\" But it's older than Hollywood. Today: find yours.",
    revisionExamples: [
      "She said something so small I almost missed it.",
      "I was halfway through the sentence when I realized I was lying.",
      "It wasn't an answer. It was a question that wouldn't go away.",
    ],
    closureMessage: "What to carry forward: the best recognition moments aren't shouted. They're whispered to yourself, and you barely hear them.",
    targetSeconds: 60,
  },
  {
    day: 5,
    week: 1,
    weekTheme: "Structure & Conflict",
    methodologyName: "Aristotle's Poetics",
    methodologyAnchor: WEEK_1_ANCHOR,
    shortTitle: "The moment everything flipped.",
    question: "Tell me about a moment when everything was going one way — and then suddenly, it flipped. Sixty seconds. Land the turn.",
    miniTeaching: "Aristotle called it peripeteia — the reversal of fortune. The hinge of every great story. \"Up to that point, everything was X. After that moment, nothing was the same.\" This is where stories earn their weight. Today: find the hinge.",
    revisionExamples: [
      "We were two minutes from getting everything we wanted.",
      "Up to that point, I thought I was the lucky one.",
      "She said one sentence and I knew the deal was off.",
    ],
    closureMessage: "What to carry forward: every story has a moment when the wind changes. Find it. Don't bury it. Name it.",
    targetSeconds: 60,
  },
  {
    day: 6,
    week: 1,
    weekTheme: "Structure & Conflict",
    methodologyName: "Aristotle's Poetics",
    methodologyAnchor: WEEK_1_ANCHOR,
    shortTitle: "The story that lightened you.",
    question: "Tell me one story from your life that left you cleaner, lighter, or wiser after telling it. Ninety seconds — use everything from this week.",
    miniTeaching: "Aristotle called it catharsis — the emotional release that comes from a story well told. This week you've learned shape, conflict, recognition, and the turn. Today, bring them together. Tell a story that does something to you in the telling.",
    revisionExamples: [
      "For ten years, I didn't say a word about it.",
      "The cards were the only thing we had.",
      "I didn't know what I was doing until much later.",
    ],
    closureMessage: "What to carry forward: the stories worth telling are the ones that change you in the telling. Week One done. Aristotle's foundation is yours. Tomorrow, Pixar.",
    targetSeconds: 90,
  },

  // ── WEEK 2: PIXAR ────────────────────────────────────────────────────────
  {
    day: 7,
    week: 2,
    weekTheme: "The Modern Skeleton",
    methodologyName: "Pixar's Story Spine",
    methodologyAnchor: WEEK_2_ANCHOR,
    shortTitle: "The you before.",
    question: "Tell me about who you were before something important happened — the version of you that didn't know what was coming. Seventy-five seconds.",
    miniTeaching: "Pixar built a formula. Every film uses it. The first beat: \"Once upon a time…\" This is where you introduce the character — you — in the world that existed before the change. Don't rush past it. The change only matters if we feel the before.",
    revisionExamples: [
      "Once upon a time, I worked weekends without noticing.",
      "Once upon a time, I lived in a city I never really saw.",
      "Once upon a time, I thought success looked like inbox zero.",
    ],
    closureMessage: "What to carry forward: when you tell stories today, take a beat to set up \"before.\" Most people rush past it. Don't.",
    targetSeconds: 75,
  },
  {
    day: 8,
    week: 2,
    weekTheme: "The Modern Skeleton",
    methodologyName: "Pixar's Story Spine",
    methodologyAnchor: WEEK_2_ANCHOR,
    shortTitle: "Your old routine, rendered.",
    question: "Describe the routine of that version of you — what every ordinary day looked like, before the change. Seventy-five seconds.",
    miniTeaching: "Pixar's second beat: \"Every day…\" This is where you paint the ordinary. It might feel boring to describe routine, but boring is the point — boring is what we need to see, so that \"one day\" can shatter it. Today: render normalcy with care.",
    revisionExamples: [
      "Every day, I checked my email before I got out of bed.",
      "Every day, the same train. The same headphones. The same playlist.",
      "Every day, I told myself this was what I wanted.",
    ],
    closureMessage: "What to carry forward: routine isn't boring in a story. Routine is the foundation that gets cracked open. Render it carefully.",
    targetSeconds: 75,
  },
  {
    day: 9,
    week: 2,
    weekTheme: "The Modern Skeleton",
    methodologyName: "Pixar's Story Spine",
    methodologyAnchor: WEEK_2_ANCHOR,
    shortTitle: "The single moment that broke the pattern.",
    question: "Tell me about the single moment that changed everything. Don't summarize. Set the scene. Seventy-five seconds.",
    miniTeaching: "\"One day…\" — this is Pixar's engine. A phone call, an email, a chance encounter, a single sentence. The ordinary world cracks. Everything that follows flows from this moment. Don't paraphrase it. Render it. Time, place, exact words.",
    revisionExamples: [
      "One day, an email arrived at 4:17pm.",
      "One day, she said three words I wasn't expecting.",
      "One day, the phone rang and the world tilted.",
    ],
    closureMessage: "What to carry forward: the \"one day\" of your story is where it begins. Don't rush past it. Render it like a scene from a film.",
    targetSeconds: 75,
  },
  {
    day: 10,
    week: 2,
    weekTheme: "The Modern Skeleton",
    methodologyName: "Pixar's Story Spine",
    methodologyAnchor: WEEK_2_ANCHOR,
    shortTitle: "The dominoes that fell after.",
    question: "Tell me about what happened next — the chain reaction that single moment created. Seventy-five seconds.",
    miniTeaching: "Pixar's hidden weapon: \"Because of that.\" Events in great stories don't just happen — they cause the next thing to happen. The chain is what makes the story feel inevitable. Today: don't list what happened next. Show how each thing caused the next.",
    revisionExamples: [
      "Because of that one sentence, the next six months happened.",
      "Because of that meeting, I bought a one-way ticket.",
      "Because of that, I called my mother for the first time in two years.",
    ],
    closureMessage: "What to carry forward: when you tell stories today, link each event to the one before it. \"Because of that\" is the most powerful phrase in storytelling.",
    targetSeconds: 75,
  },
  {
    day: 11,
    week: 2,
    weekTheme: "The Modern Skeleton",
    methodologyName: "Pixar's Story Spine",
    methodologyAnchor: WEEK_2_ANCHOR,
    shortTitle: "The moment you couldn't dodge it.",
    question: "Tell me about the moment when it all came to a head — when you couldn't avoid it anymore. Seventy-five seconds.",
    miniTeaching: "\"Until finally…\" — this is Pixar's crisis moment. The protagonist (you) can no longer avoid the thing they've been running from. The story has built to this point. Now you face it. Today: name the moment you stopped running.",
    revisionExamples: [
      "Until finally, the meeting I'd been avoiding showed up on my calendar.",
      "Until finally, I had to give an answer.",
      "Until finally, the question I'd been dodging came out of someone else's mouth.",
    ],
    closureMessage: "What to carry forward: every story has a \"until finally\" — the moment the protagonist can't dodge anymore. In your stories, find it. In your life, recognize it.",
    targetSeconds: 75,
  },
  {
    day: 12,
    week: 2,
    weekTheme: "The Modern Skeleton",
    methodologyName: "Pixar's Story Spine",
    methodologyAnchor: WEEK_2_ANCHOR,
    shortTitle: "The full arc, in six beats.",
    question: "Now tell me the full arc — once upon a time, every day, one day, because of that, until finally, ever since then. Ninety seconds. All six beats.",
    miniTeaching: "Today you bring all six Pixar beats together. This is the most useful storytelling tool in the world — it works in films, in emails, in pitches, in eulogies. Once it's in your bones, you'll see it everywhere. Today: tell one full story, hitting all six.",
    revisionExamples: [
      "Once upon a time, I never asked for what I wanted.",
      "Once upon a time, I was the person who said yes to everything.",
      "Once upon a time, I lived two lives without admitting it.",
    ],
    closureMessage: "What to carry forward: Pixar's spine is a tool. Use it. In emails. In pitches. In stories told over wine. You now have the most useful storytelling framework in the world in your bones. Week Two done. Tomorrow, Joseph Campbell.",
    targetSeconds: 90,
  },

  // ── WEEK 3: HERO'S JOURNEY ───────────────────────────────────────────────
  {
    day: 13,
    week: 3,
    weekTheme: "Personal Transformation",
    methodologyName: "Joseph Campbell's Hero's Journey",
    methodologyAnchor: WEEK_3_ANCHOR,
    shortTitle: "The call you weren't ready for.",
    question: "Tell me about a moment life called you to do something you weren't ready for. Ninety seconds.",
    miniTeaching: "Joseph Campbell said every great story begins the same way: with a call. An invitation to step into the unknown. It rarely arrives at a convenient time. It is rarely loud. But it is unmistakable. Today: find the call that came for you.",
    revisionExamples: [
      "The call came at the worst possible time, the way all real calls do.",
      "She said one sentence, and I knew I was going to say yes.",
      "It wasn't an opportunity. It was an invitation.",
    ],
    closureMessage: "What to carry forward: in your life and in your stories, learn to recognize the call. It rarely announces itself. But it's always specific.",
    targetSeconds: 90,
  },
  {
    day: 14,
    week: 3,
    weekTheme: "Personal Transformation",
    methodologyName: "Joseph Campbell's Hero's Journey",
    methodologyAnchor: WEEK_3_ANCHOR,
    shortTitle: "The no you almost said.",
    question: "Tell me about the moment you said no — or wanted to say no — to a change you knew was coming. Ninety seconds.",
    miniTeaching: "Every hero refuses the call. At first. Campbell saw this in every mythology, from Greek to Sanskrit to West African. \"I can't. Not now. Not me.\" This refusal isn't weakness — it's the story being honest. Today: tell me about your refusal.",
    revisionExamples: [
      "I said no for three weeks before I said yes.",
      "Every reason I gave was true. None of them were the real reason.",
      "I was protecting myself. I just didn't know from what.",
    ],
    closureMessage: "What to carry forward: the refusal isn't weakness. It's the story being honest with itself. When you tell stories of change, don't skip the part where you almost didn't change.",
    targetSeconds: 90,
  },
  {
    day: 15,
    week: 3,
    weekTheme: "Personal Transformation",
    methodologyName: "Joseph Campbell's Hero's Journey",
    methodologyAnchor: WEEK_3_ANCHOR,
    shortTitle: "The right person at the right moment.",
    question: "Tell me about the person who showed up at exactly the right moment — and what they said or did. Ninety seconds.",
    miniTeaching: "Every hero has a mentor. Yoda. Gandalf. Mr. Miyagi. The mentor doesn't take the hero's journey for them — they hand them the tool they'll need to take it themselves. Today: who was your mentor? Don't summarize them. Render them in one specific moment.",
    revisionExamples: [
      "Her name was Rachel, and she ran a bookshop.",
      "He didn't say much. He pointed at a chair and waited for me to sit.",
      "She handed me a single page and said: read this when you can't sleep.",
    ],
    closureMessage: "What to carry forward: when you tell mentor stories today, render them. One name. One scene. One specific gift. Generalities don't carry weight.",
    targetSeconds: 90,
  },
  {
    day: 16,
    week: 3,
    weekTheme: "Personal Transformation",
    methodologyName: "Joseph Campbell's Hero's Journey",
    methodologyAnchor: WEEK_3_ANCHOR,
    shortTitle: "The moment of no return.",
    question: "Tell me about the moment you couldn't go back — when you crossed a line and knew there was no return. Ninety seconds.",
    miniTeaching: "Campbell called it crossing the threshold — the irrevocable step into the new world. A decision, a signature, a word said out loud. After this, you cannot un-cross. Today: find the line you crossed, and render the crossing.",
    revisionExamples: [
      "I signed the letter at 8:47pm on a Thursday.",
      "Once I said it out loud, I couldn't take it back.",
      "The door closed behind me and I knew.",
    ],
    closureMessage: "What to carry forward: every life has thresholds. Most people don't notice when they're crossing one. Storytellers do. Storytellers find the threshold and name it.",
    targetSeconds: 90,
  },
  {
    day: 17,
    week: 3,
    weekTheme: "Personal Transformation",
    methodologyName: "Joseph Campbell's Hero's Journey",
    methodologyAnchor: WEEK_3_ANCHOR,
    shortTitle: "The bottom of your descent.",
    question: "Tell me about your darkest moment in that journey — what Campbell called \"the belly of the whale.\" Ninety seconds. Don't soften it.",
    miniTeaching: "Hero's Journey doesn't get easier in the middle — it gets harder. Campbell named it the belly of the whale: the point where the hero faces what they've been most afraid of. This is where most storytellers flinch. Today, don't. Render the bottom, honestly.",
    revisionExamples: [
      "I sat in a bathroom at 11pm and called my mother.",
      "Three months in, I knew I was failing. I just didn't know yet what I was learning.",
      "The lowest point wasn't a moment. It was a Tuesday afternoon.",
    ],
    closureMessage: "What to carry forward: the strongest stories don't avoid the bottom. They go through it. When you tell stories of struggle today, don't perform the suffering. Render it.",
    targetSeconds: 90,
  },
  {
    day: 18,
    week: 3,
    weekTheme: "Personal Transformation",
    methodologyName: "Joseph Campbell's Hero's Journey",
    methodologyAnchor: WEEK_3_ANCHOR,
    shortTitle: "The full arc, mythically.",
    question: "Tell me the full hero's journey of one chapter in your life — call, refusal, mentor, threshold, ordeal, return. Ninety seconds.",
    miniTeaching: "Campbell said: \"The aim of the hero's journey is to return — but changed.\" Today, bring all six stages together. The story should end where it began, but with you carrying something you didn't have at the start.",
    revisionExamples: [
      "The call came in October.",
      "It started with a question from a stranger.",
      "Looking back, I can see every stage. At the time, I just felt lost.",
    ],
    closureMessage: "What to carry forward: your life has mythic shape. Most people never see it. Storytellers do. Week Three done. Tomorrow, Cicero — and the art of being heard.",
    targetSeconds: 90,
  },

  // ── WEEK 4: CICERO ───────────────────────────────────────────────────────
  {
    day: 19,
    week: 4,
    weekTheme: "Persuasion & Impact",
    methodologyName: "Cicero's Rhetoric",
    methodologyAnchor: WEEK_4_ANCHOR,
    shortTitle: "A belief that's earned its place.",
    question: "Convince me of something you genuinely believe — but make me feel it, don't just argue it. Ninety seconds.",
    miniTeaching: "Cicero called the first canon inventio — the invention of your argument. Not cold logic. A real position you've earned through experience. Today: pick a belief that's yours, not borrowed. Then convince me through a story, not a sermon.",
    revisionExamples: [
      "I believe most career advice is given by people who haven't faced the choice.",
      "The thing I want to tell you doesn't sound like advice. It sounds like a story.",
      "Here is what I learned, the hard way, in the only way it can be learned.",
    ],
    closureMessage: "What to carry forward: when you persuade today, don't argue. Testify. Stories beat sermons every time.",
    targetSeconds: 90,
  },
  {
    day: 20,
    week: 4,
    weekTheme: "Persuasion & Impact",
    methodologyName: "Cicero's Rhetoric",
    methodologyAnchor: WEEK_4_ANCHOR,
    shortTitle: "An idea, arranged for impact.",
    question: "Pitch me an idea you've had — give it a beginning that hooks, a middle that builds, an end that lands. Ninety seconds.",
    miniTeaching: "Cicero's second canon: dispositio. The arrangement of your case. Same argument, different order, completely different effect. The strongest material goes at the end. The hook goes at the beginning. The proof goes in the middle. Today: pitch me something — and let the arrangement do half the work.",
    revisionExamples: [
      "Three years ago, a friend of mine missed her father's last days.",
      "I want to tell you about a market that doesn't know it exists.",
      "There are fifty million people in Europe who have lost time because of one problem.",
    ],
    closureMessage: "What to carry forward: same content, different order, completely different impact. When you tell stories today, ask yourself: am I leading with the right thing?",
    targetSeconds: 90,
  },
  {
    day: 21,
    week: 4,
    weekTheme: "Persuasion & Impact",
    methodologyName: "Cicero's Rhetoric",
    methodologyAnchor: WEEK_4_ANCHOR,
    shortTitle: "A complex idea, made simple.",
    question: "Take a complex idea you understand well and explain it to a curious twelve-year-old. Ninety seconds. No jargon.",
    miniTeaching: "Cicero's third canon: elocutio — style. The same idea expressed in two different word-choices lands two different ways. \"Optimize\" is not \"improve.\" \"Concept\" is not \"idea.\" Today: take something you know well and find the simplest, most precise words for it.",
    revisionExamples: [
      "Imagine you have a tree that grows one apple every year.",
      "There's a kind of math that doesn't feel like math.",
      "Compound interest is the most magical thing in the world, and most people miss it.",
    ],
    closureMessage: "What to carry forward: jargon is laziness. Today, replace one piece of jargon with one image. Watch what happens.",
    targetSeconds: 90,
  },
  {
    day: 22,
    week: 4,
    weekTheme: "Persuasion & Impact",
    methodologyName: "Cicero's Rhetoric",
    methodologyAnchor: WEEK_4_ANCHOR,
    shortTitle: "A story that moves, not informs.",
    question: "Tell me a one-minute story that makes me feel something — not because of the facts, but because of the way you tell it. Sixty seconds.",
    miniTeaching: "Cicero said the highest duty of the speaker is movere — to move the audience. Information teaches. Engagement entertains. But movement — emotional shift — is what people remember. Today: tell a story where what happened matters less than how it lands.",
    revisionExamples: [
      "My grandfather was eighty-seven when he stopped recognizing me.",
      "She didn't know who I was. We had the best conversation we'd ever had.",
      "I sat down across from him and didn't tell him who I was.",
    ],
    closureMessage: "What to carry forward: people forget facts. They remember how they felt. Today, in one story, find the feeling. Build everything around it.",
    targetSeconds: 60,
  },
  {
    day: 23,
    week: 4,
    weekTheme: "Persuasion & Impact",
    methodologyName: "Cicero's Rhetoric",
    methodologyAnchor: WEEK_4_ANCHOR,
    shortTitle: "A defense to those who don't want to hear it.",
    question: "Defend a position that's hard to defend — to people who already disagree. Ninety seconds. Don't sound desperate.",
    miniTeaching: "Cicero gave speeches to a hostile Roman Senate. His method: first, acknowledge their truth. Then, add yours. People can't hear a counter-argument until they feel heard. Today: pick a position you've defended badly before. Try again, with the audience in mind.",
    revisionExamples: [
      "I know how it sounds when I say I stopped donating to charity.",
      "Before you disagree with me, let me agree with your first objection.",
      "I want to defend a position that I know is unpopular.",
    ],
    closureMessage: "What to carry forward: when you face resistance today, acknowledge it before answering it. Cicero won the Roman Senate this way. It still works.",
    targetSeconds: 90,
  },
  {
    day: 24,
    week: 4,
    weekTheme: "Persuasion & Impact",
    methodologyName: "Cicero's Rhetoric",
    methodologyAnchor: WEEK_4_ANCHOR,
    shortTitle: "Your case, made completely.",
    question: "Give me a ninety-second talk on something that matters to you — using everything you've learned this week. Make me feel it.",
    miniTeaching: "Today: bring it all together. Inventio (your argument), dispositio (arrangement), elocutio (style), movere (emotion). Don't think of it as a speech. Think of it as the case for something you believe. The case for something true.",
    revisionExamples: [
      "I want to tell you why I think most adults stop becoming people.",
      "Here is the case for a thing nobody is making the case for.",
      "There's a belief I've held for ten years, and I've only recently learned how to say it.",
    ],
    closureMessage: "What to carry forward: Cicero's four tools are yours. Use them every time you have something to say that matters. Week Four done. Tomorrow, no one teaches you. You synthesize.",
    targetSeconds: 90,
  },

  // ── WEEK 5: SYNTHESIS ────────────────────────────────────────────────────
  {
    day: 25,
    week: 5,
    weekTheme: "Finding Your Voice",
    methodologyName: "Storied Synthesis",
    methodologyAnchor: WEEK_5_ANCHOR,
    shortTitle: "Where you came from.",
    question: "Tell me your origin story — the story of how you became who you are today. Two minutes. Use any framework you want, or none.",
    miniTeaching: "This week is yours. You've spent twenty-four days following the methods. Today: pick the one that fits your story, or invent your own combination. The frameworks are training wheels. Today, you take them off — or use them — as you choose.",
    revisionExamples: [
      "I became who I am twice — once by accident, once on purpose.",
      "The version of me that exists today was built by three people, none of whom planned it.",
      "I used to think my origin story started when I was born. I was wrong.",
    ],
    closureMessage: "What to carry forward: when you tell your origin story going forward, choose what to keep, what to leave, and what to rename. The frameworks gave you the choices. Now choose.",
    targetSeconds: 120,
    isSynthesisWeek: true,
  },
  {
    day: 26,
    week: 5,
    weekTheme: "Finding Your Voice",
    methodologyName: "Storied Synthesis",
    methodologyAnchor: WEEK_5_ANCHOR,
    shortTitle: "The story that contains you.",
    question: "Tell me a story that, if I heard it, I'd understand the most important thing about you. Sixty seconds. No more.",
    miniTeaching: "Joan Didion said: \"We tell ourselves stories in order to live.\" Today, find the one you've been telling yourself. The one that, if a stranger heard it, they'd know you. Don't explain it. Just tell it.",
    revisionExamples: [
      "If you knew one thing about me, I'd want it to be this story.",
      "There's a moment I've never told anyone — and it explains me.",
      "Most of who I am can be told in sixty seconds, if you tell it right.",
    ],
    closureMessage: "What to carry forward: the story you tell yourself about yourself is more important than the events of your life. Tell it carefully.",
    targetSeconds: 60,
    isSynthesisWeek: true,
  },
  {
    day: 27,
    week: 5,
    weekTheme: "Finding Your Voice",
    methodologyName: "Storied Synthesis",
    methodologyAnchor: WEEK_5_ANCHOR,
    shortTitle: "Universal in subject, personal in voice.",
    question: "Tell a story that anyone in the world could connect with — but only you could tell. Ninety seconds.",
    miniTeaching: "The hardest balance: stories that are deeply yours, but accessible to anyone. The mistake is going too universal (no specificity) or too personal (no resonance). The best storytellers find the angle where their specific experience reveals something everyone has felt — but never named.",
    revisionExamples: [
      "Anyone who has waited for a parent to die knows what I'm about to describe.",
      "This is a story about a Tuesday afternoon. It is also a story about everyone's Tuesday afternoons.",
      "I want to tell you about a feeling I think most people have, but no one talks about.",
    ],
    closureMessage: "What to carry forward: specificity isn't the enemy of universality. It's the door to it. Tell your specific story, and the universal will appear on its own.",
    targetSeconds: 90,
    isSynthesisWeek: true,
  },
  {
    day: 28,
    week: 5,
    weekTheme: "Finding Your Voice",
    methodologyName: "Storied Synthesis",
    methodologyAnchor: WEEK_5_ANCHOR,
    shortTitle: "The argument you never made out loud.",
    question: "Tell a story whose entire purpose is to change my mind about something — without ever sounding like you're trying to. Ninety seconds.",
    miniTeaching: "The most powerful persuasion doesn't sound like persuasion. It sounds like a story you couldn't help but tell. Today: pick something you want to change someone's mind about — and tell the story that does the work, without ever asking the listener to agree.",
    revisionExamples: [
      "I'm not going to tell you to do this. I'm just going to tell you what happened.",
      "Here's a story I think about whenever someone asks me about it.",
      "I used to think the same thing you think. Then this happened.",
    ],
    closureMessage: "What to carry forward: the strongest arguments aren't made. They're told. When you want to change someone's mind today, find the story — not the syllogism.",
    targetSeconds: 90,
    isSynthesisWeek: true,
  },
  {
    day: 29,
    week: 5,
    weekTheme: "Finding Your Voice",
    methodologyName: "Storied Synthesis",
    methodologyAnchor: WEEK_5_ANCHOR,
    shortTitle: "The story that would disappear without you.",
    question: "Tell me a story that, if you didn't tell it, would be lost forever. Two minutes. No frames. Just it.",
    miniTeaching: "Some stories belong to a moment, a person, a single witness. You. If you don't tell them, they vanish. Today, give one of them air. Don't worry about structure. Don't worry about method. Just tell it the way you'd tell it to someone who deserves to know.",
    revisionExamples: [
      "Nobody else saw this. Nobody else can tell you.",
      "This happened in a room with two people in it. The other one is gone.",
      "I've never told this story. I'm going to tell it now.",
    ],
    closureMessage: "What to carry forward: some stories aren't yours to tell — they belong to the world, through you. Don't let them die in your throat.",
    targetSeconds: 120,
    isSynthesisWeek: true,
  },
  {
    day: 30,
    week: 5,
    weekTheme: "Finding Your Voice",
    methodologyName: "Storied Synthesis",
    methodologyAnchor: WEEK_5_ANCHOR,
    shortTitle: "Day 1, told again. Differently.",
    question: "Tell me the same kind of story you told on Day 1 — about the most ordinary day in your life that turned into something unforgettable. Two minutes. Use everything.",
    miniTeaching: "Today you've practiced thirty days. The first thing you ever recorded in Storied was an answer to today's question. Today, you'll answer it again. Then you'll hear both. The version of you that started, and the version that finished. Listen for what's the same. Listen for what's different. The difference is what you've earned.",
    revisionExamples: [
      "The most ordinary day I can remember.",
      "It started like every other day. It didn't end like one.",
      "I've told this story before. This time, I'll tell it right.",
    ],
    closureMessage: "Thirty days. Thirty stories. You don't sound like Aristotle. You don't sound like Pixar. You don't sound like Campbell or Cicero.\n\nYou sound like you. Clearer.\n\nThe practice is yours now. Go tell some stories.",
    targetSeconds: 120,
    isSynthesisWeek: true,
    isGraduationDay: true,
  },
];

export function getDayContent(day: number): DayContent | undefined {
  return CURRICULUM.find((d) => d.day === day);
}

export function getWeekContent(week: number): DayContent[] {
  return CURRICULUM.filter((d) => d.week === week);
}

export function getWeekTheme(week: number): string {
  const day = CURRICULUM.find((d) => d.week === week);
  return day?.weekTheme ?? '';
}

export function getTargetSeconds(day: number): number {
  return getDayContent(day)?.targetSeconds ?? 60;
}
