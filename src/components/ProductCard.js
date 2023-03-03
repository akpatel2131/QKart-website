import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import React, { useEffect, useState } from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart, items}) => {

const cartQuantity=(items, product)=>{
  let quantity= 1;
  items.forEach((element)=>{
    if(product._id === element.productId){
      console.log(element.qty)
      quantity = quantity + 1;
    }
  })
  console.log(quantity);
  return quantity;
}


  let token = localStorage.getItem("token")
  // const data = 
  // {
  // "name":"Tan Leatherette Weekender Duffle",
  // "category":"Fashion",
  // "cost":150,
  // "rating":4,
  // "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  // "_id":"PmInA797xJhMIPti"
  // }

  // console.log(product)
  return (
    <Card className="card">
      <CardMedia
        component="img"
        alt="green iguana"
        height="250"
        image={product.image}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{margin:0.5}} style={{color:'black'}}>
          ${product.cost}
        </Typography>
        <Rating name="half-rating-read" defaultValue={product.rating} precision={0.5} readOnly />
      </CardContent>
      {/* <div class="card-button">
        <Button variant="contained" color="success" size="large">
          add to cart
        </Button>
      </div> */}
      <CardActions >
        <Button variant="contained" color="success" size="small" fullWidth 
        onClick={(e)=>{
        let qty= cartQuantity(items,product);
        handleAddToCart(token, items, product, product._id, qty,  Option = {preventDuplicate: true})}}>
        <IconButton style={{color:"white"}} aria-label="add to shopping cart">
          <AddShoppingCartIcon />
        </IconButton> <span>add to cart</span>
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
