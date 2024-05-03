import React, { ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tittle: string;
  className?: string;
  buttonText: string;
  children?:  ReactNode;
  handleClick?: () => void;
  image?: string;
  buttonIcon?: string;
}

const MeetingModal = ({ isOpen, onClose, tittle, className, buttonText, children, handleClick, image, buttonIcon }: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex w-full max-w-[530px] flex-col gap-6 border-0.5px backdrop-blur-sm bg-blak/10 px-6 py-9 text-white'>
        <div className='flex flex-col gap-6'>
          {image && (
            <div className='flex justify-center'>
            <Image src={image} alt="image" width={72} height={72} />
            </div>
          )}
          <h1 className={cn('text-2xl font-bold leading-[42px]', className)}>
            {tittle}
          </h1>
          {children}
          <Button className='bg-dark-2 focus-visible:ring-0
          focus-visible:ring-offset-0' onClick={handleClick}>
            {buttonIcon && (
              <Image src={buttonIcon} alt="button icon" width={13} height={13} />
            )} &nbsp;
            {buttonText || 'schedule Meeting'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

  )
}

export default MeetingModal