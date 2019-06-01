const express = require(`express`);
const asyncWrap = require(`express-async-wrap`);
const {requestLoggingMiddleware} = require(`./request-logging-middleware`);
const {correlationIdMiddleware} = require(`./correlation-id-middleware`);
const {requestPromise} = require(`./correlated-request`);
const {logger} = require(`./logger`);

function createApp() {
    const app = express();
    app.disable(`x-powered-by`);

    app.use(correlationIdMiddleware);
    app.use(requestLoggingMiddleware);

    app.get(`/articles/:id`, asyncWrap(async (req, res) => {
        const countries = [`en`, `de`, `ru`, `uk`, `by`];


        const articlePriceData = {
            basePrice: Math.floor(Math.random() * 5000),
            country: countries[Math.floor(Math.random() * 5)],
        };

        logger.info(`calculating price for country ${articlePriceData.country}`);

        const result = await requestPromise({
            url: `http://localhost:4813/price`,
            method: `POST`,
            body: articlePriceData,
            json: true,
        });

        res.json({
            name: `Some Article`,
            price: result.price,
        });
    }));

    app.use((req, res) => {
        res.json({message: `Not Found`});
        res.status(404);
    });

    return app;
}

module.exports = {createApp};
