import { useEffect } from 'react'
import type { FC } from 'react'
import { Spinner } from 'components'

interface Props {}

const Backdrop: FC<Props> = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.removeAttribute('style')
    }
  }, [])
  return (
    <>
      <div className="fixed inset-0 bg-black opacity-30" />
      <span className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Spinner className="h-10 w-10" />
      </span>
    </>
  )
}

export default Backdrop
