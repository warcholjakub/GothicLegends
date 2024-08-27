import { ShowNotification } from './utils/notifications.js'
import { Server, Client, GameModeBase, zVEC3 } from 'gothic-together'
import { BindCommandType } from 'gothic-together/client-commands'
import {
  NPC_ATR_HITPOINTS,
  TMovementSubType,
  oCItem,
  oCMsgMovement,
  oCNpc,
  NPC_ATR_HITPOINTSMAX,
  NPC_ATR_MANA,
  NPC_ATR_MANAMAX,
} from 'gothic-together/union/classes/index'
import { CallCommand } from './utils/commands-handler.js'
import { AddItemToInventory, InitPlayerInventory, UseItemFromInventory } from './inventory/index.js'
import { MyPlayer as Player } from 'src/player.js'
import { GameState, store } from './store.js'
import { UpdateOverlayState } from './utils/update-overlay-state.js'
import { StatsState } from 'react/src/Stats.js'
import { RestartGamemode } from './utils/restart-gamemode.js'
import { ShowScoreboard } from './utils/scoreboard.js'
import { UpdatePartyMemberOverlay, UpdateQuestOverlay } from './overlay/updater.js'
import { SpawnGarondAndGuards } from './gamemode/garond.js'

const FireMageNames = ['Corristo', 'Drago', 'Damarok', 'Torrez', 'Rodriguez']
const ENEMY_SPAWN_VECTOR_GATE = new zVEC3([-3121.921, -389.788, 1805.179])
const ENEMY_SPAWN_VECTOR_BACK = new zVEC3([1258.548, 247.738, -293.938])
const ZOMBIES_SPAWN_VECTOR = new zVEC3([901.986, 247.937, -447.066])

export const WaveEnemies = [
  ['warg', 'warg', 'warg', 'orcwarrior_rest'],
  ['warg', 'warg', 'OrcWarrior_Harad', 'OrcWarrior_Harad', 'orcwarrior_rest'],
  ['orcwarrior_rest', 'orcwarrior_rest', 'OrcWarrior_Harad', 'OrcWarrior_Harad', 'orcwarrior_rest'],
  ['Draconian', 'Draconian'],
  ['Demon'],
  ['Zombie01', 'Zombie02', 'Zombie02', 'Zombie02', 'Zombie02'],
]

export const REACT_BASE_URL = process.env['FRONTEND_URL']
const GAMEMODE_AUTORESTART = process.env['AUTO_RESTART'] == 'true'

export class GameMode extends GameModeBase {
  override OnInitServer() {
    store.setState(store.getInitialState())
    SpawnGarondAndGuards(this)
    Server.CreateObject('orc_squareplanks_2x3m.3DS', new zVEC3([-2045, 248, -830]))
  }

  override OnPlayerJoinServer(player: Player) {
    this.state.initPlayerAttributes(player.Id)
    player.SetAttrs({
      learningPoints: 100,
      totalDamageDealt: 0,
      waveDamageDealt: 0,
      totalWaveEnemyKills: 0,
      totalWavesSurvived: 0,
      healTargetUuid: '',
      role: player.Id == 0 ? 'admin' : 'player',
    })

    UpdatePartyMemberOverlay(this)
    UpdateQuestOverlay(this, player)

    Client.BindCommandToKeyPress(player.Id, 0x70, 'menu', BindCommandType.OVERLAY_TOGGLE)
    Client.BindCommandToKeyPress(player.Id, 0x49, 'eq', BindCommandType.OVERLAY_TOGGLE)
    Client.BindCommandToKeyPress(player.Id, 0x50, 'hero', BindCommandType.OVERLAY_TOGGLE)
    Client.BindCommandToKeyPress(player.Id, 0x72, 'revive', BindCommandType.OVERLAY_TOGGLE)

    Client.LoadHtmlComponent(player.Id, 'Main', `${REACT_BASE_URL}#eq`)
    Client.CreateHtmlComponent(player.Id, 'Main')

    Client.LoadHtmlComponent(player.Id, 'Overlay_Main', `${REACT_BASE_URL}#stats`)
    Client.CreateHtmlComponent(player.Id, 'Overlay_Main')

    InitPlayerInventory(player)
    AddItemToInventory(player, {
      isNative: true,
      objectName: 'ITMI_GOLD',
      amount: 1000,
      isEquipped: false,
    })
    const armor = AddItemToInventory(player, {
      isNative: true,
      objectName: 'ITAR_PAL_H',
      amount: 1,
      isEquipped: false,
    })
    const weapon = AddItemToInventory(player, {
      isNative: true,
      objectName: 'ITMW_1H_PAL_SWORD',
      amount: 1,
      isEquipped: false,
    })
    AddItemToInventory(player, {
      isNative: true,
      objectName: 'ITPO_MEGADRINK',
      amount: 1,
      isEquipped: false,
    })

    player.Npc.SetAttribute(0, 2000)
    player.Npc.SetAttribute(1, 2000)
    player.Npc.SetAttribute(2, 2000)
    player.Npc.SetAttribute(3, 2000)
    player.Npc.SetAttribute(4, 300)
    player.Npc.SetAttribute(5, 300)
    player.Npc.SetGuild(1)

    if (armor) {
      UseItemFromInventory(player, armor.objectName)
    }
    if (weapon) {
      UseItemFromInventory(player, weapon.objectName)
    }
  }

  override OnPlayerDisconnectServer(player: Player): void {
    this.state.deletePlayerAttributes(player.Id)

    if (this.Players.length == 1 && GAMEMODE_AUTORESTART) {
      RestartGamemode(this)
    }

    UpdatePartyMemberOverlay(this)
  }

  override OnPlayerCommand(player: Player, commandName: string, args: any) {
    if (CallCommand(commandName, player, args, this)) {
      return
    }

    switch (commandName) {
      case 'startgame': {
        if (this.state.gamePhase == 'INIT') {
          this.state.setGamePhase('ACTIVE')
          this.state.nextWave()

          Client.PlaySound(player.Id, 'DIA_PYROKAR_TEST_15_00.WAV')

          ShowNotification(
            this.Players,
            `Nadciąga ${this.state.waveCounter} Fala`,
            'Przygotuj się do kolejnego natarcia przeciwnika!',
            3,
          )

          this.state.clearCurrentWaveEnemies()

          for (const p of this.Players) {
            UpdateQuestOverlay(this, p)
            p.SetAttrs({ totalWavesSurvived: p.Attrs.totalWavesSurvived + 1 })
          }
        }
        break
      }

      case 'menu': {
        Client.NavigateHtmlComponent(player.Id, 'Main', `${REACT_BASE_URL}#`)
        break
      }

      case 'performance': {
        const start = Date.now()
        for (let i = 0; i < 10000; i++) {
          this.HostNpc.GetAttribute(0)
        }
        console.log(Date.now() - start)
        break
      }

      case 'scoreboard': {
        ShowScoreboard(this, player)
        break
      }

      case 'exitgame': {
        this.GameManager.ExitGame()
        break
      }

      default:
        return
    }
  }

  override OnTick() {
    if (this.state.newSpawned.length > 0) {
      for (const enemy of this.state.newSpawned) {
        enemy.Fighting()
        const eventMan = enemy!.eventManager()
        const walkModeMessage = oCMsgMovement.oCMsgMovement_OnInit6(
          TMovementSubType.EV_SETWALKMODE,
          0,
        )
        const gotoVobMessage = oCMsgMovement.oCMsgMovement_OnInit3(
          TMovementSubType.EV_GOTOVOB,

          this.state.captainGarond!,
        )
        eventMan!.OnMessage(walkModeMessage!, enemy!)
        eventMan!.OnMessage(gotoVobMessage!, enemy!)
      }

      this.state.clearNewSpawned()
    }

    let allDead = true
    for (const p of this.Players) {
      const playerHp = p.Npc.GetAttribute(NPC_ATR_HITPOINTS)
      if ((playerHp as number) > 0) {
        allDead = false
        break
      }
    }

    if (allDead && this.state.gamePhase != 'END') {
      this.state.setGamePhase('END')
      ShowNotification(
        this.Players,
        'Wszyscy gracze nie żyją!',
        `Liczba przetrwanych fal: ${this.state.waveCounter}`,
        5,
      )
      ShowScoreboard(this)
    }

    if (this.state.gamePhase == 'ACTIVE' && this.state.waveCounter <= WaveEnemies.length) {
      if (this.state.currentWaveEnemiesIndex < WaveEnemies[this.state.waveCounter - 1]!.length) {
        const enemyName =
          WaveEnemies[this.state.waveCounter - 1]![this.state.currentWaveEnemiesIndex]
        const randomEnemySpawnVector = Math.floor(Math.random() * 2) + 1

        let currentSpawnVector

        if (enemyName == 'Zombie01' || enemyName == 'Zombie02') {
          currentSpawnVector = ZOMBIES_SPAWN_VECTOR
        } else if (randomEnemySpawnVector == 1) {
          currentSpawnVector = ENEMY_SPAWN_VECTOR_GATE
        } else if (randomEnemySpawnVector == 2) {
          currentSpawnVector = ENEMY_SPAWN_VECTOR_BACK
        }

        for (let i = 0; i < this.state.enemySpawnMultiplier; i++) {
          const enemy = Server.CreateNpc(enemyName!, currentSpawnVector!)
          this.state.addSpawnedNpc(enemy!)

          if (enemyName == 'Zombie01' || enemyName == 'Zombie02') {
            let mageRobe: oCItem

            if (this.state.currentWaveEnemiesIndex == 0) {
              mageRobe = Server.PutInInventory('ItAr_Kdf_H', enemy!, 1) as oCItem
            } else {
              mageRobe = Server.PutInInventory('ItAr_KdF_L', enemy!, 1) as oCItem
            }

            enemy?.SetAttribute(NPC_ATR_HITPOINTSMAX, 2000)
            enemy?.SetAttribute(NPC_ATR_HITPOINTS, 2000)
            enemy?.EquipArmor(mageRobe!)

            this.state.addNewNpc(enemy!)
            this.state.addCurrentWaveEnemy(enemy!)

            break
          }

          this.state.addNewNpc(enemy!)
          this.state.addCurrentWaveEnemy(enemy!)
        }
        this.state.nextWaveEnemiesIndex()
      }
      if (
        this.state.currentWaveEnemies.length == 0 &&
        this.state.currentWaveEnemiesIndex == WaveEnemies[this.state.waveCounter - 1]!.length
      ) {
        this.state.setGamePhase('PREPARE')
        this.state.setLastWaveEndTime(new Date())
        this.state.nextWave()
        this.state.restartWaveEnemiesIndex()
        this.state.restartCurrentWaveEnemiesKilled()
        ShowScoreboard(this)
      }
    }
    if (this.state.gamePhase == 'PREPARE') {
      if ((new Date().getTime() - this.state.lastWaveEndTime!.getTime()) / 1000 > 10) {
        for (const p of this.Players) {
          p.SetAttrs({ waveDamageDealt: 0 })
          UpdateQuestOverlay(this, p)
        }
        ShowNotification(
          this.Players,
          `Nadciąga ${this.state.waveCounter} Fala`,
          'Nadchodzi kolejne natarcie przeciwnika!',
          3,
        )
        this.state.setGamePhase('ACTIVE')
        this.ClearCurrentWaveEnamies()
      }
    }
  }

  override OnPlayerChangeAttribute(
    player: Player,
    attribute: number,
    currentValue: number,
    change: number,
  ): void {
    if (attribute == NPC_ATR_MANA || attribute == NPC_ATR_MANAMAX) {
      const currentMana = player.Npc.GetAttribute(NPC_ATR_MANA)
      const currentMaxMana = player.Npc.GetAttribute(NPC_ATR_MANAMAX)
      const manaPercentage = (currentMana! / currentMaxMana!) * 100

      UpdatePartyMemberOverlay(this)
      UpdateOverlayState<StatsState>(player, 'StatsComponent', {
        playerMana: manaPercentage,
      })
    }

    if (attribute == NPC_ATR_HITPOINTS && currentValue == 0) {
      UpdateQuestOverlay(this, player)
    }
  }

  override OnDamage(
    attacker: oCNpc,
    attrackerName: string,
    target: oCNpc,
    targetName: string,
    weaponName: string,
    damage: number,
  ) {
    if (this.state.captainGarond && target.Uuid == this.state.captainGarond.Uuid) {
      UpdatePartyMemberOverlay(this)
      if (this.state.captainGarond.GetAttribute(NPC_ATR_HITPOINTS) == 0) {
        for (const p of this.Players) {
          UpdateQuestOverlay(this, p)
        }

        this.state.setGamePhase('END')
      }
    }

    const index = this.state.currentWaveEnemies.findIndex((enemy) => enemy.Uuid == target.Uuid)
    if (index != -1 && target.GetAttribute(NPC_ATR_HITPOINTS) == 0) {
      this.state.removeCurrentWaveEnemy(index)
      this.state.addKilledEnemy()

      for (const p of this.Players) {
        UpdateQuestOverlay(this, p)
      }
    }

    const attackerPlayer = this.GetPlayerFromNpc(attacker)
    if (
      attackerPlayer &&
      this.state.currentWaveEnemies.find((enemy) => enemy.Uuid == target.Uuid)
    ) {
      attackerPlayer.SetAttrs({
        totalDamageDealt: attackerPlayer.Attrs.totalDamageDealt + damage,
        waveDamageDealt: attackerPlayer.Attrs.waveDamageDealt + damage,
      })
    }

    const targetPlayer = this.GetPlayerFromNpc(target)
    if (targetPlayer) {
      UpdatePartyMemberOverlay(this)
    }
  }

  ClearCurrentWaveEnamies() {
    for (const npc of this.state.spawnedNpcs) {
      npc.RemoveVobFromWorld()
    }

    this.state.clearSpawnedNpcs()
  }

  get state() {
    return store.getState()
  }

  update(
    change: GameState | Partial<GameState> | ((state: GameState) => GameState | Partial<GameState>),
  ) {
    store.setState(change)
  }
}
