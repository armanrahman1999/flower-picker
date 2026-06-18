'use client'

import dynamic from 'next/dynamic'
import '../lib/musicEngine'
import MusicPlayer from '../components/MusicPlayer'

const PixiScene = dynamic(() => import('../components/PixiScene'), {
  ssr: false,
  loading: () => <p>Loading...</p>
})

export default function Home() {
  return (
    <main>
      <MusicPlayer />
      <PixiScene />
    </main>
  )
}