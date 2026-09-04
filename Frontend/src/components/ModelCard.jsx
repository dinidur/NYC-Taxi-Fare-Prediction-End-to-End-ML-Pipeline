import { EVALUATION, FEATURE_GROUPS } from '../constants.js'
import { IconGrid, IconLayers, IconTerminal } from './Icons.jsx'

const ARTIFACTS = [
  { name: 'fare_model.keras', role: 'Trained dense regressor' },
  { name: 'scaler.pkl', role: 'StandardScaler fitted on the training split' },
  { name: 'onehot_encoder.pkl', role: 'OneHotEncoder, handle_unknown="ignore"' },
  { name: 'feature_names.pkl', role: 'Canonical order of the 50 columns' },
]

const STACK = [
  ['TensorFlow', '2.19'],
  ['scikit-learn', '1.6.1'],
  ['Flask', '3.1'],
  ['React', '19'],
  ['Tailwind CSS', '4'],
  ['Vite', '7'],
]

export default function ModelCard() {
  return (
    <section id="model" className="border-t border-line bg-surface-0">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="label-xs">Model card</p>
          <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-[-0.02em]">
            What the network actually sees
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-fg-2">
            Fifty columns after encoding, grouped by what they describe.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Feature groups */}
          <div className="rounded-[14px] border border-line bg-surface-1 p-6 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <IconGrid className="h-[18px] w-[18px] text-signal" />
              <h3 className="text-[15px] font-semibold tracking-tight">
                Feature groups
              </h3>
            </div>

            <ul className="mt-5 divide-y divide-line">
              {FEATURE_GROUPS.map((g) => (
                <li
                  key={g.name}
                  className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-fg">{g.name}</p>
                    <p className="mt-1 break-words font-mono text-[12px] leading-relaxed text-fg-3">
                      {g.items.join(' · ')}
                    </p>
                  </div>
                  <span className="tnum shrink-0 rounded-md border border-line bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-fg-2">
                    {g.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            {/* Evaluation */}
            <div className="rounded-[14px] border border-line bg-surface-1 p-6">
              <div className="flex items-center gap-2.5">
                <IconLayers className="h-[18px] w-[18px] text-signal" />
                <h3 className="text-[15px] font-semibold tracking-tight">
                  Evaluation
                </h3>
              </div>
              <dl className="mt-5 space-y-4">
                {EVALUATION.map((m) => (
                  <div key={m.key}>
                    <dt className="text-[13px] text-fg-3">{m.label}</dt>
                    <dd className="mt-1">
                      {m.value === null ? (
                        <span className="text-[13px] italic text-fg-3">
                          not measured yet
                        </span>
                      ) : (
                        <span className="tnum text-xl font-semibold text-fg">
                          {m.value}
                          {m.unit && (
                            <span className="ml-1 text-[13px] font-normal text-fg-3">
                              {m.unit}
                            </span>
                          )}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 border-t border-line pt-4 text-[12px] leading-relaxed text-fg-3">
                Add your held-out scores in{' '}
                <code className="font-mono text-fg-2">src/constants.js</code>.
                Placeholder metrics on a public page are worse than none.
              </p>
            </div>

            {/* Artifacts */}
            <div className="rounded-[14px] border border-line bg-surface-1 p-6">
              <div className="flex items-center gap-2.5">
                <IconTerminal className="h-[18px] w-[18px] text-signal" />
                <h3 className="text-[15px] font-semibold tracking-tight">
                  Served artefacts
                </h3>
              </div>
              <ul className="mt-5 space-y-3.5">
                {ARTIFACTS.map((a) => (
                  <li key={a.name}>
                    <p className="break-all font-mono text-[12.5px] text-fg">
                      {a.name}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-fg-3">
                      {a.role}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Stack */}
        <div className="mt-6 rounded-[14px] border border-line bg-surface-1 p-6">
          <h3 className="label-xs">Stack</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {STACK.map(([name, version]) => (
              <li
                key={name}
                className="rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-[13px] text-fg-2"
              >
                {name}{' '}
                <span className="tnum ml-1 text-fg-3">{version}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
