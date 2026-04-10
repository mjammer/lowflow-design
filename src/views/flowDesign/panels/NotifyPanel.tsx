import React from 'react'
import { Form, Checkbox, Input, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import type { NotifyNode } from '../nodes/type'
import { useFlowDesign } from '../FlowDesignContext'
import AssigneePanel from './AssigneePanel'

interface NotifyPanelProps {
  activeData: NotifyNode
  onUpdate: () => void
}

const NotifyPanel: React.FC<NotifyPanelProps> = ({ activeData, onUpdate }) => {
  const { fields } = useFlowDesign()

  const updateField = (key: string, value: any) => {
    (activeData as any)[key] = value
    onUpdate()
  }

  return (
    <Form layout="vertical">
      <AssigneePanel activeData={activeData} fields={fields} type="通知" onUpdate={onUpdate} />
      <Form.Item label="通知类型">
        <Checkbox.Group value={activeData.types} onChange={(val) => updateField('types', val)}>
          <Checkbox value="site">站内</Checkbox>
          <Checkbox value="email">邮件</Checkbox>
          <Checkbox value="sms">短信</Checkbox>
          <Checkbox value="wechat">企业微信</Checkbox>
          <Checkbox value="dingtalk">钉钉</Checkbox>
          <Checkbox value="feishu">飞书</Checkbox>
        </Checkbox.Group>
      </Form.Item>
      <Form.Item
        label={
          <span>
            <Tooltip title="可以使用 ${字段名} 字段名填充内容">
              <QuestionCircleOutlined />
            </Tooltip>
            &nbsp;消息主题
          </span>
        }
      >
        <Input
          value={activeData.subject}
          onChange={(e) => updateField('subject', e.target.value)}
          maxLength={255}
          allowClear
          placeholder="请输入消息主题"
        />
      </Form.Item>
      <Form.Item
        label={
          <span>
            <Tooltip title="可以使用 ${字段名} 字段名填充内容">
              <QuestionCircleOutlined />
            </Tooltip>
            &nbsp;消息内容
          </span>
        }
      >
        <Input.TextArea
          value={activeData.content}
          onChange={(e) => updateField('content', e.target.value)}
          rows={6}
          maxLength={1000}
          showCount
          placeholder="请输入消息内容"
        />
      </Form.Item>
    </Form>
  )
}

export default NotifyPanel
