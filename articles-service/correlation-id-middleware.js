const correlator = require(`@samples/correlation-id`);

function correlationIdMiddleware(req, res, next) {
    correlator.bindEmitter(req);
    correlator.bindEmitter(res);

    correlator.withId(() => {
        const currentCorrelationId = correlator.getId();
        res.set(`x-correlation-id`, currentCorrelationId);
        next();
    }, req.get(`x-correlation-id`));
}

module.exports = {correlationIdMiddleware};
