const NodeCouchDb = require('node-couchdb');
const db = new NodeCouchDb({
    host: 'localhost',
    protocol: 'http',
    port: 5984
});

module.exports = db;