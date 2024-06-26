import { useEffect } from "react";
import { useRouter } from "next/router";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import { useUser } from "@/app/contexts/UserContext";
import { useRoom } from "@/app/contexts/RoomContext";
import { useSocket } from "@/app/contexts/SocketContext";
import { useSnackBar } from "@/app//hooks/useSnackBar";
import RoomSideBar from "@/app/components/Room/RoomSideBar";
import RoomMain from "@/app/components/Room/RoomMain";
import "@/app/styles/room.sass";
import { IRoomArray, IRoomNestedArray } from "@/app/interfaces/IRoom";
import IMessage from "@/app/interfaces/IMessage";

type ShowSnackBarProps = {
  msg: string;
  status: "error" | "warning" | "success" | "info";
};

type UsersAndRoomMapType = {
  [key: string]: string[];
};

export default function Room() {
  const { socket, messages, setLastSeenMsg } = useSocket();
  const { setRooms } = useRoom();
  const { userData } = useUser();
  const openSnackBar = useSnackBar();
  const { query } = useRouter();
  const { roomId } = query;

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

    function onShowSnackBar({ msg, status }: ShowSnackBarProps) {
      openSnackBar({
        text: msg,
        status: status,
      });
    }
    function onGetRooms(result: IRoomNestedArray) {
      setRooms(result);
    }
    function onUpdateOnlineUserAmount(list: UsersAndRoomMapType) {
      setRooms((prev: IRoomNestedArray) => {
        let a = prev;
        a = a.map((item: IRoomArray) => {
          const { room_id } = item[0];
          if (list[room_id]) {
            item[0].online_user_amount = list[room_id].length;
          }
          return item;
        });
        return a;
      });
    }

    socket.on("showSnackBar", onShowSnackBar);
    socket.on("getRooms", onGetRooms);
    socket.on("updateOnlineUserAmount", onUpdateOnlineUserAmount);
    // Server 通知完後再傳送 disConnection 通知關閉連線
    socket.on("disConnection", () => {
      console.log("close!");
      socket.close();
    });

    return () => {
      socket.off("showSnackBar", onShowSnackBar);
      socket.off("getRooms", onGetRooms);
      socket.off("updateOnlineUserAmount", onUpdateOnlineUserAmount);
    };
  }, [socket, userData]);

  useEffect(() => {
    if (socket && userData.id) {
      socket.emit("getRooms", userData.id);
    }
  }, [socket, userData?.id]);

  if (!userData.id)
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <CircularProgress color="secondary" size="40px" />
      </Stack>
    );

  return (
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
