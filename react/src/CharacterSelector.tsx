import React, { useEffect, useState } from 'react'
import { createGlobalStyle, styled } from 'styled-components'
import Caudex from './fonts/Caudex-Regular.ttf'
import slotBG from './components/CharacterSelector/slotBackground.png'
import bgWideo from './components/CharacterSelector/bgWideo.mp4'
import { TooltipProvider } from './components/ui/tooltip'
import { sendGameCommand, useGameState } from './lib/electron'

function CharacterSelector() {
  return (
    <div className="main">
      <VideoWrapper>
        <video src={bgWideo} autoPlay muted loop>
          Your browser does not support the video tag.
        </video>
      </VideoWrapper>
      <PageWrapper>
        <GlobalStyle />
        <Text1>
          Naciśnij <ColoredPlus>+</ColoredPlus> aby stworzyć nową postać na slocie
        </Text1>
        <SlotsWrapper>
          <CharacterSlot />
          <CharacterSlot />
          <CharacterSlot />
          <CharacterSlot />
        </SlotsWrapper>
        <Text2>
          Po naciśnięciu zostaniesz przeniesiony do kreatora postaci. Tego procesu nie można cofnąć
          manualnie. W przypadku konieczności resetu postaci, skontaktuj się z administracją.
        </Text2>
      </PageWrapper>
    </div>
  )
}

export default CharacterSelector

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
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  display: flex;
  padding: 64px;
  flex-direction: column;
  gap: 64px;
  z-index: 1;
`

const VideoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
`

const Text1 = styled.div`
  color: #fff;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  font-family: Caudex;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

const ColoredPlus = styled.span`
  color: #ffd390;
`

const Text2 = styled.div`
  color: #fff;
  text-align: center;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  font-family: Caudex;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

const CharacterSlot = styled.div`
  display: flex;
  width: 324px;
  height: 451px;
  padding: 64px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  border-radius: 12px;
  border: 2px solid #ffd390;
  background: linear-gradient(rgba(255, 211, 144, 0), rgba(10, 10, 10, 0)), url(${slotBG});
  margin: 0 16px;
`

const SlotsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
