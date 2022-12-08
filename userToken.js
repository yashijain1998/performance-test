const axios = require('axios');
let token = null;

const getToken = async() => {
    const headers = { 'Content-Type': 'application/json','x-api-key': 'MDMYtLORBZ5qJUeWYgdRq5Iz6mEQSTc55c901oUk' };
    const requestOptions = {
        url: 'https://qa-ecommerce-basket-api.cambridgedev.org/temp-customer',
        method: 'post'
    };
    const response = await axios({ headers, ...requestOptions });
    let customerId = response.data.id;
    console.log('customerId from function',customerId);
    await addToBasket(customerId);
    token = await generateToken(customerId);
    console.log('token from function',token);
    return token;
}

const addToBasket = async(customerId) => {
    let productsId = ['2800475402', '2800483274', '2800473984'];
    productsId.forEach( async(pid) => {
        const headers = { 'Content-Type': 'application/json','x-api-key': 'MDMYtLORBZ5qJUeWYgdRq5Iz6mEQSTc55c901oUk' };
        const requestOptions = {
            url: 'https://qa-ecommerce-basket-api.cambridgedev.org/basket/items',
            method: 'post',
            data: {
                product: {
                    sku: pid,
                    quantity: 1
                },
                storeId: 'store_elt_compass',
                customerId: customerId
            }
        };
        await axios({ headers, ...requestOptions });
    })
} 

const generateToken = async(customerId) => {
    const headers = { 'Content-Type': 'application/json','x-api-key': 'MDMYtLORBZ5qJUeWYgdRq5Iz6mEQSTc55c901oUk' };
    const requestOptions = {
        url: 'https://qa-ecommerce-basket-api.cambridgedev.org/ssotoken',
        method: 'post',
        data: {
          storeId: 'store_elt_compass',
          customerId: customerId
        }
    };
    const response = await axios({ headers, ...requestOptions });
    return response.data.id;;
}
module.exports = {getToken};

