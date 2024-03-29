/**
 * jPlex's XPrototype extended Event
 * @class Event
 * @static
 */

Object.extend(Event, function() {
    /**
     * Maximum number of tries when waiting for an element
     * @property _ready_POLL_LIMIT
     * @type int
     * @default 800
     * @private
     * @static
     */
    var _ready_POLL_LIMIT = 800;

    /**
     * Delay between two tries when waiting for an element
     * @property _ready_POLL_INTERVAL
     * @default 0.05
     * @type Number
     * @private
     * @static
     */
    var _ready_POLL_INTERVAL = 0.05;

    /**
     * Stack of all elements we're waiting for.
     * @property _readyStack
     * @type Array
     * @private
     * @static
     */
    var _readyStack = $A();

    /**
     * Current periodical executer for awaited elements
     * @property _readyObserver
     * @type PeriodicalExecuter
     * @private
     * @static
     */
    var _readyObserver = null;

    /**
     * Function called by the periodical executer. Check the
     * presence of all stacked elements and fire the handler.
     * If there is no more element in the stack, it resets the
     * periodical executer.
     * @static
     * @private
     */
    var _readyObserverHandler = function() {
        _readyStack.each(function(s, i) {
            if (!s) return;
            var elt = $(s.element);
            if (elt) {
                s.handler.bind(elt)();
                _readyStack[i] = null;
            } else {
                s.tries--;
                if (s.tries == 0) {
                    _readyStack[i] = null;
                }
            }
        });

        _readyStack = _readyStack.compact();
        if (_readyStack.length == 0) {
            _readyObserver.stop();
            _readyObserver = null;
        }

    };

    return {
        /**
         * Map of all key codes, including special characters
         * @property Key
         * @static
         */
        Key: {
            BACKSPACE:8,
            TAB:9,
            ENTER:13,
            SPACE:32,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            PAUSE: 19,
            CAPS_LOCK: 20,
            ESCAPE: 27,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            LEFT_ARROW: 37,
            UP_ARROW: 38,
            RIGHT_ARROW: 39,
            DOWN_ARROW: 40,
            INSERT: 45,
            DELETE: 46,
            K_0: 48,
            K_1: 49,
            K_2: 50,
            K_3: 51,
            K_4: 52,
            K_5: 53,
            K_6: 54,
            K_7: 55,
            K_8: 56,
            K_9: 57,
            A: 65,
            B: 66,
            C: 67,
            D: 68,
            E: 69,
            F: 70,
            G: 71,
            H: 72,
            I: 73,
            J: 74,
            K: 75,
            L: 76,
            M: 77,
            N: 78,
            O: 79,
            P: 80,
            Q: 81,
            R: 82,
            S: 83,
            T: 84,
            U: 85,
            V: 86,
            W: 87,
            X: 88,
            Y: 89,
            Z: 90,
            LEFT_WINDOW: 91,
            RIGHT_WINDOW: 92,
            SELECT: 93,
            NUMPAD_0: 96,
            NUMPAD_1: 97,
            NUMPAD_2: 98,
            NUMPAD_3: 99,
            NUMPAD_4: 100,
            NUMPAD_5: 101,
            NUMPAD_6: 102,
            NUMPAD_7: 103,
            NUMPAD_8: 104,
            NUMPAD_9: 105,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_ADD: 107,
            NUMPAD_SUBTRACT: 109,
            NUMPAD_POINT: 110,
            NUMPAD_DIVIDE: 111,
            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,                                    
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123,
            NUM_LOCK: 144,
            SCROLL_LOCK: 145,
            SEMI_COLON: 186,
            EQUAL_SIGN: 187,
            COMMA: 188,
            DASH: 189,
            PERIOD: 190,
            SLASH: 191,
            GRAVE_ACCENT: 192,
            OPEN_BRACKET: 219,
            BACKSLASH: 220,
            CLOSE_BRACKET: 221,
            SINGLE_QUOTE: 222
        },

        /**
         * Execute the given handler as soon as the element is detected
         * in the DOM. It uses Prototype's PeriodicalExecuter to check
         * the presence every Event._ready_POLL_INTERVAL milliseconds.
         * If not found after Event._ready_POLL_LIMIT tries, we simply
         * give up.
         * By default this limit is set to 800 tries, with a 50 ms delay
         * between them (40s max.)
         *
         * Note that 'this' refers to the Element (i.e. $(element))
         * itself in the callback function.
         *
         * @param {String} element ID of the element we are waiting for
         * @param {Function} handler Associated callback.
         * @static
         */
        onElementReady: function(element, handler) {
            _readyStack.push({
                element: element,
                handler: handler,
                tries: _ready_POLL_LIMIT
            });
            if (!_readyObserver) {
                _readyObserver = new PeriodicalExecuter(
                        _readyObserverHandler,
                        _ready_POLL_INTERVAL
                        );
            }
        }


    };

}());