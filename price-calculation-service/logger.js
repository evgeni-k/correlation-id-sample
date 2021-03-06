const correlationId = require(`@samples/correlation-id`);
const {createLogger} = require(`@samples/logger`);

const logger = createLogger({
    getCorrelationId: correlationId.getId,
});

module.exports = {logger};
