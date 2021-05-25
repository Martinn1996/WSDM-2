const path = require('path');
const PROTO_PATH = './shoppingcart.proto';

const GRPCClient = require('node-grpc-client');

const myClient = new GRPCClient(PROTO_PATH, 'com.example.shoppingcart', 'ShoppingCart', 'localhost:1981');

const dataToSend = {
    user_id: '123',
};

const options = {
    metadata: {
        hello: 'world'
    }
};


myClient.runService('GetCart', dataToSend, (err, res) => {
    console.log(err)
    console.log('Service response ', res);
});