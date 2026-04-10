import React from 'react'
import { useFlowDesign } from '../FlowDesignContext'
import AdvancedFilter from '@/components/AdvancedFilter'
import type { ConditionNode } from '../nodes/type'
import type { Field } from '@/components/Render/type'

interface ConditionPanelProps {
  activeData: ConditionNode
  onUpdate: () => void
}

const initialFormFields: Field[] = [
  {
    id: 'initiator',
    name: 'UserSelector',
    type: 'formItem',
    label: '发起人',
    value: null,
    readonly: false,
    required: true,
    hidden: false,
    props: {
      multiple: false,
      placeholder: '请选择发起人',
      style: { width: '100%' }
    }
  }
]

const ConditionPanel: React.FC<ConditionPanelProps> = ({ activeData, onUpdate }) => {
  const { fields } = useFlowDesign()

  return (
    <AdvancedFilter
      value={activeData.conditions}
      onChange={(val) => {
        activeData.conditions = val
        onUpdate()
      }}
      filterFields={[...initialFormFields, ...fields]}
    />
  )
}

export default ConditionPanel
