import { FC } from 'react'

const ButtonAr: FC<{ blob: Blob | null }> = ({ blob }) => {
  if (!blob) return null
  return (
    <a
      className="px-4 py-2 bg-slate-200 z-10 rounded-lg text-sm "
      id="link"
      rel="ar"
      download="asset.usdz"
      href={URL.createObjectURL(blob)}
    >
      View in <span className="font-bold">AR</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/arkit.png" alt="ARKit" className="w-4 h-4 ml-1 hidden" />
    </a>
  )
}

export default ButtonAr
