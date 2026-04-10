import React, { useState } from 'react'
import { Button, Popover, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import SvgIcon from '@/components/SvgIcon'
import { useFlowDesign } from '../FlowDesignContext'
import type { NodeType } from './type'
import './Add.scss'

interface AddProps {
  onAddNode: (type: NodeType) => void
  className?: string
}

const Add: React.FC<AddProps> = ({ onAddNode, className }) => {
  const { readOnly } = useFlowDesign()
  const [open, setOpen] = useState(false)

  const addNode = (type: NodeType) => {
    onAddNode(type)
    setOpen(false)
  }

  const content = (
    <div className="node-select-grid">
      <div className="node-select" onClick={() => addNode('approval')}>
        <span className="svg-icon-wrap Stamp"><SvgIcon name="el:Stamp" /></span>
        <Typography.Text>审批人</Typography.Text>
      </div>
      <div className="node-select" onClick={() => addNode('cc')}>
        <span className="svg-icon-wrap Promotion"><SvgIcon name="el:Promotion" /></span>
        <Typography.Text>抄送人</Typography.Text>
      </div>
      <div className="node-select" onClick={() => addNode('exclusive')}>
        <span className="svg-icon-wrap Share"><SvgIcon name="el:Share" /></span>
        <Typography.Text>互斥分支</Typography.Text>
      </div>
      <div className="node-select" onClick={() => addNode('timer')}>
        <span className="svg-icon-wrap Timer"><SvgIcon name="el:Timer" /></span>
        <Typography.Text>计时等待</Typography.Text>
      </div>
      <div className="node-select" onClick={() => addNode('notify')}>
        <span className="svg-icon-wrap BellFilled"><SvgIcon name="el:BellFilled" /></span>
        <Typography.Text>消息通知</Typography.Text>
      </div>
      <div className="node-select" onClick={() => addNode('service')}>
        <span className="svg-icon-wrap Tools"><SvgIcon name="el:Tools" /></span>
        <Typography.Text>服务节点</Typography.Text>
      </div>
    </div>
  )

  if (readOnly) return <div className={`add-but ${className || ''}`} />

  return (
    <div className={`add-but ${className || ''}`}>
      <Popover content={content} title="添加节点" trigger="click" open={open} onOpenChange={setOpen}>
        <Button type="primary" shape="circle" icon={<PlusOutlined />} style={{ zIndex: 1 }} />
      </Popover>
    </div>
  )
}

export default Add
