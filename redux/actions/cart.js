export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const DELETE_FROM_CART = 'DELETE_FROM_CART';

export const addToCart = (product) => (dispatch) =>  {
    dispatch ({
        type: ADD_TO_CART, payload: product
    })
}

export const removeFromCart = (product) => (dispatch) => {
    dispatch ({
        type: REMOVE_FROM_CART, payload: product
    });
}

export const deleteFromCart = (product) => (dispatch) => {
    dispatch ({
        type: DELETE_FROM_CART, payload: product
    })
}