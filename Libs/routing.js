const fs = require('fs');
const yaml = require('js-yaml');
const acl = require('./acl');
const multipart = require('connect-multiparty')();

// *************** Import routes dynamically ***************
exports.run = function (app) {
    let config = yaml.safeLoad(fs.readFileSync(__dirname + '/../Configs/routing.yml', 'utf8'));
    config.routing.forEach(routing => {
        let requireCtrl = routing.name + "=require('../Controllers/" + routing.controller + ".js');"
        let route = "app." + routing.method.toLowerCase() + "('" + routing.path + "', acl(routing.policies, routing.token), multipart, " + routing.name + ");"
        eval(requireCtrl);
        eval(route);
    });

    // ***** 404 Not Found *****
    app.all('*', function (req, res) { res.sendStatus(404) });
}