import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-wrap">
          <a href="#home" className="logo">
            John<span className="dot">.</span>
          </a>
          <nav className={`nav-links ${navOpen ? 'open' : ''}`}>
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setNavOpen(false)}>
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className={`btn btn-primary btn-small nav-cta ${navOpen ? 'open' : ''}`}
            onClick={() => setNavOpen(false)}
          >
            Let's Talk
          </a>
          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            onClick={() => setNavOpen((v) => !v)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
    </>
  )
}
