const EventSourced = require("cloudstate").EventSourced;

const entity = new EventSourced(
	["payment.proto", "domain.proto"],
	"payment.Payment",
	{
		persistenceId: "payment",
		snapshotEvery: 1, // Usually you wouldn't snapshot this frequently, but this helps to demonstrate snapshotting
		includeDirs: ["./"],
		serializeFallbackToJson: true // Enables JSON support for persistence
	}
);

entity.setInitial(_ => ({
	credit: -1,
}));

entity.setBehavior(cart => {
	return {
		commandHandlers: {
			CreateUser: createUser,
			FindUser: findUser,
			Pay: pay,
			AddFunds: addFunds,
			Cancel: cancelPayment
		},
		eventHandlers: {
			UserCreated: userCreated,
			Paid: paid,
			FundsAdded: fundsAdded,
			Canceled: canceled
		}
	};
});

function pay(newUser, user, ctx) {
	if (user.credit < 0) {
		ctx.fail("User does not exist");
		return;
	}

	if (user.credit < newUser.amount) {
		ctx.fail("User does not have enough credits");
		return;
	}

	const event = {
		type: "Paid",
		user: {
			amount: newUser.amount
		}
	}

	ctx.emit(event);
	return {};
}

function paid(data, currentUser) {
	currentUser.credit -= data.user.amount;

	return currentUser;
}

function cancelPayment(newUser, user, ctx) {
	if (user.credit < 0) {
		ctx.fail("User does not exist");
		return;
	}

	const event = {
		type: "Canceled",
		user: {
			amount: newUser.amount
		}
	}

	ctx.emit(event);
	return {};
}

function canceled(data, currentUser) {
	currentUser.credit += data.user.amount;
	return currentUser;
}

function addFunds(newUser, user, ctx) {
	if (user.credit < 0) {
		ctx.fail("User does not exist");
		return;
	}
	
	if (newUser.amount <= 0) {
		ctx.fail("Amount is not valid!");
		return;
	}

	const event = {
		type: "FundsAdded",
		user: {
			amount: newUser.amount
		}
	}

	ctx.emit(event);
	return {
		done: true
	};
}

function fundsAdded(data, currentUser) {
	currentUser.credit += data.user.amount;
	return currentUser;
}

function createUser(newUser, user, ctx) {
	if (user.credit >= 0) {
		ctx.fail("User is already created");
		return;
	}

	const event = {
		type: "UserCreated",
	};

	ctx.emit(event);
	return {}
}

function userCreated(data, currentUser) {
	currentUser.credit = 0;
	return currentUser;
}

function findUser(newUser, user, ctx) {
	if (user.credit < 0) {
		ctx.fail("User does not exist");
		return;
	}

	return user;
}

// Export the entity
module.exports = entity;
