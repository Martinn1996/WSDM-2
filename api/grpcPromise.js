module.exports = async function (client, endpoint, data) {
    return new Promise((resolve, reject) => {
        client.runService(endpoint, data, (err, res) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(res);
        });
    })
}