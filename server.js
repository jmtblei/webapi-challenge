const express = require('express');
const projectsRouter = require('./routes/projectsRouter');
const actionsRouter = require('./routes/actionsRouter');

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
    res.send('I think it works!');
});

server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

module.exports = server;