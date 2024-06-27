import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

const FullPageLoading = () => (
  <Stack justifyContent="center" alignItems="center" sx={{ height: "100vh" }}>
    <CircularProgress color="secondary" size="40px" />
  </Stack>
);

export default FullPageLoading;
