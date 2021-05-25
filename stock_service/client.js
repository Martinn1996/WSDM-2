const path = require('path');
const PROTO_PATH = './stocks.proto';

const GRPCClient = require('node-grpc-client');

const myClient = new GRPCClient(PROTO_PATH, 'stocks', 'Stocks', 'localhost:1981');


function createItem() {
    const dataToSend = {
        item_id: 'wang1',
        price: 200.0
    };
    
    myClient.runService('CreateItem', dataToSend, (err, res) => {
        console.log(err)
        console.log('Service response ', res);
    });
}

function findItem() {
    const dataToSend = {
        item_id: 'wang1',
    };
    
    myClient.runService('FindItem', dataToSend, (err, res) => {
        console.log(err)
        console.log('Service response ', res);
    });
} 

findItem();
