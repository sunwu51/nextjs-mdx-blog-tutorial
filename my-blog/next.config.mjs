/** @type {import('next').NextConfig} */
import nextMDX from '@next/mdx'

const withMDX = nextMDX({})

const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
}
 
export default withMDX(nextConfig)