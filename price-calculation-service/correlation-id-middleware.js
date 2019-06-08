const correlator = require(`@samples/correlation-id`);

function rebindOnFinished(container) {
    if (container.__onFinished) {
        // __onFinished is used by package (on-finished) that are used by koa itself (Application.handleRequest)
        // and morgan to run tasks once response ended
        // lib creates 1 field to store all on finish listeners in queue
        container.__onFinished = correlator.bind(container.__onFinished);
    }
}

async function correlationIdMiddleware(ctx, next) {
    correlator.bindEmitter(ctx.req);
    correlator.bindEmitter(ctx.res);
    correlator.bindEmitter(ctx.req.socket);
    await new Promise((resolve, reject) => {
        correlator.withId(() => {
            rebindOnFinished(ctx.res);

            const correlationId = correlator.getId();
            ctx.set(`x-correlation-id`, correlationId);
            next().then(resolve).catch(reject);
        }, ctx.request.get(`x-correlation-id`));
    });
}

module.exports = {correlationIdMiddleware};
