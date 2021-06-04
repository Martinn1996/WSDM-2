const EventSourced = require("cloudstate").EventSourced;

const entity = new EventSourced(
	["stocks.proto", "domain.proto"],
	"stocks.Stocks",
	{
		persistenceId: "stocks",
		snapshotEvery: 100, // Usually you wouldn't snapshot this frequently, but this helps to demonstrate snapshotting
		includeDirs: ["./"],
		serializeFallbackToJson: true // Enables JSON support for persistence
	}
);

entity.setInitial(_ => ({
	price: -1,
	stock: -1
}));

entity.setBehavior(cart => {
	return {
		commandHandlers: {
			CreateItem: createItem,
			FindItem: findItem,
			AddItem: addItem,
			SubtractItem: subtractItem
		},
		eventHandlers: {
			ItemCreated: itemCreated,
			AddedToItem: addedToItem,
			SubtractedFromItem: subtractedFromItem
		}
	};
});

function createItem(newItem, item, ctx) {
	if (item.price !== -1) {
		ctx.fail('Item already exists');
		return;
	}
	const createdItem = {
		type: "ItemCreated",
		item: {
			// Apparently the item_id is stored as itemId instead of item_id
			item_id: newItem.itemId,
			price: newItem.price
		}
	};

	ctx.emit(createdItem);
	return {}
}

function itemCreated(data, currentItem) {
	currentItem.price = data.item.price;
	currentItem.stock = 0;

	return currentItem;
}

function findItem(newItem, item, ctx) {
	if (item.price === -1) {
		ctx.fail('Item does not exist yet');
		return;
	}
	return item
}

function addItem(data, item, ctx) {
	if (item.price === -1) {
		ctx.fail('Item does not to add to');
		return;
	}

	if (data.quantity <= 0) {
		ctx.fail('Quantity cannot be <= 0');
		return;
	}

	const addedToItem = {
		type: "AddedToItem",
		data: {
			quantity: data.quantity
		}
	};

	ctx.emit(addedToItem)

	return {}
}

function addedToItem(data, item) {
	item.stock = item.stock + data.data.quantity;
	return item;
}


function subtractItem(data, item, ctx) {
	if (item.price === -1) {
		ctx.fail('Item does not exist to subtract from');
		return;
	}

	if (data.quantity <= 0) {
		ctx.fail('Quantity cannot be <= 0');
		return;
	}

	if (item.stock - data.quantity < 0) {
		ctx.fail('Stock cannot be negative');
		return;
	}

	const subtractedFromItem = {
		type: "SubtractedFromItem",
		data: {
			quantity: data.quantity
		}
	};

	ctx.emit(subtractedFromItem)

	return {}
}

function subtractedFromItem(data, item) {
	item.stock = item.stock - data.data.quantity;

	return item;
}
// Export the entity
module.exports = entity;
