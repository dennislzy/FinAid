"use client"

import React from "react"
import { Box } from "@mui/material"
import { OuterBox, SupervisorBox } from "@/component/styles/outerBoxStyle"
import { useCookies } from "react-cookie"

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [cookies] = useCookies()
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <Box component="main" sx={OuterBox}>
      {children}
    </Box>
  )
}

