import React, { useEffect, useState } from 'react'
import { createGlobalStyle, styled } from 'styled-components'
import banner from './components/Login/banner.png'
import logo from './components/Login/logo.png'
import bg1 from './components/Login/login_bg1.png'
import background from './components/Login/background.png'
import Caudex from './fonts/Caudex-Regular.ttf'
import bgWideo from './components/bgWideo.mp4'
import { TooltipProvider } from './components/ui/tooltip'
import { sendGameCommand, useGameState } from './lib/electron'

function Login() {
  const [username, setUsername] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [rememberMe, setRememberMe] = useState<boolean>(false)

  useEffect(() => {
    const userStore = localStorage.getItem('username')
    const passStore = localStorage.getItem('password')
    const rememberMe = localStorage.getItem('rememberMe')
    if (rememberMe === 'true') {
      setRememberMe(true)
    }
    if (userStore && rememberMe === 'true') {
      setUsername(userStore)
    }
    if (passStore && rememberMe === 'true') {
      setPassword(passStore)
    }
  }, [])

  const saveLoginData = () => {
    if (rememberMe) {
      localStorage.setItem('username', username!)
      localStorage.setItem('password', password!)
      localStorage.setItem('rememberMe', 'true')
    } else {
      localStorage.removeItem('username')
      localStorage.removeItem('password')
      localStorage.removeItem('rememberMe')
    }
  }

  return (
    <div className="main">
      <VideoWrapper>
        <video src={bgWideo} autoPlay muted loop>
          Your browser does not support the video tag.
        </video>
      </VideoWrapper>
      <PageWrapper>
        <GlobalStyle />
        <LoginWindow>
          <Banner1 />
          <Logo />
          <Banner2 />
          <Text1>Login</Text1>
          <Input1
            placeholder="Login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Text1>Hasło</Text1>
          <PasswordInput
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <CheckboxWrapper>
            <Checkbox checked={rememberMe} onChange={() => setRememberMe(!rememberMe)}></Checkbox>
            <Text2>Zapamiętaj login i hasło</Text2>
          </CheckboxWrapper>
          <LoginButton
            onClick={() => {
              saveLoginData()
              sendGameCommand('LoginAttempt', {
                username: username,
                password: password,
                rme: rememberMe,
              })
            }}
          >
            Zaloguj
          </LoginButton>
        </LoginWindow>
      </PageWrapper>
    </div>
  )
}

export default Login

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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`
const VideoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const LoginWindow = styled.div`
  height: 58vh; /* 58% of viewport height */
  width: 32vw; /* 32% of viewport width */
  display: inline-flex;
  padding: 5.93vh; /* 64px / 1080 * 100 */
  flex-direction: column;
  align-items: center;
  border-radius: 0.74vh; /* 8px / 1080 * 100 */
  border: 0.19vh solid #ffd390; /* 2px / 1080 * 100 */
  background:
    linear-gradient(0deg, rgba(255, 211, 144, 0.1) 0%, rgba(10, 10, 10, 0) 100%),
    url(${background}) -13.45vw -6.23vh / 187.523% 117.159% no-repeat,
    url(${bg1}) 50% / cover no-repeat,
    #0a0a0a;
  background-blend-mode: normal, overlay, normal, normal;
  position: relative;
`

const Logo = styled.div`
  width: 15vw;
  height: 10.7vh;
  background: url(${logo}) -4.71vw -9.36vh / 158.73% 269.058% no-repeat;
  margin-bottom: 2.96vh; /* 32px / 1080 * 100 */
  margin-top: -1vh;
  object-fit: contain;
`

const Banner1 = styled.div`
  width: 4.17vw;
  left: 1.42vw; /* 1.42 vw */
  height: auto;
  aspect-ratio: 0.625; /* Maintain aspect ratio (80.103 / 128 ≈ 0.625) */
  position: absolute;
  background: url(${banner}) 50% / contain no-repeat;
  margin-top: -5.93vh; /* -64px / 1080 * 100 */
`

const Banner2 = styled.div`
  width: 4.17vw;
  right: 1.44vw; /* 1.44 vw */
  height: auto;
  aspect-ratio: 0.625; /* Maintain aspect ratio (80.103 / 128 ≈ 0.625) */
  position: absolute;
  background: url(${banner}) 50% / contain no-repeat;
  margin-top: -5.93vh; /* -64px / 1080 * 100 */
`

const Text1 = styled.div`
  align-self: stretch;
  color: #fff;
  text-shadow: 0px 0px 0.37vh rgba(0, 0, 0, 0.25); /* 4px / 1080 * 100 */
  font-family: Caudex;
  font-size: 1.67vh; /* 18px / 1080 * 100 */
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 0.74vh; /* 8px / 1080 * 100 */
`

const Text2 = styled.div`
  color: #fff;
  text-shadow: 0px 0px 0.37vh rgba(0, 0, 0, 0.25); /* 4px / 1080 * 100 */
  font-family: Caudex;
  font-size: 1.48vh; /* 16px / 1080 * 100 */
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  align-self: flex-start;
`

const Input1 = styled.input`
  display: flex;
  padding: 1.11vh; /* 12px / 1080 * 100 */
  align-items: center;
  gap: 0.93vh; /* 10px / 1080 * 100 */
  align-self: stretch;
  border-radius: 0.37vh; /* 4px / 1080 * 100 */
  border: 0.09vh solid #7a6545; /* 1px / 1080 * 100 */
  background: rgba(10, 10, 10, 0.8);
  margin-bottom: 1.48vh; /* 16px / 1080 * 100 */
`
const PasswordInput = styled(Input1).attrs({ type: 'password' })``

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1.48vh; /* 16px / 1080 * 100 */
  width: 100%;
`

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  display: flex;
  width: 1.85vh; /* 20px / 1080 * 100 */
  height: 1.85vh; /* 20px / 1080 * 100 */
  padding: 0.51vh 0.26vh; /* 5.517px 2.759px / 1080 * 100 */
  justify-content: center;
  align-items: center;
  gap: 0.13vh; /* 1.379px / 1080 * 100 */
  align-self: flex-start;

  border-radius: 0.13vh; /* 1.379px / 1080 * 100 */
  border: 0.03vh solid #ffd390; /* 0.345px / 1080 * 100 */
  background: linear-gradient(0deg, rgba(157, 117, 86, 0.8) 0%, rgba(157, 117, 86, 0.8) 100%),
    #0a0a0a;
  box-shadow: 0px 0px 0.77vh 0.26vh rgba(10, 10, 10, 0.8) inset; /* 8.276px 2.759px / 1080 * 100 */
  margin-right: 0.74vh; /* 8px / 1080 * 100 */

  appearance: none;
  cursor: pointer;

  &:checked::before {
    content: '';
    display: block;
    width: 1.11vh; /* 14px / 1080 * 100 */
    height: 1.11vh; /* 12px / 1080 * 100 */
    background-color: rgba(255, 211, 144, 0.8);
    border-radius: 0.08vh; /* 0.828px / 1080 * 100 */
    box-shadow:
      0px 0px 0.93vh rgba(0, 0, 0, 0.8),
      /* 10px / 1080 * 100 */ 0px 0.37vh 0.74vh rgba(0, 0, 0, 0.5); /* 4px 8px / 1080 * 100 */
  }
`

const LoginButton = styled.button`
  display: flex;
  width: 15.63vw; /* 300px / 1920 * 100 */
  padding: 1.48vh 0.74vh; /* 16px 8px / 1080 * 100 */
  justify-content: center;
  align-items: center;
  gap: 0.37vh; /* 4px / 1080 * 100 */
  margin-top: 3.7vh; /* 40px / 1080 * 100 */

  border-radius: 0.37vh; /* 4px / 1080 * 100 */
  border: 0.09vh solid #ffd390; /* 1px / 1080 * 100 */
  background:
    url(${background}) 50% / cover no-repeat,
    linear-gradient(0deg, rgba(157, 117, 86, 0.8) 0%, rgba(157, 117, 86, 0.8) 100%),
    #0a0a0a;
  background-blend-mode: luminosity, normal, normal;
  box-shadow: 0px 0px 24px 8px rgba(10, 10, 10, 0.8) inset;

  color: #fff;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  -webkit-text-stroke-width: 1;
  -webkit-text-stroke-color: #7a6545;
  font-family: Caudex;
  font-size: 1.85vh; /* 20px / 1080 * 100 */
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`
