const EventSourced = require("cloudstate").EventSourced;

const entity = new EventSourced(
	["payment.proto", "domain.proto"],
	"payment.Payment",
	{
		persistenceId: "payment",
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

// Export the entity
module.exports = entity;
