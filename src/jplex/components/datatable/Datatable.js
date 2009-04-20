/**
 * My Class description
 * @class Datatable
 * @extends  jplex.common.Component
 * @param {String|Element} element ID string or HTML element for the component
 * @param {Object} config Configuration parameters
 * @constructor
 */
jPlex.provide("jplex.components.Datatable", "jplex.common.Component", {

    _definition: {
        name: "Datatable",
        defaultConfig: {
            datasource:
        },
        events: {},
        defaultContainer: "table"
    },

    initialize: function($super, element, config) {
        $super(element, config);

    }


    //---------- Private methods ----------

    // _myPrivateMethod: function() {},


    //---------- Private properties ----------

    /**
     * @property _myPrivateProperty
     * @type Object
     * @private
     */

});

//---------- Static properties ----------

jPlex.extend('jplex.components.Datatable', {

});
