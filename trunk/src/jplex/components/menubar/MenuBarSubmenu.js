/**
 * @requires menubar.MenuBarItem
 * @description !MenuBar Submenu
 * @class menubar.MenuBarSubmenu
 * @param {MenuBar.MenuBarItem} oParent the parent item of the submenu
 * @param {Array} items array of sub-items (see the documentation of MenuBar)
 * @param {int} level depth of the submenu (0 for the immediate children of root elements)
 * @constructor
 * @static
 * @private
 */
jPlex.provide('jplex.components.menubar.MenuBarSubmenu', {

    initialize: function(parentItem, items, level) {
        this._level  = level;
        this._parent = parentItem;
        this._items  = $A([]);

        this.render();

        if (items) {
            for (var i = 0; i < items.length; i++) {
                if (!items[i] || !items[i].name)
                    continue;
                this.addItem(items[i]);
            }
        }
    },

    /**
     * Renders the submenu, with shade
     */
    render: function() {
        this.me = $(new Element("ul"));
        this._shadow = $(new Element("div"));
        this._shadow.setStyle({
            background: "#000000",
            zIndex: 2 * this._level,
            position: "absolute"
        }).setOpacity(0.2);

        this.me.addClassName("submenu").setStyle({
            display: "none",
            zIndex: 2 * this._level + 1
        });
    },

    /**
     * Makes the submenu visible
     */
    show: function() {
        if (!this.isEmpty() && !this.me.visible()) {
            this.me.show();
            this._shadow.show();
            this._fixPosition();
        }
    },

    /**
     * Hides the submenu
     */
    hide: function() {
        if (!this.isEmpty() && this.me.visible()) {
            this._items.each(function(s) {
                s.getSubmenu().hide();
            });

            this.me.hide();
            this._shadow.hide();
        }
    },

    /**
     * Get the `<ul>` element for the submenu
     * @return {Element} The `<ul>` container for all `<ul>` items of the submenu
     */
    getHTMLElement: function() {
        return this.me;
    },

    /**
     * Checks whether the submenu is empty or not
     * @return {bool} true if the submenu doesn't contain any item
     */
    isEmpty: function() {
        return this._items.length == 0;
    },

    /**
     * Adds the item oItem to the submenu.
     * If specified, adds it before the nBefore'th item
     * @param {Object} item Item to add (please refer to MenuBar's description above for item properties)
     * @param {int} before Optional. Position of the item (by default the item is pushed at the end)
     * @return {MenuBar.Submenu} the modified MenuBar (allows chained items adds)
     */
    addItem: function(item, before) {
        var item = new jplex.components.menubar.MenuBarItem(this, item, this._level + 1);
        if (before) {
            this.me.insertBefore(item.getHTMLElement(), this._items[before].getHTMLElement());
            var tmp = $A([]);
            for (var i = 0; i < this._items.length; i++) {
                if (i == before) {
                    tmp.push(item);
                }
                tmp.push(this._items[i]);
            }
            this._items = tmp.compact();
        } else {
            this.me.appendChild(item.getHTMLElement());
            this._items.push(item);
        }
        item.getMenu().getParentItem()._addSubmenuIndicator();
        
        this.getRootMenuBar().fireEvent("onItemAddEvent", {
            item: item
        });
        return this;
    },

    /**
     * Get the submenu of the item at position nIndex
     * @param {int} index Position of the item to get
     * @return {MenuBar.Submenu|bool} the submenu of the specified item, or false if no matching item was found
     */
    getItem: function(index) {
        var item = this._items[index];
        if (item) {
            return this._items[index].getSubmenu();
        } else {
            return false;
        }
    },

    /**
     * Removes the index-th item of the submenu
     * @param {int} index position of the item to remove
     * @return {menubar.MenuBarSubmenu|boolean} false if the item doesn't exist, else the modified menu
     */
    removeItem: function(index) {
        var item = this.getItem(index);
        if (item) {
            this.me.removeChild(item.getParentItem().getHTMLElement());
            delete this._items[index];
            this._items = this._items.compact();
            return this;
        } else {
            return false;
        }
    },

    /**
     * Get the parent item of the submenu
     * @return {menubar.MenuBarItem} the parent of the submenu
     */
    getParentItem: function() {
        return this._parent;
    },

    /**
     * Returns a reference to the root menu bar
     * @return {MenuBar} the root menu bar of this submenu 
     */
    getRootMenuBar: function() {
        var parent = this.getParentItem().getMenu();
        if(parent._level == 0) {
            return parent.getParentItem().getMenu();
        } else {
            return parent.getRootMenuBar();
        }
    },

    /**
     * Returns the submenu items (array)
     * @return {Array} an array of the submenu items (menubar.MenuBarItem)
     */
    getItems: function() {
        return this._items;
    },


    //---------- Private methods ----------

    /**
     * Calculates the right position for the submenu depending on its parent's position
     * (Called every time the submenu is shown)
     * @private
     */
    _fixPosition: function() {

        var parent = this.getParentItem().getHTMLElement();
        var pos = parent.positionedOffset();
        var top, left;

        if (this._level == 0) {
            top = pos.top + parent.getHeight();
            left = pos.left;

        } else {
            top = pos.top;
            left = pos.left + parent.getWidth();
        }
        this.me.setStyle({
            top: top + "px",
            left: left + "px"
        });
        this._shadow.setStyle({
            top: top + "px",
            left: (left - 2) + "px",
            width: (this.me.getWidth() + 4) + "px",
            height: (this.me.getHeight() + 2) + "px"
        });
    }


    //---------- Private properties ----------

    /**
     * Array of submenu items
     * @property _items
     * @type Array<MenuBar.MenuBarItem>
     * @see menubar.Item
     */

    /**
     * Depth of the submenu
     * (0 for the immediate children of root elements)
     * @property _level
     * @type int
     * @private
     */

    /**
     * Reference to the submenu's parent item
     * @property _parent
     * @type menubar.MenuBarItem
     * @private
     */

    /**
     * The shadow HTML element for the submenu
     * @property _shadow
     * @type Element
     * @private
     */

    /**
     * The `<ul>` HTML Element of the submenu
     * @property me
     * @type Element
     * @private 
     */
});