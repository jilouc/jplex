/**
 * Tooltip component
 * 
 * This simple component is commonly used to create <em>help</em> tips on a page.  
 * @class Tooltip
 * @extends jplex.common.Component
 */
jPlex.provide('jplex.components.Tooltip', 'jplex.common.Component',  {

	_definition: {
		name: "Tooltip",
		defaultConfig: {
            /**
             * The HTML Element that will be the source of the tooltip. Basically, when the mouse enters
             * this element, the tooltip is shown.
             * If no `source` is given, the tooltip is associated with the element that has the following ID:
             * `<the tooltip ID>-source`. If not present, `document.body` is used.
             * @config source
             * @default <component ID>-source
             */
            source: null,
            /**
             * Inner text of the bubble. You can put HTML code if you want
             * @config content
             * @default ""
             */
			content: "",
            /**
             * Sets the position of the bubble relative to the source component. This parameter must be expressed 
             * as a join of two strings. The first one is the vertical align (`top` or `bottom`) and the second is 
             * the horizontal align (`left` or `right`)
             * @config position
             * @default "top-right"
             */
			position: "top-right",
            /**
             * The bubble has a `div` shadow, with this little parameter you can configure how to render it
             * @config shadowWidth
             * @default 1
             */
            shadowWidth: 1,
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
        defaultContainer: "div"
	},

	initialize: function($super, eElement, oConfig) {
		$super(eElement, oConfig);
		this.render();

        if(this.cfg("trigger") == jplex.components.Tooltip.TRIGGER_MOUSEOVER) {
            this._source.observe("mouseover", this.show.bindAsEventListener(this));
            this.component.observe("mouseover", this.show.bindAsEventListener(this));
            this._source.observe("mouseout", this.hide.bindAsEventListener(this));
            this.component.observe("mouseout", this.hide.bindAsEventListener(this));
        } else if(this.cfg("trigger") == jplex.components.Tooltip.TRIGGER_CLICK) {
            this._source.observe("click", this.show.bindAsEventListener(this));
            document.observe("click", function(e) {
                var x = e.pointerX(),
                    y = e.pointerY();
                if (!this._source.isWithin(x, y) &&
                    !this.component.isWithin(x, y)) {
                    this.hide();
                }

            }.bindAsEventListener(this));
        }
	},

    /**
     * Render the bubble and hide it
     */
	render: function() {

        if(this.cfg("source")) {
            this._source = $(this.cfg("source"));
        }
        if(!this._source) {
            this._source = $(this.component.id+"-source");
        }
        if(!this._source) {
            this._source = $(document.body);
        }


        this.component.addClassName("jplex-tooltip").setStyle({
            zIndex:this.cfg("zIndex") + 1
        });

		this._pin = new Element("div");
		this._body = new Element("div");
		this._shadow = new Element("div");

		this._body.addClassName("body");

		var pinConfig = this.cfg("position");

		this._pin.addClassName("bubble-pin");

		if("top-right" == pinConfig)
			this._pin.addClassName("bubble-pin-tr");
		if("top-left" == pinConfig)
			this._pin.addClassName("bubble-pin-tl");
		if("bottom-right" == pinConfig)
			this._pin.addClassName("bubble-pin-br");
		if("bottom-left" == pinConfig)
			this._pin.addClassName("bubble-pin-bl");

		this.component.appendChildren(this._body, this._pin);

		this._shadow.addClassName("jplex-tooltip-shadow").addClassName("jplex-tooltip");
		this._shadow.setOpacity(0.3);
		this._shadow.setStyle({
			padding: 0,
			zIndex: this.cfg('zIndex')
		});
		document.body.appendChild(this._shadow);

		this._fixShadow();
		this._fixPin();

		this._source.addClassName("jplex-bubbler");      

		this.setContent(this.cfg("content"));
		this.hide();
	},

    /**
     * Set the content of the tooltip (Support HTML content) 
     * @param newContent Raw text or HTML content
     */
    setContent: function(newContent) {
		this._body.update(newContent);
		this._fixShadow();
		this._fixPin();
	},

    /**
     * Get the body `div` HTML element of the tooltip (content placeholder)
     * @return {Element} the body of the tooltip 
     */
    getBody: function() {
        return this._body;
    },

    /**
     * Get the source HTML Element that triggers the tooltip
     * @return {Element} the source element of the tooltip
     */
    getSource: function() {
        return this._source;
    },

    /**
     * Set the absolute position of the tooltip on the viewport
     * @param top top offset in pixels (relative to the viewport)
     * @param left left offset in pixels (relative to the viewport)
     */
	setPosition: function(top, left) {
		this.component.setStyle({
			top: top+"px",
			left: left+"px"
		});
		this._fixShadow();
		this._fixPin();
	},

    /**
     * Shows the bubble
     */
    show: function() {

        this.component.show();
        this._shadow.show();
        
        var pos = this._source.cumulativeOffset();
		var position = this.cfg("position"),
			left = pos.left, top = pos.top;
		if ("top-right" == position) {
			top = top - this.component.getHeight() - 15;
			left += Math.floor(this._source.getWidth()*this.cfg('positionRatio')) -10;
		} else if("top-left" == position) {
			top  = top - this.component.getHeight() - 15;
			left = left - (5*this.component.getWidth())/6 + this._source.getWidth()*(1-this.cfg('positionRatio'))-5;
		} else if("bottom-left" == position) {
			top = top + this._source.getHeight() + 15;
			left = left - (5*this.component.getWidth())/6 + this._source.getWidth()*(1-this.cfg('positionRatio'))-5;
		} else if("bottom-right" == position) {
			top = top + this._source.getHeight() + 15;
			left += Math.floor(this._source.getWidth()*this.cfg('positionRatio'))-10;
		}
		this.setPosition(top, left);

        this._fixShadow();
        this.fireEvent("onShowEvent");
    },
      
    /**
     * Hides the bubble
     */
    hide: function() {
        this.component.hide();
        this._shadow.hide();
        this.fireEvent("onHideEvent");
    },


    //---------- Private Methods ----------

    /**
     * Adjust the position of the tooltip shadow
     */
    _fixShadow: function() {
		var pos = this.component.cumulativeOffset();
		this._shadow.setStyle({
			width: (this.component.getWidth()) + "px",
			height: (this.component.getHeight()) + "px",
			top: (pos.top + this.cfg("shadowWidth") - 1) + "px",
			left: (pos.left + this.cfg("shadowWidth") - 1) + "px"
		});
	},

    /**
     * Adjust the position of the tooltip pin
     */
	_fixPin: function() {
		var pinConfig = this.cfg("position"),
			top = 0, width = 0,
			w = this.component.getWidth();

		if ("top-right" == pinConfig) {
			top = this.component.getHeight() - 2;
			width = w;
		} else if("top-left" == pinConfig) {
			top = this.component.getHeight() - 2;
			width = Math.floor(5*w/6);
		} else if("bottom-right" == pinConfig) {
			top = -20;
			width = w;
		} else if("bottom-left" == pinConfig) {
			top = -20;
			width = Math.floor(5*w/6);
		}
		this._pin.setStyle({
			top: top + "px",
			width: width + "px"
		});
	}


    //---------- Private properties ----------

    /**
     * @property _source
     * @type {Element}
     * @private
     */

    /**
     * @property _pin
     * @type {Element}
     * @private
     */

    /**
     * @property _shadow
     * @type {Element}
     * @private
     */

    /**
     * @property _body
     * @type {Element}
     * @private
     */
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