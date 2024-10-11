import { MyPlayer as Player } from 'src/player.js'
import { GameMode } from 'src/gamemode.js'
import { Client, zVEC3, Server } from 'gothic-together'
import { UpdateOverlayState } from 'src/utils/update-overlay-state.js'
import { CallCommand } from 'src/utils/commands-handler.js'

const normalRange: number = 3500
const whisperRange: number = 1000

type message = {
  content: string
  type: string
  sender: string
}

const calculateDistance = (player1: Player, player2: Player) => {
  const cords1 = player1.Npc.GetPositionWorld()
  const cords2 = player2.Npc.GetPositionWorld()
  if (!cords1 || !cords2) {
    throw new Error('Player coordinates are not available')
  }
  const distance = Math.sqrt(
    (cords1.X - cords2.X) ** 2 + (cords1.Y - cords2.Y) ** 2 + (cords1.Z - cords2.Z) ** 2,
  )
  return distance
}

const sendMessage = (player: Player, args: message | string, gameMode: GameMode) => {
  if (typeof args === 'string') {
    args = { content: args, type: 'normal', sender: '' }
  }
  console.log(args.content)
  args.sender = player.Name
  let range = normalRange

  if (args.content[0] === '/') {
    const commandParts = args.content.slice(1).split(' ')
    const commandName = commandParts[0]
    const commandArgs = commandParts.slice(1).join(' ')

    switch (commandName) {
      case 'me':
        args.type = 'me'
        args.content = commandArgs
        break
      case 'do':
        args.type = 'do'
        args.content = commandArgs
        break
      case 'gdo':
        args.type = 'gdo'
        args.content = commandArgs
        gameMode.Players.forEach((p) => {
          UpdateOverlayState<message>(p, 'newMessage', args)
        })
        return
      case 'sz':
        args.type = 'whisper'
        args.content = commandArgs
        break
      case 'k':
        args.type = 'shout'
        args.content = commandArgs
        break
      case 'pw': {
        const targetPlayerName = commandParts[1]
        const targetPlayer = gameMode.Players.find((p) => p.Name === targetPlayerName)
        if (targetPlayer) {
          args.content = commandParts.slice(2).join(' ')
          args.type = 'pw'
          args.sender = `${player.Name} -> ${targetPlayerName}`
          UpdateOverlayState<message>(targetPlayer, 'newMessage', args)
        } else {
          args.content = 'Player not found'
          args.sender = 'Server'
          args.type = 'error'
        }
        UpdateOverlayState<message>(player, 'newMessage', args)
        return
      }
      default:
        if (!CallCommand(commandName || '', player, commandArgs, gameMode)) {
          args.content = 'Command not found'
          args.sender = 'Server'
          args.type = 'error'
          UpdateOverlayState<message>(player, 'newMessage', args)
        }
        return
    }
  }

  switch (args.type) {
    case 'whisper':
      range = whisperRange
      break
    case 'shout':
      range = normalRange * 2
      break
  }

  gameMode.Players.forEach((p) => {
    if (calculateDistance(player, p) < range) UpdateOverlayState<message>(p, 'newMessage', args)
  })
}

export default {
  sendMessage,
}
