/**
 * jPlex's XPrototype extended DOM Element
 * @class Element
 */
Element.addMethods({
    /**
     * Appends all elements listed as arguments to the DOM element
     * @param {List<Element>} Elements to add
     * @return {Element} the extended DOM Element
     */
    appendChildren: function(element) {
        $A(arguments).each(function(elt) {
            if (elt == this) return;
            if (Object.isArray(elt)) {
                $A(elt).each(function(e) {
                    this.appendChild(e);
                }.bind(this));
            } else
                this.appendChild(elt);
        }.bind(element));
        return element;
    },

    /**
     * Removes all children of the element
     * @return {Element} the extended DOM Element
     */
    removeChildren: function(element) {
        while (element.childNodes.length > 0)
            element.removeChild(element.childNodes[0]);
        return element;
    },

    /**
     * Determines whether the point of coordinates (x,y) on the page is within the element or not
     * @deprecated in favour of Element#contains
     */
    isWithin: function(element, x, y) {
        return element.inside(x, y);
    },

    /**
     * Determines whether the element contains the point at coordinates (x,y) or not
     * @param {int} x Horizontal coordinate
     * @param {int} y Vertical coordinate
     * @return {bool} true if (x,y) is within the element
     */
    inside: function(element, x, y) {
        var offsets = element.cumulativeOffset();
        offsets = [x - offsets[0], y - offsets[1]];
        var dims = element.getDimensions();
        return offsets[0] < dims.width && offsets[0] >= 0 &&
               offsets[1] < dims.height && offsets[1] >= 0;
    },

    /**
     * Bind a key event on an element
     * @param {int} key Key-Code (see Event)
     * @param {Function} handler
     * @param {Object} config This object is a boolean property hash object containing: `ctrl`, `shift`, `alt` and `preventDefault` (enough explicit)
     * @return {Element} The element
     */
    bindKey: function(element, key, handler, config) {
        element = $(element);

        var registry = element.retrieve('xprototype_keyevent_registry');
        if (Object.isUndefined(registry)) {
            registry = element.retrieve('xprototype_keyevent_registry', $H());
        }

        config = Object.extend({
            ctrl: false,
            shift: false,
            alt: false,
            preventDefault: false
        }, config || {});

        var respondersForEvent = registry.get(key);
        if (Object.isUndefined(respondersForEvent)) {
            respondersForEvent = [];
            registry.set(key, respondersForEvent);
        }

        if (respondersForEvent.pluck('handler').include(handler)) return false;

        var responder = function(event) {
            if (event.keyCode == key &&
                (!config.ctrl || event.ctrlKey) &&
                (!config.shift || event.shiftKey) &&
                (!config.alt || event.altKey)) {
                handler.call(element, event);
                if (config.preventDefault) {
                    event.stop();
                }
            }
        };

        responder.handler = handler;
        respondersForEvent.push(responder);

        element.observe("keydown", responder);

        return element;
    },

    /**
     * Unbind a key on the element
     * @param {int} key Key-Code (see Event)
     * @param {Function} handler the function to unbind (works like Prototype's Element#stopObserving). Optional: if
     * not given, removes all key listeners on the element
     * @return {Element} The element
     */
    unbindKey: function(element, key, handler) {
        element = $(element);

        var registry = element.retrieve("xprototype_keyevent_registry");
        if (Object.isUndefined(registry)) {
            return element;
        }

        if(!key) {
            element.stopObserving("keydown");
            return element;
        }


        var responders = registry.get(key);
        if (Object.isUndefined(responders)) {
            return element;
        }

        if (handler) {
            var responder = responders.find(function(r) {
                return r.handler === handler;
            });
            if (!responder) {
                return element;
            }
            element.stopObserving("keydown", responder);

            registry.set(index, responders.without(responder));
        } else {
            responders.each(function(s) {
                element.stopObserving("keydown", s);
            });
        }

        return element;
    },

    /**
     * Inserts a hidden iframe behind the element to correct the Combobox bug (an absolute `div` goes under a comboxbox)
     * that happens only in Internet Explorer 6. The Calendar component exploits this function to fix the bug for instance.
     */
    IEFixCombobox: function(element) {
        if (Prototype.Browser.IE6) {
            element = $(element);
            var z = element.getStyle("z-index") || 0;
            var iframe = new Element("iframe");
            iframe.setStyle({
                position:"absolute",
                top:"0px",
                left:"0px",
                width:"100%",
                zIndex:z - 1
            }).setOpacity(0);
            element.appendChild(iframe);
        }
    }
});

Object.extend(document, {
    bindKey: Element.Methods.bindKey.methodize(),
    unbindKey: Element.Methods.unbindKey.methodize(),
    retrieve: Element.Methods.retrieve.methodize(),
    store: Element.Methods.store.methodize(),
    getStorage: Element.Methods.getStorage.methodize()
});

if (Prototype.Browser.IElt8) {
    Element.addMethods({
        /**
         * Bug-fixed getOffsetParent (see Prototype Issue #365)
         */
        getOffsetParent : Element.Methods.getOffsetParent.wrap(
            /* Fixing Prototype Issue #365 Element#getStyle problem with IE 6 & 7
             (IE returns 'html' node as parent for absolutely positioned elements
             which cause getStyle to throw an error)
             Should be fixed in release 1.6.0.4 of Prototype
             */
                function(proceed, element) {

                    var value = proceed(element);
                    if (value.tagName.toLowerCase() == 'html') {
                        value = $(document.body);
                    }
                    return value;
                }
                )
    });
}