const fs = require('fs');
const yaml = require('js-yaml');
const acl = require('./acl');
const multipart = require('connect-multiparty')();

// *************** Import routes dynamically ***************
exports.run = function (app) {
    let config = yaml.safeLoad(fs.readFileSync(__dirname + '/../Configs/routing.yml', 'utf8'));
    config.routing.forEach(routing => {
        let requireCtrl = routing.name + "=require('../Controllers/" + routing.controller + ".js');"
        // let route = "app." + routing.method.toLowerCase() + "('" + routing.path + "', acl(routing.policies, routing.token), multipart, " + routing.name + ");"
        let route =
            `app.` + routing.method.toLowerCase() + `('` + routing.path + `', acl(routing.policies, routing.token), multipart, (req, res) => {`
            + routing.name + `(req)`
                + `.then(response => { res.json(response) })`
                + `.catch(error => {`
                    + `if(error.name !== 'HttpError') console.error(error);`
                    + `if(error.HttpStatus) return res.status(error.HttpStatus).send(error.message);` 
                    + `return res.status(400).send();`
                + `})`
            + `});`
        eval(requireCtrl);
        eval(route);
    });


    // ***** 404 Not Found *****
    app.all('*', function (req, res) { res.sendStatus(404) });
}