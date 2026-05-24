'use client';

import { useState } from 'react';
import type { AnnotatedExemplar } from '@/app/api/recording/exemplar/route';

// 6 distinct soft colors that work on dark backgrounds
const ELEMENT_COLORS = [
  { bg: 'rgba(232,181,71,0.12)',  border: 'rgba(232,181,71,0.5)',  text: '#E8B547', label: 'amber'  },
  { bg: 'rgba(100,160,220,0.12)', border: 'rgba(100,160,220,0.5)', text: '#64A0DC', label: 'blue'   },
  { bg: 'rgba(123,198,123,0.12)', border: 'rgba(123,198,123,0.5)', text: '#7BC67B', label: 'green'  },
  { bg: 'rgba(181,123,220,0.12)', border: 'rgba(181,123,220,0.5)', text: '#B57BDC', label: 'purple' },
  { bg: 'rgba(220,139,90,0.12)',  border: 'rgba(220,139,90,0.5)',  text: '#DC8B5A', label: 'coral'  },
  { bg: 'rgba(90,210,210,0.12)',  border: 'rgba(90,210,210,0.5)',  text: '#5AD2D2', label: 'teal'   },
];

function getColor(index: number) {
  return ELEMENT_COLORS[index % ELEMENT_COLORS.length];
}

function AnnotatedStory({ exemplar }: { exemplar: AnnotatedExemplar }) {
  const [active, setActive] = useState<number | null>(null);

  // Build legend — only elements actually used, in order of first appearance
  const usedElements: { element: string; index: number }[] = [];
  const seen = new Set<string>();
  for (const seg of exemplar.segments) {
    if (!seen.has(seg.element)) {
      seen.add(seg.element);
      usedElements.push({ element: seg.element, index: seg.elementIndex });
    }
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-8">
        {usedElements.map(({ element, index }) => {
          const color = getColor(index);
          return (
            <button
              key={element}
              onClick={() => setActive(active === index ? null : index)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-200"
              style={{
                background: active === index ? color.bg : 'transparent',
                border: `1px solid ${active === index ? color.border : 'rgba(255,255,255,0.1)'}`,
                color: active === null || active === index ? color.text : 'var(--color-fg-subtle)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: color.text }}
              />
              {element}
            </button>
          );
        })}
      </div>

      {/* Story segments */}
      <div className="space-y-1">
        {exemplar.segments.map((seg, i) => {
          const color = getColor(seg.elementIndex);
          const isDimmed = active !== null && active !== seg.elementIndex;
          const isHighlighted = active === seg.elementIndex;

          return (
            <span
              key={i}
              onClick={() => setActive(active === seg.elementIndex ? null : seg.elementIndex)}
              className="inline cursor-pointer rounded px-0.5 transition-all duration-200"
              style={{
                background: isHighlighted ? color.bg : 'transparent',
                borderBottom: `2px solid ${isDimmed ? 'transparent' : color.border}`,
                opacity: isDimmed ? 0.35 : 1,
              }}
              title={seg.element}
            >
              {seg.text}{' '}
            </span>
          );
        })}
      </div>

      {/* Active element label */}
      {active !== null && (
        <div className="mt-6 pt-4 border-t border-border-subtle">
          <p
            className="font-mono text-xs uppercase tracking-wider"
            style={{ color: getColor(active).text }}
          >
            {usedElements.find(e => e.index === active)?.element}
          </p>
          <p className="font-sans text-xs text-fg-subtle mt-1">
            Tap the legend or highlighted text to deselect.
          </p>
        </div>
      )}
    </div>
  );
}

export function ExemplarTab({
  recordingId,
  initialExemplar,
}: {
  recordingId: string;
  initialExemplar: AnnotatedExemplar | null;
}) {
  const [exemplar, setExemplar] = useState<AnnotatedExemplar | null>(initialExemplar);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/recording/exemplar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordingId }),
      });
      const { data, error: err } = await res.json();
      if (err || !data?.exemplar) throw new Error(err ?? 'Generation failed');
      setExemplar(data.exemplar);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!exemplar) {
    return (
      <div className="mb-12 text-center py-8">
        <p className="font-sans text-sm text-fg-muted mb-2 max-w-xs mx-auto leading-relaxed">
          Your story, retold through the framework — every beat annotated.
        </p>
        <p className="font-sans text-xs text-fg-subtle mb-8 max-w-xs mx-auto">
          Tap any section to see which framework element it represents.
        </p>
        {error && <p className="font-sans text-xs text-error mb-4">{error}</p>}
        <button
          onClick={generate}
          disabled={loading}
          className="font-sans text-sm text-accent-warm border border-accent-warm/40 rounded-lg px-6 py-3 hover:bg-accent-warm/10 transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? 'Generating (~20s)...' : 'Generate annotated example'}
        </button>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-1">
          {exemplar.framework}
        </p>
        <p className="font-sans text-xs text-fg-subtle">
          Tap an element in the legend or the story to highlight it.
        </p>
      </div>

      <div className="font-serif text-lg text-fg-primary leading-relaxed">
        <AnnotatedStory exemplar={exemplar} />
      </div>

      <p className="font-sans text-xs text-fg-subtle mt-8 leading-relaxed border-t border-border-subtle pt-4">
        This is your story, retold through the framework. Use it as a reference — not a script.
      </p>
    </div>
  );
}
