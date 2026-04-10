import React, { useState, useEffect } from 'react'
import { Typography } from 'antd'
import NodeComponent from './Node'
import { useFlowDesign } from '../FlowDesignContext'
import type { ApprovalNode as ApprovalNodeType, ErrorInfo } from './type'
import { getByUsername } from '@/api/modules/user'
import { getById } from '@/api/modules/role'

interface ApprovalNodeProps {
  node: ApprovalNodeType
}

const ApprovalNode: React.FC<ApprovalNodeProps> = ({ node }) => {
  const { fields, setNodesError, addNode, delNode, openPanel } = useFlowDesign()
  const [content, setContent] = useState('')

  useEffect(() => {
    const errors: ErrorInfo[] = []
    const { id, name, assigneeType, nobody, nobodyUsers, choice, formUser, formRole, leader, orgLeader, users, roles } = node

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
    } else if (assigneeType === 'autoRefuse') {
      setContent('系统自动拒绝')
    } else {
      errors.push({ id, name, message: '未知错误' })
      setContent(name)
    }

    if (nobody === 'assign') {
      if (!nobodyUsers || nobodyUsers.length === 0) {
        errors.push({ id, name, message: '未指定审批人为空时的处理人' })
      }
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
  }, [node, node.assigneeType, node.users, node.roles, node.nobody, node.nobodyUsers, node.formUser, node.formRole, node.leader, node.orgLeader, node.choice, fields])

  return (
    <NodeComponent
      icon="el:Stamp"
      color="linear-gradient(89.96deg, #FA6F32 .05%, #FB9337 79.83%)"
      node={node}
      onAddNode={(type) => addNode(type, node)}
      onDelNode={() => delNode(node)}
      onActiveNode={() => openPanel(node)}
    >
      <Typography.Text>{content}</Typography.Text>
    </NodeComponent>
  )
}

export default ApprovalNode
