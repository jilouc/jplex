jPlex.include('jplex.components.tooltip.Bubble', true);
/**
 * Tooltip component.
 * @class Tooltip
 * @extends jplex.common.Component
 * @requires tooltip.Bubble
 */
jPlex.provide('jplex.components.Tooltip', 'jplex.common.Component',  {

	_definition: {
		name: "Tooltip",
		defaultConfig: {
			text: "Tooltip",
			position: "top-right",
            shadeWidth: 1,
            trigger: "mouseover", // jplex.components.Tooltip.TRIGGER_MOUSEOVER
            positionRatio: 0.83
        },
        // TODO Add Events
        // TODO Doc
        defaultContainer:"span",
        text: {
			fr: {}, en: {}
		}
	},

	initialize: function($super, eElement, oConfig) {
		$super(eElement, oConfig);
		this.render();

        if(this.cfg("trigger") == jplex.components.Tooltip.TRIGGER_MOUSEOVER) {
            this.component.observe("mouseover", this._onMouseOver.bindAsEventListener(this));
            this.oBubble.component.observe("mouseover", this._onMouseOver.bindAsEventListener(this));
            this.component.observe("mouseout", this._onMouseOut.bindAsEventListener(this));
            this.oBubble.component.observe("mouseout", this._onMouseOut.bindAsEventListener(this));
        } else if(this.cfg("trigger") == jplex.components.Tooltip.TRIGGER_CLICK) {
            this.component.observe("click", this._onMouseOver.bindAsEventListener(this));
            document.body.observe("click", (function(e) {
                var x = e.pointerX(),
                    y = e.pointerY();
                if (!this.component.isWithin(x, y) &&
                    !this.oBubble.component.isWithin(x, y)) {
                    this._onMouseOut(e);
                }

            }).bindAsEventListener(this));
        }
	},

	render: function() {
		this.component.addClassName("jplex-bubbler");
        
        var div = new Element("div");
		document.body.appendChild(div);
		this.oBubble = new jplex.components.tooltip.Bubble(div, {
			pin: this.cfg("position"),
            shadeWidth: this.cfg("shadeWidth"),
            positionRatio: this.cfg("positionRatio")
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

    show: function() {
        this._onMouseOver();
    },

    hide: function() {
        this._onMouseOut();
    }
});


// Static properties

jPlex.extend('jplex.components.Tooltip', {

    TRIGGER_MOUSEOVER: "mouseover",
    TRIGGER_CLICK: "click",
    TRIGGER_CUSTOM: "custom"
});