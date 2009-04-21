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
            // TODO 
            select: "none" // jplex.components.Datatable.SELECT_NONE
        },
        events: {
            onRowSelectionEvent: Prototype.emptyFunction,
            onRowDoubleClickEvent: Prototype.emptyFunction
        },
        defaultContainer: "table"
    },

    initialize: function($super, element, datasource, columns, config) {
        $super(element, config);

        this.columns = columns;
        this.datasource = datasource;

        datasource.config.process = this.populate.bind(this);

        this.render();
        this.reloadData();

    },

    render: function() {
        //this.component.setStyle({width:"500px"});
        this.component.addClassName("jplex-datatable");
        this._headers = new Element('tr');
        this.component.insert(this._headers.wrap('thead'));
        this.columns.each(function(s, i) {
            var th = new Element("th", { id: this.UID + "-h" + i }).update(s.label);
            th.store("info", s);
            th.store("column", i);
            this._headers.insert(th);
        }, this);
        this.component.insert(this._body = new Element('tbody'));
    },

    populate: function(data) {
        this.data = data;

        var selectHandler = this.didSelectRow.bind(this);
        var doubleClickHandler = this.didDoubleClickOnRow.bind(this);
        var mouseOverHandler = this.didStartHoverOnRow.bind(this);
        var mouseOutHandler = this.didEndHoverOnRow.bind(this);
        data.each(function(g, i) {

            var row = new Element('tr').addClassName(i % 2 === 0 ? 'even' : 'odd').addClassName("selectable");
            row.store("row", i);
            row.store("selected", false);
            this._body.insert(row);

            this.columns.each(function(c, j) {
                var col = new Element('td').update(g[this.columns[j].key]);
                if (j == this.columns.length - 1) {
                    col.addClassName("last");
                }
                col.store("row", i);
                col.store("col", j);
                row.insert(col);
            }, this);


            row.observe("click", selectHandler);
            row.observe("dblclick", doubleClickHandler);
            row.observe("mouseover", mouseOverHandler);
            row.observe("mouseout", mouseOutHandler);
        }.bind(this), "");
    },

    didStartHoverOnRow: function(e) {
        var row = e.element().up('tr');
        if (row !== null && !row.retrieve("selected")) {
            row.addClassName("hover");
        }
    },

    didEndHoverOnRow: function(e) {
        var row = e.element().up('tr');
        if (row !== null) {
            row.removeClassName("hover");
        }
    },

    didDoubleClickOnRow: function(e) {
        var row = e.findElement('tr');
        var n, col, colInfo, colIndex, colKey;

        if (!Object.isUndefined(row)) {

            n = row.retrieve("row");
            col = e.findElement('td');
            if(Object.isUndefined(col)) {
                colInfo = null;
            } else {
                colIndex = col.retrieve("col");
                colKey = this.columns[colIndex].key || this.columns[colIndex];
                colInfo = {
                    index: colIndex,
                    key: colKey,
                    data: this.data[n][colKey]
                };
            }

            this.fireEvent("onRowDoubleClickEvent", {
                htmlRow: row,
                row: n,
                data: this.data[n],
                column: colInfo
            });
        }
    },

    didSelectRow: function(e) {
        if(e.detail && e.detail === 2) {
            // Double click
            return;
        }

        var row = e.findElement('tr');
        var n, col, colIndex, colKey, colInfo;

        if (!Object.isUndefined(row)) {
            if (row.retrieve('selected', true)) {
                row.removeClassName('selected');
                row.store('selected', false);
            } else {
                row.addClassName('selected');
                row.store('selected', true);
            }

            n = row.retrieve('row');
            col = e.findElement('td');
            if(Object.isUndefined(col)) {
                colInfo = null;
            } else {
                colIndex = col.retrieve('col');
                colKey = this.columns[colIndex].key || this.columns[colIndex];
                colInfo = {
                    index: colIndex,
                    key: colKey,
                    data: this.data[n][colKey]
                };
            }

            this.fireEvent('onRowSelectionEvent', {
                htmlRow: row,
                row: n,
                data: this.data[n],
                column: colInfo
            });
        }
    },

    reloadData: function() {
        this.datasource.request();
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
    SELECT_NONE: "none",
    SELECT_SINGLE: "single",
    SELECT_MULTIPLE: "multiple"
});
