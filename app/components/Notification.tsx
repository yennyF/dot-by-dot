import { toast } from "react-toastify";
import LoadingIcon from "./Loading/LoadingIcon";

const autoClose = 5000;

export const notifyLoadError = () =>
  toast(<div>Error loading</div>, { autoClose });

export const notifyCreateError = () =>
  toast(<div>Error creating</div>, { autoClose });

export const notifyUpdateError = () =>
  toast(<div>Error uptading</div>, { autoClose });

export const notifyMoveError = () =>
  toast(<div>Error moving</div>, { autoClose });

export const notifyDeleteError = () =>
  toast(<div>Error deleting</div>, { autoClose });

export const notifyLoading = () =>
  toast(
    <div className="flex items-center">
      <LoadingIcon />
      Loading…
    </div>,
    {
      autoClose: false,
      position: "bottom-center",
      closeButton: false,
    }
  );
