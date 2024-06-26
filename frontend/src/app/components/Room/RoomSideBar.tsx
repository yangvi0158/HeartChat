import { useState } from "react";
import { useRouter } from "next/router";
import Stack from "@mui/material/Stack";
import { default as MuiMenu } from "@mui/material/Menu";
import { default as MuiMenuItem } from "@mui/material/MenuItem";
import { signOut } from "next-auth/react";
import Image from "next/image";

import { useUser } from "@/app/contexts/UserContext";
import { useRoom } from "@/app/contexts/RoomContext";
import { useSocket } from "@/app/contexts/SocketContext";
import CreateRoomDialog from "../Dialog/CreateRoomDialog";
import RoomCard from "../Room/RoomCard";
import "../../styles/room/roomSideBar.sass";
import styles from "../../styles/index.module.sass";
import roomStyles from "../../styles/room/room.module.sass";
import IMessage from "@/app/interfaces/IMessage";

const Menu = ({ anchorEl, open, onClose, menuItems }) => {
  return (
    <MuiMenu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      {menuItems.map((item) => (
        <MuiMenuItem
          key={item.name}
          onClick={() => {
            onClose();
            item.onClick();
          }}
        >
          {item.name}
        </MuiMenuItem>
      ))}
    </MuiMenu>
  );
};

export default function RoomSideBar() {
  const { push } = useRouter();
  const { currentRoom, rooms, setIsInit } = useRoom();
  const [openDialog, setOpenDialog] = useState(false);
  const { userData } = useUser();
  const { socket, messages, lastSeenMsg } = useSocket();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleShowMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = () => setOpenDialog(true);
  const handleClickCLose = () => setOpenDialog(false);
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    socket.emit("disconnection", rooms);
    socket.close();
    setIsInit(false);
  };

  const menuItems = [
    {
      name: "Edit Profile",
      onClick: () => push("/profile"),
    },
    {
      name: "Home Page",
      onClick: () => push("/"),
    },
  ];

  const avatarStyle = userData.img_id
    ? {
        backgroundImage: `url(${
          process.env.NEXT_PUBLIC_S3_IMAGE_URL + userData.img_id
        })`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        color: "red",
      }
    : {
        backgroundColor: userData.avatar_color,
      };

  return (
    <div className={`${roomStyles.roomSection} roomSideBar`}>
      <Stack
        className="selfInfo--block"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center">
          <Stack
            className="selfInfo--avatar"
            justifyContent="center"
            alignItems="center"
            sx={avatarStyle}
          >
            {!userData.img_id && userData.name[0].toUpperCase()}
          </Stack>
          <div>
            <p className="selfInfo--name">{userData.name && userData.name}</p>
            <p className="selfInfo--desc">
              {userData.description && userData.description}
            </p>
          </div>
        </Stack>
        <button
          className="selfInfo--more_btn"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleShowMenu}
        >
          <Image src={`/moreIcon.svg`} alt="more" width="15" height="15" />
        </button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          menuItems={menuItems}
        ></Menu>
      </Stack>
      <div className="rooms--block">
        <p className="title">My Rooms</p>
        {rooms &&
          rooms.map((room, key) => {
            const roomId = room[0]["room_id"];
            const currentRoomId = currentRoom[0]?.["room_id"];
            const roomMsgs = messages[roomId] || [];
            const lastRoomMsgs =
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              roomMsgs.findLast((item: IMessage) => item.id !== userData.id) ||
              {};
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const hasUnreadMsg = !roomMsgs.length
              ? false
              : lastRoomMsgs.text &&
                lastSeenMsg[roomId] !== lastRoomMsgs.text + lastRoomMsgs.time;
            return (
              <div
                onClick={() => {
                  push(`/room/${roomId}`);
                }}
                key={key}
              >
                <RoomCard
                  room={room}
                  active={roomId === currentRoomId}
                  hasUnreadMsg={hasUnreadMsg}
                />
              </div>
            );
          })}
      </div>
      <Stack className="actions--block">
        <button className={`${styles.button}`} onClick={handleClickOpen}>
          Create Room
        </button>
        <button
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={handleSignOut}
        >
          Sign out
        </button>
        <CreateRoomDialog open={openDialog} closeDialog={handleClickCLose} />
      </Stack>
    </div>
  );
}
