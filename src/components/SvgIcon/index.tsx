import React, { type CSSProperties } from 'react'
import * as AntdIcons from '@ant-design/icons'
import './index.scss'

interface SvgIconProps {
  name: string
  prefix?: string
  color?: string
  size?: number
  className?: string
}

const antdIconMap: Record<string, React.ComponentType> = AntdIcons as any

const SvgIcon: React.FC<SvgIconProps> = ({ name, prefix = 'icon', color, size, className }) => {
  const svgClass = ['svg-icon', name?.replace('el:', ''), className].filter(Boolean).join(' ')
  const style: CSSProperties = {}
  if (size) {
    style.fontSize = `${size}px`
  }
  if (color) {
    style.color = color
  }

  if (!name) return null

  // Map Element Plus icon names to Ant Design icon names
  if (name.startsWith('el:')) {
    const iconName = name.slice(3)
    // Try to find the icon in antd icons
    const mappedName = iconName + 'Outlined'
    const IconComp = antdIconMap[mappedName] || antdIconMap[iconName]
    if (IconComp) {
      return <IconComp style={style} className={svgClass} />
    }
    // fallback: render text
    return <span className={svgClass} style={style}>{iconName}</span>
  }

  // SVG sprite icon
  const symbolId = `#${prefix}-${name}`
  return (
    <svg className={svgClass} style={style} aria-hidden="true">
      <use xlinkHref={symbolId} fill={color || 'currentColor'} />
    </svg>
  )
}

export default SvgIcon
