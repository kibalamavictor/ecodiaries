const STEPS = [
  {
    title: '1. Choose a programme',
    body: 'Pick the path that matches your experience level and the kind of stories you want to tell.',
    accent: 'bg-maroon',
  },
  {
    title: '2. Apply & onboard',
    body: 'Submit a short application. Most programmes respond within two weeks with next steps.',
    accent: 'bg-forest',
  },
  {
    title: '3. Publish & grow',
    body: 'Work with an editor to publish your first piece and build your portfolio on EcoDiaries.',
    accent: 'bg-teal',
  },
] as const

export function ProgrammesHowItWorksDesktop() {
  return (
    <section className="section on-paper" id="how-it-works">
      <div className="wrap">
        <h2>How it works</h2>
        <div className="card-grid grid-3 mt-32">
          {STEPS.map((step) => (
            <div key={step.title} className={`programme-step-card ${step.accent}`}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
