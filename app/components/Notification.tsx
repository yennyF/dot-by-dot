import { toast, ToastOptions } from "react-toastify";
import LoadingIcon from "./Loading/LoadingIcon";

const baseOptions: ToastOptions = {
  autoClose: 2000,
  position: "bottom-center",
  closeButton: false,
  // pauseOnHover: false,
  pauseOnFocusLoss: false,
  draggable: false,
};

export const notifyLoadError = () =>
  toast(<div>Error loading</div>, baseOptions);

export const notifyCreateError = () =>
  toast(<div>Error creating</div>, baseOptions);

export const notifyUpdateError = () =>
  toast(<div>Error uptading</div>, baseOptions);

export const notifyMoveError = () =>
  toast(<div>Error moving</div>, baseOptions);

export const notifyDeleteError = () =>
  toast(<div>Error deleting</div>, baseOptions);

export const notifySuccessful = (message: string) =>
  toast(<div>{message}</div>, baseOptions);

export const notifyLoading = () =>
  toast(
    <div className="flex items-center">
      <LoadingIcon />
      <span>Loading…</span>
    </div>,
    { ...baseOptions, autoClose: false }
  );
