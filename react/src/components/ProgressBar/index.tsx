import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { sendGameCommand } from '../../lib/electron'

type Props = {
  isVisible: boolean
  time: number
  icon: string
  label: string
}

export const ProgressBar = ({ isVisible, time, icon, label }: Props) => {
  const [animationEnded, setAnimationEnded] = useState(false)
  const fillingBarRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const onAnimationEnd = () => {
      setAnimationEnded(true)
    }

    const fillingBarElement = fillingBarRef.current
    if (fillingBarElement) {
      fillingBarElement.addEventListener('animationend', onAnimationEnd)

      return () => {
        fillingBarElement.removeEventListener('animationend', onAnimationEnd)
      }
    }
    return () => {}
  }, [])

  useEffect(() => {
    if (animationEnded) {
      sendGameCommand('ReviveSuccess')
      setAnimationEnded(false)
    }
  }, [animationEnded])

  if (!isVisible) {
    return null
  }

  return (
    <Container>
      <BarWrapper style={{ transform: 'scale(1)' }}>
        <BarBackground src={require('./bar.png')} alt="" />
        <FillingBarWrapper>
          <FillingBarLabel label={label}>{label}</FillingBarLabel>
          <FillingBar
            ref={fillingBarRef}
            time={time}
            src={require('./filling.png')}
            alt=""
            onAnimationEnd={() => setAnimationEnded(true)}
          />
        </FillingBarWrapper>
        <IconWrapper>
          <Icon src={icon} alt="" />
        </IconWrapper>
      </BarWrapper>
    </Container>
  )
}

const Container = styled.div`
  z-index: 100;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
`
const BarBackground = styled.img`
  width: 512px;
  height: 49px;
`

const IconWrapper = styled.div`
  position: absolute;
  display: block;
  width: 38px;
  height: 37px;
  border: 1px solid #000;
  transform: rotate(45deg);
  overflow: hidden;
  top: 10px;
  left: 7px;
`

const Icon = styled.img`
  max-width: 160%;
  transform: rotate(-45deg);
  margin: -14px;
`

const BarWrapper = styled.div`
  position: relative;
  top: 24vw;
  width: 100%;
  margin-left: 20%;
`

const FillingBarWrapper = styled.div`
  position: absolute;
  top: 11px;
  left: 36px;
  width: 100%;
`

const FillingBar = styled.img<{ time: number }>`
  height: 26px;
  width: 0;
  animation-name: progressBar;
  animation-timing-function: linear;
  animation-duration: ${(props) => props.time}s;
  @keyframes progressBar {
    0% {
      width: 0%;
    }

    100% {
      width: 470px;
    }
  }
`

const FillingBarLabel = styled.div<{ label: string }>`
  color: #fff;
  font-size: 20px;
  position: absolute;
  left: 20px;
  top: -1px;
  font-weight: bold;
`
