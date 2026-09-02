# Project: VA Portfolio Website

A simple portfolio website for an aspiring Virtual Assistant / Freelancer. The goal is to showcase services, skills, and contact info to attract potential clients.

## Design system

- **Font:** Poppins (Google Fonts)
- **Colors:**
  - Orange — accent / call-to-action color
  - Navy blue — primary text / headings / contrast elements
  - Cream beige — background color

Keep the palette limited to these three colors (plus white/black only if needed for contrast). Avoid introducing new colors or fonts without checking with the user first.

## Tech approach

- Keep it simple: plain HTML/CSS/JS unless the user asks for a framework.
- Static site — should be easy to preview locally (just open the HTML file or use a lightweight dev server) and easy to deploy (e.g. GitHub Pages, Netlify).
- Mobile-responsive by default.

## Content tone

- Professional but approachable — this represents the user as a freelancer pitching to potential clients.
- Keep copy concise; avoid filler text in final content (placeholder/lorem ipsum is fine during layout work only).
- The user (John) is genuinely just starting his freelance journey with no client history yet. Never fabricate experience, stats, or testimonials (e.g. years of experience, task counts, case-study results, quotes from fictional clients) to make him look more established than he is. Frame capability honestly: tools known, effort, availability, sample/practice work — not invented track record.

## Deployment

- Repo: `github.com/JohnLloydMamauag/va-portfolio` (public, `main` branch), connected to two auto-deploying targets:
  - GitHub Pages: `johnlloydmamauag.github.io/va-portfolio`
  - Vercel: `va-portfolio-orpin.vercel.app`
- Default to committing and pushing to `main` after making changes, without asking each time — both deployments pick it up automatically.
