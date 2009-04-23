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
            // TODO cell block & Interval 
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
                var col = this._createCellForIndexes(i, j, {
                    rowData:g,
                    columnInfo:c
                });
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

            var shiftKey = !!e.shiftKey;
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
        if (this._minSelectedRow == meta.index) {
            this._minSelectedRow = this.selectedRows.min(function(r) {
                return r.retrieve('row');
            });
            if (Object.isUndefined(this._minSelectedRow)) {
                this._minSelectedRow = -1;
            }
        }
        if (this._maxSelectedRow == meta.index) {
            this._maxSelectedRow = this.selectedRows.max(function(r) {
                return r.retrieve('row');
            });
            if (Object.isUndefined(this._maxSelectedRow)) {
                this._maxSelectedRow = -1;
            }
        }

        this.fireEvent('onRowDeselectionEvent', meta);
    },

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
        if (this._minSelectedRow == -1 || this._minSelectedRow > meta.index) {
            this._minSelectedRow = meta.index;
        }
        if (this._maxSelectedRow == -1 || this._maxSelectedRow < meta.index) {
            this._maxSelectedRow = meta.index;
        }

        this.fireEvent('onRowSelectionEvent', meta);

    },

    reloadData: function() {
        this.datasource.request();
    },

    rowAtIndex: function(i) {
        if (i < 0 || i >= this.data.length) {
            return;
        }
        return this._body.down('tr', i);
    },


    //---------- Private methods ----------

    _createCellForIndexes: function(row, col, meta) {
        var data = meta.rowData[this.columns[col].key];
        var cell = new Element('td');
        var formatter;

        if (col == this.columns.length - 1) {
            cell.addClassName('last');
        }
        cell.store('row', row);
        cell.store('col', col);
        cell.store('data', data);

        if (meta.columnInfo.formatter) {
            formatter = meta.columnInfo.formatter;
        } else {
            formatter = jplex.components.Datatable.CellFormatter.String();
        }
        var formatted = formatter.bind(cell)();
        console.log(formatted);

        cell.store('type', formatted.type);
        cell.update(formatted.value);
        if (!Object.isUndefined(formatted.alignment)) {
            cell.setStyle({
                textAlign: formatted.alignment
            });
        }

        return cell;
    },

    _getRowMetadata: function(row, cell) {
        var n = row.retrieve('row');
        var cellInfo = this._getCellMetaData(cell);

        return {
            htmlRow: row,
            index: n,
            data: this.data[n],
            cell: cellInfo
        };


    },

    _getCellMetaData: function(cell) {
        var colInfo, colIndex;
        if (Object.isUndefined(cell) || cell === null) {
            colInfo = null;
        } else {
            colIndex = cell.retrieve('col');
            colKey = this.columns[colIndex].key || this.columns[colIndex];
            colInfo = {
                htmlCell: cell,
                index: colIndex,
                key: colKey,
                data: this.data[cell.retrieve('row')][colKey]
            };
        }
        return colInfo;
    },

    _clearTextSelection: function() {
        var sel;
        if (window.getSelection) {
            sel = window.getSelection();
        } else if (document.getSelection) {
            sel = document.getSelection();
        } else if (document.selection) {
            sel = document.selection;
        }
        if (sel) {
            if (sel.empty) { // Webkit-based
                sel.empty();
            } else if (sel.removeAllRanges) { // Firefox, Opera
                sel.removeAllRanges();
            } else if (sel.collapse) {
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
    SELECT_MULTIPLE: "multiple",

    CellFormatter: (function() {

        var formatNumber = function(precision, leftPadding, base) {
            base = base || 10;
            var data = parseFloat(this.retrieve('data'));
            var formattedData;
            if (!isNaN(data)) {
                if (!Object.isUndefined(precision)) {
                    data = data.toFixed(precision);
                }
                var tmp = Math.floor(data).toString();
                var tmp2 = tmp.lpad(leftPadding || 1, '0'); 
                formattedData = tmp2 + data.toString(base).substring(tmp.length);
            } else {
                formattedData = '###';
            }
            return {
                type: 'Number',
                value: formattedData,
                alignment: 'right'
            };
        };

        var formatString = function() {
            return {
                type: 'String',
                value: this.retrieve('data')
            };
        };

        var formatCurrency = function(symbol, after, precision, leftPadding) {
            if(Object.isUndefined(precision)) {
                precision = 2;
            }
            var num = formatNumber.bind(this)(precision, leftPadding);
            return Object.extend(num, {
                type: 'Currency',
                value: after ? num.value + ' ' + symbol : symbol + ' ' + num.value
            });
        };

        return {
            Number: function(precision, leftPadding, base) {
                return formatNumber.curry(precision, leftPadding, base);
            },


            Date: function() {
                return formatDate;
            },

            Currency: function(symbol, after, precision, leftPadding) {
                return formatCurrency.curry(symbol, after, precision, leftPadding);
            },

            String: function() {
                return formatString;
            }
        };
    })()
});
