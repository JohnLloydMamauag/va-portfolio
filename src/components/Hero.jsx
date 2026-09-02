import { useEffect, useRef } from 'react'
import Reveal from './Reveal'
import MagneticButton from './MagneticButton'
import ToolMarquee from './ToolMarquee'

const STRENGTHS = [
  'Detail-oriented & highly organized',
  'Fast learner, quick with new tools',
  'Clear, proactive communication',
  'Fully committed to every task',
]

const TAGS = ['Inbox Zero', 'Scheduling', 'Research', 'Social']

export default function Hero() {
  const titleRef = useRef(null)

  useEffect(() => {
    // Above-the-fold headline reveals on load rather than on scroll.
    titleRef.current?.classList.add('in-view')
  }, [])

  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <Reveal as="p" className="eyebrow">
            Virtual Assistant &amp; Freelancer
          </Reveal>
          <h1 className="hero-title" ref={titleRef}>
            <span className="reveal-line">
              <span>I bring order</span>
            </span>
            <span className="reveal-line">
              <span>
                to your <em>busy</em>
              </span>
            </span>
            <span className="reveal-line">
              <span>workday.</span>
            </span>
          </h1>
          <Reveal as="p" className="hero-sub">
            Calm, capable admin support for founders and small teams — inbox, calendar, research,
            and the everyday tasks that quietly keep a business running.
          </Reveal>
          <Reveal as="div" className="hero-actions">
            <MagneticButton as="a" href="#contact" className="btn btn-primary">
              <span>Start a Project</span>
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
            <MagneticButton as="a" href="#work" className="btn btn-ghost">
              View Work
            </MagneticButton>
          </Reveal>
        </div>

        <Reveal as="div" className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-glow"></div>
            <p className="hero-card-title">What I bring to the table</p>
            <ul className="hero-strengths">
              {STRENGTHS.map((item) => (
                <li key={item}>
                  <span className="check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="hero-tags">
              {TAGS.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <ToolMarquee />
    </section>
  )
}
