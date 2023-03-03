import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack ,InputAdornment,TextField } from "@mui/material";
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import Box from "@mui/material/Box";
import { useHistory, Link } from "react-router-dom";

import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons, handleInput , searchText }) => {
    const history = useHistory();

    const goToProductPage = ()=>{
      return history.push({
      pathname: "/",
      state: "LoggedOut"
    })};
    const LoginPage = ()=>{
      return history.push("/login")
    }
    const RegisterPage = ()=>{
      return history.push("/register")
    }

    const LogOutPage = ()=>{
      localStorage.clear();
      console.log(localStorage.getItem("localData"));
      return history.push({
        pathname:"/",
      })
    }


    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {hasHiddenAuthButtons? "" : <TextField
            className="search-desktop"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            value={searchText}
            onChange={handleInput}
          /> }
        
        {hasHiddenAuthButtons? <Button
      className="explore-button"
      startIcon={<ArrowBackIcon />}
      variant="text"
      onClick={goToProductPage}
    >
      Back to explore
    </Button> : localStorage.getItem("username") ? <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      spacing={2}
      > 
      <Button variant="text" spacing={2} >  
        <Avatar src="../../public/avatar.png" alt={localStorage.getItem("username")} className="Avatar"/>{localStorage.getItem("username")} 
      </Button>
      <Button variant="contained" color="success" name="logout" onClick={LogOutPage}>
          Logout
      </Button>
    </Stack> :  <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      spacing={2}
    >
      <Button variant="text" onClick={LoginPage} >  
        Login
      </Button>
      <Button variant="contained" color="success" onClick={RegisterPage}>
        Register
      </Button>
    </Stack>}
  </Box>
    );
};

export default Header;
