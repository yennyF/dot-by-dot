import { toast } from "react-toastify";

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
