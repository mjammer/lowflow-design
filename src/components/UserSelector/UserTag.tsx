import React, { useState, useEffect } from 'react'
import { Tag, Avatar } from 'antd'
import { getByUsername } from '@/api/modules/user'

interface UserTagProps {
  username: string
  type?: 'success' | 'default' | 'warning' | 'error'
  closable?: boolean
  onClose?: (username: string) => void
}

const UserTag: React.FC<UserTagProps> = ({ username, type = 'default', closable = false, onClose }) => {
  const [userInfo, setUserInfo] = useState<{ username?: string; avatar?: string; name?: string }>({})

  useEffect(() => {
    if (!username) return
    getByUsername(username).then((res) => {
      if (res.success) {
        setUserInfo({
          username: res.data.username,
          avatar: res.data.avatar,
          name: res.data.name
        })
      }
    })
  }, [username])

  return (
    <Tag
      closable={closable}
      onClose={(e) => {
        e.preventDefault()
        onClose?.(username)
      }}
      color={type === 'default' ? undefined : type}
      style={{ borderRadius: '999px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Avatar size={20} src={userInfo.avatar}>
          {(userInfo.name || username).charAt(0)}
        </Avatar>
        <span>{userInfo.name || username}</span>
      </div>
    </Tag>
  )
}

export default UserTag
