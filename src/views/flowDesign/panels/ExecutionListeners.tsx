import React, { useState } from 'react'
import { Button, Drawer, Badge, Form, Radio, Input, Tooltip } from 'antd'
import { PlusOutlined, CloseCircleOutlined, SettingOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import type { FlowNode } from '../nodes/type'
import './Listeners.scss'

interface ExecutionListenersProps {
  node: FlowNode
  onUpdate: () => void
}

const ExecutionListeners: React.FC<ExecutionListenersProps> = ({ node, onUpdate }) => {
  const [drawer, setDrawer] = useState(false)

  const addListener = () => {
    if (!node.executionListeners) {
      node.executionListeners = []
    }
    node.executionListeners.push({
      event: 'start',
      implementationType: 'delegateExpression',
      implementation: ''
    })
    onUpdate()
  }

  const delListener = (index: number) => {
    node.executionListeners?.splice(index, 1)
    onUpdate()
  }

  const updateListener = (index: number, key: string, value: string) => {
    if (node.executionListeners?.[index]) {
      (node.executionListeners[index] as any)[key] = value
      onUpdate()
    }
  }

  return (
    <div>
      <Badge count={node.executionListeners?.length || 0} color="#1677ff">
        <Button icon={<SettingOutlined />} onClick={() => setDrawer(true)}>配置</Button>
      </Badge>
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="执行监听器">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={addListener}>添加监听器</Button>
          {node.executionListeners?.map((item, index) => (
            <div key={index} className="listener-box">
              <Button
                className="listener-close"
                danger
                shape="circle"
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => delListener(index)}
              />
              <Form.Item label="事件">
                <Radio.Group value={item.event} onChange={(e) => updateListener(index, 'event', e.target.value)}>
                  <Radio.Button value="start">开始</Radio.Button>
                  <Radio.Button value="end">结束</Radio.Button>
                  <Radio.Button value="take">迁移</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="类型">
                <Radio.Group value={item.implementationType} onChange={(e) => updateListener(index, 'implementationType', e.target.value)}>
                  <Radio.Button value="delegateExpression">委托表达式</Radio.Button>
                  <Radio.Button value="class">java类</Radio.Button>
                  <Radio.Button value="expression">表达式</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    监听器&nbsp;
                    <Tooltip title={<>实现 ExecutionListener 接口<br/>委托表达式：{'${myExecutionListener}'}<br/>表达式: {'${myExecutionListener.notify(execution)}'}<br/>java类：{'${com.example.listener.MyExecutionListener}'}</>}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
              >
                <Input
                  value={item.implementation}
                  onChange={(e) => updateListener(index, 'implementation', e.target.value)}
                  placeholder="请输入监听器"
                  allowClear
                />
              </Form.Item>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  )
}

export default ExecutionListeners
