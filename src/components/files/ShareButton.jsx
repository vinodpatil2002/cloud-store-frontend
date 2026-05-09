import { useState } from 'react'
import { Share2, Check, Copy } from 'lucide-react'

export default function ShareButton({ file, className = '', iconSize = 13 }) {
  const [state, setState] = useState('idle') // idle | copied | shared

  const viewUrl = `${window.location.origin}/view/${file._id}`

  const handleShare = async (e) => {
    e.stopPropagation()
    if (state !== 'idle') return

    const shareData = {
      title: `${file.originalName} — CloudStore`,
      text: `View ${file.originalName} on CloudStore`,
      url: viewUrl,
    }

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
        setState('shared')
        setTimeout(() => setState('idle'), 2000)
      } catch (err) {
        if (err.name !== 'AbortError') copyFallback()
      }
    } else {
      copyFallback()
    }
  }

  const copyFallback = () => {
    navigator.clipboard.writeText(viewUrl).then(() => {
      setState('copied')
      setTimeout(() => setState('idle'), 2000)
    })
  }

  const isDone = state === 'copied' || state === 'shared'

  return (
    <button
      onClick={handleShare}
      title={isDone ? (state === 'copied' ? 'Link copied!' : 'Shared!') : 'Share / Copy link'}
      className={`transition-colors duration-150 ${
        isDone ? 'text-success' : 'text-neutral-500 hover:text-neutral-300'
      } ${className}`}
    >
      {isDone
        ? <Check size={iconSize} strokeWidth={1.5} />
        : navigator.share
          ? <Share2 size={iconSize} strokeWidth={1.5} />
          : <Copy size={iconSize} strokeWidth={1.5} />
      }
    </button>
  )
}
