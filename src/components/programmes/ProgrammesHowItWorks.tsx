'use client'

const STEPS = [
  {
    title: 'Choose a programme',
    body: 'Pick the path that matches your experience level and the kind of stories you want to tell.',
    accent: 'bg-maroon',
  },
  {
    title: 'Apply & onboard',
    body: 'Submit a short application. Most programmes respond within two weeks with next steps.',
    accent: 'bg-forest',
  },
  {
    title: 'Publish & grow',
    body: 'Work with an editor to publish your first piece and build your portfolio on EcoDiaries.',
    accent: 'bg-teal',
  },
] as const

export function ProgrammesHowItWorks() {
  return (
    <section className="programmes-how-it-works section on-paper" id="how-it-works">
      <div className="wrap">
        <h2 className="programmes-how-it-works__title">How it works</h2>

        <div className="programmes-steps-rail" aria-hidden>
          {STEPS.map((step, index) => (
            <div key={step.title} className="programmes-steps-rail__segment">
              <div className="programmes-steps-rail__node">
                <span>{index + 1}</span>
              </div>
              {index < STEPS.length - 1 ? <div className="programmes-steps-rail__connector" /> : null}
            </div>
          ))}
        </div>

        <div
          className="programmes-steps-carousel scroll-edge-fade scrollbar-hide"
          role="list"
          aria-label="How it works steps"
        >
          {STEPS.map((step, index) => (
            <article
              key={step.title}
              className={`programme-step-card programmes-step-card ${step.accent}`}
              role="listitem"
              aria-label={`Step ${index + 1}: ${step.title}`}
            >
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
