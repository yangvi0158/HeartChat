import { createTheme } from "@mui/material/styles";
import "./variables.sass";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0797FF",
    },
    secondary: {
      main: "#B1C9DD",
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        root: {
          "& .MuiPaper-root": {
            width: "400px",
            borderRadius: "10px",
            padding: "15px",
          },
          "& .MuiButton-root": {
            textTransform: "none",
          },
          "& .MuiDialogTitle-root": {
            fontWeight: "700",
            fontSize: "16px",
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#272C56",
          color: "#DCDEED",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: "#272C56",
          color: "#DCDEED",
        },
      },
    },
  },
});

export default theme;
