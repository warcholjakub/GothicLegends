import React from 'react'
import styled from 'styled-components'

type Props = {
  avatar: string
  level: number
  name: string
  hp: number
  mana: number
  type: 'player' | 'friend'
}

const MAX_HP_BAR_WIDTH = 289
const MAX_MANA_BAR_WIDTH = 271

export const HeroBar = ({ type = 'player', avatar, level, name, hp, mana }: Props) => {
  const isAlive = hp > 0
  return (
    <HeroWrapper
      style={
        type === 'friend'
          ? { transform: 'scale(0.75)', marginLeft: '-62px', marginBottom: '-25px' }
          : {}
      }
    >
      <BarBackground src={require('./herobar.png')} alt="" />
      <AvatarWrapper>
        <Avatar src={avatar} alt="" isAlive={isAlive} />
      </AvatarWrapper>
      <LevelBackground src={require('./level.png')} alt="" />
      <LevelText>{level}</LevelText>

      <HeroName>{name}</HeroName>

      <HpBarWrapper style={{ width: (hp / 100) * MAX_HP_BAR_WIDTH }}>
        <HpBar src={require('./hp-fill.png')} alt="" />
      </HpBarWrapper>
      <ManaBarWrapper style={{ width: (mana / 100) * MAX_MANA_BAR_WIDTH }}>
        <ManaBar src={require('./mana-fill.png')} alt="" />
      </ManaBarWrapper>
    </HeroWrapper>
  )
}

const BarBackground = styled.img`
  width: 381px;
  height: 117px;
`

const AvatarWrapper = styled.div`
  position: absolute;
  display: block;
  width: 67px;
  height: 67px;
  border: 1px solid #000;
  transform: rotate(45deg);
  overflow: hidden;
  top: 26px;
  left: 25px;
`

const Avatar = styled.img<{ isAlive: true | false }>`
  width: 145%;
  max-width: 145%;
  transform: rotate(-45deg);
  margin: -14px;
  filter: ${({ isAlive }) => (isAlive ? 'none' : 'saturate(0)')};
`

const HeroWrapper = styled.div`
  position: relative;
`

const LevelText = styled.div`
  position: absolute;
  top: 76px;
  left: 26px;
  height: 20px;
  width: 20px;
  font-size: 14px;
  text-align: center;
`

const LevelBackground = styled.img`
  position: absolute;
  top: 65px;
  left: 15px;
`

const HpBarWrapper = styled.div`
  position: absolute;
  top: 29px;
  left: 81px;
  overflow: hidden;
`

const HpBar = styled.img`
  width: 289px;
  height: 35px;
  max-width: unset;
`

const ManaBarWrapper = styled.div`
  position: absolute;
  top: 70px;
  left: 80px;
  overflow: hidden;
`

const ManaBar = styled.img`
  width: 271px;
  height: 20px;
  max-width: unset;
`

const HeroName = styled.div`
  text-transform: uppercase;
  position: absolute;
  top: 2px;
  left: 80px;
  font-size: 18px;
  text-shadow:
    1px 1px 2px rgb(187 181 172),
    0 0 1px rgb(187 181 163),
    0 0 0.2px rgb(187 181 172);
`
