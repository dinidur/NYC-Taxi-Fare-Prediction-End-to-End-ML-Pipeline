const STEPS = [
  {
    title: 'Request',
    body: 'Twenty-four raw fields arrive as JSON and become a single-row pandas DataFrame.',
    code: 'pd.DataFrame([data])',
  },
  {
    title: 'Binary mapping',
    body: 'The store-and-forward flag collapses from Y/N to 1/0, with an unknown value defaulting to 0.',
    code: "map({'N': 0, 'Y': 1})",
  },
  {
    title: 'One-hot encoding',
    body: 'Seven categorical columns expand into thirty-three indicator columns using the encoder fitted at training time.',
    code: 'encoder.transform(...)',
  },
  {
    title: 'Alignment',
    body: 'Any column the model expects but the request did not supply is filled with zero, then the frame is reordered to the exact training column order.',
    code: 'df_final[feature_names]',
  },
  {
    title: 'Scaling',
    body: 'The fifty aligned columns pass through the StandardScaler that was fitted on the training split.',
    code: 'scaler.transform(...)',
  },
  {
    title: 'Inference',
    body: 'A dense Keras regressor maps the scaled vector to one scalar: the expected base fare in dollars.',
    code: 'model.predict(x)[0][0]',
  },
]

export default function HowItWorks() {
  return (
    <section id="pipeline" className="border-t border-line bg-surface-0">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="label-xs">Request pipeline</p>
          <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-[-0.02em]">
            From JSON to dollars in six steps
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-fg-2">
            The serving path reproduces the training preprocessing exactly. Any
            divergence between the two — a different column order, a skipped
            scaler, an unseen category — produces a confident number that is
            quietly wrong.
          </p>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="bg-surface-1 p-6">
              <span className="tnum text-[13px] font-semibold text-signal">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-[15px] font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-fg-2">
                {s.body}
              </p>
              <code className="mt-4 block overflow-x-auto rounded-md border border-line bg-surface-2 px-3 py-2 font-mono text-[12px] text-fg-3">
                {s.code}
              </code>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
