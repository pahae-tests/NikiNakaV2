import { useRouter } from "next/router"
import MatchWizard from "../../../components/MatchWizard"
import Layout from "../../../components/Layout"

export default function EditMatch(){
  const { query, isReady } = useRouter()
  if (!isReady) return <Layout><div className="text-gray-400">جاري التحميل...</div></Layout>
  return <Layout><MatchWizard matchId={query.id}/></Layout>
}
