jPlex.include('jplex.common.Config');
jPlex.include('jplex.common.Locale');
jPlex.include('jplex.xprototype.*');

/**
 * Component class. This class is the mother class of every widget we use
 * in jPlex. It provides us a global management of the configurations and a unified ID allocation.
 *
 * Defining a new component needs a bit more than just extending this class.
 * You'll need to initialize it by calling in the constructor
 * <code>$super(element, config);</code>
 * And you need to define a private property object <em>_definition</em> containing at least the name of the component.
 * Here is a complete example of a component:
 *
 * {{{
 * jPlex.provide('jplex.components.A', 'jplex.common.Component', {
 *     _definition: {
 *         name: 'A', // Name
 *         defaultConfig: { // The default config available in this.cfg('...')
 *             ...
 *         },
 *         events: {...}, // Custom Events
 *         text: { fr: {...}, en: {...}, ... } // Global labels for this components
 *         text: { fr: {...}, en: {...}, ... } // Global labels for this components
 *     },
 *     initialize: function($super, element, config) {
 *         $super(element, config);
 *         ...
 *     },
 *     ...
 * }
 * }}}
 * 
 * You can also define an *extension* of another component by setting the private property object `_extension` rather
 * than `_definition`. In this case, the definition will be taken from the mother component and refined by the child
 * component. A common example is the Dialog and the Modal components that are extensions of the Frame component. You
 * are welcome to browse the source of our components to see how to define yours.
 * 
 * @param {Element} element The HTML Element (or ID of the element) on which the component will be built
 * @param {Object} config The configuration object
 * @class Component
 * @namespace jplex.common
 * @constructor
 */
jPlex.provide('jplex.common.Component', {


    initialize: function(element, config) {
        // If the component's container doesn't exist, we have to create it
        // using the component default container. It's added to the body of the document
        this.component = $(element);

        if (!this._definition ||
            !this._definition.name ||
            (!this._definition.defaultContainer && !this.component))
            throw "DefinitionError: Mandatory definition or field not present (Component#initialize)";


        if (!Object.isElement(this.component)) {
            if (typeof(element) != "string") {
                throw "WrongParameterType: The first parameters has to be a string in case of " +
                      "a non-existing DOM element (Component#initialize)";
            }
            this.createdComponent = true;
            this.component = new Element(this._definition.defaultContainer, {
                id: element
            });
            document.body.appendChild(this.component);
        }

        // Set the component unique ID
        this.UID = "jplex-" + this._definition.name.toLowerCase() + "-";
        jplex.common.Component.subclasses.each(function(clazz) {
            if (this instanceof clazz) {
                this.UID = this.UID + clazz.prototype._instanceCount++;
                throw $break;
            }
        }.bind(this));

        // Build the configuration object with the default properties and those
        // set by the user
        this._definition.defaultConfig = this._definition.defaultConfig || {};
        this._definition.events = this._definition.events || {};

        config = config || {};
        config.events = config.events || {};

        var ext = this._extension ? this._extension.defaultConfig || {} : {};
        var cfg = Object.extendRecursive(Object.clone(this._definition.defaultConfig), ext);
        cfg = Object.extend(cfg, config);
        cfg.events = null;

        var text = this._extension ? this._extension.text || {} : {};
        Object.extendRecursive(this._definition.text, text);

        this._config = new jplex.common.Config(cfg);
        this._events = $H();

        $H(Object.extend(Object.clone(this._definition.events), config.events)).each(function(evt) {
            this.setEvent(evt.key, evt.value);
        }, this);

        this.ID = this.component.getAttribute("id");
        jplex.common.Component._list.set(this.ID, this);

    },

    /**
     * Get a configuration parameter
     * @param {String} name Name of the config parameter
     * @return {String} The configuration value
     */
    cfg: function(name) {
        return this._config.get(name);
    },

    /**
     * Sets a local configuration parameter
     * @param {String} name Name of the config parameter
     * @param {mixed} value Value to set
     */
    setCfg: function(name, value) {
        this._config.set(name, value);
    },

    /**
     * Set the event handler for the custom event.
     * The context is bound to the component.
     * @param {String} eventName the custom event name
     * @param {Function} handler the custom event handler
     */
    setEvent: function(eventName, handler) {
        this._events.set(eventName, handler.bind(this));
    },

    /**
     * Get the event handler for the custom event
     * @param {String} eventName the custom event name
     * @return {Function} the event handler if exists, else Prototype.emptyFunction
     */
    getEvent: function(eventName) {
        var handler = this._events.get(eventName);
        return handler ? handler : Prototype.emptyFunction;
    },

    /**
     * Fires the specified custom event with given parameters
     * @param {String} eventName the custom event name
     * @param {Object} parameters Optional. Hash of event parameters.
     */
    fireEvent: function(eventName, parameters) {
        this.getEvent(eventName)(parameters);
    },

    /**
     * Reads the string or array that corresponds to the right lang
     * @param {String} name name corresponding to the text field
     * @return {String|Array|Boolean} Returns the right text field in the right lang, false if not found
     */
    lang: function(name) {
        var txt = $H(this._definition.text);
        if (!txt) return false;
        var l = this.cfg('lang');
        if (!l) l = jplex.common.Locale.lang;
        return $H(txt.get(l)).get(name);
    },

    /**
     * Reads the string or array in the common corresponding to the locale
     * @param {String} component
     * @param {String} field
     */
    locale: function(component, field) {
        var lang = this.cfg('lang');
        if (!lang) return jplex.common.Locale.current(component, field);
        var loc = jplex.common.Locale.get(component, lang);
        if (!loc) return undefined;
        return loc.get(field);
    },

    /**
     * Deletes the reference in the component table, usefull when you delete a lot of component, it avoids memory
     * overflow
     */
    unregister: function() {
        jplex.common.Component._list.set(this.ID, undefined);
        if(this.createdComponent)
            this.component.remove();
    },


    /**
     * Internal counter that will be unique for each subclass
     * @property _instanceCount
     * @type int
     * @default 0
     * @private
     */
    _instanceCount: 0

    /**
     * Computed Unique ID of the component
     * @property UID
     * @type String
     */

    /**
     * ID of the main HTML Element of the component
     * @property ID
     * @type String
     */

    /**
     * If true, the component property has been created during the initialization
     * @property createdComponent
     * @type bool
     * @private
     */

    /**
     * Hash of custom events for the component
     * @property _events
     * @type {Hash}
     * @private
     */

    /**
     * Hash of configurations parameters for the component
     * @property _config
     * @type {Hash}
     * @private
     */

    /**
     * The container HTML Element of the jplex Component
     * @property component
     * @type Element
     */

});


//---------- Static properties ----------

jPlex.extend('jplex.common.Component', {
    _list:$H()
});


/**
 * The ultimate function to get the component by its ID. This function can also accept an instance of Component too.
 * @param {String|Component} c The concerned component ID
 * @return {Component} The concerned component
 * @method $C
 */
$C = function(c) {
    var res = null;
    if (typeof(c) == 'string') {
        res = jplex.common.Component._list.get(c);
    } else if (c instanceof jplex.common.Component) {
        res = c;
    }
    return res;
};
