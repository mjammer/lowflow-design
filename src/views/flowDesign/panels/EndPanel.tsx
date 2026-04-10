import React from 'react'
import { Form } from 'antd'
import type { EndNode } from '../nodes/type'
import ExecutionListeners from './ExecutionListeners'

interface EndPanelProps {
  activeData: EndNode
  onUpdate: () => void
}

const EndPanel: React.FC<EndPanelProps> = ({ activeData, onUpdate }) => {
  return (
    <Form layout="vertical">
      <Form.Item label="执行监听器">
        <ExecutionListeners node={activeData} onUpdate={onUpdate} />
      </Form.Item>
    </Form>
  )
}

export default EndPanel
