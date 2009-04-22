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
        this.selectedRows = $A();
        this._minSelectedRow = -1;
        this._maxSelectedRow = -1;

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

        var selectHandler = this._didClickOnRow.bind(this);
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
        var row = e.findElement('tr');
        if (!Object.isUndefined(row)) {
            if (this.cfg("select") !== jplex.components.Datatable.SELECT_NONE &&
                !row.retrieve("selected")) {
                row.addClassName("hover");
            }
            this.fireEvent('onRowStartHoverEvent', this._getRowMetadata(row, e.findElement('td')));
        }
    },

    didEndHoverOnRow: function(e) {
        var row = e.findElement('tr');
        if (!Object.isUndefined(row)) {
            if (this.cfg("select") !== jplex.components.Datatable.SELECT_NONE &&
                !row.retrieve("selected")) {
                row.removeClassName("hover");
            }
            this.fireEvent('onRowEndHoverEvent', this._getRowMetadata(row, e.findElement('td')));
        }
    },

    didDoubleClickOnRow: function(e) {
        var row = e.findElement('tr');

        if (!Object.isUndefined(row)) {

            this._clearTextSelection();

            row.addClassName('selected');
            row.store('selected', true);

            this.fireEvent("onRowDoubleClickEvent", this._getRowMetadata(row, e.findElement('td')));
        }
    },

    _didClickOnRow: function(e) {
        if (e.detail && e.detail === 2) {
            // Double click
            return;
        }

        if (this.cfg("select") == jplex.components.Datatable.SELECT_NONE) {
            return;
        }

        var row = e.findElement('tr');
        var col = e.findElement('td');

        if (this.cfg("select") == jplex.components.Datatable.SELECT_SINGLE) {
            this.selectedRows.each(function(r) {
                if (r !== row) {
                    this.didDeselectRow(r);
                }
            }, this);
            if (!row.retrieve('selected')) {
                this.didSelectRow(row, col);
            } else {
                this.didDeselectRow(row);
            }
        } else if (this.cfg("select") === jplex.components.Datatable.SELECT_MULTIPLE) {

            var shiftKey = e.shiftKey;
            var ctrlKey = e.ctrlKey || ((navigator.userAgent.toLowerCase().indexOf("mac") != -1) && e.metaKey);

            if (shiftKey) {
                var n = row.retrieve('row');
                var range;

                if (n < this._maxSelectedRow) {
                    range = $R(n, this._maxSelectedRow);
                } else if (n > this._minSelectedRow && this._minSelectedRow !== -1) {
                    range = $R(this._minSelectedRow, n);
                } else {
                    range = $R(n, n);
                }
                this.selectedRows.each(function(r) {
                    if (!range.include(r.retrieve('row'))) {
                        this.didDeselectRow(r);
                    }
                }, this);
                range.each(function(r) {
                    this.didSelectRow(r);
                }, this);

            } else {
                if (!ctrlKey) {
                    this.selectedRows.each(function(r) {
                        if (r !== row) {
                            this.didDeselectRow(r);
                        }
                    }, this);
                }
                if (!row.retrieve('selected')) {
                    this.didSelectRow(row, col);
                } else {
                    this.didDeselectRow(row);
                }
            }
        }
        this._clearTextSelection();
    },

    didDeselectRow: function(row) {
        if (Object.isNumber(row)) {
            row = this.rowAtIndex(row);
            if (Object.isUndefined(row)) {
                return;
            }
        }
        row.removeClassName('selected');
        row.store('selected', false);
        this.selectedRows = this.selectedRows.without(row);

        var meta = this._getRowMetadata(row);
        if (this._minSelectedRow == meta.row) {
            this._minSelectedRow = this.selectedRows.min(function(r) {
                return r.retrieve('row');
            });
            if (Object.isUndefined(this._minSelectedRow)) {
                this._minSelectedRow = -1;
            }
        }
        if (this._maxSelectedRow == meta.row) {
            this._maxSelectedRow = this.selectedRows.max(function(r) {
                return r.retrieve('row');
            });
            if (Object.isUndefined(this._maxSelectedRow)) {
                this._maxSelectedRow = -1;
            }
        }

        this.fireEvent('onRowDeselectionEvent', meta);
    }
    ,

    didSelectRow: function(row, col) {
        if (Object.isNumber(row)) {
            row = this.rowAtIndex(row);
            if (Object.isUndefined(row)) {
                return;
            }
        }
        if (row.retrieve('selected')) {
            return;
        }
        row.removeClassName('hover');
        row.addClassName('selected');
        row.store('selected', true);
        this.selectedRows.push(row);

        var meta = this._getRowMetadata(row, col);
        if (this._minSelectedRow == -1 || this._minSelectedRow > meta.row) {
            this._minSelectedRow = meta.row;
        }
        if (this._maxSelectedRow == -1 || this._maxSelectedRow < meta.row) {
            this._maxSelectedRow = meta.row;
        }

        this.fireEvent('onRowSelectionEvent', meta);

    }
    ,

    reloadData: function() {
        this.datasource.request();
    }
    ,

    rowAtIndex: function(i) {
        if (i < 0 || i >= this.data.length) {
            return;
        }
        return this._body.down('tr', i);
    }
    ,


    //---------- Private methods ----------

    _getRowMetadata: function(row, col /*optional*/) {
        var n = row.retrieve('row');
        var colInfo, colIndex;
        if (Object.isUndefined(col) || col === null) {
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

        return {
            htmlRow: row,
            row: n,
            data: this.data[n],
            column: colInfo
        };


    },

    _clearTextSelection: function() {
        var sel;
        if (window.getSelection) {
            sel = window.getSelection();
        }
        else if (document.getSelection) {
            sel = document.getSelection();
        }
        else if (document.selection) {
                sel = document.selection;
            }
        if (sel) {
            if (sel.empty) {
                sel.empty();
            }
            else if (sel.removeAllRanges) {
                sel.removeAllRanges();
            }
            else if (sel.collapse) {
                    sel.collapse();
                }
        }
    }


    //---------- Private properties ----------

    /**
     * @property _myPrivateProperty
     * @type Object
     * @private
     */

})
        ;

//---------- Static properties ----------

jPlex.extend('jplex.components.Datatable', {
    SELECT_NONE: "none",
    SELECT_SINGLE: "single",
    SELECT_MULTIPLE: "multiple"
});
