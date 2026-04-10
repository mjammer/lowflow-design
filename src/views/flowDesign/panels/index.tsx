import React, { useState } from 'react'
import { Drawer, Input } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import type { FlowNode } from '../nodes/type'
import StartPanel from './StartPanel'
import ApprovalPanel from './ApprovalPanel'
import CcPanel from './CcPanel'
import TimerPanel from './TimerPanel'
import NotifyPanel from './NotifyPanel'
import ServicePanel from './ServicePanel'
import ConditionPanel from './ConditionPanel'
import EndPanel from './EndPanel'

interface PanelProps {
  visible: boolean
  onClose: () => void
  activeData: FlowNode
  onUpdate: () => void
}

const panels: Record<string, React.ComponentType<any>> = {
  start: StartPanel,
  approval: ApprovalPanel,
  cc: CcPanel,
  timer: TimerPanel,
  notify: NotifyPanel,
  service: ServicePanel,
  condition: ConditionPanel,
  end: EndPanel
}

const Panel: React.FC<PanelProps> = ({ visible, onClose, activeData, onUpdate }) => {
  const [showInput, setShowInput] = useState(false)
  const PanelComp = panels[activeData.type]

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    activeData.name = e.target.value
    onUpdate()
  }

  return (
    <Drawer
      open={visible}
      onClose={onClose}
      width="35%"
      title={
        showInput ? (
          <Input
            value={activeData.name}
            onChange={handleNameChange}
            onBlur={() => setShowInput(false)}
            onPressEnter={() => setShowInput(false)}
            maxLength={30}
            autoFocus
          />
        ) : (
          <a onClick={() => setShowInput(true)}>
            <EditOutlined /> {activeData?.name || '节点配置'}
          </a>
        )
      }
    >
      {PanelComp && <PanelComp activeData={activeData} onUpdate={onUpdate} />}
    </Drawer>
  )
}

export default Panel
