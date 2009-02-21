// script.aculo.us unittest.js v1.8.1, Thu Jan 03 22:07:12 -0500 2008

// Copyright (c) 2005-2007 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
//           (c) 2005-2007 Jon Tirsen (http://www.tirsen.com)
//           (c) 2005-2007 Michael Schuerig (http://www.schuerig.de/michael/)
//
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/

// experimental, Firefox-only
Event.simulateMouse = function(element, eventName) {
    var options = Object.extend({
        pointerX: 0,
        pointerY: 0,
        buttons:  0,
        ctrlKey:  false,
        altKey:   false,
        shiftKey: false,
        metaKey:  false
    }, arguments[2] || {});
    var relatedTarget = $(element);
    var customEvent;
    var domImpl;
    eventName = eventName.toLowerCase();
    if (Object.isFunction(document.createEvent)) {
        domImpl = true;
        customEvent = document.createEvent("MouseEvents");

        //Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
        if (customEvent.initMouseEvent) {
            customEvent.initMouseEvent(eventName, true, true, window,
                    options.buttons, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                    options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, 0, relatedTarget);
        } else { //Safari

            //the closest thing available in Safari 2.x is UIEvents
            customEvent = document.createEvent("UIEvents");
            customEvent.initEvent(eventName, true, true);
            customEvent.view = window;
            customEvent.detail = options.buttons;
            customEvent.screenX = options.pointerX;
            customEvent.screenY = options.pointerY;
            customEvent.clientX = options.pointerX;
            customEvent.clientY = options.pointerY;
            customEvent.ctrlKey = options.ctrlKey;
            customEvent.altKey = options.altKey;
            customEvent.metaKey = options.metaKey;
            customEvent.shiftKey = options.shiftKey;
            customEvent.button = 0;
            customEvent.relatedTarget = relatedTarget;
        }

        /*
         * Check to see if relatedTarget has been assigned. Firefox
         * versions less than 2.0 don't allow it to be assigned via
         * initMouseEvent() and the property is readonly after event
         * creation, so in order to keep YAHOO.util.getRelatedTarget()
         * working, assign to the IE proprietary toElement property
         * for mouseout event and fromElement property for mouseover
         * event.
         */
        if (relatedTarget && !customEvent.relatedTarget) {
            if (eventName == "mouseout") {
                customEvent.toElement = relatedTarget;
            } else if (eventName == "mouseover") {
                customEvent.fromElement = relatedTarget;
            }
        }


    } else if (document.createEventObject) { //IE
        domImpl = false;
        //create an IE event object
        customEvent = document.createEventObject();

        //assign available properties

        customEvent.bubbles = true;
        customEvent.cancelable = true;
        customEvent.view = window;
        customEvent.detail = options.buttons;
        customEvent.screenX = options.pointerX;
        customEvent.screenY = options.pointerY;
        customEvent.clientX = options.pointerX;
        customEvent.clientY = options.pointerY;
        customEvent.ctrlKey = options.ctrlKey;
        customEvent.altKey = options.altKey;
        customEvent.metaKey = options.metaKey;
        customEvent.shiftKey = options.shiftKey;

        //fix button property for IE's wacky implementation
        switch (options.buttons) {
            case 0:
                customEvent.button = 1;
                break;
            case 1:
                customEvent.button = 4;
                break;
            case 2:
            //leave as is
                break;
            default:
                customEvent.button = 0;
        }

        /*
         * Have to use relatedTarget because IE won't allow assignment
         * to toElement or fromElement on generic events. This keeps
         * YAHOO.util.customEvent.getRelatedTarget() functional.
         */
        customEvent.relatedTarget = relatedTarget;
    } else {
        throw new Error("simulateMouseEvent(): No event simulation framework present.");
    }
    
    if (this.step)
        alert('[' + new Date().getTime().toString() + '] ' + eventName + '/' + Test.Unit.inspect(options));

    //fire the event
    if (domImpl)
        relatedTarget.dispatchEvent(customEvent);
    else
        relatedTarget.fireEvent("on" + eventName, customEvent);
    
};

// Note: Due to a fix in Firefox 1.0.5/6 that probably fixed "too much", this doesn't work in 1.0.6 or DP2.
// You need to downgrade to 1.0.4 for now to get this working
// See https://bugzilla.mozilla.org/show_bug.cgi?id=289940 for the fix that fixed too much
Event.simulateKey = function(element, eventName) {
    var options = Object.extend({
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        keyCode: 0,
        charCode: 0
    }, arguments[2] || {});
    element = $(element);
    eventName = eventName.toLowerCase();
    //try to create a mouse event
    var customEvent /*:MouseEvent*/ = null;
            
    //check for DOM-compliant browsers first
    if (Object.isFunction(document.createEvent)){
        try {
            //try to create key event
            customEvent = document.createEvent("KeyEvents");
                
            /*
             * Interesting problem: Firefox implemented a non-standard
             * version of initKeyEvent() based on DOM Level 2 specs.
             * Key event was removed from DOM Level 2 and re-introduced
             * in DOM Level 3 with a different interface. Firefox is the
             * only browser with any implementation of Key Events, so for
             * now, assume it's Firefox if the above line doesn't error.
             */
            customEvent.initKeyEvent(eventName, true, true, window, options.ctrlKey,
                options.altKey, options.shiftKey, options.metaKey, options.keyCode, options.charCode);       
                
        } catch (ex /*:Error*/){

            /*
             * If it got here, that means key events aren't officially supported. 
             * Safari/WebKit is a real problem now. WebKit 522 won't let you
             * set keyCode, charCode, or other properties if you use a
             * UIEvent, so we first must try to create a generic event. The
             * fun part is that this will throw an error on Safari 2.x. The
             * end result is that we need another try...catch statement just to
             * deal with this mess.
             */
            try {

                //try to create generic event - will fail in Safari 2.x
                customEvent = document.createEvent("Events");

            } catch (err /*:Error*/){

                //the above failed, so create a UIEvent for Safari 2.x
                customEvent = document.createEvent("UIEvents");

            } finally {

                customEvent.initEvent(eventName, true, true);
    
                //initialize
                customEvent.view = window;
                customEvent.altKey = options.altKey;
                customEvent.ctrlKey = options.ctrlKey;
                customEvent.shiftKey = options.shiftKey;
                customEvent.metaKey = options.metaKey;
                customEvent.keyCode = options.keyCode;
                customEvent.charCode = options.charCode;
          
            }          
             
        }
            
        //fire the event
        element.dispatchEvent(customEvent);

    } else if (document.createEventObject) { //IE
        
        //create an IE event object
        customEvent = document.createEventObject();
            
        //assign available properties
        customEvent.bubbles = true;
        customEvent.cancelable = true;
        customEvent.view = window;
        customEvent.ctrlKey = options.ctrlKey;
        customEvent.altKey = options.altKey;
        customEvent.shiftKey = options.shiftKey;
        customEvent.metaKey = options.metaKey;
            
        /*
         * IE doesn't support charCode explicitly. CharCode should
         * take precedence over any keyCode value for accurate
         * representation.
         */
        customEvent.keyCode = (options.charCode > 0) ? options.charCode : options.keyCode;
            
        //fire the event
        element.fireEvent("on" + eventName, customEvent);  
                    
    } else {
        throw new Error("simulateKeyEvent(): No event simulation framework present.");
    }
};

Event.simulateKeys = function(element, command) {
    for (var i = 0; i < command.length; i++) {
        Event.simulateKey(element, 'keypress', {charCode:command.charCodeAt(i)});
    }
};

var Test = {}
Test.Unit = {};
                      
Test.Unit.Id = 0;   
Test.Unit.FinishedJobs = [];
// security exception workaround
Test.Unit.inspect = Object.inspect;

Test.Unit.Logger = Class.create();
Test.Unit.Logger.prototype.id = 0;
Test.Unit.Logger.prototype = {
    initialize: function(log) {
        this.log = $(log);
        this.logid = Test.Unit.Id-1;
        if (this.log) {
            this._createLogTable();
        }
    },
    start: function(testName) {
        if (!this.log) return;
        this.testName = testName;
        this.lastLogLine = document.createElement('tr');
        this.statusCell = document.createElement('td');
        this.nameCell = document.createElement('td');
        this.nameCell.className = "nameCell";
        this.nameCell.appendChild(document.createTextNode(testName));
        this.messageCell = document.createElement('td');
        this.lastLogLine.appendChild(this.statusCell);
        this.lastLogLine.appendChild(this.nameCell);
        this.lastLogLine.appendChild(this.messageCell);
        this.loglines.appendChild(this.lastLogLine);
    },
    finish: function(status, summary) {
        if (!this.log) return;
        this.lastLogLine.className = status;
        this.statusCell.innerHTML = status;
        this.messageCell.innerHTML = this._toHTML(summary);
        this.addLinksToResults();
    },
    message: function(message) {
        if (!this.log) return;
        this.messageCell.innerHTML = this._toHTML(message);
    },
    summary: function(summary) {
        if (!this.log) return;
        this.logsummary.innerHTML = this._toHTML(summary);
    },
    _createLogTable: function() {
        this.log.addClassName('log'); 
        this.log.innerHTML =
        '<div id="logsummary'+this.logid+'" class="logsummary"></div>' +
        '<table id="logtable'+this.logid+'" class="logtable">' +
        '<thead><tr><th>Status</th><th>Test</th><th>Message</th></tr></thead>' +
        '<tbody id="loglines'+this.logid+'"></tbody>' +
        '</table>';
        this.logsummary = $('logsummary'+this.logid);
        this.loglines = $('loglines'+this.logid);
    },
    _toHTML: function(txt) {
        return txt.escapeHTML().replace(/\n/g, "<br/>");
    },
    addLinksToResults: function() {
        $$("#logtable"+this.logid+" tr.failed .nameCell").each(function(td) { // todo: limit to children of this.log
            td.title = "Run only this test"
            Event.observe(td, 'click', function() {
                window.location.search = "?tests=" + td.innerHTML;
            });
        });
        $$("#logtable"+this.logid+" tr.passed .nameCell").each(function(td) { // todo: limit to children of this.log
            td.title = "Run all tests"
            Event.observe(td, 'click', function() {
                window.location.search = "";
            });
        });
    }
}

Test.Unit.Runner = Class.create();
Test.Unit.Runner.prototype = {
    initialize: function(testcases) {
        this.options = Object.extend({
            testLog: 'testlog'
        }, arguments[1] || {});
        this.id = Test.Unit.Id++;
        this.options.testLog = this.options.testLog+this.id;
        this.options.resultsURL = this.parseResultsURLQueryParameter();
        this.options.tests = this.parseTestsQueryParameter();
        if (this.options.testLog) {
            var log = $(this.options.testLog);
            if(!log) {
                log = new Element('div');
                document.body.appendChild(log);
            }
            this.options.testLog = log;
        }
        if (this.options.tests) {
            this.tests = [];
            for (var i = 0; i < this.options.tests.length; i++) {
                if (/^test/.test(this.options.tests[i])) {
                    this.tests.push(new Test.Unit.Testcase(this.options.tests[i], testcases[this.options.tests[i]], testcases["setup"], testcases["teardown"]));
                }
            }
        } else {
            if (this.options.test) {
                this.tests = [new Test.Unit.Testcase(this.options.test, testcases[this.options.test], testcases["setup"], testcases["teardown"])];
            } else {
                this.tests = [];
                for (var testcase in testcases) {
                    if (/^test/.test(testcase)) {
                        this.tests.push(
                                new Test.Unit.Testcase(
                                        this.options.context ? ' -> ' + this.options.titles[testcase] : testcase,
                                        testcases[testcase], testcases["setup"], testcases["teardown"]
                                        ));
                    }
                }
            }
        }
        this.currentTest = 0;
        this.logger = new Test.Unit.Logger(this.options.testLog);
        setTimeout(this.runTests.bind(this), 1000);
    },
    parseResultsURLQueryParameter: function() {
        return window.location.search.parseQuery()["resultsURL"];
    },
    parseTestsQueryParameter: function() {
        if (window.location.search.parseQuery()["tests"]) {
            return window.location.search.parseQuery()["tests"].split(',');
        }
        ;
    },
    // Returns:
    //  "ERROR" if there was an error,
    //  "FAILURE" if there was a failure, or
    //  "SUCCESS" if there was neither
    getResult: function() {
        var hasFailure = false;
        for (var i = 0; i < this.tests.length; i++) {
            if (this.tests[i].errors > 0) {
                return "ERROR";
            }
            if (this.tests[i].failures > 0) {
                hasFailure = true;
            }
        }
        if (hasFailure) {
            return "FAILURE";
        } else {
            return "SUCCESS";
        }
    },
    postResults: function() {
        if (this.options.resultsURL) {
            new Ajax.Request(this.options.resultsURL,
            { method: 'get', parameters: 'result=' + this.getResult(), asynchronous: false });
        }               
        Test.Unit.FinishedJobs[this.id] = true;
        if (this.options.onFinish) {
             this.options.onFinish();
        }
    },
    runTests: function() {
        var test = this.tests[this.currentTest];
        if (!test) {
            // finished!
            this.postResults();
            this.logger.summary(this.summary());
            return;
        }
        if (!test.isWaiting) {
            this.logger.start(test.name);
        }
        test.run();
        if (test.isWaiting) {
            this.logger.message("Waiting for " + test.timeToWait + "ms");
            setTimeout(this.runTests.bind(this), test.timeToWait || 1000);
        } else {
            this.logger.finish(test.status(), test.summary());
            this.currentTest++;
            // tail recursive, hopefully the browser will skip the stackframe
            this.runTests();
        }
    },
    summary: function() {
        var assertions = 0;
        var failures = 0;
        var errors = 0;
        var messages = [];
        for (var i = 0; i < this.tests.length; i++) {
            assertions += this.tests[i].assertions;
            failures += this.tests[i].failures;
            errors += this.tests[i].errors;
        }
        return (
                (this.options.context ? this.options.context + ': ' : '') +
                this.tests.length + " tests, " +
                assertions + " assertions, " +
                failures + " failures, " +
                errors + " errors");
    }
}

Test.Unit.Assertions = Class.create();
Test.Unit.Assertions.prototype = {
    initialize: function() {
        this.assertions = 0;
        this.failures = 0;
        this.errors = 0;
        this.messages = [];
    },
    summary: function() {
        return (
                this.assertions + " assertions, " +
                this.failures + " failures, " +
                this.errors + " errors" + "\n" +
                this.messages.join("\n"));
    },
    pass: function() {
        this.assertions++;
    },
    fail: function(message) {
        this.failures++;
        this.messages.push("Failure: " + message);
    },
    info: function(message) {
        this.messages.push("Info: " + message);
    },
    error: function(error) {
        this.errors++;
        this.messages.push(error.name + ": " + error.message + "(" + Test.Unit.inspect(error) + ")");
    },
    status: function() {
        if (this.failures > 0) return 'failed';
        if (this.errors > 0) return 'error';
        return 'passed';
    },
    assert: function(expression) {
        var message = arguments[1] || 'assert: got "' + Test.Unit.inspect(expression) + '"';
        try {
            expression ? this.pass() :
            this.fail(message);
        }
        catch(e) {
            this.error(e);
        }
    },
    assertEqual: function(expected, actual) {
        var message = arguments[2] || "assertEqual";
        try {
            (expected == actual) ? this.pass() :
            this.fail(message + ': expected "' + Test.Unit.inspect(expected) +
                      '", actual "' + Test.Unit.inspect(actual) + '"');
        }
        catch(e) {
            this.error(e);
        }
    },
    assertInspect: function(expected, actual) {
        var message = arguments[2] || "assertInspect";
        try {
            (expected == actual.inspect()) ? this.pass() :
            this.fail(message + ': expected "' + Test.Unit.inspect(expected) +
                      '", actual "' + Test.Unit.inspect(actual) + '"');
        }
        catch(e) {
            this.error(e);
        }
    },
    assertEnumEqual: function(expected, actual) {
        var message = arguments[2] || "assertEnumEqual";
        try {
            $A(expected).length == $A(actual).length &&
            expected.zip(actual).all(function(pair) {
                return pair[0] == pair[1]
            }) ?
            this.pass() : this.fail(message + ': expected ' + Test.Unit.inspect(expected) +
                                    ', actual ' + Test.Unit.inspect(actual));
        }
        catch(e) {
            this.error(e);
        }
    },
    assertNotEqual: function(expected, actual) {
        var message = arguments[2] || "assertNotEqual";
        try {
            (expected != actual) ? this.pass() :
            this.fail(message + ': got "' + Test.Unit.inspect(actual) + '"');
        }
        catch(e) {
            this.error(e);
        }
    },
    assertIdentical: function(expected, actual) {
        var message = arguments[2] || "assertIdentical";
        try {
            (expected === actual) ? this.pass() :
            this.fail(message + ': expected "' + Test.Unit.inspect(expected) +
                      '", actual "' + Test.Unit.inspect(actual) + '"');
        }
        catch(e) {
            this.error(e);
        }
    },
    assertNotIdentical: function(expected, actual) {
        var message = arguments[2] || "assertNotIdentical";
        try {
            !(expected === actual) ? this.pass() :
            this.fail(message + ': expected "' + Test.Unit.inspect(expected) +
                      '", actual "' + Test.Unit.inspect(actual) + '"');
        }
        catch(e) {
            this.error(e);
        }
    },
    assertNull: function(obj) {
        var message = arguments[1] || 'assertNull'
        try {
            (obj == null) ? this.pass() :
            this.fail(message + ': got "' + Test.Unit.inspect(obj) + '"');
        }
        catch(e) {
            this.error(e);
        }
    },
    assertMatch: function(expected, actual) {
        var message = arguments[2] || 'assertMatch';
        var regex = new RegExp(expected);
        try {
            (regex.exec(actual)) ? this.pass() :
            this.fail(message + ' : regex: "' + Test.Unit.inspect(expected) + ' did not match: ' + Test.Unit.inspect(actual) + '"');
        }
        catch(e) {
            this.error(e);
        }
    },
    assertHidden: function(element) {
        var message = arguments[1] || 'assertHidden';
        this.assertEqual("none", element.style.display, message);
    },
    assertNotNull: function(object) {
        var message = arguments[1] || 'assertNotNull';
        this.assert(object != null, message);
    },
    assertType: function(expected, actual) {
        var message = arguments[2] || 'assertType';
        try {
            (actual.constructor == expected) ? this.pass() :
            this.fail(message + ': expected "' + Test.Unit.inspect(expected) +
                      '", actual "' + (actual.constructor) + '"');
        }
        catch(e) {
            this.error(e);
        }
    },
    assertNotOfType: function(expected, actual) {
        var message = arguments[2] || 'assertNotOfType';
        try {
            (actual.constructor != expected) ? this.pass() :
            this.fail(message + ': expected "' + Test.Unit.inspect(expected) +
                      '", actual "' + (actual.constructor) + '"');
        }
        catch(e) {
            this.error(e);
        }
    },
    assertInstanceOf: function(expected, actual) {
        var message = arguments[2] || 'assertInstanceOf';
        try {
            (actual instanceof expected) ? this.pass() :
            this.fail(message + ": object was not an instance of the expected type");
        }
        catch(e) {
            this.error(e);
        }
    },
    assertNotInstanceOf: function(expected, actual) {
        var message = arguments[2] || 'assertNotInstanceOf';
        try {
            !(actual instanceof expected) ? this.pass() :
            this.fail(message + ": object was an instance of the not expected type");
        }
        catch(e) {
            this.error(e);
        }
    },
    assertRespondsTo: function(method, obj) {
        var message = arguments[2] || 'assertRespondsTo';
        try {
            (obj[method] && typeof obj[method] == 'function') ? this.pass() :
            this.fail(message + ": object doesn't respond to [" + method + "]");
        }
        catch(e) {
            this.error(e);
        }
    },
    assertReturnsTrue: function(method, obj) {
        var message = arguments[2] || 'assertReturnsTrue';
        try {
            var m = obj[method];
            if (!m) m = obj['is' + method.charAt(0).toUpperCase() + method.slice(1)];
            m() ? this.pass() :
            this.fail(message + ": method returned false");
        }
        catch(e) {
            this.error(e);
        }
    },
    assertReturnsFalse: function(method, obj) {
        var message = arguments[2] || 'assertReturnsFalse';
        try {
            var m = obj[method];
            if (!m) m = obj['is' + method.charAt(0).toUpperCase() + method.slice(1)];
            !m() ? this.pass() :
            this.fail(message + ": method returned true");
        }
        catch(e) {
            this.error(e);
        }
    },
    assertRaise: function(exceptionName, method) {
        var message = arguments[2] || 'assertRaise';
        try {
            method();
            this.fail(message + ": exception expected but none was raised");
        }
        catch(e) {
            ((exceptionName == null) || (e.name == exceptionName)) ? this.pass() : this.error(e);
        }
    },
    assertElementsMatch: function() {
        var expressions = $A(arguments), elements = $A(expressions.shift());
        if (elements.length != expressions.length) {
            this.fail('assertElementsMatch: size mismatch: ' + elements.length + ' elements, ' + expressions.length + ' expressions');
            return false;
        }
        elements.zip(expressions).all(function(pair, index) {
            var element = $(pair.first()), expression = pair.last();
            if (element.match(expression)) return true;
            this.fail('assertElementsMatch: (in index ' + index + ') expected ' + expression.inspect() + ' but got ' + element.inspect());
        }.bind(this)) && this.pass();
    },
    assertElementMatches: function(element, expression) {
        this.assertElementsMatch([element], expression);
    },
    benchmark: function(operation, iterations) {
        var startAt = new Date();
        (iterations || 1).times(operation);
        var timeTaken = ((new Date()) - startAt);
        this.info((arguments[2] || 'Operation') + ' finished ' +
                  iterations + ' iterations in ' + (timeTaken / 1000) + 's');
        return timeTaken;
    },
    _isVisible: function(element) {
        element = $(element);
        if (!element.parentNode) return true;
        this.assertNotNull(element);
        if (element.style && Element.getStyle(element, 'display') == 'none')
            return false;

        return this._isVisible(element.parentNode);
    },
    assertNotVisible: function(element) {
        this.assert(!this._isVisible(element), Test.Unit.inspect(element) + " was not hidden and didn't have a hidden parent either. " + ("" || arguments[1]));
    },
    assertVisible: function(element) {
        this.assert(this._isVisible(element), Test.Unit.inspect(element) + " was not visible. " + ("" || arguments[1]));
    },
    benchmark: function(operation, iterations) {
        var startAt = new Date();
        (iterations || 1).times(operation);
        var timeTaken = ((new Date()) - startAt);
        this.info((arguments[2] || 'Operation') + ' finished ' +
                  iterations + ' iterations in ' + (timeTaken / 1000) + 's');
        return timeTaken;
    }
}

Test.Unit.Testcase = Class.create();
Object.extend(Object.extend(Test.Unit.Testcase.prototype, Test.Unit.Assertions.prototype), {
    initialize: function(name, test, setup, teardown) {
        Test.Unit.Assertions.prototype.initialize.bind(this)();
        this.name = name;

        if (typeof test == 'string') {
            test = test.gsub(/(\.should[^\(]+\()/, '#{0}this,');
            test = test.gsub(/(\.should[^\(]+)\(this,\)/, '#{1}(this)');
            this.test = function() {
                eval('with(this){' + test + '}');
            }
        } else {
            this.test = test || function() {
            };
        }

        this.setup = setup || function() {
        };
        this.teardown = teardown || function() {
        };
        this.isWaiting = false;
        this.timeToWait = 1000;
    },
    wait: function(time, nextPart) {
        this.isWaiting = true;
        this.test = nextPart;
        this.timeToWait = time;
    },
    run: function() {
        try {
            try {
                if (!this.isWaiting) this.setup.bind(this)();
                this.isWaiting = false;
                this.test.bind(this)();
            } finally {
                if (!this.isWaiting) {
                    this.teardown.bind(this)();
                }
            }
        }
        catch(e) {
            this.error(e);
        }
    }
});

// *EXPERIMENTAL* BDD-style testing to please non-technical folk
// This draws many ideas from RSpec http://rspec.rubyforge.org/

Test.setupBDDExtensionMethods = function() {
    var METHODMAP = {
        shouldEqual:     'assertEqual',
        shouldNotEqual:  'assertNotEqual',
        shouldEqualEnum: 'assertEnumEqual',
        shouldBeA:       'assertType',
        shouldNotBeA:    'assertNotOfType',
        shouldBeAn:      'assertType',
        shouldNotBeAn:   'assertNotOfType',
        shouldBeNull:    'assertNull',
        shouldNotBeNull: 'assertNotNull',

        shouldBe:        'assertReturnsTrue',
        shouldNotBe:     'assertReturnsFalse',
        shouldRespondTo: 'assertRespondsTo'
    };
    var makeAssertion = function(assertion, args, object) {
        this[assertion].apply(this, (args || []).concat([object]));
    }

    Test.BDDMethods = {};
    $H(METHODMAP).each(function(pair) {
        Test.BDDMethods[pair.key] = function() {
            var args = $A(arguments);
            var scope = args.shift();
            makeAssertion.apply(scope, [pair.value, args, this]);
        };
    });

    [Array.prototype, String.prototype, Number.prototype, Boolean.prototype].each(
            function(p) {
                Object.extend(p, Test.BDDMethods)
            }
            );
}

Test.context = function(name, spec, log) {
    Test.setupBDDExtensionMethods();

    var compiledSpec = {};
    var titles = {};
    for (specName in spec) {
        switch (specName) {
            case "setup":
            case "teardown":
                compiledSpec[specName] = spec[specName];
                break;
            default:
                var testName = 'test' + specName.gsub(/\s+/, '-').camelize();
                var body = spec[specName].toString().split('\n').slice(1);
                if (/^\{/.test(body[0])) body = body.slice(1);
                body.pop();
                body = body.map(function(statement) {
                    return statement.strip()
                });
                compiledSpec[testName] = body.join('\n');
                titles[testName] = specName;
        }
    }
    new Test.Unit.Runner(compiledSpec, { titles: titles, testLog: log || 'testlog', context: name });
};