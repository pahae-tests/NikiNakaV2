import "../styles/globals.css"

export default function App({ Component, pageProps }) {
  return <div dir="rtl" lang="ar" className="min-h-screen bg-[#09070F]">{<Component {...pageProps} />}</div>
}