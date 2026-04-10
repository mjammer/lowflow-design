import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Button, Input, Typography, Tooltip, Popconfirm } from 'antd'
import { CloseCircleOutlined, EditOutlined, WarningFilled } from '@ant-design/icons'
import Add from './Add'
import SvgIcon from '@/components/SvgIcon'
import { useFlowDesign } from '../FlowDesignContext'
import type { ErrorInfo, FlowNode, NodeType } from './type'
import './Node.scss'

interface NodeProps {
  icon?: string
  node: FlowNode
  color?: string
  readOnly?: boolean
  close?: boolean
  children?: React.ReactNode
  iconSlot?: React.ReactNode
  onAddNode?: (type: NodeType) => void
  onDelNode?: () => void
  onActiveNode?: () => void
}

const NodeComponent: React.FC<NodeProps> = ({
  icon,
  node,
  color,
  readOnly: readOnlyProp = false,
  close = true,
  children,
  iconSlot,
  onAddNode,
  onDelNode,
  onActiveNode
}) => {
  const { readOnly: contextReadOnly, nodesError } = useFlowDesign()
  const _readOnly = contextReadOnly || readOnlyProp
  const [showInput, setShowInput] = useState(false)
  const [nodeName, setNodeName] = useState(node.name)
  const inputRef = useRef<any>(null)

  const errorInfo = useMemo<ErrorInfo[] | undefined>(() => nodesError[node.id], [nodesError, node.id])

  useEffect(() => {
    setNodeName(node.name)
  }, [node.name])

  const onShowInput = () => {
    if (_readOnly) return
    setShowInput(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const onBlur = () => {
    setShowInput(false)
    node.name = nodeName
  }

  const activeNode = () => {
    if (_readOnly) return
    onActiveNode?.()
  }

  const handleAddNode = (type: NodeType) => {
    onAddNode?.(type)
  }

  return (
    <div className="node-box">
      <div
        className={`node ${errorInfo?.length && !_readOnly ? 'error-node' : ''}`}
        onClick={activeNode}
      >
        <div className="node-header" style={{ background: color }}>
          <span onClick={(e) => e.stopPropagation()}>
            <Popconfirm
              title="您确定要删除该节点吗？"
              onConfirm={onDelNode}
              placement="rightTop"
              okText="确定"
              cancelText="取消"
            >
              {close && !_readOnly && (
                <Button
                  className="node-close"
                  danger
                  shape="circle"
                  size="small"
                  icon={<CloseCircleOutlined />}
                />
              )}
            </Popconfirm>
          </span>
          <div className="head">
            {showInput ? (
              <div onClick={(e) => e.stopPropagation()}>
                <Input
                  ref={inputRef}
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  onBlur={onBlur}
                  onPressEnter={onBlur}
                  maxLength={30}
                  size="small"
                />
              </div>
            ) : (
              <Typography.Text
                strong
                ellipsis
                onClick={(e) => {
                  e.stopPropagation()
                  onShowInput()
                }}
                style={{ cursor: 'pointer', maxWidth: 150 }}
              >
                {node.name} <EditOutlined />
              </Typography.Text>
            )}
            {iconSlot || (icon && <SvgIcon size={30} name={icon} />)}
          </div>
          {errorInfo && errorInfo.length > 0 && !_readOnly && (
            <Tooltip
              title={errorInfo.map((err) => (
                <div key={err.id}>{err.message}</div>
              ))}
            >
              <WarningFilled
                className="warn-icon"
                style={{ fontSize: 20, color: '#ff4d4f', cursor: 'pointer', position: 'absolute', right: -30, top: '50%', transform: 'translateY(-50%)' }}
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          )}
        </div>
        <div className="node-content">{children}</div>
      </div>
      <Add onAddNode={handleAddNode} />
    </div>
  )
}

export default NodeComponent
