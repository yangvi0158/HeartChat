"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { socket } from "../socket";
import IUser from "../interfaces/IUser";

const initialData = {
  isFetched: false,
  userData: {
    name: "",
    id: "",
    description: "",
    has_img: false,
    img_id: "",
    avatar_color: "#1c203f",
    room_list: [] as string[],
    created_at: "",
  },
  setUserData: (data: IUser) => {},
};

const UserContext = createContext(initialData);

function useUser() {
  return useContext(UserContext);
}

function UserProvider({ children }: { children: ReactNode }) {
  const { pathname, push } = useRouter();
  const { data: session, status } = useSession();
  const [isFetched, setIsFetched] = useState(false);
  const [userData, setUserData] = useState<IUser>(initialData.userData);
  console.log("userData", userData);

  useEffect(() => {
    if (socket && !userData.name && session) {
      const {
        user: { id },
      } = session;
      socket.emit("getUser", id);
    }
  }, [socket, userData, session, pathname]);

  useEffect(() => {
    if (pathname === "/" || status === "unauthenticated") return;

    function onGetCurrentUser(data: IUser[]) {
      setIsFetched(true);
      if (!data.length) {
        push("/signup");
        return;
      }

      setUserData(data[0]);
    }

    socket.on("getCurrentUser", onGetCurrentUser);

    return () => {
      socket.off("getCurrentUser", onGetCurrentUser);
    };
  }, [pathname, status]);

  return (
    <UserContext.Provider
      value={{
        isFetched,
        userData,
        setUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { useUser, UserProvider };
