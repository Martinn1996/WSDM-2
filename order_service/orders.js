const EventSourced = require("cloudstate").EventSourced;

const entity = new EventSourced(
	["orders.proto", "domain.proto"],
	"orders.Orders",
	{
		persistenceId: "orders",
		snapshotEvery: 100, // Usually you wouldn't snapshot this frequently, but this helps to demonstrate snapshotting
		includeDirs: ["./"],
		serializeFallbackToJson: true // Enables JSON support for persistence
	}
);

entity.setInitial(_ => ({
	paid: false,
	items: {},
	userId: null,
	totalCost: -1
}));

entity.setBehavior(cart => {
	return {
		commandHandlers: {
			CreateOrder: createOrder,
			FindOrder: findOrder,
			RemoveOrder: removeOrder,
			AddItem: addItem,
			RemoveItem: removeItem,
			Checkout: checkout
		},
		eventHandlers: {
			OrderCreated: orderCreated,
			OrderRemoved: orderRemoved,
			AddedItem: addedItem,
			RemovedItem: removedItem,
			CheckedOut: checkedOut
		}
	};
});

function createOrder(newOrder, order, ctx) {
	if (order.userId !== null) {
		ctx.fail('Order already exists for given order_id');
		return;
	}

	const createdItem = {
		type: "OrderCreated",
		order: {
			userId: newOrder.userId,
		}
	};

	ctx.emit(createdItem);
	return {}
}

function orderCreated(data, currentItem) {
	currentItem.userId = data.order.userId;
	currentItem.totalCost = 0;

	return currentItem;
}

function removeOrder(newOrder, order, ctx) {
	if (order.userId === null) {
		ctx.fail('Order does not exist yet');
		return;
	}

	if (order.totalCost < 0) {
		ctx.fail('Order does not have correct initial cost value');
		return;
	}

	const event = {
		type: "OrderRemoved"
	};

	ctx.emit(event);
	return {};
}

function orderRemoved(data, currentItem) {
	currentItem.userId = null;
	currentItem.paid = false;
	currentItem.items = {};
	currentItem.totalCost = -1;

	return currentItem;
}

function addItem(data, order, ctx) {
	if (order.userId === null) {
		ctx.fail('Order does not exist yet');
		return;
	}

	if (order.totalCost < 0) {
		ctx.fail('Order does not have correct initial cost value');
		return;
	}

	const event = {
		type: "AddedItem",
		item: {
			itemId: data.itemId,
			price: data.price
		}
	};

	ctx.emit(event);
	return {};
}

function addedItem(data, currentOrder) {
	if (!currentOrder.items[data.item.itemId]) {
		currentOrder.items[data.item.itemId] = 0
	}
	currentOrder.items[data.item.itemId] += 1
	currentOrder.totalCost += data.item.price;
	return currentOrder;
}

function removeItem(data, order, ctx) {
	if (order.userId === null) {
		ctx.fail('Order does not exist yet');
		return;
	}

	if (order.totalCost < 0) {
		ctx.fail('Order does not have correct initial cost value');
		return;
	}

	if (!order.items[data.itemId] || order.items[data.itemId] <= 0) {
		ctx.fail('Item not in cart');
		return;
	}
	const event = {
		type: "RemovedItem",
		item: {
			itemId: data.itemId,
			price: data.price
		}
	};

	ctx.emit(event);
	return {};
}

function removedItem(data, currentOrder) {
	currentOrder.items[data.item.itemId] -= 1
	if (currentOrder.items[data.item.itemId] <= 0) {
		delete currentOrder.items[data.item.itemId];
	}
	currentOrder.totalCost -= data.item.price;
	return currentOrder;
}

function parseItems(items) {
	const res = [];
	for (const [item, amount] of Object.entries(items)) {
		for(let i = 0; i < amount; i++) {
			res.push(item)
		}
	}
	return res;
}

function findOrder(newOrder, order, ctx) {
	if (order.userId === null) {
		ctx.fail('Order does not exist yet');
		return;
	}

	if (order.totalCost < 0) {
		ctx.fail('Order does not have correct initial cost value');
		return;
	}

	const res = {
		paid: order.paid,
		items: parseItems(order.items),
		userId: order.userId,
		totalCost: order.totalCost
	}
	return res;
}

function checkout(newOrder, order, ctx) {
	if (order.userId === null) {
		ctx.fail('Order does not exist yet');
		return;
	}

	if (order.totalCost < 0) {
		ctx.fail('Order does not have correct initial cost value');
		return;
	}

	if (order.paid) {
		ctx.fail('Order is already paid');
		return;
	}

	ctx.emit({
		type: 'CheckedOut'
	})
	return {};
}

function checkedOut(_, currentOrder) {
	currentOrder.paid = true;
	return currentOrder;
}

// Export the entity
module.exports = entity;
