export const ADD_TO_CART_WHOLESALE = 'ADD_TO_CART_WHOLESALE';
export const REMOVE_FROM_CART_WHOLESALE = 'REMOVE_FROM_CART_WHOLESALE';
export const DELETE_FROM_CART_WHOLESALE = 'DELETE_FROM_CART_WHOLESALE';

export const addToCartWholesale = (product) => (dispatch) => {
    dispatch ({
        type: ADD_TO_CART_WHOLESALE, payload: product
    })      
}

export const removeFromCartWholesale = (product) => (dispatch) => {
    dispatch ({
        type: REMOVE_FROM_CART_WHOLESALE, payload: product
    });
}

export const deleteCartWholesaleItem = (product) => (dispatch) => {
    dispatch ({
        type: DELETE_FROM_CART_WHOLESALE, payload: product
    })
}