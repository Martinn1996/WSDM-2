const express = require('express')

const app = express()
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


const port = 3000
app.use('/stock', require('./routes/stock'));

app.use('/orders', require('./routes/orders'));

app.use('/payment', require('./routes/payment'));

app.get('/', (req, res) => {
	res.end('Hello World!')
})

app.listen(port, () => {
	console.log(`API running on port ${port}`)
})