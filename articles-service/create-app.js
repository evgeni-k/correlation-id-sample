const express = require(`express`);
const asyncWrap = require(`express-async-wrap`);
const {requestLoggingMiddleware} = require(`./request-logging-middleware`);
const {correlationIdMiddleware} = require(`./correlation-id-middleware`);

function createApp() {
    const app = express();
    app.disable(`x-powered-by`);

    app.use(correlationIdMiddleware);
    app.use(requestLoggingMiddleware);

    app.get(`/articles/:id`, asyncWrap(async (req, res) => {
        res.json({
            name: `Article`,
            price: 100,
        })
    }));

    app.use((req, res) => {
        res.json({message: `Not Found`});
        res.status(404);
    });

    return app;
}

module.exports = {createApp};
