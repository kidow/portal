import { useObjectState } from 'hooks'
import Head from 'next/head'
import supabase from 'api'
import { useEffect, useMemo } from 'react'
import type { KeyboardEvent } from 'react'
import isURL from 'validator/lib/isURL'
import type { Result } from 'url-metadata'
import Link from 'next/link'
import {
  MinusIcon,
  PlusIcon,
  SearchIcon,
  XIcon
} from '@heroicons/react/outline'
import { Backdrop, Switch } from 'components'
import dayjs from 'dayjs'
import Fuse from 'fuse.js'
import type { NextPage } from 'next'
import classnames from 'classnames'

interface State {
  isLoggedIn: boolean
  password: string
  list: ILink[]
  isPrivate: boolean
  title: string
  description: string
  image: string
  url: string
  isCreating: boolean
  startDate: string
  endDate: string
  memo: string
  search: string
  isLoading: boolean
}

const HomePage: NextPage = () => {
  const [
    {
      isLoggedIn,
      password,
      list,
      isPrivate,
      title,
      description,
      image,
      url,
      isCreating,
      startDate,
      endDate,
      memo,
      search,
      isLoading
    },
    setState,
    onChange
  ] = useObjectState<State>({
    isLoggedIn: false,
    password: '',
    list: [],
    isPrivate: false,
    title: '',
    description: '',
    image: '',
    url: '',
    isCreating: false,
    startDate: '',
    endDate: '',
    memo: '',
    search: '',
    isLoading: false
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
      .insert([{ title, description, image, url, is_private: isPrivate, memo }])
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
      isCreating: false,
      isPrivate: false,
      memo: ''
    })
    get()
  }

  const onPaste = async (e: globalThis.KeyboardEvent) => {
    if (!isLoggedIn) return
    setState({ isLoading: true })
    try {
      if (e.metaKey && e.key === 'v') {
        const url = await window.navigator.clipboard.readText()
        if (!isURL(url)) {
          alert(`URL이 아닙니다. (text: ${url})`)
          return
        }
        const res = await fetch(`/api/scrap?url=${url}`)
        const data: Result = await res.json()
        setState({
          title: data.title,
          description: data.description,
          image: isURL(data.image, { require_protocol: true })
            ? data.image
            : data.url + data.image,
          url: data.url
        })
      }
    } catch (err) {
      console.log(err)
    } finally {
      setState({ isLoading: false })
    }
  }

  const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && process.env.NEXT_PUBLIC_PASSWORD === password) {
      setState({ isLoggedIn: true })
    }
  }

  const remove = async (id: number) => {
    if (!window.confirm('링크를 제거합니까?')) return

    const { error } = await supabase.from('links').delete().eq('id', id)
    if (error) {
      console.error(error)
      return
    }
    get()
  }

  const searchList: ILink[] = useMemo(() => {
    if (!search) return list
    const fuse = new Fuse(list, { keys: ['title', 'description'] })
    return fuse
      .search(search)
      .filter(({ score }) => score! <= 0.33)
      .map(({ item }) => item)
  }, [search, list.length])

  useEffect(() => {
    get()
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return

    window.addEventListener('keydown', onPaste)
    return () => {
      window.removeEventListener('keydown', onPaste)
    }
  }, [isLoggedIn])
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
                autoFocus
                className="border-b bg-transparent focus:outline-none"
              />
            )}
          </div>
        </div>

        <div className="flex gap-2 px-6 pb-5">
          <input
            type="date"
            className="rounded border border-neutral-600 bg-transparent p-2"
            value={startDate}
            name="startDate"
            onChange={onChange}
          />
          <input
            type="date"
            className="rounded border border-neutral-600 bg-transparent p-2"
            value={endDate}
            name="endDate"
            onChange={onChange}
          />
          <button onClick={get}>
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6">
          <div
            className={classnames(
              'flex items-center gap-3 rounded-full border border-neutral-600 px-4 py-2',
              { 'cursor-not-allowed': !isLoggedIn }
            )}
          >
            <input
              type="url"
              value={search}
              name="search"
              onChange={onChange}
              spellCheck={false}
              disabled={!isLoggedIn}
              className="flex-1 border-0 bg-transparent disabled:cursor-not-allowed"
            />
            {search.length > 1 && (
              <XIcon
                onClick={() => setState({ search: '' })}
                className="h-4 w-4 cursor-pointer text-neutral-500 hover:text-neutral-400"
              />
            )}
            <SearchIcon className="h-5 w-5 text-neutral-500" />
          </div>
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
                  <input
                    value={memo}
                    name="memo"
                    onChange={onChange}
                    className="mt-1 border-b border-neutral-600 bg-transparent text-sm"
                    placeholder="메모"
                  />
                </div>
                <Switch
                  checked={isPrivate}
                  onChange={(isPrivate) => setState({ isPrivate })}
                />
                <button disabled={isCreating} onClick={create}>
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
          <div className="mt-6 space-y-6">
            {searchList.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg border border-neutral-600 p-4"
              >
                <img src={item.image} alt="" className="h-14 w-14" />
                <div className="flex-1">
                  <div className="text-lg font-bold">
                    <Link href={item.url}>
                      <a target="_blank" className="hover:underline">
                        {item.title}
                      </a>
                    </Link>
                    <span className="ml-3 text-xs text-neutral-600">
                      {dayjs(item.created_at).format(
                        'YYYY년 MM월 DD일 HH시 mm분 ss초'
                      )}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-500 line-clamp-2 md:line-clamp-1">
                    {item.description}
                  </div>
                  {!!item.memo && (
                    <div className="text-xs text-neutral-600">{item.memo}</div>
                  )}
                </div>
                {isLoggedIn && (
                  <button onClick={() => remove(item.id)}>
                    <MinusIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link href="https://github.com/kidow/portal">
        <a target="_blank" className="fixed top-2 right-2">
          <button>
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-neutral-700 hover:fill-neutral-500"
            >
              <g>
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z" />
              </g>
            </svg>
          </button>
        </a>
      </Link>

      {isLoading && <Backdrop />}
    </>
  )
}

export default HomePage
