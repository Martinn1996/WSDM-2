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
	price: -1,
	stock: -1
}));

entity.setBehavior(cart => {
	return {
		commandHandlers: {
		},
		eventHandlers: {
		}
	};
});

// Export the entity
module.exports = entity;
