import React from 'react'
import { Button, Form, Select, Switch, Row, Col } from 'antd'
import { DeleteOutlined, PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import type { FilterRules } from './type'
import type { Field } from '@/components/Render/type'
import Render from '@/components/Render'
import './index.scss'

interface AdvancedFilterProps {
  filterFields: Field[]
  value: FilterRules
  onChange: (value: FilterRules) => void
  onDelGroup?: () => void
  children?: React.ReactNode
}

const operatorOptions = [
  { value: 'eq', label: '等于' },
  { value: 'ne', label: '不等于' },
  { value: 'in', label: '包含' },
  { value: 'ni', label: '不包含' }
]

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  filterFields,
  value: filterRules,
  onChange,
  onDelGroup,
  children
}) => {
  const update = (updater: (draft: FilterRules) => void) => {
    const next = { ...filterRules, conditions: [...filterRules.conditions], groups: [...filterRules.groups] }
    updater(next)
    onChange(next)
  }

  const addRule = () => {
    update((draft) => {
      draft.conditions.push({ field: null, operator: 'eq', value: null })
    })
  }

  const handleDel = (index: number) => {
    const newConditions = filterRules.conditions.filter((_, i) => i !== index)
    const next = { ...filterRules, conditions: newConditions }
    onChange(next)
    if (newConditions.length <= 0) {
      onDelGroup?.()
    }
  }

  const addGroup = () => {
    update((draft) => {
      draft.groups.push({
        operator: 'and',
        conditions: [{ field: null, operator: '', value: null }],
        groups: []
      })
    })
  }

  const delGroup = (index: number) => {
    const newGroups = filterRules.groups.filter((_, i) => i !== index)
    onChange({ ...filterRules, groups: newGroups })
  }

  const updateCondition = (index: number, key: string, val: any) => {
    const newConditions = filterRules.conditions.map((c, i) => {
      if (i === index) {
        const updated = { ...c, [key]: val }
        if (key === 'field') updated.value = null
        return updated
      }
      return c
    })
    onChange({ ...filterRules, conditions: newConditions })
  }

  const toggleOperator = (checked: boolean) => {
    onChange({ ...filterRules, operator: checked ? 'and' : 'or' })
  }

  return (
    <div className="filter-container">
      <div className="logical-operator">
        <div className="logical-operator__line" />
        <Switch
          checked={filterRules.operator === 'and'}
          onChange={toggleOperator}
          checkedChildren="且"
          unCheckedChildren="或"
          style={{ backgroundColor: filterRules.operator === 'and' ? '#409eff' : '#67c23a' }}
        />
      </div>
      <div className="filter-option-content">
        <Form>
          {filterRules.conditions.map((item, index) => (
            <Row key={`${item.field}-${index}`} gutter={5} className="filter-item-rule">
              <Col xs={24} sm={7}>
                <Select
                  value={item.field}
                  onChange={(val) => updateCondition(index, 'field', val)}
                  showSearch
                  placeholder="选择字段"
                  style={{ width: '100%' }}
                  options={filterFields
                    .filter((e) => e.value !== undefined)
                    .map((f) => ({ label: f.label, value: f.id }))}
                />
              </Col>
              {item.field && (
                <Col xs={24} sm={5}>
                  <Select
                    value={item.operator}
                    onChange={(val) => updateCondition(index, 'operator', val)}
                    showSearch
                    placeholder="筛选符"
                    style={{ width: '100%' }}
                    options={operatorOptions}
                  />
                </Col>
              )}
              {item.field && (
                <Col xs={24} sm={10}>
                  <Render
                    field={filterFields.find((e) => e.id === item.field) as Field}
                    value={item.value}
                    onChange={(val) => updateCondition(index, 'value', val)}
                  />
                </Col>
              )}
              <Col xs={24} sm={2} style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse' }}>
                <Button
                  shape="circle"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDel(index)}
                />
              </Col>
            </Row>
          ))}
          {filterRules.groups.map((group, index) => (
            <AdvancedFilter
              key={index}
              value={group}
              onChange={(val) => {
                const newGroups = [...filterRules.groups]
                newGroups[index] = val
                onChange({ ...filterRules, groups: newGroups })
              }}
              onDelGroup={() => delGroup(index)}
              filterFields={filterFields}
            >
              <Button icon={<CloseCircleOutlined />} onClick={() => delGroup(index)} className="filter-filter-item__add">
                删除条件组
              </Button>
            </AdvancedFilter>
          ))}
          {filterRules.groups.length === 0 && filterRules.conditions.length === 0 && (
            <div className="filter-item-rule" />
          )}
        </Form>
        <div className="filter-item-rule">
          <Button icon={<PlusCircleOutlined />} onClick={addRule} className="filter-filter-item__add">
            添加条件
          </Button>
          <Button icon={<PlusCircleOutlined />} onClick={addGroup} className="filter-filter-item__add">
            添加条件组
          </Button>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdvancedFilter
