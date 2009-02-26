/**
 * A preconfigured modal frame class
 * @class frame.Modal
 * @extends jplex.components.Frame
 */
jPlex.provide("jplex.components.frame.Modal", "jplex.components.Frame", {
 
    _extension: {
        name: 'Modal',
        defaultConfig: {
            /**
             * Flag indicating whether the component has a title bar or not
             * @config header
             * @default false
             */
            header:false,
            /**
             * Prevent the user to click outside and add an overlay to focus on the modal frame
             * @config modal
             * @default true
             */
            modal:true,
            /**
             * Determine the way the user will close the modal frame
             * @config close
             * @default jplex.components.Frame.CLOSE_CLICK_OUT
             */
            close: jplex.components.Frame.CLOSE_CLICK_OUT,
            /**
             * z-index base for the frame and its overlay
             * @config zBase
             * @default 9998
             */
            zBase: 9998
        }
    },

    initialize: function($super, eElement, oConfig) {
        // Force modal
        oConfig.modal = true;
        $super(eElement, oConfig);
    }
});
