/**
 * Components definition
 * @module Components
 * @namespace jplex.components
 */

/**
 * Calendar component class.
 * Create a navigable calendar from a text field or a button.
 *
 * @param {Element} eSrc The HTML Element linked with the calendar (an input of type text or button)
 * @param {Object} oConfig The configuration object
 * @class Calendar
 * @extends jplex.common.Component
 * @constructor
 */
jPlex.provide('jplex.components.Calendar', 'jplex.common.Component', {
    _definition: {
        name: 'Calendar',
        defaultConfig: {   
            /**
             * The default date to select
             * @config date
             * @default new Date()
             */
            date: new Date(),
            /**
             * All dates that are bellow this one are not allowed
             * @config minDate
             * @default false
             */
            minDate: false, 
            /**
             * All dates that are above this one are not allowed
             * @config maxDate
             * @default false
             */
            maxDate: false,
            /**
             * Pattern to format the output string of the calendar
             * (e.g. the value of the linked text input field). To know
             * more about pattern tokens, see jPlex.xprototype.Date#format
             * @see jPlex.xprototype.Date#format
             * @default "d-m-Y"
             */
            dateFormat:"d-m-Y",
            /**
             * Time in seconds to show/hide the popup calendar
             * @config fade
             * @default 0.3
             */
            fade: 0.3,   
            /**
             * The textfield to modify when a new date is selected
             * @config dest
             * @default null
             */
            dest: null, 
            /**
             * The event source, can be a textfield or a button for example
             * @config src
             * @default null
             */
            src: null,
            //TODO IMPLEMENT 
            events: {
                /**
                 * When a new date is selected
                 * @event onSelectEvent
                 * @param {Date} date The selected date
                 */
                onSelectEvent: Prototype.emptyFunction,
                /**
                 * When the calendar appears 
                 * @event onShowEvent
                 */
                onShowEvent: Prototype.emptyFunction,
                onHideEvent: Prototype.emptyFunction,
                onPositionChangeEvent: Prototype.emptyFunction
            }

        },
        defaultContainer: "div",
        text: {
            fr: { CLOSE: 'Fermer' },
            en: { CLOSE: 'Close' }
        }
    },

    initialize: function($super, eElement, oConfig) {
        $super(eElement, oConfig);

        var oCurrentDate = this.cfg('date');

        this.eSrc = $(this.cfg("src"));
        this.eDest = $(this.cfg("dest"));

        this.component.setAttribute("id", this.sID + '-calendar');
        this.ID = this.component.getAttribute('id');
        this.oCurrent = this.oFocus = { _oDate: oCurrentDate };
        this.oMonth = oCurrentDate;


        if (!this.eDest && this.eSrc) {
            this.eDest = this.eSrc;
        }

        this._firstRendering();
        this.render();

        if (this.eDest && this.eSrc) {
            this.component.setStyle({position: 'absolute'});

            // Who knows why IE uses an uppercase 'o'...
            if (Prototype.Browser.IE) {
                this.eDest.setAttribute("readOnly", true);
            } else {
                this.eDest.setAttribute("readonly", true);
            }

            var fHandler = (function() {
                // Avoid double fire (click+focus) in Mozilla & IE
                if (this.component.visible()) return;
                this.show();
                this.eSrc.select();
            }).bindAsEventListener(this);

            this.eSrc.observe('focus', fHandler);
            // Webkit-based browser don't fire focus event on click on a button (in case of the calendar button)
            this.eSrc.observe('click', fHandler);

            document.observe('click', function(eEvent) {
                var x = eEvent.pointerX(),
                        y = eEvent.pointerY();
                if (!this.eSrc.isWithin(x, y) &&
                    !this.component.isWithin(x, y))
                    this.hide();
            }.bind(this));

            var select = function() {
                if (this.component.visible())
                    this.oFocus.select(null, true);
                else
                    this.show();
            }.bind(this);

            this.eSrc.bindKey(Event.Key.ENTER, select, {preventDefault:true});
            this.eSrc.bindKey(Event.Key.SPACE, select, {preventDefault:true});

            this.eSrc.bindKey(Event.Key.TAB, (function() {
                this.hide();
            }).bind(this));
            this.eSrc.bindKey(Event.Key.TAB, (function() {
                this.hide();
            }).bind(this), {shift:true});

            this.eSrc.bindKey(Event.Key.ESCAPE, function() {
                if (this.eContainer.visible()) {
                    this.hide();
                }
            }.bind(this), {preventDefault:true});

            this.eSrc.bindKey(Event.Key.PAGE_UP, this.previous.bind(this), {preventDefault:true});
            this.eSrc.bindKey(Event.Key.PAGE_DOWN, this.next.bind(this), {preventDefault:true});

            this.eSrc.bindKey(Event.Key.LEFT_ARROW, this.left.bind(this), {preventDefault:true});
            this.eSrc.bindKey(Event.Key.RIGHT_ARROW, this.right.bind(this), {preventDefault:true});
            this.eSrc.bindKey(Event.Key.UP_ARROW, this.up.bind(this), {preventDefault:true});
            this.eSrc.bindKey(Event.Key.DOWN_ARROW, this.down.bind(this), {preventDefault:true});
        }

    },

    /**
     * Makes the calendar container appear, with a fade in effect if configured so
     */
    show: function() {
        this._fixPosition();
        if (this.cfg("fade") == 0)
            this.component.show();
        else
            new Effect.Appear(this.component, {duration: this.cfg("fade")});
    },

    /**
     * Makes the calendar disappear, with a fade out effect if configured so
     */
    hide: function() {
        this._fixPosition();
        if (this.cfg("fade") == 0)
            this.component.hide();
        else
            new Effect.Fade(this.component, {duration: this.cfg("fade")});
    },

    /**
     * Explicitly selects the oDate'th cell in the calendar
     * @param {Integer} oDate Index of the cell to select (0 to oItems.length)
     * @see Calendar.Item#select
     */
    select: function(oDate) {
        this.oItems[oDate].select();
    },

    /**
     * Render the calendar for the current month
     * @see Calendar.Item
     */
    render: function() {
        this.oItems = $A([]);
        var tb = this._getTbody();
        tb.removeChildren();

        var oFirstDayOfMonth = this.oMonth.firstDayOfMonth(),
                oLastDayOfMonth = this.oMonth.lastDayOfMonth();
        var oFirstDay = new Date(
                oFirstDayOfMonth.getYear() + Date.YEAR_OFFSET,
                oFirstDayOfMonth.getMonth(),
                oFirstDayOfMonth.getDate() - oFirstDayOfMonth.getDay(),
                0
                ),
                oLastDay = new Date(
                        oLastDayOfMonth.getYear() + Date.YEAR_OFFSET,
                        oLastDayOfMonth.getMonth(),
                        oLastDayOfMonth.getDate() + 6 - oLastDayOfMonth.getDay(),
                        0
                        );
        var oDay = oFirstDay, eTR, i = 0;
        while (oLastDay.compareTo(oDay) >= 0) {
            if (oDay.getDay() == 0) {
                eTR = new Element('tr');
                this._getTbody().appendChild(eTR);
            }
            var oDayItem = new Calendar.Item(this, oDay, i),
                    eDay = oDayItem.getCell();
            var diff = this.cfg('date').getTime() - oDay.getTime();
            if (diff >= 0 && diff < 86400000) {
                oDayItem.select();
                oDayItem.focus();
            }

            this.oItems[i++] = oDayItem;

            eTR.appendChild(eDay);

            if (oFirstDayOfMonth.compareTo(oDay) > 0 ||
                oLastDayOfMonth.compareTo(oDay) < 0)
                eDay.addClassName('outofmonth');

            oDay.setNextDay();
        }
        this._setTitle("&nbsp;" + this.locale('Date', 'MONTHS')[this.oMonth.getMonth()] + ' '
                + (this.oMonth.getYear() + Date.YEAR_OFFSET) + "&nbsp;");
    },

    /**
     * Go to the next month
     */
    next: function() {
        var n = this.oCurrent.getIndex();
        this.oMonth = this.oMonth.lastDayOfMonth();
        this.oMonth.setNextDay();
        this.render();
        this.oItems[n].select(null, false);
        if (this.eSrc)
            this.eSrc.activate();
    },

    /**
     * Go to the previous month
     */
    previous: function() {
        this.oMonth = this.oMonth.firstDayOfMonth();
        this.oMonth.setPreviousDay();
        this.oMonth = this.oMonth.firstDayOfMonth();
        this.render();
        this.oItems[0].focus();
        if (this.eSrc)
            this.eSrc.activate();
    },

    /**
     * Navigate to the left in the current month, from the currently focused day.
     */
    left: function() {
        var n = Math.max(0, this.oFocus.getIndex() - 1);
        this.oItems[n].focus();
    },

    /**
     * Navigate to the right in the current month, from the currently focused day.
     */
    right: function() {
        var n = Math.min(this.oFocus.getIndex() + 1, this.oItems.length - 1);
        this.oItems[n].focus();
    },

    /**
     * Navigate up in the current month, from the currently focused day.
     */
    up: function() {
        var n = Math.max(0, this.oFocus.getIndex() - 7);
        this.oItems[n].focus();
    },

    /**
     * Navigate down in the current month, from the currently focused day.
     */
    down: function() {
        var n = Math.min(this.oFocus.getIndex() + 7, this.oItems.length - 1);
        this.oItems[n].focus();
    },

    /**
     * Handle the first rendering of the calendar (build layers and table headers)
     * @private
     */
    _firstRendering: function() {
        this.component.addClassName('calendar');

        if (this.eSrc) {
            this.eSrc.addClassName('calendar');
            this.component.setStyle({display:'none'});
            if (this.eSrc.getAttribute('type') == 'button' && Prototype.Browser.IE6) {
                this.eSrc.addClassName('calendar-button');
            }
        }                                                                    

        var eTop = new Element('div').addClassName('top'),
                eTitle = new Element('span', {
                    id: this.ID + '_TITLE'
                }).addClassName('title'),
                ePrevious = new Element('span').addClassName('previous').update('&nbsp;&laquo;&nbsp'),
                eNext = new Element('span').addClassName('next').update('&nbsp;&raquo;&nbsp'),
                eTable = new Element('table', {
                    id: this.ID + '_TABLE'
                }).addClassName('calendar'),
                eTBody = new Element('tbody').update('&nbsp;'),
                eTHead = new Element('thead'),
                eTR = new Element('tr'),
                eClose = new Element('div', {
                    id: this.ID + '_CLOSE'
                }).addClassName('close').update("&nbsp;" + this.lang('CLOSE') + "&nbsp;");

        eTHead.appendChild(eTR);
        eTable.appendChild(eTHead);
        eTable.appendChild(eTBody);
        eTop.appendChild(ePrevious);
        eTop.appendChild(eTitle);
        eTop.appendChild(eNext);
        this.component.appendChild(eTop);
        this.component.appendChild(eTable);
        if (this.eDest && this.eSrc)
            this.component.appendChild(eClose);
        this.component.IEFixCombobox();

        eNext.observe('click', this.next.bindAsEventListener(this));
        ePrevious.observe('click', this.previous.bindAsEventListener(this));
        eClose.observe('click', this.hide.bindAsEventListener(this));

        $A(this.locale('Date', 'DAYS_SHORT')).each(function(s) {
            eTR.appendChild(new Element('th').update(s));
        });

        this._fixPosition();
    },

    /**
     * Get the tbody element of the calendar
     * @return {Element} The tbody element of the calendar table
     * @private
     */
    _getTbody: function() {
        return $(this.ID + '_TABLE').childNodes[1];
    },

    /**
     * Get the thead element of the calendar
     * @return {Element} The thead element of the calendar table
     * @private
     */
    _getThead: function() {
    },

    /**
     * Get the table element of the calendar
     * @return {Element} The table element of the calendar
     * @private
     */
    _getTable: function() {
        return $(this.ID + '_TABLE');
    },

    /**
     * Get the title element of the calendar (i.e. the current month-year)
     * @return {Element} The span element containing the current month-year string
     * @private
     */
    _getTitle: function() {
        return $(this.ID + '_TITLE');
    },

    /**
     * Sets the title of the calendar (typically the current month-year
     * @param {String} sTitle The new title
     * @private
     */
    _setTitle: function(sTitle) {
        this._getTitle().update(sTitle);
    },

    /**
     * Get the selected date
     * @return {String} the selected date, formatted
     */
    getValue: function() {
        return this.oCurrent.getDate().to;
    },

    /**
     * Sets the current value as value of the calendar field
     * @param {String} s the new value
     */
    setValue: function(s) {
        if (!this.eDest || this.eDest.getAttribute("type") == 'button') return;
        this.eDest.value = s;
    },

    /**
     * Fix the calendar position on the screen (called at rendering)
     * @private
     */
    _fixPosition: function() {
        if (!this.eSrc) return;
        var aOffsets = this.eSrc.cumulativeOffset();
        this.component.setStyle({
            left: aOffsets.left + "px",
            top: (aOffsets.top + this.eSrc.getHeight()) + "px"
        });
    },

    /**
     * Sets the current selected item of the calendar
     * @param {Calendar.Item} oItem calendar item to be marked as selected
     */
    setSelected: function(oItem) {
        this.oCurrent = oItem;
    },

    /**
     * Sets the current focused item of the calendar (the one that would be selected)
     * @param {Calendar.Item} oItem calendar item to be marked as focused
     */
    setFocused: function(oItem) {
        this.oFocus = oItem;
    }
});

/**
 * Item representing one cell of the calendar (i.e. one day)
 * Store the corresponding HTML element and date and handle focus and select events.
 *
 * @param {Calendar} oCalendar reference to the calendar it belongs to
 * @param {Date} oDate date of the item
 * @param {Integer} nIndex Index of the item in the calendar table
 * @class Calendar.Item
 * @constructor
 */
jPlex.extend('jplex.components.Calendar', {
    Item: Class.create({
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

            if (this._oCalendar.oCurrent.getCell)
                this._oCalendar.oCurrent._unselect();
            if (!this.getCell().hasClassName('selected')) {
                this.getCell().addClassName('selected');
            }
            this.focus();
            this._oCalendar.setSelected(this);
            this._oCalendar.setValue(this.getDate().format(this._oCalendar.cfg("dateFormat")));
            if (bIsClick && this._oCalendar.eDest) {
                this._oCalendar.hide();
            }
            this._oCalendar.fireEvent("onSelectEvent", {date:this._oDate});
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
    })
});

