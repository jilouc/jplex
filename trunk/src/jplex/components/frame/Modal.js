/**
 * A preconfigured modal frame class.
 * It configures the overlay shown behind the frame,
 * overriding the following configuration parameters:
 * <ul>
 * <li>`header: false`</li>
 * <li>`modal: true`</li>
 * <li>`close: jplex.components.Frame.CLOSE_CLICK_OUT`
 * </ul>
 * (Note: the `modal` parameter is forced to `true`).
 * 
 * @class frame.Modal
 * @extends jplex.components.Frame
 */
jPlex.provide("jplex.components.frame.Modal", "jplex.components.Frame", {

    _extension: {
        name: 'Modal',
        defaultConfig: {
            header:false,
            modal:true,
            close: jplex.components.Frame.CLOSE_CLICK_OUT,
        }
    },

    initialize: function($super, eElement, oConfig) {
        // Force modal
        oConfig.modal = true;
        $super(eElement, oConfig);
    }
});
