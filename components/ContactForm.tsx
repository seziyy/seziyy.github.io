'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, User, MessageSquare } from 'lucide-react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Placeholder submit flow until API integration is added
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Your message has been sent. I will get back to you as soon as possible.')
    setFormData({ name: '', email: '', message: '' })
    setIsSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-2xl"
    >
      <div className="card p-8">
        <h3 className="text-2xl font-display mb-6">Get in Touch</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center space-x-2 text-[color:var(--muted)] text-sm mb-2">
              <User size={16} />
              <span>Name</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg text-[color:var(--ink)] placeholder-[color:var(--muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] transition-all"
              placeholder="Your name..."
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-[color:var(--muted)] text-sm mb-2">
              <Mail size={16} />
              <span>Email</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg text-[color:var(--ink)] placeholder-[color:var(--muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] transition-all"
              placeholder="Your email address..."
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-[color:var(--muted)] text-sm mb-2">
              <MessageSquare size={16} />
              <span>Message</span>
            </label>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg text-[color:var(--ink)] placeholder-[color:var(--muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] transition-all resize-none"
              placeholder="Your message..."
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[color:var(--accent)] text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-[color:var(--accent-strong)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
            <Send size={18} />
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}
