import React, { useEffect } from 'react'
import { Typography } from 'antd'
import NodeComponent from './Node'
import { useFlowDesign } from '../FlowDesignContext'
import type { StartNode as StartNodeType, ErrorInfo } from './type'
import './StartNode.scss'

interface StartNodeProps {
  node: StartNodeType
}

const StartNode: React.FC<StartNodeProps> = ({ node }) => {
  const { nodesError, setNodesError, addNode, delNode, openPanel } = useFlowDesign()

  useEffect(() => {
    const errors: ErrorInfo[] = []
    const { id, name, next } = node
    if (next?.type === 'end') {
      errors.push({ id, name, message: '发起下节点为空' })
    }
    setNodesError((prev) => {
      const next = { ...prev }
      if (errors.length > 0) {
        next[id] = errors
      } else {
        delete next[id]
      }
      return next
    })
  }, [node, node.next?.type])

  return (
    <div className="start-node">
      <NodeComponent
        icon="el:List"
        close={false}
        color="#8c7cf3"
        node={node}
        onAddNode={(type) => addNode(type, node)}
        onDelNode={() => delNode(node)}
        onActiveNode={() => openPanel(node)}
      >
        <Typography.Text>发起人</Typography.Text>
      </NodeComponent>
    </div>
  )
}

export default StartNode
