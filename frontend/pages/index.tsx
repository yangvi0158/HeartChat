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
import topImg from "../public/home-window1.svg";
import middleImg from "../public/home-window2.svg";
import bottomImg from "../public/home-window3.svg";
import styles from "@/app/styles/index.module.sass";
import "@/app/styles/index.sass";
import { CSSProperties } from "react";

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

const imagesStyleMap: { [key: string]: CSSProperties } = {
  top: {
    width: "100%",
    maxWidth: "400px",
    minWidth: "200px",
    height: "auto",
    position: "relative",
    top: "20px",
    left: "-20px",
  },
  middle: {
    width: "100%",
    maxWidth: "380px",
    height: "auto",
    position: "relative",
    right: "-70px",
  },
  bottom: {
    width: "100%",
    maxWidth: "328px",
    height: "auto",
    position: "relative",
    top: "-15px",
  },
};

const MotionImage = motion(Image);
const MotionStack = motion(Stack);

const HeaderTitle = () => (
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
);

const HeaderDescription = () => (
  <p className="header__desc">
    HeartChat is an online free chat rooms. Here you can meet new friends from
    all over the world.
  </p>
);

const Footer = () => (
  <Box className="footer">
    <p>
      © 2023&nbsp;
      <a
        rel="noopener noreferrer"
        href="https://github.com/viboloveyou12/HeartChat"
        target="_blank"
      >
        HeartChat
      </a>
      &nbsp;💙 Made by&nbsp;
      <a
        rel="noopener noreferrer"
        href="https://github.com/viboloveyou12"
        target="_blank"
        className="text-hightlight"
      >
        Vivian Yang
      </a>
      .
    </p>
  </Box>
);

const SignInButton = ({ status, userData }) => {
  let buttonContent;
  switch (status) {
    case "loading":
      buttonContent = <CircularProgress color="secondary" size="20px" />;
      break;
    case "authenticated":
      buttonContent = userData.id.length ? (
        <Link href="/room/init">Start HeartChat!</Link>
      ) : (
        <Link href="/signup">Sign up</Link>
      );
      break;
    default:
      buttonContent = <span>Sign In</span>;
  }

  return (
    <button
      className={`${styles.button} button__signup`}
      onClick={() => {
        if (status === "unauthenticated")
          signIn(undefined, { callbackUrl: "/room/init" });
      }}
    >
      {buttonContent}
    </button>
  );
};

const AnimateImages = () => {
  return (
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
        alt="top-img"
        src={topImg}
        style={imagesStyleMap.top}
      ></MotionImage>
      <MotionImage
        variants={image}
        alt="middle-img"
        src={middleImg}
        style={imagesStyleMap.middle}
      ></MotionImage>
      <MotionImage
        variants={image}
        alt="bottom-img"
        src={bottomImg}
        style={imagesStyleMap.bottom}
      ></MotionImage>
    </MotionStack>
  );
};

export default function HomePage() {
  const { status } = useSession();
  const { userData } = useUser();
  // console.log("session", session, "useData", userData);

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      className="container"
    >
      <Stack className="block">
        <HeaderTitle />
        <HeaderDescription />
        <SignInButton status={status} userData={userData} />
      </Stack>
      <AnimateImages />
      <Footer />
    </Stack>
  );
}
