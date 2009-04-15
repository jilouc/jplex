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
        return element.contains(x, y);
    },

    /**
     * Determines whether the element contains the point at coordinates (x,y) or not
     * @param {int} x Horizontal coordinate
     * @param {int} y Vertical coordinate
     * @return {bool} true if (x,y) is within the element
     */
    contains: function(element, x, y) {
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
        if(!config) config = {};
        
        if(!element._keyHandlers) {
            element._keyHandlers = $A([]);
        }
        
        var defaultConfig = {
            ctrl: false,
            shift: false,
            alt: false,
            preventDefault: false
        };
        config = Object.extend(defaultConfig, config);
        
        var index = key;
        if (config) {
            if (config.ctrl) 
                index += "-ctrl";
            if (config.alt) 
                index += "-alt";
            if (config.shift) 
                index += "-shift";
        }
        
        
        if(element._keyHandlers[index]) {
            throw {
                name: "KeyEventOverride",
                message: "Key code '" + key + "' is already bound with modifiers " + Object.toJSON(config)
            }
        }
        
        element._keyHandlers[index] = function(e) {
            handler();
            return config.preventDefault;
        }
        
        if(element._keyEvents) {
            element.stopObserving("keydown", element._keyEvents);    
        }
            
        element._keyEvents = function(e, handler) {
            e = Event.extend(window.event ? event : e);
            
            var index = e.keyCode;
            if(e.ctrlKey) index += "-ctrl";
            if(e.altKey) index += "-alt";
            if(e.shiftKey) index += "-shift";
            
            
            if(element._keyHandlers[index]) {
                var stop = element._keyHandlers[index](e);
                if(stop) {
                    e.stop();
                }
            }

        }.bindAsEventListener(element, handler)
        
        element.observe('keydown', element._keyEvents);
        return element;
    },

    /**
     * Unbind a key on the element
     * @param {int} key Key-Code (see Event) 
     * @param {Object} modifiers Same form as `config` in `bindKey`
     * @return {Element} The element
     */
    unbindKey: function(element, key, modifiers) {
        element = $(element);
        
        var index = key;
        if (modifiers) {
            if (modifiers.ctrl) 
                index += "-ctrl";
            if (modifiers.alt) 
                index += "-alt";
            if (modifiers.shift) 
                index += "-shift";
        }
        
        element._keyHandlers[index] = null;
        return element;
    },

    /**
     * Inserts a hidden iframe behind the element to correct the Combobox bug (an absolute `div` goes under a comboxbox) 
     * that happens only in Internet Explorer 6. The Calendar component exploits this function to fix the bug for instance. 
     */
    IEFixCombobox: function(element) {
        if(Prototype.Browser.IE6) {
            element = $(element);
            var z = element.getStyle("z-index") || 0;
            var iframe = new Element("iframe");
            iframe.setStyle({
                position:"absolute",
                top:"0px", 
                left:"0px", 
                width:"100%",
                zIndex:z-1
            }).setOpacity(0);
            element.appendChild(iframe);
        }
    }
});

Object.extend(document, { 
    bindKey: Element.Methods.bindKey.methodize(), 
    unbindKey: Element.Methods.unbindKey.methodize() 
});

if(Prototype.Browser.IElt8) {
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
                if(value.tagName.toLowerCase() == 'html') {
                    value = $(document.body);
                }
                return value;
            }
        )
    });
}