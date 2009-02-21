/**
 * @description Overlay component.
 * Place a semi transparent layer which covers its parent on the page. 
 * @class Overlay
 * @extends jplex.common.Component
 * @param {Element|String} eElement the component element (div) or ID. If it doesn't exist in the DOM, create it
 * @param {Object} oConfig Configuration properties of the component
 * @constructor
 */
jPlex.provide('jplex.components.Overlay', 'jplex.common.Component',  {

    /**
     * Definitions for the Overlay 
     * (includes <code>_definition.defaultConfig</code> storing the default configuration)
     * @property _definition
     * @private
     * @type Object
     */
    _definition: {
        name:"Overlay",
        defaultConfig: {
            opacity:0.75,
            fade:0,
            z:1,
            color:"#000000",

            events: {
                beforeRenderEvent: Prototype.emptyFunction,
                afterRenderEvent: Prototype.emptyFunction,
                onShowEvent: Prototype.emptyFunction,
                onHideEvent: Prototype.emptyFunction
            }
        },
        defaultContainer: "div",
        lang: {
            fr:{},
            en:{}
        }
    },

/**
 * Fired after the rendering of the overlay
 * @event afterRenderElement
 */

/**
 * Fired before the rendering of the overlay
 * @event beforeRenderEvent
 */

/**
 * Fired after the overlay is shown
 * @event onShowEvent
 */

/**
 * Fired after the overlay is hidden
 * @event onHideEvent
 */


    initialize: function($super, eElement, oConfig) {
        $super(eElement, oConfig);

        // Call to the renderer
        this.render();
    },

    /**
     * Renders the overlay 
     */
    render: function() {
        this.fireEvent("beforeRenderEvent");

        if(Prototype.Browser.IE) {
            this.component.setStyle({
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: this.cfg("z"),
                background: this.cfg("color")
            });
            var resize = function() {
                var dim = document.viewport.getDimensions();
                var offsets = document.viewport.getScrollOffsets();

                this.component.setStyle({
                    width: dim.width+"px",
                    height: dim.height+"px",
                    top: offsets.top+"px",
                    left: offsets.left+"px"
                })
            }.bind(this);
            Event.observe(window, 'resize', resize);
            Event.observe(window, 'scroll', resize);
            this.setEvent("IEonShowEvent", resize);
        } else {
            this.component.setStyle({
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: this.cfg("z"),
                background: this.cfg("color")
            });
        }

        this.component.setOpacity(this.cfg("opacity"));
        this.component.setStyle({display:'none'});
        this.fireEvent("afterRenderEvent");
    },

/**
 * Show the overlay
 */
    show: function() {
        if(this.cfg('fade') == 0) {
            this.component.show();
        } else {
            new Effect.Appear(this.component, {duration:this.cfg('fade'), to:this.cfg('opacity')});
        }
        this.fireEvent("IEonShowEvent");
        this.fireEvent("onShowEvent");
    },

/**
 * Hide the overlay
 */
    hide: function() {
        if(this.cfg('fade') == 0) {
            this.component.hide();
        } else {
            new Effect.Fade(this.component, {duration:this.cfg('fade')});
        }
        this.fireEvent("onHideEvent");
    },

    up: function() {
        var z = parseInt(this.component.getStyle("zIndex"));
        alert("Setting z to "+(z+2))
        this.component.setStyle({zIndex: +2});
    },

    down: function() {
        var z = parseInt(this.component.getStyle("zIndex"));
        this.component.setStyle({zIndex: z-2});
        if(z-2 < 0) this.hide();
    }
});