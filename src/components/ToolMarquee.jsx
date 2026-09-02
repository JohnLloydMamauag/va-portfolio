const TOOLS = [
  { icon: 'gmail.svg', name: 'Gmail' },
  { icon: 'google-calendar.svg', name: 'Google Calendar' },
  { icon: 'calendly.svg', name: 'Calendly' },
  { icon: 'notion.svg', name: 'Notion' },
  { icon: 'google-sheets.svg', name: 'Google Sheets' },
  { icon: 'trello.svg', name: 'Trello' },
  { icon: 'asana.svg', name: 'Asana' },
  { icon: 'zoom.svg', name: 'Zoom' },
  { icon: 'google-meet.svg', name: 'Google Meet' },
  { icon: 'buffer.svg', name: 'Buffer' },
  { icon: 'meta.svg', name: 'Meta' },
  { icon: 'airtable.svg', name: 'Airtable' },
  { icon: 'ghl.svg', name: 'GoHighLevel' },
]

function ToolPill({ icon, name, hidden }) {
  return (
    <div className="tool-pill" aria-hidden={hidden || undefined}>
      <div className="icon-chip">
        <img src={`/assets/icons/${icon}`} alt="" width="18" height="18" />
      </div>
      <span>{name}</span>
    </div>
  )
}

export default function ToolMarquee() {
  return (
    <div className="tool-marquee">
      <p className="tool-marquee-label">Tools I work in daily</p>
      <div className="marquee">
        <div className="marquee-track">
          {TOOLS.map((tool) => (
            <ToolPill key={tool.name} {...tool} />
          ))}
          {TOOLS.map((tool) => (
            <ToolPill key={`${tool.name}-dup`} {...tool} hidden />
          ))}
        </div>
      </div>
    </div>
  )
}
