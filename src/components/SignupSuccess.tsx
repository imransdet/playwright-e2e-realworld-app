import React from "react";
import { styled } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import { Container, CssBaseline, Box, Typography, Button, Card, CardContent } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const PREFIX = "SignupSuccess";

const classes = {
  paper: `${PREFIX}-paper`,
  icon: `${PREFIX}-icon`,
  signInButton: `${PREFIX}-signInButton`,
};

const StyledContainer = styled(Container)(() => ({
  [`& .${classes.paper}`]: {
    marginTop: 8 * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  [`& .${classes.icon}`]: {
    fontSize: 80,
    marginBottom: 2 * 8,
  },

  [`& .${classes.signInButton}`]: {
    margin: "24px 0 16px",
  },
}));

const SignupSuccess: React.FC = () => {
  const history = useHistory();

  const handleGoToSignIn = () => {
    history.push("/signin");
  };

  return (
    <StyledContainer maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper} data-test="signup-success">
        <CheckCircleOutlineIcon className={classes.icon} sx={{ color: "success.main" }} data-test="signup-success-icon" />
        <Typography component="h1" variant="h5" data-test="signup-success-title">
          Sign Up Successful!
        </Typography>
        <Box sx={{ mt: 2, width: "100%" }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body1" color="text.secondary" align="center" data-test="signup-success-message">
                Your account has been created successfully. You can now sign in with your credentials.
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.signInButton}
          data-test="signup-success-signin-button"
          onClick={handleGoToSignIn}
        >
          Go to Sign In
        </Button>
      </div>
    </StyledContainer>
  );
};

export default SignupSuccess;