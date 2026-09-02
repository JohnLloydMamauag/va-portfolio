import Reveal from './Reveal'

const STATS = [
  { value: '15+', label: 'Tools I already know' },
  { value: 'Same-day', label: 'Replies during business hours' },
  { value: '100%', label: 'Focus on getting it right' },
]

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container about-grid">
        <Reveal as="div" className="about-visual">
          <div className="about-image">
            <img src="/assets/pray.jpg" alt="John Lloyd" />
          </div>
          <div className="about-badge">
            <strong>New</strong>
            <span>but fully committed to doing it right</span>
          </div>
        </Reveal>
        <div className="about-text">
          <Reveal as="p" className="eyebrow">
            About Me
          </Reveal>
          <Reveal as="h2">
            Hi, I'm John Lloyd, <br />
            your extra pair of hands.
          </Reveal>
          <Reveal as="p">
            I'm an aspiring Virtual Assistant just starting my freelance journey. I've always been
            the organized one, the person who color-codes the calendar and actually reads the
            whole email thread before replying.
          </Reveal>
          <Reveal as="p">
            What I might lack in years, I make up for in attention to detail, quick learning, and
            showing up reliably. I treat every task like it matters, because to you, it does.
          </Reveal>
          <Reveal as="div" className="about-stats">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
