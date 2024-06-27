import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Stack from "@mui/material/Stack";

import FullPageLoading from "@/app/components/FullPageLoading";
import ProfileEdit from "../src/app/components/Profile/ProfileEdit";
import { socket } from "@/app/socket";
import { useUser } from "@/app/contexts/UserContext";
import "@/app/styles/signup.sass";

export default function Signup() {
  const { userData, isFetched } = useUser();
  const { data: session } = useSession();
  const { push } = useRouter();

  useEffect(() => {
    if (isFetched && userData.id) push("/room/init");
  }, [userData.id, isFetched]);

  const addUser = (data) => {
    const { user } = session || {};

    if (user) {
      socket.emit("addUser", {
        id: user.id,
        ...data,
      });
    }
    push("/room/init");
  };

  return (
    <div>
      {!isFetched || userData.id ? (
        <FullPageLoading />
      ) : (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          className="signup"
        >
          <Stack direction="row" alignItems="center">
            <p>Create Profile</p>
          </Stack>
          <ProfileEdit onSubmit={addUser} />
        </Stack>
      )}
    </div>
  );
}
