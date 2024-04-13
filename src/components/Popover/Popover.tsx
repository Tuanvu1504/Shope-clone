import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useInteractions,
  useHover,
  safePolygon,
  FloatingPortal,
  arrow,
  FloatingArrow
} from '@floating-ui/react'
import { useRef, useState, useId, ElementType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initialOpen?: boolean
}

export default function Popover({
  children,
  renderPopover,
  className,
  as: Element = 'div',
  initialOpen
}: Props) {
  const [isOpen, setIsOpen] = useState(initialOpen || false)
  const arrowRef = useRef(null)
  const id = useId()

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
    middleware: [offset(10), flip(), shift(), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate
  })
  const hover = useHover(context, {
    handleClose: safePolygon()
  })

  const { getFloatingProps, getReferenceProps } = useInteractions([hover])
  return (
    <Element
      ref={refs.setReference}
      {...getReferenceProps()}
      className={className}
    >
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {isOpen && (
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                style={{
                  transformOrigin: `${middlewareData.arrow?.x}px top`
                }}
              >
                {renderPopover}
                <FloatingArrow
                  width={20}
                  height={8}
                  fill='white'
                  ref={arrowRef}
                  context={context}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}
