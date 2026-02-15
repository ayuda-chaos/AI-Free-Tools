import React, { useEffect, useRef, useState } from 'react'

type Status = 'idle' | 'loading' | 'ok' | 'error'

export function Footer({ scrollToSection }: { scrollToSection: (id: string) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [tool, setTool] = useState('')
  const [feedback, setFeedback] = useState('')
  const [feedbackEmail, setFeedbackEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [feedbackStatus, setFeedbackStatus] = useState<Status>('idle')
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = sectionRef.current
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    const fallbackId = setTimeout(() => setIsVisible(true), 1200)

    return () => {
      observer.disconnect()
      clearTimeout(fallbackId)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tool || !email) {
      setStatus('error')
      return
    }
    setStatus('loading')
    try {
      const endpoint = import.meta.env.VITE_SHEET_ENDPOINT || '/api/submit-ai-tool'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, tool })
      })
      if (!res.ok) throw new Error('submit failed')
      setStatus('ok')
      setName('')
      setEmail('')
      setTool('')
    } catch (_err) {
      setStatus('error')
    }
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim()) {
      setFeedbackStatus('error')
      return
    }
    setFeedbackStatus('loading')
    try {
      const endpoint = import.meta.env.VITE_FEEDBACK_ENDPOINT || '/api/submit-feedback'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: feedbackEmail, feedback })
      })
      if (!res.ok) throw new Error('submit failed')
      setFeedbackStatus('ok')
      setFeedback('')
      setFeedbackEmail('')
    } catch (_err) {
      setFeedbackStatus('error')
    }
  }

  return (
    <footer ref={sectionRef} id="community" className="relative overflow-hidden px-6 py-4 text-gray-300">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black" />
      <div id="resources" className="absolute -top-8 h-2 w-2" aria-hidden />
      <div data-section-start className="relative mx-auto max-w-6xl space-y-3">
        <div
          className={`grid gap-3 lg:gap-4 lg:grid-cols-3 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
            <div>
              <div className="text-xl font-semibold text-white mb-2">About Me</div>
              <p className="text-sm text-gray-400">
                I am Aayush Timalsina. Passionate about building and writing about freedom and decentralized AI.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://aayushtimalsina.blogspot.com/?m=1"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-sm text-white hover:opacity-90 transition-opacity"
              >
                About Me / Blog
              </a>
              <button
                onClick={() => scrollToSection('tools')}
                className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm text-white hover:bg-white/15 transition-colors"
              >
                View AI Tools
              </button>
              <a
                href="https://t.me/+EcVIF9ZoHqUyN2Nh"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm text-white hover:bg-white/15 transition-colors inline-flex items-center gap-2"
              >
                <span>📣</span> Join Telegram Group
              </a>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3">
              <div className="text-sm font-semibold text-white">Submit feedback</div>
              <p className="text-xs text-gray-400">Send thoughts or bugs—entries go to the sheet endpoint set in env.</p>
              <form className="space-y-3" onSubmit={handleFeedbackSubmit}>
                <input
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                  placeholder="Your email (optional)"
                  type="email"
                />
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full h-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 resize-none"
                  placeholder="Share feedback or issues..."
                  required
                />
                <button
                  type="submit"
                  disabled={feedbackStatus === 'loading'}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 border border-emerald-400/40 text-white py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {feedbackStatus === 'loading' ? 'Sending...' : 'Send feedback'}
                </button>
                {feedbackStatus === 'ok' && <div className="text-xs text-emerald-400">Thanks! Feedback sent.</div>}
                {feedbackStatus === 'error' && (
                  <div className="text-xs text-red-400">Add a message and try again.</div>
                )}
              </form>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h4 className="text-xl font-semibold text-white mb-3">Submit Your AI Tool</h4>
            <p className="text-sm text-gray-400 mb-4">
              Share your tool submissions are logged to the site owner sheet endpoint.
            </p>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                placeholder="Your name (optional)"
                type="text"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                placeholder="Your email"
                type="email"
                required
              />
              <input
                value={tool}
                onChange={(e) => setTool(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                placeholder="Tool name + link"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border border-cyan-400/40 text-white py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {status === 'loading' ? 'Submitting...' : 'Submit to the list'}
              </button>
              {status === 'ok' && (
                <div className="text-xs text-emerald-400">
                  Thank you for your contribution for this community.
                </div>
              )}
              {status === 'error' && (
                <div className="text-xs text-red-400">Please add Name &amp; tool, then try again.</div>
              )}
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
            <h4 className="text-xl font-semibold text-white">Support the Mission</h4>
            <p className="text-sm text-gray-400">
              If this helps you, you can support with ETH to <span className="text-white font-semibold">aifreedom.eth</span>.
            </p>
            <a
              href="https://app.ens.domains/name/aifreedom.eth"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/15 transition-colors"
            >
              Open ENS Profile
            </a>
            <div className="text-sm text-gray-400">
              Freedom tech is for everyone support blockchain + AI, owned by the people.
            </div>
          </div>
        </div>

        <div
          className={`rounded-2xl border border-purple-500/20 bg-gradient-to-r from-white/5 via-white/10 to-white/5 p-6 sm:p-8 shadow-2xl shadow-purple-500/10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-lg text-gray-200 italic text-center">
            &quot;The AI revolution should be accessible to everyone, everywhere. We believe in a future where innovation is
            free, open, and decentralized.&quot;
          </p>
          <div className="mt-4 text-center text-sm text-purple-300">— The AI &amp; Blockchain Revolution</div>
        </div>

        <div
          className={`text-center text-sm text-gray-400 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Made with love for BTC and blockchain.
        </div>
      </div>
    </footer>
  )
}
