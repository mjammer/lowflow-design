import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { Routes, Route } from 'react-router-dom'
import Home from '@/views/home'

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </ConfigProvider>
  )
}

export default App
