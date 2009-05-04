/**
 * My Class description
 * @class Resizable
 * @extends  jplex.common.Component
 * @param {string|Element} element ID string or HTML element for the component
 * @param {Object} config Configuration parameters
 * @constructor
 */

jPlex.provide("jplex.components.Resizable", "jplex.common.Component", {

    _definition: {
        name: "Resizable",
        defaultConfig: {
            handles: ['br'],
            snap: [1,1],
            overflow: 'hidden',
            ghost: false,
            preserveRatio: false,
            minWidth:0,
            maxWidth:Infinity,
            minHeight:0,
            maxHeight:Infinity
            // constrain to parent
        },
        events: {},
        defaultContainer: "div"
    },

    initialize: function($super, element, config) {
        $super(element, config);

        var Resizable = jplex.components.Resizable;
        this.handles = $H();
        this._mouseMoveEvent = this.mouseMoveToResize.bind(this);
        this._wantToPreserveRatio = this.wantToPreserveRatio.bind(this);
        this._stopPreservingRatio = this.stopPreservingRatio.bind(this);

        if (this.cfg('handles').join('-') == Resizable.Handles.BOTTOM_RIGHT_CORNER.join('-')) {
            this._addBottomRightHandle();
        }

        this.component.setStyle({
            overflow: this.cfg('overflow')
        });

    },

    didStartResizing: function(e) {
        this.resizing = true;

        this._initialState = {
            cursor: {
                x: e.pointerX(),
                y: e.pointerY()
            },
            size: this.component.getDimensions(),
            origin: this.component.positionedOffset()
        };
        this._clone = this.component.cloneNode(true);
        document.observe('mousemove', this._mouseMoveEvent);
        if(!this.cfg('preserveRatio')) {
            document.observe('keydown', this._wantToPreserveRatio);
        }

        e.stop();

    },

    didFinishResizing: function(e) {
        this.resizing = false;

        document.stopObserving('mousemove', this._mouseMoveEvent);
        if(!this.cfg('preserveRatio')) {
            document.stopObserving('keydown', this._wantToPreserveRatio);
        }
    },


    wantToPreserveRatio: function(e) {
        if(Event.Key.SHIFT !== e.keyCode) {
            return;
        }
        document.observe('keyup', this._stopPreservingRatio);
        console.log('shift');
        this._preserveRatio = true;
    },

    stopPreservingRatio: function(e) {
        if(Event.Key.SHIFT !== e.keyCode) {
            return;
        }
        document.stopObserving('keyup', this._stopPreservingRatio);
        this._preserveRatio = false;
    },

    mouseMoveToResize: function(e) {
        var x = e.pointerX();
        var y = e.pointerY();

        var newWidth = Math.min(this.cfg('maxWidth'), Math.max(this.cfg('minWidth'), x - this._initialState.origin.left));
        var newHeight = Math.min(this.cfg('maxHeight'), Math.max(this.cfg('minHeight'), y - this._initialState.origin.top));

        this._currentState = {
            cursor : {
                x: x,
                y: y
            },
            size: {
                width: newWidth,
                height: newHeight
            }
        };

        this.component.setStyle({
            width: (this._currentState.size.width + 8) + 'px',
            height: (this._currentState.size.height + 8) + 'px'
        });


    },

    //---------- Private methods ----------

    _addBottomRightHandle: function() {
        var handle = new Element('a', { id:this.UID + '-br' }).addClassName('jplex-resizable-hbr');
        this.component.relativize();
        this.component.insert(handle);
        this.handles.set('br', handle);

        handle.observe('mousedown', this.didStartResizing.bind(this));
        document.observe('mouseup', this.didFinishResizing.bind(this));
    }


    //---------- Private properties ----------

    /**
     * @property _myPrivateProperty
     * @type Object
     * @private
     */

});

//---------- Static properties ----------

jPlex.extend('jplex.components.Resizable', {

    Handles: {
        BOTTOM_RIGHT_CORNER:['br'],
        BOTTOM_AND_RIGHT:['r', 'br', 'b'],
        ALL: ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']
    }
});
