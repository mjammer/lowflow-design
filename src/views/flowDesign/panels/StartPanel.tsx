import React, { useState, useEffect, useMemo } from 'react'
import { Tabs, Form, Table, Checkbox } from 'antd'
import type { StartNode, FormProperty } from '../nodes/type'
import { useFlowDesign } from '../FlowDesignContext'
import ExecutionListeners from './ExecutionListeners'

interface StartPanelProps {
  activeData: StartNode
  onUpdate: () => void
}

const StartPanel: React.FC<StartPanelProps> = ({ activeData, onUpdate }) => {
  const { fields } = useFlowDesign()
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const formProperties = activeData.formProperties || []
    activeData.formProperties = fields.map((field) => {
      const existing = formProperties.find((f) => f.id === field.id)
      return {
        id: field.id,
        name: field.label,
        readonly: existing?.readonly ?? (field.readonly || false),
        hidden: existing?.hidden ?? field.hidden,
        required: existing?.required ?? (field.required || false)
      }
    })
    forceUpdate((n) => n + 1)
  }, [fields])

  const allReadonly = useMemo(() => activeData.formProperties?.every((e) => e.readonly) ?? false, [activeData.formProperties, forceUpdate])
  const allHidden = useMemo(() => activeData.formProperties?.every((e) => e.hidden) ?? false, [activeData.formProperties, forceUpdate])
  const allRequired = useMemo(() => activeData.formProperties?.every((e) => e.required) ?? false, [activeData.formProperties, forceUpdate])

  const setAllReadonly = (val: boolean) => {
    activeData.formProperties.forEach((e) => { e.readonly = val; if (val) { e.hidden = false; e.required = false } })
    forceUpdate((n) => n + 1)
    onUpdate()
  }
  const setAllHidden = (val: boolean) => {
    activeData.formProperties.forEach((e) => { e.hidden = val; if (val) { e.readonly = false; e.required = false } })
    forceUpdate((n) => n + 1)
    onUpdate()
  }
  const setAllRequired = (val: boolean) => {
    activeData.formProperties.forEach((e) => { e.required = val; if (val) { e.readonly = false; e.hidden = false } })
    forceUpdate((n) => n + 1)
    onUpdate()
  }

  const changeField = (row: FormProperty, field: 'readonly' | 'required' | 'hidden') => {
    if (field === 'readonly' && row.readonly) { row.required = false; row.hidden = false }
    if (field === 'required' && row.required) { row.readonly = false; row.hidden = false }
    if (field === 'hidden' && row.hidden) { row.readonly = false; row.required = false }
    forceUpdate((n) => n + 1)
    onUpdate()
  }

  const columns = [
    { title: '字段', dataIndex: 'name', key: 'name' },
    {
      title: <Checkbox checked={allReadonly} onChange={(e) => setAllReadonly(e.target.checked)}>只读</Checkbox>,
      key: 'readonly',
      render: (_: any, row: FormProperty) => (
        <Checkbox checked={row.readonly} onChange={(e) => { row.readonly = e.target.checked; changeField(row, 'readonly') }} />
      )
    },
    {
      title: <Checkbox checked={allRequired} onChange={(e) => setAllRequired(e.target.checked)}>必填</Checkbox>,
      key: 'required',
      render: (_: any, row: FormProperty) => (
        <Checkbox checked={row.required} onChange={(e) => { row.required = e.target.checked; changeField(row, 'required') }} />
      )
    },
    {
      title: <Checkbox checked={allHidden} onChange={(e) => setAllHidden(e.target.checked)}>隐藏</Checkbox>,
      key: 'hidden',
      render: (_: any, row: FormProperty) => (
        <Checkbox checked={row.hidden} onChange={(e) => { row.hidden = e.target.checked; changeField(row, 'hidden') }} />
      )
    }
  ]

  return (
    <Tabs
      items={[
        {
          key: 'basicSettings',
          label: '基础设置',
          children: (
            <Form layout="vertical">
              <Form.Item label="执行监听器">
                <ExecutionListeners node={activeData} onUpdate={onUpdate} />
              </Form.Item>
            </Form>
          )
        },
        {
          key: 'formPermissions',
          label: '表单权限',
          children: (
            <Table
              dataSource={activeData.formProperties}
              columns={columns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          )
        }
      ]}
    />
  )
}

export default StartPanel
