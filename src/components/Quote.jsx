import Reveal from './Reveal'

export default function Quote() {
  return (
    <section className="section quote">
      <div className="container">
        <Reveal as="p" className="quote-mark">
          "
        </Reveal>
        <Reveal as="p" className="quote-text">
          I believe great support isn't about years on the job, it's about showing up, paying
          attention, and never dropping the ball.
        </Reveal>
        <Reveal as="p" className="quote-author">
          — John Lloyd, on how he works
        </Reveal>
      </div>
    </section>
  )
}
