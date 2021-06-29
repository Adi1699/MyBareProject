import { ADD_TO_CART_WHOLESALE, REMOVE_FROM_CART_WHOLESALE, DELETE_FROM_CART_WHOLESALE } from "../actions/cartWholeSale";

const initialState = {
    items: [],
};

export default (state = initialState, action) => {
    
    switch (action.type) {

        case ADD_TO_CART_WHOLESALE: 
            return {
                ...state,
                items: [...state.items, action.payload]
            }

        case REMOVE_FROM_CART_WHOLESALE: 
                return {
                    ...state,
                    items: [],
                }

        case DELETE_FROM_CART_WHOLESALE: 
                return {
                    ...state,
                    items: state.items.filter((product) => product[0].itemCartItemVariant != action.payload[0].itemCartItemVariant)
                }
     
        default: 
                return state;
    }
}