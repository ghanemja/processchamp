import { useState } from 'react'

const srcFor = (v) =>
  v.kind === 'vimeo'
    ? `https://player.vimeo.com/video/${v.id}?autoplay=1&autopause=0&title=0&byline=0&portrait=0`
    : `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1`

const thumbFor = (v) => (v.kind === 'youtube' ? `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg` : null)

function PlayBadge({ large = false }) {
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-white/90 text-blue-700 shadow-[0_6px_24px_-6px_rgba(12,19,27,0.5)] backdrop-blur transition-transform group-hover:scale-110 ${
        large ? 'h-[72px] w-[72px]' : 'h-14 w-14'
      }`}
    >
      <svg width={large ? 20 : 15} height={large ? 22 : 17} viewBox="0 0 16 18" fill="currentColor" className="ml-1">
        <path d="M16 9L0 18V0z" />
      </svg>
    </span>
  )
}

/**
 * Click-to-load facade: no third-party player scripts until the visitor asks
 * for one, which keeps the page fast and the tracking surface small.
 */
export function VideoCard({ video, poster, className = '', aspect = 'aspect-video', large = false }) {
  const [playing, setPlaying] = useState(false)
  const thumb = poster ?? thumbFor(video)

  return (
    <div className={`group relative overflow-hidden border border-line-200 bg-paper-200 ${aspect} ${className}`}>
      {playing ? (
        <iframe
          src={srcFor(video)}
          title={video.title}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="absolute inset-0 h-full w-full cursor-pointer" aria-label={`Play ${video.title}`}>
          {thumb && (
            <img
              src={thumb}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              onError={(e) => {
                e.currentTarget.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
              }}
            />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/15 to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <PlayBadge large={large} />
          </span>
          {video.tag && (
            <span className="absolute left-4 top-4 bg-white/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-blue-700 backdrop-blur">
              {video.tag}
            </span>
          )}
          <span className="absolute inset-x-0 bottom-0 p-5 text-left">
            <span className="block text-[17px] font-semibold leading-snug text-white">{video.title}</span>
          </span>
        </button>
      )}
    </div>
  )
}
