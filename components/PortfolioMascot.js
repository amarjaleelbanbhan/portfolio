import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

const DIRECTIONS = [
  ['0% 0%', '50% 0%', '100% 0%'],
  ['0% 50%', '50% 50%', '100% 50%'],
  ['0% 100%', '50% 100%', '100% 100%'],
];
const INITIAL_MESSAGE = {
  role: 'assistant',
  text: "Hi, I'm Amar's portfolio assistant. Ask me about his projects, research, skills, or experience.",
};
const SUGGESTIONS = [
  'What is Amar building?',
  'Tell me about his research',
  'What has he contributed to?',
];

export default function PortfolioMascot() {
  const { asPath } = useRouter();
  const [direction, setDirection] = useState([1, 1]);
  const [reacting, setReacting] = useState(false);
  const [anchorVisible, setAnchorVisible] = useState(asPath.split('?')[0] === '/');
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const directionRef = useRef('1:1');
  const reactionTimer = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    const anchor = document.querySelector('[data-portfolio-mascot-anchor]');
    if (!anchor) {
      setAnchorVisible(false);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setAnchorVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [asPath]);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    if (!finePointer.matches) return undefined;

    let frame = 0;
    let latestPointer = null;
    const updateGaze = () => {
      frame = 0;
      if (!latestPointer) return;

      const mascots = [...document.querySelectorAll('[data-portfolio-mascot], [data-portfolio-mascot-anchor]')];
      const mascot = mascots.find((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.width > 0 && bounds.height > 0;
      });
      if (!mascot) return;
      const bounds = mascot.getBoundingClientRect();
      const dx = (latestPointer.x - (bounds.left + bounds.width / 2)) / bounds.width;
      const dy = (latestPointer.y - (bounds.top + bounds.height / 2)) / bounds.height;
      const col = dx < -0.28 ? 0 : dx > 0.28 ? 2 : 1;
      const row = dy < -0.28 ? 0 : dy > 0.28 ? 2 : 1;
      const key = `${row}:${col}`;

      if (key !== directionRef.current) {
        directionRef.current = key;
        setDirection([row, col]);
      }
    };

    const onPointerMove = (event) => {
      latestPointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = window.requestAnimationFrame(updateGaze);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => () => window.clearTimeout(reactionTimer.current), []);
  useEffect(() => {
    const openAssistant = () => setOpen(true);
    window.addEventListener('portfolio-assistant:open', openAssistant);
    return () => window.removeEventListener('portfolio-assistant:open', openAssistant);
  }, []);
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    const list = messagesRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, busy]);
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const react = () => {
    setReacting(true);
    window.clearTimeout(reactionTimer.current);
    reactionTimer.current = window.setTimeout(() => setReacting(false), 520);
  };

  const sendMessage = async (event, suggestedText) => {
    event?.preventDefault();
    const question = String(suggestedText ?? draft).trim();
    if (!question || busy) return;

    const nextMessages = [...messages, { role: 'user', text: question }];
    setMessages(nextMessages);
    setDraft('');
    setBusy(true);

    try {
      const response = await fetch('/api/portfolio-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message, index) => index > 0 || message.role !== 'assistant')
            .slice(-6)
            .map((message) => ({ role: message.role, text: message.text })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'I could not answer just now. Please try again.');
      setMessages((current) => [...current, { role: 'assistant', text: data.reply }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: error.message || 'I could not answer just now. Please try again.' },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {open && (
        <section
          className="portfolio-assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="portfolio-assistant-title"
        >
          <header className="portfolio-assistant-header">
            <div>
              <p className="font-code text-[10px] uppercase tracking-[0.2em] text-neon-cyan mb-1">Portfolio assistant</p>
              <h2 id="portfolio-assistant-title" className="text-sm font-semibold text-white">Ask about Amar</h2>
            </div>
            <button
              type="button"
              className="portfolio-assistant-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="portfolio-assistant-messages" ref={messagesRef} aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`portfolio-assistant-message${message.role === 'user' ? ' is-user' : ''}`}
                key={`${message.role}-${index}`}
              >
                {message.text}
              </div>
            ))}
            {busy && <div className="portfolio-assistant-message" role="status">Thinking…</div>}
          </div>

          {messages.length === 1 && (
            <div className="portfolio-assistant-suggestions" aria-label="Suggested questions">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  className="portfolio-assistant-suggestion"
                  onClick={() => sendMessage(null, suggestion)}
                  disabled={busy}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form className="portfolio-assistant-form" onSubmit={sendMessage}>
            <textarea
              ref={inputRef}
              className="portfolio-assistant-input"
              rows={1}
              maxLength={1200}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Ask about Amar's work…"
              aria-label="Your question"
              disabled={busy}
            />
            <button className="portfolio-assistant-send" type="submit" disabled={busy || !draft.trim()}>
              {busy ? '…' : 'Send'}
            </button>
          </form>
          <p className="portfolio-assistant-note">
            Replies use information published on this portfolio. Your question is sent to Google Gemini; chats are not saved here.
          </p>
        </section>
      )}

      <button
        type="button"
        className={`portfolio-mascot portfolio-assistant-trigger${reacting ? ' is-reacting' : ''}${anchorVisible ? ' is-hidden' : ''}`}
        data-portfolio-mascot
        aria-label="Ask Amar's portfolio assistant"
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Ask about Amar"
        onClick={() => {
          react();
          setOpen(true);
        }}
      >
        <span
          className="portfolio-mascot__sprite"
          aria-hidden="true"
          style={{ backgroundPosition: DIRECTIONS[direction[0]][direction[1]] }}
        />
      </button>
    </>
  );
}
