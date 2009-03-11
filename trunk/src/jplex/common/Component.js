jPlex.include('jplex.common.Config');
jPlex.include('jplex.common.Locale');
jPlex.include('jplex.xprototype.*');

/**
 * Component class. This class is the mother class of every widget we use
 * in jPlex. It provides us a global management of the configurations and a unified ID allocation.
 *
 * Defining a new component needs a bit more than just extending this class.
 * You'll need to initialize it by calling in the constructor
 *      <code>$super(eSrc, oConfig);</code>
 * And you need to define a private property object <em>_definition</em> containing at least the name of the component.
 * Here is a complete example of a class:
 *
 * {{{
 * jPlex.provide('jplex.components.A', 'jplex.common.Component', {
 *     _definition: {
 *         name: 'A', // Name
 *         defaultConfig: {...} // The default config available in this.cfg('...')
 *         text: { fr: {...}, en:{...} } // Global labels for this components
 *     },
 *     initialize: function($super, eSrc, oConfig) {
 *         $super(eSrc, oConfig);
 *         ...
 *     },
 *     ...
 * }
 * }}}
 * @param {Element} eElement The HTML Element on which the component acts
 * @param {Object} oConfig The configuration object
 * @class Component
 * @namespace jplex.common
 * @constructor
 */
jPlex.provide('jplex.common.Component', {
    /**
     * Internal counter that will be unique for each subclass
     * @property _instanceCount
     * @type int
     * @default 0
     * @private
     */
    _instanceCount:0,

    /**
     * Prefix that will be used to generate the component's
     * @property _sIDPrefix
     * @type String
     * @private
     */
    _sIDPrefix:"",

    /**
     * If true, the component property has been created during the initialization 
     * @property createdComponent
     * @type Boolean
     */
    createdComponent: false,
    /**
     * The component HTML Element
     * @property component
     * @type Element
     */
    initialize: function(eElement, oConfig) {
        // If the component's container doesn't exist, we have to create it
        // using the component default container. It's added to the body of the document
        this.component = $(eElement);

        if (!this._definition ||
            !this._definition.name ||
            (!this._definition.defaultContainer && !this.component))
            throw {name:"DefinitionError", message:'Mandatory definition or field not present'};


        if (!Object.isElement(this.component)) {
            if (typeof(eElement) != "string") {
                throw {
                    name:"WrongParameterType",
                    message:"The first parameters has to be a string in case of a non-existing DOM element"
                };
            }
            this.createdComponent = true;
            this.component = new Element(this._definition.defaultContainer, {id:eElement});
            document.body.appendChild(this.component);
        }

        // Set the component unique ID
        this._sIDPrefix = "jplex-" + this._definition.name.toLowerCase() + "-";

        jplex.common.Component.subclasses.each(function(clazz) {
            if (this instanceof clazz) {
                this.sID = this._sIDPrefix + clazz.prototype._instanceCount++;
                throw $break;
            }
        }.bind(this));

        // Build the configuration object with the default properties and those
        // set by the user
        this._definition.defaultConfig = this._definition.defaultConfig || {};
        this._definition.events = this._definition.events || {};

        oConfig = oConfig || {};
        oConfig.events = oConfig.events || {};

        var ext = this._extension ? this._extension.defaultConfig || {} : {};
        var cfg = Object.extendRecursive(Object.clone(this._definition.defaultConfig), ext);
        cfg = Object.extend(cfg, oConfig);
        cfg.events = null;

        this._oConfig = new jplex.common.Config(cfg);
        this._oEvents = $H();

        $H(Object.extend(Object.clone(this._definition.events), oConfig.events)).each(function(evt) {
            this.setEvent(evt.key, evt.value);
        }, this);

        this.id = this.component.getAttribute("id");
        jplex.common.Component._list.set(this.id, this);

    },

    /**
     * Get a configuration parameter
     * @param {String} sName Name of the config parameter
     * @return {String} The configuration value
     * @see Config.get
     */
    cfg: function(sName) {
        return this._oConfig.get(sName);
    },

    /**
     * Sets a local configuration parameter
     * @param {String} sName Name of the config parameter
     * @param mValue Value to set
     */
    setCfg: function(sName, mValue) {
        this._oConfig.set(sName, mValue);
    },

    /**
     * Set the event handler for the custom event.
     * The context is bound to the component.
     * @param {String} sEventName the custom event name
     * @param {Function} fEventHandler the custom event handler
     */
    setEvent: function(sEventName, fEventHandler) {
        this._oEvents.set(sEventName, fEventHandler.bind(this));
    },

    /**
     * Get the event handler for the custom event
     * @param {String} sEventName the custom event name
     * @return {Function} the event handler if exists, else Prototype.emptyFunction
     */
    getEvent: function(sEventName) {
        var handler = this._oEvents.get(sEventName);
        return handler ? handler : Prototype.emptyFunction;
    },

    /**
     * Fires the specified custom event with given parameters
     * @param {String} sEventName the custom event name
     * @param {Object} oParameters Optional. Hash of event parameters.
     */
    fireEvent: function(sEventName, oParameters) {
        this.getEvent(sEventName)(oParameters);
    },

    /**
     * Reads the string or array that corresponds to the right lang
     * @param {String} sName name corresponding to the text field
     * @return {String|Array|Boolean} Returns the right text field in the right lang, false if not found
     */
    lang: function(sName) {
        var txt = $H(this._definition.text);
        if (!txt) return false;
        var l = this.cfg('lang');
        if (!l) l = jplex.common.Locale.lang;
        return $H(txt.get(l)).get(sName);
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
        jplex.common.Component._list.set(this.id, undefined);
        if(this.createdComponent)
            this.component.remove();
    }

});
jPlex.extend('jplex.common.Component', {_list:$H()});


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