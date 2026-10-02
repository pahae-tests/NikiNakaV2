import { useEffect, useState } from "react"
import Link from "next/link"
import Layout from "../components/Layout"
import StatCard from "../components/StatCard"

export default function Home() {
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  async function load() {
    const res = await fetch("/api/matches")
    setData(await res.json())
  }
  useEffect(()=>{load()},[])

  if (!data) return <Layout><div className="animate-pulse text-gray-400">جاري تحميل المباريات...</div></Layout>

  const matches = data.matches.filter(m => {
    const f = filter === "all" || m.result === filter
    return f && m.opponentName.toLowerCase().includes(search.toLowerCase())
  })

  return <Layout>
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div><div className="mb-2 text-sm text-violet-400">لوحة التحكم</div><h1 className="text-4xl font-black">فريق النيكي ناكا لي جا يتناكا</h1><p className="mt-2 text-gray-400">إدارة المباريات واللاعبين والإحصائيات</p></div>
      <Link href="/matches/new" className="rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-3 text-center font-bold">إضافة مباراة</Link>
    </div>
    <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-6">
      <StatCard label="المباريات" value={data.summary.matches}/>
      <StatCard label="الانتصارات" value={data.summary.wins}/>
      <StatCard label="التعادلات" value={data.summary.draws}/>
      <StatCard label="الهزائم" value={data.summary.losses}/>
      <StatCard label="الأهداف" value={data.summary.goals}/>
      <StatCard label="التمريرات الحاسمة" value={data.summary.assists}/>
    </div>
    <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#14101E]/70 p-4 md:flex-row">
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="البحث عن الخصم" className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none"/>
      <select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-xl border border-white/10 bg-[#1b1427] px-4 py-3">
        <option value="all">كل المباريات</option><option value="win">انتصارات</option><option value="draw">تعادلات</option><option value="loss">هزائم</option>
      </select>
    </div>
    <div className="space-y-4">
      {matches.map(m=><MatchCard key={m.id} match={m} onDelete={load}/>)}
      {!matches.length && <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-gray-400">لا توجد مباريات مسجلة</div>}
    </div>
  </Layout>
}

function MatchCard({match,onDelete}) {
  const color = match.result === "win" ? "text-emerald-300" : match.result === "loss" ? "text-red-300" : "text-amber-300"
  const border = match.result === "win" ? "from-violet-500/50 to-emerald-500/20" : match.result === "loss" ? "from-pink-500/50 to-red-500/20" : "from-violet-500/40 to-pink-500/20"
  async function del() { if (!confirm("هل تريد حذف هذه المباراة؟")) return; await fetch(`/api/matches/${match.id}`, {method:"DELETE"}); onDelete() }
  return <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${border} p-[1px]`}>
    <div className="rounded-[23px] bg-[#14101E]/95 p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1"><div className="mb-1 text-xs text-gray-500">{new Date(match.date).toLocaleDateString("ar-MA")} · مباراة #{match.id}</div><div className="text-xl font-black"><span className="mr-2 text-gray-500">vs</span><span className="bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">{match.opponentName}</span></div></div>
        <div className="rounded-2xl bg-black/25 px-5 py-3 text-center"><div className="text-3xl font-black tracking-wider"><span className="text-violet-300">{match.teamScore}</span><span className="mx-2 text-pink-400">:</span><span className="text-pink-300">{match.opponentScore}</span></div><div className={`mt-1 text-xs font-bold ${color}`}>{match.result === "win" ? "فوز" : match.result === "loss" ? "هزيمة" : "تعادل"}</div></div>
        <div className="flex gap-2"><Link href={`/matches/${match.id}`} className="rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-4 py-2 text-sm font-bold">التشكيلة</Link><Link href={`/matches/edit/${match.id}`} className="rounded-xl bg-white/5 px-4 py-2 text-sm font-bold text-gray-200">تعديل</Link><button onClick={del} className="rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-300">حذف</button></div>
      </div>
    </div>
  </div>
}
