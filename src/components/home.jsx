import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../config";
import { callMsGraph } from "../graph";
import TableWithSearch from "./table";

export default function Home() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  function RequestProfileData() {
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken).then((response) => {
          setData(Object.entries(response).map(_ => ({ key: _[0], value: _[1] && _[1].length ? _[1] : "null" })))
        });
      });
  }

  useEffect(() => {
    if (accounts[0]) {
      setLoading(true);
      RequestProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts[0]])

  const login = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.log(e);
    });
  }

  const logout = () => {
    const logoutRequest = {
      mainWindowRedirectUri: "http://localhost:3000",
      postLogoutRedirectUri: "http://localhost:3000",
    };
    instance.logoutPopup(logoutRequest);
  }

  return (
    <Box>
      <Box p={2} bgcolor="green">
        <Stack direction={"row"} justifyContent="end" spacing={1}>
          <Button disabled={isAuthenticated} variant="contained" onClick={login}>Sign In</Button>
          <Button disabled={!isAuthenticated} variant="contained" onClick={logout}>Sign Out</Button>
        </Stack>
      </Box>
      {isAuthenticated ?
        loading ? <TableWithSearch data={data} /> : <Typography fontSize={30} fontWeight={700}>Loading...</Typography>
        : <Typography fontSize={30} fontWeight={700}>Please login to see the user data.</Typography>}
    </Box>
  );
}