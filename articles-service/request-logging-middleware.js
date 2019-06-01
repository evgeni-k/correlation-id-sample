const morgan = require(`morgan`);
const {logger} = require(`./logger`);

const morganConfig = {
    stream: {
        write: (text) => logger.info(text.trim()),
    },
};

const requestLoggingMiddleware = [
    morgan(`:method :url`, {...morganConfig, immediate: true}),
    morgan(`:method :status :url (:res[content-length] bytes) :response-time ms`, {...morganConfig, immediate: false}),
];

module.exports = {requestLoggingMiddleware};
