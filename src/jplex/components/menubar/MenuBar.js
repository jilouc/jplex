jPlex.include('jplex.components.menubar.MenuBarItem', false);
/**
 * @description !MenuBar component
 * Place a nice menu bar on your page. It's designed as
 * the classical menu bars in applications.
 * It is possible to link events on terminal items.
 * As an additional feature, you could specify a key shortcut
 * for this event.
 * The source for the menu items could be either:
 * <ul>
 * <li>a raw JS array. The definition of an item looks like:
 *  <pre>{
 *    name:"Item",
 *    click: clickHandler, //Reference to the function to be called at click
 *    icon: 'path/to/icon.png', // Path to a 16x16 icon which will be displayed on the left (optional)
 *    shortcut: {
 *        code: Event.Key.Y, // Key code of the shortcut
 *        ctrl: true, // The shortcut requires the modifier Ctrl to be pressed
 *        text: "Ctrl+Y" // Text displayed at right of the item
 *    },
 *    items: [{...},{...},...] // Array of subitems
 * }</pre></li>
 * <li>XML document, fetched with Ajax.Request, with the following scheme:
 * {{{
 * <xmp>
 *     <menubar>
 *        <item name="Item" icon="path/to/icon.png">
 *             <click key="Event.Key.Y" ctrl="true" text="Ctrl+Y">
 *                 <![CDATA[function() { ... }]]>
 *             </click>
 *             <items>
 *                 <item>...</item>
 *                 ...
 *             </items>
 *         </item>
 *     </menubar></xmp>
 * }}}</li>
 * <li>JSON document, fetched with Ajax.Request
 * (exactly similar to the syntax of the JS Array)</li>
 * </ul>
 * Notice that this class is a singleton. Therefore it can't be instantiated twice.
 * @param {Element|String} eSrc Container of the menubar
 * @param {Object} oConfig Configuration of the menu bar
 * @class MenuBar
 * @extends jplex.common.Component
 * @requires menubar.Item
 * @constructor
 */
jPlex.provide('jplex.components.MenuBar', 'jplex.common.Component', {

    _definition: {
        name: "MenuBar",
        defaultConfig: {
            data: [],
            source: 0 // MenuBar.Type.JS_ARRAY


        },
        events: {
            /**
             * Event that fires before the rendering of the menu
             * @event beforeRenderEvent
             */
            beforeRenderEvent: Prototype.emptyFunction,
            /**
             * Event that fires after the rendering of the menu
             * @event afterRenderEvent
             */
            afterRenderEvent: Prototype.emptyFunction,
            /**
             * Event that fires when the menu is clicked
             * @event onClickEvent
             * @param {Event} event the DOM Event information
             */
            onClickEvent: Prototype.emptyFunction,
            /**
             * Event that fires when an item is added to the menu
             * When an item is added, the handler is copied to the event of the same name of its submenu.
             * @event onItemAddEvent
             * @param {menubar.MenuBarItem} item the added item
             */
            onItemAddEvent: Prototype.emptyFunction
        },
        defaultContainer: "div"
    },

    
    initialize: function($super, eElement, oConfig) {
        $super(eElement, oConfig);

        // Call the renderer of the component
        this.render();

        // Fill the menu with data items from the specified source
        this._items = $A([]);
        this._getData().each(function(s) {
            this.addItem(s);
        }.bind(this));

        // Hide the menu when clicking outside of it
        document.observe("click", function(e) {
            e = Event.extend(window.event ? window.event : e);
            if (!$(Event.element(e)).up("li.item")) {
                this.setActive(false);
                this.hide();
            }
            this.fireEvent("onClickEvent", {
                event: e
            });
        }.bind(this));

        // IE6 CSS3 Hacks
        // TODO Le faire aussi quand on ajoute des items
        // TODO Cassé sur IE6 : Le Background apparaît plusieurs fois
        if (Prototype.Browser.IE6) {
            $$("div.jplex-menubar ul.with-icon > li.item-with-icon",
                    "div.jplex-menubar ul.with-icon > li.item-without-icon").each(function(s) {
                $(s).setStyle({
                    paddingLeft: "26px"
                });
            });
        }

    },

    /**
     * Renders the menu bar root
     */
    render: function() {
        this.fireEvent("beforeRenderEvent");
        this.component.addClassName("jplex-menubar");
        this.me = new Element("ul");
        
        this.component.appendChild(this.getHTMLElement());
        this.fireEvent("afterRenderEvent");
    },

    /**
     * Hides every opened item of the menu
     */
    hide: function() {
        this._items.each(function(s) {
            s.getSubmenu().hide();
        });
    },

    /**
     * Adds the item oItem to the menu root.
     * If specified, adds it before the nBefore'th item
     * @param {Object} newItem Item to add (please refer to the doc above for item properties)
     * @param {int} before Optional. Position of the item (by default the item is pushed at the end)
     * @return {MenuBar} the modified MenuBar (allows chained items adds)
     */
    addItem: function(newItem, before) {
        var item = new jplex.components.menubar.MenuBarItem(this, newItem, 0);
        if (before) {
            this.getHTMLElement().insertBefore(item.getHTMLElement(), this._items[before].getHTMLElement());
            var tmp = $A([]);
            for (var i = 0; i < this._items.length; i++) {
                if (i == before) {
                    tmp.push(item);
                }
                tmp.push(this._items[i]);
            }
            this._items = tmp.compact();
        } else {
            this.getHTMLElement().appendChild(item.getHTMLElement());
            this._items.push(item);
        }
        this.fireEvent("onItemAddEvent", {
            item: item
        });
        return this;
    },

    /**
     * Removes the item at position index
     * @param {int} index Optional. Position of the item
     */
    removeItem: function(index) {
        this.getHTMLElement().removeChild(this.getItem(index).getMenu().getHTMLElement());
        delete this._items[index];
        this._items = this._items.compact();
    },

    /**
     * Get the submenu of the item at position nIndex
     * @param {int} index Position of the item to get
     * @return {MenuBar.Submenu} the submenu of the specified item
     */
    getItem: function(index) {
        return this._items[index].getSubmenu();
    },

    /**
     * Get the `<ul>` element containing the root menu items
     * @return {Element} 
     */
    getHTMLElement: function() {
        return this.me;
    },

    /**
     * Return the instance of MenuBar (convenience method for "polymorphism")
     * @return {menubar.MenuBar}
     */
    getRootMenuBar: function() {
        return this;
    },

    /**
     * Indicated the status of the menubar
     * @return {bool} `true` if the user has currently clicked on the menubar and is navigating through its items
     */
    isActive: function() {
        return this._activate;
    },

    /**
     * Set the status of the menubar
     * @param {bool} active `true` for "Active" (when the user is using the menubar)
     */
    setActive: function(active) {
        this._activate = active;
    },

    /**
     * Returns the direct items of the menubar in an array.
     * @return {Array} an array of the items (menubar.MenuBarItem)
     */
    getItems: function() {
        return this._items;
    },
    

    //---------- Private methods ----------

    /**
     * Get the JS Array containing the description of the menu items
     * depending on the data source
     * @private
     * @return {Array} the items of the menu
     */
    _getData: function() {
        var data;
        if (jplex.components.MenuBar.SOURCE_JS_ARRAY == this.cfg("source")) {
            data = this.cfg("data");
        } else if (jplex.components.MenuBar.SOURCE_AJAX_XML == this.cfg("source")) {
            // TODO XML Source
        } else if (jplex.components.MenuBar.SOURCE_AJAX_JSON == this.cfg("source")) {
            // TODO JSON Source
        }
        return $A(data);
    }


    //---------- Private properties ----------

    /**
     * Array containing the root items of the menu bar
     * (initial items AND dynamically added ones)
     * @property _items
     * @type Array
     * @private
     * @see menubar.MenuBarItem
     */

    /**
     * The `<ul>` HTML Element of the menubar
     * @property me
     * @type Element
     * @private
     */

    /**
     * Flag indicating whether the menubar is currently in use or not
     * @property _active
     * @type bool
     * @private
     */
});

jPlex.extend('jplex.components.MenuBar', {
    /**
     * Configuration constant indicating that menu items comes from a raw JS array
     * @property SOURCE_JS_ARRAY
     * @type Integer
     * @static
     */
    SOURCE_JS_ARRAY: 0,
    /**
     * Configuration constant indicating that menu items comes from a XML document
     * @property SOURCE_AJAX_XML
     * @type Integer
     * @static
     */
    SOURCE_AJAX_XML: 1,
    /**
     * Configuration constant indicating that menu items comes from a JSON document
     * @property SOURCE_AJAX_JSON
     * @type Integer
     * @static
     */
    SOURCE_AJAX_JSON: 2
});
