const express = require('express')
const https = require('http')

const app = express()
const port = 3000

app.get('/', (req, res) => {
	res.end('Hello World! dfsa')
})

app.get('/test', (req, res) => {
	https.get('http://cloudstate-shopping-cart/cart/bart', resp => {
		resp.on('data', (chunk) => {
			res.end(chunk);
		});

	})
})

const path = require('path');
const PROTO_PATH = './shoppingcart.proto';

const GRPCClient = require('node-grpc-client');

const myClient = new GRPCClient(PROTO_PATH, 'com.example.shoppingcart', 'ShoppingCart', 'cloudstate-shopping-cart:80');


app.get('/getCart', async (req, res) => {
	const url = req.params.url;
	console.log(url);
	const dataToSend = {
		user_id: '123',
	};

	myClient.runService('GetCart', dataToSend, (err, resp) => {
		console.log(err)
		console.log('Service response ', resp);
		res.end(JSON.stringify(resp));
	});
});

app.get('/addItem', async (req, res) => {
	const url = req.params.url;
	console.log(url);
	const dataToSend = {
		user_id: "123",
		productId: "abc",
		name: "Some product",
		quantity: 10
	};

	myClient.runService('AddItem', dataToSend, (err, resp) => {
		console.log(err)
		console.log('Service response ', resp);
		res.end(JSON.stringify(resp));
	});
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})