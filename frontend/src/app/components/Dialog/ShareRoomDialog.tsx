import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
// import TwitterIcon from '@mui/icons-material/Twitter';
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { useSnackBar } from "../../hooks/useSnackBar";
import { useRoom } from "@/app/contexts/RoomContext";

type DialogProps = {
  open: boolean;
  closeDialog: () => void;
};

export default function DialogComponent({ open, closeDialog }: DialogProps) {
  const { currentRoom } = useRoom();
  const { room_id } = currentRoom[0] || "";
  const openSnackBar = useSnackBar();

  const handleClose = () => {
    closeDialog();
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(room_id);
    openSnackBar({
      text: "Copied!",
      status: "success",
    });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        {/* <DialogTitle>Share</DialogTitle>
                <DialogContent>
                    <TwitterIcon />
                </DialogContent> */}
        <DialogTitle>Copy Room ID</DialogTitle>
        <DialogContent>
          <Stack direction="row" alignItems="center">
            <TextField
              id="outlined-basic"
              value={room_id}
              fullWidth
              disabled
            ></TextField>
            <Tooltip title="Copy">
              <IconButton
                aria-label="menu"
                sx={{ height: "40px", marginLeft: "20px" }}
                onClick={handleCopy}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
}
