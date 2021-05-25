const path = require('path');
const PROTO_PATH = './stocks.proto';

const GRPCClient = require('node-grpc-client');

const myClient = new GRPCClient(PROTO_PATH, 'stocks', 'Stocks', 'localhost:1981');


function createItem() {
    const dataToSend = {
        item_id: 'Macbook',
        price: 10000.0
    };
    
    myClient.runService('CreateItem', dataToSend, (err, res) => {
        console.log(err)
        console.log('Service response ', res);
    });
}

function findItem() {
    const dataToSend = {
        item_id: 'zjgkynmqvj',
    };
    
    myClient.runService('FindItem', dataToSend, (err, res) => {
        console.log(err)
        console.log('Service response ', res);
    });
} 


function subtractItem() {
    const dataToSend = {
        item_id: 'Macbook',
        quantity: 10
    };
    
    myClient.runService('SubtractItem', dataToSend, (err, res) => {
        console.log(err)
        console.log('Service response ', res);
    });
} 
function addItem() {
    const dataToSend = {
        item_id: 'Macbook',
        quantity: 100
    };
    
    myClient.runService('AddItem', dataToSend, (err, res) => {
        console.log(err)
        console.log('Service response ', res);
    });
} 


// createItem();
findItem();
// addItem();
// subtractItem();
