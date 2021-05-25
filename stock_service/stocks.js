/*
 * Copyright 2019 Lightbend Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const EventSourced = require("cloudstate").EventSourced;

const entity = new EventSourced(
	["stocks.proto", "domain.proto"],
	"stocks.Stocks",
	{
		persistenceId: "stocks",
		snapshotEvery: 5, // Usually you wouldn't snapshot this frequently, but this helps to demonstrate snapshotting
		includeDirs: ["./"],
		serializeFallbackToJson: true // Enables JSON support for persistence
	}
);

/*
 * Set a callback to create the initial state. This is what is created if there is no
 * snapshot to load.
 *
 * We can ignore the userId parameter if we want, it's the id of the entity, which is
 * automatically associated with all events and state for this entity.
 */
entity.setInitial(_ => ({
	item_id: null,
	price: -1,
	stock: -1
}));

/*
 * Set a callback to create the behavior given the current state. Since there is no state
 * machine like behavior transitions for our shopping cart, we just return one behavior, but
 * this could inspect the cart, and return a different set of handlers depending on the
 * current state of the cart - for example, if the cart supported being checked out, then
 * if the cart was checked out, it might return AddItem and RemoveItem command handlers that
 * always fail because the cart is checked out.
 *
 * This callback will be invoked after each time that an event is handled to get the current
 * behavior for the current state.
 */
entity.setBehavior(cart => {
	return {
		// Command handlers. The name of the command corresponds to the name of the rpc call in
		// the gRPC service that this entity offers.
		commandHandlers: {
			CreateItem: createItem,
			FindItem: findItem
		},
		// Event handlers. The name of the event corresponds to the value of the
		// type field in the event JSON.
		eventHandlers: {
			ItemCreated: itemCreated
		}
	};
});

function createItem(newItem, item, ctx) {
	if (item.item_id !== null) {
		ctx.fail('Item already exists');
		return;
	}
	console.log(newItem)
	const createdItem = {
		type: "ItemCreated",
		item: {
			item_id: newItem.itemId,
			price: newItem.price
		}
	};

	ctx.emit(createdItem);
	return {}
}

function itemCreated(data, currentItem) {
	console.log(data)
	currentItem.item_id = data.item.item_id;
	currentItem.price = data.item.price;
	currentItem.stock = 0;
	return currentItem;
}

function findItem(newItem, item, ctx) {
	if (item.item_id === null) {
		ctx.fail('Item does not exist yet');
		return;
	}
	return item
}
// Export the entity
module.exports = entity;
