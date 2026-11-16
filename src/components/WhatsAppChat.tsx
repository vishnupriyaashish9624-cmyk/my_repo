'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRouter } from 'next/navigation'

const EASE = [0.2, 0.7, 0.2, 1] as const

/** Quick replies: each one opens WhatsApp with this message already typed. */
const QUICK = [
  { label: 'Get a quote', text: 'Hi Klen Plus, I’d like a quote. Here’s my list:' },
  { label: 'Check stock', text: 'Hi Klen Plus, can you check if you have this in stock?' },
  { label: 'Delivery days', text: 'Hi Klen Plus, which days do you deliver to my area?' },
  { label: 'Reorder my list', text: 'Hi Klen Plus, I’d like to reorder my usual list.' },
]

const WaIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <path
      fill="currentColor"
      d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3.6 29l6.4-1.7c2 1.1 4.1 1.6 6.1 1.6 7.2 0 13-5.7 13-12.8S23.2 3 16 3Zm0 23.5c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-3.8 1 1-3.7-.3-.4c-1.1-1.7-1.7-3.7-1.7-5.8C5.4 10 10.1 5.4 16 5.4S26.6 10 26.6 15.8 21.9 26.5 16 26.5Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 .8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z"
    />
  </svg>
)

/**
 * Floating WhatsApp chat: a round button bottom-right that opens a small chat card. The card
 * "types" a greeting, offers quick replies, and has a box for your own message. Sending opens
 * WhatsApp (app or web) to the Klen Plus number with the message filled in. No data is stored here.
 */
export default function WhatsAppChat({ number }: { number?: string | null }) {
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(true)
  const [nudge, setNudge] = useState(false)
  const [text, setText] = useState('')
  const input = useRef<HTMLTextAreaElement>(null)
  const still = useReducedMotion()
  const router = useRouter()

  // Show a small "Need supplies?" nudge once, a few seconds after the page loads.
  useEffect(() => {
    const t = setTimeout(() => setNudge(true), 6000)
    const h = setTimeout(() => setNudge(false), 14000)
    return () => {
      clearTimeout(t)
      clearTimeout(h)
    }
  }, [])

  // Each time the card opens, the greeting "types" for a moment first.
  const toggle = (next: boolean) => {
    if (next) {
      setNudge(false)
      setTyping(true)
    }
    setOpen(next)
  }
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => setTyping(false), 1100)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && toggle(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Always shown. With a WhatsApp number (Site settings in the CMS) messages open WhatsApp;
  // without one they fall back to the quote form on the homepage.
  const digits = (number ?? '').replace(/\D/g, '')
  const send = (msg: string) => {
    const body = msg.trim()
    if (!digits) {
      setOpen(false)
      router.push('/#quote')
      return
    }
    window.open(
      `https://wa.me/${digits}${body ? `?text=${encodeURIComponent(body)}` : ''}`,
      '_blank',
      'noopener',
    )
  }

  return (
    <div className="fixed bottom-8 end-8 z-50 flex flex-col items-end gap-6 md:bottom-10 md:end-10">
      <AnimatePresence>
        {open && (
          <motion.div
            key="card"
            role="dialog"
            aria-label="Chat with Klen Plus on WhatsApp"
            className="w-[min(92vw,360px)] origin-bottom-right overflow-hidden rounded-3xl bg-white text-ink shadow-[0_30px_80px_-20px_rgba(28,42,92,0.55)] ring-1 ring-line"
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-ink px-4 py-3.5 text-white">
              <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-white p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/brand/plus-mark.png"
                  alt=""
                  className="h-full w-full object-contain"
                />
                <span className="absolute -bottom-0.5 -end-0.5 size-3.5 rounded-full bg-leaf ring-2 ring-ink" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-bold leading-tight">Klen Plus</p>
                <p className="text-xs text-white/70">Usually replies within minutes</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(false)}
                aria-label="Close chat"
                className="grid size-8 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Conversation */}
            <div className="flex min-h-[190px] flex-col gap-3 bg-[radial-gradient(rgb(40_58_125/0.07)_1px,transparent_1px)] bg-paper px-4 py-4 [background-size:18px_18px]">
              <AnimatePresence mode="wait" initial={false}>
                {typing ? (
                  <motion.div
                    key="typing"
                    className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm"
                    exit={{ opacity: 0 }}
                  >
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="size-1.5 rounded-full bg-slate"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="hello"
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <p className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm shadow-sm">
                      Hi there 👋 Need packaging, tissue or cleaning supplies?
                    </p>
                    <p className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm shadow-sm">
                      Send us your list and we’ll quote it by the carton. Pick an option or type
                      below.
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {QUICK.map((q, i) => (
                        <motion.button
                          key={q.label}
                          type="button"
                          onClick={() => send(q.text)}
                          className="rounded-full border border-leaf/50 bg-leaf-soft px-3 py-1.5 text-xs font-semibold text-leaf-deep transition hover:bg-leaf hover:text-white"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.15 + i * 0.07,
                            type: 'spring',
                            stiffness: 400,
                            damping: 22,
                          }}
                        >
                          {q.label}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Compose */}
            <form
              className="flex items-end gap-2 border-t border-line bg-white p-3"
              onSubmit={(e) => {
                e.preventDefault()
                send(text || 'Hi Klen Plus,')
                setText('')
              }}
            >
              <label htmlFor="wa-msg" className="sr-only">
                Your message
              </label>
              <textarea
                id="wa-msg"
                ref={input}
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    e.currentTarget.form?.requestSubmit()
                  }
                }}
                placeholder="Type a message…"
                className="max-h-28 min-h-[42px] flex-1 resize-none rounded-2xl border border-line bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-leaf"
              />
              <button
                type="submit"
                aria-label={digits ? 'Send on WhatsApp' : 'Send'}
                className="grid size-[42px] shrink-0 place-items-center rounded-full bg-leaf text-white transition hover:bg-leaf-deep"
              >
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                  <path d="M3 11.5 21 3l-6.5 18-3-7.5L3 11.5Z" fill="currentColor" />
                </svg>
              </button>
            </form>
            <p className="bg-white px-4 pb-3 text-center text-[11px] text-slate">
              {digits ? 'Opens WhatsApp to send your message' : 'Takes you to our quote form'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {nudge && !open && (
            <motion.button
              key="nudge"
              type="button"
              onClick={() => toggle(true)}
              className="rounded-2xl rounded-br-md bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_14px_40px_-12px_rgba(28,42,92,0.5)] ring-1 ring-line"
              initial={{ opacity: 0, x: 16, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              Need supplies? Chat with us
            </motion.button>
          )}
        </AnimatePresence>

        <div className="relative">
          {/* Klen Plus "+" circling the button on a faint dashed orbit */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-4 md:-inset-[18px]"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.6, ease: EASE }}
          >
            <span className="absolute inset-0 rounded-full border border-dashed border-leaf/50" />
            <motion.div
              className="absolute inset-0"
              animate={still ? undefined : { rotate: 360 }}
              transition={{ duration: 7, ease: 'linear', repeat: Infinity }}
            >
              <motion.span
                className="absolute left-1/2 top-0 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white p-1 shadow-[0_6px_16px_-4px_rgba(28,42,92,0.5)] ring-1 ring-leaf/40"
                animate={still ? undefined : { rotate: -360 }}
                transition={{ duration: 7, ease: 'linear', repeat: Infinity }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/brand/plus-mark.png"
                  alt=""
                  className="h-full w-full object-contain"
                />
              </motion.span>
            </motion.div>
          </motion.div>
          <motion.button
            type="button"
            onClick={() => toggle(!open)}
            aria-expanded={open}
            aria-label={open ? 'Close WhatsApp chat' : 'Chat with us on WhatsApp'}
            className="relative grid size-14 place-items-center rounded-full bg-leaf text-white shadow-[0_18px_40px_-10px_rgba(61,166,41,0.75)] transition-colors hover:bg-leaf-deep md:size-16"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
          >
            {/* Soft pulse while closed */}
            {!open && (
              <span
                aria-hidden
                className="absolute inset-0 animate-ping rounded-full bg-leaf/40 [animation-duration:2.4s]"
              />
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'wa'}
                className="relative"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {open ? (
                  <svg viewBox="0 0 16 16" className="size-6" aria-hidden>
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <WaIcon className="size-8" />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
