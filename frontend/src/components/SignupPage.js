import React, { useContext, useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  IconButton,
  Popover,
  InputAdornment,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "./AuthContext";

export const SignupPage = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(7, "Password must be at least 7 characters long")
      .max(30, "Password must be at most 30 characters long")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match")
      .required("Confirm Password is required"),
  });

  const handleSignup = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch("http://localhost:9000/api/blog/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      if (response.ok) {
        alert("Signed Up Successfully");
        navigate("/v1/login");
      } else {
        const errorData = await response.json();
        setErrors({ form: errorData.message || "Signup failed" });
      }
    } catch (error) {
      setErrors({ form: "Signup failed. Please try again later." });
    }
    setSubmitting(false);
  };

  const handleGoogleSuccess = async (res) => {
    const tokenId = res.credential;
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + tokenId
    );
    const googleUser = await response.json();
    console.log(googleUser);

    if (googleUser) {
      const { email, name } = googleUser;
      try {
        const res = await fetch("http://localhost:9000/api/blog/google-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name }),
        });

        if (res.ok) {
          const result = await res.json();
          const token = result.token;
          localStorage.setItem("token", token);
          localStorage.setItem("isLoggedIn", true);
          setIsLoggedIn(true);
          navigate("/");
        } else {
          alert("Google Login failed");
        }
      } catch (error) {
        console.error("Google Login Error:", error);
      }
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Sign-In Error:", error);
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box>
        <Box style={{ border: "1px solid #ccc", padding: "20px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Signup
          </Typography>
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSignup}
          >
            {({ isSubmitting, isValid, errors, touched }) => (
              <Form noValidate>
                {errors.form && (
                  <Typography
                    variant="body1"
                    align="center"
                    gutterBottom
                    sx={{ color: "red" }}
                  >
                    {errors.form}
                  </Typography>
                )}
                <Field
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoFocus
                  helperText={
                    touched.username && errors.username ? (
                      <ErrorMessage name="username" />
                    ) : null
                  }
                  error={touched.username && !!errors.username}
                />
                <Field
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  helperText={
                    touched.email && errors.email ? (
                      <ErrorMessage name="email" />
                    ) : null
                  }
                  error={touched.email && !!errors.email}
                />
                <Field
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  helperText={
                    <>
                      {touched.password && errors.password ? (
                        <ErrorMessage name="password" />
                      ) : null}
                    </>
                  }
                  error={touched.password && !!errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClick} aria-describedby={id}>
                          <Info />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <ul>
                      <li>At least one capital letter</li>
                      <li>Between 7 and 30 characters long</li>
                      <li>At least one special character</li>
                    </ul>
                  </Box>
                </Popover>
                <Field
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  helperText={
                    touched.confirmPassword && errors.confirmPassword ? (
                      <ErrorMessage name="confirmPassword" />
                    ) : null
                  }
                  error={touched.confirmPassword && !!errors.confirmPassword}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting || !isValid}
                >
                  Sign Up
                </Button>
                <center>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onFailure={handleGoogleFailure}
                    useOneTap
                  />
                </center>
                <Typography align="center" sx={{ mt: 2 }}>
                  Already have an account? <Link to="/v1/login">Login</Link>
                </Typography>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Container>
  );
};
