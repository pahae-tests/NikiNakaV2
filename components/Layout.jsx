import Link from "next/link"
import { Trophy, Users, BarChart3, PlusCircle, Home } from "lucide-react"

export default function Layout({ children }) {
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#24113d_0,transparent_35%),#09070F]">
    <aside className="fixed right-0 top-0 z-30 hidden h-screen w-64 border-l border-white/10 bg-[#100c18]/95 p-5 backdrop-blur-xl lg:block">
      <div className="mb-10 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500"><Trophy size={22}/></div><div><div className="font-bold">فريق النيكي ناكا</div><div className="text-xs text-gray-400">إدارة الفريق</div></div></div>
      <nav className="space-y-2"><Nav href="/" icon={Home} text="المباريات"/><Nav href="/players" icon={Users} text="اللاعبون"/><Nav href="/stats" icon={BarChart3} text="الإحصائيات"/><Nav href="/matches/new" icon={PlusCircle} text="إضافة مباراة"/></nav>
    </aside>
    <main className="min-h-screen lg:mr-64"><div className="mx-auto max-w-7xl p-4 pb-28 sm:p-6 lg:p-10">{children}</div></main>
    <nav className="fixed bottom-0 right-0 left-0 z-40 border-t border-white/10 bg-[#100c18]/95 px-2 py-2 backdrop-blur-xl lg:hidden"><div className="mx-auto grid max-w-lg grid-cols-4 gap-1"><MobileNav href="/" icon={Home} text="المباريات"/><MobileNav href="/players" icon={Users} text="اللاعبون"/><MobileNav href="/stats" icon={BarChart3} text="الإحصائيات"/><MobileNav href="/matches/new" icon={PlusCircle} text="إضافة"/></div></nav>
  </div>
}
function Nav({ href, icon: Icon, text }) { return <Link href={href} className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 transition hover:bg-white/5 hover:text-white"><Icon size={19}/><span>{text}</span></Link> }
function MobileNav({ href, icon: Icon, text }) { return <Link href={href} className="flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] text-gray-400 transition hover:bg-white/5 hover:text-white"><Icon size={20}/><span>{text}</span></Link> }
