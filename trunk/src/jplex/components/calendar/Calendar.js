jPlex.include("jplex.components.Tooltip", false);
jPlex.include("jplex.components.Overlay", false);

/**
 * @description Calendar component class.
 * Create a browsable calendar from a text field, a button or directly on the page.
 *
 * <strong>Main features</strong>:
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
 * @param {Element|String} eElement The div element (or its id) that will contain the calendar. If the id does not match any element, a "div" element is created with this id
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
             * Set to 0 or `false` to disable fade in/out.
             * @config fade
             * @default 0.3
             */
            fade: 0.3,
            /**
             * The textfield linked with the calendar (edited when a new date is selected)
             * (see the `source` configuration parameter for more details)
             * @config textField
             * @default null
             */
            textField: null,
            /**
             * The event source, can be a textfield or a button for example
             * The source element for the calendar. Use one of the following configuration:
             * <ul>
             * <li>`textField = null, source = a text field`: links the calendar to a single text field</li>
             * <li>`textField = a text field, source = a button`: links the calendar to a button, the result
             * will be printed in the textfield</li>
             * <li>`textField = null, source = a button`: links the calendar to a button, use the custom event
             * onSelectEvent to catch the selected date and do what you want with it</li>
             * <li>`textField = null, source = null`: just show a calendar without show/hide things</li>
             * </ul>
             * @config source
             * @default null
             */
            source: null,
            /**
             * If set to `true`, a click on the title of the calendar (month or year)
             * will pop up a tooltip allowing the user to set a value for the month
             * (or the year) using combo-boxes
             * @config fastBrowse
             * @default true
             */
            fastBrowse: true,
            /**
             * zIndex base
             * @config zBase
             * @default 11000
             */
            zBase: 11000,
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
            /**
             * Allow multiple selections within the calendar
             * If set to true, the associated form control is not automatically updated
             * when a date is selected. You have to use the `onSelectEvent` to do what you want.
             * @config multiselect
             * @default false
             */
            multiselect: false,
            /**
             * Give the starting day of the week (Calendar.START_MONDAY or Calendar.START_SUNDAY)
             * @config startWeekOn
             * @default jplex.components.Calendar.START_SUNDAY
             */
            startWeekOn: "sunday" // = jplex.components.Calendar.START_SUNDAY

        },
        events: {
            /**
             * When a new date is selected
             * @event onSelectEvent
             * @param {Date} date The selected date
             * @param {Array} selected Array of currently selected dates in the calendar
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

        var date = this.cfg('date');
        this.first = date.firstDayOfMonth();
        this._selectedItems = $H();

        // Simulate initial state with fake item
        this._focusedItem = {
            retrieve: function(key) {
                if (key == "date") {
                    return date;
                } else if (key == "index") {
                    return date.getDate() - (this.cfg("startWeekOn") == "sunday" ? 0 : 1) + this.first.getDay();
                }
            }.bind(this)
        };

        this._selectedItems.set(date.format("Ymd"), this._focusedItem);


        this._source = $(this.cfg("source"));
        this._textField = $(this.cfg("textField"));

        if (!this._textField && this._source && this._source.readAttribute("type").toLowerCase() == "text") {
            this._textField = this._source;
        }

        this._initialRender();
        this.render();

        if (this._source) {
            this.component.setStyle({
                position: 'absolute',
                zIndex: this.cfg('zBase')
            });

            // Who knows why IE uses an uppercase 'o'...

            if (this._textField !== null) {
                if (Prototype.Browser.IE) {
                    this._textField.setAttribute("readOnly", true);
                } else {
                    this._textField.setAttribute("readonly", true);
                }
            }

            var focusHandler = (function() {
                // Avoid double fire (click+focus) in Mozilla & IE
                if (this.component.visible()) {
                    return;
                }
                this.show();
                this._source.activate();
            }).bind(this);

            this._source.observe("focus", focusHandler);
            // Webkit-based browser don't fire focus event on click on a button (in case of the calendar button)
            this._source.observe("click", focusHandler);


            this.__documentWideHideObserver = function(e) {
                var x = e.pointerX();
                var y = e.pointerY();
                if (!this.component.contains(x, y)
                        && !this._source.contains(x, y)
                        && !this._fastBrowseTooltip.component.contains(x, y)) {
                    this.hide();
                }
            }.bind(this);

            var selectHandler = function() {
                if (this.component.visible()) {
                    this.select(this._focusedItem.retrieve("index"), true);
                } else {
                    this.show();
                }
            }.bind(this);

            var hideHandler = this.hide.bind(this);

            this._source.bindKey(Event.Key.ESCAPE, hideHandler, {preventDefault:true});
            this._source.bindKey(Event.Key.ENTER, selectHandler, {preventDefault:true});
            this._source.bindKey(Event.Key.SPACE, selectHandler, {preventDefault:true});
            this._source.bindKey(Event.Key.TAB, hideHandler);
            this._source.bindKey(Event.Key.TAB, hideHandler, {shift:true});
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
        document.observe("click", this.__documentWideHideObserver);
        if (this.cfg("fade") == 0) {
            this.component.show();
        } else {
            new Effect.Appear(this.component, {duration: this.cfg("fade")});
        }
    },

    /**
     * Makes the calendar disappear, with a fade out effect if configured so
     */
    hide: function() {
        document.stopObserving("click", this.__documentWideHideObserver);

        if (this.cfg("fade") == 0) {
            this.component.hide();
        } else {
            new Effect.Fade(this.component, {duration: this.cfg("fade")});
        }
    },

    /**
     * Explicitly selects the index'th cell in the calendar
     * @param {int} index Index of the cell to select (0 to oItems.length)
     * @param {bool} click `true` if the selection results from a click on the cell
     */
    select: function(index, click) {
        if (!this.check(index)) return;

        var day = this.items[index];

        if (this.cfg("multiselect") && day.retrieve("selected", false)) {
            this.unselect(index);
        } else {

            if (!this.cfg("multiselect")) {
                this.unselect(this.getSelectedItem().retrieve("index"));
            }

            day.addClassName("selected").store("selected", true);

            this.focus(day.retrieve("index", 0));

            if (this.cfg("multiselect")) {
                this.addSelectedItem(day);
            } else {
                this.setSelectedItem(day);
                if (click && this.getTextField() !== null) {
                    this.hide();
                }
            }
        }

        this.fireEvent("onSelectEvent", {
            date: day.retrieve("date"),
            selected: this.getSelectedItems().inject($A(), function(acc, n) {
                acc.push(n.retrieve("date"));
                return acc;
            })
        });
    },

    /**
     * Unselects the item at the given index in the calendar items array
     * @param {int} index index of the item
     */
    unselect: function(index) {
        var day = this.items[index];
        if (!Object.isUndefined(day)) {
            day.store("selected", false).removeClassName("selected");
            this.removeSelectedItem(day);
        }
    },

    /**
     * Set the focus on the item at the given index
     * @param {int} index index of the item
     * @return {bool} false if it's not possible to focus the item, else true
     */
    focus: function(index) {
        if (!this.check(index)) {
            return false;
        }
        var day = this.items[index];

        if (day.getStorage) {
            this.blur(this.getFocusedItem().retrieve("index"));
        }
        day.addClassName("focused");

        this.setFocusedItem(day);

        return true;
    },

    /**
     * Remove the focus on the item at the given index
     * @param {int} index index of the item
     */
    blur: function(index) {
        var day = this.items[index];
        if (!Object.isUndefined(day)) {
            day.removeClassName("focused");
        }

    },

    /**
     * Check whether the date of the item match a valid date or not
     * (regarding to the valid range set in the calendar configuration)
     * @return {bool} <code>true</code> if the date is valid
     */
    check: function(index) {
        var day = this.items[index];

        var minDate = this.cfg("minDate");
        var maxDate = this.cfg("maxDate");
        var date = day.retrieve("date");

        return date.compareTo(this.first) >= 0
                && date.compareTo(this.last) <= 0
                && (!minDate || date.compareTo(minDate) >= -86400000)
                && (!maxDate || date.compareTo(maxDate) <= 0);
    },

    /**
     * Render the calendar for the current month
     */
    render: function() {

        this.last = this.first.lastDayOfMonth();

        this.items = $A([]);
        this.body.removeChildren();

        var startWeekOnOffset = this.cfg("startWeekOn") == jplex.components.Calendar.START_MONDAY ? 1 : 0;

        var date = new Date(
                this.first.getFullYear(),
                this.first.getMonth(),
                this.first.getDate() - this.first.getDay() + startWeekOnOffset,
                0
                );
        if (date.compareTo(this.first) > 0) {
            date.setDate(date.getDate() - 7);
        }
        var lastDate = new Date(
                this.last.getFullYear(),
                this.last.getMonth(),
                this.last.getDate() - this.last.getDay() - (1 - startWeekOnOffset),
                0
                );
        if (lastDate.compareTo(this.last) < 0) {
            lastDate.setDate(lastDate.getDate() + 7);
        }
        var row, i = 0;
        while (lastDate.compareTo(date) >= 0) {

            var copyDate = new Date();
            copyDate.setTime(date.getTime());

            if (copyDate.getDay() == startWeekOnOffset) {
                row = new Element("tr");
                this.body.appendChild(row);
            }

            var day = new Element("td", {
                id: this.ID + "_DAY_" + i
            }).update(copyDate.format('j'));

            this.items[i] = day;

            day.store("date", copyDate)
                    .store("index", i)
                    .store("selected", false);

            if (Prototype.Browser.IE6) {
                day.observe("mouseover", function() {
                    day.addClassName("ie6-hover");
                });
                day.observe("mouseout", function() {
                    day.removeClassName("ie6-hover");
                });
            }

            if (this.check(i)) {
                day.observe("click", this.select.bind(this, i, true));
            } else {
                day.addClassName("disabled");
            }

            if (this._selectedItems.get(copyDate.format("Ymd"))) {
                this.select(i);
                this.focus(i);
            }

            if (this.first.compareTo(copyDate) > 0
                    || this.last.compareTo(copyDate) < 0) {
                day.addClassName("outofmonth");
            }

            row.appendChild(day);
            date.setNextDay();

            i++;
        }


        this._setTitle(this.first.getMonth(),
                this.first.getFullYear());

        if (this._fastBrowseOverlay && this._fastBrowseOverlay.component.visible()) {
            this._fastBrowseOverlay.component.clonePosition(this.component);
        }


    },

    /**
     * Go to the next month
     */
    next: function() {
        var month = this.first.getMonth() + 1;
        var year = this.first.getFullYear();
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
        var month = this.first.getMonth() - 1;
        var year = this.first.getFullYear();
        if (month < 0) {
            month = 11;
            year--;
        }
        this.goTo(month, year);
    },

    /**
     * Change the page of the calendar to the specified month and year
     * @param {int} month New month (optional)
     * @param {int} year New year (optional)
     */
    goTo: function(month, year) {
        var n = this._focusedItem.retrieve("index");
        var fd = this.first.getDay();
        var date = new Date();
        date.setDate(1);

        if (!Object.isUndefined(month)) {
            date.setMonth(month);
        }
        if (year) {
            date.setYear(year);
        }
        this.first = date.firstDayOfMonth();

        this.render();

        var newIndex = this.first.getDay() - (this.cfg("startWeekOn") == jplex.components.Calendar.START_MONDAY ? 1 : 0);
        newIndex += Math.min(this.last.getDate() - 1, n - fd);
        if (newIndex < 0) {
            newIndex = 7 + newIndex;
        }
        //+ Math.min(this.last.getDate() - 1, n - fd);

        this.focus(newIndex);
        if (this._source)
            this._source.activate();

    },

    /**
     * Navigate to the left in the current month, from the currently focused day.
     * If the focused day is the first day of the month, got to the previous month
     */
    left: function() {
        var n = Math.max(0, this._focusedItem.retrieve("index") - 1);
        if (n == 0 || !this.focus(n)) {
            if (this._focusedItem.retrieve("date").compareTo(this.first) == 0) {
                this.previous();
            }
        }
    },

    /**
     * Navigate to the right in the current month, from the currently focused day.
     * If the focused day is the last day of the month, go to the next month
     */
    right: function() {
        var n = Math.min(this._focusedItem.retrieve("index") + 1, this.items.length);
        if (n == this.items.length || !this.focus(n)) {
            if (this._focusedItem.retrieve("date").compareTo(this.last) == 0) {
                this.next();
            }
        }
    },

    /**
     * Navigate up in the current month, from the currently focused day.
     */
    up: function() {
        var currentIndex = this._focusedItem.retrieve("index");
        var n = Math.max(0, currentIndex - 7);
        if (!this.focus(n)) {
            if (currentIndex > 6) {
                this.focus(currentIndex - this._focusedItem.retrieve("date").getDate() + 1);
            }
        }
    },

    /**
     * Navigate down in the current month, from the currently focused day.
     */
    down: function() {
        var currentIndex = this._focusedItem.retrieve("index");
        var n = Math.min(currentIndex + 7, this.items.length - 1);
        if (!this.focus(n)) {
            if (currentIndex < this.items.length - 7) {
                this.focus(currentIndex + this.last.getDate() - this._focusedItem.retrieve("date").getDate());
            }
        }
    },

    /**
     * Add a new date to the currently selected elements
     * @param {Element} item the date to be added (`td` element)
     */
    addSelectedItem: function(item) {
        this._selectedItems.set(item.retrieve("date").format("Ymd"), item);
    },

    /**
     * Removes an item from the selection list
     * @param {Element} item the date to be removed (`td` element)
     */
    removeSelectedItem: function(item) {
        this._selectedItems.unset(item.retrieve("date").format("Ymd"));
    },


    /**
     * Sets the current selected item of the calendar
     * @param {Element} item calendar item to be marked as selected (`td` element)
     */
    setSelectedItem: function(item) {
        this._selectedItems = $H();
        this._selectedItems.set(item.retrieve("date").format("Ymd"), item);

        if (this._textField && this._textField.getAttribute("type") != 'button') {
            this._textField.value = item.retrieve("date").format(this.cfg("dateFormat"));
        }
    },

    /**
     * Sets the current focused item of the calendar (the one that would be selected)
     * @param {Element} item calendar item to be marked as focused (`td` element)
     */
    setFocusedItem: function(item) {
        this._focusedItem = item;
    },

    /**
     * Get the currently selected item of the calendar
     * @return {Element} the `td` selected item
     */
    getSelectedItem: function() {
        return this.getSelectedItems()[0];
    },

    /**
     *
     */
    getSelectedItems: function() {
        return this._selectedItems.values();
    },

    /**
     * Get the currently focused item of the calendar
     * @return {Element} the `td` focused item
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
        return this.getSelectedItem().retrieve("date").format(pattern);
    },

    /**
     * Handle the first rendering of the calendar (build layers and table headers)
     * @private
     */
    _initialRender: function() {
        this.component.addClassName("jplex-calendar");

        if (this._source) {
            this._source.addClassName("jplex-calendar");
            this.component.hide();
            if (Prototype.Browser.IE6) {
                if (this._source.getAttribute("type") == "button") {
                    this._source.addClassName("jplex-calendar-button");
                } else if (this._source.getAttribute("type") == "text") {
                    this._source.addClassName("jplex-calendar-text");
                }
            }
        }

        this.title   = new Element("span", { id: this.UID + "_TITLE" }).addClassName("title");
        this.body    = new Element("tbody");
        var header   = new Element("div").addClassName("top");
        var previous = new Element("span").addClassName("previous").update("&nbsp;&laquo;&nbsp");
        var next     = new Element("span").addClassName("next").update("&nbsp;&raquo;&nbsp");
        var table    = new Element("table", { id: this.UID + "_TABLE" }).addClassName("calendar");
        var thead    = new Element("thead");
        var row      = new Element("tr");

        thead.appendChild(row);
        table.appendChildren(thead, this.body);
        header.appendChildren(previous, this.title, next);
        this.component.appendChildren(header, table);

        if (this._source !== null) {
            var close    = new Element("div", { id: this.UID + "_CLOSE" }).addClassName("close")
                            .update("&nbsp;" + this.lang("CLOSE") + "&nbsp;");            
            this.component.appendChild(close);
            close.observe('click', this.hide.bind(this));
        }
        this.component.IEFixCombobox();

        next.observe('click', this.next.bind(this));
        previous.observe('click', this.previous.bind(this));

        var days = $A(this.locale('Date', 'DAYS_SHORT')).clone();

        if (this.cfg("startWeekOn") == jplex.components.Calendar.START_MONDAY) {
            var tmp = days.first();
            days.shift();
            days[days.length] = tmp;
        }

        days.each(function(s) {
            row.appendChild(new Element('th').update(s));
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
            }).addClassName("end");

            this._fastBrowseTooltip = new jplex.components.Tooltip(this.UID + "-fbtooltip", {
                source: this.title,
                trigger: jplex.components.Tooltip.TRIGGER_CLICK,
                position: "bottom-right",
                positionRatio: 0.35,
                zIndex: this.cfg("zBase") + 2
            });

            this._fastBrowseTooltip.component.addClassName("jplex-calendar-tooltip");

            var divSelectMonth = new Element("div").update(this.lang("SELECT_MONTH")).addClassName("select")
                .insert(selectMonth);
            var divSelectYear = new Element("div").update(this.lang("SELECT_YEAR")).addClassName("select")            
                .insert(selectYear);
            this._fastBrowseTooltip.getBody().appendChildren(divSelectMonth, divSelectYear, selectEnd);

            if (!Prototype.Browser.IE6) {
                this._fastBrowseTooltip.setEvent("onShowEvent", function() {
                    if (!this._fastBrowseOverlay) {

                        this._fastBrowseOverlay = new jplex.components.Overlay(this.UID + "-overlay", {
                            z: this.cfg("zBase") + 1,
                            source: this.component,
                            opacity: 0.3,
                            fade: 0.5
                        });
                        this._fastBrowseOverlay.component.addClassName("jplex-calendar-overlay");

                    }
                    this._fastBrowseOverlay.show();
                    this._fastBrowseOverlay.component.clonePosition(this.component);
                }.bind(this));

                this._fastBrowseTooltip.setEvent("onHideEvent", function() {
                    if (this._fastBrowseOverlay)
                        this._fastBrowseOverlay.hide();
                }.bind(this));

            }

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
     * Sets the title of the calendar (typically the current month-year
     * @param {int} month Number of the month
     * @param {int} year Year
     * @private
     */
    _setTitle: function(month, year) {
        var title = this.cfg("titleFormat")
                .gsub("{M}", this.locale("Date", "MONTHS")[month])
                .gsub("{Y}", year)
                .gsub("{m}", (month + 1).toString());
        this.title.update("&nbsp;" + title + "&nbsp;");
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

        if (this._fastBrowseOverlay) {
            this._fastBrowseOverlay.component.setStyle({
                left: newPos.left + "px",
                top: newPos.top + "px"
            });
        }

        this.fireEvent("onPositionChangeEvent", {
            position: newPos,
            dimensions: this.component.getDimensions()
        });
    }
});

//---------- Static properties ----------

jPlex.extend("jplex.components.Calendar", {
    START_SUNDAY: "sunday",
    START_MONDAY: "monday"
});

