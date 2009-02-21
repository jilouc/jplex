/**
 * jPlex way to extend the marvelous Prototype library 
 * @module XPrototype
 * @namespace jplex.xprototype
 */

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
            navigator.userAgent.indexOf("MSIE 6.0") != -1
});

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
        if(console && console.error)
            console.error("[%s] %s", e.name, e.message);
    },
    /**
     * Logs a warning inside firebug
     * @param {String} e The message       
     */
    warning: function(e) {
        if(console && console.warning)
            console.warning(e);
    },                
    /**
     * Logs a message inside firebug
     * @param {String} e The message       
     */
    log: function(e) {
        if(console && console.log)
            console.log(e);
    }
}