import { useEffect, useState } from "react"
import Layout from "../components/Layout"

export default function Stats() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setData)
  }, [])

  if (!data) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#14101E]/80 px-6 py-4 text-gray-400 shadow-xl">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400" />
            <span>جاري تحميل الإحصائيات...</span>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1d152b] via-[#171222] to-[#0f0c15] p-6 sm:p-8">
          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-fuchsia-600/10 blur-3xl" />

          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              Statistiques
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              إحصائيات اللاعبين
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
              تحليل شامل لأداء اللاعبين اعتمادًا على المباريات المسجلة في
              قاعدة البيانات.
            </p>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-[#14101E]/80 shadow-2xl shadow-black/10 md:block">
          <div className="overflow-x-auto">
            <div className="min-w-[850px]">
              {/* Table header */}
              <div className="grid grid-cols-[2.2fr_1fr_1fr_1fr_1fr_1fr] items-center border-b border-white/10 bg-white/[0.025] px-6 py-4 text-sm font-semibold text-gray-400">
                <div>اللاعب</div>
                <div className="text-center">الأهداف</div>
                <div className="text-center">التمريرات</div>
                <div className="text-center">G/A</div>
                <div className="text-center">المباريات</div>
                <div className="text-center">المتوسط</div>
              </div>

              {/* Rows */}
              {data.players.map((p, index) => (
                <div
                  key={p.id}
                  className="group grid grid-cols-[2.2fr_1fr_1fr_1fr_1fr_1fr] items-center border-b border-white/5 px-6 py-4 transition hover:bg-violet-500/[0.045]"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-5 text-xs font-bold text-gray-600">
                      {index + 1}
                    </span>

                    <div className="relative">
                      <img
                        src={p.image || "/player.svg"}
                        alt={p.name}
                        className="h-11 w-11 rounded-full border border-white/10 bg-white/5 object-cover"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#14101E] bg-emerald-400" />
                    </div>

                    <span className="font-bold text-white transition group-hover:text-violet-300">
                      {p.name}
                    </span>
                  </div>

                  <div className="text-center font-semibold text-white">
                    {p.goals}
                  </div>

                  <div className="text-center font-semibold text-white">
                    {p.assists}
                  </div>

                  <div className="text-center">
                    <span className="inline-flex min-w-12 items-center justify-center rounded-lg bg-violet-500/10 px-3 py-1.5 font-bold text-violet-300">
                      {p.goals + p.assists}
                    </span>
                  </div>

                  <div className="text-center text-gray-300">
                    {p.matches}
                  </div>

                  <div className="text-center">
                    <span className="font-bold text-amber-300">
                      {p.avgRating ?? "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {data.players.map((p, index) => (
            <div
              key={p.id}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#14101E]/80 p-4 shadow-lg transition active:scale-[0.99]"
            >
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-violet-600/10 blur-2xl" />

              <div className="relative flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-gray-500">
                  {index + 1}
                </span>

                <img
                  src={p.image || "/player.svg"}
                  alt={p.name}
                  className="h-12 w-12 shrink-0 rounded-full border border-white/10 bg-white/5 object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-white">
                    {p.name}
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {p.matches} مباريات
                  </p>
                </div>

                <div className="text-left">
                  <div className="text-lg font-black text-violet-300">
                    {p.goals + p.assists}
                  </div>
                  <div className="text-[10px] text-gray-500">G/A</div>
                </div>
              </div>

              <div className="relative mt-4 grid grid-cols-4 gap-2 border-t border-white/5 pt-4">
                <div className="rounded-xl bg-white/[0.025] p-2.5 text-center">
                  <div className="text-sm font-bold text-white">
                    {p.goals}
                  </div>
                  <div className="mt-1 text-[10px] text-gray-500">
                     ⚽ أهداف
                  </div>
                </div>

                <div className="rounded-xl bg-white/[0.025] p-2.5 text-center">
                  <div className="text-sm font-bold text-white">
                    {p.assists}
                  </div>
                  <div className="mt-1 text-[10px] text-gray-500">
                    👟 تمريرات
                  </div>
                </div>

                <div className="rounded-xl bg-white/[0.025] p-2.5 text-center">
                  <div className="text-sm font-bold text-white">
                    {p.matches}
                  </div>
                  <div className="mt-1 text-[10px] text-gray-500">
                    👱‍♂️ مباريات
                  </div>
                </div>

                <div className="rounded-xl bg-amber-400/[0.06] p-2.5 text-center">
                  <div className="text-sm font-bold text-amber-300">
                    {p.avgRating ?? "—"}
                  </div>
                  <div className="mt-1 text-[10px] text-gray-500">
                    المتوسط
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {data.players.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#14101E]/60 px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl">
              ⚽
            </div>
            <h3 className="font-bold text-white">
              لا توجد إحصائيات بعد
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              أضف بعض المباريات لعرض إحصائيات اللاعبين.
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}