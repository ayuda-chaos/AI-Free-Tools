import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ChevronDown, X } from 'lucide-react';

const CHAT_MODELS = ['gpt-4.1-mini', 'gpt-4.1', 'gpt-5-mini', 'gpt-5'] as const;

type ChatModel = (typeof CHAT_MODELS)[number];

const getApiUrl = () => import.meta.env.VITE_CHAT_API_URL ?? '/api/chat';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ChatModel>(CHAT_MODELS[0]);

  const modelRef = useRef(selectedModel);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    modelRef.current = selectedModel;
  }, [selectedModel]);

  const { messages, input, setInput, handleSubmit, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: getApiUrl(),
      fetch: (input, init) =>
        fetch(input, { ...init, credentials: 'include' }),
      prepareSendMessagesRequest(request) {
        return {
          body: {
            messages: request.messages.map((message) => ({
              role: message.role,
              content: message.content,
            })),
            model: modelRef.current,
          },
        };
      },
    }),
  });

  useEffect(() => {
    if (!isOpen) return;
    textareaRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, status, isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
        aria-expanded={isOpen}
        aria-controls="chat-widget-panel"
        aria-hidden={isOpen}
        tabIndex={isOpen ? -1 : 0}
        className={[
          'fixed bottom-6 right-6 z-[9990] flex items-center gap-2 rounded-full border border-cyan-300/30',
          'bg-gradient-to-r from-cyan-400/20 via-slate-900/80 to-purple-500/20 px-5 py-3 text-sm font-semibold text-white',
          'shadow-[0_0_25px_rgba(34,211,238,0.35)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200/60',
          isOpen ? 'pointer-events-none opacity-0' : 'opacity-100',
        ].join(' ')}
      >
        Chat
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
      </button>

      <section
        id="chat-widget-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="chat-widget-title"
        aria-hidden={!isOpen}
        className={[
          'fixed right-0 top-0 z-[9990] h-screen w-full max-w-full translate-x-full border-l border-white/10',
          'bg-black/85 shadow-[0_0_50px_rgba(56,189,248,0.18)] backdrop-blur-xl transition-transform duration-300 ease-out',
          'md:w-[50vw]',
          isOpen ? 'translate-x-0' : 'pointer-events-none',
        ].join(' ')}
      >
        <div className="flex h-full flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-white" id="chat-widget-title">
                AI Chat
              </h2>
              <p className="mt-1 text-xs text-white/60">
                Choose a model. Higher models may be slower/cost more.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(event) => {
                    const nextModel = event.target.value as ChatModel;
                    setSelectedModel(nextModel);
                    modelRef.current = nextModel;
                  }}
                  aria-label="Select model"
                  className="h-9 w-[170px] appearance-none rounded-full border border-white/15 bg-white/5 px-4 pr-9 text-xs text-white shadow-inner focus:border-cyan-300/70 focus:outline-none"
                >
                  {CHAT_MODELS.map((model) => (
                    <option key={model} value={model} className="bg-black">
                      {model}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              </div>

              <button
                type="button"
                aria-label="Close chat"
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-white/30 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="flex flex-col gap-3">
              {messages.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-xs text-white/60">
                  Start a conversation to see responses here.
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={[
                    'max-w-[85%] whitespace-pre-wrap rounded-2xl border px-4 py-2 text-sm leading-relaxed shadow-sm',
                    message.role === 'user'
                      ? 'ml-auto border-cyan-300/30 bg-cyan-400/15 text-cyan-50'
                      : message.role === 'assistant'
                      ? 'border-white/10 bg-white/5 text-white'
                      : 'border-amber-300/30 bg-amber-400/10 text-amber-50',
                  ].join(' ')}
                >
                  {message.content}
                </div>
              ))}

              {status === 'streaming' && (
                <div className="max-w-[85%] rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                  <span className="flex items-center gap-2">
                    <span>Thinking</span>
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-200/80 [animation-delay:-0.2s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-200/80 [animation-delay:-0.1s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-200/80" />
                    </span>
                  </span>
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-xs text-rose-100">
                  {error.message || 'Something went wrong. Please try again.'}
                </div>
              )}

              <div ref={endRef} />
            </div>
          </div>

          <form
            onSubmit={(event) => {
              if (!input.trim() || status === 'streaming') {
                event.preventDefault();
                return;
              }
              handleSubmit(event);
            }}
            className="border-t border-white/10 bg-black/80 px-5 py-4"
          >
            <div className="flex items-end gap-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    if (!input.trim() || status === 'streaming') {
                      return;
                    }
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Type your message..."
                rows={3}
                aria-label="Chat message"
                className="min-h-[92px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-cyan-300/60"
              />
              <button
                type="submit"
                disabled={!input.trim() || status === 'streaming'}
                aria-label="Send message"
                className="h-11 rounded-full border border-cyan-300/40 bg-gradient-to-r from-cyan-400/80 to-purple-500/80 px-5 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-[11px] text-white/50">
              Enter to send, Shift+Enter for a newline.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
