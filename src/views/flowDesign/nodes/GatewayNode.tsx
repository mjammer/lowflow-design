import React from 'react'
import TreeNode from './TreeNode'
import Add from './Add'
import SvgIcon from '@/components/SvgIcon'
import { useFlowDesign } from '../FlowDesignContext'
import type { BranchNode, FlowNode, NodeType } from './type'
import './GatewayNode.scss'

interface GatewayNodeProps {
  node: BranchNode
  renderAddBranch?: (addNode: (type: NodeType, node?: FlowNode) => void, readOnly: boolean) => React.ReactNode
}

const GatewayNode: React.FC<GatewayNodeProps> = ({ node, renderAddBranch }) => {
  const { readOnly, addNode: contextAddNode } = useFlowDesign()

  const handleAddNode = (type: NodeType, targetNode?: FlowNode) => {
    contextAddNode(type, targetNode || node)
  }

  const moveRight = (index: number) => {
    const item = node.branches[index]
    node.branches.splice(index, 1)
    node.branches.splice(index + 1, 0, item)
  }

  const moveLeft = (index: number) => {
    const item = node.branches[index]
    node.branches.splice(index, 1)
    node.branches.splice(index - 1, 0, item)
  }

  return (
    <>
      <div className="gateway-node">
        <div className="add-branch">
          {renderAddBranch?.(handleAddNode, readOnly)}
        </div>
        {node.branches.map((item, index) => (
          <div key={item.id} className="col-box">
            {index === 0 && (
              <>
                <div className="top-left-border" />
                <div className="bottom-left-border" />
              </>
            )}
            {node.branches.length === index + 1 && (
              <>
                <div className="top-right-border" />
                <div className="bottom-right-border" />
              </>
            )}
            <div className="col-node">
              {index !== 0 && node.branches.length !== index + 1 && !readOnly && (
                <div className="move-left" onClick={(e) => { e.stopPropagation(); moveLeft(index) }}>
                  <SvgIcon name="el:ArrowLeft" />
                </div>
              )}
              {![index + 1, index + 2].includes(node.branches.length) && !readOnly && (
                <div className="move-right" onClick={(e) => { e.stopPropagation(); moveRight(index) }}>
                  <SvgIcon name="el:ArrowRight" />
                </div>
              )}
              <TreeNode node={item} />
            </div>
          </div>
        ))}
      </div>
      <Add onAddNode={(type) => handleAddNode(type)} className="branch-but" />
    </>
  )
}

export default GatewayNode
