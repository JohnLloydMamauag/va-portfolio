import { useRef } from 'react'

export default function MagneticButton({ as: Tag = 'a', className = '', children, ...rest }) {
  const ref = useRef(null)

  function handleMouseMove(e) {
    const el = ref.current
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`
  }

  function handleMouseLeave() {
    const el = ref.current
    if (el) el.style.transform = 'translate(0, 0)'
  }

  return (
    <Tag
      ref={ref}
      className={`magnetic ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </Tag>
  )
}
