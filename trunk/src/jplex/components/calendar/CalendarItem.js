/**
 * Item representing one cell of the calendar (i.e. one day)
 * Store the corresponding HTML element and date and handle focus and select events.
 *
 * @param {Calendar} oCalendar reference to the calendar it belongs to
 * @param {Date} oDate date of the item
 * @param {Integer} nIndex Index of the item in the calendar table
 * @class Calendar.CalendarItem
 * @static
 * @constructor
 */
jPlex.provide('jplex.components.calendar.CalendarItem', {

    initialize: function(oCalendar, oDate, nIndex) {
        this._oCalendar = oCalendar;
        this._oDate = new Date();
        this._oDate.setTime(oDate.getTime());
        this._nIndex = nIndex;
        this._eCell = new Element('td', {
            id: this._oCalendar.ID + '_DAY_' + nIndex
        }).update(oDate.getDate().toString());

        if (Prototype.Browser.IE6) {
            this._eCell.observe("mouseover", function() {
                this._eCell.addClassName("ie6-hover");
            }.bind(this));
            this._eCell.observe("mouseout", function() {
                this._eCell.removeClassName("ie6-hover");
            }.bind(this));
        }

        if (this.check()) {
            this._eCell.observe('click', this.select.bindAsEventListener(this, true));
        } else {
            this._eCell.addClassName('disabled');
        }
    },

    /**
     * Selects the date corresponding to the item
     * @param {Event} eEvent
     * @param {boolean} bIsClick true if the selection results from a click on the cell
     */
    select: function(eEvent, bIsClick) {
        if (!this.check()) return;

        if (this._oCalendar.oCurrent.getCell) {
            this._oCalendar.oCurrent._unselect();
        }
        if (!this.getCell().hasClassName('selected')) {
            this.getCell().addClassName('selected');
        }

        this.focus();
        this._oCalendar.setSelected(this);
        this._oCalendar.setValue(this.getDate().format(this._oCalendar.cfg("dateFormat")));
        if (bIsClick && this._oCalendar.eDest) {
            this._oCalendar.hide();
        }
        this._oCalendar.fireEvent("onSelectEvent", {
            date: this._oDate
        });
    },

    /**
     * Unselects the item
     * @private
     */
    _unselect: function() {
        this.getCell().removeClassName('selected');
    },

    /**
     * Set the focus on the item
     */
    focus: function() {
        if (!this.check()) return;

        if (this._oCalendar.oFocus.getCell)
            this._oCalendar.oFocus._blur();
        if (!this.getCell().hasClassName('focused')) {
            this.getCell().addClassName('focused');
        }
        this._oCalendar.setFocused(this);
    },

    /**
     * Removes the focus on the item
     * @private
     */
    _blur: function() {
        this.getCell().removeClassName('focused');
    },

    /**
     * Check whether the date of the item match a valid date
     * (regarding to the valid range set in the calendar configuration)
     */
    check: function() {
        var minDate = this._oCalendar.cfg('minDate'),
                maxDate = this._oCalendar.cfg('maxDate');

        return (!minDate || this.getDate().compareTo(minDate) >= -86400000) &&
               (!maxDate || this.getDate().compareTo(maxDate) <= 0);
    },

    /**
     * Get the cell (td) element representing the item
     * @return {Element} the td element for the item
     */
    getCell: function() {
        return this._eCell;
    },

    /**
     * Get the index of the item in the table
     * @return {Integer} index of the item in the calendar table
     */
    getIndex: function() {
        return this._nIndex;
    },

    /**
     * Get the date of the item
     * @return {Date} date corresponding to the item
     */
    getDate: function() {
        return this._oDate;
    }
});