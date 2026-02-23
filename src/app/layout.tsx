import type { Viewport } from 'next'
import { Open_Sans } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'

import UseQueryProviders from '@/lib/useQueryProviders'

import '@/globals.scss'

import '@ant-design/v5-patch-for-react-19'

const openSans = Open_Sans({ subsets: ['latin', 'cyrillic'] })

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: 'device-width'
}

const RootLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <body className={openSans.className}>
        <NextIntlClientProvider>
          <div className="layout-container">
            <div>header</div>

            <main>
              <UseQueryProviders>{children}</UseQueryProviders>
            </main>
            <div>footer</div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
