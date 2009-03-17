jPlex.include('jplex.components.tooltip.Bubble', true);
/**
 * Tooltip component
 * 
 * This simple component is commonly used to create <em>help</em> tips on a page.  
 * @class Tooltip
 * @extends jplex.common.Component
 * @requires tooltip.Bubble
 */
jPlex.provide('jplex.components.Tooltip', 'jplex.common.Component',  {

	_definition: {
		name: "Tooltip",
		defaultConfig: {
            /**
             * Inner text of the bubble. You can put HTML code if you want
             * @config text
             * @default ""
             */
			text: "",
            /**
             * Sets the position of the bubble relative to the source component. This parameter must be expressed 
             * as a join of two strings. The first one is the vertical align (`top` or `bottom`) and the second is 
             * the horizontal align (`left` or `right`)
             * @config position
             * @default "top-right"
             */
			position: "top-right",
            /**
             * The bubble has a `div` shade, with this little parameter you can configure how to render it
             * @config shadeWidth
             * @default 1
             */
            shadeWidth: 1,
            /**
             * Sets the trigger type to show/hide the bubble. The three types of triggers are defined in the static
             * properties
             * @config trigger
             * @default Tooltip.TRIGGER_MOUSEOVER
             */
            trigger: "mouseover", // jplex.components.Tooltip.TRIGGER_MOUSEOVER
            /**
             * Sets the position of the bubble compared to the element. This ratio is the x-position of the pin related 
             * to the beginning (or end) of the element divided by the width of the element
             * @config positionRatio
             * @default 0.83
             */
            positionRatio: 0.83,
            /**
             * Sets the zIndex of the bubble
             * @config zIndex
             * @default 99
             */
            zIndex: 99
        },
        events: {
            /**                   
             * Fired after showing the component
             * @event onShowEvent
             */
            onShowEvent: Prototype.emptyFunction,
            
            /**
             * Fired after hiding the component
             * @event onHideEvent
             */
            onHideEvent: Prototype.emptyFunction
        },
        defaultContainer:"span",
        text: {
			fr: {}, en: {}
		}
	},

	initialize: function($super, eElement, oConfig) {
		$super(eElement, oConfig);
		this.render();

        if(this.cfg("trigger") == jplex.components.Tooltip.TRIGGER_MOUSEOVER) {
            this.component.observe("mouseover", this.show.bindAsEventListener(this));
            this.oBubble.component.observe("mouseover", this._onMouseOver.bindAsEventListener(this));
            this.component.observe("mouseout", this.hide.bindAsEventListener(this));
            this.oBubble.component.observe("mouseout", this._onMouseOut.bindAsEventListener(this));
        } else if(this.cfg("trigger") == jplex.components.Tooltip.TRIGGER_CLICK) {
            this.component.observe("click", this.show.bindAsEventListener(this));
            document.observe("click", (function(e) {
                var x = e.pointerX(),
                    y = e.pointerY();
                if (!this.component.isWithin(x, y) &&
                    !this.oBubble.component.isWithin(x, y)) {
                    this.hide(e);
                }

            }).bindAsEventListener(this));
        }
	},

    /**
     * Renders the bubble and hide it
     */
	render: function() {
		this.component.addClassName("jplex-bubbler");
        
        var div = new Element("div");
		document.body.appendChild(div);
		this.oBubble = new jplex.components.tooltip.Bubble(div, {
			pin: this.cfg("position"),
            shadeWidth: this.cfg("shadeWidth"),
            positionRatio: this.cfg("positionRatio"),
            zIndex: this.cfg("zIndex")
        });
		this.oBubble.setBody(this.cfg("text"));
		this.oBubble.hide();
	},

	_onMouseOver: function(e) {
		e = Event.extend(window.event ? window.event : e);
		this.oBubble.show();
        
        var pos = this.component.cumulativeOffset();
		var position = this.cfg("position"),
			left = pos.left, top = pos.top;
		if ("top-right" == position) {
			top = top - this.oBubble.component.getHeight() - 15;
			left += Math.floor(this.component.getWidth()*this.cfg('positionRatio')) -10;
		} else if("top-left" == position) {
			top  = top - this.oBubble.component.getHeight() - 15;
			left = left - (5*this.oBubble.component.getWidth())/6 + this.component.getWidth()*(1-this.cfg('positionRatio'))-5;
		} else if("bottom-left" == position) {
			top = top + this.component.getHeight() + 15;
			left = left - (5*this.oBubble.component.getWidth())/6 + this.component.getWidth()*(1-this.cfg('positionRatio'))-5;
		} else if("bottom-right" == position) {
			top = top + this.component.getHeight() + 15;
			left += Math.floor(this.component.getWidth()*this.cfg('positionRatio'))-10;
		}
		this.oBubble.setPosition(top, left);
	},

	_onMouseOut: function(e) {
		e = Event.extend(window.event ? window.event : e);
		this.oBubble.hide();
	},

    /**
     * Shows the bubble 
     * @param e `unused` Click event
     */
    show: function(e) {
        this._onMouseOver(e);
        this.fireEvent("onShowEvent");
    },
      
    /**
     * Hides the bubble 
     * @param e `unused` Click event
     */
    hide: function(e) {
        this._onMouseOut(e);
        this.fireEvent("onHideEvent");
    }
});


// Static properties

jPlex.extend('jplex.components.Tooltip', {
    /**
     * The bubble will be shown if the element is hovered by the mouse
     * @property TRIGGER_MOUSEOVER
     * @static
     * @type String
     */
    TRIGGER_MOUSEOVER: "mouseover",
    /**
     * The bubble will be shown if the user clicks on the element
     * @property TRIGGER_CLICK
     * @static
     * @type String
     */
    TRIGGER_CLICK: "click",
    /**
     * The bubble will not be shown by an event, the user must directly call `show`/`hide` functions
     * @property TRIGGER_CUSTOM
     * @static
     * @type String
     */
    TRIGGER_CUSTOM: "custom"
});