export interface Condition {
  field: string | null
  operator: string
  value: any | null
}

export interface FilterRules {
  operator: 'or' | 'and'
  conditions: Condition[]
  groups: FilterRules[]
}
