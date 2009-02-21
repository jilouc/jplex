/**
 * jPlex's XPrototype extended Date
 * @class Date
 */

// STATIC Content

Object.extend(Date, {
    /**
     * Offset to get real year since IE, Opera and Firefox
     * return different result for Date.getYear 
     * @property YEAR_OFFSET
     * @static
     * @type Integer
     */
    YEAR_OFFSET: Prototype.Browser.IE || Prototype.Browser.Opera ? 0 : 1900,
    STR_LONG: 0,
    STR_SHORT: 1
});

// Non-static Content

Object.extend(Date.prototype, {

    /**
     * Get a locale field content
     * @see Locale
     * @param {String} field Name of the field
     */
    locale: function(field) {
        return Locale.current('Date', field);
    },

    /**
     * Get the number of days in the current month
     * @return {Integer} Length of the month
     */
    getMonthLength: function() {
        return this.lastDayOfMonth().getDate();
    },

    /**
     * Checks whether this is a leap year or not
     * @return {Boolean} true if the date belongs to a leap year
     */
    isLeapYear: function() {
        var src = this.getYear() + Date.YEAR_OFFSET;
        return src % 4 == 0 && (src % 100 != 0 || src % 400 == 0);
    },

    /**
     * Get the first day of the month
     * @return a date with the day set to the first day of month 
     */
    firstDayOfMonth: function() {
        return new Date(Date.YEAR_OFFSET + this.getYear(), this.getMonth(), 1);
    },

    /**
     * Get the last day of the month
     * @return a date with the day set to the last day of the month
     */
    lastDayOfMonth: function() {
        return new Date(Date.YEAR_OFFSET + this.getYear(), this.getMonth() + 1, 0,0);
    },

    /**
     *
     */
    toDayString: function(mode) {
        var src = this,
                res;
        if (!mode) {
            mode = Date.STR_SHORT;
        }
        switch (mode) {
            case Date.STR_SHORT:
                res = this.locale('DAYS_SHORT')[src.getDay()];
                break;
            case Date.STR_LONG:
                res = this.locale('DAYS')[src.getDay()];
                break;
        }
        return res;
    },

    /**
     *
     */
    toMonthString: function(mode) {
        var res;
        if (mode != Date.STR_LONG) {
            mode = Date.STR_SHORT;
        }
        switch (mode) {
            case Date.STR_SHORT:
                res = this.locale('MONTHS_SHORT')[this.getMonth()];
                break;
            case Date.STR_LONG:
                res = this.locale('MONTHS')[this.getMonth()];
                break;
        }
        return res;
    },

    /**
     * Set the current date to the next day
     */
    setNextDay: function() {
        this.setDate(this.getDate() + 1);
        return this;
    },

    /**
     * Set the current date to the previous day
     */
    setPreviousDay: function() {
        this.setDate(this.getDate() - 1);
        return this;
    },

    /**
     * Compare the date with a given date
     * @param {Date} date to compare
     * @return {Integer} <li>n=0 if the dates are equal</li><li>n<0 if oDate is after</li><li>n>0 if oDate is before</li> 
     */
    compareTo: function(oDate) {
        return this.getTime() - oDate.getTime();
    },

    /**
     * Get the formatted date (dd-mm-yyyy) 
     * @return A French representation of the date (dd-mm-yyyy)
     * @method toFrenchString
     * @deprecated Replaced by to Date.format
     */
    toFrenchString: function() {
        //@TODO Date.format
        return this.getDate().toString().lpad(2, '0') + '-' +
               (this.getMonth() + 1).toString().lpad(2, '0') + '-' +
               (Date.YEAR_OFFSET + this.getYear());
    }
});
