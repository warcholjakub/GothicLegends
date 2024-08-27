import { HeroPageState } from 'react/src/Hero.js'
import { UpdateOverlayState } from 'src/utils/update-overlay-state.js'
import { MyPlayer as Player } from '../player.js'
import { GameMode, REACT_BASE_URL } from 'src/gamemode.js'
import { Client } from 'gothic-together'

type HeroUpgradeArgs = {
  id: string
}

type HeroAttribute = {
  id: string
  gothicID: number
  type: 'attribute' | 'talent'
  overlay?: string
}

const ATTRIBUTE_UPGRADE_COST: number = 5
const ATTRIBUTE_UPGRADE_VALUE: number = 2
const HITCHANCE_UPGRADE_COST: number = 10
const HITCHANGE_UPGRADE_VALUE: number = 5
const MAGIC_CIRCLE_UPGRADE_COST: number = 15
const MAGIC_CIRCLE_UPGRADE_VALUE: number = 1

const HERO_ATTRIBUTES: HeroAttribute[] = [
  { id: 'hitpoints', gothicID: 1, type: 'attribute' },
  { id: 'mana', gothicID: 3, type: 'attribute' },
  { id: 'strength', gothicID: 4, type: 'attribute' },
  { id: 'dexterity', gothicID: 5, type: 'attribute' },
  { id: '1h', gothicID: 1, type: 'talent', overlay: 'humans_1hst' },
  { id: '2h', gothicID: 2, type: 'talent', overlay: 'humans_2hst' },
  { id: 'bow', gothicID: 3, type: 'talent', overlay: 'humans_bowt' },
  { id: 'cbow', gothicID: 4, type: 'talent', overlay: 'humans_cbowt' },
  { id: 'mageCircle', gothicID: 7, type: 'talent' },
]

const Hero = (player: Player, args: HeroUpgradeArgs, gamemode: GameMode) => {
  Client.NavigateHtmlComponent(player.Id, 'Main', `${REACT_BASE_URL}#hero`)
}

const HeroUpgrade = (player: Player, args: HeroUpgradeArgs, gamemode: GameMode) => {
  const attribute = HERO_ATTRIBUTES.find((a) => a.id == args.id)
  if (!attribute) {
    return
  }

  const upgradeValue =
    attribute.type == 'attribute'
      ? processAttributeUpgrade(player, attribute)
      : processSkillTalentUpgrade(player, attribute)

  UpdateOverlayState<HeroPageState>(player, 'HeroComponent', {
    lp: player.Attrs.learningPoints,
    [attribute.id]: upgradeValue,
  })
}

const processAttributeUpgrade = (player: Player, attribute: HeroAttribute): number => {
  const currentValue = player.Npc.GetAttribute(attribute.gothicID)!
  if (player.Attrs.learningPoints - ATTRIBUTE_UPGRADE_COST < 0) {
    return currentValue
  }

  player.SetAttrs({ learningPoints: player.Attrs.learningPoints - ATTRIBUTE_UPGRADE_COST })
  const upgradeValue = currentValue + ATTRIBUTE_UPGRADE_VALUE
  player.Npc.SetAttribute(attribute.gothicID, upgradeValue)
  return upgradeValue
}

const processMageCircleUpgrade = (player: Player, skill: HeroAttribute): number => {
  const currentTalentSkill = player.Npc.GetTalentSkill(skill.gothicID)!
  if (player.Attrs.learningPoints - MAGIC_CIRCLE_UPGRADE_COST < 0 || currentTalentSkill == 6) {
    return currentTalentSkill
  }

  player.SetAttrs({ learningPoints: player.Attrs.learningPoints - MAGIC_CIRCLE_UPGRADE_COST })
  const upgradeTalentSkill = currentTalentSkill + MAGIC_CIRCLE_UPGRADE_VALUE
  player.Npc.SetTalentSkill(skill.gothicID, upgradeTalentSkill)
  player.Npc.SetTalentValue(skill.gothicID, upgradeTalentSkill)
  return upgradeTalentSkill
}

const processSkillTalentUpgrade = (player: Player, skill: HeroAttribute): number => {
  if (skill.id == 'mageCircle') {
    return processMageCircleUpgrade(player, skill)
  }

  const currentHitChance = player.Npc.GetHitChance(skill.gothicID)!
  if (player.Attrs.learningPoints - HITCHANCE_UPGRADE_COST < 0 || currentHitChance >= 100) {
    return currentHitChance
  }

  player.SetAttrs({ learningPoints: player.Attrs.learningPoints - HITCHANCE_UPGRADE_COST })
  const upgradeHitChance = currentHitChance + HITCHANGE_UPGRADE_VALUE
  player.Npc.SetHitChance(skill.gothicID, upgradeHitChance)

  if (upgradeHitChance == 30) {
    upgradeFightTalent(player, skill, 1)
  } else if (upgradeHitChance == 60) {
    upgradeFightTalent(player, skill, 2)
  }

  return upgradeHitChance
}

const upgradeFightTalent = (player: Player, skill: HeroAttribute, level: number) => {
  const model = player.Npc.GetModel()
  model?.ApplyModelProtoOverlay(`${skill.overlay}${level}`)
  player.Npc.SetTalentSkill(skill.gothicID, level)
  player.Npc.SetTalentValue(skill.gothicID, level)
}

export default {
  Hero,
  HeroUpgrade,
}
