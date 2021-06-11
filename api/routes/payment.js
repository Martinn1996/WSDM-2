const router = require('express').Router();
const generateCode = require("../utils/generateCode.js");

// const PAYMENT_PROTO_PATH = './protos/payment.proto';
const GRPCClient = require('node-grpc-client');
const grpcPromise = require('../grpcPromise.js');
// const paymentClient = new GRPCClient(PAYMENT_PROTO_PATH, 'payment', 'Payment', 'payment-service:80');

// const ORDER_PROTO_PATH = './protos/orders.proto';
// const ordersClient = new GRPCClient(ORDER_PROTO_PATH, 'orders', 'Orders', 'orders-service:80');
const { orderClient, stockClient, paymentClient } = require('../GRPCclients.js')


router.post('/pay/:userId/:orderId/:amount', async function (req, res) {
    const userId = req.params.userId;
    const orderId = req.params.orderId;
    const amount = req.params.amount;

    const dataToSend = {
        user_id: userId,
        order_id: orderId,
        amount: amount
    };

    try {
        const response = await grpcPromise(paymentClient, 'Pay', dataToSend);
        res.end();
    } catch (e) {
        // console.error(e)
        res.status(400).end(e.details)
    }
});

router.post('/cancel/:userId/:orderId', async function (req, res) {
    const userId = req.params.userId;
    const orderId = req.params.orderId;
    console.log('fdsfsdahfsdkh')
    try {
        let dataToSend = {
            order_id: orderId
        }

        // Retrieve total price to refund
        const orderResponse = await grpcPromise(ordersClient, 'FindOrder', dataToSend);

        if (!orderResponse.paid) {
            res.status(400).json({error: "Order was not paid, no cancellation possible"});
        }

        dataToSend = {
            user_id: userId,
            order_id: orderId,
            amount: orderResponse.total_cost
        };

        const response = await grpcPromise(paymentClient, 'Cancel', dataToSend);

        for (let item of orderResponse.items) {
            dataToSend = {
                item_id: item,
                quantity: 1                         //orderResponse.items.filter(x => x === item).length
            };

            const stockResponse = await grpcPromise(stockClient, 'AddItem', dataToSend);
        }
        res.end();
    } catch (e) {
        // console.error(e)
        res.status(400).json({error: e.details})
    }
});

router.get('/status/:orderId', async function (req, res) {
    const orderId = req.params.orderId;

    const dataToSend = {
        order_id: orderId
    };

    try {
        const response = await grpcPromise(ordersClient, 'FindOrder', dataToSend);
        res.json({
            paid: response.paid
        });
    } catch (e) {
        // console.error(e)
        res.status(400).json({error: e.details})
    }
});

router.post('/add_funds/:userId/:amount', async function (req, res) {
    const userId = req.params.userId;
    const amount = req.params.amount;

    const dataToSend = {
        user_id: userId,
        amount: amount
    };

    try {
        const response = await grpcPromise(paymentClient, 'AddFunds', dataToSend);
        res.json({
            done: true
        });
    } catch (e) {
        // console.error(e)
        res.json({
            done: false
        });
    }
});

router.post('/create_user', async function (req, res) {
    const dataToSend = {
        user_id: generateCode(10)
    };

    try {
        const response = await grpcPromise(paymentClient, 'CreateUser', dataToSend);
        res.json({ user_id: dataToSend.user_id });
    } catch (e) {
        // console.error(e)
        res.status(400).json({error: e.details})
    }
});

router.get('/find_user/:userId', async function (req, res) {
    const userId = req.params.userId;

    const dataToSend = {
        user_id: userId
    };

    try {
        const response = await grpcPromise(paymentClient, 'FindUser', dataToSend);
        res.json({
            user_id: userId,
            credit: response.credit
        });
    } catch (e) {
        // console.error(e)
        res.status(400).json({error: e.details})
    }
});

module.exports = router;
