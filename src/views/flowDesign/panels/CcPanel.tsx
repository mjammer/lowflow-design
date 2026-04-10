import React, { useState, useEffect, useMemo } from 'react'
import { Tabs, Form, Table, Checkbox } from 'antd'
import type { CcNode, FormProperty } from '../nodes/type'
import { useFlowDesign } from '../FlowDesignContext'
import AssigneePanel from './AssigneePanel'

interface CcPanelProps {
  activeData: CcNode
  onUpdate: () => void
}

const CcPanel: React.FC<CcPanelProps> = ({ activeData, onUpdate }) => {
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

  const setAllReadonly = (val: boolean) => {
    activeData.formProperties.forEach((e) => { e.readonly = val; if (val) e.hidden = false })
    forceUpdate((n) => n + 1); onUpdate()
  }
  const setAllHidden = (val: boolean) => {
    activeData.formProperties.forEach((e) => { e.hidden = val; if (val) e.readonly = false })
    forceUpdate((n) => n + 1); onUpdate()
  }

  const columns = [
    { title: '字段', dataIndex: 'name', key: 'name' },
    {
      title: <Checkbox checked={allReadonly} onChange={(e) => setAllReadonly(e.target.checked)}>只读</Checkbox>,
      key: 'readonly',
      render: (_: any, row: FormProperty) => (
        <Checkbox checked={row.readonly} onChange={(e) => {
          row.readonly = e.target.checked
          if (row.readonly) row.hidden = false
          forceUpdate((n) => n + 1); onUpdate()
        }} />
      )
    },
    {
      title: <Checkbox checked={allHidden} onChange={(e) => setAllHidden(e.target.checked)}>隐藏</Checkbox>,
      key: 'hidden',
      render: (_: any, row: FormProperty) => (
        <Checkbox checked={row.hidden} onChange={(e) => {
          row.hidden = e.target.checked
          if (row.hidden) row.readonly = false
          forceUpdate((n) => n + 1); onUpdate()
        }} />
      )
    }
  ]

  return (
    <Tabs
      items={[
        {
          key: 'properties',
          label: '抄送人',
          children: (
            <Form layout="vertical">
              <AssigneePanel activeData={activeData} fields={fields} type="抄送" onUpdate={onUpdate} />
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

export default CcPanel
