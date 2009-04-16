jPlex.include('jplex.components.menubar.MenuBarSubmenu', false);
/**
 * @description !MenuBar Item subclass
 * @class menubar.MenuBarItem
 * @param {menubar.MenuBar|menubar.MenuBarSubmenu} menu parent menu of the item (i.e. the menu containing the item)
 * @param {Object} item the item
 * @param {Integer} level depth of the item (equal to its parent menu depth)
 * @constructor
 * @requires jplex.components.menubar.MenuBarSubmenu
 * @static
 * @private
 */
jPlex.provide('jplex.components.menubar.MenuBarItem', {


    initialize: function(menu, item, level) {
        this._level    = level;
        this._label    = item.name;
        this._event    = item.click ? item.click.bind(this) : Prototype.emptyFunction;
        this._shortcut = item.shortcut;
        this._icon     = item.icon;
        this._link     = item.link;
        this._menu     = menu;


        this.render(item.items);

        this.me.observe("mouseover", this._onMouseOver.bind(this));
        this.me.observe("click", this._onClick.bind(this));

        if (this._shortcut) {
            document.bindKey(
                this._shortcut.key,
                this._event.wrap(function(proceed) {
                    this.getMenu().getRootMenuBar().setActive(false);
                    return proceed();
                }).bind(this), {
                    ctrl: this._shortcut.ctrl,
                    preventDefault: true
            });
        }

    },

    /**
     * Renders the menu item (and creates all submenus)
     * @param {Array} items The sub-items of the item, defining its submenu
     */
    render: function(items) {
        this.me = new Element("li").update(this._label);
        if (this._link) {
            this.me.observe('click', function() {
                window.location = this._link;
            }.bind(this));
        }
        this.me.addClassName(this._level == 0 ? "first" : "item");

        var span;
        if (this._shortcut) {
            span = new Element("span");
            span.update(this._shortcut.text).addClassName("shortcut");
            this.me.appendChild(span);
        }

        if(this._icon) {
            this.getMenu().getHTMLElement().addClassName("with-icon");

            if (Prototype.Browser.IE6) {
                this.me.removeClassName("item");
                this.me.addClassName("item-with-icon");
            } else {
                this.me.addClassName("icon");
            }
            this.me.setStyle({
                backgroundImage:"url('" + this._icon + "')"
            });
        } else {
            if (Prototype.Browser.IE6) {
                this.me.removeClassName("item");
                this.me.addClassName("item-without-icon");
            } else {
                this.me.addClassName("no-icon");
            }

        }

        this._submenu = new jplex.components.menubar.MenuBarSubmenu(this, items, this._level);

        this.me.appendChild(this.getSubmenu().getHTMLElement());
        this.me.appendChild(this._submenu._shadow);
        
        if (!this.getSubmenu().isEmpty() && this._level != 0) {
            this._addSubmenuIndicator();
        }

        if (Prototype.Browser.IE6) {
            var hoverClass = "ie6-item-hover";
            if (this._level == 0) {
                hoverClass = "ie6-first-hover";
            }

            this.me.observe("mouseover", function() {
                this.me.addClassName(hoverClass);
            }.bind(this));
            this.me.observe("mouseout", function() {
                if (this.me.hasClassName(hoverClass)) {
                    this.me.removeClassName(hoverClass);
                }
           }.bind(this));
        }

    },

    /**
     * Get the submenu of the item (not its containing submenu)
     * @return {menubar.MenuBarSubmenu} submenu containing item subitems
     */
    getSubmenu: function() {
        return this._submenu;
    },

    /**
     * Get the `<li>` HTMLElement of the item, extended by Prototype's Element.extend
     * @return {Element} the `<li>` element of the item
     */
    getHTMLElement: function() {
        return this.me;
    },

    /**
     * Get the menu that contains the item
     * @return {menubar.MenuBarSubmenu|menubar.MenuBar} the item parent
     */
    getMenu: function() {
        return this._menu;
    },

    /**
     * Get details about the item. The method returns an object following this model:
     * <code>{
     *      label: the label of the item,
     *      icon: the path to the 16x16 icon,
     *      shortcut: {
     *          key: Key shortcut (Event.Key.<a key>),
     *          ctrl: Requires the ctrl key to be pressed or not,
     *          text: label of the helper text for the shortcut
     *      },
     *      link: link for the item,
     *      event: custom event on item activation (click or shortcut)
     * }</code>
     * Each field of the object is boolean equivalent to `false` if undefined.
     * @return {Object} details of the item
     */
    getDetails: function() {
        return {
            label: this._label || "",
            icon: this._icon || false,
            shortcut: this._shortcut || false,
            link: this._link || false,
            level: this._level,
            event: this._event || false
        };
    },

    //---------- Private methods ----------

    /**
     * Add an small indicator for the items that have a non-empty submenu
     * @private
     */
    _addSubmenuIndicator: function() {
        if(this._level != 0) {
            var span = new Element("span");
            this.me.appendChild(span.addClassName("parent"));
        }
    },

    /**
     * Operations when the mouse enters a menu item
     * @param {Event} e
     * @private
     */
    _onMouseOver: function(e) {
        e = Event.extend(window.event ? window.event : e);

        if (!this.getMenu().getRootMenuBar().isActive()) {
            e.cancelBubble = true;
            return;
        }
        this.getSubmenu().show();

        this.getMenu().getItems().each(function(s) {
            if (s !== this) {
                s.getSubmenu().hide();
            }
        }.bind(this));
    },

    /**
     * Operations when the user clicks on the menu item
     * Call the user custom function
     * If the item is a root element, just shows the submenu
     * @param {Event} e
     * @private
     */
    _onClick: function(e) {
        e = Event.extend(window.event ? window.event : e);
        this._event();
        if (this._level == 0) {

            if ($(Event.element(e).up("li.item"))) {
                return false;
            } else {
                this.getMenu().getRootMenuBar().setActive(true);
                e.cancelBubble = true;
                this.getSubmenu().show();
            }
        } else {
            e.cancelBubble = true;
            this.getMenu().getRootMenuBar().setActive(false);
            if (this.getSubmenu().isEmpty())
                this.getMenu().getRootMenuBar().hide();
        }
    }

    //---------- Private properties ----------

    /**
     * Depth of the item
     * (equal to the depth of the submenu containing the item)
     * @property _level
     * @type int
     * @private
     */

    /**
     * Reference to the item's parent submenu (or the menu root)
     * @property _menu
     * @type menubar.MenuBarSubmenu|MenuBar
     * @private
     */

    /**
     * Label of the menu item
     * @property _label
     * @type String
     * @private
     */

    /**
     * Link of the menu item (a click on the item redirects to this link)
     * @property _link
     * @type String
     * @private
     */

    /**
     * The custom function called when the item is clicked
     * @property _event
     * @type String
     * @private
     */

    /**
     * 16x16 png icon for the item (path to the image)
     * @property _icon
     * @type String
     * @private
     */

    /**
     * Label of the menu item
     * Object like the following one: `{ key: Event.Key.F, ctrl:true, text:"Ctrl+F" }`
     * @property _shortcut
     * @type Object
     * @private
     */

    /**
     * The item's submenu (could be empty, ie. a `menubar.MenuBarSubmenu` with no items, but not `null`)
     * @property _submenu
     * @type {menubar.MenuBarSubmenu}
     * @private
     */

    /**
     * The `<li>` HTML Element of the item
     * @property me
     * @type Element
     * @private
     */


});