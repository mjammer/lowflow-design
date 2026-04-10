import axios from 'axios'
import { userList, roleList } from './data'
import type { ResultData } from '@/api'

export function setupMock() {
  axios.interceptors.request.use((config) => {
    const url = config.url || ''

    if (url.includes('/user/info')) {
      const username = config.params?.username
      const data = userList.find((item) => item.username === username)
      const result: ResultData = { code: 200, success: true, message: '操作成功', data }
      config.adapter = () => Promise.resolve({ data: result, status: 200, statusText: 'OK', headers: {}, config })
    }

    if (url.includes('/user/list') && config.method === 'post') {
      const userIds = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data).userIds : undefined
      const data = Array.isArray(userIds)
        ? userList.filter((item) => userIds.includes(item.username))
        : userList
      const result: ResultData = { code: 200, success: true, message: '操作成功', data }
      config.adapter = () => Promise.resolve({ data: result, status: 200, statusText: 'OK', headers: {}, config })
    }

    if (url.includes('/role/info')) {
      const id = config.params?.id
      const data = roleList.find((item) => item.id === id)
      const result: ResultData = { code: 200, success: true, message: '操作成功', data }
      config.adapter = () => Promise.resolve({ data: result, status: 200, statusText: 'OK', headers: {}, config })
    }

    if (url.includes('/role/list') && config.method === 'post') {
      const roleIds = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data).roleIds : undefined
      const data = Array.isArray(roleIds)
        ? roleList.filter((item) => roleIds.includes(item.id))
        : roleList
      const result: ResultData = { code: 200, success: true, message: '操作成功', data }
      config.adapter = () => Promise.resolve({ data: result, status: 200, statusText: 'OK', headers: {}, config })
    }

    return config
  })
}
