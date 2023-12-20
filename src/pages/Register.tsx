import React from "react";

import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    TextField,
    Select,
    InputLabel,
    MenuItem,
    Typography,
    Snackbar,
    Alert,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import {
    showNotification,
    NotificationType,
  } from "../slices/notificationSlice";
import { LockOutlined } from "@mui/icons-material";
import { SelectChangeEvent } from '@mui/material/Select';
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux-hooks";
import { register } from "../slices/authSlice";
import { useAppSelector } from "../hooks/redux-hooks";


const Register = () => {
    const dispatch = useAppDispatch();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [open, setOpen] = useState(false);
    const [error_message, setErrorMessage] = useState("");
    const isLoading = useAppSelector((state) => state.auth.status === "loading");

    const handleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
    };
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleRegister = async () => {
        // This is only a basic validation of inputs. Improve this as needed.
        if (firstName && lastName && mobileNumber && email && password && role) {
            try {
                await dispatch(
                    register({
                        email,
                        password,
                        firstName,
                        lastName,
                        mobileNumber,
                        role: [role]
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
                  message: "Please fill out all the required fields",
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
                    <Typography variant="h5">Register</Typography>
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Snackbar
                                open={open}
                                autoHideDuration={1000}
                                onClose={handleClose}
                            // action={action}
                            >
                                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>{error_message}</Alert>
                            </Snackbar>
                            <Grid item xs={12}>
                                <TextField
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="lastName"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    autoFocus
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="mobileNumber"
                                    required
                                    fullWidth
                                    id="mobileNumber"
                                    label="Mobile Number"
                                    autoFocus
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel id="role_label">Role</InputLabel>
                                <Select
                                    labelId="role_label"
                                    id="role"
                                    value={role}
                                    label="Role"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"admin"}>admin</MenuItem>
                                    <MenuItem value={"pharmacist"}>pharmacist</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleRegister}
                        >
                            Register
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to="/login">Already have an account? Login</Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Register;