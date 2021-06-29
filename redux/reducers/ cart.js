import { ADD_TO_CART, REMOVE_FROM_CART, DELETE_FROM_CART } from "../actions/cart";

const initialState = {
    items: [],
};

export default (state = initialState, action) => {

    switch (action.type) {

        case ADD_TO_CART:           
            return {
                ...state,
                items: [...state.items, action.payload]
            }

        case REMOVE_FROM_CART:
                return {
                    ...state,
                    items: [],
                }

        case DELETE_FROM_CART: 
             return {
                 ...state,
                 items: state.items.filter((product) => product[0].itemCartItemVariant != action.payload[0].itemCartItemVariant)
             }

        default: 
               return state;
    }

}