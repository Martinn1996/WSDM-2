const router = require('express').Router();
const generateCode = require("../utils/generateCode.js");

const GRPCClient = require('node-grpc-client');
const grpcPromise = require('../grpcPromise.js');
const ORDERS_PROTO_PATH = './protos/orders.proto';
// const orderClient = new GRPCClient(ORDERS_PROTO_PATH, 'orders', 'Orders', 'orders-service:80');
const {orderClient, stockClient, paymentClient} = require('../GRPCclients.js')
// const STOCK_PROTO_PATH = './protos/stocks.proto';
// const stockClient = new GRPCClient(STOCK_PROTO_PATH, 'stocks', 'Stocks', 'stock-service:80');

// const PAYMENT_PROTO_PATH = './protos/payment.proto';
// const paymentClient = new GRPCClient(PAYMENT_PROTO_PATH, 'payment', 'Payment', 'payment-service:80');

router.post('/create/:userId', async function (req, res) {
    const userId = req.params.userId;

    const dataToSend = {
        order_id: generateCode(10),
        user_id: userId
    };

    try {
        const response = await grpcPromise(orderClient, 'CreateOrder', dataToSend);
        res.json({ order_id: dataToSend.order_id });
    } catch (e) {
        // console.error(e)
        res.status(400).json({error: e.details})
    }
});

router.delete('/remove/:orderId', async function (req, res) {
    const orderId = req.params.orderId;

    const dataToSend = {
        order_id: orderId
    };
    try {
        const response = await grpcPromise(orderClient, 'RemoveOrder', dataToSend);

        res.end();
    } catch (e) {
        // console.error(e)
        res.status(400).json({error: e.details})
    }

});

router.get('/find/:orderId', async function (req, res) {
    const orderId = req.params.orderId;

    const dataToSend = {
        order_id: orderId
    };

    try {
        const response = await grpcPromise(orderClient, 'FindOrder', dataToSend);
        // console.log(response);
        res.json({
            "order_id": orderId,
            "paid": response.paid,
            "items": response.items,
            "user_id": response.user_id,
            "total_cost": response.total_cost
        });
    } catch (e) {
        // console.error(e);
        res.status(400).json({error: e.details})
    }
});

router.post('/addItem/:orderId/:itemId', async function (req, res) {
    const orderId = req.params.orderId;
    const itemId = req.params.itemId;

    try {
        const item = await grpcPromise(stockClient, 'FindItem', { item_id: itemId });
        const dataToSend = {
            order_id: orderId,
            item_id: itemId,
            price: item.price
        };
        const response = await grpcPromise(orderClient, 'AddItem', dataToSend);

        res.end();
    } catch (e) {
        // console.error(e);
        res.status(400).json({error: e.details})
    }

});

router.delete('/removeItem/:orderId/:itemId', async function (req, res) {
    const orderId = req.params.orderId;
    const itemId = req.params.itemId;

    try {
        const item = await grpcPromise(stockClient, 'FindItem', { item_id: itemId });

        const dataToSend = {
            order_id: orderId,
            item_id: itemId,
            price: item.price
        };

        const response = await grpcPromise(orderClient, 'RemoveItem', dataToSend);

        res.end();
    } catch (e) {
        // console.error(e);
        res.status(400).json({error: e.details})
    }

});

router.post('/checkout/:orderId', async function (req, res) {
    const orderId = req.params.orderId;
    let paid = false;

    const items = [];

    let orderTotalCost;
    let user_id;

    try {
        let dataToSend = {
            order_id: orderId
        }
        const orderResponse = await grpcPromise(orderClient, 'FindOrder', dataToSend);
        orderTotalCost = orderResponse.total_cost;
        user_id = orderResponse.user_id
        dataToSend = {
            order_id: orderId,
            user_id: orderResponse.user_id,
            amount: orderResponse.total_cost
        }

        const paymentResponse = await grpcPromise(paymentClient, 'Pay', dataToSend);

        paid = true;
        for (let item of orderResponse.items) {
            dataToSend = {
                item_id: item,
                quantity: 1                         //orderResponse.items.filter(x => x === item).length
            };

            const stockResponse = await grpcPromise(stockClient, 'SubtractItem', dataToSend);
            items.push(dataToSend);
        }

        dataToSend = {
            order_id: orderId
        };

        const response = await grpcPromise(orderClient, 'Checkout', dataToSend);
        res.end();
    } catch (e) {
        try {
            if (paid) {
                const before = await grpcPromise(paymentClient, 'FindUser', {
                    user_id: user_id
                });
                await grpcPromise(paymentClient, 'Cancel', {
                    order_id: orderId,
                    user_id: user_id,
                    amount: orderTotalCost
                });

                const resTest = await grpcPromise(paymentClient, 'FindUser', {
                    user_id: user_id
                });
                if (resTest.credit === 0) console.log(user_id, before, resTest, orderTotalCost)
            }
    
            for (let item of items) {
                await grpcPromise(stockClient, 'Add', item);
            }
        } catch(e1) {
            console.log(e1)
        }
       

        res.status(400).json({error: e.details})
    }

});

module.exports = router;
