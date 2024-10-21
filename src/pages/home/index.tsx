import Head from 'next/head'
import { ReactNode } from 'react'

// Layouts
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'

// ** Pages
import HomePage from 'src/views/pages/home'

export default function Home() {
  return (
    <>
      <Head>
        <title>E-commerce</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <HomePage />
    </>
  )
}

Home.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
Home.guestGuard = false
Home.authGuard = false
