const {logger} = require(`./logger`);
const {createApp} = require(`./create-app`);

const port = 4813;

createApp()
    .listen(port, () => {
        logger.info(`server is up and running on port ${port}`);
    });

