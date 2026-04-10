import React, { useState, useMemo } from 'react'
import { Button, Tag, Avatar, Typography } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import UserPicker from './UserPicker'
import UserTag from './UserTag'
import './index.scss'

export type ModelValueType = string | string[] | null | undefined

interface UserSelectorProps {
  value?: ModelValueType
  onChange?: (value: ModelValueType) => void
  placeholder?: string
  multiple?: boolean
  disabled?: boolean
  style?: React.CSSProperties
}

const UserSelector: React.FC<UserSelectorProps> = ({
  value,
  onChange,
  placeholder = '请选择用户',
  multiple = false,
  disabled = false,
  style
}) => {
  const [pickerVisible, setPickerVisible] = useState(false)

  const valueArr = useMemo<string[]>(() => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }, [value])

  const openUserPicker = () => {
    setPickerVisible(true)
  }

  const onClose = (username: string) => {
    if (!value) return
    if (multiple && Array.isArray(value)) {
      const newVal = value.filter((v) => v !== username)
      onChange?.(newVal)
    } else {
      onChange?.(null)
    }
  }

  return (
    <div style={style}>
      <UserPicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        multiple={multiple}
        value={value}
        onChange={onChange}
      />
      <div className="user-wrapper">
        <Button
          className="user-but-item"
          disabled={disabled}
          shape="circle"
          onClick={openUserPicker}
          icon={<UserAddOutlined />}
        />
        {valueArr.map((item) => (
          <UserTag key={item} username={item} closable={!disabled} onClose={onClose} />
        ))}
        {(!value || (Array.isArray(value) && value.length === 0)) && (
          <Typography.Text type="secondary">{placeholder}</Typography.Text>
        )}
      </div>
    </div>
  )
}

export default UserSelector
