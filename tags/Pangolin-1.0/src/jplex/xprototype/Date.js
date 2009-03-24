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
    YEAR_OFFSET: Prototype.Browser.IE || Prototype.Browser.Opera ? 0 : 1900
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
        return new Date(Date.YEAR_OFFSET + this.getYear(), this.getMonth() + 1, 0, 0);
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
     * Formats a date to its representing string, given a pattern
     * using the following symbols map (same syntax as PHP 'date' function)
     * @param {String} pattern to format the string :
     *   d : day in month (with padding 0)
     *   D : day in week (3 letters (en))
     *   j : day in month (without padding 0)
     *   l : full day (letters (en))
     *   N : ISO day of the week (1 to 7)
     *   S : ordinal suffix for the day (st, nd, rd or th)
     *   w : day of the week (0 (sun) to 6 (sat))
     *   z : day in year
     *   W : week of the year (1 to 52)
     *   F : full month (letters (en))
     *   m : month number (padded with 0)
     *   M : month (3 letters (en))
     *   n : month number (without 0)
     *   t : number of days during month
     *   L : leap year or not (1 or 0)
     *   o : 
     *   Y : full year (4 digits)
     *   y : year (2 digits)
     *   a : am or pm
     *   A : AM or PM
     *   B : Internet time (swatch, 0 to 999)
     *   g : Hour 1-12 (without 0)
     *   G : Hour 0-23 (without 0)
     *   h : Hour 01-12 (padded with 0)
     *   H : Hour 00-23 (padded with 0)
     *   i : Minutes 00-59 (padded with 0)
     *   s : Seconds 00-59 (padded with 0)
     *   u : Microseconds
     *   e :
     *   I :
     *   P :
     *   T :
     *   Z :
     */
    format: function(pattern) {
        var d = this;
        var f = new String(pattern);
        f = f.gsub(/\\./, '');
        f = f.gsub(/[^dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZ]/, '');
        var tokens = $A(f.toArray()).uniq();
        var tokRep = {};
        tokens.each(function(s, i) {
            switch (s) {
                case 'd': tokRep.d = d.getDate().toString().lpad(2, '0'); break;
                case 'D': tokRep.D = Locale.get('Date', 'en').get("DAYS")[d.getDay()]; break;
                case 'j': tokRep.j = d.getDate().toString(); break;
                case 'l': tokRep.l = Locale.get('Date', 'en').get("DAYS_SHORT")[d.getDay()]; break;
                case 'N': tokRep.N = d.getDay() == 0 ? 7 : d.getDay() + 1; break;
                case 'S':
                    var mday = d.getDate();
                    switch (mday) {
                        case 1: tokRep.S = 'st'; break;
                        case 2: tokRep.S = 'nd'; break;
                        case 3: tokRep.S = 'rd'; break;
                        default: tokRep.S = 'th'; break;
                    }
                    break;
                case 'w': tokRep.w = d.getDay(); break;
                case 'z':
                    var first = new Date(d.getFullYear(), 0, 1);
                    tokRep.z = Math.round((d.getTime() - first.getTime()) / 86400000 + 0.5, 0);
                    break;
                case 'W':
                    var first = new Date(d.getFullYear(), 0, 1);
                    tokRep.z = Math.round((d.getTime() - first.getTime()) / 86400000 + first.getDay()/7, 0);
                    break;
                case 'F': tokRep.F = Locale.get('Date', 'en').get("MONTHS")[d.getMonth()]; break;
                case 'm': tokRep.m = (d.getMonth()+1).toString().lpad(2, '0'); break;
                case 'M': tokRep.M = Locale.get('Date', 'en').get("MONTHS_SHORT")[d.getMonth()]; break;
                case 'n': tokRep.n = (d.getMonth()+1).toString(); break;
                case 't': tokRep.t = d.getMonthLength(); break;
                case 'L': tokRep.L = d.isLeapYear() ? "1" : "0"; break;
                case 'o': throw "Unsupported option (not yet implemented)"; break;
                case 'Y': tokRep.Y = d.getFullYear(); break;
                case 'y': tokRep.y = d.getFullYear().toString().substring(2); break;
                case 'a': tokRep.a = d.getHours() < 13 && d.getHours() > 0 ? "am" : "pm"; break;
                case 'A': tokRep.A = d.getHours() < 13 && d.getHours() > 0 ? "AM" : "PM"; break;
                case 'B': throw "Unsupported option (not yet implemented)"; break;
                case 'g': tokRep.g = ((11 + d.getHours()) % 12 + 1).toString(); break;
                case 'G': tokRep.G = d.getHours().toString(); break;
                case 'h': tokRep.h = ((11 + d.getHours()) % 12 + 1).toString().lpad(2, '0'); break;
                case 'H': tokRep.H = d.getHours().toString().lpad(2,'0'); break;
                case 'i': tokRep.i = d.getMinutes().toString().lpad(2,'0'); break;
                case 's': tokRep.s = d.getSeconds().toString().lpad(2,'0'); break;
                case 'u': throw "Unsupported option (not yet implemented)"; break;
                case 'e':
                    var s = d.toString();
                    tokRep.e = /GMT[+\-0-9]+/.exec(s);
                    break;
                case 'I': 
                case '0':
                case 'P':
                case 'T':
                case 'Z':
                default: throw "Unsupported option (not yet implemented)"; break;

            }
        });
       
        tokens.each(function(s) {
            pattern = pattern.gsub(s, "##"+s+"##");
        });

        tokens.each(function(s, i) {
            pattern = pattern.gsub("##"+s+"##", tokRep[s]);
        });
        return pattern;
    }
});
