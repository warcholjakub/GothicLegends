import React, { useEffect, useState, useRef } from 'react'
import { createGlobalStyle, styled } from 'styled-components'
import Caudex from './fonts/Caudex-Regular.ttf'
import { sendGameCommand, useGameState } from './lib/electron'
import SectionOff from './components/Chat/SectionOff.png'
import SectionOn from './components/Chat/SectionOn.png'

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
  const [activeSection, setActiveSection] = useState('IC')
  const [notifications, setNotifications] = useState({
    IC: false,
    OOC: false,
    PW: false,
    GOOC: false,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<message | null>(null)

  const handleSectionClick = (section: string) => {
    setActiveSection(section)
    setInput((prevInput) => ({ content: prevInput?.content || '', type: section, sender: 'me' }))
    setNotifications((prev) => ({ ...prev, [section]: false }))
  }

  useEffect(() => {
    if (newMessage && newMessage !== lastMessageRef.current) {
      setMessages((prev) => {
        if (!prev) {
          return { messages: [newMessage] }
        }
        return { messages: [...prev.messages, newMessage] }
      })
      lastMessageRef.current = newMessage

      if (newMessage.type !== activeSection) {
        setNotifications((prev) => ({ ...prev, [newMessage.type.toUpperCase()]: true }))
      }
    }
  }, [newMessage, activeSection])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
    }
  }, [messages, activeSection])

  const formatMessageContent = (content: string) => {
    const regexMe = /#\s*(.*?)\s*#/g
    const regexDo = /\*\s*(.*?)\s*\*/g
    const regexGDo = /\$\s*(.*?)\s*\$/g
    const parts = content.split(/(#.*?#|\*.*?\*)/g)
    return parts.map((part, index) => {
      if (regexMe.test(part)) {
        return (
          <Message style={{ color: '#c9b902' }} key={index}>
            {part.replace(/#/g, '')}
          </Message>
        )
      } else if (regexDo.test(part)) {
        return (
          <Message style={{ color: '#0f6bff' }} key={index}>
            {part.replace(/\*/g, '')}
          </Message>
        )
      } else if (regexGDo.test(part)) {
        return (
          <Message style={{ color: '#ff4747' }} key={index}>
            {part.replace(/\$/g, '')}
          </Message>
        )
      } else {
        return <Message key={index}>{part}</Message>
      }
    })
  }
  return (
    <PageWrapper>
      <GlobalStyle />
      <ChatContainer>
        <SectionList>
          <Section
            isActive={activeSection === 'IC'}
            notification={notifications.IC}
            onClick={() => handleSectionClick('IC')}
          >
            <SectionText>IC</SectionText>
          </Section>
          <Section
            isActive={activeSection === 'OOC'}
            notification={notifications.OOC}
            onClick={() => handleSectionClick('OOC')}
          >
            <SectionText>OOC</SectionText>
          </Section>
          <Section
            isActive={activeSection === 'GOOC'}
            notification={notifications.GOOC}
            onClick={() => handleSectionClick('GOOC')}
          >
            <SectionText>GOOC</SectionText>
          </Section>
        </SectionList>
        <MessageList ref={messagesEndRef}>
          {messages?.messages.map(
            (msg, index) =>
              msg.type === activeSection && (
                <Message key={index}>
                  <MessageSender>{msg.sender}</MessageSender> {formatMessageContent(msg.content)}
                </Message>
              ),
          )}
        </MessageList>
        <InputContainer>
          <Input
            type="text"
            value={input?.content}
            onChange={(e) => setInput({ content: e.target.value, type: activeSection, sender: '' })}
            placeholder="Type a message..."
          />
          <Button
            onClick={() => {
              sendGameCommand('sendMessage', input)
              setInput({ content: '', type: activeSection, sender: 'me' })
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
  flex-direction: row;
  gap: 5vw; /* Use viewport width for gap to scale with resolution */
  z-index: 1;
  box-sizing: border-box; /* Ensure padding is included in the element's total width and height */
`

const ChatContainer = styled.div`
  width: 686px;
`

const SectionList = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
  flex-direction: row;
`

const MessageList = styled.div`
  padding: 10px;
  overflow-y: auto;
  display: flex;
  height: 250px;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  background: rgba(0, 0, 0, 0.8);
  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: #888 #333; /* For Firefox */

  &::-webkit-scrollbar {
    width: 8px; /* For Chrome, Safari, and Opera */
  }

  &::-webkit-scrollbar-track {
    background: #333; /* For Chrome, Safari, and Opera */
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888; /* For Chrome, Safari, and Opera */
    border-radius: 10px; /* For Chrome, Safari, and Opera */
    border: 2px solid #333; /* For Chrome, Safari, and Opera */
  }
`

const Message = styled.div`
  margin-right: 4px;
  margin-top: 4px;
  display: flex;
  flex-direction: row;
  max-width: 100%;
  word-wrap: break-word;
  word-break: break-word;
`

const MessageSender = styled.div`
  color: #fff;
  font-family: Caudex;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-right: 8px;
  margin-top: 5.5px;
  white-space: nowrap;
`

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  background: rgba(0, 0, 0, 0.8);
`

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.8);
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

const Section = styled.button<{ isActive: boolean; notification: boolean }>`
  display: flex;
  width: 110px;
  height: 42px;
  padding: 8px 32px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  background: url(${(props) => (props.isActive ? SectionOn : SectionOff)});
  position: relative;

  ${(props) =>
    props.notification &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 5px;
      right: 5px;
      width: 10px;
      height: 10px;
      background-color: #FF4747;
      border-radius: 50%;
    }
  `}
`

const SectionText = styled.div`
  color: #ccc;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  -webkit-text-stroke-width: 1;
  -webkit-text-stroke-color: #434343;
  font-family: Caudex;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`

const PurpleText = styled.span`
  color: purple;
`

const BlueText = styled.span`
  color: blue;
`

export default Chat
