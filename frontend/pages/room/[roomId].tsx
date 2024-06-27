import { useEffect } from "react";
import { useRouter } from "next/router";
import Stack from "@mui/material/Stack";

import { useUser } from "@/app/contexts/UserContext";
import { useRoom } from "@/app/contexts/RoomContext";
import { useSocket } from "@/app/contexts/SocketContext";
import { useSnackBar } from "@/app//hooks/useSnackBar";
import RoomSideBar from "@/app/components/Room/RoomSideBar";
import RoomMain from "@/app/components/Room/RoomMain";
import FullPageLoading from "@/app/components/FullPageLoading";
import IMessage from "@/app/interfaces/IMessage";
import "@/app/styles/room.sass";

type ShowSnackBarProps = {
  msg: string;
  status: "error" | "warning" | "success" | "info";
};

type UsersAndRoomMapType = {
  [key: string]: string[];
};

export default function Room() {
  const { socket, messages, setLastSeenMsg } = useSocket();
  const { rooms, setRooms, setCurrentRoom } = useRoom();
  const { userData } = useUser();
  const openSnackBar = useSnackBar();
  const { query, push } = useRouter();
  const { roomId } = query;

  function onShowSnackBar({ msg, status }: ShowSnackBarProps) {
    openSnackBar({
      text: msg,
      status,
    });
  }
  function onUpdateOnlineUserAmount(list: UsersAndRoomMapType) {
    setRooms((prev) =>
      prev.map((item) => {
        const { room_id } = item[0];
        if (list[room_id]) {
          item[0].online_user_amount = list[room_id].length;
        }
        return item;
      }),
    );
  }

  useEffect(() => {
    if (socket && roomId && rooms?.length) {
      const room = rooms?.find((item) => item[0]["room_id"] === roomId);
      if (room) {
        setCurrentRoom(room);
      } else {
        const firstRoomId = rooms[0][0]["room_id"];
        push(`/room/${firstRoomId}`);
      }
    }
  }, [roomId, rooms, socket]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const roomMessage = messages[roomId] || [];
    if (roomId && roomMessage.length) {
      const { text, time } =
        roomMessage.findLast((item: IMessage) => item.id !== userData.id) || {};
      //TODO Make it work
      if (text && time) {
        setLastSeenMsg((prev: any) => ({
          ...prev,
          [`${roomId}`]: text + time,
        }));
      }
    }
  }, [messages, roomId, userData.id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("showSnackBar", onShowSnackBar);
    socket.on("updateOnlineUserAmount", onUpdateOnlineUserAmount);
    // Server 通知完後再傳送 disConnection 通知關閉連線
    socket.on("disConnection", () => {
      console.log("close!");
      socket.close();
    });

    return () => {
      socket.off("showSnackBar", onShowSnackBar);
      socket.off("updateOnlineUserAmount", onUpdateOnlineUserAmount);
    };
  }, [socket, userData]);

  return !userData.id ? (
    <FullPageLoading />
  ) : (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      className="roomContainer"
    >
      <RoomSideBar />
      <RoomMain />
    </Stack>
  );
}
