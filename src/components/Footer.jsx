export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <a href="#home" className="logo">
          John<span className="dot">.</span>
        </a>
        <p>&copy; {new Date().getFullYear()} John Lloyd. All rights reserved.</p>
        <div className="footer-links">
          <a href="#home">Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}
