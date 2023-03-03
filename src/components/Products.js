import { Search, SentimentDissatisfied} from "@mui/icons-material";
import {
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, Typography} from "@mui/material";
// import Box from "@mui/material/Box";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory} from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart , { generateCartItemsFrom } from "./Cart";
import "./Products.css";



const Products = () => {

 const {enqueueSnackbar} = useSnackbar();
 const [productData , setProductData] = useState([])
 const [cartData, setCartData] = useState([])
 const [postcartData, setPostCartData] = useState([])
 const [loading , setLoading] = useState(true)
 const [searchText , setSearchText] = useState("");
 const [cartItem , setCartItem] = useState([]);
 const [ debounceTime , setDebounceTime] = useState(0);
 const [ status, setStatus] = useState(0);


//  const history = useHistory();
//  const Checkout =()=>{
//   history.push("/checkout")
// }

 const handleInput = (event)=>{
  setSearchText(event.target.value)
  debounceSearch(event , 500)
}


useEffect(()=>{
  performAPICall();
  //setProductData
},[])


useEffect(()=>{
  if(localStorage.getItem("token")){
  let userToken = localStorage.getItem("token")
    fetchCart(userToken).then((carts)=>{
      return generateCartItemsFrom(carts ,productData)
    }).then((res)=>{
      // console.log(res);
      setCartItem(res)
    })
  }

},[productData])


// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


//  const Products = () => {}

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const performAPICall = async () => {
    try{
      let fetchData = await axios.get(`${config.endpoint}/products`) // try to get data from  /product enpodint.
      setProductData(fetchData.data) // send the fetch Data to productData  state variable
      setLoading(false) // set the load varible false so, the loading icon on screen stops and shows the item cards.
      // console.log(fetchData.data)
      // return fetchData.data

    } catch(error){
        if(error.response){
          return enqueueSnackbar(error.response.data.message , {variant:"error"} )
          
        }else{
          return enqueueSnackbar(error.message , {variant:"error"} )
        
        }
    }
  };


  // console.log(productData)

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    console.log(text);
    let url = `${config.endpoint}/products`
    if(text !== ""){
       url = `${url}/search?value=${text}`
    }
    console.log(url)
    try{
      let fetchProduct = await axios.get(url)
      setProductData(fetchProduct.data);
      setLoading(false);
      setStatus(0);
    }catch(error){
      if(error.response){
        setStatus(400)
        setProductData([]);
        setLoading(false)
        return enqueueSnackbar("No Product Found" , {variant:"error"} )
        // return []
      }else{
        setProductData([]);
        setLoading(false)
        return enqueueSnackbar("Server Problem Occured", {variant:"error"} )
        // return []
      }
    }
  };

 

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    setLoading(true)
    // console.log("Debounce running")
    if(debounceTime !== 0){
      clearTimeout(debounceTime)
    }

    let newTimer = setTimeout(()=>{
      performSearch(event.target.value);
      console.log("Debouncing Done")
    },debounceTimeout)
    
    setDebounceTime(newTimer)
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
//-------------------------------- fetch cart data -----------------------------------
   const fetchCart = async (token) => {
    if (!token) {
      return null;
    }

    try {
      let fetchCartData = await axios.get(`${config.endpoint}/cart` , {
        headers:{
          'Authorization': `Bearer ${token}`
        }
      })
      // console.log(fetchCartData)
      // let cartItemsData= generateCartItemsFrom(fetchCartData.data ,productData)
      // setCartItem(cartItemsData)
      setCartData(fetchCartData.data)
      return fetchCartData.data;
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    // console.log("isItemInCart function is running")
    let result = 0;
    items.forEach((element)=>{
      if(element.productId === productId){
        result = 1;
      }
    })
    console.log(result)
    if(result){
      // console.log("true")
      return true
    }else{
      return false
    }
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  // const addToCart = async (
  //   token,
  //   items,
  //   products,
  //   productId,
  //   qty,
  //   
  // ) => {
  //   if(locatStorage.getItem("username")){
  //     items = {

  //     }
  //     try{

  //       await axios.post(`${config.endpoint}/cart` , items)

  //     }cathc(error){

  //     }
  //   }

  // };

  const addToCart = async (
    token,
    items,
    product,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if(localStorage.getItem("username")){
      let itemValid = isItemInCart(cartData,productId)
      // console.log(options.preventDuplicate)
      if(itemValid && options.preventDuplicate){
        enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantiity or remove item", { variant: "warning" });
        // console.log("item already in cart")
        return;
      }
        try{
          // console.log("in to try statment of add to cart function")
          const response = await axios.post(`${config.endpoint}/cart` , {productId, qty}, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          })

        console.log(response.data)
        console.log(productData)
        setCartItem(generateCartItemsFrom(response.data ,productData))
        console.log("my item")
        // setPostCartData(items)
        }catch(e){
          if (e.response && e.response.status === 400) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
          } else {
          // console.log("Display error in server")
            enqueueSnackbar(
              "Could not post product. Check the backend is running, reachable and returns valid JSON.",
              {
                variant: "error",
              }
            );
          }
        }
    }
  };

   // if(debounceTime !== 0){
        //   clearTimeout(debounceTime)
        // }
    
        // let newTimer = setTimeout(async()=>{
        //   try{
        //     // console.log("in to try statment of add to cart function")
        //     await axios.post(`${config.endpoint}/cart` , {productId, qty}, {
        //       headers: {
        //         'Authorization': `Bearer ${token}`
        //       },
        //     })
    
        //   setPostCartData(items)
        //   }catch(e){
        //     if (e.response && e.response.status === 400) {
        //       enqueueSnackbar(e.response.data.message, { variant: "error" });
        //     } else {
        //     // console.log("Display error in server")
        //       enqueueSnackbar(
        //         "Could not fetch product. Check the backend is running, reachable and returns valid JSON.",
        //         {
        //           variant: "error",
        //         }
        //       );
        //     }
        //   }
        // },1000)
        // setDebounceTime(newTimer)

  // addToCart( token, qtyData, productIdData, options)

  return (
    <Box>
      <Header handleInput={handleInput} searchText={searchText}/>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        
      {/* </Header> */}
      <Stack direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        >
  
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        sx={{margin: 1}}
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
      />
      </Stack>
      
      {/* Search view for mobiles */}
       {localStorage.username ? <Grid container>
          <Grid xs={12} md={9}>
            <Grid item className="product-grid">
              <Box className="hero">
                 <p className="hero-heading">
                    India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                    to your door step
                  </p>
              </Box>
            </Grid>
       
           {loading?<Box 
              sx={{ display:"flex", 
              justifyContent:"center",
              alignItems:"center",
              flexDirection:"column"
              }}
           >
            <CircularProgress className="loading"/> 
            <p>Loading Products...</p>
           </Box>: status === 400 ? <Box 
           sx={{ display:"flex", 
           justifyContent:"center",
           alignItems:"center",
           flexDirection:"column"
           }}
        >
         <SentimentDissatisfied /> 
         <p>No products found</p>
        </Box> : <Grid className="grid-container" container spacing={1} sx={{m:1}}>
                    {
                      productData.map((element) => {
                       return(
                         <Grid item xs={12} md={6} lg={3} key={element._id} >
                           <ProductCard 
                           product={element} 
                           handleAddToCart={addToCart} 
                           items={cartData}
                            />
                          </Grid>
                        )
                      })
                    }
                  </Grid>        
           }

           </Grid> 
            <Grid xs={12} md={3} sx={{bgcolor:"#E9F5E1"}} >
              <Cart 
              products={productData} 
              items={cartItem} 
              handleQuantity={addToCart}
              />
            </Grid>
        </Grid>    :    <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                 <p className="hero-heading">
                    India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                    to your door step
                  </p>
              </Box>
            </Grid>
       
           {loading?<Box 
              sx={{ display:"flex", 
              justifyContent:"center",
              alignItems:"center",
              flexDirection:"column"
              }}
           >
            <CircularProgress className="loading"/> 
            <p>Loading Products...</p>
           </Box>: status === 400 ? <Box 
           sx={{ display:"flex", 
           justifyContent:"center",
           alignItems:"center",
           flexDirection:"column"
           }}
        >
         <SentimentDissatisfied /> 
         <p>No products found</p>
        </Box> : <Grid className="grid-container" container spacing={1} sx={{m:1}}>
                    {
                      productData.map((element) => {
                       return(
                         <Grid item xs={12} md={6} lg={3} key={element._id}>
                           <ProductCard 
                           product={element} 
                           handleAddToCart={addToCart} 
                           items={cartData}/>
                          </Grid>
                        )
                      })
                    }
                  </Grid>        
           }
        </Grid> }   
      <Footer />
    </Box>
  )

}

export default Products;
