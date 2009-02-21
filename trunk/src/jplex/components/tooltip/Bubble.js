/**
 * Bubble component
 * @class tooltip.Bubble
 * @param {Element|String} eElement Element/ID element of the <code>&lt;div&gt;</code> container
 * @param {Object} oConfig Configuration object of the bubble
 * @extends jplex.common.Component
 * @constructor
 */
jPlex.provide('jplex.components.tooltip.Bubble', 'jplex.common.Component',  {
	
	_definition: {
		name:"Bubble",
		defaultConfig: {
			fade: 0.2,
			shadeWidth: 1,
			pin: "top-right"
		},
        defaultContainer: "div",
        text: {
			fr:{}, en:{}
		}
	},
	
	initialize: function($super, eElement, oConfig) {
		$super(eElement, oConfig);
		
		this.render();
	},
	
	render: function() {
		this.component.addClassName("jplex-bubble").setStyle({zIndex:100});
		
		var pin = new Element("div"),
			body = new Element("div"),
			shade = new Element("div");
			
		body.addClassName("body").update(this.component.innerHTML);
		this.component.innerHTML = "";
		
		var pinConfig = this.cfg("pin");

		pin.addClassName("bubble-pin");
		
		if("top-right" == pinConfig)
			pin.addClassName("bubble-pin-tr");
		if("top-left" == pinConfig)
			pin.addClassName("bubble-pin-tl");
		if("bottom-right" == pinConfig)
			pin.addClassName("bubble-pin-br");
		if("bottom-left" == pinConfig)
			pin.addClassName("bubble-pin-bl");
			
		this.component.appendChildren(body, pin);
		
		shade.addClassName("jplex-shade").addClassName("jplex-bubble");
		shade.setOpacity(0.3);
		shade.setStyle({
			padding: 0,
			zIndex: 99
		});
		document.body.appendChild(shade);
		this.eBody = body;
		this.eShade = shade;
		this.ePin = pin;
		
		this._fixShade();
		this._fixPin();
	},
	
	show: function() {
		this.component.show();
		this.eShade.show();
		this._fixShade();
	},
	
	hide: function() {
		this.component.hide();		
		this.eShade.hide();
	},
	
	setBody: function(sText) {
		this.eBody.update(sText);
		this._fixShade();
		this._fixPin();
	},
	
	setPosition: function(top, left) {
		this.component.setStyle({
			top: top+"px",
			left: left+"px"
		});
		this._fixShade();
		this._fixPin();
	},
	
	_fixShade: function() {
		var pos = this.component.cumulativeOffset();
		this.eShade.setStyle({
			width: (this.component.getWidth()) + "px",
			height: (this.component.getHeight()) + "px",
			top: (pos.top + this.cfg("shadeWidth") - 1) + "px",
			left: (pos.left + this.cfg("shadeWidth") - 1) + "px"
		});
	},
	
	_fixPin: function() {
		var pinConfig = this.cfg("pin"),
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
		this.ePin.setStyle({
			top: top + "px",
			width: width + "px"
		});
	}
});

