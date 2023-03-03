import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, {useState} from "react";
import { useHistory,Route, Link } from "react-router-dom";
import "./Cart.css";

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

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  // console.log(cartData)
  // console.log(productsData)
  let array=[]
  // let productDataM = [...productData]
  cartData.forEach((cartElement) => {
    let [object] = productsData.filter((productElement)=>{
      return cartElement.productId === productElement._id
    })
    console.log(object);
    const resObject ={
      ...object,
      ...cartElement
    }

    array.push(resObject)
  })
  console.log(array)
  return array
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  // console.log(items);
  // console.log(products);

  let totalValue =0;
  for(let i=0; i<items.length; i++){
        totalValue = totalValue + (items[i].cost*items[i].qty)
      }
  return totalValue;
};


/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * 
 */
 const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly,
  // generateCartItems
}) => {
  return(
  <>
    {isReadOnly? 
      <Stack direction="row" alignItems="center">
        <Box padding="0.5rem" data-testid="item-qty">
          Qty: {value}
        </Box>
      </Stack>
    :
      <Stack direction="row" alignItems="center">
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
          {value}
        </Box>
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      </Stack> }
  </>
  )
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items=[],
  handleQuantity,
  isReadOnly,
  // generateCartItemsFrom 
}) => {

  // const[isReadOnly, setIsReadOnly] = useState(true)

  const history = useHistory();
  const Checkout =()=>{
   history.push("/checkout")
  //  setIsReadOnly(false)
 }

  const token = localStorage.getItem("token")

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
      <>
        {isReadOnly ? <>
        <Box className="cart">
        {items.map((itemsElement)=>{
            return (
              <Box display="flex" alignItems="flex-start" padding="1rem">
              <Box className="image-container">
                  <img
                      // Add product image
                      src={itemsElement.image}
                      // Add product name as alt eext
                      alt={itemsElement.name}
                      width="100%"
                      height="100%"
                  />
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="space-between" height="6rem" paddingX="1rem">
                  <div>{itemsElement.name}</div>
                  <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                  >
                    <ItemQuantity 
                      value={itemsElement.qty} 
                      productId={itemsElement._id}
                      handleAdd={(e)=>
                      handleQuantity(
                        token,
                        items,
                        itemsElement,
                        itemsElement._id,
                        itemsElement.qty + 1,
                      )}

                      handleDelete={(e)=>
                        handleQuantity(
                          token,
                          items,
                          itemsElement,
                          itemsElement._id,
                          itemsElement.qty - 1,
                        )}

                        isReadOnly ={isReadOnly}
                        // generateCartItems ={generateCartItemsFrom (items, products)}
                    />
                      <Box padding="0.5rem" fontWeight="700">
                          ${itemsElement.cost}
                      </Box>
                  </Box> 
              </Box>
            </Box>
            )
            })}
          {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.3rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items,products)}
            </Box>
          </Box>

        </Box> 
        <Box className="cart">
          <Box display="flex" flexDirection="column" justifyContent="space-between" padding="1rem">
              {/* heading */}
              <Box
                padding="0.5rem"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box color="#3C3C3C"
                fontWeight="700"
                fontSize="1.5rem"
                alignSelf="center">
                  Order Details
                </Box>
              </Box>
              {/* product */}
            <Box
                padding="0.5rem"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box color="#3C3C3C" alignSelf="center">
                  Products
                </Box>
                <Box
                  color="#3C3C3C"
                  fontWeight="500"
                  fontSize="1rem"
                  alignSelf="center"
                  data-testid="cart-total"
                >
                  {items.length}
                </Box>
              </Box>
              {/* suntotal */}
              <Box
                padding="0.5rem"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box color="#3C3C3C" alignSelf="center">
                  Subtotal
                </Box>
                <Box
                  color="#3C3C3C"
                  fontWeight="500"
                  fontSize="1rem"
                  alignSelf="center"
                  data-testid="cart-total"
                >
                  ${getTotalCartValue(items,products)}
                </Box>
              </Box>
              {/* shipping charges */}
              <Box
                padding="0.5rem"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box color="#3C3C3C" alignSelf="center">
                  Shipping Charges
                </Box>
                <Box
                  color="#3C3C3C"
                  fontWeight="500"
                  fontSize="1rem"
                  alignSelf="center"
                  data-testid="cart-total"
                >
                  $0
                </Box>
              </Box>
              {/* total */}
              <Box
                padding="0.5rem"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box color="#3C3C3C"
                fontWeight="700"
                fontSize="1.1rem"
                alignSelf="center">
                  Total
                </Box>
                <Box
                  color="#3C3C3C"
                  fontWeight="700"
                  fontSize="1.1rem"
                  alignSelf="center"
                  data-testid="cart-total"
                >
                  ${getTotalCartValue(items,products)}
                </Box>
              </Box>
          </Box>
        </Box>
        </> : <Box className="cart">
        {items.map((itemsElement)=>{
            return (
              <Box display="flex" alignItems="flex-start" padding="1rem" key={itemsElement._id}>
              <Box className="image-container">
                  <img
                      // Add product image
                      src={itemsElement.image}
                      // Add product name as alt eext
                      alt={itemsElement.name}
                      width="100%"
                      height="100%"
                  />
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="space-between" height="6rem" paddingX="1rem">
                  <div>{itemsElement.name}</div>
                  <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                  >
                    <ItemQuantity 
                      value={itemsElement.qty} 
                      productId={itemsElement._id}
                      handleAdd={(e)=>
                      handleQuantity(
                        token,
                        items,
                        itemsElement,
                        itemsElement._id,
                        itemsElement.qty + 1,
                      )}

                      handleDelete={(e)=>
                        handleQuantity(
                          token,
                          items,
                          itemsElement,
                          itemsElement._id,
                          itemsElement.qty - 1,
                        )}
                    />
                      <Box padding="0.5rem" fontWeight="700">
                          ${itemsElement.cost}
                      </Box>
                  </Box> 
              </Box>
            </Box>
            )
            })}
          {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items,products)}
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={Checkout}
            >
              Checkout
            </Button>
          </Box>
        </Box>}
        
      </>
  );
};

export default Cart;
