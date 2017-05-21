let expect = require('chai').expect,
    webpack = require('webpack'),
    clean = require('rimraf'),
    getSubDirsSync = require('./utils/get-sub-dirs-sync'),
    directoryContains = require('./utils/directory-contains'),
    successCases = getSubDirsSync(__dirname + '/success-cases'),
    errorCases = getSubDirsSync(__dirname + '/error-cases');

describe('Success cases', () => {
    successCases.forEach(successCase => {
        describe(successCase, () => {
            beforeEach(done => {
                clean(__dirname + '/success-cases/' + successCase + '/actual-output', done);
            });

            it('generates the expected HTML files', done => {
                let webpackConfig = require('./success-cases/' + successCase + '/webpack.config.js');

                webpack(webpackConfig, (err, stats) => {
                    if (err) {
                        return done(err);
                    }

                    let caseDir = __dirname + '/success-cases/' + successCase;
                    let expectedDir = caseDir + '/expected-output/';
                    let actualDir = caseDir + '/actual-output/';

                    directoryContains(expectedDir, actualDir, (err, result) => {
                        if (err) {
                            return done(err);
                        }

                        expect(result).to.be.ok;
                        done();
                    });
                });
            });

        });

    });

});

describe('Error cases', () => {
    errorCases.forEach((errorCase) => {
        describe(errorCase, () => {
            beforeEach(done => {
                clean(__dirname + '/error-cases/' + errorCase + '/actual-output', done);
            });

            it('generates the expected error', done => {
                let webpackConfig = require('./error-cases/' + errorCase + '/webpack.config.js'),
                    expectedError = require('./error-cases/' + errorCase + '/expected-error.js');

                webpack(webpackConfig, (err, stats) => {
                    let actualError = stats.compilation.errors[0].toString().split('\n')[0];
                    expect(actualError).to.include(expectedError);
                    done();
                });
            });
        });
    });
});
