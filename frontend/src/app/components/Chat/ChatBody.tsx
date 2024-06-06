import { useRef, useEffect } from "react";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import { useUser } from "../../contexts/UserContext";
import { useRoom } from "../../contexts/RoomContext";
import { useSocket } from "@/app/contexts/SocketContext";
import { useZoomInImage } from "@/app/hooks/useZoomInImage";
import "../../styles/chat/ChatBody.sass";

dayjs.extend(utc);
dayjs.extend(tz);

const SystemMessage = ({ message }: { message: string }) => {
  return (
    <Stack className="message-item" direction="row" justifyContent="center">
      {message}
    </Stack>
  );
};

const SelfMessage = ({
  imgUrl,
  message,
  createAt,
}: {
  imgUrl: string;
  message: string;
  createAt: any;
}) => {
  const { setImageUrl } = useZoomInImage();

  return (
    <Stack className="message-item self" direction="row" justifyContent="end">
      <Stack direction="column" alignItems="end" sx={{ width: "100%" }}>
        {imgUrl ? (
          <img
            alt="img"
            className="image"
            src={process.env.NEXT_PUBLIC_S3_IMAGE_URL + imgUrl}
            onClick={() =>
              setImageUrl(process.env.NEXT_PUBLIC_S3_IMAGE_URL + imgUrl)
            }
          ></img>
        ) : (
          <span className="message">{message}</span>
        )}
        <p className="time">{createAt.format("HH:mm")}</p>
      </Stack>
    </Stack>
  );
};

const OtherMessage = ({
  name,
  imgUrl,
  message,
  createAt,
}: {
  name: string;
  imgUrl: string;
  message: string;
  createAt: any;
}) => {
  const { setImageUrl } = useZoomInImage();

  return (
    <Stack className="message-item" direction="row">
      <div>
        <div className="avatar">{name.slice(0, 2)}</div>
      </div>
      <Stack alignItems="start" sx={{ width: "100%" }}>
        <p className="name">{name}</p>
        {imgUrl ? (
          <img
            alt="message-img"
            className="image"
            src={process.env.NEXT_PUBLIC_S3_IMAGE_URL + imgUrl}
            onClick={() =>
              setImageUrl(process.env.NEXT_PUBLIC_S3_IMAGE_URL + imgUrl)
            }
          ></img>
        ) : (
          <span className="message">{message}</span>
        )}
        <p className="time">{createAt.format("HH:mm")}</p>
      </Stack>
    </Stack>
  );
};

export default function ChatBody() {
  const { userData } = useUser();
  const { messages } = useSocket();
  const { currentRoom } = useRoom();
  const { room_id } = currentRoom[0] || 0;
  const chatBottomRef = useRef<HTMLDivElement>(null);

  console.log("messages", messages);

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
        messages[room_id].map((msg, key) => {
          const userTimezone = dayjs.tz.guess();

          return msg.is_system ? (
            <SystemMessage key={key} message={msg.message} />
          ) : msg.sender_id === userData.id ? (
            <SelfMessage
              imgUrl={msg.img_url}
              key={key}
              message={msg.message}
              createAt={dayjs(msg.create_at).tz(userTimezone)}
            />
          ) : (
            <OtherMessage
              name={msg.sender_name}
              imgUrl={msg.img_url}
              key={key}
              message={msg.message}
              createAt={dayjs(msg.create_at).tz(userTimezone)}
            />
          );
        })
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
