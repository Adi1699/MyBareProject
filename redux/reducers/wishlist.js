import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../actions/wishlist";

const initialState = {
    wishlist: [],
};

export default (state = initialState, action) => {
   
    switch (action.type) {
    
        case ADD_TO_WISHLIST:
            return {
                ...state,
                wishlist: [...state.wishlist, action.payload]
            }

        case REMOVE_FROM_WISHLIST:
            return {
                ...state,
                wishlist: state.wishlist.filter((product) => product[0].itemWishlistId !== action.payload[0].itemWishlistId)
            }
        default: 
            return state;
    }
}