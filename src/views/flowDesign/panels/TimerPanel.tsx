import React from 'react'
import { Form, Radio, Input, Select, DatePicker } from 'antd'
import type { TimerNode } from '../nodes/type'

interface TimerPanelProps {
  activeData: TimerNode
  onUpdate: () => void
}

const TimerPanel: React.FC<TimerPanelProps> = ({ activeData, onUpdate }) => {
  const updateField = (key: string, value: any) => {
    (activeData as any)[key] = value
    onUpdate()
  }

  return (
    <Form layout="vertical">
      <Form.Item label="等待方式">
        <Radio.Group value={activeData.waitType} onChange={(e) => updateField('waitType', e.target.value)}>
          <Radio.Button value="duration">固定时长</Radio.Button>
          <Radio.Button value="date">固定时间</Radio.Button>
        </Radio.Group>
      </Form.Item>
      {activeData.waitType === 'duration' && (
        <Form.Item label="等待时长">
          <Input.Group compact>
            <Input
              value={activeData.duration}
              onChange={(e) => updateField('duration', Number(e.target.value) || 0)}
              type="number"
              style={{ width: 150 }}
              min={0}
              max={9999999}
            />
            <Select
              value={activeData.unit}
              onChange={(val) => updateField('unit', val)}
              style={{ width: 80 }}
              options={[
                { label: '秒', value: 'PT%sS' },
                { label: '分钟', value: 'PT%sM' },
                { label: '小时', value: 'PT%sH' },
                { label: '天', value: 'P%sD' },
                { label: '周', value: 'P%sW' },
                { label: '月', value: 'P%sM' }
              ]}
            />
          </Input.Group>
        </Form.Item>
      )}
      {activeData.waitType === 'date' && (
        <Form.Item label="指定时间">
          <Input
            value={activeData.timeDate}
            onChange={(e) => updateField('timeDate', e.target.value)}
            placeholder="请输入等待时间 (YYYY-MM-DD HH:mm:ss)"
          />
        </Form.Item>
      )}
    </Form>
  )
}

export default TimerPanel
