import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <meta name="description" content="mikespin.dev" />
                <link rel="icon" href="/favicon.ico" />
                <body className='overflow-y-hidden'/>
            </Head>
            <body className='overflow-y-hidden'>
            <Main />
            <NextScript />
            </body>
        </Html>
    )
}
