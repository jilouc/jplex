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
            shadeWidth: 1
        },
        defaultContainer:"span",
        text: {
			fr: {}, en: {}
		}
	},

	initialize: function($super, eElement, oConfig) {
		$super(eElement, oConfig);
		this.render();
		this.component.observe("mouseover", this._onMouseOver.bindAsEventListener(this));
		this.oBubble.component.observe("mouseover", this._onMouseOver.bindAsEventListener(this));
		this.component.observe("mouseout", this._onMouseOut.bindAsEventListener(this));
		this.oBubble.component.observe("mouseout", this._onMouseOut.bindAsEventListener(this));
	},

	render: function() {
		this.component.addClassName("jplex-bubbler");
        
        var div = new Element("div");
		document.body.appendChild(div);
		this.oBubble = new jplex.components.tooltip.Bubble(div, {
			pin: this.cfg("position"),
            shadeWidth: this.cfg("shadeWidth")
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
			top = top - this.oBubble.component.getHeight() - 10;
			left += 10;
		} else if("top-left" == position) {
			top  = top - this.oBubble.component.getHeight() - 10;
			left = left - (5*this.oBubble.component.getWidth())/6 + 30;
		} else if("bottom-left" == position) {
			top = top + this.component.getHeight() + 15;
			left = left - (5*this.oBubble.component.getWidth())/6 + 30;
		} else if("bottom-right" == position) {
			top = top + this.component.getHeight() + 15;
			left += 10;
		}
		this.oBubble.setPosition(top, left);
	},

	_onMouseOut: function(e) {
		e = Event.extend(window.event ? window.event : e);
		this.oBubble.hide();
	}
});