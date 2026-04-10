import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Input } from 'antd'
import { CheckOutlined, SearchOutlined, TeamOutlined } from '@ant-design/icons'
import { getList } from '@/api/modules/role'
import type { ModelValueType } from './index'
import './RolePicker.scss'

interface Role {
  id: string
  name: string
}

interface RolePickerProps {
  visible: boolean
  onClose: () => void
  multiple?: boolean
  value?: ModelValueType
  onChange?: (value: ModelValueType) => void
}

const RolePicker: React.FC<RolePickerProps> = ({
  visible,
  onClose,
  multiple = false,
  value,
  onChange
}) => {
  const [roleOrgOptions, setRoleOrgOptions] = useState<Role[]>([])
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([])
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    if (visible) {
      getList().then((res) => {
        if (res.success) {
          setRoleOrgOptions(res.data.map((e) => ({ id: e.id, name: e.name })))
        }
      })

      let roleIds: string[] = []
      if (Array.isArray(value)) {
        roleIds = [...value]
      } else if (value) {
        roleIds = [value]
      }
      if (roleIds.length > 0) {
        getList(roleIds).then((res) => {
          if (res.success) {
            const roles = res.data.map((role) => ({ id: role.id, name: role.name }))
            roles.sort((a, b) => a.id.localeCompare(b.id))
            setSelectedRoles(roles)
          }
        })
      } else {
        setSelectedRoles([])
      }
    }
  }, [visible, value])

  const filteredOptions = useMemo(() => {
    if (!searchText) return roleOrgOptions
    return roleOrgOptions.filter((item) => item.name.includes(searchText))
  }, [roleOrgOptions, searchText])

  const onNodeClick = (data: Role) => {
    setSelectedRoles((prev) => {
      const index = prev.findIndex((e) => e.id === data.id)
      if (multiple) {
        if (index === -1) {
          return [...prev, data].sort((a, b) => a.id.localeCompare(b.id))
        } else {
          return prev.filter((_, i) => i !== index)
        }
      } else {
        return index === -1 ? [data] : []
      }
    })
  }

  const handleConfirm = () => {
    if (multiple) {
      onChange?.(selectedRoles.map((e) => e.id))
    } else {
      onChange?.(selectedRoles.length > 0 ? selectedRoles[0].id : null)
    }
    onClose()
  }

  const isSelected = (id: string) => selectedRoles.some((e) => e.id === id)

  return (
    <Modal
      title="选择角色"
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
              <TeamOutlined style={{ fontSize: 16 }} />
              <span style={{ marginLeft: 8 }}>{data.name}</span>
            </div>
            {isSelected(data.id) && <CheckOutlined className="is-selected" />}
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default RolePicker
