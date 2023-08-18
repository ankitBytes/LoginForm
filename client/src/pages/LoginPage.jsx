import { Box, Grid, Stack, Typography, Button, TextField } from "@mui/material";
import { css } from "@emotion/react";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";

let theme = createTheme();
theme = responsiveFontSizes(theme);

import Background from "../assets/background.jpg";

import { useState } from "react";

const Login = () => {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);


  const styles = {
    mainContainer: css`
      height: 100vh;
      width: 100vw;
      background: url(${Background});
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      display: flex;
      justify-content: center;
    `,
    imageContainer: css`
      border: 2px solid #fafafa;
      background-color: rgb(0, 0, 0);
      padding: 5vh 5vw;
    `,
    signUpBox: css`
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      color: #848383;

      .reset {
        color: blue;
        cursor: pointer;
        margin: 1vh 0vw;
        text-align: end;

        &:hover {
            color: aqua;
            text-decoration: underline;
        }
      }
    `,
    input: css`
      background-color: #fafa;
      margin: 2vh 0;
    `,
  };

  return (
    <Box sx={styles.mainContainer}>
      <ThemeProvider theme={theme}>
        <Grid
          container
          maxWidth={"lg"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          height={{md:"100%", sm: "80%"}}
        >
          <Grid item md={4} sx={styles.imageContainer}>
            <Stack justifyContent={"space-between"} height={{md:"100%", sm: "80%"}} alignItems={"center"}>
              <Typography variant="h4" sx={css`
                padding: 2vh 0;
              `}>Login Form</Typography>
              <TextField
                placeholder="username/email"
                size="small"
                sx={styles.input}
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value)
                }}
              ></TextField>
              <TextField
                placeholder="password"
                size="small"
                sx={styles.input}
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value)
                }}
              />
              <Box sx={css`
                margin: 2vh 0;
              `}>
              <Box sx={styles.signUpBox}>
                <Typography variant="body2">Don't have any account?</Typography>
                <Typography variant="body2" className="reset">Sign Up</Typography>
              </Box>
              <Box sx={styles.signUpBox}>
                <Typography variant="body2">Forgot Password?</Typography>
                <Typography variant="body2" className="reset">Reset Password</Typography>
              </Box>
              </Box>
              <Button sx={css`
                width: 80%;
                background: linear-gradient(90deg, rgba(246,67,157,1) 13%, rgba(18,2,140,1) 100%);
                color: white;
                font-weight: 800;
                transition: all 0.5s;

                &:hover {
                    scale: 1.1;
                }
              `}
                onClick={() => {
                    console.log(email + " and " + password);
                }}
              >Login</Button>
            </Stack>
          </Grid>
        </Grid>
      </ThemeProvider>
    </Box>
  );
};

export default Login;
