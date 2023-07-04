import type { NextPage } from 'next'
import { FC } from 'react'
import data from '@/components/displateMasonry/data'
import type { Images } from '@/components/displateMasonry/data'

const ProductCard: FC<{
  title: string
  index: number
  images: Images
}> = ({ title, index, images }) => {
  return (
    <div
      className={`rounded-lg bg-gray-500 break-inside-avoid relative mb-[1.5rem] row-start-${
        index > 3 ? 2 : 1
      }`}
    >
      <img src={images.desktop} alt={title} className="rounded-lg w-full" />
      <p className="absolute bottom-2 left-2 text-white font-sans ">
        {index + 1} - {title}
      </p>
    </div>
  )
}
const Home: NextPage = () => {
  return (
    <div className="columns-4 gap-5">
      {data.map((product, index) => (
        <ProductCard key={product.id} {...product} index={index} />
      ))}
    </div>
  )
}

export default Home
