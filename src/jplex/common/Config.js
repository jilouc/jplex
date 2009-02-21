/**
 * The common configuration object that is used in the Component class    
 * @param {Object} oConfig The configuration object
 * @class Config   
 * @namespace jplex.common
 * @constructor
 */
jPlex.provide('jplex.common.Config', {
    initialize: function( oConfig ) {
        this._oConfig = $H(oConfig); 
    },
    /**
     * Sets the value of the conf. parameter, if the parameter already exists it will be replaced 
     * @param {String} sName parameter's name
     * @param mValue new value
     */
    set: function(sName, mValue) {
        this._oConfig.set(sName, mValue);
    },
    /**
     * Get the value of the conf. parameter
     * @param {String} sName parameter's name
     * @return {Object} parameter's value if it exists, else undefined
     */
    get: function(sName) {
        var res = this._oConfig.get(sName);
        return res;// == undefined ? res : false;
    },
    /**
     * Iterate over the configuration
     * @param {Function} fCallback with a single argument: an object with two properties <em>key</em> and <em>value</em>
     */
    each: function(fCallback) {
        this._oConfig.each(fCallback);
    }
});