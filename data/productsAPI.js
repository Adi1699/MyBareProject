import axios from "axios";


const productApi = {  
    
    productItem: async (req) => {
        try {
            const response = await axios.get(req)
            return response
        } 
        catch (e) {
            console.log(e)
        }
       
    }

};

export default productApi;