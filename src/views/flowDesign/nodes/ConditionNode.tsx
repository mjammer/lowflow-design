import React, { useState, useEffect } from 'react'
import { Typography } from 'antd'
import NodeComponent from './Node'
import { useFlowDesign } from '../FlowDesignContext'
import type { ConditionNode as ConditionNodeType, ErrorInfo } from './type'
import './ConditionNode.scss'

interface ConditionNodeProps {
  node: ConditionNodeType
  appendSlot?: React.ReactNode
}

const ConditionNode: React.FC<ConditionNodeProps> = ({ node, appendSlot }) => {
  const { setNodesError, addNode, delNode, openPanel } = useFlowDesign()
  const [content, setContent] = useState('')

  useEffect(() => {
    const errors: ErrorInfo[] = []
    const { id, name, def, conditions, next } = node
    if (def) {
      setContent('不满足其他条件，进入此分支')
    } else if (conditions.conditions.length > 0 || (conditions.groups?.length || 0) > 0) {
      const count = conditions.conditions.length + (conditions.groups?.length || 0)
      setContent(`已设置（${count}）个条件`)
      if (!next) errors.push({ id, name, message: '分支下节点为空' })
    } else {
      errors.push({ id, name, message: '未设置条件' })
      setContent('未设置条件')
    }

    setNodesError((prev) => {
      const n = { ...prev }
      if (errors.length > 0) {
        n[id] = errors
      } else {
        delete n[id]
      }
      return n
    })
  }, [node, node.def, node.conditions, node.next])

  return (
    <div className="branch-node">
      <NodeComponent
        icon="el:Share"
        node={node}
        readOnly={node.def}
        onAddNode={(type) => addNode(type, node)}
        onDelNode={() => delNode(node)}
        onActiveNode={() => openPanel(node)}
      >
        <Typography.Text>{content}</Typography.Text>
        {appendSlot}
      </NodeComponent>
    </div>
  )
}

export default ConditionNode
