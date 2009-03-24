jPlex.include('jplex.components.Frame', false);

/**
 * Creates a set of Frames.
 * This component is a kind of windows manager since it handles the
 * interaction between the different frames you've added.
 * <p>
 * Since Modal windows are `modal` (sic), it makes no sense to add a modal
 * frame to the frame set: a modal frame doesn't interact with any other frame, it is modal.
 * Even if there is no code-limitation about that, it leads to strange
 * behaviors sometimes. Just avoid it.
 *
 * @requires Frame
 * @class frame.FrameSet
 * @extends jplex.common.Component
 */
jPlex.provide('jplex.components.frame.FrameSet', 'jplex.common.Component', {

    _definition: {
        name: 'FrameSet',
        defaultConfig: {
            /**
             * Show an overlay behind the whole frame set if `true`
             * @config overlay
             * @default false
             */
            overlay: false,
            /**
             * Color of the overlay (only if `overlay` is `true`)
             * @config overlayColor
             * @default "#000000" (black)
             */
            overlayColor: '#000000',
            /**
             * Opacity of the overlay (only if `overlay` is `true`)
             * @config overlayOpacity
             * @default 0.6
             */
            overlayOpacity: 0.6
        },
        events: {
            /**
             * When a frame is added to the group
             * @event onAddFrameEvent
             * @param {jplex.components.Frame} frame the window that has been added
             */
            onAddFrameEvent: Prototype.emptyFunction
        },
        defaultContainer: 'div'
    },

    initialize: function($super, eElement, oConfig) {
        $super(eElement, oConfig);

        this.windows = $A([]);
        if (this.cfg('overlay')) {
            this.overlay = new jplex.components.Overlay(this.sID + '-overlay', {
                z: 0,
                color: this.cfg("overlayColor"),
                opacity: this.cfg("overlayOpacity")
            });
            this.overlay.show();
        }
    },

    /**
     * Add a new frame to the frame set. You can either supply a string to create
     * a new component or an existing Frame component.
     * The 'new' frame is extended and receives a new method (`toFront`) to handle
     * the relative positioning between the frames of the set.
     * @param {jplex.components.Frame|String} Id of the new window to create,
     * or Frame component to be added to the frame set.
     * @return {jplex.components.Frame} the added frame
     */
    add: function(frame) {
        var w = typeof(frame) == 'string' ?
                new jplex.components.Frame(frame, {
                    draggable:true
                }) : frame;
        var length = this.windows.length;

        w.show();
        this.windows.push(w);
        w.toFront = this._winToFront.methodize();
        w._group = this;
        w._groupPosition = length;
        w.component.setStyle({
            zIndex:length
        });
        w.component.observe('click', w.toFront.bindAsEventListener(w));

        this.fireEvent("onAddFrameEvent", {
            frame: w
        });
        return w;
    },

    /**
     * This method is copied as method of the frame object.
     * It brings the given frame above all others.
     * @param {jplex.components.Frame} w
     */
    _winToFront: function(w) {
        var z;
        for (var i = w._groupPosition + 1; i < w._group.windows.length; i++) {
            z = w._group.windows[i].component.getStyle('zIndex');
            w._group.windows[i - 1] = w._group.windows[i];
            w._group.windows[i - 1]._groupPosition--;
            w._group.windows[i - 1].component.setStyle({
                zIndex: Math.max(0, z - 1)
            });
        }
        w._group.windows[w._group.windows.length - 1] = w;
        if (z) {
            w.component.setStyle({
                zIndex: z
            });
        }
        w._groupPosition = w._group.windows.length - 1;

    }
});