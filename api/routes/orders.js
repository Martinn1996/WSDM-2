const router = require('express').Router();
const generateCode = require("../utils/generateCode.js");

const ORDERS_PROTO_PATH = './protos/orders.proto';
const GRPCClient = require('node-grpc-client');
const grpcPromise = require('../grpcPromise.js');
const orderClient = new GRPCClient(ORDERS_PROTO_PATH, 'orders', 'Orders', 'orders-service:80');

const STOCK_PROTO_PATH = './protos/stocks.proto';
const stockClient = new GRPCClient(STOCK_PROTO_PATH, 'stocks', 'Stocks', 'stock-service:80');

router.post('/create/:userId', async function (req, res) {
    console.log('fsadfhsdjfhsajdhf')
    const userId = req.params.userId; 

    const dataToSend = {
        order_id: generateCode(10),
        user_id: userId
    };

	try {
		const response = await grpcPromise(orderClient, 'CreateOrder', dataToSend);
    	res.json({ order_id: dataToSend.order_id });
	} catch (e) {
        console.error(e)
		res.status(500).end()
	}
});

router.delete('/remove/:orderId', async function (req, res) {
    const orderId = req.params.orderId;

    const dataToSend = {
        order_id: orderId
    };

	const response = await grpcPromise(orderClient, 'RemoveOrder', dataToSend);
    
	res.end();
});

router.get('/find/:orderId', async function (req, res) {
    const orderId = req.params.orderId;

    const dataToSend = {
        order_id: orderId
    };

	try {
		const response = await grpcPromise(orderClient, 'FindOrder', dataToSend); 
        console.log(response);
		res.json({
			"order_id": orderId,
			"paid": response.paid,
			"items": response.items,
			"user_id": response.user_id,
			"total_cost": response.total_cost
		});
	} catch (e) {
        console.error(e);
		res.status(500).end()
	}
});

router.post('/addItem/:orderId/:itemId', async function (req, res) {
    const orderId = req.params.orderId;
	const itemId = req.params.itemId;
    
    try {
        const item = await grpcPromise(stockClient, 'FindItem', {item_id: itemId});
        const dataToSend = {
            order_id: orderId,
            item_id: itemId,
            price: item.price
        };
        const response = await grpcPromise(orderClient, 'AddItem', dataToSend); 

        res.end();
    } catch (e) {
        console.error(e);
        res.status(400).end();
    }
	
});

router.delete('/removeItem/:orderId/:itemId', async function (req, res) {
    const orderId = req.params.orderId;
	const itemId = req.params.itemId;
    
    try {
        const item = await grpcPromise(stockClient, 'FindItem', {item_id: itemId});
       
		const dataToSend = {
			order_id: orderId,
			item_id: itemId,
			price: item.price
		};

        const response = await grpcPromise(orderClient, 'RemoveItem', dataToSend); 

        res.end();
    } catch (e) {
		console.error(e);
        res.status(400).end();
    }
	
});

router.post('/checkout/:orderId', async function (req, res) {
    const orderId = req.params.orderId;
    
    try {
        // TODO call other services
		const dataToSend = {
			order_id: orderId
		};

        const response = await grpcPromise(orderClient, 'Checkout', dataToSend); 

        res.end();
    } catch (e) {
		console.error(e);
        res.status(400).end();
    }
	
});

module.exports = router;
