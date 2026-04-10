import React, { useState, useRef, useMemo, useCallback } from 'react'
import { Button, Tooltip } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import TreeNode from './nodes/TreeNode'
import Panel from './panels'
import { FlowDesignContext } from './FlowDesignContext'
import { useDraggableScroll } from '@/hooks/useDraggableScroll'
import type { Field } from '@/components/Render/type'
import type {
  FlowNode, ErrorInfo, NodeType, BranchNode, ExclusiveNode,
  ConditionNode, CcNode, TimerNode, NotifyNode, ServiceNode, ApprovalNode
} from './nodes/type'
import type { FilterRules } from '@/components/AdvancedFilter/type'
import './index.scss'

interface FlowDesignProps {
  process: FlowNode
  fields: Field[]
  readOnly?: boolean
  defaultZoom?: number
  bgColor?: string
  children?: React.ReactNode
  onProcessChange?: () => void
}

const FlowDesign: React.FC<FlowDesignProps> = ({
  process,
  fields,
  readOnly = false,
  defaultZoom = 100,
  bgColor = '#f5f5f5',
  children,
  onProcessChange
}) => {
  const [zoom, setZoom] = useState(defaultZoom)
  const [panelVisible, setPanelVisible] = useState(false)
  const [activeData, setActiveData] = useState<FlowNode>({ id: '', name: '', type: 'start' })
  const [nodesError, setNodesError] = useState<Record<string, ErrorInfo[]>>({})
  const [, forceUpdate] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  useDraggableScroll(containerRef)

  const flatFields = useMemo(() => {
    const all: Field[] = []
    const loop = (children: Field[]) => {
      children.forEach((field) => {
        if (field.type === 'formItem') all.push(field)
        if (Array.isArray(field.children)) loop(field.children)
      })
    }
    loop(fields)
    return all
  }, [fields])

  const triggerUpdate = useCallback(() => {
    forceUpdate((n) => n + 1)
    onProcessChange?.()
  }, [onProcessChange])

  const nextId = (): string => {
    let id = `node_${Math.random().toString(36).substring(2, 7)}`
    const findId = (node: FlowNode, id: string): boolean => {
      if (node.id === id) return true
      if (node.next) return findId(node.next, id)
      if ('branches' in node) {
        const branchNode = node as BranchNode
        if (branchNode.branches?.length > 0) {
          return branchNode.branches.some((item) => findId(item, id))
        }
      }
      return false
    }
    if (findId(process, id)) return nextId()
    return id
  }

  const addCondition = (node: FlowNode) => {
    const exclusive = node as ExclusiveNode
    exclusive.branches.splice(exclusive.branches.length - 1, 0, {
      id: nextId(),
      pid: exclusive.id,
      type: 'condition',
      def: false,
      name: `条件${exclusive.branches.length + 1}`,
      conditions: { operator: 'and', conditions: [], groups: [] } as FilterRules,
      next: undefined
    } as any)
  }

  const addExclusive = (node: FlowNode) => {
    const next = node.next
    const id = nextId()
    const exclusiveNode = {
      id, pid: node.id, type: 'exclusive', name: '独占网关', next, branches: []
    } as ExclusiveNode
    if (next) next.pid = id
    addCondition(exclusiveNode)
    addCondition(exclusiveNode)
    node.next = exclusiveNode
    if (exclusiveNode.branches.length > 0) {
      const condition = exclusiveNode.branches[exclusiveNode.branches.length - 1] as ConditionNode
      condition.def = true
      condition.name = '默认条件'
    }
  }

  const addCc = (node: FlowNode) => {
    const next = node.next
    const id = nextId()
    node.next = {
      id, pid: node.id, type: 'cc', name: '抄送人', next,
      assigneeType: 'user', formUser: '', formRole: '', users: [], roles: [],
      leader: 1, orgLeader: 1, choice: false, self: false, formProperties: []
    } as CcNode
    if (next) next.pid = id
  }

  const addTimer = (node: FlowNode) => {
    const next = node.next
    const id = nextId()
    node.next = {
      id, pid: node.id, name: '计时等待', type: 'timer', next,
      waitType: 'duration', unit: 'PT%sS', duration: 0, timeDate: undefined
    } as TimerNode
    if (next) next.pid = id
  }

  const addNotify = (node: FlowNode) => {
    const next = node.next
    const id = nextId()
    node.next = {
      id, pid: node.id, name: '消息通知', type: 'notify', next,
      assigneeType: 'user', formUser: '', formRole: '', users: [], roles: [],
      leader: 1, orgLeader: 1, choice: false, self: false,
      types: ['site'], subject: '', content: ''
    } as NotifyNode
    if (next) next.pid = id
  }

  const addService = (node: FlowNode) => {
    const next = node.next
    const id = nextId()
    node.next = {
      id, pid: node.id, type: 'service', name: '服务节点', next,
      implementationType: '', implementation: ''
    } as ServiceNode
    if (next) next.pid = id
  }

  const addApproval = (node: FlowNode) => {
    const next = node.next
    const id = nextId()
    node.next = {
      id, pid: node.id, type: 'approval', name: '审批人', executionListeners: [], next,
      assigneeType: 'user', formUser: '', formRole: '', users: [], roles: [],
      leader: 1, orgLeader: 1, choice: false, self: false,
      multi: 'sequential', multiPercent: 100, nobody: 'pass', nobodyUsers: [],
      formProperties: [],
      operations: { complete: true, refuse: true, back: true, transfer: true, delegate: true, addMulti: false, minusMulti: false }
    } as ApprovalNode
    if (next) next.pid = id
  }

  const addNode = (type: NodeType, node: FlowNode) => {
    const addMap: Record<string, (node: FlowNode) => void> = {
      exclusive: addExclusive,
      condition: addCondition,
      cc: addCc,
      timer: addTimer,
      notify: addNotify,
      service: addService,
      approval: addApproval
    }
    const fun = addMap[type]
    fun?.(node)
    triggerUpdate()
  }

  const delError = (node: FlowNode) => {
    setNodesError((prev) => {
      const next = { ...prev }
      delete next[node.id]
      if (node.next) {
        const delErrorInner = (n: FlowNode) => {
          delete next[n.id]
          if (n.next) delErrorInner(n.next)
          if ('branches' in n) {
            const bn = n as BranchNode
            bn.branches?.forEach((item) => delErrorInner(item))
          }
        }
        delErrorInner(node.next)
      }
      if ('branches' in node) {
        const bn = node as BranchNode
        bn.branches?.forEach((item) => {
          const delErrorInner = (n: FlowNode) => {
            delete next[n.id]
            if (n.next) delErrorInner(n.next)
            if ('branches' in n) {
              const bn2 = n as BranchNode
              bn2.branches?.forEach((item2) => delErrorInner(item2))
            }
          }
          delErrorInner(item)
        })
      }
      return next
    })
  }

  const delNode = (del: FlowNode) => {
    delError(del)
    delNodeNext(process, del)
    triggerUpdate()
  }

  const delNodeNext = (next: FlowNode, del: FlowNode) => {
    if (next.id === del.pid) {
      if ('branches' in next && next.next?.id !== del.id) {
        const branchNode = next as BranchNode
        const index = branchNode.branches.findIndex((item) => item.id === del.id)
        if (index !== -1) {
          if (branchNode.branches.length <= 2) {
            delError(branchNode)
            delNode(branchNode)
          } else {
            delError(del)
            branchNode.branches.splice(index, 1)
          }
        }
      } else {
        if (del.next && del.next.pid) {
          del.next.pid = next.id
        }
        next.next = del.next
      }
    } else {
      if (next.next) delNodeNext(next.next, del)
      if ('branches' in next) {
        const nextBranch = next as BranchNode
        nextBranch.branches?.forEach((item) => delNodeNext(item, del))
      }
    }
  }

  const openPanel = (node: FlowNode) => {
    setActiveData(node)
    setPanelVisible(true)
  }

  const contextValue = useMemo(
    () => ({
      readOnly,
      fields: flatFields,
      nodesError,
      setNodesError,
      addNode,
      delNode,
      openPanel
    }),
    [readOnly, flatFields, nodesError]
  )

  return (
    <FlowDesignContext.Provider value={contextValue}>
      <div
        className="designer-container"
        ref={containerRef}
        style={{ '--flow-bg-color': bgColor } as React.CSSProperties}
      >
        <div className="tool">{children}</div>
        <div className="zoom">
          <Tooltip title="放大" placement="bottomLeft">
            <Button icon={<PlusOutlined />} onClick={() => setZoom((z) => z + 10)} disabled={zoom >= 170} shape="circle" />
          </Tooltip>
          <span>{zoom}%</span>
          <Tooltip title="缩小" placement="bottomLeft">
            <Button icon={<MinusOutlined />} onClick={() => setZoom((z) => z - 10)} disabled={zoom <= 50} shape="circle" />
          </Tooltip>
        </div>
        <div className="node-container" style={{ transform: `scale(${zoom / 100})`, transformOrigin: '50% 0 0' }}>
          <TreeNode node={process} />
        </div>
        <Panel
          visible={panelVisible}
          onClose={() => setPanelVisible(false)}
          activeData={activeData}
          onUpdate={triggerUpdate}
        />
      </div>
    </FlowDesignContext.Provider>
  )
}

export default FlowDesign
