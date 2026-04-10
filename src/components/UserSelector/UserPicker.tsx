import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Input, Tree, Avatar, Button } from 'antd'
import { CheckOutlined, SearchOutlined } from '@ant-design/icons'
import { getList } from '@/api/modules/user'
import type { ModelValueType } from './index'
import './UserPicker.scss'

interface Org {
  id: string
  type: 'user' | 'dept'
  avatar?: string
  name: string
  leaf: boolean
}

interface UserPickerProps {
  visible: boolean
  onClose: () => void
  multiple?: boolean
  value?: ModelValueType
  onChange?: (value: ModelValueType) => void
}

const UserPicker: React.FC<UserPickerProps> = ({
  visible,
  onClose,
  multiple = false,
  value,
  onChange
}) => {
  const [userOrgOptions, setUserOrgOptions] = useState<Org[]>([])
  const [selectedUsers, setSelectedUsers] = useState<Org[]>([])
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    if (visible) {
      // Load all users
      getList().then((res) => {
        if (res.success) {
          setUserOrgOptions(
            res.data.map((e) => ({
              id: e.username,
              name: e.name,
              type: 'user' as const,
              leaf: true,
              avatar: e.avatar
            }))
          )
        }
      })

      // Load selected users
      let userIds: string[] = []
      if (Array.isArray(value)) {
        userIds = [...value]
      } else if (value) {
        userIds = [value]
      }
      if (userIds.length > 0) {
        getList(userIds).then((res) => {
          if (res.success) {
            const users = res.data.map((user) => ({
              id: user.username,
              name: user.name,
              avatar: user.avatar,
              type: 'user' as const,
              leaf: true
            }))
            users.sort((a, b) => a.id.localeCompare(b.id))
            setSelectedUsers(users)
          }
        })
      } else {
        setSelectedUsers([])
      }
    }
  }, [visible, value])

  const filteredOptions = useMemo(() => {
    if (!searchText) return userOrgOptions
    return userOrgOptions.filter((item) => item.name.includes(searchText))
  }, [userOrgOptions, searchText])

  const onNodeClick = (data: Org) => {
    if (data.type !== 'user') return
    setSelectedUsers((prev) => {
      const index = prev.findIndex((e) => e.id === data.id)
      if (multiple) {
        if (index === -1) {
          const next = [...prev, data].sort((a, b) => a.id.localeCompare(b.id))
          return next
        } else {
          return prev.filter((_, i) => i !== index)
        }
      } else {
        if (index === -1) {
          return [data]
        } else {
          return []
        }
      }
    })
  }

  const handleConfirm = () => {
    if (multiple) {
      onChange?.(selectedUsers.map((e) => e.id))
    } else {
      if (selectedUsers.length > 0) {
        onChange?.(selectedUsers[0].id)
      } else {
        onChange?.(null)
      }
    }
    onClose()
  }

  const isSelected = (id: string) => selectedUsers.some((e) => e.id === id)

  return (
    <Modal
      title="选择用户"
      open={visible}
      onCancel={onClose}
      onOk={handleConfirm}
      width="30%"
      okText="确认"
      cancelText="取消"
    >
      <Input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="输入关键字进行查询"
        suffix={<SearchOutlined />}
        allowClear
        style={{ marginBottom: 8 }}
      />
      <div className="org-tree">
        {filteredOptions.map((data) => (
          <div
            key={data.id}
            className={`tree-node ${isSelected(data.id) ? 'is-active' : ''}`}
            onClick={() => onNodeClick(data)}
          >
            <div className="tree-node-content">
              <Avatar size={25} src={data.avatar}>
                {data.name.charAt(0)}
              </Avatar>
              <span style={{ marginLeft: 8 }}>{data.name}</span>
            </div>
            {isSelected(data.id) && <CheckOutlined className="is-selected" />}
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default UserPicker
