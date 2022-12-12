const axios = require('axios');
const config = require('./config');
let token = null;

const getToken = async() => {
    const headers = { 'Content-Type': 'application/json','x-api-key': config.CHECKOUT_API_KEY };
    const requestOptions = {
        url: `${config.BASKET_API_URL}/temp-customer`,
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
    let productsId = JSON.parse(config.PRODUCT_ID);
    productsId.forEach( async(pid) => {
        const headers = { 'Content-Type': 'application/json','x-api-key': config.CHECKOUT_API_KEY };
        const requestOptions = {
            url: `${config.BASKET_API_URL}/basket/items`,
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
    const headers = { 'Content-Type': 'application/json','x-api-key': config.CHECKOUT_API_KEY };
    const requestOptions = {
        url: `${config.BASKET_API_URL}/ssotoken`,
        method: 'post',
        data: {
          storeId: 'store_elt_compass',
          customerId: customerId
        }
    };
    const response = await axios({ headers, ...requestOptions });
    return response.data.id;
}
module.exports = {getToken};

