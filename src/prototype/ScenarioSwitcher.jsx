/**
 * Prototype-only control (not part of NovaKit or the product).
 * Lets reviewers jump between backend outcomes without fake accounts.
 */
export default function ScenarioSwitcher({ scenarios, value, onChange, onReset }) {
  return (
    <aside className="w-full max-w-[390px] lg:w-72 shrink-0 bg-white rounded-lg border border-neutral-300 p-4 space-y-3">
      <div>
        <div className="text-body font-semibold text-neutral-900">Prototype scenario</div>
        <p className="text-caption text-neutral-600">
          Simulates what NovaPay's checks return. Changing it restarts the flow from home.
        </p>
      </div>
      {[...new Set(scenarios.map((s) => s.group))].map((group) => (
      <fieldset key={group} className="space-y-2">
        <legend className="text-caption font-semibold text-neutral-600 uppercase tracking-wide mb-1">{group}</legend>
        {scenarios.filter((s) => s.group === group).map((s) => (
          <label
            key={s.id}
            className={`flex gap-2 rounded-md border p-2 cursor-pointer ${
              value === s.id ? "border-brand bg-brand-50" : "border-neutral-200"
            }`}
          >
            <input
              type="radio"
              name="scenario"
              value={s.id}
              checked={value === s.id}
              onChange={() => onChange(s.id)}
              className="mt-1 accent-brand"
            />
            <span>
              <span className="block text-body text-neutral-900">{s.label}</span>
              <span className="block text-caption text-neutral-600">{s.description}</span>
            </span>
          </label>
        ))}
      </fieldset>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="text-body font-semibold text-brand underline underline-offset-2"
      >
        Restart from home
      </button>
    </aside>
  );
}
