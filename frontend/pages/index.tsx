import Image from 'next/image';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { motion, Variants } from "framer-motion";
import { signIn } from 'next-auth/react'; 
import { useSession } from 'next-auth/react';

import { transition } from '@/app/animations/config';
import '@/app/styles/index.sass';
import styles from '@/app/styles/index.module.sass';
import window1 from '../public/home-window1.svg';
import window2 from '../public/home-window2.svg';
import window3 from '../public/home-window3.svg';

const MotionImage = motion(Image);
const MotionStack = motion(Stack);

const imageContainer: Variants = {
    initial: {
        transition: {
            staggerChildren: 0.2,
            staggerDirection: -1,
        }
    },
    animate: {
        transition: {
            delay: .3,
            staggerChildren: .3,
            staggerDirection: 1,
        },
    },
}

const image: Variants = {
    initial: {
        y: 50,
        opacity: 0,
        transition: transition
    },
    animate: {
        y: 0,
        opacity: [0,80,100],
        transition: transition
    },
}


export default function HomePage() {
    const { data: session, status } = useSession();
    let buttonContent;
    if (status === 'loading') {
        buttonContent = (
            <CircularProgress color="secondary" size="20px"/>
        );
    } else if (status === 'authenticated') {
        buttonContent = (
            <Link href="/room/1">Start HeartChat!</Link>
        )
    } else {
        buttonContent = (
            <span>Sign In</span>
        )
    }


    return (
        <Stack direction="row" justifyContent="center" alignItems='center' className="container">
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
                    HeartChat makes it easy and fun to quickly chat with people all around the globe.
                </p>
                <div>
                    <button className={`${styles.button} button__signup`} onClick={() => {
                        if (status === 'unauthenticated') signIn(undefined, { callbackUrl: '/room/1' });
                    }}>
                        {buttonContent}
                    </button>
                </div>
            </Stack>
            <MotionStack
                className="block block__images"
                alignItems='center'
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
                        width: '100%',
                        maxWidth: '400px',
                        minWidth: '200px',
                        height: 'auto',
                        position: 'relative',
                        top: '20px',
                        left: '-20px'
                    }}
                ></MotionImage>
                <MotionImage 
                    variants={image}
                    alt="window-2"
                    src={window2}
                    style={{
                        width: '100%',
                        maxWidth: '380px',
                        height: 'auto',
                        position: 'relative',
                        right: '-70px'
                    }}
                ></MotionImage>
                <MotionImage 
                    variants={image}
                    alt="window-3"
                    src={window3}
                    style={{
                        width: '100%',
                        maxWidth: '328px',
                        height: 'auto',
                        position: 'relative',
                        top: '-15px'
                    }}
                ></MotionImage>
            </MotionStack>
        </Stack>
    )
}

