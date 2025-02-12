"use client"

import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import './AddHabitDialog.css';

interface ModalProps {
    children: React.ReactNode;
}

export default function AddHabitDialog({ children }: ModalProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="overlay">
                    <Dialog.Content className="content flex flex-col gap-10">
                        <Dialog.Title>Edit profile</Dialog.Title>
                        <Dialog.Description>
                            <fieldset className="flex flex-col gap-2">
                                <label>New habit</label>
                                <input type="text"></input>
                            </fieldset>
                        </Dialog.Description>
                        <div className="flex justify-center">
                            <Dialog.Close asChild>
                                <button className="button-default">Add</button>
                            </Dialog.Close>
                        </div>
                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close">
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
