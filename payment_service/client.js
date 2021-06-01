const path = require('path');
const PROTO_PATH = './payment.proto';

const GRPCClient = require('node-grpc-client');

const myClient = new GRPCClient(PROTO_PATH, 'payment', 'Payment', 'localhost:2001');
const grpcPromise = require('../grpcPromise');

async function createUser(userId) {
    const dataToSend = {
        user_id: userId,
    };
    
    await grpcPromise(myClient, 'CreateUser', dataToSend)
}

async function findUser(userId) {
    const dataToSend = {
        user_id: userId,
    };
    
    return await grpcPromise(myClient, 'FindUser', dataToSend)
}

async function addFunds(userId) {
    const dataToSend = {
        user_id: userId,
        amount: 1
    };
    
    await grpcPromise(myClient, 'AddFunds', dataToSend)
}

async function pay(userId) {
    const dataToSend = {
        user_id: userId,
        order_id: '4321',
        amount: 1
    };
    
    await grpcPromise(myClient, 'Pay', dataToSend)
}

async function cancel(userId) {
    const dataToSend = {
        user_id: userId,
        order_id: '4321',
        amount: 1
    };
    
    await grpcPromise(myClient, 'Cancel', dataToSend)
}

async function main() {
    const userId = 'wang15';
    try {
        await createUser(userId);
        await addFunds(userId);
        await findUser(userId);
        await pay(userId);
        await cancel(userId)
        await findUser(userId);
        while (true) {
            await pay(userId);
            await cancel(userId);
            const res = await findUser(userId);
            if (res.credit !== 1) {
                console.log('error')
                break;
            }
        }


    } catch (e) {
        console.log(e)
    }
}

main()


// createItem();
// findItem();
// addItem();
// subtractItem();
