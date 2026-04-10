import React from 'react'
import { Button } from 'antd'
import GatewayNode from './GatewayNode'
import type { ExclusiveNode as ExclusiveNodeType } from './type'

interface ExclusiveNodeProps {
  node: ExclusiveNodeType
}

const ExclusiveNode: React.FC<ExclusiveNodeProps> = ({ node }) => {
  return (
    <GatewayNode
      node={node}
      renderAddBranch={(addNode, readOnly) => (
        <Button type="primary" disabled={readOnly} onClick={() => addNode('condition', node)} shape="round">
          添加条件
        </Button>
      )}
    />
  )
}

export default ExclusiveNode
