import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Image from "next/image";
import Logo from "../public/heartChat-logo.svg";
import "@/app/styles/deletionInstruction.sass";

export default function DeletionInstruction() {
  return (
    <Stack
      sx={{
        color: "white",
        width: "100%",
        height: "100vh",
        fontSize: "18px",
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Image src={Logo} alt="logo"></Image>
      <Box>
        <p>
          HeartChat app uses the Facebook login and we do not save your personal
          data in our server.
          <br></br>
          As per Facebook policy, we have to provide User Data Deletion Callback
          URL or Data Deletion Instructions URL.
        </p>
        <br></br>
        <p>
          If you want to delete your activities for HeartChat app, you can
          remove your information by following these steps:
        </p>
        <ol>
          <li>
            Go to your Facebook Account's Setting & Privacy. Click Settings.
          </li>
          <li>
            Look for Apps and Websites and you will see all of the apps and
            websites you linked with your Facebook.
          </li>
          <li>Search and click HeartChat in the search bar.</li>
          <li>Scroll and click Remove.</li>
          <li>
            Congratulations, you have successfully removed your app activities.
          </li>
        </ol>
      </Box>
    </Stack>
  );
}
