jPlex.include('jplex.components.Overlay', true);
/**
 * @description Frame component.
 * The frame/window is a common component in every UI Library and widely used over the web.
 * Basically, it mimics the behavior of similar UI component in Java Swing, C++ QT...
 * and easily catches user's attention on a specific content.
 *
 * <p>
 * This class provides the core features for displaying and manipulating windows, such as
 * <ul>
 * <li>Title bar and footer bar, with an optional "close" button</li>
 * <li>Load the content with Ajax Request</li>
 * <li>Drag and drop the window</li>
 * <li>Control of the size and position of the window (center, min/max width/height...)</li>
 * <li>Events on key moments of the life-cycle</li>
 * <li>Display (or not) a semi-transparent overlay behind the window</li>
 * </ul>
 * Have a look to configuration parameters to see how you can set up your window and mix parameters together.
 * </p>
 *
 * <p>
 * jPlex also provides some preconfigured subclasses of the Frame component for
 * <ul>
 * <li>Modal window : Display an overlay behing the window, see jplex.components.frame.Modal</li>
 * <li>Dialog window : Add two buttons automatically in the footer (typically "OK" and "Cancel"),
 * see jplex.components.frame.Dialog</li>
 * </ul>
 * </p>
 *
 * @class Frame
 * @extends jplex.common.Component
 * @requires Overlay
 * @param {Element|String} eElement HTML Element or ID of the container
 * @param {Object} oConfig Optional. Configuration properties of the frame
 * @constructor
 */
jPlex.provide('jplex.components.Frame', 'jplex.common.Component', {

    _definition: {
        name: "Frame",
        defaultConfig: {
            /**
             * Show the title bar or not (so you can use `setTitle` and have a close button on top-right corner)
             * @config header
             * @default true
             */
            header: true,
            /**
             * Show a footer (like a status-bar) at the bottom of the window
             * (for Dialog windows, the footer will contain the buttons)
             * @config footer
             * @default false
             */
            footer: false,
            /**
             * Center the window on the screen.
             * Note: it won't stay centered on resize/scroll/content change
             * unless you set `constrainToCenter` to `true`.
             * @config center
             * @default true
             */
            center: true,
            /**
             * If `true`, the window will stay centered no matter
             * if the viewport is resized, scrolled or if the content changes
             * @config constrainToCenter
             * @default false
             */
            constrainToCenter: false,
            /**
             * Way to close the window:
             * <ul><li>`jplex.components.Frame.CLOSE_BUTTON`:
             * will display a close button on the top-right corner</li>
             * <li>`jplex.components.Frame.CLOSE_CLICK_OUT`:
             * the window will be closed when the user clicks outside the window
             * (be sure your users know it), it's designed especially for modal windows.</li>
             * <li>`jplex.components.Frame.CLOSE_CUSTOM`:
             * it's your responsability to call the `show()` and `hide()` methods.</li>
             * </ul>
             * @config close
             * @default Frame.CLOSE_BUTTON
             */
            close:'button', // jplex.components.Frame.CLOSE_BUTTON
            /**
             * Indicates whether the window could be dragged in the viewport.
             * Note: if the window has a header (title bar) only this header can be grabbed
             * for drag'n'drop, if it has no header, the entire window can be grabbed.
             * (Use of Script.aculo.us Draggable class)
             * @config draggable
             * @default false
             */
            draggable:false,
            /**
             * Title of the window (pertinent only if there _is_ a header).
             * @config title
             * @default ""
             */
            title: "",
            /**
             * URL of the file to get the content from. If `null`, no content is loaded
             * and you'll have to use the `setBody` method to add some content to your window.
             * @config ajax
             * @default null
             */
            ajax: null,
            /**
             * HashSet of parameters for the ajax call. E.g. `{ foo: "bar" }`
             * @config ajaxParameters
             * @default {}
             */
            ajaxParameters: {},
            /**
             * Flag indicating you want to add a modal behavior to the window
             * (overlay behind)
             * @config modal
             * @default false
             */
            modal: false,
            /**
             * The z-index base for this window. You can adjust it to match your design.
             * (the overlay (if any) will have this z-index and the window the same + 1)
             * @config zBase
             * @default 9998
             */
            zBase: 9998,
            /**
             * Background color of the overlay
             * @config overlayColor
             * @default #000000 (black)
             */
            overlayColor:'#000000',
            /**
             * Opacity of the overlay (from 0 to 1, 1 is opaque and 0 fully transparent)
             * @config overlayOpacity
             * @default 0.6
             */
            overlayOpacity:0.6,
            /**
             * If set to `true` the overlay will (dis)appear with a fade in/out effect
             * @config overlayFade
             * @default false
             */
            overlayFade:false,
            /**
             * The initial width of the window (in pixels)
             * @config width
             * @default null
             */
            width: null, // TODO in other units than px
            /**
             * The initial height of the window (in pixels)
             * @config height
             * @default null
             */
            heigth: null, // TODO same
            /**
             * Minimum width of the window (constrained)
             * @config minWidth
             * @default null
             */
            minWidth: null, // TODO same
            /**
             * Minimum Height of the window (constrained)
             * @config minHeight
             * @default null
             */
            minHeight: null, // TODO same
            /**
             * Maximum width of the window (constrained)
             * @config maxWidth
             * @default null
             */
            maxWidth: null, // TODO same
            /**
             * Maximum height of the window (constrained)
             * @config maxHeight
             * @default null
             */
            maxHeight: null, // TODO same
            /**
             * CSS "overflow" Property for the body of the window
             * (i.e. the window without header and footer).
             * Use in combination with maxWidth/maxHeight.
             * (`auto` adds scrollbar(s) if needed, `hidden` hides extra content,
             * `scroll` adds scrollbars, `scroll-x` and `scroll-y` add the corresponding scroll bar)
             * @config overflow
             * @default "auto"
             */
            overflow: "auto", // TODO
            /**
             * Make sure the window stay inside the viewport bounds (even when dragged)
             * @config constrainToViewport
             * @default true
             */
            constrainToViewport: true,

            top: null, // TODO
            left: null // TODO


        },
        events: {
            /**
             * Before the window is rendered (before any element is added)
             * @event beforeRenderEvent
             */
            beforeRenderEvent: Prototype.emptyFunction,
            /**
             * After the rendering step (the window is built)
             * @event afterRenderEvent
             */
            afterRenderEvent: Prototype.emptyFunction,
            /**
             * When the Ajax Request to retrieve the content of the window is completed
             * @event onAjaxRequestCompleteEvent
             * @param {Object} result the Ajax Request's result (get the text result with `result.responseText` for instance)
             */
            onAjaxRequestCompleteEvent: Prototype.emptyFunction,
            /**
             * When the window appears
             * @event onShowEvent
             */
            onShowEvent: Prototype.emptyFunction,
            /**
             * When the window disappears
             * @event onHideEvent
             */
            onHideEvent: Prototype.emptyFunction
        },
        defaultContainer:"div",
        text: {
            fr: {},
            en: {}
        }
    },

    initialize: function($super, eElement, oConfig) {
        $super(eElement, oConfig);

        this._level = this.cfg('zBase') + 2 * jplex.components.Frame.list.length + 1;
        this.render();

        jplex.components.Frame.list.push(this);

        this._evtMakeCentered = this.makeCentered.bind(this);
    },

    /**
     * Renders the component. Add elements depending on the configuration, apply CSS classes...
     */
    render: function() {

        this.fireEvent("beforeRenderEvent");

        this.component.addClassName("jplex-window");

        if (this.cfg("header")) {
            this._addHeader(this.cfg("title"));
        }


        this._addBody(this.component.textContent);
        this._body.setStyle({
            overflow:this.cfg("overflow")
        });

        if (this.cfg('ajax')) {
            this.reload();
        }

        if (this.cfg("footer")) {
            this._addFooter();
        }

        if (this.cfg("close") == jplex.components.Frame.CLOSE_BUTTON) {
            if (!this._header) {
                /* TODO Error */
            }
            this._addCloseButton();
        }

        if (this.cfg("modal")) {
            this._addOverlay();
        }

        if (this.cfg("draggable")) {
            if (this._header) {
                this._drag = new Draggable(this.component, {
                    handle: this._header,
                    snap: this._constrainToViewport.bind(this)
                });
            } else {
                this._drag = new Draggable(this.component, {
                    snap: this._constrainToViewport.bind(this)
                });
            }
        }

        this.component.setStyle({
            zIndex: this._level,
            display: 'none'
        });

        this.fireEvent("afterRenderEvent");
    },

    /**
     * If the header already exists, replace the title with the given string.
     * If not, create the title bar and set the given string as title.
     * @param {String} header the title of the window
     * @return {Element} The Header HTML extended Element
     */
    setHeader: function(header) {
        if (this._header) {
            this._header.down('div.title').update(header);
        } else {
            this._addHeader(header);
        }
        return this._header;
    },

    /**
     * Alias for setHeader
     * @param {String} title
     * @return {Element} The Header HTML extended Element
     */
    setTitle: function(title) {
        return this.setHeader(title);
    },

    /**
     * If the body already exists, update its content, else
     * create the body element and add the content.
     * @param {String} body Content of the body
     * @return {Element} The body HTML extended element
     */
    setBody: function(body) {
        this.makeCentered();

        if (this._body) {

            var _ghost = new Element("div");
            _ghost.update(body);

            // If the frame contains images, we have to wait them to be loaded
            // to get the correct position of the frame
            var imgs = _ghost.getElementsByTagName('img'); // TODO .collect("img")
            var loaded = $A([]);
            if (imgs.length > 0) {
                this.setLoading(true);

                $A(imgs).each(function(s, i) {
                    var img = $(s);
                    var bak = img.src;
                    loaded[i] = false;
                    if (Prototype.Browser.Opera)
                        img.src = "";
                    img.observe('load', function(e, pic, n) {
                        loaded[n] = true;
                        pic.show();
                        if (loaded.all()) {
                            this._body.update(_ghost.innerHTML);
                            this.setLoading(false);
                        }
                    }.bindAsEventListener(this, img, i));
                    if (Prototype.Browser.Opera) {
                        img.src = bak;
                        if (img.complete)
                            img.removeEvents();
                    }
                }, this);
            } else {
                this._body.update(_ghost.innerHTML);
                this.constrain();
            }
        } else {
            this._addBody(body);
        }

        this.constrain();
        this.fireEvent("onContentChangeEvent");

        return this._body;
    },

    /**
     * If the footer already exists, update the footer with the given content,
     * else create it and update the content.
     * @param {String} footer
     * @return {Element} the footer HTML extended element
     */
    setFooter: function(footer) {
        if (this._footer) {
            this._footer.update(footer);
        } else {
            this._addFooter(footer);
        }
        return this._footer;
    },

    /**
     * Add an overlay behind the window with configured opacity, color and behavior
     */
    _addOverlay: function() {

        this._overlay = new jplex.components.Overlay(this._sIDPrefix + "-overlay", {
            color: this.cfg('overlayColor'),
            z: this._level - 1,
            fade: this.cfg('overlayFade'),
            opacity: this.cfg('overlayOpacity')
        });

        this._overlay.component.observe("click", function(e) {
            if (this.cfg('close') == jplex.components.Frame.CLOSE_CLICK_OUT) {
                this.hide();
            }
            e.stop();
        }.bind(this));
    },

    /**
     * Add the close button to the title bar
     */
    _addCloseButton: function() {
        var close = new Element('a', {
            id: this.sID + "-closecross"
        });
        var elt = this._header.down('div.title') || this._body;

        close.addClassName('close').update('&nbsp;');
        close.observe('click', this.hide.bind(this));
        elt.appendChild(close);
    },

    /**
     * Create the title bar and returns it
     * @param {String} content title of the window
     */
    _addHeader: function(content) {
        var hd = new Element('div');
        var title = new Element('div');
        hd.appendChild(title.addClassName('title').update(content || ''));
        hd.addClassName('header');
        this.component.insert({
            top: hd
        });

        this._header = hd;
    },

    /**
     * Create the body and returns it
     * @param {String} content
     */
    _addBody: function(content) {
        var bd = new Element("div");

        bd.addClassName("body").update(content || "");
        if (this._header) {
            this._header.insert({
                after: bd
            });
        } else if (this._footer) {
            this._footer.insert({
                before: bd
            });
        } else {
            this.component.insert(bd);
        }

        this._body = bd;
    },

    /**
     * Create the footer and returns it
     * @param {String} content
     * @return {Element} the footer HTML extended Element
     */
    _addFooter: function(content) {
        var ft = new Element("div");
        ft.addClassName('footer').update(content || "");
        this.component.insert({
            bottom: ft
        });

        this._footer = ft;
    },

    /**
     * Load or reload the content of the body from the result of the ajax request
     * (the URL of the content is given by the `ajax` configuration parameter)
     */
    reload: function() {
        new Ajax.Request(this.cfg('ajax'), {
            parameters: this.cfg('ajaxParameters'),

            onSuccess: function(transport) {
                this.setBody(transport.responseText);
                this.setLoading(false);
                this.fireEvent('onAjaxRequestCompleteEvent', {result:transport});
            }.bind(this)
        });
    },

    /**
     * Show the frame
     */
    show: function() {
        if (this.cfg('modal')) {
            this._overlay.show();
        }
        if (this.cfg('constrainToCenter')) {
            this.makeCentered();
            Event.observe(window, 'scroll', this._evtMakeCentered);
            Event.observe(window, 'resize', this._evtMakeCentered);
        }
        this.component.show();

        this.fireEvent("onShowEvent");

    },

    /**
     * Hide the frame
     */
    hide: function() {
        if (this.cfg('modal'))
            this._overlay.hide();
        this.component.hide();
        Event.stopObserving(window, 'scroll', this._evtMakeCentered);
        Event.stopObserving(window, 'resize', this._evtMakeCentered);

        this.fireEvent("onHideEvent");

    },

    /**
     * Place the frame at the center of the viewport
     */
    makeCentered: function(stop) {
        var dim = this.component.getDimensions();
        var vdim = document.viewport.getDimensions();
        var scroll = document.viewport.getScrollOffsets();
        this.component.setStyle({
            top: Math.max(0, vdim.height / 2 - dim.height / 2 + scroll.top) + "px",
            left: Math.max(0, vdim.width / 2 - dim.width / 2 + scroll.left) + "px"
        });
        if (!stop)
            this._evtMakeCentered.delay(0.1, true);
    },

    /**
     * Show the "activity indicator" while the content of the frame is dynamically loaded
     * or hide it when it's done.
     * @param {bool} start `true` to start loading mode, `false` to stop it
     */
    setLoading: function(start) {
        var ld = this.component.down('div.loading');
        if (start) {
            if (!ld) {
                var ld = new Element("div").addClassName('loading');
                ld.setStyle({
                    zIndex:this._level + 2
                });
                ld.setOpacity(0.7);
                this.component.appendChild(ld);
            }
            ld.show();
        } else {
            if (ld) {
                ld.hide();
            }
        }
        this.constrain();
    },


    /**
     * Apply all positioning constraints to the window
     */
    constrain: function() {
        this._constrainToSize();
        if(this.cfg("center") && this.cfg("constrainToCenter")) {
            this.makeCentered();
        }
        if(this.cfg("constrainToViewport")) {
            this._constrainToViewport();
        }
    },

    //---------- Private methods ----------

    /**
     * Make sure the frame will be constrained to viewport bounds
     * @param {int} x
     * @param {int} y
     */
    _constrainToViewport: function(x, y) {
        if (!this.cfg("constrainToViewport"))
            return [x,y];
        
        if(typeof(x) == "undefined" || typeof(y) == "undefined") {
            var pos = this.component.cumulativeOffset();
            x = pos.left;
            y = pos.top;
        }
        var vpw = document.viewport.getWidth(),
                vph = document.viewport.getHeight(),
                w = this.component.getWidth(),
                h = this.component.getHeight();
        return[
            w > vpw ? 0 : (x < vpw - w ? (x > 0 ? x : 0 ) : vpw - w),
            h > vph ? 0 : (y < vph - h ? (y > 0 ? y : 0) : vph - h)];
    },

    /**
     * Make sure the frame size doesn't go off-limits
     */
    _constrainToSize: function() {

        // TODO Foire sur Opera visiblement (cf code-snippet)
        if (Prototype.Browser.Opera) {
            return;
        }

        var bd = this._body;

        var dimensions = {
            body: this._body.getDimensions(),
            frame: this.component.getDimensions()
        };

        dimensions.fixed = {
            width: dimensions.frame.width - dimensions.body.width,
            height: dimensions.frame.height - dimensions.body.height
        };


        var minW = null, minH = null, maxW = null, maxH = null;

        if (this.cfg("minWidth")) {
            minW = this.cfg("minWidth") - dimensions.fixed.width;
            bd.setStyle({
                minWidth: minW + "px"
            });
        }
        if (this.cfg("minHeight")) {
            minH = this.cfg("minHeight") - dimensions.fixed.height;
            bd.setStyle({
                minHeight: minH + "px"
            });
        }
        if (this.cfg("maxWidth")) {
            maxW = this.cfg("maxWidth") - dimensions.fixed.width;
            this.component.setStyle({
                maxWidth: maxW + "px"
            });
        }
        if (this.cfg("maxHeight")) {
            maxH = this.cfg("maxHeight") - dimensions.fixed.height;
            bd.setStyle({
                maxHeight: maxH + "px"
            });
        }

        if (Prototype.Browser.IE) {

            if (this.cfg("minWidth") && this.cfg("minWidth") > dimensions.frame.width) {
                bd.setStyle({
                    width: (this.cfg("minWidth") - dimensions.fixed.width) + "px"
                });
            }
            if (this.cfg("minHeight") && this.cfg("minHeight") > dimensions.frame.height) {
                bd.setStyle({
                    height: (this.cfg("minHeight") - dimensions.fixed.height) + "px"
                });
            }
            if (this.cfg("maxWidth") && this.cfg("maxWidth") < dimensions.frame.width) {
                this.component.setStyle({
                    width: (this.cfg("maxWidth") - dimensions.fixed.width) + "px"
                });
            }
            if (this.cfg("maxHeight") && this.cfg("maxHeight") < dimensions.frame.height) {
                bd.setStyle({
                    height: (this.cfg("maxHeight") - dimensions.fixed.height) + "px"
                });
            }
        }
    }

    //---------- Private properties ----------

    /**
     * Z-Index of the frame
     * @property _level
     * @type int
     * @private
     */

    /**
     * Overlay component below the frame (if exists)
     * @property _overlay
     * @type jplex.components.Overlay
     * @private
     */

    /**
     * The "header" html element (div) of the frame (if exists)
     * @property _header
     * @type Element
     * @private
     */

    /**
     * The "body" html element (div) of the frame
     * @property _body
     * @type Element
     * @private
     */

    /**
     * The "footer" html element (div) of the frame (if exists)
     * @property _footer
     * @type Element
     * @private
     */

    /**
     * The Draggable object (if the frame is draggable)
     * @property _drag
     * @type Draggable
     * @private
     */


});

//---------- Static properties ----------

jPlex.extend('jplex.components.Frame', {
    /**
     * Array of references to all window components used (useful to set z-indices)
     * @property list
     * @type Array
     * @static
     */
    list: $A([]),
    /**
     * Configuration constant: use a button to close the frame
     * @property CLOSE_BUTTON
     * @type String
     * @static
     */
    CLOSE_BUTTON: 'button',
    /**
     * Configuration constant: the frame is closed when the user clicks outside
     * @property CLOSE_CLICK_OUT
     * @type String
     * @static
     */
    CLOSE_CLICK_OUT: 'clickout',
    /**
     * Configuration constant: you decide when the frame is shown/hidden
     * @property CLOSE_CUSTOM
     * @type String
     * @static
     */
    CLOSE_CUSTOM: 'custom'
});