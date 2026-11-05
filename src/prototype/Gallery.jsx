import {
  AmountOption,
  AmountText,
  AppBar,
  Button,
  Card,
  Icon,
  ListRow,
  Notice,
  TextField,
  Timeline,
} from "../novakit";

/**
 * Component gallery (prototype-only, open with ?gallery).
 * Every component this PR added or changed, in every variant and state,
 * labelled with Figma's variant syntax ("Property=Value") so it can be
 * imported into Figma (e.g. html.to.design) and combined as variants.
 * Property names match CODE_CONNECT.md.
 *
 * Pressed / Focus / Focused are CSS-only states in the product; here they are
 * forced with static classes so they can be captured.
 */

const W = "w-[358px]"; // phone width (390) minus the 16px gutters

function Section({ name, file, children }) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-3 border-b border-neutral-300 pb-2">
        <h2 className="text-title text-neutral-900">{name}</h2>
        <code className="text-caption text-neutral-600">{file}</code>
      </div>
      <div className="flex flex-wrap gap-6 items-start">{children}</div>
    </section>
  );
}

function Spec({ label, children, wide = true }) {
  return (
    <figure className={`space-y-2 ${wide ? W : ""}`}>
      <figcaption className="text-caption font-mono text-neutral-600">{label}</figcaption>
      {children}
    </figure>
  );
}

const SWATCHES = [
  ["neutral/50", "bg-neutral-50", "#FAFAFA"],
  ["neutral/100", "bg-neutral-100", "#F2F2F2"],
  ["neutral/200", "bg-neutral-200", "#ECECEC"],
  ["neutral/300", "bg-neutral-300", "#D9D9D9"],
  ["neutral/500", "bg-neutral-500", "#808080 · restricted"],
  ["neutral/600", "bg-neutral-600", "#666666 · added"],
  ["neutral/700", "bg-neutral-700", "#4D4D4D"],
  ["neutral/900", "bg-neutral-900", "#1A1A1A"],
  ["brand/50", "bg-brand-50", "#EEF2FF"],
  ["brand/100", "bg-brand-100", "#E0E7FF"],
  ["brand", "bg-brand", "#4F46E5"],
  ["brand/pressed", "bg-brand-pressed", "#3730A3"],
  ["accent/50", "bg-accent-50", "#FFF7E6 · attention only"],
  ["accent/600", "bg-accent-600", "#B45309 · attention only"],
  ["success", "bg-success", "#1E9E5A · icons only"],
];

const ICONS = [
  "check", "x", "info", "alert", "chevron-left", "chevron-down", "chevron-right",
  "person", "arrow-up", "arrow-down", "clock", "refresh", "lock",
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-12">
        <header className="space-y-1">
          <h1 className="text-display text-neutral-900">NovaKit Lite: component sheet</h1>
          <p className="text-body text-neutral-700">
            Components added or changed for the salary advance. Labels use Figma variant syntax; property
            names match CODE_CONNECT.md.{" "}
            <a href="./" className="text-brand underline">Back to the prototype</a>
          </p>
        </header>

        {/* ---------------- Tokens ---------------- */}
        <Section name="Color variables" file="tailwind.config.js">
          {SWATCHES.map(([name, cls, hex]) => (
            <figure key={name} className="w-[160px] space-y-1">
              <div className={`h-14 rounded-md border border-neutral-200 ${cls}`} />
              <figcaption className="text-caption font-mono text-neutral-900">{name}</figcaption>
              <div className="text-caption text-neutral-600">{hex}</div>
            </figure>
          ))}
        </Section>

        {/* ---------------- Added ---------------- */}
        <Section name="Notice (added)" file="src/novakit/Notice.jsx">
          <Spec label="Tone=Info, Show body=True">
            <Notice tone="info" title="We've sent these terms to you by SMS">
              Keep it for your records. You can also see them from the advance card on home.
            </Notice>
          </Spec>
          <Spec label="Tone=Attention, Show body=True">
            <Notice tone="attention" title="We couldn't collect your repayment on Tue 1 Dec">
              Your wallet had less than the Rs 10,300 due. Nothing extra has been added.
            </Notice>
          </Spec>
          <Spec label="Tone=Info, Show body=False">
            <Notice tone="info" title="Your new date is 14 Dec 2026" />
          </Spec>
          <Spec label="Tone=Attention, Show body=False">
            <Notice tone="attention" title="Your repayment didn't go through" />
          </Spec>
        </Section>

        <Section name="AmountOption (added)" file="src/novakit/AmountOption.jsx">
          <Spec label="State=Default">
            <AmountOption amount={5000} detail="Fee Rs 150 · you repay Rs 5,150" />
          </Spec>
          <Spec label="State=Selected">
            <AmountOption amount={10000} detail="Fee Rs 300 · you repay Rs 10,300" selected />
          </Spec>
          <Spec label="State=Locked">
            <AmountOption amount={15000} locked lockedReason="Above your current limit" />
          </Spec>
          <Spec label="State=Default, Focus=True">
            <div className="rounded-md ring-2 ring-brand ring-offset-2">
              <AmountOption amount={5000} detail="Fee Rs 150 · you repay Rs 5,150" />
            </div>
          </Spec>
        </Section>

        <Section name="Timeline (added)" file="src/novakit/Timeline.jsx">
          <Spec label="Timeline / Item: Step=Upcoming → Upcoming">
            <Card>
              <Timeline
                items={[
                  { when: "Today", title: "You get", amount: 10000, detail: "Into your NovaPay wallet, straight away" },
                  { when: "Tue 1 Dec · your payday", title: "You repay", amount: 10300, detail: "Taken from your wallet after your salary arrives" },
                ]}
              />
            </Card>
          </Spec>
          <Spec label="Step=Done → Upcoming → Upcoming">
            <Card>
              <Timeline
                items={[
                  { when: "Today", title: "You got", amount: 10000, tone: "done" },
                  { when: "28 Nov", title: "We remind you", detail: "3 days before, by SMS and in the app" },
                  { when: "Tue 1 Dec · your payday", title: "You repay", amount: 10300 },
                ]}
              />
            </Card>
          </Spec>
          <Spec label="Item: Show amount=False, Show detail=False">
            <Card>
              <Timeline items={[{ when: "28 Nov", title: "We remind you" }]} />
            </Card>
          </Spec>
        </Section>

        <Section name="Icon (added)" file="src/novakit/Icon.jsx">
          <figure className="space-y-2">
            <figcaption className="text-caption font-mono text-neutral-600">Name=… , Size=24</figcaption>
            <div className="flex flex-wrap gap-4">
              {ICONS.map((n) => (
                <div key={n} className="w-[96px] flex flex-col items-center gap-2 rounded-md border border-neutral-200 p-3">
                  <Icon name={n} size={24} className="text-neutral-900" />
                  <span className="text-caption font-mono text-neutral-600">{n}</span>
                </div>
              ))}
            </div>
          </figure>
          <figure className="space-y-2">
            <figcaption className="text-caption font-mono text-neutral-600">Name=check, Size=…</figcaption>
            <div className="flex items-end gap-4">
              {[14, 16, 18, 20, 24, 28].map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <Icon name="check" size={s} className="text-neutral-900" />
                  <span className="text-caption font-mono text-neutral-600">{s}</span>
                </div>
              ))}
            </div>
          </figure>
        </Section>

        {/* ---------------- Changed ---------------- */}
        <Section name="Button (changed)" file="src/novakit/Button.jsx">
          {[
            ["Default", {}],
            ["Pressed", { cls: { primary: "!bg-brand-pressed", secondary: "!bg-neutral-100" } }],
            ["Focus", { cls: { primary: "ring-2 ring-brand ring-offset-2", secondary: "ring-2 ring-brand ring-offset-2" } }],
            ["Disabled", { disabled: true }],
            ["Loading", { loading: true }],
          ].map(([state, o]) =>
            ["primary", "secondary"].map((variant) => (
              <Spec key={state + variant} label={`Variant=${variant === "primary" ? "Primary" : "Secondary"}, Size=md, State=${state}`}>
                <Button
                  variant={variant}
                  disabled={o.disabled}
                  loading={o.loading}
                  className={o.cls ? o.cls[variant] : ""}
                >
                  {o.loading ? "Sending…" : variant === "primary" ? "Accept and get Rs 10,000" : "Not now"}
                </Button>
              </Spec>
            ))
          )}
          <Spec label="Variant=Primary, Size=lg, State=Default">
            <Button size="lg">Accept and get Rs 10,000</Button>
          </Spec>
          <Spec label="Variant=Secondary, Size=lg, State=Default">
            <Button size="lg" variant="secondary">Not now</Button>
          </Spec>
        </Section>

        <Section name="TextField (changed)" file="src/novakit/TextField.jsx">
          <Spec label="State=Default, Show label=True, Show prefix=True, Show helper=True">
            <TextField label="Or enter an amount" prefix="Rs" placeholder="0" helper="Up to Rs 6,200" value="" onChange={() => {}} />
          </Spec>
          <Spec label="State=Focused">
            <TextField
              label="Or enter an amount"
              prefix="Rs"
              value="3000"
              onChange={() => {}}
              helper="Up to Rs 6,200"
              className="[&>div]:border-brand [&>div]:ring-2 [&>div]:ring-brand/30"
            />
          </Spec>
          <Spec label="State=Invalid">
            <TextField
              label="Or enter an amount"
              prefix="Rs"
              value="8000"
              onChange={() => {}}
              invalid
              helper="That's more than the Rs 6,200 in your wallet."
            />
          </Spec>
          <Spec label="State=Disabled">
            <TextField label="Or enter an amount" prefix="Rs" value="" placeholder="0" onChange={() => {}} disabled helper="Up to Rs 6,200" />
          </Spec>
          <Spec label="State=Default, Show label=False, Show prefix=False, Show helper=False">
            <TextField placeholder="Placeholder" value="" onChange={() => {}} />
          </Spec>
        </Section>

        <Section name="ListRow (changed)" file="src/novakit/ListRow.jsx">
          <Spec label="Wrap=False, Show icon=True">
            <Card className="py-1">
              <ListRow
                icon={<Icon name="arrow-down" size={18} />}
                title="Salary credited"
                subtitle="28 Jun"
                trailing={<AmountText amount={68000} size="body" />}
              />
            </Card>
          </Spec>
          <Spec label="Wrap=True, Show icon=False">
            <Card className="py-1">
              <ListRow
                wrap
                title="Fee"
                subtitle="What this advance costs you. Charged once: 3% of the amount."
                trailing={<AmountText amount={300} size="body" />}
              />
            </Card>
          </Spec>
        </Section>

        <Section name="AmountText (changed)" file="src/novakit/AmountText.jsx">
          {["display", "title", "body"].map((size) =>
            ["default", "muted"].map((tone) => (
              <Spec key={size + tone} wide={false} label={`Size=${size[0].toUpperCase() + size.slice(1)}, Tone=${tone[0].toUpperCase() + tone.slice(1)}`}>
                <div className="w-[220px]">
                  <AmountText amount={10300} size={size} tone={tone} />
                </div>
              </Spec>
            ))
          )}
        </Section>

        <Section name="AppBar (changed)" file="src/novakit/AppBar.jsx">
          <Spec label="Show back=True">
            <div className="border border-neutral-200 rounded-md overflow-hidden">
              <AppBar title="Review your advance" onBack={() => {}} />
            </div>
          </Spec>
          <Spec label="Show back=False">
            <div className="border border-neutral-200 rounded-md overflow-hidden">
              <AppBar title="NovaPay" />
            </div>
          </Spec>
        </Section>
      </div>
    </div>
  );
}
