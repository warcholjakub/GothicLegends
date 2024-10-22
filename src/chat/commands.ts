import { MyPlayer as Player } from 'src/player.js'
import { GameMode } from 'src/gamemode.js'
import { Client, zVEC3, Server } from 'gothic-together'
import { UpdateOverlayState } from 'src/utils/update-overlay-state.js'
import { CallCommand } from 'src/utils/commands-handler.js'
import { chatWithNPC } from 'src/chat/ai_handler.js'
import { REACT_BASE_URL } from 'src/gamemode.js'
import { BindCommandType } from 'gothic-together/client-commands'
import OpenAI from 'openai'

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

const sendMessage = async (player: Player, args: message | string, gameMode: GameMode) => {
  if (typeof args === 'string') {
    args = { content: args, type: 'normal', sender: '' }
  }

  // if (args === undefined) {
  //   return
  // }
  // if (args.content === '') return
  args.sender = `(${player.Id}) ${player.Name}:`
  let range = normalRange

  if (args.content[0] === '/') {
    const commandParts = args.content.slice(1).split(' ')
    const commandName = commandParts[0]
    const commandArgs = commandParts.slice(1).join(' ')

    switch (commandName) {
      case 'me':
        args.content = `#${commandArgs}#`
        break
      case 'do':
        args.content = `*${commandArgs}*`
        break
      case 'gdo':
        args.content = `$${commandArgs}$`
        args.type = 'IC'
        args.sender = ''
        gameMode.Players.forEach((p) => {
          UpdateOverlayState<message>(p, 'newMessage', args)
        })
        return
      case 'sz':
        range = whisperRange
        break
      case 'k':
        range = normalRange * 2
        break
      case 'pw': {
        const targetPlayerName = commandParts[1]
        const targetPlayer = gameMode.Players.find((p) => p.Name === targetPlayerName)
        if (targetPlayer) {
          args.content = commandParts.slice(2).join(' ')
          args.sender = `${player.Name} -> ${targetPlayerName}`
          UpdateOverlayState<message>(targetPlayer, 'newMessage', args)
        } else {
          args.content = 'Player not found'
          args.sender = 'Server:'
          args.type = 'ERROR'
        }
        UpdateOverlayState<message>(player, 'newMessage', args)
        return
      }
      case 'gpw': {
        const targetPlayerName = commandParts[1]
        const targetPlayer = gameMode.Players.find((p) => p.Name === targetPlayerName)
        if (targetPlayer) {
          args.content = `$${commandParts.slice(2).join(' ')}$`
          args.sender = ``
          UpdateOverlayState<message>(targetPlayer, 'newMessage', args)
        } else {
          args.content = 'Player not found'
          args.sender = 'Server:'
          args.type = 'ERROR'
        }
        UpdateOverlayState<message>(player, 'newMessage', args)
        return
      }
      default:
        if (!CallCommand(commandName || '', player, commandArgs, gameMode)) {
          args.content = 'Command not found'
          args.sender = 'Server:'
          args.type = 'ERROR'
          UpdateOverlayState<message>(player, 'newMessage', args)
        }
        return
    }
  }

  gameMode.Players.forEach((p) => {
    if (calculateDistance(player, p) < range) UpdateOverlayState<message>(p, 'newMessage', args)
  })

  // Handling NPC interaction
  const npc = player.Npc.GetFocusNpc()
  console.log(npc)
  if (npc !== null && npc !== undefined) {
    console.log('siemson')
    await chatWithNPC(player, npc, args.content, gameMode)
  }
}

const openChat = (player: Player) => {
  Client.LoadHtmlComponent(player.Id, 'Main_test', `${REACT_BASE_URL}#chat`)
  Client.CreateHtmlComponent(player.Id, 'Main_test')
  Client.NavigateHtmlComponent(player.Id, 'Main_test', `${REACT_BASE_URL}#chat`)
  Client.BindCommandToKeyPress(player.Id, 0x70, 'unfocusChat', BindCommandType.OVERLAY_TOGGLE)
  Client.EnableClosingOverlay(player.Id)
  // Client.StopIntercept(player.Id)
}

const focusChat = (player: Player) => {
  Client.RemoveHtmlComponent(player.Id, 'Overlay_main')
  Client.RemoveBindCommandFromKeyPress(player.Id, 0x1b)
  Client.CreateHtmlComponent(player.Id, 'Main_test')
  Client.NavigateHtmlComponent(player.Id, 'Main_test', `${REACT_BASE_URL}#chat`)
  Client.BindCommandToKeyPress(player.Id, 0x70, 'unfocusChat', BindCommandType.OVERLAY_TOGGLE)
}

const unfocusChat = (player: Player) => {
  Client.RemoveHtmlComponent(player.Id, 'Main_test')
  Client.RemoveBindCommandFromKeyPress(player.Id, 0x1b)
  Client.CreateHtmlComponent(player.Id, 'Overlay_main')
  Client.NavigateHtmlComponent(player.Id, 'Overlay_main', `${REACT_BASE_URL}#chat`)
  Client.BindCommandToKeyPress(player.Id, 0x70, 'focusChat', BindCommandType.OVERLAY_TOGGLE)
}

const createNPC = (player: Player, args: string, gameMode: GameMode) => {
  Server.CreateNpc('HUMANS_S1', new zVEC3([1306, 247, 220]))
}

const testAI = (player: Player, gameMode: GameMode) => {
  const OPENROUTER_API_KEY = ''

  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: OPENROUTER_API_KEY,
    defaultHeaders: {},
  })

  console.log('start request')

  openai.chat.completions
    .create({
      model: 'gryphe/mythomax-l2-13b:free',
      messages: [
        {
          role: 'user',
          content: 'Hej kolego!',
        },
      ],
    })
    .then((completion) => {
      console.log('after request')
      if (completion.choices && completion.choices[0] && completion.choices[0].message) {
        console.log(completion.choices[0].message)
      } else {
        console.error('Completion message is undefined')
      }
    })
    .catch((error) => {
      console.error('Error communicating with OpenAI API:', error)
    })

  console.log('end')
}

export default {
  sendMessage,
  openChat,
  focusChat,
  unfocusChat,
  createNPC,
  testAI,
}
