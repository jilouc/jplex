/**
 * This component is a little utility that adds a simple image in a container that appears only on mouse over.
 * It is useful in cases of optional actions that spams the render if they are all visible.
 * 
 * There are two rendering methods for this component. Both have advantages and drawbacks: 
 * <ul>
 * <li>float:    Use of the css float property to display the image. The component accepts only two positions 'left'
 * and 'right'. </li>
 * <li>absolute: Use of the css position absolute property. Can take all position wanted but can not accepts 
 * multiples components on one single container</li>
 * </ul>
 *      
 * @param {Element} eElement The container HTML Element 
 * @param {Object} oConfig The configuration object
 * @class MouseOverImage
 * @extends jplex.common.Component
 * @constructor
 */
jPlex.provide('jplex.components.MouseOverImage', 'jplex.common.Component', {
    _definition: {
        name: 'MouseOverImage',
        defaultConfig: {
            /**
             * Defines the position of the image. 
             * The different positions can be set with bottom, top, center and left, right.
             * You can do combination with a caret '-', like 'bottom-left'.
             * @config position
             * @default "top-right"
             */
            position:'top-right',
            /**
             * Indicates the css style to use (must be defined if img is not)
             * @config style
             * @default false
             */
            style:false,
            /**
             * Indicates the url of the image to show (must be defined if style is not)
             * @config img
             * @default false
             */
            img:false,
            /**
             * See before...
             * @config method
             * @default "absolute"
             */
            method: 'absolute',
            /**
             * Number of pixels to escape from the border
             * @config padding
             * @default 4
             */
            padding: 4
        },            
        events: {
            /**
             * Binds the click event on the image.
             * @config onClickEvent
             * @default false
             */
            onClickEvent: Prototype.emptyFunction
        },
        defaultContainer: "div"
    },
    initialize: function($super, eElement, oConfig) {
        $super(eElement, oConfig);
        var e;
        if (this.cfg('img')) {
            e = new Element('div');
            e.appendChild(new Element("img", {border:0, src:this.cfg('img')}));
        } else if (this.cfg('style'))
            e = new Element("span").update(' ');
        else
            throw {message:"Mandatory argument not provided"};
        this.eImg = e;
        if (this.cfg('style'))
            e.addClassName(this.cfg('style'));
        e.hide();

        this.component.insert({top:e});

        this.position = this._getPositionFromCfg();
        this._bindEvents();

        if (this.cfg('method') == 'float') {
            if(this.position[1] != 'left' && this.position[1] != 'right')
                throw {message: "Wrong position given considering method 'float'"}
            var padd = this.cfg('padding')+"px";
            this.eImg.setStyle({cssFloat:this.position[1], position:'relative',top:padd});
            if(this.position[1] == 'left')
                this.eImg.setStyle({left:padd});
            else
                this.eImg.setStyle({right:padd});
        } else {
            this.eImg.setStyle({position:'absolute'});
            this.setPosition();
        }
        return this;
    },
    /**
     * Sets the right absolute position of the image. 
     * Needs to be called if the top/left/width/height css property is changed 
     */
    setPosition: function() {
        if (this.cfg('method') != 'absolute') return;
        var act = !this.component.visible();
        if (act) this.component.show();
        var containerDim = this.component.getDimensions();
        var imgDim = this.eImg.getDimensions();
        var point = [];
        var padding = this.cfg('padding');
        if (this.position[0] == 'top')
            point[0] = padding;
        else if (this.position[0] == 'bottom')
            point[0] = containerDim.height - imgDim.height - padding;
        else if (this.position[0] == 'center')
            point[0] = (containerDim.height - imgDim.height) / 2;

        if (this.position[1] == 'left')
            point[1] = padding;
        else if (this.position[1] == 'right')
            point[1] = containerDim.width - imgDim.width - padding;
        else if (this.position[1] == 'center')
            point[1] = (containerDim.width - imgDim.width) / 2;

        this.eImg.clonePosition(this.component, {setWidth:false, setHeight:false,
            offsetTop: point[0], offsetLeft: point[1]}); // TODO Bug sur IE dans demo globale
        if (act) this.component.hide();
    },
    /**
     * Get the position description considering the configuration 
     * @return {Array} The first item is the vertical alignment, the second is the horizontal one
     * @private
     */
    _getPositionFromCfg: function() {
        var position = ['center', 'center'];
        var pos = this.cfg('position').split('-');
        if (pos.length == 2)
            position = pos;
        else {
            pos = pos[0];
            if (pos == 'top' || pos == 'bottom')
                position[0] = pos;
            else
                position[1] = pos;
        }
        return position;
    },
    /**
     * Binds the default events (mouseover, mouseout) and the custom from the user (onClick) 
     * @private
     */
    _bindEvents: function() {
        var e = this.eImg;      
        if (this.getEvent("onClickEvent") !== Prototype.emptyFunction) {  
            e.setStyle({cursor:'pointer'});
            e.observe('click', this.getEvent("onClickEvent"));
        }
        this.component.observe('mouseover', function() {
            this.eImg.show();
            this.setPosition();
        }.bind(this));
        this.component.observe('mouseout', function() {
            this.eImg.hide()
        }.bind(this));
    }
});