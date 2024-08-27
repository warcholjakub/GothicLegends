import React, { useEffect, useState } from 'react'
import { Notification } from './components/Notification'
import styled from 'styled-components'
import { Quest, QuestTitle, Quests } from './components/Quests'
import { HeroBar } from './components/HeroBar'
import HeroPage from './Hero'
import Equipment from './Equipment'
import { QuestStatus } from './components/Quests'
import { ProgressBar } from './components/ProgressBar'
import { sendGameCommand, useGameState } from './lib/electron'
import { onGameEvent } from './lib/electron'

type PartyMember = {
  id?: number
  name?: string
  level?: number
  currentHp?: number
  currentMana?: number
}

type Quest = {
  id?: string
  title?: string
  status?: QuestStatus
}

export type StatsState = {
  playerId: number
  playerName: string
  playerLevel: number
  playerHp: number
  playerMana: number
  progressBarLabel: string
  partyMembers: PartyMember[]
  quests: Quest[]
}

const Stats = () => {
  const statsData = useGameState<StatsState>('StatsComponent')

  const [isNotificationVisible, setIsNotificationVisible] = useState(false)
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationText, setNotificationText] = useState('')

  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false)
  const [progressBarLabel, setProgressBarLabel] = useState('')

  useEffect(() => {
    onGameEvent('Notification', (data: any) => {
      const { title, text, time } = data

      setNotificationTitle(title)
      setNotificationText(text)
      setIsNotificationVisible(true)

      setTimeout(() => {
        setIsNotificationVisible(false)
      }, parseInt(time))
    })

    onGameEvent('ProgressBar', (data: any) => {
      const { isVisible, label } = data

      setProgressBarLabel(label)
      setIsProgressBarVisible(isVisible)
    })
  }, [])

  if (!statsData) {
    return null
  }

  return (
    <>
      <Overlay>
        <Column>
          <PlayersWrapper>
            <Players>
              {statsData.partyMembers?.map((member) => (
                <>
                  {member.id == statsData.playerId ? (
                    <Myself>
                      <HeroBar
                        type={'player'}
                        avatar="https://cdn.discordapp.com/avatars/711289213357785206/39d04f6168d5520ccbe52686ed776910.webp?size=160"
                        name={member.name!}
                        level={member.level!}
                        hp={member.currentHp!}
                        mana={member.currentMana!}
                      />
                    </Myself>
                  ) : (
                    <HeroBar
                      type="friend"
                      avatar="https://cdn.discordapp.com/avatars/711289213357785206/39d04f6168d5520ccbe52686ed776910.webp?size=160"
                      name={member.name!}
                      level={member.level!}
                      hp={member.currentHp!}
                      mana={member.currentMana!}
                    />
                  )}
                </>
              ))}
            </Players>
          </PlayersWrapper>
        </Column>
        <Column>
          <ProgressBar
            icon={require('./components/ProgressBar/icon_leafs_128.png')}
            isVisible={isProgressBarVisible}
            time={5}
            label={progressBarLabel}
          />
          {isNotificationVisible && (
            <Notification title={notificationTitle} text={notificationText} />
          )}
        </Column>
        <Column>
          <QuestsWrapper>
            <Quests>
              <QuestTitle title="Aktualne zadania " />
              <div>
                {statsData.quests?.map((quest) => (
                  <Quest key={quest.id!} title={quest.title!} status={quest.status!} />
                ))}
              </div>
            </Quests>
          </QuestsWrapper>
        </Column>
      </Overlay>
    </>
  )
}

export default Stats

const Overlay = styled.div`
  display: flex;
  flex-basis: 0;
  width: 100%;
  height: 100%;
`

const Column = styled.div`
  flex-basis: inherit;
  flex-grow: 1;
`

const QuestsWrapper = styled.div`
  margin-top: 40%;
  display: flex;
  flex-direction: column;
  align-items: end;
`

const PlayersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`

const Players = styled.div``

const Myself = styled.div`
  margin-bottom: 20px;
  margin-left: 10px;
  position: absolute;
  margin-top: 46%;
  margin-left: 3rem;
`
