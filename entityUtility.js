'use strict';
/* indent: 2, node:true, nomen: true, maxlen: 80, vars: true*/
var scan = require('./modules/scan');
module.exports = {
    setupEntites: function (app, db, security) {
    try
    {

        var build = function(app, model,entityName,  entity){

            var modelLocation =model;
            modelLocation = modelLocation.replace('.//',''); // remove the first directory portion of the name
            var folderList = modelLocation.split('/');
            var folderListLength = folderList.length -1;

            folderList = folderList.slice(0, folderListLength);
            folderList.push(entityName);

            var entityNamespace = folderList.join('.');

            work(app, entityNamespace, entity, '.');
        };

        //http://stackoverflow.com/questions/15459262/is-there-a-way-to-automatically-create-a-javascript-object-by-just-assigning-a-p
        var work = function(obj, node, value, splitter) {
            var segments = node.split(splitter);
            var key = segments.pop();
            var ref = obj;

            while (segments.length > 0) {
                var segment = segments.shift();
                if (typeof ref[segment] != 'object') {
                    ref[segment] = {};
                }
                ref = ref[segment];
            }
            ref[key] = value;
        };

        // https://github.com/focusaurus/express_code_structure/blob/master/app/server.js
        // This will look for model files with a .md.js extension and add them to the app
        scan('./','.md.js', function(err, files){
            files.forEach(function(model){
                var entity = db.import(model);
                build(app, model, entity.name, entity);
            });
        });
    }
    catch(e)
    {
        throw new Error(e);
    }
    }
};
