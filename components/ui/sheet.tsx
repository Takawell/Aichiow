'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/utils/cn'

export const Sheet = Dialog.Root
export const SheetTrigger = Dialog.Trigger
export const SheetClose = Dialog.Close

export function SheetContent({
  className,
  side = 'right',
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog.Content> & {
  side?: 'right' | 'left'
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
      <Dialog.Content
        className={cn(
          'fixed z-50 bg-dark text-white shadow-xl transition-transform duration-300 ease-in-out',
          side === 'right' ? 'top-0 right-0 h-full w-64' : 'top-0 left-0 h-full w-64',
          className
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  )
}
