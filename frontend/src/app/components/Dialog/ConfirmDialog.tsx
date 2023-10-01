import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

type DialogProps = {
  open: boolean;
  content: string;
  closeDialog: () => void;
  handleConfirm: () => void;
};

export default function DialogComponent({
  open,
  content,
  closeDialog,
  handleConfirm,
}: DialogProps) {
  const handleClose = () => {
    closeDialog();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ fontWeight: "normal !important" }}>
          {content}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
