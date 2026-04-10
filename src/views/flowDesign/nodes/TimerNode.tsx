import React, { useState, useEffect } from 'react'
import { Typography } from 'antd'
import NodeComponent from './Node'
import { useFlowDesign } from '../FlowDesignContext'
import type { TimerNode as TimerNodeType, ErrorInfo } from './type'

interface TimerNodeProps {
  node: TimerNodeType
}

const unitMap: Record<string, string> = {
  'PT%sS': '秒',
  'PT%sM': '分钟',
  'PT%sH': '小时',
  'P%sD': '天',
  'P%sW': '周',
  'P%sM': '月'
}

const TimerNode: React.FC<TimerNodeProps> = ({ node }) => {
  const { setNodesError, addNode, delNode, openPanel } = useFlowDesign()
  const [content, setContent] = useState('')

  useEffect(() => {
    const errors: ErrorInfo[] = []
    const { id, name, waitType, unit, duration, timeDate } = node
    if (waitType === 'date') {
      setContent(`等至 ${timeDate || '?'}`)
      if (!timeDate) errors.push({ id, name, message: '未设置等待时间' })
    } else if (waitType === 'duration') {
      setContent(`等待 ${duration} ${unitMap[unit]}`)
      if (duration <= 0) errors.push({ id, name, message: '未设置等待时长' })
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
  }, [node, node.waitType, node.unit, node.duration, node.timeDate])

  return (
    <NodeComponent
      icon="el:Timer"
      color="#E872B7"
      node={node}
      onAddNode={(type) => addNode(type, node)}
      onDelNode={() => delNode(node)}
      onActiveNode={() => openPanel(node)}
    >
      <Typography.Text>{content}</Typography.Text>
    </NodeComponent>
  )
}

export default TimerNode
