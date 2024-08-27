import React from 'react'
import styled from 'styled-components'
import { Window } from './components/Window'
import { sendGameCommand, useGameState } from './lib/electron'

const attributes = [
  {
    id: 'hitpoints',
    icon: 'Barbarian_5',
    name: 'Punkty Życia',
    description: 'Zdolność postaci do wytrzymywania obrażeń.',
  },
  {
    id: 'mana',
    icon: 'Barbarian_12',
    name: 'Punkty Many',
    description: 'Ilość energii wykorzystywanej do rzucania zaklęć.',
  },
  {
    id: 'strength',
    icon: 'Barbarian_6',
    name: 'Siła',
    description: 'Wpływa na zdolność zadawania większych obrażeń fizycznych.',
  },
  {
    id: 'dexterity',
    icon: 'Barbarian_7',
    name: 'Zręczność',
    description: 'Kluczowa dla celności i skuteczności używania broni dystansowej.',
  },
  {
    id: '1h',
    icon: 'Barbarian_18',
    name: 'Broń Jednoręczna',
    description: 'Umiejętność efektywnego używania lekkiej broni.',
  },
  {
    id: '2h',
    icon: 'Barbarian_22',
    name: 'Broń Dwuręczna',
    description: 'Zdolność do walki cięższymi, dwuręcznymi rodzajami broni.',
  },
  {
    id: 'bow',
    icon: 'Barbarian_30',
    name: 'Łuk',
    description: 'Umiejętność strzelania z łuku, zwiększająca precyzję trafień.',
  },
  {
    id: 'cbow',
    icon: 'Barbarian_37',
    name: 'Kusza',
    description: 'Umiejętność strzelania z kuszy, zwiększająca precyzję trafień.',
  },
  {
    id: 'mageCircle',
    icon: 'Barbarian_8',
    name: 'Krąg Magii',
    description: 'Poziom umiejętności magicznych, umożliwiający dostęp do potężniejszych zaklęć.',
  },
]

export type HeroPageState = {
  lp: number
  hitpoints: number
  mana: number
  strength: number
  dexterity: number
  '1h': number
  '2h': number
  bow: number
  cbow: number
  mageCircle: number
}

const HeroPage = () => {
  const heroAttributes = useGameState<HeroPageState>('HeroComponent')

  if (!heroAttributes) {
    return null
  }

  return (
    <PageWrapper>
      <Window
        title="Postać"
        leftContent={<AvaliablePoints>PN: {heroAttributes.lp}</AvaliablePoints>}
      >
        {attributes.map((a) => (
          <AttributeBox key={a.icon}>
            <AttributeImage src={`./icons/${a.icon}.png`} />
            <AttributeName>
              <Name>{a.name}</Name>
              <Description>{a.description}</Description>
            </AttributeName>
            <PointsWrapper>
              <AddButton
                src={require('./add.png')}
                alt=""
                onClick={() => sendGameCommand('heroUpgrade', { id: a.id })}
              />
              <Points>{heroAttributes[a.id as keyof HeroPageState]}</Points>
            </PointsWrapper>
          </AttributeBox>
        ))}
      </Window>
    </PageWrapper>
  )
}

export default HeroPage

const PageWrapper = styled.div`
  margin-top: 200px;
  margin-left: 200px;
`

const AvaliablePoints = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 10px;
`

const AttributeBox = styled.div`
  width: 100%;
  height: 60px;
  background-color: #0e0e0de8;
  padding: 10px;
  display: flex;
  margin-bottom: 10px;
`

const AttributeImage = styled.img`
  height: 100%;
  width: auto;
  margin-right: 10px;
`

const AttributeName = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Name = styled.div`
  color: #e7ab6e;
  font-size: 16px;
  line-height: 16px;
`

const Description = styled.div`
  font-size: 13px;
  line-height: 13px;
  color: #c5bcb1;
`

const Points = styled.div`
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: -5px;
  color: #ffa128;
  font-size: 20px;
  border-left: 1px solid #1d1c1b;
  margin-left: 8px;
`

const AddButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`

const PointsWrapper = styled.div`
  display: flex;
  align-items: center;
`
