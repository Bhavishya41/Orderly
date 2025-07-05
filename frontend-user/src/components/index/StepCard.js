export default function StepCard({ step, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center max-w-xs">
      <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-xl font-bold text-white mb-4">
        {step}
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-white/70 text-sm">{desc}</p>
    </div>
  );
}
