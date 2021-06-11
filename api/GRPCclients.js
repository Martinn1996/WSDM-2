const GRPCClient = require('node-grpc-client');
const urls = require('./urls.js')
const ORDERS_PROTO_PATH = './protos/orders.proto';
// const orderClient = new GRPCClient(ORDERS_PROTO_PATH, 'orders', 'Orders', 'localhost:2000');
const orderClient = new GRPCClient(ORDERS_PROTO_PATH, 'orders', 'Orders', urls.orderService);

const STOCK_PROTO_PATH = './protos/stocks.proto';
// const stockClient = new GRPCClient(STOCK_PROTO_PATH, 'stocks', 'Stocks', 'localhost:1981');
const stockClient = new GRPCClient(STOCK_PROTO_PATH, 'stocks', 'Stocks', urls.stockService);

const PAYMENT_PROTO_PATH = './protos/payment.proto';
// const paymentClient = new GRPCClient(PAYMENT_PROTO_PATH, 'payment', 'Payment', 'localhost:2001');
const paymentClient = new GRPCClient(PAYMENT_PROTO_PATH, 'payment', 'Payment', urls.paymentService);

module.exports = {
    orderClient,
    stockClient, 
    paymentClient
}