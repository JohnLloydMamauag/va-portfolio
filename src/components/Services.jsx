import Reveal from './Reveal'

const SERVICES = [
  {
    num: '01',
    title: 'Email & Calendar Management',
    desc: 'Inbox triage, response drafting, and scheduling so nothing important gets buried.',
    tags: ['Gmail', 'Outlook', 'Calendly'],
  },
  {
    num: '02',
    title: 'Administrative Support',
    desc: 'Data entry, document prep, file organization, and the recurring tasks that eat your day.',
    tags: ['Docs', 'Sheets', 'Notion'],
  },
  {
    num: '03',
    title: 'Social Media Assistance',
    desc: 'Content scheduling, light graphics, and community replies to keep your presence active.',
    tags: ['Canva', 'Meta', 'Buffer'],
  },
  {
    num: '04',
    title: 'Research & Reporting',
    desc: 'Market research, competitor scans, and clean, skimmable summary reports.',
    tags: ['Sheets', 'Slides', 'Web'],
  },
]

export default function Services() {
  return (
    <section id="services" className="section services">
      <div className="container">
        <Reveal as="div" className="section-head">
          <p className="eyebrow">What I Offer</p>
          <h2>Services built around your calendar, not mine.</h2>
        </Reveal>
        <div className="service-list">
          {SERVICES.map((service) => (
            <Reveal as="div" className="service-row" key={service.num}>
              <span className="service-num">{service.num}</span>
              <div className="service-body">
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
              <div className="service-tags">
                {service.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
