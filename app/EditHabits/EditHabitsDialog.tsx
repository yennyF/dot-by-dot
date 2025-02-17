"use client"

import { Dialog } from "radix-ui";
import { ChangeEvent, use, useState } from "react";
import styles from './EditHabitsDialog.module.scss';
import { TrashIcon, Pencil1Icon, PlusIcon, Cross1Icon } from "@radix-ui/react-icons";
import { AppContext } from "../AppContext";
import DeleteConfirm from "./DeleteConfirm";

interface EditHabitsDialogProps {
    children: React.ReactNode;
}

export default function EditHabitsDialog({ children }: EditHabitsDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            {open &&
                <Dialog.Portal>
                    <Dialog.Overlay className={`${styles.overlay} overlay`}>
                        <DialogContent />
                    </Dialog.Overlay>
                </Dialog.Portal>
            }
        </Dialog.Root>
    );
}

function DialogContent() {
    const appContext = use(AppContext);
    if (!appContext) {
        throw new Error('DialogContent must be used within a AppProvider');
    }
    const { habits, addHabit, deleteHabit } = appContext;

    const [habitInput, setHabitInput] = useState('');

    const handleHabitInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setHabitInput(event.target.value);
    };

    const handleAddHabitClick = () => {
        if (addHabit(habitInput)) {
            setHabitInput('');
        }
    };

    const handleDeleteHabitClick = (habit: string) => {
        deleteHabit(habit);
    };

    return (
        <Dialog.Content className={`${styles.content} relative flex flex-col gap-10 w-[480px] max-h-full p-[30px] overflow-y-scroll bg-neutral-800`}>
            <Dialog.Close>
                <div className="button-icon">
                    <Cross1Icon />
                </div>
            </Dialog.Close>
            <Dialog.Title>Edit habits</Dialog.Title>
            <div className="flex flex-col items-start gap-3">
                {habits.map((habit, index) => (
                    <div key={index} className={`${styles.habitItem} flex items-center justify-between gap-0 w-full py-1`}>
                        {habit}
                        <div className={`${styles.habitOptions} flex items-center justify-between gap-1`}>
                            <div className="button-icon">
                                <Pencil1Icon className="icon"/>
                            </div>
                            <DeleteConfirm habit={habit} onConfirm={() => {handleDeleteHabitClick(habit)}}>
                                <div className="button-icon">
                                    <TrashIcon className="icon"/>
                                </div>
                            </DeleteConfirm>
                        </div>
                    </div>
                ))}
            </div>
            <div className="shadow-medium fixed right-0 bottom-0 w-[480px] p-[30px]">
                <fieldset className="flex gap-3">
                    <input type="text" value={habitInput} onChange={handleHabitInputChange} placeholder="New habit" className="basis-full"></input>
                    <button onClick={handleAddHabitClick} className="button-default flex-none" disabled={habitInput.length === 0}>
                        <PlusIcon />
                        Add
                    </button>
                </fieldset>
            </div>
        </Dialog.Content>
    );
}

