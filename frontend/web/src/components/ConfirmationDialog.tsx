import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

interface ConfirmationDialogProps {
    name: string,
    prompt: string,
    func: () => void
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ name, prompt, func }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'destructive'}>{name}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]  w-3/4 rounded-md">
                <DialogHeader>
                    <DialogTitle>{name}</DialogTitle>
                    <DialogDescription>{prompt}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="space-x-4">
                    <DialogClose asChild>
                        <Button onClick={func}>Confirm</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant={'outline'}>Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmationDialog
