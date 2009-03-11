jPlex.include('jplex.components.Frame', true);

/**
 * Creates a group of windows.
 * @requires Frame 
 * @class frame.WindowsGroup
 * @extends jplex.common.Component
 */
jPlex.provide('jplex.components.frame.WindowsGroup', 'jplex.common.Component', {

    _definition: {
        name: 'WindowsGroup',
        defaultConfig: {
            overlay: false,
            overlayColor: '#000000',
            events: {}
        },
        defaultContainer: 'div'
    },

    initialize: function($super, eElement, oConfig) {
        $super(eElement, oConfig);

        this.windows = $A([]);
        if(this.cfg('overlay')) {
            this.overlay = new jplex.components.Overlay(this.sID+'-overlay',{
                z:0,
                color:this.cfg('overlayColor'),
                opacity: 0.6
            });
            this.overlay.show();
        }
    },

    add: function(oElement) {
        var w = typeof(oElement) == 'string' ?
                new jplex.components.Frame(oElement, {draggable:true}) :
                oElement;
        var length = this.windows.length;

        if(typeof(oElement) == 'string') w.setHeader('Window #'+length);
        w.show();
        this.windows.push(w);
        w.toFront = this._winToFront.methodize();
        w._group = this;
        w._groupPosition = length;
        w.component.setStyle({zIndex:length});
        w.component.observe('click', w.toFront.bindAsEventListener(w));

        return w;
    },

    _winToFront: function(w) {
        var z;
        for(var i=w._groupPosition+1; i<w._group.windows.length; i++) {
            z = w._group.windows[i].component.getStyle('zIndex');
            w._group.windows[i-1] = w._group.windows[i];
            w._group.windows[i-1]._groupPosition--;
            w._group.windows[i-1].component.setStyle({
                zIndex: Math.max(0, z-1)
            });
        }
        w._group.windows[w._group.windows.length-1] = w;
        if(z) {
            w.component.setStyle({zIndex: z});
        }
        w._groupPosition = w._group.windows.length-1;

    }
});