import { CreatorState } from 'react/src/Creator.js'
import { UpdateOverlayState } from 'src/utils/update-overlay-state.js'
import { MyPlayer as Player } from '../player.js'
import { GameMode, REACT_BASE_URL } from 'src/gamemode.js'
import { Client, zVEC3 } from 'gothic-together'

type CreatorArgs = {
  currBodyVar: number
  gender: 0 | 1
  face: number
  faceShape: number
  fatness: number
}

const bodyTextVar = [
  [4, 5, 6, 7, 11, 12],
  [0, 1, 2, 3, 8, 9, 10],
]
const faceTextVar = [
  [
    137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
    156, 157,
  ],
  [15, 29, 30, 40, 120, 121, 122, 123, 124, 125, 126, 127, 128],
]

const faceShapeVar = [
  [
    'HUM_HEAD_BABE',
    'HUM_HEAD_BABE1',
    'HUM_HEAD_BABE2',
    'HUM_HEAD_BABE3',
    'HUM_HEAD_BABE4',
    'HUM_HEAD_BABE5',
    'HUM_HEAD_BABE6',
    'HUM_HEAD_BABE7',
    'HUM_HEAD_BABE8',
    'HUM_HEAD_BABEHAIR',
  ],
  ['HUM_HEAD_FATBALD', 'HUM_HEAD_FIGHTER', 'HUM_HEAD_PONY', 'HUM_HEAD_PSIONIC', 'HUM_HEAD_THIEF'],
]

const CreatorUpdate = (player: Player, args: CreatorArgs, gamemode: GameMode) => {
  const gender = args.gender || 0
  const currBodyVar = args.currBodyVar || 0
  const face = args.face || 0
  const faceShape = args.faceShape || 0
  const fatness = args.fatness || 0

  const playerModel = player.Npc.GetModel()
  playerModel?.set_fatness(fatness)

  player.Npc.SetAdditionalVisuals(
    gender ? 'hum_body_Naked0' : 'hum_body_Babe0',
    bodyTextVar[gender]![currBodyVar]!, //MyBodyTextVarNr
    0, //DefaultBodyTexColorNr
    faceShapeVar[gender]![faceShape]!, //FaceShape
    faceTextVar[gender]![face]!, //MyHeadVarNr
    0,
    -1,
  )

  UpdateOverlayState<CreatorState>(player, 'CreatorComponent', {
    username: player.Name || '',
    gender: gender,
    currBodyVar: currBodyVar,
    face: face,
    faceShape: faceShape,
    fatness: args.fatness,
  })
}

const Creator = (player: Player, args: CreatorArgs, gamemode: GameMode) => {
  const current_pos = player.Npc.GetPositionWorld()!

  Client.RemoveHtmlComponent(player.Id, 'Overlay_Main')
  Client.NavigateHtmlComponent(player.Id, 'Main', `${REACT_BASE_URL}#creator`)

  const heading = new zVEC3([current_pos.X, current_pos.Y, current_pos.Z])
  player.Npc.SetHeadingWorld(new zVEC3([current_pos.X + 150, current_pos.Y, current_pos.Z]))
  current_pos.X += 200
  current_pos.Y += 20

  Client.EnableStaticCamera(player.Id, current_pos, heading)
  Client.DisableClosingOverlay(player.Id)
}

const ExitCreator = (player: Player, args: CreatorArgs, gamemode: GameMode) => {
  Client.EnableClosingOverlay(player.Id)
  Client.StopIntercept(player.Id)
  Client.DisableStaticCamera(player.Id)
  Client.CreateHtmlComponent(player.Id, 'Overlay_Main')
}

export default {
  CreatorUpdate,
  Creator,
  ExitCreator,
}
