import React, { useEffect, useState } from 'react'
import { createGlobalStyle, styled } from 'styled-components'
import Caudex from './fonts/Caudex-Regular.ttf'
import slotBG from './components/CharacterSelector/slotBackground.png'
import bgWideo from './components/bgWideo.mp4'
import startGameButton from './components/CharacterSelector/startGameButton.png'
import characterBackground from './components/CharacterSelector/characterBackground.png'
import basicTexture from './components/CharacterSelector/basicTexture.png'
import { TooltipProvider } from './components/ui/tooltip'
import { sendGameCommand, useGameState } from './lib/electron'

function isEmpty(obj: CharArgs) {
  return JSON.stringify(obj) === '{}' || obj === undefined
}

type CharArgs = {
  name: string
  sex: number
  age: number
  gameTime: number
}

function CharacterSelector() {
  const [char1, setChar1] = useState<CharArgs>()
  const [char2, setChar2] = useState<CharArgs>()
  const [char3, setChar3] = useState<CharArgs>()
  const [char4, setChar4] = useState<CharArgs>()

  useEffect(() => {
    const char1ToSave: CharArgs = { name: 'Maidenless Tarnished', sex: 0, age: 45, gameTime: 0 }
    localStorage.setItem('char1', JSON.stringify(char1ToSave))
    setChar1(JSON.parse(localStorage.getItem('char1') || '{}'))
    setChar2(JSON.parse(localStorage.getItem('char2') || '{}'))
    setChar3(JSON.parse(localStorage.getItem('char3') || '{}'))
    setChar4(JSON.parse(localStorage.getItem('char4') || '{}'))
  }, [])

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
          Wybierz postać lub naciśnij <ColoredPlus>+</ColoredPlus> aby stworzyć nową.
        </Text1>
        <SlotsWrapper>
          {isEmpty(char1!) ? (
            <EmptySlot>
              <CreateCharacterButton
                onClick={() => {
                  sendGameCommand('Creator', {
                    slot: 1,
                  })
                }}
              />
            </EmptySlot>
          ) : (
            <CharacterSlot>
              <CharTitleText>Imię postaci</CharTitleText>
              <CharText>{char1?.name}</CharText>
              <CharTitleText>Płeć postaci</CharTitleText>
              <CharText>{char1?.sex === 0 ? 'Kobieta' : 'Mężczyzna'} </CharText>
              <CharTitleText>Wiek</CharTitleText>
              <CharText>{char1?.age} lat</CharText>
              <CharTitleText>Czas gry</CharTitleText>
              <CharText>
                {Math.floor((char1?.gameTime ?? 0) / 86400)} d{' '}
                {Math.floor(((char1?.gameTime ?? 0) % 86400) / 3600)} hr{' '}
                {Math.floor(((char1?.gameTime ?? 0) % 3600) / 60)} min
              </CharText>
              <StartGameButton />
            </CharacterSlot>
          )}
          {isEmpty(char2!) ? (
            <EmptySlot>
              <CreateCharacterButton
                onClick={() => {
                  sendGameCommand('Creator', {
                    slot: 2,
                  })
                }}
              />
            </EmptySlot>
          ) : (
            <CharacterSlot>
              <CharTitleText>Imię postaci</CharTitleText>
              <CharText>{char2?.name}</CharText>
              <CharTitleText>Płeć postaci</CharTitleText>
              <CharText>{char2?.sex === 0 ? 'Kobieta' : 'Mężczyzna'} </CharText>
              <CharTitleText>Wiek</CharTitleText>
              <CharText>{char2?.age} lat</CharText>
              <CharTitleText>Czas gry</CharTitleText>
              <CharText>
                {Math.floor((char2?.gameTime ?? 0) / 86400)} d{' '}
                {Math.floor(((char2?.gameTime ?? 0) % 86400) / 3600)} hr{' '}
                {Math.floor(((char2?.gameTime ?? 0) % 3600) / 60)} min
              </CharText>
            </CharacterSlot>
          )}
          {isEmpty(char3!) ? (
            <EmptySlot>
              <CreateCharacterButton
                onClick={() => {
                  sendGameCommand('Creator', {
                    slot: 3,
                  })
                }}
              />
            </EmptySlot>
          ) : (
            <CharacterSlot>
              <CharTitleText>Imię postaci</CharTitleText>
              <CharText>{char3?.name}</CharText>
              <CharTitleText>Płeć postaci</CharTitleText>
              <CharText>{char3?.sex === 0 ? 'Kobieta' : 'Mężczyzna'} </CharText>
              <CharTitleText>Wiek</CharTitleText>
              <CharText>{char3?.age} lat</CharText>
              <CharTitleText>Czas gry</CharTitleText>
              <CharText>
                {Math.floor((char3?.gameTime ?? 0) / 86400)} d{' '}
                {Math.floor(((char3?.gameTime ?? 0) % 86400) / 3600)} hr{' '}
                {Math.floor(((char3?.gameTime ?? 0) % 3600) / 60)} min
              </CharText>
            </CharacterSlot>
          )}
          {isEmpty(char4!) ? (
            <EmptySlot>
              <CreateCharacterButton
                onClick={() => {
                  sendGameCommand('Creator', {
                    slot: 4,
                  })
                }}
              />
            </EmptySlot>
          ) : (
            <CharacterSlot>
              <CharTitleText>Imię postaci</CharTitleText>
              <CharText>{char4?.name}</CharText>
              <CharTitleText>Płeć postaci</CharTitleText>
              <CharText>{char4?.sex === 0 ? 'Kobieta' : 'Mężczyzna'} </CharText>
              <CharTitleText>Wiek</CharTitleText>
              <CharText>{char4?.age} lat</CharText>
              <CharTitleText>Czas gry</CharTitleText>
              <CharText>
                {Math.floor((char4?.gameTime ?? 0) / 86400)} d{' '}
                {Math.floor(((char4?.gameTime ?? 0) % 86400) / 3600)} hr{' '}
                {Math.floor(((char4?.gameTime ?? 0) % 3600) / 60)} min
              </CharText>
            </CharacterSlot>
          )}
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
  padding: 5vw; /* Use viewport width for padding to scale with resolution */
  flex-direction: column;
  gap: 5vw; /* Use viewport width for gap to scale with resolution */
  z-index: 1;
  box-sizing: border-box; /* Ensure padding is included in the element's total width and height */
`

const VideoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;

  video {
    width: 100vw;
    height: 100vh;
    object-fit: cover;
  }
`

const Text1 = styled.div`
  color: #fff;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  font-family: Caudex;
  font-size: 40px; /* Use viewport width for font size to scale with resolution */
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-align: center; /* Center the text */
`

const ColoredPlus = styled.span`
  color: #ffd390;
`

const Text2 = styled.div`
  color: #fff;
  text-align: center;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  font-family: Caudex;
  font-size: 20px; /* Use viewport width for font size to scale with resolution */
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

const EmptySlot = styled.div`
  display: flex;
  width: 324px;
  height: 451px;
  padding: 64px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  border-radius: 12px; /* Use viewport width for border radius */
  border: 2px solid #ffd390; /* Use viewport width for border width */
  background: linear-gradient(rgba(255, 211, 144, 0), rgba(10, 10, 10, 0)), url(${slotBG});
  background-size: cover; /* Ensure the background image covers the entire slot */
  margin: 0 16px; /* Use viewport width for margin */
`

const CharacterSlot = styled.div`
  display: flex;
  width: 324px;
  height: 451px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  border: 2px solid #ffd390;
  background: linear-gradient(rgba(255, 211, 144, 0), rgba(10, 10, 10, 0)),
    url(${characterBackground});
  margin: 0 16px;
`

const CharTitleText = styled.div`
  color: #ffd390;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  font-family: Caudex;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-align: center; /* Center the text */
  word-wrap: break-word; /* Ensure long words break to the next line */
  width: 100%; /* Ensure the text takes the full width of the container */
`

const CharText = styled.div`
  color: #fff;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  font-family: Caudex;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center; /* Center the text */
  word-wrap: break-word; /* Ensure long words break to the next line */
  width: 100%; /* Ensure the text takes the full width of the container */
`

const StartGameButton = styled.button`
  width: 250px; /* Set the width of the button */
  height: 83px; /* Set the height of the button */
  background: url(${startGameButton}) no-repeat center center;
  background-size: contain; /* Ensure the background image covers the button */
  border: none; /* Remove default button border */
  cursor: pointer; /* Change cursor to pointer on hover */
  margin-top: 16px;
`

const CreateCharacterButton = styled.button`
  width: 80px;
  height: 80px;
  margin-top: -45px;
`

const SlotsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
