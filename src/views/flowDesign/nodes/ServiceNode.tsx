import React, { useState, useEffect } from 'react'
import { Typography } from 'antd'
import NodeComponent from './Node'
import { useFlowDesign } from '../FlowDesignContext'
import type { ServiceNode as ServiceNodeType, ErrorInfo } from './type'

interface ServiceNodeProps {
  node: ServiceNodeType
}

const ServiceNode: React.FC<ServiceNodeProps> = ({ node }) => {
  const { setNodesError, addNode, delNode, openPanel } = useFlowDesign()
  const [content, setContent] = useState('')

  useEffect(() => {
    const errors: ErrorInfo[] = []
    const { id, name, implementationType, implementation } = node
    if (!implementationType) {
      errors.push({ id, name, message: '执行类型为空' })
      setContent('执行类型为空')
    } else if (!implementation) {
      errors.push({ id, name, message: '执行值为空' })
      setContent('执行值为空')
    } else {
      setContent('执行服务')
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
  }, [node, node.implementationType, node.implementation])

  return (
    <NodeComponent
      icon="el:Tools"
      color="#ffc107"
      node={node}
      onAddNode={(type) => addNode(type, node)}
      onDelNode={() => delNode(node)}
      onActiveNode={() => openPanel(node)}
    >
      <Typography.Text>{content}</Typography.Text>
    </NodeComponent>
  )
}

export default ServiceNode
