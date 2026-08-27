export function ProgrammesPageHowItWorks() {
  return (
    <section className="mag-section" id="how-it-works">
      <div className="mag-wrap mag-two">
        <div>
          <p className="mag-news__eyebrow">How it works</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', maxWidth: '12ch' }}>
            Three steps from application to byline
          </h2>
        </div>
        <div className="mag-faq">
          <div className="mag-faq__item">
            <h3>01 — Choose a programme</h3>
            <p className="mag-excerpt mag-excerpt--full">
              Pick the path that matches your experience level and the kind of stories you want to tell.
            </p>
          </div>
          <div className="mag-faq__item">
            <h3>02 — Apply and onboard</h3>
            <p className="mag-excerpt mag-excerpt--full">
              Submit a short application. Most programmes respond within two weeks with next steps.
            </p>
          </div>
          <div className="mag-faq__item">
            <h3>03 — Publish and grow</h3>
            <p className="mag-excerpt mag-excerpt--full">
              Work with an editor to publish your first piece and build your portfolio on EcoDiaries.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
