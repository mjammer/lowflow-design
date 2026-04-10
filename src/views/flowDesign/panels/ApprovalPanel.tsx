import React, { useState, useEffect, useMemo } from 'react'
import { Tabs, Form, Radio, InputNumber, Select, Table, Checkbox, Switch, Divider, Row, Col, Typography } from 'antd'
import {
  CheckCircleOutlined, CloseCircleOutlined, RollbackOutlined,
  SwapOutlined, UserOutlined, UserAddOutlined, UserDeleteOutlined
} from '@ant-design/icons'
import type { ApprovalNode, FormProperty } from '../nodes/type'
import { useFlowDesign } from '../FlowDesignContext'
import UserSelector from '@/components/UserSelector'
import AssigneePanel from './AssigneePanel'
import TaskListeners from './TaskListeners'
import SvgIcon from '@/components/SvgIcon'
import './ApprovalPanel.scss'

interface ApprovalPanelProps {
  activeData: ApprovalNode
  onUpdate: () => void
}

const ApprovalPanel: React.FC<ApprovalPanelProps> = ({ activeData, onUpdate }) => {
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
    forceUpdate((n) => n + 1); onUpdate()
  }
  const setAllHidden = (val: boolean) => {
    activeData.formProperties.forEach((e) => { e.hidden = val; if (val) { e.readonly = false; e.required = false } })
    forceUpdate((n) => n + 1); onUpdate()
  }
  const setAllRequired = (val: boolean) => {
    activeData.formProperties.forEach((e) => { e.required = val; if (val) { e.readonly = false; e.hidden = false } })
    forceUpdate((n) => n + 1); onUpdate()
  }

  const changeField = (row: FormProperty, field: 'readonly' | 'required' | 'hidden') => {
    if (field === 'readonly' && row.readonly) { row.required = false; row.hidden = false }
    if (field === 'required' && row.required) { row.readonly = false; row.hidden = false }
    if (field === 'hidden' && row.hidden) { row.readonly = false; row.required = false }
    forceUpdate((n) => n + 1); onUpdate()
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

  const updateField = (key: string, value: any) => {
    (activeData as any)[key] = value
    onUpdate()
  }

  const operationItems = [
    { key: 'complete', icon: <CheckCircleOutlined style={{ fontSize: 32 }} />, title: '同意', desc: '审批通过，流转到下一个节点' },
    { key: 'refuse', icon: <CloseCircleOutlined style={{ fontSize: 32 }} />, title: '拒绝', desc: '当拒绝任务时，当前任务被终止，并结束整个流程' },
    { key: 'back', icon: <RollbackOutlined style={{ fontSize: 32 }} />, title: '退回', desc: '若审批内容存在问题，当前任务将中止并回退至特定历史任务节点' },
    { key: 'transfer', icon: <SwapOutlined style={{ fontSize: 32 }} />, title: '转交', desc: '将当前任务移交给其他人处理，以便他们继续执行所需的操作' },
    { key: 'delegate', icon: <UserOutlined style={{ fontSize: 32 }} />, title: '委派', desc: '将当前任务暂时交由他人处理，待其完成后再交回自己处理' },
    { key: 'addMulti', icon: <UserAddOutlined style={{ fontSize: 32 }} />, title: '加签', desc: '在当前任务上额外添加新人员，以处理相关事项或提供必要的审批或意见' },
    { key: 'minusMulti', icon: <UserDeleteOutlined style={{ fontSize: 32 }} />, title: '减签', desc: '在当前任务中减少处理人员数量，以简化流程或重新分配责任' }
  ]

  return (
    <Tabs
      items={[
        {
          key: 'properties',
          label: '审批人',
          children: (
            <Form layout="vertical">
              <AssigneePanel activeData={activeData} fields={fields} type="审批" onUpdate={onUpdate}>
                <Col span={8}><Radio value="autoRefuse">自动拒绝</Radio></Col>
              </AssigneePanel>
              <Form.Item label="多人审批方式">
                <Radio.Group
                  value={activeData.multi}
                  onChange={(e) => updateField('multi', e.target.value)}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <Radio value="sequential">依次审批（按顺序审批）</Radio>
                  <Radio value="joint">会签（需要所有审批人都通过）</Radio>
                  <Radio value="single">或签（其中一名审批人通过即可）</Radio>
                </Radio.Group>
                {activeData.multi === 'joint' && (
                  <Typography.Text>
                    需要 <InputNumber value={activeData.multiPercent} onChange={(val) => updateField('multiPercent', val)} min={1} max={100} /> %人员通过
                  </Typography.Text>
                )}
              </Form.Item>
              <Form.Item label="审批人为空">
                <Radio.Group
                  value={activeData.nobody}
                  onChange={(e) => updateField('nobody', e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Row>
                    <Col span={12}><Radio value="pass">自动通过</Radio></Col>
                    <Col span={12}><Radio value="assign">指定人员</Radio></Col>
                    <Col span={12}><Radio value="reject">自动拒绝</Radio></Col>
                    <Col span={12}><Radio value="admin">转交流程管理员</Radio></Col>
                  </Row>
                </Radio.Group>
                {activeData.nobody === 'assign' && (
                  <UserSelector
                    multiple
                    value={activeData.nobodyUsers}
                    onChange={(val) => updateField('nobodyUsers', val || [])}
                    placeholder="指定人员"
                  />
                )}
              </Form.Item>
              <Form.Item label="任务监听器">
                <TaskListeners node={activeData} onUpdate={onUpdate} />
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
        },
        {
          key: 'operationPermissions',
          label: '操作权限',
          children: (
            <div>
              {operationItems.map((item, index) => (
                <React.Fragment key={item.key}>
                  <div className="opt-item">
                    <div className="opt-item__icon">{item.icon}</div>
                    <div className="opt-item__content">
                      <Typography.Text strong>{item.title}</Typography.Text>
                      <div className="opt-item__second">{item.desc}</div>
                    </div>
                    <Switch
                      checked={(activeData.operations as any)[item.key]}
                      onChange={(val) => { (activeData.operations as any)[item.key] = val; onUpdate() }}
                      checkedChildren="开"
                      unCheckedChildren="关"
                    />
                  </div>
                  {index < operationItems.length - 1 && <Divider style={{ margin: '8px 0' }} />}
                </React.Fragment>
              ))}
            </div>
          )
        }
      ]}
    />
  )
}

export default ApprovalPanel
