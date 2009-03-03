jPlex.include('jplex.components.Overlay', true);
/**
 * Window component.
 * Blablabla
 * @class Window
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
            header: true,
            footer: false,

            center: true,
            constrainToCenter: false,

            close:'button', // jplex.components.Frame.CLOSE_CLICK_OUT
            draggable:false,

            title: "",

            ajax: null,
            ajaxParameters: {},

            modal: false,
            zBase: 9998,

            overlay: false,
            overlayColor:'#000000',
            overlayOpacity:0.6,
            overlayFade:false,

            width: null,
            heigth: null,
            top: null,
            left: null,
            constrainToViewport: true,

            events: {
                beforeRenderEvent: Prototype.emptyFunction,
                afterRenderEvent: Prototype.emptyFunction,
                onAjaxRequestCompleteEvent: Prototype.emptyFunction,
                onShowEvent: Prototype.emptyFunction,
                onHideEvent: Prototype.emptyFunction
            }
        },
        defaultContainer:"div",
        text: {
            fr: {},
            en: {}
        }
    },

    initialize: function($super, eElement, oConfig) {
        $super(eElement, oConfig);

        this.nLevel = this.cfg('zBase') + 2 * jplex.components.Frame.list.length + 1;
        this.render();

        jplex.components.Frame.list.push(this);

        this._evtMakeCentered = this.makeCentered.bind(this);
    },

    render: function() {

        this.fireEvent("beforeRenderEvent");

        this.component.addClassName("jplex-window");

        var hd, bd, ft;

        var content = !hd && !ft && !bd ? this.component.textContent : "";

        if (this.cfg("header")) {
            hd = this._addHeader(this.cfg("title"));
        }

        bd = this._addBody(content);

        if (this.cfg('ajax')) {
            this.reload();
        }

        if (this.cfg("footer")) {
            ft = this._addFooter();
        }

        if (this.cfg("close") == jplex.components.Frame.CLOSE_BUTTON) {
            if (!hd) { /* TODO Error */
            }
            this._addCloseButton();
        }

        if (this.cfg("modal")) {
            this._addOverlay();
        }

        if (this.cfg("draggable")) {
            if (hd) {
                this.drag = new Draggable(this.component, {
                    handle: hd,
                    snap: this._constrainToViewport.bind(this)
                });
            } else {
                this.drag = new Draggable(this.component, {
                    snap: this._constrainToViewport.bind(this)
                });
            }
        }

        this.component.setStyle({
            zIndex: this.nLevel,
            display: 'none'
        });

        this.fireEvent("afterRenderEvent");
    },

    setHeader: function(sHead) {
        var hd = this.component.down("div.header");
        if (hd) {
            hd.down('span.title').update(sHead);
        } else {
            hd = this._addHeader(sHead);
        }
        return hd;
    },

    setTitle: function(sTitle) {
        this.setHeader(sTitle);  
    },

    setBody: function(sBody) {
        var bd = this.component.down("div.body");
        if (bd) {
            bd.update(sBody);

            if (this.cfg('center')) {
                // If the frame contains images, we have to wait them to be loaded
                // to get the correct position of the frame
                var imgs = bd.getElementsByTagName('img');
                var loaded = $A([]);
                if (imgs.length > 0) {
                    this.setLoading(true);
                }
                $A(imgs).each(function(s, i) {
                    var img = $(s);
                    var bak = img.src;
                    loaded[i] = false;
                    if(Prototype.Browser.Opera) 
                        img.src = "";
                    img.hide();
                    img.observe('load', function(e, pic, n) {
                        loaded[n] = true;
                        pic.show();
                        if (loaded.all()) {
                            this.setLoading(false);
                            this.makeCentered();
                        }
                    }.bindAsEventListener(this, img, i));    
                    if(Prototype.Browser.Opera) {
                        img.src = bak;
                        if (img.complete) 
                        img.removeEvents();                                            
                    }
                }, this);
            }
            this.makeCentered();
        } else {
            bd = this._addBody(sBody);
        }
        this.fireEvent("onContentChangeEvent");
        return bd;
    },

    setFooter: function(sFooter) {
        var ft = this.component.down("div.footer");
        if (ft) {
            ft.update(sFooter);
        } else {
            ft = this._addFooter(sFooter);
        }
        return ft;
    },

    _addOverlay: function() {

        this.oOverlay = new jplex.components.Overlay(this._sIDPrefix + "-overlay", {
            color:this.cfg('overlayColor'),
            z: this.nLevel - 1,
            fade:this.cfg('overlayFade'),
            opacity:this.cfg('overlayOpacity')
        });

        this.oOverlay.component.observe("click", function(e) {
            if (this.cfg('close') == jplex.components.Frame.CLOSE_CLICK_OUT) {
                this.hide();
            }
            e.stop();
        }.bind(this));
    },

    _addCloseButton: function() {
        var close = new Element('a', {id:this.sID + "-closecross"}),
                elt = this.component.down('div.header') || this.component.down('div.body');

        close.addClassName('close').update('&nbsp;');
        close.observe('click', this.hide.bind(this));
        elt.appendChild(close);
    },

    _addHeader: function(content) {
        var hd = new Element('div'),
                span = new Element('span');
        hd.appendChild(span.addClassName('title').update(content || ''));
        hd.addClassName('header');
        this.component.insert({top:hd});
        return hd;
    },

    _addBody: function(content) {
        var bd = new Element("div"),
                hd = this.component.down("div.header"),
                ft = this.component.down("div.footer");

        bd.addClassName("body").update(content || "");
        if (hd) {
            hd.insert({after:bd});
        } else if (ft) {
            ft.insert({before:ft});
        } else {
            this.component.insert(bd);
        }
        return bd;

    },

    _addFooter: function(content) {
        var ft = new Element("div");
        ft.addClassName('footer').update(content || "");
        this.component.insert({bottom:ft});
        return ft;
    },

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

    show: function() {
        if (this.cfg('modal')) {
            this.oOverlay.show();
        }
        if (this.cfg('constrainToCenter')) {
            this.makeCentered();
            Event.observe(window, 'scroll', this._evtMakeCentered);
            Event.observe(window, 'resize', this._evtMakeCentered);
        }
        this.component.show();

        this.fireEvent("onShowEvent");

    },

    hide: function() {
        if (this.cfg('modal'))
            this.oOverlay.hide();
        this.component.hide();
        Event.stopObserving(window, 'scroll', this._evtMakeCentered);
        Event.stopObserving(window, 'resize', this._evtMakeCentered);

        this.fireEvent("onHideEvent");

    },

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

    _constrainToViewport: function(x, y, draggable) {
        if (!this.cfg("constrainToViewport"))
            return [x,y];
        var vpw = document.viewport.getWidth(),
                vph = document.viewport.getHeight(),
                w = draggable.element.getWidth(),
                h = draggable.element.getHeight();
        return[
            w > vpw ? 0 : (x < vpw - w ? (x > 0 ? x : 0 ) : vpw - w),
            h > vph ? 0 : (y < vph - h ? (y > 0 ? y : 0) : vph - h)];
    },

    setLoading: function(mode) {
        var bd = this.component.down('div.body');
        var ld = this.component.down('div.loading');
        if (mode) {
            bd.hide();
            if (!ld) {
                var loading = new Element("div").addClassName('loading');
                this.component.insertBefore(loading, bd);
            } else {
                ld.show();
            }
        } else {
            bd.show();
            if (ld) {
                ld.hide();
            }
        }
    }


});

// Static properties

jPlex.extend('jplex.components.Frame', {
    /**
     *
     * @property list
     * @type Array
     * @static
     */
    list: $A([]),
    CLOSE_BUTTON: 'button',
    CLOSE_CLICK_OUT: 'clickout',
    CLOSE_CUSTOM: 'custom'
});