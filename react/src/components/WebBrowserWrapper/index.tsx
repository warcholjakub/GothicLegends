import React from 'react'

type Props = {
  active: boolean
  children: JSX.Element
}

export const WebBrowserWrapper = ({ active, children }: Props) => {
  return (
    <>
      {active && <link rel="stylesheet" href="/development.css"></link>}
      {children}
    </>
  )
}
