import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
// import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState, useEffect } from "react";
import { unstable_renderSubtreeIntoContainer } from "react-dom";
import { useHistory,Route, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [ConformPassword , setConformPassword] = useState('');
  const [valid , setValid] = useState();
  const [success , setSuccess] = useState(false);
  const [button , setButton] = useState(true)

const userNameFunc = (event)=>{
    setUsername(event.target.value)
}
const passwordFunc = (event)=>{
    setPassword(event.target.value)
}
const conformPasswordFunc = (event)=>{
  setConformPassword(event.target.value)
}

// let button;
// if (buttonDisplay){
//   let button = <Button className="button" variant="contained" onClick={register}>
//   Register Now
//  </Button>
// } else {
//   let button = <CircularProgress />
// }

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
// import { useHistory, Link } from "react-router-dom";

// const Register = () => {
//   const { enqueueSnackbar } = useSnackbar();


  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  // let formData = {
  //   username : Username,
  //   password: Password,
  // }

   
  // console.log(formData);
  const register = async (formData) => {
    setButton(false)
    let validItem = validateInput()
     if (validItem === true){     
      formData = {
        username : Username,
        password: Password,
      }

        await axios.post(`${config.endpoint}/auth/register`, formData).then ((res) => {
            enqueueSnackbar("Registered Successfully", {variant: "success" , autoHideDuration : 5000});
            history.push("/login")
            setButton(true)
      }).catch((error)=>{
          if(error.response && (error.response.status === 400)){
              setButton(true)
              return enqueueSnackbar(error.response.data.message, {variant: "Error", autoHideDuration : 5000})
          }else {
              setButton(true)
              return enqueueSnackbar("Username is already taken", {variant: "Error", autoHideDuration : 5000})
          }
        })
     } else {
      setButton(true)
      return validItem;
     }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    data = {
      username : Username,
      password: Password,
      confirmPassword : ConformPassword
    }
    
    if(data.username === ""){
       return enqueueSnackbar("Username is a required field",{variant: "warning", autoHideDuration : 5000})
      // console.log(valid)
      // return false;
    }else if(data.username.length < 6){
      return enqueueSnackbar("Username must be at least 6 characters",{variant: "warning", autoHideDuration : 5000})
      // console.log(valid)
      // return false;
    }

    if(data.password === ""){
      return enqueueSnackbar("Password is a required field",{variant: "warning", autoHideDuration : 5000})
      // console.log(valid)
      // return false;
    }else if(data.password.length < 6){
      return enqueueSnackbar("Password must be at least 6 characters",{variant: "warning", autoHideDuration : 5000})
      // console.log(valid)
      // return false;
    }

    if(data.password !== data.confirmPassword){
      return enqueueSnackbar("Passwords do not match",{variant: "warning", autoHideDuration : 5000})
      // return false;
      
    }

   return true;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={1} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value = {Username}
            onChange={userNameFunc}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value = {Password}
            onChange={passwordFunc}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value = {ConformPassword}
            onChange={conformPasswordFunc}
          />
           {button?  <Button className="button" variant="contained" onClick={register}>
            Register Now
           </Button> : <CircularProgress className="loading"/> }
          <p className="secondary-action">
            Already have an account?{" "}
             <Link className="link" to="/login">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
