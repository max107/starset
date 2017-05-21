let glob = require('glob'),
    async = require('async'),
    fs = require('fs'),
    path = require('path');

let readFile = (path, done) => fs.readFile(path, 'utf8', done);

module.exports = (referenceDir, targetDir, done) => {
    let compareFile = (file, done) => {
        let referenceFile = path.join(referenceDir, file);
        let targetFile = path.join(targetDir, file);

        async.map([referenceFile, targetFile], readFile, (err, results) => {
            if (err) {
                return done(err);
            }

            done(null, results[0] === results[1]);
        });
    };

    glob('**/*', { cwd: referenceDir, nodir: true }, (err, files) => {
        if (err) {
            return done(err);
        }

        async.map(files, compareFile, (err, results) => {
            if (err) {
                return done(err);
            }

            done(null, !results.some(result => !result));
        });
    });
};
