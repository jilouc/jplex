/**
 * A preconfigured modal frame class
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
            zBase: 9998
        }
    },

    initialize: function($super, eElement, oConfig) {
        // Force modal
        oConfig.modal = true;
        $super(eElement, oConfig);
    }
});
