import React from 'react'
import styled from 'styled-components'
import banner from './components/Login/banner.png'
import logo from './components/Login/logo.png'
import bg1 from './components/Login/login_bg1.png'
import { TooltipProvider } from './components/ui/tooltip'
import { sendGameCommand, useGameState } from './lib/electron'

function Login() {
  return (
    <PageWrapper>
      <LoginWindow>
        <Banner1></Banner1>
        <Logo></Logo>
      </LoginWindow>
    </PageWrapper>
  )
}

export default Login

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

const LoginWindow = styled.div`
  display: inline-flex;
  padding: 64px;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  border-radius: 8px;
  border: 2px solid #ffd390;
  background:
    linear-gradient(0deg, rgba(255, 211, 144, 0.1) 0%, rgba(10, 10, 10, 0) 100%),
    url(${bg1}) lightgray -258.317px -67.301px / 187.523% 117.159% no-repeat,
    url(${bg1}) lightgray 50% / cover no-repeat,
    #0a0a0a;
  background-blend-mode: normal, overlay, normal, normal;
`

const Logo = styled.div`
  width: 294.942px;
  height: 116px;
  background: url(${logo}) -90.511px -101.011px / 158.73% 269.058% no-repeat;
`

const Banner1 = styled.div`
  width: 80.103px;
  left: 27.265px;
  height: 128px;
  position: absolute;
  background: url(${banner}) lightgray 50% / cover no-repeat;
`

const Banner2 = styled.div`
  width: 80.103px;
  left: 27.265px;
  height: 128px;
  position: absolute;
  background: url(${banner}) 50% / cover no-repeat;
`
