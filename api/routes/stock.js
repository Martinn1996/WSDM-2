const router = require('express').Router();
const generateCode = require("../utils/generateCode.js");

const PROTO_PATH = './protos/stocks.proto';
const GRPCClient = require('node-grpc-client');
const myClient = new GRPCClient(PROTO_PATH, 'stocks', 'Stocks', 'stock-service:80');

router.get('/find/:itemId', function (req, res) {
    const itemId = req.params.itemId;

    const dataToSend = {
        item_id: itemId
    };

    myClient.runService('FindItem', dataToSend, (err, grpcRes) => {
        if (err) {
            console.error(err);
            res.status(400).end()
        }
        return res.json({
            stock: grpcRes.stock,
            price: grpcRes.price
        })
    });
});

router.post('/subtract/:itemId/:quantity', function (req, res) {
    const itemId = req.params.itemId;
    const quantity = req.params.quantity;

    const dataToSend = {
        item_id: itemId,
        quantity
    };

    myClient.runService('SubtractItem', dataToSend, (err, grpcRes) => {
        if (err) {
            console.error(err);
            res.status(400).end();
        }
        return res.end();
    });
});

router.post('/add/:itemId/:quantity', function (req, res) {
    const itemId = req.params.itemId;
    const quantity = req.params.quantity;

    const dataToSend = {
        item_id: itemId,
        quantity
    };

    myClient.runService('AddItem', dataToSend, (err, grpcRes) => {
        if (err) {
            console.error(err);
            res.status(400).end();
        }
        return res.end();
    });
});

router.post('/item/create/:price', function (req, res) {
    const price = parseFloat(req.params.price);

    const dataToSend = {
        item_id: generateCode(10),
        price
    };

    myClient.runService('CreateItem', dataToSend, (err, grpcRes) => {
        if (err) {
            console.error(err);
            res.status(400).end()
        }
        return res.json({
            item_id: dataToSend.item_id
        })
    });
});
module.exports = router;
