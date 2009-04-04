/**
 * Item representing one cell of the calendar (i.e. one day)
 * Store the corresponding HTML element and date and handle focus and select events.
 *
 * @param {Calendar} oCalendar reference to the calendar it belongs to
 * @param {Date} oDate date of the item
 * @param {Integer} nIndex Index of the item in the calendar table
 * @class calendar.CalendarItem
 * @static
 * @constructor
 */
jPlex.provide("jplex.components.calendar.CalendarItem", {

    initialize: function(oCalendar, oDate, nIndex) {
        this._calendar = oCalendar;
        this._date = new Date();
        this._date.setTime(oDate.getTime());
        this._index = nIndex;
        this._selected = false;

        this._cell = new Element("td", {
            id: this._calendar.ID + "_DAY_" + nIndex
        }).update(oDate.getDate().toString());

        if (Prototype.Browser.IE6) {
            this._cell.observe("mouseover", function() {
                this._cell.addClassName("ie6-hover");
            }.bind(this));
            this._cell.observe("mouseout", function() {
                this._cell.removeClassName("ie6-hover");
            }.bind(this));
        }

        if (this.check()) {
            this._cell.observe("click", this.select.bindAsEventListener(this, true));
        } else {
            this._cell.addClassName("disabled");
        }
    },

    /**
     * Selects the date corresponding to the item
     * @param {Event} e
     * @param {bool} click true if the selection results from a click on the cell
     */
    select: function(e, click) {
        if (!this.check()) return;

        if (this._calendar.cfg("multiselect") && this._selected) {
            this._unselect();
        } else {

            if (!this._calendar.cfg("multiselect") && this._calendar.getSelectedItem()._unselect) {
                this._calendar.getSelectedItem()._unselect();
            }
            if (!this._cell.hasClassName("selected")) {
                this._cell.addClassName("selected");
            }

            this._selected = true;

            this.focus();
            if (this._calendar.cfg("multiselect")) {
                this._calendar.addSelectedItem(this);
            } else {
                this._calendar.setSelectedItem(this);
                if (click && this._calendar.getTextField()) {
                    this._calendar.hide();
                }
            }
        }

        this._calendar.fireEvent("onSelectEvent", {
            date: this._date,
            selected: this._calendar.getSelectedItems().pluck("_date")
        });
    },

    /**
     * Set the focus on the item
     */
    focus: function() {
        if (!this.check()) return false;

        if (this._calendar.getFocusedItem()._blur) {
            this._calendar.getFocusedItem()._blur();
        }
        if (!this._cell.hasClassName("focused")) {
            this._cell.addClassName("focused");
        }
        this._calendar.setFocusedItem(this);

        return true;
    },

    /**
     * Check whether the date of the item match a valid date or not
     * (regarding to the valid range set in the calendar configuration)
     * @return {bool} <code>true</code> if the date is valid
     */
    check: function() {
        var minDate = this._calendar.cfg("minDate"),
                maxDate = this._calendar.cfg("maxDate");

        return this._date.compareTo(this._calendar.__fdom) >= 0
                && this._date.compareTo(this._calendar.__ldom) <= 0
                && (!minDate || this._date.compareTo(minDate) >= -86400000)
                && (!maxDate || this._date.compareTo(maxDate) <= 0);
    },

    /**
     * Get the cell (td) element representing the item
     * @return {Element} the td element for the item
     */
    getCell: function() {
        return this._cell;
    },

    /**
     * Get the index of the item in the table
     * @return {Integer} index of the item in the calendar table
     */
    getIndex: function() {
        return this._index;
    },

    /**
     * Get the date of the item
     * @return {Date} date corresponding to the item
     */
    getDate: function() {
        return this._date;
    },

    //---------- Private methods ----------

    /**
     * Unselects the item
     * @private
     */
    _unselect: function() {

        this._selected = false;
        this._cell.removeClassName("selected");
        this._calendar.removeSelectedItem(this);
    },

    /**
     * Removes the focus from the item
     * @private
     */
    _blur: function() {
        this._cell.removeClassName("focused");
    }

    //---------- Private properties ----------

    /**
     * The parent calendar of the item (jplex component)
     * @property _calendar
     * @type Calendar
     * @private
     */

    /**
     * The "TD" extended element of the item
     * @property _cell
     * @type Element
     * @private
     */

    /**
     * The date represented by the item
     * @property _date
     * @type Date
     * @private
     */

    /**
     * The index of the item in its parent's items collection
     * @property _index
     * @type Integer
     * @private
     */
});
