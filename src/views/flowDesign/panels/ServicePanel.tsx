import React from 'react'
import { Form, Select, Input, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import type { ServiceNode } from '../nodes/type'

interface ServicePanelProps {
  activeData: ServiceNode
  onUpdate: () => void
}

const ServicePanel: React.FC<ServicePanelProps> = ({ activeData, onUpdate }) => {
  const updateField = (key: string, value: any) => {
    (activeData as any)[key] = value
    onUpdate()
  }

  return (
    <Form layout="vertical">
      <Form.Item label="执行类型">
        <Select
          value={activeData.implementationType || undefined}
          onChange={(val) => updateField('implementationType', val)}
          placeholder="请选择执行类型"
          options={[
            { label: '类', value: 'class' },
            { label: '表达式', value: 'expression' },
            { label: '委托表达式', value: 'delegateExpression' }
          ]}
        />
      </Form.Item>
      <Form.Item
        label={
          <span>
            执行值&nbsp;
            <Tooltip
              title={
                <>
                  实现 JavaDelegate 接口 <br />
                  类：{'${com.example.delegate.MyServiceDelegate}'} <br />
                  表达式: {'${myServiceDelegate.execute(execution)}'} <br />
                  委托表达式：{'${myServiceDelegate}'}
                </>
              }
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
      >
        <Input
          value={activeData.implementation}
          onChange={(e) => updateField('implementation', e.target.value)}
          placeholder="请输入执行值"
          allowClear
        />
      </Form.Item>
    </Form>
  )
}

export default ServicePanel
