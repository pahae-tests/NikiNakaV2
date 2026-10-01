export default function StatCard({ label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-[#14101E]/80 p-5 shadow-xl">
    <div className="text-sm text-gray-400">{label}</div>
    <div className="mt-2 text-3xl font-bold">{value}</div>
  </div>
}