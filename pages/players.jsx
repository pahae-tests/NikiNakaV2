import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import PlayerForm from "../components/PlayerForm"

export default function Players() {
  const [players,setPlayers]=useState([])
  const [editing,setEditing]=useState(null)
  const [open,setOpen]=useState(false)
  async function load(){setPlayers(await (await fetch("/api/players")).json())}
  useEffect(()=>{load()},[])
  async function remove(id){
    if(!confirm("سيتم أرشفة اللاعب. هل تريد المتابعة؟"))return
    await fetch(`/api/players/${id}`,{method:"DELETE"});load()
  }
  return <Layout>
    <div className="mb-8 flex items-center justify-between"><div><h1 className="text-4xl font-black">اللاعبون</h1><p className="mt-2 text-gray-400">إدارة قائمة الفريق</p></div><button onClick={()=>{setEditing(null);setOpen(true)}} className="rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-3 font-bold">إضافة لاعب</button></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {players.map(p=><div key={p.id} className="rounded-2xl border border-white/10 bg-[#14101E]/80 p-5">
        <div className="flex items-center gap-4"><img src={p.image||"/player.svg"} className="h-16 w-16 rounded-2xl object-cover bg-white/5"/><div><div className="font-bold">{p.name}</div><div className="text-sm text-gray-400">#{p.shirt_number}</div></div></div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center"><Metric label="مباريات" value={p.matches}/><Metric label="أهداف" value={p.goals}/><Metric label="تمريرات" value={p.assists}/></div>
        <div className="mt-2 text-center text-sm text-gray-400">متوسط التقييم: {p.avgRating ?? "—"}</div>
        <div className="mt-4 flex gap-2"><button onClick={()=>{setEditing(p);setOpen(true)}} className="flex-1 rounded-lg bg-white/5 px-3 py-2">تعديل</button><button onClick={()=>remove(p.id)} className="rounded-lg bg-red-500/10 px-3 py-2 text-red-300">أرشفة</button></div>
      </div>)}
    </div>
    {open&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#14101E] p-6"><div className="mb-5 flex justify-between"><h2 className="text-xl font-bold">{editing?"تعديل لاعب":"إضافة لاعب"}</h2><button onClick={()=>setOpen(false)}>إغلاق</button></div><PlayerForm player={editing} onSaved={()=>{setOpen(false);load()}}/></div></div>}
  </Layout>
}
function Metric({label,value}){return <div className="rounded-xl bg-black/20 p-2"><div className="font-bold">{value}</div><div className="text-xs text-gray-500">{label}</div></div>}