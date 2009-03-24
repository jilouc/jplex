/**
 * @class Ajax.Base 
 */

/**
 * Default Method applied to Ajax.Request
 * @static
 * @property defaultMethod
 */
Ajax.Base.defaultMethod = 'post';
Ajax.Base.prototype.initialize = Ajax.Base.prototype.initialize.wrap(function(proceed, options) {
    if (!options.method)
        options.method = Ajax.Base.defaultMethod;
    proceed(options);
});

/**
 * @class Prototype.Browser
 */
Object.extend(Prototype.Browser, {
    /**
     * True if the web browser is IE6
     * @property IE6
     * @type Boolean
     */
    IE6: Prototype.Browser.IE &&
         navigator.userAgent.indexOf("MSIE 6.0") != -1,

    IE7: Prototype.Browser.IE &&
         navigator.userAgent.indexOf("MSIE 7.0") != -1,

    IE8: Prototype.Browser.IE &&
         navigator.userAgent.indexOf("MSIE 8.0") != -1,

    IElt8: Prototype.Browser.IE6 || Prototype.Browser.IE7
});
var console;

/**
 * Logger class. Is binded with firebug.
 * @static
 * @class Logger
 */
Logger = {
    /**
     * Logs an error inside firebug
     * @param {String} e The message
     */
    error: function(e) {
        if (console && console.error)
            console.error("[%s] %s", e.name, e.message);
    },
    /**
     * Logs a warning inside firebug
     * @param {String} e The message
     */
    warning: function(e) {
        if (console && console.warning)
            console.warning(e);
    },
    /**
     * Logs a message inside firebug
     * @param {String} e The message
     */
    log: function(e) {
        if (console && console.log)
            console.log(e);
    }
}