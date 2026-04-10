import React, { useState, useEffect } from 'react'
import { Typography } from 'antd'
import NodeComponent from './Node'
import { useFlowDesign } from '../FlowDesignContext'
import type { NotifyNode as NotifyNodeType, ErrorInfo } from './type'
import { getByUsername } from '@/api/modules/user'
import { getById } from '@/api/modules/role'

interface NotifyNodeProps {
  node: NotifyNodeType
}

const NotifyNode: React.FC<NotifyNodeProps> = ({ node }) => {
  const { fields, setNodesError, addNode, delNode, openPanel } = useFlowDesign()
  const [content, setContent] = useState('')

  useEffect(() => {
    const errors: ErrorInfo[] = []
    const { id, assigneeType, name, users, roles, leader, choice, formUser, formRole, orgLeader, subject, types } = node

    if (assigneeType === 'user') {
      if (users.length > 0) {
        Promise.all(users.map((user) => getByUsername(user))).then((results) => {
          setContent(results.map((r) => r.data.name).join('、'))
        })
      } else {
        errors.push({ id, name, message: '未指定人员' })
        setContent('未指定人员')
      }
    } else if (assigneeType === 'choice') {
      setContent(`发起人自选（${choice ? '多选' : '单选'}）`)
    } else if (assigneeType === 'self') {
      setContent('发起人自己')
    } else if (assigneeType === 'leader') {
      setContent(leader === 1 ? '直属上级' : `${leader}级上级`)
    } else if (assigneeType === 'orgLeader') {
      setContent(orgLeader === 1 ? '直属主管' : `${orgLeader}级主管`)
    } else if (assigneeType === 'formUser') {
      if (!formUser) errors.push({ id, name, message: '未指定表单内人员' })
      const title = fields.find((e) => e.id === formUser)?.label || formUser || '?'
      setContent(`表单内（${title}）人员`)
    } else if (assigneeType === 'formRole') {
      if (!formRole) errors.push({ id, name, message: '未指定表单内角色' })
      const title = fields.find((e) => e.id === formRole)?.label || formRole || '?'
      setContent(`表单内（${title}）角色`)
    } else if (assigneeType === 'role') {
      if (roles.length > 0) {
        Promise.all(roles.map((rid) => getById(rid))).then((results) => {
          setContent(results.map((r) => r.data.name).join('、'))
        })
      } else {
        errors.push({ id, name, message: '未指定角色' })
        setContent('未指定角色')
      }
    } else {
      errors.push({ id, name, message: '未知错误' })
      setContent(name)
    }

    if (types.length === 0) errors.push({ id, name, message: '未指定通知类型' })
    if (!subject) errors.push({ id, name, message: '消息主题为空' })
    if (!node.content) errors.push({ id, name, message: '消息内容为空' })

    setNodesError((prev) => {
      const next = { ...prev }
      if (errors.length > 0) {
        next[id] = errors
      } else {
        delete next[id]
      }
      return next
    })
  }, [node, node.assigneeType, node.users, node.roles, node.formUser, node.formRole, node.leader, node.orgLeader, node.choice, node.types, node.subject, node.content, fields])

  return (
    <NodeComponent
      icon="el:BellFilled"
      color="#95d475"
      node={node}
      onAddNode={(type) => addNode(type, node)}
      onDelNode={() => delNode(node)}
      onActiveNode={() => openPanel(node)}
    >
      <Typography.Text>{content}</Typography.Text>
    </NodeComponent>
  )
}

export default NotifyNode
