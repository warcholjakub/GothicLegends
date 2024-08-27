import React from 'react'
import styled from 'styled-components'

export type QuestStatus = 'inprogress' | 'failed' | 'done'

export const Quests = ({ children }: { children: JSX.Element[] }) => {
  return (
    <QuestsWrapper>
      <Title>Zadania</Title>
      <Separator src={require('./bar.png')} alt="" />
      <QuestList>{children}</QuestList>
    </QuestsWrapper>
  )
}

export const QuestTitle = ({ title }: { title: string }) => {
  return <QuestTitleText>{title}</QuestTitleText>
}

export const Quest = ({
  title,
  status = 'inprogress',
}: {
  title: string
  status?: QuestStatus
}) => {
  return (
    <QuestWrapper>
      <CheckboxWrapper>
        <QuestCheckbox src={require('./check-empty.jpg')} alt="" />
        {status === 'done' && <QuestCheckboxStatus src={require('./check-complete.png')} alt="" />}
        {status === 'failed' && <QuestCheckboxStatus src={require('./check-failed.png')} alt="" />}
      </CheckboxWrapper>
      <QuestText>{title}</QuestText>
    </QuestWrapper>
  )
}

const QuestsWrapper = styled.div`
  max-width: 250px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  background-color: #000000bf;
  box-shadow: 0px 0px 10px #000;
  border-radius: 10px;
  padding: 10px;
`

const Title = styled.h2`
  font-size: 18px;
  text-transform: uppercase;
  color: #cac2b8;
  text-shadow: 0.5px 0.866025px 0 #000000;
`

const QuestTitleText = styled.h2`
  color: #e4dfd7;
  font-size: 15px;
  text-shadow: 0.5px 0.866025px 0 #000000;
  margin-top: 5px;
`

const QuestText = styled.p`
  text-shadow: 0.5px 0.866025px 0 #000000;
  font-size: 14px;
`

const Separator = styled.img``

const QuestList = styled.div``

const QuestWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`

const QuestCheckbox = styled.img`
  height: 12px;
  width: 12px;
  position: absolute;
  top: 0;
  left: 0;
`

const QuestCheckboxStatus = styled.img`
  height: 8px;
  width: 8px;
  position: absolute;
  top: 2px;
  left: 2px;
`

const CheckboxWrapper = styled.div`
  position: relative;
  margin-right: 3px;
  height: 12px;
  width: 12px;
`
