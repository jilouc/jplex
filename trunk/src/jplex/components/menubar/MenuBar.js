jPlex.include('jplex.components.menubar.MenuBarItem', false);
/**
 * @description MenuBar component
 * Place a nice menu bar on your page. It's designed as 
 * the classical menu bars in applications.
 * It is possible to link events on terminal items. 
 * As an additional feature, you could specify a key shortcut
 * for this event.
 * The source for the menu items could be either:
 *  <ul>
 *  <li>a raw JS array. The definition of an item looks like:
 *  <pre>{ 
 *    name:"Item",
 *    click: clickHandler, //Reference to the function to be called at click
 *    icon: 'path/to/icon.png', // Path to a 16x16 icon which will be displayed on the left (optional)
 *    keySC: {
 *        code: Event.Key.Y, // Key code of the shortcut
 *        ctrl: true, // The shortcut requires the modifier Ctrl to be pressed
 *        text: "Ctrl+Y" // Text displayed at right of the item
 *    },
 *    items: [{...},{...},...] // Array of subitems
 * }</pre></li>
 * <li>XML document, fetched with Ajax.Request, with the following scheme:
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
 *     </menubar></xmp></li>
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
jPlex.provide('jplex.components.MenuBar', 'jplex.common.Component',  {

    /**
     * Definitions for the Menubar 
     * (includes <code>_definition.defaultConfig</code> storing the default configuration)
     * @property _definition
     * @private
     * @type Object
     */ 
    _definition: {
        name: "MenuBar",
        defaultConfig: {
            data: [],
            source: 0, // MenuBar.Type.JS_ARRAY

            events: {
                beforeRenderEvent: Prototype.emptyFunction,
                afterRenderEvent: Prototype.emptyFunction,
                onClickEvent: Prototype.emptyFunction,
                onItemAddEvent: Prototype.emptyFunction
            }
        },
        defaultContainer: "div",
        text: {
            fr: {},
            en: {}
        }
    },
    
    /**
     * Array containing the root items of the menu bar
     * (initial items AND dynamically added ones)
     * @property oItems
     * @type Array
     * @see MenuBar.Item
     */

    /**
     * Event that fires before the rendering of the menu
     * @event beforeRenderEvent
     */

    /**
     * Event that fires after the rendering of the menu
     * @event afterRenderEvent
     */

    /**
     * Event that fires when the menu is clicked
     * @event onClickEvent
     * @param {Event} event the DOM Event information
     */

    /**
     * Event that fires when an item is added to the menu
     * When an item is added, the handler is copied to the event of the same name of its submenu.
     * @event onItemAddEvent
     * @param {MenuBar.Item} item the added item
     */

    
    initialize: function($super, eSrc, oConfig) {
        try {
            if (jplex.components.MenuBar.getInstance()) {
                throw {
                    name: "MenuBarSingleInstance",
                    message: "Only one instance of the menubar is allowed per page"
                }
            } else {
                jplex.components.MenuBar._instance = this;
            }
        } catch(e) {
            Logger.error(e);
            return;
        }
        
        $super(eSrc, oConfig);

        // Call the renderer of the component
        this.render();

        // Fill the menu with data items from the specified source
        this.oItems = $A([]);
        this._getData().each(function(s) {
            this.addItem(s);
        }.bind(this));

        // Hide the menu when clicking outside of it
        document.observe("click", function(e) {
            e = Event.extend(window.event ? window.event : e);
            if (!$(Event.element(e)).up("li.item")) {
                jplex.components.MenuBar._clicked = false;
                this.hide();
            }
            this.fireEvent("onClickEvent");
        }.bind(this));

        // IE6 CSS3 Hacks
        // TODO Le faire aussi quand on ajoute des items
        // TODO Cassé sur IE6 : Le Background apparaît plusieurs fois
        if(Prototype.Browser.IE6) {
            $$("div.menubar ul.with-icon > li.item-with-icon",
                    "div.menubar ul.with-icon > li.item-without-icon").each(function(s) {
                $(s).setStyle({paddingLeft: "26px"});
            });
        }

    },
    
    /**
     * Renders the menu bar root
     */
    render: function() {
        this.fireEvent("beforeRenderEvent");
        this.component.addClassName("menubar");
        this.eElement = new Element("ul");
        this.component.appendChild(this.eElement);
        this.fireEvent("afterRenderEvent");
    },
    
    /**
     * Hides every opened item of the menu
     */
    hide: function() {
        this.oItems.each(function(s) {
            s.oSubmenu.hide();
        });
    },
    
    /**
     * Adds the item oItem to the menu root.
     * If specified, adds it before the nBefore'th item
     * @param {Object} oItem Item to add (please refer to the doc above for item properties)
     * @param {Integer} nBefore Optional. Position of the item (by default the item is pushed at the end)
     * @return {MenuBar} the modified MenuBar (allows chained items adds)
     */
    addItem: function(oItem, nBefore) {
        var item = new jplex.components.menubar.MenuBarItem(this, oItem, 0);
        if (nBefore) {
            this.eElement.insertBefore(item.get(), this.oItems[nBefore].get());
            var tmp = $A([]);
            for (var i = 0; i < this.oItems.length; i++) {
                if(i == nBefore) {
                    tmp.push(item);    
                }
                tmp.push(this.oItems[i]);
            }
            this.oItems = tmp.compact();
        } else {
            this.eElement.appendChild(item.get());
            this.oItems.push(item);
        }
        this.fireEvent("onItemAddEvent", {item: item});
        return this;
    },
    
    /**
     * Removes the item at position nIndex
     * @param {nIndex} nIndex Optional. Position of the item
     */
    removeItem: function(nIndex) {
        this.eElement.removeChild(this.getItem(nIndex).oParent.get());
        delete this.oItems[nIndex];
        this.oItems = this.oItems.compact();
    },
    
    /**
     * Get the submenu of the item at position nIndex
     * @param {Integer} nIndex Position of the item to get
     * @return {MenuBar.Submenu} the submenu of the specified item
     */
    getItem: function(nIndex) {
        return this.oItems[nIndex].getSubmenu();
    },

    /**
     * Get the JS Array containing the description of the menu items
     * depending on the data source  
     * @private
     * @return {Array} the items of the menu 
     */
    _getData: function() {
        var aData;
        if (jplex.components.MenuBar.SOURCE_JS_ARRAY == this.cfg("source")) {
            aData = this.cfg("data");
        } else if (jplex.components.MenuBar.SOURCE_AJAX_XML == this.cfg("source")) {
            //@TODO XML Source
        } else if (jplex.components.MenuBar.SOURCE_AJAX_JSON == this.cfg("source")) {
            //@TODO JSON Source
        }
        return $A(aData);
    },

    get: function() {
        return this.eElement;
    }
    
});

jPlex.extend('jplex.components.MenuBar',  {    
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
    SOURCE_AJAX_JSON: 2,
    
    /**
     * Stores the single allowed instance of the menu bar
     * @property _instance
     * @private
     * @static
     */
    
    /**
     * MenuBar state (activated or not)
     * @property _clicked
     * @private
     * @static
     */
    
    /**
     * Get the instance of the menu bar
     * @method getInstance
     * @return {MenuBar} the unique instance of MenuBar
     * @static
     */
    getInstance: function() {
        return jplex.components.MenuBar._instance;
    }
});
