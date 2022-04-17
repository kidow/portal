import type { FC } from 'react'
import Link from 'next/link'

export interface Props {}
interface State {}

const Card: FC<Props> = () => {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-neutral-600 p-4">
      <img
        src="https://s.pstatic.net/static/www/mobile/edit/2016/0705/mobile_212852414260.png"
        alt=""
        className="h-14 w-14"
      />
      <div>
        <div className="text-lg font-bold"></div>
        <div className="text-sm text-neutral-500 line-clamp-2 md:line-clamp-1"></div>
      </div>
    </div>
  )
}

export default Card
