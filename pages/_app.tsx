import 'styles/globals.css'
import App from 'next/app'
import { ErrorInfo } from 'react'
import 'dayjs/locale/ko'
import Script from 'next/script'
import Head from 'next/head'

interface Props {}
interface State {
  hasError: boolean
}

class MyApp extends App<Props, {}, State> {
  state = {
    hasError: false
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error) this.setState({ hasError: true })
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    const {} = this.state
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <Script src="/gtm.js" strategy="afterInteractive" />
        <Component {...pageProps} />
      </>
    )
  }
}

export default MyApp
