'use client';

import { useState } from 'react';

const faqs = [
  { q: 'How long per practice?', a: 'Eight to twelve minutes. Record. Feedback. Revise. Done.' },
  { q: 'What if I miss a day?', a: 'The practice waits. No streak pressure. Come back when ready.' },
  { q: 'Is this AI feedback?', a: "Yes. Claude applies the day's framework and gives specific, honest analysis. Not encouragement." },
  { q: 'Are my recordings private?', a: 'Always. Your recordings live in a private archive only you can access. Never shared. Never used to train AI.' },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="max-w-md mx-auto px-6 py-12">
      <h3 className="font-heading text-3xl text-center text-fg-primary mb-8">Questions</h3>
      <div className="border-t border-border-subtle">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-border-subtle">
            <button className="w-full py-5 flex items-center justify-between text-left" onClick={() => setOpen(open === i ? null : i)}>
              <span className="font-medium text-fg-primary text-sm pr-4">{faq.q}</span>
              <span className="text-fg-muted text-xl flex-shrink-0">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <div className="pb-5 animate-fade-in"><p className="text-sm text-fg-muted leading-relaxed">{faq.a}</p></div>}
          </div>
        ))}
      </div>
    </section>
  );
}

