import React, { useEffect, useRef } from "react"
import videojs from "video.js"
import "video.js/dist/video-js.css"

export default function TheaterPlayer({
  src,
  onBufferStart,
  onBufferEnd,
  onPlay,
  onPause,
}) {
  const videoRef = useRef(null)
  const playerRef = useRef(null)

  useEffect(() => {
    if (!videoRef.current || playerRef.current) return

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      preload: "auto",
      fluid: true,
      autoplay: false,
      sources: [
        {
          src,
          type: "video/mp4", // later: application/x-mpegURL
        },
      ],
    })

    const player = playerRef.current

    /* ---- BUFFERING DETECTION ---- */
    player.on("waiting", () => {
      onBufferStart?.()
    })

    player.on("playing", () => {
      onBufferEnd?.()
      onPlay?.()
    })

    player.on("pause", () => {
      onPause?.()
    })

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [src])

  return (
    <div data-vjs-player className="w-full h-full">
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered rounded-2xl"
      />
    </div>
  )
}
