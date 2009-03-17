/**
 * @requires menubar.MenuBarItem
 * @description !MenuBar Submenu
 * @class menubar.MenuBarSubmenu
 * @param {MenuBar.MenuBarItem} oParent the parent item of the submenu
 * @param {Array} oItems array of sub-items (see the documentation of MenuBar)
 * @param {Integer} nLevel depth of the submenu (0 for the immediate children of root elements)
 * @constructor
 * @static
 * @private
 */
jPlex.provide('jplex.components.menubar.MenuBarSubmenu', {
    /**
     * Array of submenu items
     * @property oItems
     * @type Array<MenuBar.MenuBarItem>
     * @see MenuBar.Item
     */

    /**
     * Depth of the submenu
     * (0 for the immediate children of root elements)
     * @property nLevel
     * @type Integer
     * @private
     */

    /**
     * Reference to the submenu's parent item
     * @property oParent
     * @type MenuBar.MenuBarItem
     * @private
     */

    /**
     * Event that fires when an item is added to the menu
     * @event onItemAddEvent
     * @param {MenuBar.MenuBarItem} item the added item
     */

    initialize: function(oParent, oItems, nLevel) {
        this.nLevel = nLevel;
        this.oParent = oParent;
        this.oItems = $A([]);

        this.render();

        if (oItems) {
            for (var i = 0; i < oItems.length; i++) {
                if (!oItems[i] || !oItems[i].name)
                    continue;
                this.addItem(oItems[i]);
            }
        }
    },

    /**
     * Renders the submenu, with shade
     */
    render: function() {
        this.eElement = $(new Element("ul"));
        this.eShade = $(new Element("div"));
        this.eShade.setStyle({
            background: "#000000",
            zIndex: 2 * this.nLevel,
            position: "absolute"
        }).setOpacity(0.2);

        this.eElement.addClassName("submenu").setStyle({
            display: "none",
            zIndex: 2 * this.nLevel + 1
        });
    },

    /**
     * Makes the submenu visible
     */
    show: function() {
        if (!this.isEmpty() && !this.get().visible()) {
            this.get().show();
            this.eShade.show();
            this._fixPosition();
        }
    },

    /**
     * Hides the submenu
     */
    hide: function() {
        if (!this.isEmpty() && this.get().visible()) {
            this.oItems.each(function(s) {
                s.oSubmenu.hide();
            });

            this.get().hide();
            this.eShade.hide();
        }
    },

    /**
     * Get the `<ul>` element for the submenu
     * @return {Element} The `<ul>` container for all `<ul>` items of the submenu
     */
    get: function() {
        return this.eElement;
    },

    /**
     * Calculates the right position for the submenu depending on its parent's position
     * (Called every time the submenu is shown)
     * @private
     */
    _fixPosition: function() {

        var parent = this.oParent.get(),
               pos = parent.positionedOffset();
        var top, left;
        if (this.nLevel == 0) {
            top = pos.top + parent.getHeight();
            left = pos.left;

        } else {
            top = pos.top;
            left = pos.left + parent.getWidth();
        }
        this.get().style.top = top + "px";
        this.get().style.left = left + "px";
        this.eShade.style.top = top + "px";
        this.eShade.style.left = (left - 2) + "px";
        this.eShade.style.width = (this.get().getWidth() + 4) + "px";
        this.eShade.style.height = (this.get().getHeight() + 2) + "px";
    },

    /**
     * Checks whether the submenu is empty or not
     * @return {boolean} true if the submenu doesn't contain any item
     */
    isEmpty: function() {
        return this.oItems.length == 0;
    },

    /**
     * Adds the item oItem to the submenu.
     * If specified, adds it before the nBefore'th item
     * @param {Object} oItem Item to add (please refer to MenuBar's description above for item properties)
     * @param {Integer} nBefore Optional. Position of the item (by default the item is pushed at the end)
     * @return {MenuBar.Submenu} the modified MenuBar (allows chained items adds)
     */
    addItem: function(oItem, nBefore) {
        var item = new jplex.components.menubar.MenuBarItem(this, oItem, this.nLevel + 1);
        if (nBefore) {
            this.eElement.insertBefore(item.get(), this.oItems[nBefore].get());
            var tmp = $A([]);
            for (var i = 0; i < this.oItems.length; i++) {
                if (i == nBefore) {
                    tmp.push(item);
                }
                tmp.push(this.oItems[i]);
            }
            this.oItems = tmp.compact();
        } else {
            this.eElement.appendChild(item.get());
            this.oItems.push(item);
        }
        jplex.components.MenuBar.getInstance().fireEvent("onItemAddEvent", {item:item});
        return this;
    },

    /**
     * Get the submenu of the item at position nIndex
     * @param {Integer} nIndex Position of the item to get
     * @return {MenuBar.Submenu|boolean} the submenu of the specified item, or false if no matching item was found
     */
    getItem: function(nIndex) {
        var item = this.oItems[nIndex];
        if (item) {
            return this.oItems[nIndex].getSubmenu();
        } else {
            return false;
        }
    },

    /**
     * Removes the nIndex-th item of the submenu
     * @param {Integer} nIndex position of the item to remove
     * @return {MenuBar.Submenu|boolean} false if the item doesn't exist, else the modified menu
     */
    removeItem: function(nIndex) {
        var item = this.getItem(nIndex);
        if (item) {
            this.eElement.removeChild(item.getParentItem().get());
            delete this.oItems[nIndex];
            this.oItems = this.oItems.compact();
            return this;
        } else {
            return false;
        }
    },

    /**
     * Get the parent item of the submenu
     * @return {MenuBar.Item} the parent of the submenu
     */
    getParentItem: function() {
        return this.oParent;
    }
});