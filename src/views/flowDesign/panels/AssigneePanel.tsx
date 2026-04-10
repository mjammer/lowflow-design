import React from 'react'
import { Form, Radio, Row, Col, Select } from 'antd'
import UserSelector from '@/components/UserSelector'
import RoleSelector from '@/components/RoleSelector'
import type { AssigneeNode } from '../nodes/type'
import type { Field } from '@/components/Render/type'

interface AssigneePanelProps {
  activeData: AssigneeNode
  fields: Field[]
  type: '审批' | '抄送' | '办理' | '通知'
  onUpdate: () => void
  children?: React.ReactNode
}

const AssigneePanel: React.FC<AssigneePanelProps> = ({ activeData, fields, type, onUpdate, children }) => {
  const updateField = (key: string, value: any) => {
    (activeData as any)[key] = value
    onUpdate()
  }

  return (
    <Form layout="vertical">
      <Form.Item label={`${type}对象`}>
        <Radio.Group
          value={activeData.assigneeType}
          onChange={(e) => updateField('assigneeType', e.target.value)}
        >
          <Row>
            <Col span={8}><Radio value="user">指定人员</Radio></Col>
            <Col span={8}><Radio value="role">指定角色</Radio></Col>
            <Col span={8}><Radio value="choice">发起人自选</Radio></Col>
            <Col span={8}><Radio value="self">发起人自己</Radio></Col>
            <Col span={8}><Radio value="leader">直属上级</Radio></Col>
            <Col span={8}><Radio value="orgLeader">组织主管</Radio></Col>
            <Col span={8}><Radio value="formUser">表单内人员</Radio></Col>
            <Col span={8}><Radio value="formRole">表单内角色</Radio></Col>
            {children}
          </Row>
        </Radio.Group>
      </Form.Item>

      {activeData.assigneeType === 'user' && (
        <Form.Item label="指定人员">
          <UserSelector
            value={activeData.users}
            onChange={(val) => updateField('users', val || [])}
            multiple
            placeholder={`请选择${type}人`}
          />
        </Form.Item>
      )}

      {activeData.assigneeType === 'choice' && (
        <Form.Item label="发起人自选择">
          <Radio.Group value={activeData.choice} onChange={(e) => updateField('choice', e.target.value)}>
            <Radio.Button value={false}>单选</Radio.Button>
            <Radio.Button value={true}>多选</Radio.Button>
          </Radio.Group>
        </Form.Item>
      )}

      {activeData.assigneeType === 'leader' && (
        <Form.Item label="多级上级">
          <Select
            value={activeData.leader}
            onChange={(val) => updateField('leader', val)}
            style={{ width: 220 }}
            placeholder="请选择多级上级"
            options={Array.from({ length: 11 }, (_, i) => ({
              label: i === 0 ? '直属上级' : `${i + 1}级上级`,
              value: i + 1
            }))}
          />
        </Form.Item>
      )}

      {activeData.assigneeType === 'orgLeader' && (
        <Form.Item label="组织主管">
          <Select
            value={activeData.orgLeader}
            onChange={(val) => updateField('orgLeader', val)}
            style={{ width: 220 }}
            placeholder="请选择组织主管"
            options={Array.from({ length: 11 }, (_, i) => ({
              label: i === 0 ? '直属主管' : `${i + 1}级主管`,
              value: i + 1
            }))}
          />
        </Form.Item>
      )}

      {activeData.assigneeType === 'role' && (
        <Form.Item label="指定角色">
          <RoleSelector
            value={activeData.roles}
            onChange={(val) => updateField('roles', val || [])}
            multiple
            placeholder="请选择角色"
          />
        </Form.Item>
      )}

      {activeData.assigneeType === 'formUser' && (
        <Form.Item label="表单内人员">
          <Select
            placeholder="选择表单内人员"
            style={{ width: 220 }}
            value={activeData.formUser || undefined}
            onChange={(val) => updateField('formUser', val)}
            options={fields
              .filter((e) => e.name === 'UserSelector')
              .map((item) => ({ label: item.label, value: item.id }))}
          />
        </Form.Item>
      )}

      {activeData.assigneeType === 'formRole' && (
        <Form.Item label="表单内角色">
          <Select
            placeholder="选择表单内角色"
            style={{ width: 220 }}
            value={activeData.formRole || undefined}
            onChange={(val) => updateField('formRole', val)}
            options={fields
              .filter((e) => e.name === 'RoleSelector')
              .map((item) => ({ label: item.label, value: item.id }))}
          />
        </Form.Item>
      )}
    </Form>
  )
}

export default AssigneePanel
