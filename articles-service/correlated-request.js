const requestPromise = require(`request-promise-native`);
const correlator = require(`@samples/correlation-id`);

module.exports = {
    requestPromise: requestPromise.defaults({
        headers: {
            get 'x-correlation-id'() {
                return correlator.getId();
            },
        },
    })
};
