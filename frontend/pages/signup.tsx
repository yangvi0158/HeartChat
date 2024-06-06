import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import { colorList } from "@/app/configs/constant";
import { socket } from "@/app/socket";
import { useUser } from "@/app/contexts/UserContext";
import styles from "@/app/styles/index.module.sass";
import "@/app/styles/signup.sass";

interface User {
  name: string;
  avatar_color: string;
}

export default function Signup() {
  const { userData, isFetched } = useUser();
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState<User>({
    name: "",
    avatar_color: colorList[0],
  });
  const { push } = useRouter();

  useEffect(() => {
    if (isFetched && userData.id) push("/room/init");
  }, [userData.id, isFetched]);

  const addUser = () => {
    if (!userInfo.name.length) return;
    const { user } = session || {};

    if (user) {
      socket.emit("addUser", {
        id: user.id,
        name: userInfo.name,
        avatar_color: userInfo.avatar_color,
      });
    }
    push("/room/init");
  };

  return (
    <div>
      {!isFetched || userData.id ? (
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100vh" }}
        >
          <CircularProgress color="secondary" size="40px" />
        </Stack>
      ) : (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          className="signup"
        >
          <Stack direction="row" alignItems="center">
            {/* <Image src={Logo} alt="logo"></Image> */}
            <p>Hello!</p>
          </Stack>
          <span>Choose a display name and pick a color that you like!</span>
          <TextField
            id="outlined-basic"
            label="Display Name"
            variant="filled"
            sx={{
              backgroundColor: "#3e4366",
              borderRadius: "10px",
              width: "300px",
              marginTop: "50px",
            }}
            onChange={(e) =>
              setUserInfo((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{
              padding: "20px 0",
              margin: "20px 0",
            }}
          >
            {colorList.map((color, key) => (
              <Box
                key={key}
                className={`colorItem ${
                  userInfo.avatar_color === color && `selectedColor`
                }
                            `}
                onClick={() =>
                  setUserInfo((prev) => ({
                    ...prev,
                    avatar_color: color,
                  }))
                }
                sx={{
                  backgroundColor: color,
                }}
              ></Box>
            ))}
          </Stack>
          <button onClick={addUser} className={`${styles.button} button`}>
            Let's Chat!
          </button>
        </Stack>
      )}
    </div>
  );
}
