const {networkInterfaces} = require("os");

module.exports.getIPAddressesOfHostMachine = () => {
    const availableNetworkInterfaces = networkInterfaces();
    const ipAddresses = [];

    for (const name of Object.keys(availableNetworkInterfaces)) {
        for (const net of availableNetworkInterfaces[name]) {
            if (net.family === "IPv4" && !net.internal) {
                ipAddresses.push(net.address);
            }
        }
    }

    return ipAddresses;
};
