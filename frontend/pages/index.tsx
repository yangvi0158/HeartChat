import Image from "next/image";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { motion, Variants } from "framer-motion";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

import { useUser } from "@/app/contexts/UserContext";
import { transition } from "@/app/animations/config";
import styles from "@/app/styles/index.module.sass";
import window1 from "../public/home-window1.svg";
import window2 from "../public/home-window2.svg";
import window3 from "../public/home-window3.svg";
import "@/app/styles/index.sass";

const MotionImage = motion(Image);
const MotionStack = motion(Stack);

const imageContainer: Variants = {
  initial: {
    transition: {
      staggerChildren: 0.2,
      staggerDirection: -1,
    },
  },
  animate: {
    transition: {
      delay: 0.3,
      staggerChildren: 0.3,
      staggerDirection: 1,
    },
  },
};

const image: Variants = {
  initial: {
    y: 50,
    opacity: 0,
    transition: transition,
  },
  animate: {
    y: 0,
    opacity: [0, 80, 100],
    transition: transition,
  },
};

export default function HomePage() {
  const { status } = useSession();
  const { userData } = useUser();
  // console.log("session", session, "useData", userData);

  let buttonContent;
  if (status === "loading") {
    buttonContent = <CircularProgress color="secondary" size="20px" />;
  } else if (status === "authenticated") {
    if (userData.id.length) {
      buttonContent = <Link href="/room/init">Start HeartChat!</Link>;
    } else {
      buttonContent = <Link href="/signup">Sign up</Link>;
    }
  } else {
    buttonContent = <span>Sign In</span>;
  }

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      className="container"
    >
      <Stack className="block">
        <div className="header__title">
          <h1>
            <span className="title--pink">Heart</span>
            <span className="title--blue">Chat</span>
            <br></br>
            anytime,
            <br></br>
            anywhere
          </h1>
        </div>
        <p className="header__desc">
          HeartChat is an online free chat rooms. Here you can meet new friends
          from all over the world.
        </p>
        <div>
          <button
            className={`${styles.button} button__signup`}
            onClick={() => {
              if (status === "unauthenticated")
                signIn(undefined, { callbackUrl: "/room/init" });
            }}
          >
            {buttonContent}
          </button>
        </div>
      </Stack>
      <MotionStack
        className="block block__images"
        alignItems="center"
        initial="initial"
        animate="animate"
        exit="initial"
        variants={imageContainer}
      >
        <MotionImage
          variants={image}
          priority
          alt="window-1"
          src={window1}
          style={{
            width: "100%",
            maxWidth: "400px",
            minWidth: "200px",
            height: "auto",
            position: "relative",
            top: "20px",
            left: "-20px",
          }}
        ></MotionImage>
        <MotionImage
          variants={image}
          alt="window-2"
          src={window2}
          style={{
            width: "100%",
            maxWidth: "380px",
            height: "auto",
            position: "relative",
            right: "-70px",
          }}
        ></MotionImage>
        <MotionImage
          variants={image}
          alt="window-3"
          src={window3}
          style={{
            width: "100%",
            maxWidth: "328px",
            height: "auto",
            position: "relative",
            top: "-15px",
          }}
        ></MotionImage>
      </MotionStack>
      <Box className="footer">
        <p>
          © 2023&nbsp;
          <a href="https://github.com/viboloveyou12/HeartChat" target="_blank">
            HeartChat
          </a>
          &nbsp;💙 Made by&nbsp;
          <a
            href="https://github.com/viboloveyou12"
            target="_blank"
            style={{
              color: "#ff759e",
            }}
          >
            Vivian Yang
          </a>
          .
        </p>
      </Box>
    </Stack>
  );
}
