export default function ButtonAr() {
  return (
    <a
      className="px-2 bg-slate-200 z-10 rounded-md"
      id="link"
      rel="ar"
      href=""
      download="asset.usdz"
    >
      View in AR
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/arkit.png" alt="ARKit" className="w-4 h-4 ml-1 hidden" />
    </a>
  )
}
