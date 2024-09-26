import React, { useEffect, useState } from 'react'
import { createGlobalStyle, styled } from 'styled-components'
import Caudex from './fonts/Caudex-Regular.ttf'
import characterBackground from './components/CharacterSelector/characterBackground.png'
import LeftArrow from './components/CharacterCreator/LeftArrow.svg'
import RightArrow from './components/CharacterCreator/RightArrow.svg'
import LeftBowl from './components/CharacterCreator/LeftBowl.svg'
import RightBowl from './components/CharacterCreator/RightBowl.svg'
import MaleButton from './components/CharacterCreator/Male.png'
import FemaleButton from './components/CharacterCreator/Female.png'
import Continue from './components/CharacterCreator/ContinueButton.png'
import Left from './components/CharacterCreator/Left.png'
import Right from './components/CharacterCreator/Right.png'
import audio from './components/audio/mrocznetajemnice.mp3'
import { sendGameCommand, useGameState } from './lib/electron'

export type CharacterCreatorState = {
  slot: number
}

function CharacterCreator() {
  const [error, setError] = useState<boolean>(false)
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false)

  const creatorState = useGameState<CharacterCreatorState>('CharacterCreatorComponent')

  let mroczneTajemnice = new Audio(audio)
  if (!audioPlaying) {
    mroczneTajemnice.play()
    setAudioPlaying(true)
  }
  // mroczneTajemnice.addEventListener(
  //   'ended',
  //   function () {
  //     this.currentTime = 0
  //     this.play()
  //   },
  //   false,
  // )

  function AgeError(age: number, buttonClick: boolean) {
    if (age >= 18 && age <= 70) {
      setError(false)
    } else if (buttonClick) {
      setError(true)
    }
  }

  const [name, setName] = useState<string>('')
  const [age, setAge] = useState<number>(18)
  const [gender, setGender] = useState<number>(1)

  const [faceShape, setFaceShape] = useState<number>(1)
  const [tempFaceShape, setTempFaceShape] = useState<string>('1')

  const [faceTexture, setFaceTexture] = useState<number>(1)
  const [tempFaceTexture, setTempFaceTexture] = useState<string>('1')

  const [stage, setStage] = useState<number>(1)

  useEffect(() => {
    sendGameCommand('CreatorUpdate', {
      currBodyVar: 0,
      gender: gender,
      face: faceTexture - 1,
      faceShape: faceShape - 1,
    })
  }, [gender, faceShape, faceTexture])

  useEffect(() => {
    if (age < 18 || age > 70) {
      setError(true)
    } else {
      setError(false)
    }
  }, [age])

  return stage === 1 ? (
    <div className="main">
      <PageWrapper>
        <GlobalStyle />
        <CreatorWrapper>
          <TitleText>Kreator postaci</TitleText>
          <RowWrapper>
            <Arrow src={LeftArrow} />
            <WeirdBowl src={LeftBowl} />
            <WeirdBowl src={RightBowl} />
            <Arrow src={RightArrow} />
          </RowWrapper>
          <Text1>Imię postaci {creatorState?.slot ?? 0}</Text1>
          <Text2>Wpisz imię postaci, powinno ono pasować do uniwersum </Text2>
          <InputBox
            placeholder="Imię postaci"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />

          <Text1>Wiek postaci</Text1>
          <Text2>Dopuszczalny wiek postaci mieści się w przedziale 18 - 70</Text2>
          <InputBox
            placeholder="Wiek postaci"
            value={age === 0 ? '' : age}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (!isNaN(value)) {
                setAge(value)
              } else {
                setAge(0)
              }
              AgeError(age, false)
            }}
          />

          <Text1>Płeć postaci</Text1>
          <Text2>Kliknij w kafelek, aby wybrać płeć</Text2>
          <RowWrapper>
            <GenderButton
              src={MaleButton}
              isSelected={gender === 1}
              onClick={() => {
                setGender(1)
              }}
            />
            <GenderButton
              src={FemaleButton}
              isSelected={gender === 0}
              onClick={() => {
                setGender(0)
              }}
            />
          </RowWrapper>
          <ErrorMessage>{error ? 'Niepoprawny wiek postaci!' : ''}</ErrorMessage>
          <ContinueButton
            src={Continue}
            onClick={() => {
              if (!error) {
                setStage(2)
              }
            }}
          />
        </CreatorWrapper>
      </PageWrapper>
    </div>
  ) : (
    <div className="main">
      <PageWrapper>
        <GlobalStyle />
        <CreatorWrapper>
          <TitleText>Kreator postaci</TitleText>
          <RowWrapper>
            <Arrow src={LeftArrow} />
            <WeirdBowl src={LeftBowl} />
            <WeirdBowl src={RightBowl} />
            <Arrow src={RightArrow} />
          </RowWrapper>
          <RowWrapperNC>
            <Text1>Model głowy</Text1>
            <ArrowButtonLeft
              src={Left}
              onClick={() => {
                setFaceShape(faceShape > 1 ? faceShape - 1 : gender ? 5 : 10)
                setTempFaceShape((faceShape > 1 ? faceShape - 1 : gender ? 5 : 10).toString())
              }}
            />
            <ScrollInput
              value={tempFaceShape}
              onChange={(e) => {
                if (
                  (!isNaN(Number(e.target.value)) && Number(e.target.value) <= (gender ? 5 : 10)) ||
                  e.target.value === ''
                ) {
                  setTempFaceShape(e.target.value)
                }
              }}
              onBlur={(e) => {
                if (
                  !isNaN(Number(e.target.value)) &&
                  Number(e.target.value) <= (gender ? 5 : 10) &&
                  Number(e.target.value) >= 1
                ) {
                  setFaceShape(Number(e.target.value))
                  setTempFaceShape(Number(e.target.value).toString())
                } else {
                  setTempFaceShape('')
                }
              }}
            />
            <ArrowButtonRight
              src={Right}
              onClick={() => {
                setFaceShape(faceShape < (gender ? 5 : 10) ? faceShape + 1 : 1)
                setTempFaceShape((faceShape < (gender ? 5 : 10) ? faceShape + 1 : 1).toString())
              }}
            />
          </RowWrapperNC>
          <RowWrapperNC>
            <Text1>Wybrana tekstura twarzy</Text1>
            <ArrowButtonLeft
              src={Left}
              onClick={() => {
                setFaceTexture(faceTexture > 1 ? faceTexture - 1 : gender ? 13 : 21)
                setTempFaceTexture(
                  (faceTexture > 1 ? faceTexture - 1 : gender ? 13 : 21).toString(),
                )
              }}
            />
            <ScrollInput
              value={tempFaceTexture}
              onChange={(e) => {
                if (
                  (!isNaN(Number(e.target.value)) &&
                    Number(e.target.value) <= (gender ? 13 : 21)) ||
                  e.target.value === ''
                ) {
                  setTempFaceTexture(e.target.value)
                }
              }}
              onBlur={(e) => {
                if (
                  !isNaN(Number(e.target.value)) &&
                  Number(e.target.value) <= (gender ? 13 : 21) &&
                  Number(e.target.value) >= 1
                ) {
                  setFaceTexture(Number(e.target.value))
                  setTempFaceTexture(Number(e.target.value).toString())
                } else {
                  setTempFaceTexture('')
                }
              }}
            />
            <ArrowButtonRight
              src={Right}
              onClick={() => {
                setFaceTexture(faceTexture < (gender ? 13 : 21) ? faceTexture + 1 : 1)
                setTempFaceTexture(
                  (faceTexture < (gender ? 13 : 21) ? faceTexture + 1 : 1).toString(),
                )
              }}
            />
          </RowWrapperNC>
          <ContinueButton
            src={Continue}
            onClick={() => {
              sendGameCommand('ExitCreator', {})
            }}
          />
        </CreatorWrapper>
      </PageWrapper>
    </div>
  )
}

export default CharacterCreator

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
  padding: 64px; /* Use viewport width for padding to scale with resolution */
  gap: 10px; /* Use viewport width for gap to scale with resolution */
`

const CreatorWrapper = styled.div`
  display: flex;
  width: 600px;
  height: 952px;
  padding: 32px;
  flex-direction: column;
  gap: 24px;
  flex-shrink: 0;

  border-radius: 12px;
  border: 2px solid #ffd390;
  background: url(${characterBackground});
  background-size: cover;
`
const RowWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

const RowWrapperNC = styled.div`
  display: flex;
  flex-direction: row;
`

const TitleText = styled.div`
  color: #fff;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  font-family: Caudex;
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
`

const Text1 = styled.div`
  align-self: stretch;

  color: #fff;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  font-family: Caudex;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`

const Text2 = styled.div`
  color: #a3a3a3;

  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  font-family: Caudex;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`

const Arrow = styled.img`
  width: 145.659px;
  height: 10.019px;
  flex-shrink: 0;
`

const WeirdBowl = styled.img`
  width: 52.796px;
  height: 12.713px;
  flex-shrink: 0;
  margin-left: 5px;
  margin-right: 5px;
`

const InputBox = styled.input`
  display: flex;
  height: 56px;
  padding: 12px;
  align-items: center;
  gap: 10px;
  align-self: stretch;

  border-radius: 4px;
  border: 1px solid #7a6545;
  background: rgba(10, 10, 10, 0.8);
`

const GenderButton = styled.img<{ isSelected: boolean }>`
  margin-left: 8px;
  margin-right: 8px;
  border: 2px solid ${({ isSelected }) => (isSelected ? '#ffd390' : 'transparent')};
  border-radius: 5%; /* Make the border round */
  cursor: pointer;
  transition: border-color 0.15s ease-in-out;
`

const ErrorMessage = styled.div`
  align-self: center;
  margin-top: auto;
  cursor: pointer;

  color: #ed2939;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  font-family: Caudex;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`

const ContinueButton = styled.img`
  align-self: center;
  margin-top: auto;
  cursor: pointer;
`

const ArrowButtonRight = styled.img`
  margin-left: 8px;
`

const ArrowButtonLeft = styled.img`
  margin-left: auto;
  margin-right: 8px;
`

const ScrollInput = styled.input`
  display: flex;
  width: 75px;
  height: 40px;
  text-align: center;
  gap: 10px;

  border-radius: 4px;
  border: 1px solid #7a6545;
  background: rgba(10, 10, 10, 0.8);

  color: #fff;

  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  font-family: Caudex;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`
