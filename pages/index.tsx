import { useObjectState } from 'hooks'
import Head from 'next/head'
import supabase from 'api'
import { useEffect } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'
import isURL from 'validator/lib/isURL'
import type { Result } from 'url-metadata'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/outline'

interface State {
  isLoggedIn: boolean
  password: string
  list: ILink[]
  newUrl: string
  isPrivate: boolean
  title: string
  description: string
  image: string
  url: string
  isCreating: boolean
}

const HomePage = () => {
  const [
    {
      isLoggedIn,
      password,
      newUrl,
      list,
      isPrivate,
      title,
      description,
      image,
      url,
      isCreating
    },
    setState,
    onChange
  ] = useObjectState<State>({
    isLoggedIn: false,
    password: '',
    newUrl: '',
    list: [],
    isPrivate: false,
    title: '',
    description: '',
    image: '',
    url: '',
    isCreating: false
  })

  const get = async () => {
    const { data, error } = await supabase.from<ILink>('links').select('*')
    if (error) {
      console.error(error)
      return
    }
    setState({ list: data })
  }

  const create = async () => {
    if (!window.confirm('링크를 추가합니까?')) return
    setState({ isCreating: true })
    const { data, error } = await supabase
      .from<ILink>('links')
      .insert([{ title, description, image, url }])
    if (error) {
      console.error(error)
      setState({ isCreating: false })
      return
    }
    setState({
      title: '',
      description: '',
      image: '',
      url: '',
      isCreating: false
    })
    get()
  }

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('Text').trim()
    if (!isURL(text)) {
      alert('URL이 아닙니다.')
      return
    }
    setState({ url: text })

    fetch(`/api/scrap?url=${text}`)
      .then((res) => res.json())
      .then((data: Result) => {
        console.log('data', data)
        setState({
          title: data.title,
          description: data.description,
          image: isURL(data.image, { require_protocol: true })
            ? data.image
            : data.url + data.image,
          url: data.url
        })
      })
      .catch((err) => console.error(err))
  }

  const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || process.env.NEXT_PUBLIC_PASSWORD === password) {
      setState({ isLoggedIn: true })
    }
  }

  useEffect(() => {
    get()
  }, [])
  return (
    <>
      <Head>
        <title>Kidow Portal</title>
      </Head>

      <div className="container mx-auto max-w-screen-md">
        <div className="py-10">
          <div className="flex items-center justify-between px-6">
            <img
              src="/kidow-portal.svg"
              draggable={false}
              alt=""
              className="h-7"
            />
            {!isLoggedIn && (
              <input
                value={password}
                name="password"
                type="password"
                onChange={onChange}
                onKeyDown={onEnter}
                className="border-b bg-transparent focus:outline-none"
              />
            )}
          </div>
        </div>

        <div className="px-6">
          <input
            type="url"
            value={newUrl}
            name="newUrl"
            spellCheck={false}
            readOnly
            disabled={!isLoggedIn}
            onPaste={onPaste}
            className="w-full rounded-full border border-neutral-600 bg-transparent px-4 py-2"
          />
          {!!title && (
            <div className="my-6 border-b border-neutral-600 pb-6">
              <div className="flex items-center gap-4 rounded-lg border border-neutral-600 p-4">
                <img src={image} alt="" className="h-14 w-14" />
                <div className="flex-1">
                  <div className="text-lg font-bold">
                    <Link href={url}>
                      <a target="_blank" className="hover:underline">
                        {title}
                      </a>
                    </Link>
                  </div>
                  <div className="text-sm text-neutral-500 line-clamp-2 md:line-clamp-1">
                    {description}
                  </div>
                </div>
                <button disabled={isCreating} onClick={create}>
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
          <div className="mt-6 space-y-6">
            {list.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg border border-neutral-600 p-4"
              >
                <img src={item.image} alt="" className="h-14 w-14" />
                <div>
                  <div className="text-lg font-bold">
                    <Link href={item.url}>
                      <a target="_blank" className="hover:underline">
                        {item.title}
                      </a>
                    </Link>
                  </div>
                  <div className="text-sm text-neutral-500 line-clamp-2 md:line-clamp-1">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage
