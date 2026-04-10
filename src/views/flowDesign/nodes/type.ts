import type { FilterRules } from '@/components/AdvancedFilter/type'

export type NodeType =
  | 'start'
  | 'approval'
  | 'cc'
  | 'exclusive'
  | 'timer'
  | 'notify'
  | 'service'
  | 'condition'
  | 'end'

export interface FlowNode {
  id: string
  pid?: string
  name: string
  type: NodeType
  executionListeners?: NodeListener[]
  next?: FlowNode
}

export interface NodeListener {
  event: string
  implementationType: 'class' | 'expression' | 'delegateExpression'
  implementation: string
}

export interface StartNode extends FlowNode {
  formProperties: FormProperty[]
}

export interface EndNode extends FlowNode {}

export interface AssigneeNode extends FlowNode {
  assigneeType:
    | 'user'
    | 'role'
    | 'choice'
    | 'self'
    | 'leader'
    | 'orgLeader'
    | 'formUser'
    | 'formRole'
    | 'autoRefuse'
  users: string[]
  roles: string[]
  formUser: string
  formRole: string
  leader: number
  orgLeader: number
  choice: boolean
  self: boolean
}

export interface CcNode extends AssigneeNode {
  formProperties: FormProperty[]
}

export interface NotifyNode extends AssigneeNode {
  types: ('site' | 'email' | 'sms' | 'wechat' | 'dingtalk' | 'feishu')[]
  subject: string
  content: string
}

export interface ApprovalNode extends AssigneeNode {
  multi: 'sequential' | 'joint' | 'single'
  nobody: 'refuse' | 'pass' | 'admin' | 'assign'
  multiPercent: number
  nobodyUsers: string[]
  formProperties: FormProperty[]
  operations: OperationPermissions
  taskListeners?: NodeListener[]
}

export interface ServiceNode extends FlowNode {
  implementationType: string
  implementation: string
}

export interface TimerNode extends FlowNode {
  waitType: 'duration' | 'date'
  unit: 'PT%sS' | 'PT%sM' | 'PT%sH' | 'P%sD' | 'P%sW' | 'P%sM'
  duration: number
  timeDate?: string
}

export interface ConditionNode extends FlowNode {
  def: boolean
  conditions: FilterRules
}

export interface BranchNode extends FlowNode {
  branches: FlowNode[]
}

export interface ExclusiveNode extends BranchNode {
  branches: ConditionNode[]
}

export interface ErrorInfo {
  id: string
  name: string
  message: string
}

export interface FormProperty {
  id: string
  name: string
  readonly: boolean
  required: boolean
  hidden: boolean
}

export interface OperationPermissions {
  complete: boolean
  refuse: boolean
  back: boolean
  transfer: boolean
  delegate: boolean
  addMulti: boolean
  minusMulti: boolean
}
