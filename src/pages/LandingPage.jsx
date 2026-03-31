import { Activity, ArrowRight, BellRing, ChartLine, ShieldPlus } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Activity,
    title: "Continuous telemetry",
    text: "Monitor heart rate, oxygen saturation, and temperature with live simulated bedside updates."
  },
  {
    icon: BellRing,
    title: "Early warning alerts",
    text: "Escalate clinically relevant deviations using simple, transparent threshold-based logic."
  },
  {
    icon: ChartLine,
    title: "Trend visibility",
    text: "Review recent telemetry curves and 72-hour recovery outlooks for each patient."
  },
  {
    icon: ShieldPlus,
    title: "Care team clarity",
    text: "Surface patient status, risk signals, and alert history in a focused monitoring workspace."
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="glass-panel overflow-hidden px-8 py-10 md:px-12 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-teal">RecoverAI</p>
              <h1 className="mt-5 max-w-3xl font-['Poppins'] text-4xl font-semibold leading-tight text-white md:text-6xl">
                Smarter recovery monitoring after surgery
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                RecoverAI helps care teams spot changes in post-operative vitals early with
                realistic live monitoring, transparent alerts, and patient-centric trend views.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl bg-teal px-6 py-3 font-medium text-navy transition hover:brightness-110"
                >
                  View Dashboard <ArrowRight size={18} />
                </Link>
                <a
                  href="#solution"
                  className="inline-flex items-center rounded-2xl border border-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/5"
                >
                  Explore Solution
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
              <div className="grid gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Problem</p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    Post-surgery changes can be subtle before they become urgent.
                  </p>
                </div>
                <div id="solution" className="rounded-3xl border border-teal/20 bg-teal/10 p-5">
                  <p className="text-sm text-teal">Solution</p>
                  <p className="mt-3 text-base leading-7 text-slate-100">
                    RecoverAI brings live telemetry, recent alert context, and simple watch rules into one
                    dashboard so clinicians can identify concerning trends without noise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="glass-panel p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/15 text-teal">
                <feature.icon size={22} />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-white">{feature.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{feature.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
