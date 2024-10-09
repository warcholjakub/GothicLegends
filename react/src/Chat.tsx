import React, { useEffect, useState, useRef } from 'react'
import { createGlobalStyle, styled } from 'styled-components'
import Caudex from './fonts/Caudex-Regular.ttf'
import { sendGameCommand, useGameState } from './lib/electron'

type chatMessages = {
  messages: message[]
}

type message = {
  content: string
  type: string
  sender: string
}

function Chat() {
  const [input, setInput] = useState<message>()
  const [messages, setMessages] = useState<chatMessages | null>(null)
  const newMessage = useGameState<message>('newMessage')

  useEffect(() => {
    if (newMessage) {
      setMessages((prev) => {
        if (!prev) {
          return { messages: [newMessage] }
        }
        return { messages: [...prev.messages, newMessage] }
      })
    }
  }, [newMessage])

  return (
    <PageWrapper>
      <GlobalStyle />
      <ChatContainer>
        <MessageList>
          {messages?.messages.map((msg, index) => (
            <Message key={index}>
              {msg.sender}: {msg.content}
            </Message>
          ))}
        </MessageList>
        <InputContainer>
          <Input
            type="text"
            value={input?.content}
            onChange={(e) => setInput({ content: e.target.value, type: 'chat', sender: '' })}
            placeholder="Type a message..."
          />
          <Button
            onClick={() => {
              sendGameCommand('sendMessage', input)
            }}
          >
            Send
          </Button>
        </InputContainer>
      </ChatContainer>
    </PageWrapper>
  )
}

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
  padding: 1vw; /* Use viewport width for padding to scale with resolution */
  flex-direction: column;
  gap: 5vw; /* Use viewport width for gap to scale with resolution */
  z-index: 1;
  box-sizing: border-box; /* Ensure padding is included in the element's total width and height */
`

const ChatContainer = styled.div`
  width: 400px;
  height: 500px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
`

const MessageList = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
`

const Message = styled.div`
  background-color: ${(props) => (1 == 1 ? '#daf8cb' : '#ececec')};
  padding: 8px 12px;
  margin: 8px 0;
  border-radius: 10px;
  align-self: ${(props) => (1 == 1 ? 'flex-end' : 'flex-start')};
  max-width: 60%;
`

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #fff;
`

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  font-size: 14px;
`

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  margin-left: 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`

export default Chat
