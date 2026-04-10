import React, { useState, useEffect } from 'react'
import { Tag } from 'antd'
import { getById } from '@/api/modules/role'

interface RoleTagProps {
  id: string
  type?: 'success' | 'default' | 'warning' | 'error'
  closable?: boolean
  onClose?: (id: string) => void
}

const RoleTag: React.FC<RoleTagProps> = ({ id, type = 'default', closable = false, onClose }) => {
  const [roleInfo, setRoleInfo] = useState<{ id?: string; name?: string }>({})

  useEffect(() => {
    if (!id) return
    getById(id).then((res) => {
      if (res.success) {
        setRoleInfo({ id: res.data.id, name: res.data.name })
      }
    })
  }, [id])

  return (
    <Tag
      closable={closable}
      onClose={(e) => {
        e.preventDefault()
        onClose?.(id)
      }}
      color={type === 'default' ? undefined : type}
      style={{ borderRadius: '999px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>{roleInfo.name || id}</span>
      </div>
    </Tag>
  )
}

export default RoleTag
