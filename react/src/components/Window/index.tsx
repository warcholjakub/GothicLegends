import React from 'react'
import styled from 'styled-components'
import { sendGameCommand } from '../../lib/electron'

type Props = {
  title: string
  children: JSX.Element | JSX.Element[]
  leftContent?: JSX.Element
  width?: number
  height?: number
}

export const Window = ({ children, title, leftContent, width = 500, height = 500 }: Props) => {
  return (
    <WindowWrapper style={{ width: width, height: height }}>
      <BorderTop src={require('./border-top.png')} alt="" />
      <WindowBodyWrapper>
        <BorderLeft src={require('./border-left.png')} alt="" />
        <WindowBody>
          <TitleHrLine src={require('./hr-title-top.png')} alt="" />
          <TitleWrapper>
            <LeftAction>{leftContent}</LeftAction>
            <WindowTitle>{title}</WindowTitle>
            <RightAction>
              <CloseButton
                src={require('./close.png')}
                alt=""
                onClick={() => {
                  sendGameCommand('StopIntercept')
                }}
              />
            </RightAction>
          </TitleWrapper>
          <TitleHrLine src={require('./hr-title-bottom.png')} alt="" />
          <WindowContent>{children}</WindowContent>
        </WindowBody>
        <BorderRight src={require('./border-right.png')} alt="" />
      </WindowBodyWrapper>
      <BottomHrLine src={require('./hr-title-bottom.png')} alt="" />
      <BorderBottom src={require('./border-bottom.png')} alt="" />
    </WindowWrapper>
  )
}

const WindowWrapper = styled.div``

const WindowBody = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const BorderTop = styled.img`
  width: 100%;
  margin-left: 7px;
  padding-right: 13px;
`

const BorderBottom = styled.img`
  width: 100%;
  margin-left: 7px;
  padding-right: 13px;
`

const BorderLeft = styled.img`
  height: 100%;
`

const BorderRight = styled.img`
  height: 100%;
`

const WindowBodyWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`

const WindowTitle = styled.div`
  height: 50px;
  background-color: #000000ab;
  text-align: center;
  color: white;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin-top: -3.5px;
  margin-bottom: -3.5px;
  flex-grow: 1;
  width: 33%;
`

const WindowContent = styled.div`
  height: 100%;
  background-color: #000c;
  padding: 10px 20px;
  overflow-y: hidden;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`

const TitleHrLine = styled.img`
  z-index: 100;
`

const BottomHrLine = styled.img`
  z-index: 100;
  margin-top: -3.5px;
  margin-left: 7px;
  padding-right: 13px;
`

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

const LeftAction = styled.div`
  background-color: #000000ab;
  height: 50px;
  flex-grow: 1;
  margin-top: -3.5px;
  margin-bottom: -3.5px;
  width: 33%;
`

const RightAction = styled.div`
  background-color: #000000ab;
  height: 50px;
  flex-grow: 1;
  margin-top: -3.5px;
  margin-bottom: -3.5px;
  display: flex;
  justify-content: end;
  width: 33%;
`

const CloseButton = styled.img`
  margin: 5px;
`
