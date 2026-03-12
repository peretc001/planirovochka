import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  sassOptions: {
    additionalData: '@use "@/styles/mixins" as *;',
    includePaths: [path.join(__dirname, 'styles')]
  }
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
