/**
 * @description Overlay component.
 * Place a semi-transparent layer which covers the source element on the page.
 * If no source is given, the overlay covers the entire body of the page.
 * It's mainly used by the Modal Frame component.
 * @class Overlay
 * @extends jplex.common.Component
 * @param {Element|String} element the component element (div) or ID. If it doesn't exist in the DOM, create it
 * @param {Object} config Configuration properties of the component
 * @constructor
 */
jPlex.provide('jplex.components.Overlay', 'jplex.common.Component', {

    _definition: {
        name:"Overlay",
        defaultConfig: {
            /**
             * Opacity of the overlay
             * @config opacity
             * @default 0.75
             */
            opacity:0.75,
            /**
             * If `true` the overlay will be shown/hidden using fade in/out
             * @config fade
             * @default false
             */
            fade:false,
            /**
             * z-index for the overlay
             * @config z
             * @default 1
             */
            z:1,
            /**
             * Color of the overlay
             * @config color
             * @default "#000000" (black)
             */
            color:"#000000",
            /**
             * Element which will be covered by the overlay
             * @config source
             * @default document.body
             */
            source: document.body

        },
        events: {
            /**
             * Fired before the rendering of the overlay
             * @event beforeRenderEvent
             */
            beforeRenderEvent: Prototype.emptyFunction,
            /**
             * Fired after the rendering of the overlay
             * @event afterRenderElement
             */
            afterRenderEvent: Prototype.emptyFunction,

            /**
             * Fired after the overlay is shown
             * @event onShowEvent
             */
            onShowEvent: Prototype.emptyFunction,

            /**
             * Fired after the overlay is hidden
             * @event onHideEvent
             */
            onHideEvent: Prototype.emptyFunction
        },
        defaultContainer: "div"
    },

    initialize: function($super, element, config) {
        $super(element, config);

        // Call to the renderer
        this.render();
    },

    /**
     * Renders the overlay
     */
    render: function() {
        this.fireEvent("beforeRenderEvent");

        if (!$(this.cfg("source")) || this.cfg("source") == document.body) {

            if (Prototype.Browser.IE6) {
                this.component.setStyle({
                    top: 0,
                    left: 0,                
                    position: "absolute"

                });
                var resize = function() {
                    var dim = document.viewport.getDimensions();
                    var offsets = document.viewport.getScrollOffsets();

                    this.component.setStyle({
                        width: dim.width + "px",
                        height: dim.height + "px",
                        top: offsets.top + "px",
                        left: offsets.left + "px"
                    });
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
        } else {
            this.component.clonePosition(this.cfg("source"));
            this.component.setStyle({
                position:"absolute",
                zIndex: this.cfg("z")
            });
            if(Prototype.Browser.IE) {
                var offsets = document.viewport.getScrollOffsets();
                var pos = this.component.cumulativeOffset();
                this.component.setStyle({
                    top: (pos.top+offsets.top)+"px",
                    left: (pos.left+offsets.left)+"px"
                });
            }
        }

        this.component.setStyle({
            zIndex: this.cfg("z"),
            background: this.cfg("color"),
            display: "none"

        });

        this.component.setOpacity(this.cfg("opacity"));

        this.fireEvent("afterRenderEvent");
    },

    /**
     * Show the overlay
     */
    show: function() {
        if (!this.cfg('fade')) {
            this.component.show();
        } else {
            new Effect.Appear(this.component, {
                duration: this.cfg('fade'),
                to: this.cfg('opacity')
            });
        }
        this.fireEvent("IEonShowEvent");
        this.fireEvent("onShowEvent");
    },

    /**
     * Hide the overlay
     */
    hide: function() {
        if (!this.cfg('fade')) {
            this.component.hide();
        } else {
            new Effect.Fade(this.component, {
                duration:this.cfg('fade')
            });
        }
        this.fireEvent("onHideEvent");
    }
});