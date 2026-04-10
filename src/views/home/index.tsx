import React, { useState } from 'react'
import { Switch, Button, Dropdown } from 'antd'
import { DownloadOutlined, DownOutlined } from '@ant-design/icons'
import FlowDesign from '@/views/flowDesign'
import type { Field } from '@/components/Render/type'
import type { EndNode, FlowNode, StartNode } from '@/views/flowDesign/nodes/type'
import { downloadXml } from '@/api/modules/model'

const Home: React.FC = () => {
  const [process] = useState<FlowNode>({
    id: 'root',
    pid: undefined,
    type: 'start',
    name: '发起人',
    executionListeners: [],
    formProperties: [],
    next: {
      id: 'end',
      pid: 'root',
      type: 'end',
      name: '流程结束',
      executionListeners: [],
      next: undefined
    } as EndNode
  } as StartNode)

  const [fields] = useState<Field[]>([
    {
      id: 'field_da2w55',
      type: 'formItem',
      label: '请假人',
      name: 'UserSelector',
      value: null,
      readonly: false,
      required: true,
      hidden: false,
      props: {
        multiple: false,
        disabled: false,
        placeholder: '请选择用户',
        style: { width: '100%' }
      }
    },
    {
      id: 'field_fa2w40',
      type: 'formItem',
      label: '请假天数',
      name: 'ElInputNumber',
      value: null,
      readonly: false,
      required: true,
      hidden: false,
      props: {
        disabled: false,
        placeholder: '请假天数',
        style: { width: '100%' },
        min: 0,
        max: 100,
        step: 1,
        precision: 0
      }
    },
    {
      id: 'field_d42t45',
      type: 'formItem',
      label: '请假事由',
      name: 'ElSelect',
      value: null,
      readonly: false,
      required: true,
      hidden: false,
      props: {
        disabled: false,
        multiple: false,
        placeholder: '请选择请假事由',
        options: [
          { label: '事假', value: '事假' },
          { label: '病假', value: '病假' },
          { label: '婚假', value: '婚假' },
          { label: '产假', value: '产假' },
          { label: '丧假', value: '丧假' },
          { label: '其他', value: '其他' }
        ],
        style: { width: '100%' }
      }
    },
    {
      id: 'field_522g58',
      type: 'formItem',
      label: '请假原因',
      name: 'ElInput',
      value: null,
      readonly: false,
      required: true,
      hidden: false,
      props: {
        type: 'textarea',
        placeholder: '请输入请假原因',
        autosize: { minRows: 3, maxRows: 3 },
        disabled: false,
        style: { width: '100%' }
      }
    }
  ])

  const [readOnly, setReadOnly] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const converterBpmn = () => {
    const processModel = {
      code: 'test',
      name: '测试',
      icon: { name: 'el:HomeFilled', color: '#409EFF' },
      process: process,
      enable: true,
      version: 1,
      sort: 0,
      groupId: '',
      remark: ''
    }
    downloadXml(processModel)
  }

  const handleToggleDark = (checked: boolean) => {
    setIsDark(checked)
    if (checked) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const menuItems = [
    { key: 'gitee', label: 'Gitee', onClick: () => window.open('https://gitee.com/cai_xiao_feng/lowflow-design') },
    { key: 'github', label: 'Github', onClick: () => window.open('https://github.com/tsai996/lowflow-design') }
  ]

  return (
    <FlowDesign process={process} fields={fields} readOnly={readOnly}>
      <Switch
        checkedChildren="正常模式"
        unCheckedChildren="暗黑模式"
        checked={isDark}
        onChange={handleToggleDark}
      />
      <Switch
        checkedChildren="只读模式"
        unCheckedChildren="编辑模式"
        checked={readOnly}
        onChange={setReadOnly}
      />
      <Button.Group>
        <Button type="primary" icon={<DownloadOutlined />} onClick={converterBpmn}>
          转bpmn
        </Button>
        <Dropdown menu={{ items: menuItems }}>
          <Button type="primary">
            开源地址 <DownOutlined />
          </Button>
        </Dropdown>
      </Button.Group>
    </FlowDesign>
  )
}

export default Home
