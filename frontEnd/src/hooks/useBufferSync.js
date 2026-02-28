import { useRef } from 'react'

export default function useBufferSync({
  sendEvent,
  isHost
}) {
  const bufferingUsers = useRef(new Set())

  const onUserBuffering = (userId) => {
    bufferingUsers.current.add(userId)
    if (isHost) {
      sendEvent('FORCE_PAUSE')
    }
  }

  const onUserReady = (userId) => {
    bufferingUsers.current.delete(userId)
    if (isHost && bufferingUsers.current.size === 0) {
      sendEvent('FORCE_PLAY')
    }
  }

  return {
    onUserBuffering,
    onUserReady
  }
}
