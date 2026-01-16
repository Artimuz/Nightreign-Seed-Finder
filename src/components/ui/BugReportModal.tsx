"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import DecoratedModal from "./DecoratedModal"

interface BugReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitted?: () => void
  borderHueRotate?: number
}

function useValidation() {
  const emailRegex = useMemo(() => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, [])
  const sanitize = useCallback(
    (s: string, max: number) => s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").slice(0, max).trim(),
    []
  )

  const validate = useCallback(
    (values: { name: string; email: string; subject: string; message: string }) => {
      const name = sanitize(values.name, 50)
      const email = sanitize(values.email, 50)
      const subject = sanitize(values.subject, 100)
      const message = sanitize(values.message, 1000)
      const errors: Record<string, string> = {}
      if (email && !emailRegex.test(email)) errors.email = "Invalid email"
      if (!message) errors.message = "Message is required"
      return { name, email, subject, message, errors }
    },
    [emailRegex, sanitize]
  )

  return { validate }
}

export default function BugReportModal({ isOpen, onClose, onSubmitted, borderHueRotate = 0 }: BugReportModalProps) {
  const { validate } = useValidation()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const reset = useCallback(() => {
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
    setErrors({})
    setSubmitting(false)
    setSuccess(false)
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "Escape") onClose()
    },
    [isOpen, onClose]
  )

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
      const el = document.querySelector('[data-focus-trap]') as HTMLElement | null
      if (el) el.focus()
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, handleKeyDown])

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false)
      return
    }

    const id = window.setTimeout(() => setIsVisible(true), 0)
    return () => window.clearTimeout(id)
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const v = validate({ name, email, subject, message })
    setErrors(v.errors)
    if (Object.keys(v.errors).length > 0) return

    setSubmitting(true)
    try {
      const userUrl = typeof window !== "undefined" ? window.location.href : undefined
      const res = await fetch("/api/report-bug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: v.name, email: v.email, subject: v.subject, message: v.message, userUrl }),
      })

      if (!res.ok) throw new Error("request_failed")

      setSuccess(true)
      setTimeout(() => {
        if (onSubmitted) onSubmitted()
        onClose()
        reset()
      }, 2000)
    } catch {
      setErrors({ form: "Something went wrong. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  const overlay = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />
      <div className="relative py-8">
        <DecoratedModal className="w-full max-w-xl mx-4" hueRotate={borderHueRotate}>
          <div
            className={`rounded-lg shadow-2xl flex flex-col bg-black/95 backdrop-blur-md border border-gray-600/50 transition-all duration-200 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-[0.98]"}`}
            data-focus-trap
            tabIndex={-1}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-600/50 bg-black/80">
              <h2 className="text-lg font-semibold text-white">Report a Bug, leave a massage or a suggestion.</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-xl p-2 hover:bg-gray-600 rounded transition-colors"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {success ? (
              <div className="p-10 flex flex-col items-center text-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" className="text-green-400" fill="currentColor">
                  <path d="M9 16.17l-3.88-3.88a1 1 0 10-1.41 1.41l4.59 4.59a1 1 0 001.41 0l10-10a1 1 0 10-1.41-1.41L9 16.17z" />
                </svg>
                <h3 className="text-white text-lg font-semibold">Thank you!</h3>
                <p className="text-gray-300 text-sm">Your massage was sent successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {errors.form ? <div className="text-red-400 text-sm">{errors.form}</div> : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1" htmlFor="br-name">
                      Name (optional)
                    </label>
                    <input
                      id="br-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={50}
                      className="w-full rounded-md bg-gray-900/50 border border-gray-600/50 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1" htmlFor="br-email">
                      Email (optional)
                    </label>
                    <input
                      id="br-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={50}
                      className="w-full rounded-md bg-gray-900/50 border border-gray-600/50 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-500"
                    />
                    {errors.email ? <div className="text-red-400 text-xs mt-1">{errors.email}</div> : null}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1" htmlFor="br-subject">
                    Subject (optional)
                  </label>
                  <input
                    id="br-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    maxLength={100}
                    className="w-full rounded-md bg-gray-900/50 border border-gray-600/50 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1" htmlFor="br-message">
                    Message
                  </label>
                  <textarea
                    id="br-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={1000}
                    required
                    rows={6}
                    className="w-full rounded-md bg-gray-900/50 border border-gray-600/50 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-500"
                  />
                  <div className="mt-1 text-right text-xs text-gray-400">{message.length}/1000</div>
                  {errors.message ? <div className="text-red-400 text-xs mt-1">{errors.message}</div> : null}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded bg-gray-700/70 text-white border border-gray-500/50 hover:bg-gray-600/70 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white border border-blue-500 hover:bg-blue-500 transition-colors disabled:opacity-60"
                    disabled={submitting}
                  >
                    {success ? "Sent" : submitting ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </DecoratedModal>
      </div>
    </div>
  )

  if (typeof window === "undefined") return overlay
  return createPortal(overlay, document.body)
}
