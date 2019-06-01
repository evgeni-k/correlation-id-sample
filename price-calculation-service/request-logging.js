const morgan = require(`koa-morgan`);
const {logger} = require(`./logger`);

function registerRequestLoggingMiddleware(app) {
    const config = {
        stream: {write: (text) => logger.info(text.trim())},
    };

    app.use(morgan(`:method :url`, {
        ...config,
        immediate: true,
    }));

    app.use(morgan(`:method :status :url (:res[content-length] bytes) :response-time ms`, {
        ...config,
        immediate: false,
    }));
}

module.exports = {registerRequestLoggingMiddleware};
