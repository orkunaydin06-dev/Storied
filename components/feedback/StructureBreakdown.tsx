interface Element {
  name: string;
  status: string;
  score: string;
  note: string;
}

interface StructureBreakdownProps {
  framework: string;
  elements: Element[];
}

export function StructureBreakdown({ framework, elements }: StructureBreakdownProps) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-4">
        {framework}
      </p>
      <div className="space-y-3">
        {elements.map((el) => (
          <div key={el.name} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-28">
              <span className="font-sans text-sm text-fg-muted">{el.name}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="font-mono text-xs"
                  style={{
                    color:
                      el.status === 'Strong'
                        ? 'var(--color-success)'
                        : el.status === 'Missing'
                        ? 'var(--color-error)'
                        : 'var(--color-warning)',
                  }}
                >
                  {el.status}
                </span>
                <span className="font-mono text-xs text-fg-subtle">{el.score}</span>
              </div>
              {el.note && (
                <p className="font-sans text-sm text-fg-muted leading-relaxed">{el.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
