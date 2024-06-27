import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Stack from "@mui/material/Stack";

import FullPageLoading from "@/app/components/FullPageLoading";
import ProfileEdit from "../src/app/components/Profile/ProfileEdit";
import { socket } from "@/app/socket";
import { useUser } from "@/app/contexts/UserContext";
import "@/app/styles/profile.sass";

export default function EditProfile() {
  const { userData, isFetched } = useUser();
  const { data: session } = useSession();
  const { push } = useRouter();

  useEffect(() => {
    if (!userData.id) push("/");
  }, [userData.id, isFetched]);

  const updateUser = (data) => {
    const { user } = session || {};

    if (user) {
      socket.emit("updateUser", {
        id: user.id,
        ...data,
      });
    }
    push("/room/init");
  };

  return (
    <div>
      {!isFetched ? (
        <FullPageLoading />
      ) : (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          className="profile"
        >
          <Stack direction="row" alignItems="center">
            <p>Update Profile</p>
          </Stack>
          <ProfileEdit
            onSubmit={updateUser}
            originalImgId={userData.img_id || ""}
            originalData={{
              name: userData.name,
              avatar_color: userData.avatar_color,
              description: userData.description,
            }}
          />
        </Stack>
      )}
    </div>
  );
}
