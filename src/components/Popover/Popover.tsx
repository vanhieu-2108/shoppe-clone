import { useRef, useState } from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  safePolygon,
  useInteractions,
  arrow,
  FloatingPortal
} from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className: string
}
export default function Popover({ children, renderPopover, className }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const arrowRef = useRef(null)
  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift(), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate,
    transform: false,
    placement: 'bottom-end'
  })
  const hover = useHover(context, { handleClose: safePolygon() })
  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss])
  const left = middlewareData.arrow?.x && middlewareData.arrow?.x - 20
  return (
    <div className={className} {...getReferenceProps()} ref={refs.setReference}>
      {children}
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={refs.setFloating}
              style={{
                transformOrigin: `${middlewareData?.arrow?.x}px top`,
                ...floatingStyles
              }}
              initial={{ opacity: 0, transform: `scale(0)` }}
              animate={{ opacity: 1, transform: `scale(1)` }}
              exit={{ opacity: 0, transform: `scale(0)` }}
              transition={{ duration: 0.2 }}
              {...getFloatingProps()}
            >
              <span
                ref={arrowRef}
                className='absolute z-10 -translate-y-[90%] translate-x-[80%] border-[14px] border-x-transparent border-t-transparent border-b-white'
                style={{
                  left: `${left}px`,
                  top: `${middlewareData.arrow?.y}px`
                }}
              />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div>
  )
}
