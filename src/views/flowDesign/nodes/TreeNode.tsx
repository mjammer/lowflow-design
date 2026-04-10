import React from 'react'
import type { FlowNode, NodeType } from './type'
import StartNode from './StartNode'
import EndNode from './EndNode'
import ApprovalNode from './ApprovalNode'
import CcNode from './CcNode'
import TimerNode from './TimerNode'
import NotifyNode from './NotifyNode'
import ServiceNode from './ServiceNode'
import ExclusiveNode from './ExclusiveNode'
import ConditionNode from './ConditionNode'
import { useFlowDesign } from '../FlowDesignContext'

interface TreeNodeProps {
  node: FlowNode
  appendSlot?: React.ReactNode
}

const nodeComponents: Record<string, React.ComponentType<any>> = {
  start: StartNode,
  approval: ApprovalNode,
  cc: CcNode,
  timer: TimerNode,
  notify: NotifyNode,
  service: ServiceNode,
  exclusive: ExclusiveNode,
  condition: ConditionNode,
  end: EndNode
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, appendSlot }) => {
  const NodeComp = nodeComponents[node.type]
  if (!NodeComp) return null

  return (
    <>
      {appendSlot}
      <NodeComp node={node} />
      {node.next && <TreeNode node={node.next} />}
    </>
  )
}

export default TreeNode
