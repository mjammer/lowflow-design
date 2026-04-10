import React from 'react'
import { Input, InputNumber, Select, Radio, Checkbox } from 'antd'
import { cloneDeep } from 'lodash-es'
import type { Field } from './type'
import UserSelector from '@/components/UserSelector'
import RoleSelector from '@/components/RoleSelector'

interface RenderProps {
  value?: any
  onChange?: (value: any) => void
  field: Field
}

const componentMap: Record<string, React.ComponentType<any>> = {
  ElInput: Input,
  ElInputNumber: InputNumber,
  ElSelect: Select,
  ElRadio: Radio.Group,
  ElCheckbox: Checkbox.Group,
  UserSelector: UserSelector,
  RoleSelector: RoleSelector
}

const Render: React.FC<RenderProps> = ({ value, onChange, field }) => {
  const fieldClone = cloneDeep(field)
  const Component = componentMap[fieldClone.name]

  if (!Component) {
    return <span>{fieldClone.name}</span>
  }

  const fieldProps = { ...(fieldClone.props || {}) }
  delete fieldProps.options

  // Build common props
  const commonProps: Record<string, any> = {
    ...fieldProps,
    value: value !== undefined ? value : fieldClone.value,
    onChange: (val: any) => {
      // antd components pass event or value directly
      const newVal = val?.target ? val.target.value : val
      onChange?.(newVal)
    }
  }

  // Handle textarea type for Input
  if (fieldClone.name === 'ElInput' && fieldClone.props?.type === 'textarea') {
    return <Input.TextArea {...commonProps} rows={fieldClone.props?.autosize?.minRows || 3} />
  }

  // Handle Select with options
  if (fieldClone.name === 'ElSelect' && fieldClone.props?.options) {
    return (
      <Select {...commonProps} style={fieldClone.props?.style}>
        {fieldClone.props.options.map((item: any) => (
          <Select.Option key={item.value} value={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </Select>
    )
  }

  // Handle Radio with options
  if (fieldClone.name === 'ElRadio' && fieldClone.props?.options) {
    return (
      <Radio.Group {...commonProps}>
        {fieldClone.props.options.map((item: any) => (
          <Radio key={item.value} value={item.value}>
            {item.label}
          </Radio>
        ))}
      </Radio.Group>
    )
  }

  // Handle Checkbox with options
  if (fieldClone.name === 'ElCheckbox' && fieldClone.props?.options) {
    return (
      <Checkbox.Group {...commonProps}>
        {fieldClone.props.options.map((item: any) => (
          <Checkbox key={item.value} value={item.value}>
            {item.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    )
  }

  return <Component {...commonProps} />
}

export default Render
