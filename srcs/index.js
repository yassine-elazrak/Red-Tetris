const logger = require('morgan');
const { createApp } = require('./app')
const port = process.env.PORT || 1337;
const app = createApp();
app.listen(port, () =>
    console.log(`Server is running!\nAPI documentation: http://localhost:${port}/doc`)
);