/**
 * @requires menubar.MenuItem
 * @description !MenuBar Submenu
 * @class menu.Menu
 * @param {Element|String} element 
 * @param {Array} data array of sub-items (see the documentation of MenuBar)
 * @param {Object} config Configuration parameter
 * @constructor
 * @static
 * @private
 */

jPlex.provide('jplex.components.Menu', 'jplex.common.Component', {

    _definition: {
        name: "Menu",
        defaultConfig: {
            level: 0,
            parent: null,
            stick:'bl'
        },
        events: {
            /**
             * Event that fires when an item is added to the menu
             * When an item is added, the handler is copied to the event of the same name of its submenu.
             * @event onItemAddEvent
             * @param {Element} item the added item
             */
            onItemAddEvent: Prototype.emptyFunction,
            /**
             * Event that fires when an item is clicked
             * @event onItemClick
             * @param {Element} item the clicked item
             */
            onItemClick: Prototype.emptyFunction
        },
        defaultContainer: 'ul'
    },


    initialize: function($super, element, data, config) {

        $super(element, config);

        if (this.cfg('source') === null || Object.isUndefined($(this.cfg('source')))) {
            throw {
                name: 'SourceElementNotFound',
                message: 'The element ' + element + ' doesn\'t exist'
            };
        }

        this.data = data;
        this._source = $(this.cfg('source'));
        this._items = $A([]);
        this._parent = $(this.cfg('parent'));

        this.render();

        if (data) {
            for (var i = 0; i < data.length; i++) {
                if (!data[i] || !data[i].name)
                    continue;
                this.addItem(data[i]);
            }
        }
    },

    /**
     * Renders the submenu, with shade
     */
    render: function() {

        this._shadow = new Element("div");
        this._shadow.setStyle({
            background: "#000000",
            zIndex: 2 * this.cfg('level'),
            position: "absolute"
        }).setOpacity(0.2);

        this.component.addClassName("jplex-menu").setStyle({
            display: "none",
            zIndex: 2 * this.cfg('level') + 1
        });

        this.component.parentNode.appendChild(this._shadow);

    },

    /**
     * Makes the submenu visible
     */
    show: function() {
        if (!this.isEmpty() && !this.component.visible()) {
            this.component.show();
            this._shadow.show();
            this._fixPosition();
        }
    },

    /**
     * Hides the submenu
     */
    hide: function() {
        if (!this.isEmpty() && this.component.visible()) {
            this._items.each(function(s) {
                s.retrieve('submenu').hide();
            });

            this.component.hide();
            this._shadow.hide();
        }
    },

    /**
     * Get the `<ul>` element for the submenu
     * @return {Element} The `<ul>` container for all `<ul>` items of the submenu
     */
    getHTMLElement: function() {
        return this.component;
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
     * @return {menu.Menu} the modified MenuBar (allows chained items adds)
     */
    addItem: function(item, before) {

        var theItem = new Element('li').addClassName('item').update(item.name);
        var id = 'jplex-submenu-'+theItem.identify();
        theItem.appendChild(new Element('ul', {
            id: id 
        }));

        if (before) {
            this.component.insertBefore(theItem, this._items[before]);
            var tmp = $A([]);
            for (var i = 0; i < this._items.length; i++) {
                if (i == before) {
                    tmp.push(theItem);
                }
                tmp.push(this._items[i]);
            }
            this._items = tmp.compact();
        } else {
            this.component.appendChild(theItem);
            this._items.push(theItem);
        }

        if (this.getParentItem() && this._items.length == 1) {
            this.addSubmenuIndicator(this.getParentItem());
        }

        item.event = item.click ? item.click.bind(theItem).wrap(function(proceed) {
            this.fireEvent('onItemClick', {
                details: item,
                item: theItem
            });
            return proceed();
        }).bind(this) : Prototype.emptyFunction;
        
        theItem.store('parent', this);
        theItem.store('event', item.event);
        theItem.store('shortcut', item.shortcut);
        theItem.store('icon', item.icon);
        theItem.store('shortcut', item.link);
        theItem.store('label', item.name);

        if (item.link) {
            theItem.observe('click', function() {
                window.location = item.link;
            });
        }

        var span;
        if (item.shortcut) {
            span = new Element("span");
            span.update(item.shortcut.text).addClassName("shortcut");
            theItem.appendChild(span);
        }

        if (item.icon) {
            this.component.addClassName("with-icon");

            if (Prototype.Browser.IE6) {
                theItem.removeClassName("item");
                theItem.addClassName("item-with-icon");
            } else {
                theItem.addClassName("icon");
            }
            theItem.setStyle({
                backgroundImage:"url('" + item.icon + "')"
            });
        } else {
            if (Prototype.Browser.IE6) {
                theItem.removeClassName("item");
                theItem.addClassName("item-without-icon");
            } else {
                theItem.addClassName("no-icon");
            }

        }

        var submenu = new jplex.components.Menu(id, item.items, {
            level: this.cfg('level') + 1,
            source: theItem,
            parent: theItem,
            stick: 'tr'
        });
        
        submenu.setEvent('onItemAddEvent', this.getEvent('onItemAddEvent'));
        submenu.setEvent('onItemClick', this.getEvent('onItemClick'));

        theItem.store('submenu', submenu);

        if (!submenu.isEmpty()) {
            this.addSubmenuIndicator(theItem);
        }

        if (Prototype.Browser.IE6) {
            var hoverClass = "ie6-item-hover";

            theItem.observe("mouseover", function() {
                theItem.addClassName(hoverClass);
            });
            theItem.observe("mouseout", function() {
                if (theItem.hasClassName(hoverClass)) {
                    theItem.removeClassName(hoverClass);
                }
            });
        }

         theItem.observe("mouseover", this._onMouseOverItem.bind(this).curry(theItem));
         theItem.observe("click", this._onClickItem.bind(this).curry(theItem));
         

        if (item.shortcut) {
            document.bindKey(
                    item.shortcut.key,
                    item.event, {
                        ctrl: item.shortcut.ctrl,
                        preventDefault: true
            });
        }

        return this;
    },

    addSubmenuIndicator: function(item) {
        var span = new Element("span");
        item.appendChild(span.addClassName("parent"));

    },

    /**
     * Get the submenu of the item at position nIndex
     * @param {int} index Position of the item to get
     * @return {menu.Menu|bool} the submenu of the specified item, or false if no matching item was found
     */
    getItem: function(index) {
        var item = this._items[index];
        if (item) {
            return this._items[index].retrieve('submenu');
        } else {
            return false;
        }
    },

    /**
     * Removes the index-th item of the submenu
     * @param {int} index position of the item to remove
     * @return {menu.Menu|boolean} false if the item doesn't exist, else the modified menu
     */
    removeItem: function(index) {
        var item = this.getItem(index);
        if (item) {
            this.component.removeChild(item.getParentItem().getHTMLElement());
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

        var pos = this._source.positionedOffset();
        var top, left;

        if (this.cfg('stick') == 'bl') {
            top = pos.top + this._source.getHeight();
            left = pos.left;

        } else if (this.cfg('stick') == 'tr') {
            top = pos.top;
            left = pos.left + this._source.getWidth();
        }

        this.component.setStyle({
            top: top + "px",
            left: left + "px"
        });
        this._shadow.setStyle({
            top: top + "px",
            left: (left - 2) + "px",
            width: (this.component.getWidth() + 4) + "px",
            height: (this.component.getHeight() + 2) + "px"
        });
    },

    /**
     * Called when an menu item is hovered 
     * @param {Element} item
     * @param {Event} e
     */
    _onMouseOverItem: function(item, e) {
        e.cancelBubble = true;
        item.retrieve('submenu').show();
        item.retrieve('parent').getItems().each(function(s) {
            if (s !== item) {
                s.retrieve('submenu').hide();
            }
        });
    },

    /**
     * Called when an menu item is clicked 
     * @param {Element} item
     * @param {Event} e
     */
    _onClickItem: function(item, e) {

        item.retrieve('event')();

        if (this.cfg('level') == 0) {
            if (e.findElement("li.item")) {
                return false;
            } else {
                e.cancelBubble = true;
                item.retrieve('sumbenu').show();
            }
        } else {
            e.cancelBubble = true;
            var submenu = item.retrieve('submenu');
            if (submenu.isEmpty()) {

            }
        }
    },


    setEvent: function($super, eventName, handler) {
        $super(eventName, handler);
        this._items.each(function(it) {
            it.retrieve('submenu').setEvent(eventName, handler);
        });
    }


    //---------- Private properties ----------

    /**
     * Array of submenu items
     * @property _items
     * @type Array<Element>
     * @see menubar.Item
     */

    /**
     * Reference to the submenu's parent item
     * @property _parent
     * @type Element
     * @private
     */

    /**
     * The shadow HTML element for the submenu
     * @property _shadow
     * @type Element
     * @private
     */
});