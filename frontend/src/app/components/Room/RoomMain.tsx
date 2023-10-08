import { useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import ChatBody from "../Chat/ChatBody";
import ChatAction from "../Chat/ChatAction";
import ShareRoomDialog from "../Dialog/ShareRoomDialog";
import ConfirmDialog from "../Dialog/ConfirmDialog";
import "../../styles/room/roomMain.sass";
import styles from "../../styles/index.module.sass";
import roomStyles from "../../styles/room/room.module.sass";
import { useSocket } from "../../contexts/SocketContext";
import { useUser } from "../../contexts/UserContext";
import { useRoom } from "../../contexts/RoomContext";
import { globalRoomId } from "../../configs/constant";

export default function RoomMain() {
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { socket } = useSocket();
  const { userData } = useUser();
  const { currentRoom } = useRoom();
  const { room_id, room_name } = currentRoom[0] || "";

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", {
      roomId: currentRoom[0]["room_id"],
      userId: userData.id,
      userName: userData.name,
    });
    setOpenConfirmDialog(false);
  };

  return (
    <div className={`${roomStyles.roomSection} roomMain`}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        className="roomMain--topBar"
      >
        <div className="chatroom-title">
          <h2>{currentRoom.length > 0 && room_name}</h2>
        </div>
        <Stack direction="row">
          <Box sx={{ mr: 2 }}>
            <Tooltip title="Invite/Share">
              <button
                className={`${styles.button}`}
                onClick={() => setOpenShareDialog(true)}
              >
                Invite
              </button>
            </Tooltip>
          </Box>
          {room_id !== globalRoomId && (
            <button
              className={`
                                ${styles.button}
                                ${styles.buttonSecondary}
                            `}
              onClick={() => setOpenConfirmDialog(true)}
            >
              Leave
            </button>
          )}
        </Stack>
      </Stack>
      <Stack className="chat--container" flexDirection="column">
        <ChatBody />
        <ChatAction />
      </Stack>
      <ShareRoomDialog
        open={openShareDialog}
        closeDialog={() => setOpenShareDialog(false)}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        closeDialog={() => setOpenConfirmDialog(false)}
        handleConfirm={handleLeaveRoom}
        content="Are you sure you want to leave this room?"
      />
    </div>
  );
}
