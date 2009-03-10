jPlex.include("jplex.components.Tooltip", false);
jPlex.include("jplex.components.calendar.CalendarItem", false);

/**
 * Components definition
 * @module Components
 * @namespace jplex.components
 */

/**
 * @description Calendar component class.
 * Create a browsable calendar from a text field, a button or directly on the page.
 * <p>Main features:
 * <ul>
 * <li>Link the calendar to a simple text input (appears on focus), to a button (appears on click)
 * and a text field. You could also use whichever control you want and specify the behavior with custom events.</li>
 * <li>Browse the calendar by month or using the 'fast browse'</li>
 * <li>Key shortcuts enabled: move the focused date using arrow keys or to
 * the previous/next month using PageDown/PageUp</li>
 * <li>Restrict the date to a chosen interval if you want</li>
 * <li>Custom events are fired at given steps of the component lifecycle (show/hide/select)</li>
 * <li>Use fade in/out from Script.aculo.us if you want so</li>
 * </ul>
 *
 * @class Calendar
 * @param {Element|String} eElement The div element (or its id) that will contain the calendar.
 * If the id does not match any element, a "div" element is created with this id
 * @param {Object} oConfig The configuration object
 * @extends jplex.common.Component
 * @requires calendar.CalendarItem
 * @constructor
 */
jPlex.provide("jplex.components.Calendar", "jplex.common.Component", {
    _definition: {
        name: "Calendar",
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
             * @config dateFormat
             * @default "d-m-Y"
             */
            dateFormat: "d-m-Y",
            /**
             * Template for the title of the calendar. You can use 3 tokens:
             * <ul><li>{M} the month full name</li>
             * <li>{m} month number</li>
             * <li>{Y} year with 4 digits</li></ul>
             * @config titleFormat
             * @default "{M} {Y}"
             */
            titleFormat: "{M} {Y}", 
            /**
             * Time in seconds to show/hide the popup calendar.
             * Set to 0 or <code>false</code> to disable fade in/out.
             * @config fade
             * @default 0.3
             */
            fade: 0.3,
            /**
             * The textfield linked with the calendar (edited when a new date is selected)
             * (see the source configuration parameter below for more details)
             * @config textField
             * @default null
             */
            textField: null,
            /**
             * The event source, can be a textfield or a button for example
             * The source element for the calendar. Use one of the following configuration:
             * <ul>
             * <li><code>textField = null, source = a text field</code> : links the calendar to a single text field</li>
             * <li><code>textField = a text field, source = a button</code> : links the calendar to a button, the result
             * will be printed in the textfield</li>
             * <li><code>textField = null, source = a button</code> : links the calendar to a button, use the custom event
             * onSelectEvent to catch the selected date and do what you want with it</li>
             * <li><code>textField = null, source = null</code> : just show a calendar without show/hide things</li>
             * </li>
             * @config source
             * @default null
             */
            source: null,
            /**
             * If set to <code>true</code>, a click on the title of the calendar (month or year)
             * will pop up a tooltip allowing the user to set a value for the month
             * (or the year) using combo-boxes
             * @config fastBrowse
             * @default true
             */
            fastBrowse: true,
            /**
             * Minimum year in the combobox for fast browse
             * @config fastBrowseYearStart
             * @default The current year - 5
             */
            fastBrowseYearStart: (new Date()).getFullYear() - 5,
            /**
             * Maximum year in the combobx for fast browse
             * @config fastBrowseYearEnd
             * @default The current year + 5
             */
            fastBrowseYearEnd: (new Date()).getFullYear() + 5,
            fastBrowseYearStep: 1, // TODO implement

            events: {
                /**
                 * When a new date is selected
                 * @event onSelectEvent
                 * @param {Date} date The selected date
                 */
                onSelectEvent: Prototype.emptyFunction,
                /**
                 * When the calendar appears (textfield receiving focus for instance)
                 * @event onShowEvent
                 */
                onShowEvent: Prototype.emptyFunction,
                /**
                 * When the calendar disappears (textfield losing focus, new date selected for instance)
                 * @event onHideEvent
                 */
                onHideEvent: Prototype.emptyFunction,
                /**
                 * Called each time the position of the calendar is re-computed
                 * @event onPositionChangeEvent
                 * @param {Object} position The computed position (position.top and position.left)
                 * @param {Object} dimensions Dimensions of the calendar container (width and height)
                 */
                onPositionChangeEvent: Prototype.emptyFunction
            }

        },
        defaultContainer: "div",
        text: {
            fr: {
                CLOSE: 'Fermer',
                SELECT_MONTH: 'Mois',
                SELECT_YEAR: 'Année',
                SELECT_END: 'Terminer'
            },
            en: {
                CLOSE: 'Close',
                SELECT_MONTH: 'Month',
                SELECT_YEAR: 'Year',
                SELECT_END: 'Finish'
            },
            jp: {
                CLOSE: 'Close',
                SELECT_MONTH: "\u65E5",
                SELECT_YEAR: "\u5E74",
                SELECT_END: "Finish"
            }
        }
    },

    initialize: function($super, eElement, oConfig) {
        $super(eElement, oConfig);

        this.component.setAttribute("id", this.sID + '-calendar');
        this.ID = this.component.getAttribute('id');

        var oCurrentDate = this.cfg('date');
        this._selectedItem = this._focusedItem = { 
            getDate: function() {
                return oCurrentDate;
            }
        };
        this._currentMonth = oCurrentDate;

        this._source = $(this.cfg("source"));
        this._textField = $(this.cfg("textField"));

        if (!this._textField && this._source) {
            this._textField = this._source;
        }

        this._initialRender();
        this.render();

        if (this._textField && this._source) {
            this.component.setStyle({
                position: 'absolute'
            });

            // Who knows why IE uses an uppercase 'o'...
            if (Prototype.Browser.IE) {
                this._textField.setAttribute("readOnly", true);
            } else {
                this._textField.setAttribute("readonly", true);
            }

            var focusHandler = (function() {
                // Avoid double fire (click+focus) in Mozilla & IE
                if (this.component.visible()) {
                    return;
                }
                this.show();
                this._source.select();
            }).bindAsEventListener(this);

            this._source.observe("focus", focusHandler);
            // Webkit-based browser don't fire focus event on click on a button (in case of the calendar button)
            this._source.observe("click", focusHandler);

            document.observe("click", function(e) {
                var x = e.pointerX(),
                        y = e.pointerY();
                if (!this._source.isWithin(x, y)
                        && !this.component.isWithin(x, y)
                        && !this._fastBrowseTooltip.oBubble.component.isWithin(x, y)) {
                    this.hide();
                }
            }.bind(this));

            var selectHandler = function() {
                if (this.component.visible())
                    this._focusedItem.select(null, true);
                else
                    this.show();
            }.bind(this);

            this._source.bindKey(Event.Key.ENTER, selectHandler, {preventDefault:true});
            this._source.bindKey(Event.Key.SPACE, selectHandler, {preventDefault:true});

            this._source.bindKey(Event.Key.TAB, (function() {
                this.hide();
            }).bind(this));
            this._source.bindKey(Event.Key.TAB, (function() {
                this.hide();
            }).bind(this), {shift:true});

            this._source.bindKey(Event.Key.ESCAPE, function() {
                if (this.component.visible()) {
                    this.hide();
                }
            }.bind(this), {preventDefault:true});

            this._source.bindKey(Event.Key.PAGE_UP, this.previous.bind(this), {preventDefault:true});
            this._source.bindKey(Event.Key.PAGE_DOWN, this.next.bind(this), {preventDefault:true});

            this._source.bindKey(Event.Key.LEFT_ARROW, this.left.bind(this), {preventDefault:true});
            this._source.bindKey(Event.Key.RIGHT_ARROW, this.right.bind(this), {preventDefault:true});
            this._source.bindKey(Event.Key.UP_ARROW, this.up.bind(this), {preventDefault:true});
            this._source.bindKey(Event.Key.DOWN_ARROW, this.down.bind(this), {preventDefault:true});
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
     * Explicitly selects the index'th cell in the calendar
     * @param {Integer} index Index of the cell to select (0 to oItems.length)
     * @see Calendar.CalendarItem#select
     */
    select: function(index) {
        this.items[index].select();
    },

    /**
     * Render the calendar for the current month
     * @see Calendar.CalendarItem
     */
    render: function() {
        this.items = $A([]);
        var tb = this._getTbody();
        tb.removeChildren();

        var oFirstDayOfMonth = this._currentMonth.firstDayOfMonth(),
                oLastDayOfMonth = this._currentMonth.lastDayOfMonth();
        this.__fdom = oFirstDayOfMonth;
        this.__ldom = oLastDayOfMonth;

        var oFirstDay = new Date(
                oFirstDayOfMonth.getFullYear(),
                oFirstDayOfMonth.getMonth(),
                oFirstDayOfMonth.getDate() - oFirstDayOfMonth.getDay(),
                0
                ),
                oLastDay = new Date(
                        oLastDayOfMonth.getFullYear(),
                        oLastDayOfMonth.getMonth(),
                        oLastDayOfMonth.getDate() + 6 - oLastDayOfMonth.getDay(),
                        0
                        );
        var oDay = oFirstDay, eTR, i = 0;
        while (oLastDay.compareTo(oDay) >= 0) {
            if (oDay.getDay() == 0) {
                eTR = new Element("tr");
                this._getTbody().appendChild(eTR);
            }
            var oDayItem = new jplex.components.calendar.CalendarItem(this, oDay, i),
                    eDay = oDayItem.getCell();
            var diff = this._selectedItem.getDate().getTime() - oDay.getTime();
            if (diff >= 0 && diff < 86400000) {
                oDayItem.select();
                oDayItem.focus();
            }

            this.items[i++] = oDayItem;

            eTR.appendChild(eDay);

            if (oFirstDayOfMonth.compareTo(oDay) > 0
                || oLastDayOfMonth.compareTo(oDay) < 0) {
                eDay.addClassName("outofmonth");
            }

            oDay.setNextDay();
        }

        this._setTitle(this._currentMonth.getMonth(),
                       this._currentMonth.getFullYear());

        if (this._fastBrowseOverlay && this._fastBrowseOverlay.visible()) {
            this._fastBrowseOverlay.clonePosition(this.component);
        }


    },

    /**
     * Go to the next month
     */
    next: function() {
        var month = this._currentMonth.getMonth() + 1;
        var year = this._currentMonth.getFullYear();
        if (month > 11) {
            month = 0;
            year++;
        }
        this.goTo(month, year);
    },

    /**
     * Go to the previous month
     */
    previous: function() {
        var month = this._currentMonth.getMonth() - 1;
        var year = this._currentMonth.getFullYear();
        if (month < 0) {
            month = 11;
            year--;
        }
        this.goTo(month, year);
    },

    /**
     * Change the page of the calendar to the specified month and year
     * @param {Integer} month New month (optional)
     * @param {Integer} year New year (optional)
     */
    goTo: function(month, year) {
        var n = this._focusedItem.getIndex();
        var fd = this.__fdom.getDay();
        var date = new Date();

        if (!Object.isUndefined(month)) {
            date.setMonth(month);
        }
        if (year) {
            date.setYear(year);
        }
        this._currentMonth = date.firstDayOfMonth();

        this.render();

        var newIndex = this.__fdom.getDay() + Math.min(this.__ldom.getDate() - 1, n - fd);
        this.items[newIndex].focus();
        if (this._source)
            this._source.activate();

    },

    /**
     * Navigate to the left in the current month, from the currently focused day.
     */
    left: function() {
        var n = Math.max(0, this._focusedItem.getIndex() - 1);
        this.items[n].focus();
    },

    /**
     * Navigate to the right in the current month, from the currently focused day.
     */
    right: function() {
        var n = Math.min(this._focusedItem.getIndex() + 1, this.items.length - 1);
        this.items[n].focus();
    },

    /**
     * Navigate up in the current month, from the currently focused day.
     */
    up: function() {
        var n = Math.max(0, this._focusedItem.getIndex() - 7);
        this.items[n].focus();
    },

    /**
     * Navigate down in the current month, from the currently focused day.
     */
    down: function() {
        var n = Math.min(this._focusedItem.getIndex() + 7, this.items.length - 1);
        this.items[n].focus();
    },

    /**
     * Sets the current selected item of the calendar
     * @param {Calendar.CalendarItem} oItem calendar item to be marked as selected
     */
    setSelectedItem: function(oItem) {
        this._selectedItem = oItem;
        if (!this._textField || this._textField.getAttribute("type") == 'button') return;
        this._textField.value = oItem.getDate().format(this.cfg("dateFormat"));
    },

    /**
     * Sets the current focused item of the calendar (the one that would be selected)
     * @param {Calendar.CalendarItem} oItem calendar item to be marked as focused
     */
    setFocusedItem: function(oItem) {
        this._focusedItem = oItem;
    },

    /**
     * Get the currently selected item of the calendar
     * @return {Calendar.CalendarItem} the selected item
     */
    getSelectedItem: function() {
        return this._selectedItem;
    },

    /**
     * Get the currently focused item of the calendar
     * @return {Calendar.CalendarItem} the focused item
     */
    getFocusedItem: function() {
        return this._focusedItem;
    },

    /**
     * Get the targetted text field of the calendar (null if not set)
     * @return {Element} The text field linked with the calendar
     */
    getTextField: function() {
        return this._textField;
    },

    /**
     * Get the current date string representation, formatted with the given
     * pattern. If no pattern is given, uses the "dateFormat" configuration parameter.
     * @param format
     */
    getFormattedValue: function(format) {
        var pattern = format ? format : this.cfg("dateFormat");
        return this._selectedItem.getDate().format(pattern);
    },

    /**
     * Handle the first rendering of the calendar (build layers and table headers)
     * @private
     */
    _initialRender: function() {
        this.component.addClassName("jplex-calendar");

        if (this._source) {
            this._source.addClassName("jplex-calendar");
            this.component.setStyle({display:"none"});
            if (this._source.getAttribute("type") == "button" && Prototype.Browser.IE6) {
                this._source.addClassName("jplex-calendar-button");
            }
        }

        var eTop = new Element("div").addClassName("top"),
                eTitle = new Element("span", {
                    id: this.ID + "_TITLE"
                }).addClassName("title"),
                ePrevious = new Element("span").addClassName("previous").update("&nbsp;&laquo;&nbsp"),
                eNext = new Element("span").addClassName("next").update("&nbsp;&raquo;&nbsp"),
                eTable = new Element("table", {
                    id: this.ID + "_TABLE"
                }).addClassName("calendar"),
                eTBody = new Element("tbody").update("&nbsp;"),
                eTHead = new Element("thead"),
                eTR = new Element("tr"),
                eClose = new Element("div", {
                    id: this.ID + "_CLOSE"
                }).addClassName("close").update("&nbsp;" + this.lang("CLOSE") + "&nbsp;");

        eTHead.appendChild(eTR);
        eTable.appendChild(eTHead);
        eTable.appendChild(eTBody);
        eTop.appendChild(ePrevious);
        eTop.appendChild(eTitle);
        eTop.appendChild(eNext);
        this.component.appendChild(eTop);
        this.component.appendChild(eTable);
        if (this._textField && this._source) {
            this.component.appendChild(eClose);
        }
        this.component.IEFixCombobox();

        eNext.observe('click', this.next.bindAsEventListener(this));
        ePrevious.observe('click', this.previous.bindAsEventListener(this));
        eClose.observe('click', this.hide.bindAsEventListener(this));

        $A(this.locale('Date', 'DAYS_SHORT')).each(function(s) {
            eTR.appendChild(new Element('th').update(s));
        });

        if (this.cfg("fastBrowse")) {
            var selectMonth = new Element("select");
            $A(this.locale("Date", "MONTHS")).each(function(s, i) {
                selectMonth.appendChild((new Element("option", {value:i})).update(s));
            });

            var selectYear = new Element("select");
            $R(this.cfg("fastBrowseYearStart"), this.cfg("fastBrowseYearEnd")).each(function(s) {
                selectYear.appendChild((new Element("option", {value:s})).update(s));
            });

            var selectEnd = new Element("input", {
                value: this.lang("SELECT_END"),
                type: "button"
            });
            selectEnd.addClassName("end");

            this._fastBrowseTooltip = new jplex.components.Tooltip(this._getTitle(), {
                trigger:jplex.components.Tooltip.TRIGGER_CLICK,
                position:"bottom-right",
                text:"",
                positionRatio:0.35
            });

            var tooltipBody = this._fastBrowseTooltip.oBubble.component.down("div.body");
            this._fastBrowseTooltip.oBubble.component.addClassName("jplex-calendar-tooltip");


            var divSelectMonth = new Element("div").update(this.lang("SELECT_MONTH") + "<br/>");
            divSelectMonth.appendChild(selectMonth);
            divSelectMonth.addClassName("select");
            var divSelectYear = new Element("div").update(this.lang("SELECT_YEAR") + "<br/>");
            divSelectYear.appendChild(selectYear);
            divSelectYear.addClassName("select");


            tooltipBody.appendChildren(
                    divSelectMonth,
                    divSelectYear,
                    selectEnd
                    );
            this._fastBrowseTooltip.setEvent("onShowEvent", function() {
                if (!this._fastBrowseOverlay) {
                    var overlay = new Element("div");

                    document.body.appendChild(overlay);

                    overlay.setStyle({
                        zIndex: this.component.getStyle("zIndex") + 1,
                        position: "absolute"
                    });
                    overlay.addClassName("jplex-calendar-overlay");
                    overlay.setOpacity(0);
                    overlay.clonePosition(this.component);

                    this._fastBrowseOverlay = overlay;

                }
                //this._fastBrowseOverlay.show();
                new Effect.Appear(this._fastBrowseOverlay, {to:0.3});
            }.bind(this));

            this._fastBrowseTooltip.setEvent("onHideEvent", function() {
                if (this._fastBrowseOverlay)
                    this._fastBrowseOverlay.hide();
            }.bind(this));

            var preventClick = function(e) {
                e = Event.extend(window.event ? window.event : e);
                e.cancelBubble = true;
                return false;
            };
            selectMonth.observe("click", preventClick);
            selectYear.observe("click", preventClick);
            selectEnd.observe("click", this._fastBrowseTooltip.hide.bind(this._fastBrowseTooltip));

            var change = function() {
                this.goTo(parseInt(selectMonth.value), parseInt(selectYear.value));
            }.bind(this);


            selectMonth.observe("change", change);
            selectYear.observe("change", change);

            selectMonth.value = this.cfg("date").getMonth();
            selectYear.value = this.cfg("date").getFullYear();
        }


        this._fixPosition();
    },

    /**
     * Get the tbody element of the calendar
     * @return {Element} The tbody element of the calendar table
     * @private
     */
    _getTbody: function() {
        return $(this.ID + "_TABLE").childNodes[1];
    },

    /**
     * Get the thead element of the calendar
     * @return {Element} The thead element of the calendar table
     * @private
     */
    _getThead: function() {
        return $(this.ID + "_TABLE").childNodes[0];
    },

    /**
     * Get the table element of the calendar
     * @return {Element} The table element of the calendar
     * @private
     */
    _getTable: function() {
        return $(this.ID + "_TABLE");
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
     * @param {Integer} month Number of the month
     * @param {Integer} year Year
     * @private
     */
    _setTitle: function(month, year) {
        var title = this.cfg("titleFormat")
                .gsub("{M}", this.locale("Date", "MONTHS")[month])
                .gsub("{Y}", year)
                .gsub("{m}", (month+1).toString());
        this._getTitle().update("&nbsp;" + title + "&nbsp;");
    },

    /**
     * Fix the calendar position on the screen (when rendering)
     * @private
     */
    _fixPosition: function() {
        if (!this._source) return;
        var aOffsets = this._source.cumulativeOffset();
        var newPos = {
            left: aOffsets.left,
            top: aOffsets.top + this._source.getHeight()
        };

        this.component.setStyle({
            left: newPos.left + "px",
            top: newPos.top + "px"
        });

        this.fireEvent("onPositionChangeEvent", {
            position: newPos,
            dimensions: this.component.getDimensions()
        });
    }
});

