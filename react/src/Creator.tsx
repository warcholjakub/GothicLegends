import React from 'react'
import styled from 'styled-components'
import { TooltipProvider } from './components/ui/tooltip'
import { sendGameCommand, useGameState } from './lib/electron'

export type CreatorState = {
  username: string
  gender: 0 | 1
  currBodyVar: number
  face: number
  faceShape: number
  fatness: number
}

function Creator() {
  const playerAttr = useGameState<CreatorState>('CreatorComponent')

  if (!playerAttr) {
    return null
  }

  const username = playerAttr.username || 'N/A'

  return (
    <TooltipProvider delayDuration={100} skipDelayDuration={100}>
      <Title>{username}</Title>
      <PageWrapper>
        <Column>
          <SectionContainer>
            <SectionTitle>GENDER</SectionTitle>
            <Bar src={require('./components/Creator/h2.png')} alt="" />
            <BoxSelector>
              <Image
                onClick={() => {
                  sendGameCommand('CreatorUpdate', {
                    currBodyVar: 0,
                    gender: 1,
                    face: 0,
                    faceShape: 0,
                    fatness: playerAttr.fatness,
                  })
                }}
                src={require(
                  './components/Creator/male' + (playerAttr.gender ? '-chosen' : '') + '.png',
                )}
                alt=""
              />
              <Image
                onClick={() => {
                  sendGameCommand('CreatorUpdate', {
                    currBodyVar: 0,
                    gender: 0,
                    face: 0,
                    faceShape: 0,
                    fatness: playerAttr.fatness,
                  })
                }}
                src={require(
                  './components/Creator/female' + (playerAttr.gender ? '' : '-chosen') + '.png',
                )}
                alt=""
              />
            </BoxSelector>
            <SectionTitle>BODY</SectionTitle>
            <Bar src={require('./components/Creator/h2.png')} alt="" />
            <ArrowSelector>
              <LeftArrow
                onClick={() => {
                  sendGameCommand('CreatorUpdate', {
                    currBodyVar: playerAttr.currBodyVar,
                    gender: playerAttr.gender,
                    face: playerAttr.face,
                    faceShape: playerAttr.faceShape,
                    fatness: playerAttr.fatness > -3 ? playerAttr.fatness - 1 : 3,
                  })
                }}
                src={require('./components/Creator/arrow-left.png')}
                alt=""
              />
              <SelectorText>FATNESS ({playerAttr.fatness + 3}) </SelectorText>
              <RightArrow
                onClick={() => {
                  sendGameCommand('CreatorUpdate', {
                    currBodyVar: playerAttr.currBodyVar,
                    gender: playerAttr.gender,
                    face: playerAttr.face,
                    faceShape: playerAttr.faceShape,
                    fatness: playerAttr.fatness < 3 ? playerAttr.fatness + 1 : -3,
                  })
                }}
                src={require('./components/Creator/arrow-right.png')}
                alt=""
              />
            </ArrowSelector>
          </SectionContainer>
        </Column>
        <InterColumn>
          <Button
            onClick={() => {
              sendGameCommand('ExitCreator')
            }}
          >
            <div>
              <span>READY</span>
            </div>
            <img src={require('./components/Creator/BTN.png')} alt="" />
          </Button>
        </InterColumn>
        <Column>
          <SectionContainer>
            <SectionTitle>APPEARANCE</SectionTitle>
            <Bar src={require('./components/Creator/h2.png')} alt="" />
            <ArrowSelector>
              <LeftArrow
                onClick={() => {
                  sendGameCommand('CreatorUpdate', {
                    currBodyVar:
                      playerAttr.currBodyVar > 0
                        ? playerAttr.currBodyVar - 1
                        : 5 + playerAttr.gender,
                    gender: playerAttr.gender,
                    face: playerAttr.face,
                    faceShape: playerAttr.faceShape,
                    fatness: playerAttr.fatness,
                  })
                }}
                src={require('./components/Creator/arrow-left.png')}
                alt=""
              />
              <SelectorText>
                TEXTURE ({playerAttr.currBodyVar + 1} / {playerAttr.gender ? 7 : 6})
              </SelectorText>
              <RightArrow
                onClick={() => {
                  sendGameCommand('CreatorUpdate', {
                    currBodyVar: (playerAttr.currBodyVar + 1) % (6 + playerAttr.gender),
                    gender: playerAttr.gender,
                    face: playerAttr.face,
                    faceShape: playerAttr.faceShape,
                    fatness: playerAttr.fatness,
                  })
                }}
                src={require('./components/Creator/arrow-right.png')}
                alt=""
              />
            </ArrowSelector>
            <Bar src={require('./components/Creator/h2.png')} alt="" />
            <ArrowSelector>
              <LeftArrow
                onClick={() => {
                  sendGameCommand('CreatorUpdate', {
                    currBodyVar: playerAttr.currBodyVar,
                    gender: playerAttr.gender,
                    face: playerAttr.face > 0 ? playerAttr.face - 1 : playerAttr.gender ? 12 : 20,
                    faceShape: playerAttr.faceShape,
                    fatness: playerAttr.fatness,
                  })
                }}
                src={require('./components/Creator/arrow-left.png')}
                alt=""
              />
              <SelectorText>
                FACE ({playerAttr.face + 1} / {playerAttr.gender ? 13 : 21})
              </SelectorText>
              <RightArrow
                onClick={() => {
                  sendGameCommand('CreatorUpdate', {
                    currBodyVar: playerAttr.currBodyVar,
                    gender: playerAttr.gender,
                    face: (playerAttr.face + 1) % (playerAttr.gender ? 13 : 21),
                    faceShape: playerAttr.faceShape,
                    fatness: playerAttr.fatness,
                  })
                }}
                src={require('./components/Creator/arrow-right.png')}
                alt=""
              />
            </ArrowSelector>
            <Bar src={require('./components/Creator/h2.png')} alt="" />
            <ArrowSelector>
              <LeftArrow
                onClick={() => {
                  sendGameCommand('CreatorUpdate', {
                    currBodyVar: playerAttr.currBodyVar,
                    gender: playerAttr.gender,
                    face: playerAttr.face,
                    faceShape:
                      playerAttr.faceShape > 0
                        ? playerAttr.faceShape - 1
                        : playerAttr.gender
                          ? 4
                          : 9,
                    fatness: playerAttr.fatness,
                  })
                }}
                src={require('./components/Creator/arrow-left.png')}
                alt=""
              />
              <SelectorText>
                FACE SHAPE ({playerAttr.faceShape + 1} / {playerAttr.gender ? 5 : 10})
              </SelectorText>
              <RightArrow
                onClick={() => {
                  sendGameCommand('CreatorUpdate', {
                    currBodyVar: playerAttr.currBodyVar,
                    gender: playerAttr.gender,
                    face: playerAttr.face,
                    faceShape: (playerAttr.faceShape + 1) % (playerAttr.gender ? 5 : 10),
                    fatness: playerAttr.fatness,
                  })
                }}
                src={require('./components/Creator/arrow-right.png')}
                alt=""
              />
            </ArrowSelector>
          </SectionContainer>
        </Column>
      </PageWrapper>
    </TooltipProvider>
  )
}

export default Creator

const PageWrapper = styled.div`
  display: flex;
  height: 100%;
`

const SectionContainer = styled.div`
  margin: 15px;
  max-width: 500px;
`

const SelectorText = styled.div`
  font-size: 30px;
  text-align: center;
  width: 90%;
  margin: 15px;
`

const BoxSelector = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  width: 75%;
  margin-bottom: 50px;
`

const ArrowSelector = styled.div`
  display: flex;
  margin: auto;
  width: 100%;
`

const InterColumn = styled.div`
  flex: 30%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
`

const Column = styled.div`
  flex: 35%;
  justify-content: center;
  display: flex;
`

const SectionTitle = styled.div`
  font-size: 45px;
  text-align: center;
  width: 100%;
  margin: 10px 0;
  // padding: 5px 0;
  // border-style: solid;
  // border-width: 1px;
`

const Title = styled.div`
  font-size: 60px;
  text-align: center;
  width: 100%;
`

const Image = styled.img`
  margin: 0 10px;
`

const LeftArrow = styled.img`
  float: left;
  margin: 15px;
`

const RightArrow = styled.img`
  float: right;
  margin: 15px;
`

const Bar = styled.img`
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
  margin-bottom: 5px;
  width: 75%;
`

const Button = styled.div`
  position: relative;
  width: 287px;
  height: 94px;
  margin-bottom: 150px;

  img {
    filter: brightness(70%);
  }

  div {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    width: 287px;
    height: 94px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  span {
    font-size: 40px;
    font-weight: 500;
  }
`
