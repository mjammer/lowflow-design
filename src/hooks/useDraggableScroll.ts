import { useEffect, useRef, useCallback } from 'react'

export function useDraggableScroll(containerRef: React.RefObject<HTMLElement | null>) {
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const scrollLeft = useRef(0)
  const scrollTop = useRef(0)

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return
    const deltaX = e.pageX - startX.current
    const deltaY = e.pageY - startY.current
    containerRef.current.scrollLeft = scrollLeft.current - deltaX
    containerRef.current.scrollTop = scrollTop.current - deltaY
  }, [containerRef])

  const onMouseUp = useCallback(() => {
    isDragging.current = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }, [onMouseMove])

  const onMouseDown = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    isDragging.current = true
    startX.current = e.pageX
    startY.current = e.pageY
    scrollLeft.current = containerRef.current.scrollLeft
    scrollTop.current = containerRef.current.scrollTop
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [containerRef, onMouseMove, onMouseUp])

  useEffect(() => {
    const el = containerRef.current
    el?.addEventListener('mousedown', onMouseDown)
    return () => {
      el?.removeEventListener('mousedown', onMouseDown)
    }
  }, [containerRef, onMouseDown])

  return { isDragging }
}
