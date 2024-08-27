import React from 'react'
import styled from 'styled-components'

const addLineBreak = (str: string) =>
  str.split('\n').map((subStr) => {
    return (
      <>
        {subStr}
        <br />
      </>
    )
  })

export const Notification = ({ title, text }: { title: string; text: string }) => {
  return (
    <Overlay>
      <Container>
        <NotificationWrapper>
          <NotificationHeader>{title}</NotificationHeader>
          <Separator src={require('./separator.png')} alt="" />
          <NotificationText>{addLineBreak(text)}</NotificationText>
        </NotificationWrapper>
      </Container>
    </Overlay>
  )
}

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

const Container = styled.div`
  z-index: 100;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.5s linear forwards;
  opacity: 0;

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }

`

const NotificationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 650px;
  text-align: center;
  background-color: #0000009c;
  box-shadow: 0px 0px 20px #000;
  border-radius: 10px;
  padding: 10px;
  margin: 20px;
`

const Separator = styled.img``

const NotificationHeader = styled.h1`
  text-transform: uppercase;
  font-size: 40px;
  text-shadow: 0.5px 0.866025px 0 #000000;
`

const NotificationText = styled.h2`
  margin-top: 10px;
  text-align: center;
  text-shadow: 0.5px 0.866025px 0 #000000;
  line-height: 24px;
  width: 550px;
  margin-bottom: 10px;
`
