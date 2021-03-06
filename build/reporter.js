'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _allureJsCommons = require('allure-js-commons');

var _allureJsCommons2 = _interopRequireDefault(_allureJsCommons);

var _allureJsCommonsBeansStep = require('allure-js-commons/beans/step');

var _allureJsCommonsBeansStep2 = _interopRequireDefault(_allureJsCommonsBeansStep);

function isEmpty(object) {
    return !object || _Object$keys(object).length === 0;
}

var LOGGING_HOOKS = ['"before all" hook', '"after all" hook'];

/**
 * Initialize a new `Allure` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

var AllureReporter = (function (_events$EventEmitter) {
    _inherits(AllureReporter, _events$EventEmitter);

    function AllureReporter(baseReporter, config) {
        var _this = this;

        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        _classCallCheck(this, AllureReporter);

        _get(Object.getPrototypeOf(AllureReporter.prototype), 'constructor', this).call(this);

        this.baseReporter = baseReporter;
        this.config = config;
        this.options = options;
        this.allures = {};

        var epilogue = this.baseReporter.epilogue;

        this.on('end', function () {
            epilogue.call(baseReporter);
        });

        this.on('suite:start', function (suite) {
            var allure = _this.getAllure(suite.cid);
            var currentSuite = allure.getCurrentSuite();
            var prefix = currentSuite ? currentSuite.name + ' ' : '';
            allure.startSuite(prefix + suite.title);
        });

        this.on('suite:end', function (suite) {
            _this.getAllure(suite.cid).endSuite();
        });

        this.on('test:start', function (test) {
            var allure = _this.getAllure(test.cid);
            allure.startCase(test.title);

            var currentTest = allure.getCurrentTest();
            currentTest.addParameter('environment-variable', 'capabilities', JSON.stringify(test.runner[test.cid]));
            currentTest.addParameter('environment-variable', 'spec files', JSON.stringify(test.specs));
        });

        this.on('test:pass', function (test) {
            _this.getAllure(test.cid).endCase('passed');
        });

        this.on('test:fail', function (test) {
            var allure = _this.getAllure(test.cid);
            var status = test.err.type === 'AssertionError' ? 'failed' : 'broken';

            if (!allure.getCurrentTest()) {
                allure.startCase(test.title);
            } else {
                allure.getCurrentTest().name = test.title;
            }

            while (allure.getCurrentSuite().currentStep instanceof _allureJsCommonsBeansStep2['default']) {
                allure.endStep(status);
            }

            allure.endCase(status, test.err);
        });

        this.on('test:pending', function (test) {
            _this.getAllure(test.cid).pendingCase(test.title);
        });

        this.on('runner:command', function (command) {
            var allure = _this.getAllure(command.cid);

            if (!_this.isAnyTestRunning(allure)) {
                return;
            }

            allure.startStep(command.method + ' ' + command.uri.path);

            if (!isEmpty(command.data)) {
                _this.dumpJSON(allure, 'Request', command.data);
            }
        });

        this.on('runner:result', function (command) {
            var allure = _this.getAllure(command.cid);

            if (!_this.isAnyTestRunning(allure)) {
                return;
            }

            if (command.requestOptions.uri.path.match(/\/wd\/hub\/session\/[^/]*\/screenshot/)) {
                allure.addAttachment('Screenshot', new Buffer(command.body.value, 'base64'));
            } else {
                _this.dumpJSON(allure, 'Response', command.body);
            }

            allure.endStep('passed');
        });

        this.on('hook:start', function (hook) {
            var allure = _this.getAllure(hook.cid);

            if (!allure.getCurrentSuite() || LOGGING_HOOKS.indexOf(hook.title) === -1) {
                return;
            }

            allure.startCase(hook.title);
        });

        this.on('hook:end', function (hook) {
            var allure = _this.getAllure(hook.cid);

            if (!allure.getCurrentSuite() || LOGGING_HOOKS.indexOf(hook.title) === -1) {
                return;
            }

            allure.endCase('passed');

            if (allure.getCurrentTest().steps.length === 0) {
                allure.getCurrentSuite().testcases.pop();
            }
        });
    }

    _createClass(AllureReporter, [{
        key: 'getAllure',
        value: function getAllure(cid) {
            if (this.allures[cid]) {
                return this.allures[cid];
            }

            var allure = new _allureJsCommons2['default']();
            allure.setOptions({ targetDir: this.options.outputDir || 'allure-results' });
            this.allures[cid] = allure;
            return this.allures[cid];
        }
    }, {
        key: 'isAnyTestRunning',
        value: function isAnyTestRunning(allure) {
            return allure.getCurrentSuite() && allure.getCurrentTest();
        }
    }, {
        key: 'dumpJSON',
        value: function dumpJSON(allure, name, json) {
            allure.addAttachment(name, JSON.stringify(json, null, '    '), 'application/json');
        }
    }]);

    return AllureReporter;
})(_events2['default'].EventEmitter);

AllureReporter.reporterName = 'HotAllureReporter';
exports['default'] = AllureReporter;
module.exports = exports['default'];
