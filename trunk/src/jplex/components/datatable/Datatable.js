jPlex.include("jplex.common.DataSource");

/**
 * My Class description
 * @class Datatable
 * @extends  jplex.common.Component
 * @param {String|Element} element ID string or HTML element for the component
 * @param {DataSource} datasource Instance of jplex.common.DataSource used to populate the table
 * @param {Array} columns Array of strings, headers of each table column
 * @param {Object} config Configuration parameters
 * @constructor
 */
jPlex.provide("jplex.components.Datatable", "jplex.common.Component", {

    _definition: {
        name: "Datatable",
        defaultConfig: {
            
        },
        events: {},
        defaultContainer: "table"
    },

    initialize: function($super, element, datasource, columns, config) {
        $super(element, config);

        this.columns = columns;
        this.datasource = datasource;

        datasource.config.process = this.populate.bind(this);
        
        this.render();
        datasource.request();

    },

    render: function() {
        //this.component.setStyle({width:"500px"});
        this._headers = new Element('tr');
        this.component.insert(this._headers.wrap('thead'));
        this.columns.each(function(s, i) {
            var th = new Element("th", { id: this.UID+"-h"+i }).update(s.label);
            th.store("info", s);
            th.store("column", i);
            this._headers.insert(th);
        }, this);
        this.component.insert(this._body = new Element('tbody'));
    },

    populate: function(data) {

        data.each(function(g) {

            var row = new Element('tr');
            this._body.insert(row);

            this.columns.each(function(c, i) {
                var col = new Element('td').update(g[this.columns[i].key]);
                row.insert(col);
            }, this);
        }.bind(this), "");
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
