"use client";

import { Dialog } from "radix-ui";
import { useState } from "react";

interface DeleteConfirmationProps {
	children: React.ReactNode;
	habit: string;
	onConfirm: () => void;
}

export default function DeleteConfirm({
	children,
	habit,
	onConfirm,
}: DeleteConfirmationProps) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			{open && (
				<Dialog.Portal>
					<Dialog.Overlay className="overlay">
						<Dialog.Content className="dialogContent flex flex-col justify-center gap-8">
							<Dialog.Title>Delete Confirmation</Dialog.Title>
							<Dialog.Description>
								Are you sure you want to delete &quot;{habit}&quot;? All related
								records will be lost.
							</Dialog.Description>
							<div className="flex justify-center gap-3">
								<Dialog.Close>
									<div className="button-main" onClick={onConfirm}>
										Yes
									</div>
								</Dialog.Close>
								<Dialog.Close>
									<div className="button-cancel">No</div>
								</Dialog.Close>
							</div>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			)}
		</Dialog.Root>
	);
}
