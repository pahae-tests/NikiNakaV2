import { useRouter } from "next/router"
import Link from "next/link"
import { useEffect,useMemo,useState } from "react"
import Layout from "../../components/Layout"
import { CircleDot, Footprints, Trophy, ArrowRight, Pencil } from "lucide-react"

const basePositions={GK:[50,87],CB:[50,69],LB:[22,67],RB:[78,67],CM:[50,49],LW:[22,32],RW:[78,32],ST:[50,17]}
const offsets=[[0,0],[-8,0],[8,0],[0,-7],[0,7],[-5,-6],[5,-6],[-5,6],[5,6]]

function placement(position,index){
 const [x,y]=basePositions[position]||basePositions.CM
 const [ox,oy]=offsets[index]||[0,0]
 return {left:`${Math.max(8,Math.min(92,x+ox))}%`,top:`${Math.max(9,Math.min(90,y+oy))}%`}
}

export default function Match(){
 const {query}=useRouter(),[m,setM]=useState(null)
 useEffect(()=>{if(query.id)fetch(`/api/matches/${query.id}`).then(r=>r.json()).then(setM)},[query.id])
 const placed=useMemo(()=>{if(!m)return[];const counts={};return m.players.map(p=>{const i=counts[p.position]||0;counts[p.position]=i+1;return {...p,style:placement(p.position,i)}})},[m])
 if(!m)return <Layout><div className="text-gray-400">جاري تحميل المباراة...</div></Layout>
 const result=m.teamScore>m.opponentScore?"فوز":m.teamScore<m.opponentScore?"هزيمة":"تعادل"
 return <Layout>
  <div className="mb-5 flex items-center justify-between gap-3"><div><div className="text-sm font-bold text-violet-300">التشكيلة والتقييم</div><h1 className="mt-1 text-3xl font-black sm:text-4xl">vs {m.opponentName}</h1><div className="mt-1 text-sm text-gray-500">{new Date(m.date).toLocaleDateString("ar-MA")} · {result}</div></div><div className="rounded-2xl border border-white/10 bg-[#14101E] px-4 py-3 text-center"><div className="text-3xl font-black"><span className="text-violet-300">{m.teamScore}</span><span className="mx-2 text-gray-600">:</span><span className="text-pink-300">{m.opponentScore}</span></div></div></div>
  <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#10151a] shadow-2xl">
   <div className="relative md:aspect-[3/4] min-h-[560px] overflow-hidden sm:min-h-[720px]" style={{background:"linear-gradient(145deg,#173d2b,#0d2b20 45%,#153824)"}}>
    <div className="absolute inset-0 opacity-20" style={{backgroundImage:"repeating-linear-gradient(90deg,transparent 0,transparent 12%,rgba(255,255,255,.16) 12.2%,transparent 12.4%,transparent 25%)"}}/>
    <div className="absolute inset-[4%] rounded-2xl border-2 border-white/70"/>
    <div className="absolute left-[4%] right-[4%] top-1/2 border-t-2 border-white/60"/>
    <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70 sm:h-36 sm:w-36"/>
    <div className="absolute left-1/2 top-[4%] h-[15%] w-[46%] -translate-x-1/2 border-2 border-t-0 border-white/70"/>
    <div className="absolute left-1/2 bottom-[4%] h-[15%] w-[46%] -translate-x-1/2 border-2 border-b-0 border-white/70"/>
    <div className="absolute left-1/2 top-[4%] h-[6%] w-[18%] -translate-x-1/2 border-2 border-t-0 border-white/70"/>
    <div className="absolute left-1/2 bottom-[4%] h-[6%] w-[18%] -translate-x-1/2 border-2 border-b-0 border-white/70"/>
    {placed.map(p=><PlayerOnPitch key={p.playerId} player={p} goals={m.goals.filter(g=>String(g.scorerId)===String(p.playerId)).length} assists={m.goals.filter(g=>String(g.assistId)===String(p.playerId)).length}/>) }
   </div>
  </div>
  <div className="mx-auto mt-5 grid max-w-4xl gap-4 lg:grid-cols-2">
   <div className="rounded-2xl border border-white/10 bg-[#14101E]/90 p-5"><h2 className="mb-4 flex items-center gap-2 font-bold"><Trophy size={18} className="text-pink-300"/>أفضل لاعب</h2><Mvp players={m.players}/></div>
   <div className="rounded-2xl border border-white/10 bg-[#14101E]/90 p-5"><h2 className="mb-4 font-bold">الأهداف والتمريرات الحاسمة</h2>{m.goals.length?m.goals.map((g,i)=><div key={g.id||i} className="border-b border-white/5 py-3 text-sm"><span className="font-bold">الهدف {i+1}</span> · {g.scorerName}{g.assistName?` — تمريرة حاسمة: ${g.assistName}`:""}</div>):<div className="text-sm text-gray-500">لا توجد أهداف</div>}</div>
  </div>
  <div className="mt-5 flex items-center justify-center gap-3"><Link href={`/matches/edit/${m.id}`} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-4 py-3 text-sm font-bold"><Pencil size={17}/>تعديل المباراة</Link><button onClick={()=>history.back()} className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm text-gray-300"><ArrowRight size={17}/>العودة</button></div>
 </Layout>
}
function PlayerOnPitch({player,goals,assists}){return <div className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={player.style}>
 <div className="relative h-[72px] w-[72px] md:h-[82px] md:w-[82px] rounded-[22px] border border-white/20 bg-[#15101f]/95 p-1.5 shadow-[0_12px_35px_rgba(0,0,0,.4)] backdrop-blur-md sm:h-[98px] sm:w-[98px]">
  <div className="absolute -left-1.5 -top-1.5 z-20 flex h-6 min-w-6 items-center justify-center rounded-lg bg-black/80 px-1.5 text-[11px] font-black text-white">{player.shirtNumber}</div>
  <div className="absolute -right-1.5 -top-1.5 -translate-y-0.5 translate-x-0.5 z-20 flex items-center rounded-lg text-emerald-300 text-[14px]">{goals?Array.from({length:goals}).map((_,i)=>"⚽"):null}</div>
  <img src={player.image||"/player.svg"} className="h-full w-full rounded-[17px] object-cover"/>
  <div className="absolute -bottom-0.5 -left-1.5 z-20 flex h-6 min-w-6 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 px-1.5 text-[11px] font-black text-white">{player.rating}</div>
  <div className="absolute -bottom-1.5 -right-1.5 translate-x-1.5 z-20 flex items-center overflow-hidden rounded-lg text-pink-300 text-[14px]">{assists?Array.from({length:assists}).map((_,i)=>"👟"):<></>}</div>
 </div>
 <div className="mt-1 max-w-[105px] truncate rounded-lg bg-black/65 px-2 py-1 text-center text-[11px] font-bold text-white backdrop-blur-sm">{player.name}</div>
 <div className="mx-auto mt-0.5 w-fit rounded-md bg-black/50 px-1.5 text-[9px] font-bold text-violet-200">{player.position}</div>
 </div>}
function Mvp({players}){const p=[...players].sort((a,b)=>b.rating-a.rating||((b.goals||0)-(a.goals||0))||((b.assists||0)-(a.assists||0))||String(a.name).localeCompare(String(b.name)))[0];return p?<div className="flex items-center gap-3"><img src={p.image||"/player.svg"} className="h-14 w-14 rounded-2xl object-cover"/><div><div className="font-bold">{p.name}</div><div className="text-sm text-gray-500">{p.position}</div></div><div className="mr-auto rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 px-3 py-2 font-black">{p.rating}</div></div>:null}
