import { MyPlayer as Player } from 'src/player.js'
import { GameMode } from 'src/gamemode.js'
import { oCNpc } from 'gothic-together/union/classes/oCNpc'
import OpenAI from 'openai'

export const chatWithNPC = async (
  player: Player,
  npc: oCNpc,
  message: string,
  gameMode: GameMode,
) => {
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: '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',
    defaultHeaders: {},
  })

  const args = { content: message, type: 'normal', sender: '' }
  args.sender = `(${player.Id}) ${player.Name}:`

  const completion = await openai.chat.completions.create({
    model: 'gryphe/mythomax-l2-13b:free',
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
      },
    ],
  })

  if (completion.choices && completion.choices[0] && completion.choices[0].message) {
    console.log(completion.choices[0].message)
  } else {
    console.error('Completion message is undefined')
  }
}
