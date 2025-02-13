"use client"

import { Dialog } from "radix-ui";
import { ChangeEvent, useEffect, useState } from "react";
import './EditHabitsDialog.css';
import { getHabits, updateHabits } from "./api";
import { TrashIcon, Pencil1Icon, PlusIcon, Cross1Icon } from "@radix-ui/react-icons";

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
                    <Dialog.Overlay className="overlay">
                        <DialogContent />
                    </Dialog.Overlay>
                </Dialog.Portal>
            }
        </Dialog.Root>
    );
}

function DialogContent() {
    const [habits, setHabits] = useState<string[]>([]);
    const [habitInput, setHabitInput] = useState('');

    useEffect(() => {
        const habits = getHabits();
        setHabits(habits);
    }, []);

    const handleHabitInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setHabitInput(event.target.value);
    };

    const handleAddHabitClick = () => {
        if (habitInput.length) {
            const newHabits = [...habits, habitInput];
            setHabits(newHabits);
            setHabitInput('');
            updateHabits(newHabits);
        }
    };

    const handleDeleteHabitClick = (habit: string) => {
        const index = habits.indexOf(habit);
        if (index > -1) {
            const newHabits = [...habits];
            newHabits.splice(index, 1);
            setHabits(newHabits);
            updateHabits(newHabits);
        }
    };

    return (
        <Dialog.Content className="content relative flex flex-col gap-10 w-[480px] max-h-full p-[30px] overflow-y-scroll bg-neutral-800">
            <Dialog.Close>
                <div className="button-icon">
                    <Cross1Icon />
                </div>
            </Dialog.Close>
            <Dialog.Title>Edit habits</Dialog.Title>
            <div className="flex flex-col items-start gap-3">
                {habits.map((habit, index) => (
                    <div key={index} className="habitItem flex items-center justify-between gap-0 w-full py-1">
                        {habit}
                        <div className="habitOptions flex items-center justify-between gap-1">
                            <div className="button-icon">
                                <Pencil1Icon className="icon"/>
                            </div>
                            <div className="button-icon">
                                <TrashIcon className="icon" onClick={() => handleDeleteHabitClick(habit)} />
                            </div>
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

