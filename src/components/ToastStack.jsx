export default function ToastStack({ alerts }) {
  if (!alerts.length) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[340px] flex-col gap-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="rounded-2xl border border-critical/30 bg-navy/95 p-4 shadow-card backdrop-blur"
        >
          <p className="text-sm font-semibold text-critical">{alert.severity} alert</p>
          <p className="mt-1 text-sm text-white">
            {alert.patientName}
            {alert.room ? <span className="text-slate-500"> | {alert.room}</span> : null}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{alert.issue}</p>
        </div>
      ))}
    </div>
  );
}
