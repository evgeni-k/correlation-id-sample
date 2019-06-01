const Koa = require(`koa`);
const Router = require(`koa-router`);
const koaBody = require(`koa-body`);
const {correlationIdMiddleware} = require(`./correlation-id-middleware`);
const {registerRequestLoggingMiddleware} = require(`./request-logging`);
const {logger} = require(`./logger`);

function createApp() {
    const app = new Koa();
    app.use(correlationIdMiddleware);
    registerRequestLoggingMiddleware(app);
    app.use(koaBody());
    const router = new Router();

    router.post(`/price`, async (ctx) => {
        const taxes = {
            en: 0.1,
            de: 0.2,
            ru: 0.3,
            uk: 0.25,
        };

        const {basePrice, country = ``} = ctx.request.body;
        if (!basePrice) {
            ctx.status = 400;
            ctx.body = {
                message: `Price is missing`
            };
            return;
        }

        let taxPercentage = taxes[country];
        logger.info(`Received country ${country}`);
        if (!taxPercentage) {
            logger.info(`falling back on default percentage.`);
            taxPercentage = 0.5;
        }

        ctx.body = {
            price: basePrice + (basePrice * taxPercentage),
        };
    });

    app
        .use(router.routes())
        .use(router.allowedMethods());

    return app;
}

module.exports = {createApp};
