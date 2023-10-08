import { useRef, useEffect } from "react";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import { useUser } from "../../contexts/UserContext";
import { useRoom } from "../../contexts/RoomContext";
import { useSocket } from "@/app/contexts/SocketContext";
import { useZoomInImage } from "@/app/hooks/useZoomInImage";
import "../../styles/chat/ChatBody.sass";

export default function ChatBody() {
  const { userData } = useUser();
  const { messages } = useSocket();
  const { currentRoom } = useRoom();
  const { room_id } = currentRoom[0] || 0;
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const { setImageUrl } = useZoomInImage();

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="chatBody">
      {messages[room_id] ? (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        messages[room_id].map((msg, key) =>
          msg.socketId === "wsSystem" ? (
            <Stack
              className="message-item"
              direction="row"
              justifyContent="center"
              key={key}
            >
              {msg.text}
            </Stack>
          ) : msg.id === userData.id ? (
            <Stack
              className="message-item self"
              direction="row"
              justifyContent="end"
              key={key}
            >
              <Stack direction="column" alignItems="end" sx={{ width: "100%" }}>
                {msg.imageUrl ? (
                  <img
                    className="image"
                    src={process.env.NEXT_PUBLIC_S3_IMAGE_URL + msg.imageUrl}
                    onClick={() =>
                      setImageUrl(
                        process.env.NEXT_PUBLIC_S3_IMAGE_URL + msg.imageUrl,
                      )
                    }
                  ></img>
                ) : (
                  <span className="message">{msg.text}</span>
                )}
                <p className="time">{dayjs(msg.time).format("HH:mm")}</p>
              </Stack>
            </Stack>
          ) : (
            <Stack className="message-item" direction="row" key={key}>
              <div>
                <div className="avatar">{msg.name.slice(0, 2)}</div>
              </div>
              <Stack alignItems="start" sx={{ width: "100%" }}>
                <p className="name">{msg.name}</p>
                {msg.imageUrl ? (
                  <img
                    className="image"
                    src={process.env.NEXT_PUBLIC_S3_IMAGE_URL + msg.imageUrl}
                    onClick={() =>
                      setImageUrl(
                        process.env.NEXT_PUBLIC_S3_IMAGE_URL + msg.imageUrl,
                      )
                    }
                  ></img>
                ) : (
                  <span className="message">{msg.text}</span>
                )}
                <p className="time">{dayjs(msg.time).format("HH:mm")}</p>
              </Stack>
            </Stack>
          ),
        )
      ) : (
        <Stack alignItems="center" sx={{ height: "100%" }}>
          <p style={{ color: "#b3c1ce", fontSize: "15px" }}>
            Say Hi To Everyone!
          </p>
        </Stack>
      )}
      <div id="chatBody-bottom" ref={chatBottomRef}></div>
    </div>
  );
}
