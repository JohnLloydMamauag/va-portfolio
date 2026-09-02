import Reveal from './Reveal'

const PROJECTS = [
  {
    thumbClass: 'thumb-1',
    tag: 'Admin',
    title: 'Inbox System Mockup',
    desc: 'Designed a Gmail label & filter system for a sample inbox, built to keep any inbox at zero with minimal upkeep.',
  },
  {
    thumbClass: 'thumb-2',
    tag: 'Social',
    title: 'Content Calendar Template',
    desc: 'Put together a 30-day content calendar template covering planning, captions, and posting schedule.',
  },
  {
    thumbClass: 'thumb-3',
    tag: 'Research',
    title: 'Practice Research Report',
    desc: 'A sample market-scan report showing how I structure findings into a clean, skimmable summary.',
  },
]

export default function Work() {
  return (
    <section id="work" className="section work">
      <div className="container">
        <Reveal as="div" className="section-head">
          <p className="eyebrow">Sample Work</p>
          <h2>What I can do, in practice.</h2>
          <p className="section-lead">
            I'm early in my freelance journey, so here are practice projects I built to show how
            I work rather than client case studies.
          </p>
        </Reveal>
        <div className="work-grid">
          {PROJECTS.map((project) => (
            <Reveal as="article" className="work-card" key={project.title}>
              <div className={`work-thumb ${project.thumbClass}`}>
                <span className="work-tag">{project.tag}</span>
              </div>
              <div className="work-info">
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
