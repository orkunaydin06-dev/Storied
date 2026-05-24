'use client';

import { useEffect, useRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Why $29? Is it too cheap to be serious?',
    a: "It's $29 because we're building. The first 50 customers get founding pricing. After that, it's $39. After 200 customers, $49. The product is the same. The price is just the early access rate.",
  },
  {
    q: 'Why one-time, not subscription?',
    a: "Because 30 practices is 30 practices. We sell you a journey, not a treadmill. When you finish, you can come back for the next category. But we won't auto-charge you for a service you stopped using.",
  },
  {
    q: 'What if I miss days?',
    a: "Nothing happens. Storied counts practices, not calendar days. You can do all 30 in a month, or take six months. The work waits for you. We won't send you guilt emails.",
  },
  {
    q: 'Do I need to be a native English speaker?',
    a: "You need to be functional in English. Storied isn't a language app — it teaches you what to do with the words you already have. If you can hold a normal conversation in English, you'll get value here.",
  },
  {
    q: 'Will I be a great storyteller after 30 days?',
    a: "You'll be a much better one. Whether that's 'great' depends on where you started. What we can promise: you'll hear the difference between Day 1 and Day 30. If you don't, we'll refund you.",
  },
  {
    q: 'What does the AI feedback actually say?',
    a: "It's specific, honest, and rooted in the day's method. Example: 'You started in the middle. Aristotle would tell you we need to feel the ordinariness before we feel the change. Try opening with one concrete detail — a smell, a time, a single word.' No vague encouragement. No flattery.",
  },
  {
    q: 'Is my audio private?',
    a: "Yes, absolutely. Your recordings live in a private storage bucket only you can access. We never share them, never use them to train AI models, never analyze them for marketing. You can delete your entire archive with one click.",
  },
  {
    q: 'What is the refund policy?',
    a: "If you don't hear meaningful improvement between Day 1 and Day 30, we refund you. No questions. We trust the practice. If it doesn't work for you, you shouldn't pay for it.",
  },
];

function useScrollReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove('reveal-hidden');
          el.classList.add('reveal-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef as React.RefObject<HTMLElement>);

  return (
    <section
      ref={sectionRef}
      className="max-w-2xl mx-auto px-4 py-16 md:py-24 border-t border-border-subtle reveal-hidden"
    >
      <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-4 text-center">
        Questions
      </p>
      <div className="ink-divider mb-12" />

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{faq.q}</AccordionTrigger>
            <AccordionContent>{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
