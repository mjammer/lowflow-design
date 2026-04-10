import React from 'react'
import { Typography } from 'antd'
import { useFlowDesign } from '../FlowDesignContext'
import type { FlowNode } from './type'
import './EndNode.scss'

interface EndNodeProps {
  node: FlowNode
}

const EndNode: React.FC<EndNodeProps> = ({ node }) => {
  const { readOnly, openPanel } = useFlowDesign()

  const activeNode = () => {
    if (readOnly) return
    openPanel(node)
  }

  return (
    <div className="end-node-box">
      <div className="end-node-circle" />
      <div className="end-node" onClick={activeNode}>
        <Typography.Text>{node.name}</Typography.Text>
      </div>
    </div>
  )
}

export default EndNode
