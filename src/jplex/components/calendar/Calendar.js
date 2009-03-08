jPlex.include("jplex.components.Tooltip", false);
jPlex.include("jplex.components.calendar.CalendarItem", false);

/**
 * Components definition
 * @module Components
 * @namespace jplex.components
 */

/**
 * Calendar component class.
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
            dateFormat: "d-m-Y",
            /**
             * Time in seconds to show/hide the popup calendar.
             * Set to 0 or false to disable fade in/out.
             * @config fade
             * @default 0.3
             */
            fade: 0.3,
            /**
             * The textfield linked with the calendar (edited when a new date is selected)
             * (see the source configuration parameter below for more details)
             * @config dest
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
             * If set to true, a click on the title of the calendar (month or year)
             * will pop up a tooltip allowing the user to set a value for the month
             * (or the year) using combo-boxes
             */
            fastBrowse: true,

            fastBrowseYearStart: (new Date()).getFullYear() - 5,
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
            }
        }
    },

    initialize: function($super, eElement, oConfig) {
        $super(eElement, oConfig);

        var oCurrentDate = this.cfg('date');

        this.eSrc = $(this.cfg("source"));
        this.eDest = $(this.cfg("textField"));

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
                    !this.component.isWithin(x, y) &&
                    !this._fastBrowseTooltip.oBubble.component.isWithin(x, y))
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
     * @see Calendar.CalendarItem#select
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
        this._fdom = oFirstDayOfMonth;
        this._ldom = oLastDayOfMonth;

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
                eTR = new Element('tr');
                this._getTbody().appendChild(eTR);
            }
            var oDayItem = new jplex.components.calendar.CalendarItem(this, oDay, i),
                    eDay = oDayItem.getCell();
            var diff = this.oCurrent._oDate.getTime() - oDay.getTime();
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

        this._setTitle("&nbsp;" + this.locale('Date', 'MONTHS')[this.oMonth.getMonth()] + ' ' +
                       + this.oMonth.getFullYear() + "&nbsp;");

        if(this._fastBrowseOverlay && this._fastBrowseOverlay.visible()) {
            this._fastBrowseOverlay.clonePosition(this.component);
        }


    },

    /**
     * Go to the next month
     */
    next: function() {
        var month = this.oMonth.getMonth() + 1;
        var year = this.oMonth.getFullYear();
        if(month > 11) {
            month = 0;
            year++;
        }
        this.goTo(month, year);
    },

    /**
     * Go to the previous month
     */
    previous: function() {
        var month = this.oMonth.getMonth() - 1;
        var year = this.oMonth.getFullYear();
        if(month < 0) {
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
        var n = this.oFocus.getIndex();
        var fd = this._fdom.getDay();
        var date = new Date();

        if(!Object.isUndefined(month)) {
            date.setMonth(month);
        }
        if(year) {
            date.setYear(year);
        }
        this.oMonth = date.firstDayOfMonth();

        this.render();

        var newIndex = this._fdom.getDay() + Math.min(this._ldom.getDate() - 1, n - fd);
        this.oItems[newIndex].focus();
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
            tooltipBody.addClassName("jplex-fb-tooltip");


            var divSelectMonth = new Element("div").update(this.lang("SELECT_MONTH")+"<br/>");
            divSelectMonth.appendChild(selectMonth);
            divSelectMonth.addClassName("select");
            var divSelectYear = new Element("div").update(this.lang("SELECT_YEAR")+"<br/>");
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
                    overlay.addClassName("jplex-fb-overlay");
                    overlay.setOpacity(0);
                    overlay.clonePosition(this.component);

                    this._fastBrowseOverlay = overlay;

                }
                //this._fastBrowseOverlay.show();
                new Effect.Appear(this._fastBrowseOverlay, {to:0.3});
            }.bind(this));
            
            this._fastBrowseTooltip.setEvent("onHideEvent", function() {
                if(this._fastBrowseOverlay)
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
        var newPos = {
            left: aOffsets.left,
            top: aOffsets.top + this.eSrc.getHeight()
        };
        
        this.component.setStyle({
            left: newPos.left + "px",
            top: newPos.top + "px"
        });

        this.fireEvent("onPositionChangeEvent", {
            position: newPos,
            dimensions: this.component.getDimensions()
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

