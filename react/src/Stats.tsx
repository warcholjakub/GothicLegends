import React, { useEffect, useState } from 'react'
import { Notification } from './components/Notification'
import { createGlobalStyle, styled } from 'styled-components'
import Caudex from './fonts/Caudex-Regular.ttf'
import { Quest, QuestTitle, Quests } from './components/Quests'
import { HeroBar } from './components/HeroBar'
import HeroPage from './Hero'
import Equipment from './Equipment'
import { QuestStatus } from './components/Quests'
import { ProgressBar } from './components/ProgressBar'
import { sendGameCommand, useGameState } from './lib/electron'
import { onGameEvent } from './lib/electron'
import statBarBg from './components/Stats/statBarBg.svg'
import red from './components/Stats/red.jpeg'

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

  // if (!statsData) {
  //   return null
  // }

  return (
    <PageWrapper>
      <GlobalStyle />
      <BarWrapper>
        <StatBar>
          <StatBarFill></StatBarFill>
          <CenteredText>{statsData?.playerHp}/100</CenteredText>
        </StatBar>
        <StatBar>
          <BlueStatBarFill></BlueStatBarFill>
          <CenteredText>{statsData?.playerHp}/100</CenteredText>
        </StatBar>
      </BarWrapper>
    </PageWrapper>
  )
}

export default Stats

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Caudex';
    src: url(${Caudex}) format('truetype');
    font-weight: 400;
    font-style: normal;
  }

  body {
    font-family: 'Caudex', sans-serif;
  }
`

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

const StatBar = styled.div`
  width: 256px;
  height: 19px;
  flex-shrink: 0;
  background-image: url(${statBarBg});
  content-align: center;
  position: relative;
`

const StatBarFill = styled.div`
  width: 70%;
  height: 13px;
  background: url(${red});
  clip-path: polygon(1.5% 0%, 100% 0%, 98.5% 100%, 0% 100%);
  position: absolute;
  top: 3px;
  left: 3px;
`
const BlueStatBarFill = styled.div`
  width: 70%;
  height: 13px;
  background:
    linear-gradient(0deg, rgba(0, 0, 255, 0.4) 0%, rgba(0, 0, 255, 0.4) 100%),
    url(${red}) lightgray 50% / cover no-repeat;
  background-blend-mode: color, revert;
  clip-path: polygon(1.5% 0%, 100% 0%, 98.5% 100%, 0% 100%);
  position: absolute;
  top: 3px;
  left: 3px;
`

const CenteredText = styled.div`
  position: absolute;
  color: #fff;
  font-family: Caudex;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  position: absolute; /* Position it absolutely within StatBar */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const BarWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
