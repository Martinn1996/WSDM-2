const path = require('path');
const PROTO_PATH = './orders.proto';

const GRPCClient = require('node-grpc-client');
const grpcPromise = require('../grpcPromise');

const myClient = new GRPCClient(PROTO_PATH, 'orders', 'Orders', 'localhost:2000');


async function createOrder(orderId) {
    const dataToSend = {
        order_id: orderId,
        user_id: 'test_user',
    };

    await grpcPromise(myClient, 'CreateOrder', dataToSend)
}

async function findOrder(orderId) {

    const dataToSend = {
        order_id: orderId
    };
    await grpcPromise(myClient, 'FindOrder', dataToSend)
}


async function removeOrder(orderId) {
    const dataToSend = {
        order_id: orderId,
    };

    await grpcPromise(myClient, 'RemoveOrder', dataToSend)
}
async function addItem(orderId) {
    const dataToSend = {
        order_id: orderId,
        item_id: 'Macbook',
        price: 100
    };

    await grpcPromise(myClient, 'AddItem', dataToSend)

}

async function removeItem(orderId) {
    const dataToSend = {
        order_id: orderId,
        item_id: 'Macbook',
        price: 100
    };
    await grpcPromise(myClient, 'RemoveItem', dataToSend)
}

async function checkout(orderId) {
    const dataToSend = {
        order_id: orderId
    }
    await grpcPromise(myClient, 'Checkout', dataToSend);
}

async function main() {
    const orderId = 'marti2322';
    try {
        await createOrder(orderId);
        await findOrder(orderId);
        await addItem(orderId);
        await addItem(orderId);
        await addItem(orderId);
        await addItem(orderId);
        await addItem(orderId);
        await findOrder(orderId);
        await removeItem(orderId)
        await findOrder(orderId);
        // await removeOrder(orderId);
        // await findOrder(orderId);
        await checkout(orderId);
        await findOrder(orderId);
    } catch (e) {
        console.log(e.details)
    }
    // await findOrder(orderId);
    // await addItem(orderId);
    // await findOrder(orderId);
    // await removeItem(orderId)
    // await findOrder(orderId);
    // // await removeOrder(orderId);
    // // await findOrder(orderId);
    // await checkout(orderId);
    // await findOrder(orderId);

}
main()
// // createOrder();
// // removeOrder();
// findOrder();
// // addItem();
// // subtractItem();
