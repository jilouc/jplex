/**
 * jPlex's XPrototype extended String
 * @class String
 */
Object.extend(String.prototype, {
    /**
     * Completes a string to a desired length with a character repeted to the left
     * @param {Integer} length Desired length of the result string
     * @param {String} character Optional. Character used to complete the string. Default is a blank space.
     * @returns {String} the padded string
     */
    lpad: function(length, character) {
        return (character || " ").times(length - this.length) + this;
    },

    /**
     * Completes a string to a desired length with a character repeted to the right
     * @param {Integer} length Desired length of the result string
     * @param {String} character Optional. Character used to complete the string. Default is a blank space.
     * @return {String} the padded string
     */
    rpad: function(length, character) {
        return this + (character || " ").times(length - this.length);
    }
});
