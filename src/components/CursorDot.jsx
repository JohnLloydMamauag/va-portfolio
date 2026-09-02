import { useEffect, useRef } from 'react'

export default function CursorDot() {
  const dotRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const dot = dotRef.current

    function onMove(e) {
      dot.style.opacity = '1'
      dot.style.left = e.clientX + 'px'
      dot.style.top = e.clientY + 'px'
    }

    function grow() {
      dot.style.width = '22px'
      dot.style.height = '22px'
    }

    function shrink() {
      dot.style.width = '10px'
      dot.style.height = '10px'
    }

    window.addEventListener('mousemove', onMove)
    const targets = document.querySelectorAll('a, button, input, textarea')
    targets.forEach((el) => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', grow)
        el.removeEventListener('mouseleave', shrink)
      })
    }
  }, [])

  return <div ref={dotRef} className="cursor-dot" />
}
