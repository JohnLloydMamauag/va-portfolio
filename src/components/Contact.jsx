import Reveal from './Reveal'
import MagneticButton from './MagneticButton'

export default function Contact() {
  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <section id="contact" className="section contact">
      <div className="container contact-grid">
        <Reveal as="div" className="contact-info">
          <p className="eyebrow">Get In Touch</p>
          <h2>Let's clear your plate.</h2>
          <p>
            Have a task you'd like to hand off? Tell me a bit about it and I'll get back to you
            within a day.
          </p>
          <ul className="contact-details">
            <li>
              <span>Email</span>john.lloyd@example.com
            </li>
            <li>
              <span>LinkedIn</span>linkedin.com/in/johnlloyd
            </li>
          </ul>
        </Reveal>
        <Reveal as="form" className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Your name" required />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="you@example.com" required />
          </div>
          <div className="form-row">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Tell me a bit about what you need help with..."
              required
            ></textarea>
          </div>
          <MagneticButton as="button" type="submit" className="btn btn-primary">
            <span>Send Message</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  )
}
