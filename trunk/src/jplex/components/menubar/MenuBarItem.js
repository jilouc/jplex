jPlex.include('jplex.components.menubar.MenuBarSubmenu', false);
/**
 * @description !MenuBar Item subclass
 * @class menubar.MenuBarItem
 * @param {MenuBar|MenuBar.MenuBarSubmenu} oParent parent menu of the item (i.e. the menu containing the item)
 * @param {Object} oItem the item
 * @param {Integer} nLevel depth of the item (equal to its parent menu depth)
 * @constructor
 * @requires jplex.components.menubar.MenuBarSubmenu
 * @static
 * @private
 */
jPlex.provide('jplex.components.menubar.MenuBarItem', {

    /**
     * Depth of the item
     * (equal to the depth of the submenu containing the item)
     * @property nLevel
     * @type Integer
     * @private
     */

    /**
     * Reference to the item's parent submenu (or the menu root)
     * @property oParent
     * @type MenuBar.MenuBarSubmenu|MenuBar
     * @private
     */

    /**
     * Label of the menu item
     * @property sLabel
     * @type String
     * @private
     */

    /**
     * Custom function called when the menu item is activated (on click or keyboard shortcut)
     * @type function
     * @default Prototype.emptyFunction
     */

    initialize: function(oParent, oItem, nLevel) {
        this.nLevel = nLevel;
        this.oParent = oParent;
        this.sLabel = oItem.name;
        this.fHandler = oItem.click ? oItem.click.bind(this) : Prototype.emptyFunction;

        this.render(oItem.items, oItem.keySC, oItem.icon, oItem.link);

        this.get().observe("mouseover", this._onMouseOver.bindAsEventListener(this));
        this.get().observe("click", this._onClick.bindAsEventListener(this));

        if (oItem.keySC) {
            document.bindKey(oItem.keySC.key, this.fHandler.bind(this), {
                ctrl: oItem.keySC.ctrl,
                preventDefault: true
            });
        }

    },

    /**
     * Renders the menu item (and creates all submenus)
     * @param {Array} oItems The sub-items of the item, defining its submenu
     * @param {Object} oShortcut Keyboard Shortcut information
     */
    render: function(oItems, oShortcut, sIcon, sLink) {
        this.eElement = new Element("li").update(this.sLabel);
        if (sLink) {
            this.eElement.observe('click', function() {
                window.location = sLink;
            });
        }
        this.eElement.addClassName(this.nLevel == 0 ? "first" : "item");

        var span;
        if (oShortcut) {
            span = new Element("span");
            span.update(oShortcut.text).addClassName("shortcut");
            this.eElement.appendChild(span);
        }

        if (sIcon) {
            this.oParent.get().addClassName("with-icon");

            if (Prototype.Browser.IE6) {
                this.eElement.removeClassName("item");
                this.eElement.addClassName("item-with-icon");
            } else {
                this.eElement.addClassName("icon");
            }
            this.eElement.setStyle({
                backgroundImage:"url('" + sIcon + "')"
            });
        } else {
            if (Prototype.Browser.IE6) {
                this.eElement.removeClassName("item");
                this.eElement.addClassName("item-without-icon");
            } else {
                this.eElement.addClassName("no-icon");
            }

        }

        this.oSubmenu = new jplex.components.menubar.MenuBarSubmenu(this, oItems, this.nLevel);

        this.eElement.appendChild(this.getSubmenu().get());
        this.eElement.appendChild(this.oSubmenu.eShade);
        if (!this.getSubmenu().isEmpty() && this.nLevel != 0) {
            span = new Element("span");
            this.eElement.appendChild(span.addClassName("parent"));
        }

        if (Prototype.Browser.IE6) {
            var hoverClass = "ie6-item-hover";
            if (this.nLevel == 0) {
                hoverClass = "ie6-first-hover";
            }

            this.eElement.observe("mouseover", function() {
                this.eElement.addClassName(hoverClass);
            }.bind(this));
            this.eElement.observe("mouseout", function() {
                if (this.eElement.hasClassName(hoverClass)) {
                    this.eElement.removeClassName(hoverClass);
                }
           }.bind(this));
        }

    },

    /**
     * Get the `<li>` HTMLElement of the item, extended by Prototype's Element.extend
     * @return {Element} the `<li>` element of the item
     */
    get: function() {
        return this.eElement;
    },

    /**
     * Fires when the mouse enters the item
     * The handlers are identical to those of the menu root
     * @event _onMouseOver
     * @param {Event} e
     */
    _onMouseOver: function(e) {
        e = Event.extend(window.event ? window.event : e);

        if (!jplex.components.MenuBar._clicked) {
            e.cancelBubble = true;
            return;
        }
        this.getSubmenu().show();

        this.oParent.oItems.each(function(s) {
            if (s !== this) {
                s.getSubmenu().hide();
            }
        }.bind(this));
    },

    /**
     * Fires on item activation by click
     * Call the user custom function
     * If the item is a root element, just shows the submenu
     * @event _onClick
     * @param {Event} e
     */
    _onClick: function(e) {
        e = Event.extend(window.event ? window.event : e);
        this.fHandler();
        if (this.nLevel == 0) {

            if ($(Event.element(e).up("li.item"))) {
                return false;
            } else {
                jplex.components.MenuBar._clicked = true;
                e.cancelBubble = true;
                this.getSubmenu().show();
            }
        } else {
            e.cancelBubble = true;
            //this.fHandler();
            if (this.getSubmenu().isEmpty())
                jplex.components.MenuBar.getInstance().hide();
        }
    },

    /**
     * Get the submenu of the item (not its containing submenu)
     * @return {MenuBar.Submenu} submenu containing item subitems
     */
    getSubmenu: function() {
        return this.oSubmenu;
    }

});