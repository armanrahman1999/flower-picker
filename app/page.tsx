'use client'

import dynamic from 'next/dynamic'

const PixiScene = dynamic(() => import('../components/PixiScene'), {
  ssr: false,
  loading: () => <p>Loading...</p>
})

export default function Home() {
  return (
    <main>
      <PixiScene />
    </main>
  )
}