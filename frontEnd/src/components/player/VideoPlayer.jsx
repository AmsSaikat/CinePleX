import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export default function VideoPlayer({
  src,
  poster,
  onReady,
  onPlay,
  onPause,
  onTimeUpdate,
  onWaiting,
  onCanPlay
}) {
  const videoRef = useRef(null)
  const playerRef = useRef(null)

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.25, 1.5],
        poster,
        sources: [
          {
            src,
            type: 'video/mp4'
          }
        ]
      })

      const player = playerRef.current

      player.ready(() => onReady?.(player))
      player.on('play', () => onPlay?.(player))
      player.on('pause', () => onPause?.(player))
      player.on('timeupdate', () => onTimeUpdate?.(player.currentTime()))
      player.on('waiting', () => onWaiting?.())
      player.on('canplay', () => onCanPlay?.())
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [src])

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-xl bg-black">
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
      />
    </div>
  )
}
