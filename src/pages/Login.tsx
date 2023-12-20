import React from "react";
import { LockOutlined } from "@mui/icons-material";
import {
    Container,
    CssBaseline,
    Box,
    Avatar,
    Typography,
    TextField,
    Button,
    Grid,
    Snackbar,
    Alert,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux-hooks";
import { login } from "../slices/authSlice";
import {
    showNotification,
    NotificationType,
  } from "../slices/notificationSlice";
  import { useAppSelector } from "../hooks/redux-hooks";


const Login = () => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [error_message, setErrorMessage] = useState("");
    const isLoading = useAppSelector((state) => state.auth.status === "loading");

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const handleLogin = async () => {
        // This is only a basic validation of inputs. Improve this as needed.
        if (email && password) {
            try {
                await dispatch(
                    login({
                        email,
                        password,
                    })
                ).unwrap();
            } catch (e) {
                console.error(e);
                setErrorMessage((e as Error).message);
                setOpen(true);
            }
        } else {
            dispatch(
                showNotification({
                  message: "Please provide email and password",
                  type: NotificationType.Error,
                })
              );
        }
    };

    return (
        <>
        <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                 open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Container maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        mt: 20,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
                        <LockOutlined />
                    </Avatar>
                    <Typography variant="h5">Login</Typography>
                    <Box sx={{ mt: 1 }}>
                        <Snackbar
                            open={open}
                            autoHideDuration={1000}
                            onClose={handleClose}
                        // action={action}
                        >
                            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>{error_message}</Alert>
                        </Snackbar>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                        <Grid container justifyContent={"flex-end"}>
                            <Grid item>
                                <Link to="/register">Don't have an account? Register</Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Login;