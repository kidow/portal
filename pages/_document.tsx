import Document, { Html, Head, Main, NextScript } from 'next/document'
import type { DocumentContext } from 'next/document'
import { Children } from 'react'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      styles: Children.toArray(initialProps.styles)
    }
  }
  render() {
    return (
      <Html lang="ko" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#0065FF" />
          <meta name="robots" content="index, follow" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta
            name="keywords"
            content="link, vercel, nextjs, typescript, tailwindcss, references, portal"
          />
          <meta
            name="google-site-verification"
            content="xKB3qoGHdfq4qWL2jYzfvLMC6Txx-Wcm_U3ezKY5Pyg"
          />
          <meta
            name="naver-site-verification"
            content="9734bf1afe85f0a624fb652bcef0d460899b31ff"
          />
          <meta name="author" content="김동욱" />
          <meta
            name="description"
            content="웹 개발자 Kidow의 맞춤 컨텐츠 링크 모음"
          />
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="canonical" href="https://portal.kidow.me" />
          <meta name="msapplication-TileColor" content="#0065FF" />
          <meta property="og:title" content="Portal - Kidow" />
          <meta
            property="og:description"
            content="웹 개발자 Kidow의 맞춤 컨텐츠 링크 모음"
          />
          <meta property="og:url" content="https://portal.kidow.me" />
          <meta
            property="og:image"
            content="https://opengraph.kidow.me/api?id=ruf4dj9du6n"
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="600" />
          <meta property="og:locale" content="ko_KR" />
          <meta property="og:type" content="website" />
          <meta
            property="og:site_name"
            content="Web Developer Kidow's Daily Contents Links"
          />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:title" content="Portal - Kidow" />
          <meta
            property="twitter:description"
            content="웹 개발자 Kidow의 맞춤 컨텐츠 링크 모음"
          />
          <meta property="twitter:domain" content="https://portal.kidow.me" />
          <meta
            property="twitter:image"
            content="https://opengraph.kidow.me/api?id=ruf4dj9du6n"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
