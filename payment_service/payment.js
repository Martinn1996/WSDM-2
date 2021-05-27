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
	amount: -1,
	credit: -1,
	payments: [
		{
			orderId,
			amount,
			status
		}
	]
}));

entity.setBehavior(cart => {
	return {
		commandHandlers: {
			CreateUser: createUser,
			FindUser: findUser,
			Pay: pay,
			AddFunds, addFunds
		},
		eventHandlers: {
			UserCreated: userCreated,
			Paid: paid,
			FundsAdded: fundsAdded
		}
	};
});

function pay(newUser, user, ctx) {
	if (user.credit < 0) {
		ctx.fail("User does not exist");
		return;
	}

	if (user.credit < user.amount) {
		ctx.fail("User does not have enough credits");
		return;
	}

	const event = {
		type: "Paid",
		user: {
			amount: user.amount
		}
	}

	ctx.emit(event);
	return {};
}

function paid(data, currentUser) {
	currentUser.credit -= data.amount;

	return currentUser;
}

// function cancelPayment(newUser, user, ctx) {
// 	if (user.credit < 0) {
// 		ctx.fail("User does not exist");
// 		return;
// 	}




// }

function addFunds(newUser, user, ctx) {
	if (user.credit < 0) {
		ctx.fail("User does not exist");
		return;
	}

	const event = {
		type: "FundsAdded",
		user: {
			amount: user.amount
		}
	}

	ctx.emit(event);
	return {};
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
