module.exports = async function (client, endpoint, data) {
    return new Promise((resolve, reject) => {
        client.runService(endpoint, data, (err, res) => {
            if (err) {
                // if (err.details !== 'User does not have enough credits' && err.details !== 'Stock cannot be negative') {
                //     console.log(err);
                // }
                return reject(err);
            }
            return resolve(res);
        });
    })
}