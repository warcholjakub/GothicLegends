import { useEffect, useState } from 'react'

export const onGameEvent = (name: string, func: (data: any) => void): (() => void) => {
  return window.electron.events.on(name, (stringJson: string) => {
    func(JSON.parse(stringJson))
  })
}

export const sendGameCommand = (name: string, args: any = {}) => {
  window.electron.commands.send(name, args)
}

export const useGameState = <T>(name: string) => {
  const [gameState, setGameState] = useState<T>()

  useEffect(() => {
    return onGameEvent(`STATE_${name}`, (data: T) => {
      setGameState(Object.assign({}, gameState || {}, data))
    })
  }, [gameState])

  useEffect(() => {
    sendGameCommand(`RequestState${name}`)
  }, [])

  return gameState
}
