import React, { useState, useMemo } from 'react'
import { Button, Typography } from 'antd'
import { TeamOutlined } from '@ant-design/icons'
import RolePicker from './RolePicker'
import RoleTag from './RoleTag'
import './index.scss'

export type ModelValueType = string | string[] | null | undefined

interface RoleSelectorProps {
  value?: ModelValueType
  onChange?: (value: ModelValueType) => void
  placeholder?: string
  multiple?: boolean
  disabled?: boolean
  style?: React.CSSProperties
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  placeholder = '请选择角色',
  multiple = false,
  disabled = false,
  style
}) => {
  const [pickerVisible, setPickerVisible] = useState(false)

  const valueArr = useMemo<string[]>(() => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }, [value])

  const openRolePicker = () => {
    setPickerVisible(true)
  }

  const onClose = (id: string) => {
    if (!value) return
    if (multiple && Array.isArray(value)) {
      const newVal = value.filter((v) => v !== id)
      onChange?.(newVal)
    } else {
      onChange?.(null)
    }
  }

  return (
    <div style={style}>
      <RolePicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        multiple={multiple}
        value={value}
        onChange={onChange}
      />
      <div className="role-wrapper">
        <Button
          className="role-but-item"
          disabled={disabled}
          shape="circle"
          onClick={openRolePicker}
          icon={<TeamOutlined />}
        />
        {valueArr.map((item) => (
          <RoleTag key={item} id={item} closable={!disabled} onClose={onClose} />
        ))}
        {(!value || (Array.isArray(value) && value.length === 0)) && (
          <Typography.Text type="secondary">{placeholder}</Typography.Text>
        )}
      </div>
    </div>
  )
}

export default RoleSelector
