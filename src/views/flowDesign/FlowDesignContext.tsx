import React, { createContext, useContext } from 'react'
import type { Field } from '@/components/Render/type'
import type { ErrorInfo, FlowNode, NodeType } from './nodes/type'

export interface FlowDesignContextType {
  readOnly: boolean
  fields: Field[]
  nodesError: Record<string, ErrorInfo[]>
  setNodesError: React.Dispatch<React.SetStateAction<Record<string, ErrorInfo[]>>>
  addNode: (type: NodeType, node: FlowNode) => void
  delNode: (node: FlowNode) => void
  openPanel: (node: FlowNode) => void
}

export const FlowDesignContext = createContext<FlowDesignContextType>({
  readOnly: false,
  fields: [],
  nodesError: {},
  setNodesError: () => {},
  addNode: () => {},
  delNode: () => {},
  openPanel: () => {}
})

export const useFlowDesign = () => useContext(FlowDesignContext)
