/**
 * A preconfigured modal window class
 * @class window.Modal
 * @extends jplex.components.Window
 */
jPlex.provide("jplex.components.window.Modal", "jplex.components.Window", {
 
    _extension: {
        name: 'WindowModal',
        defaultConfig: {
            /**
             * Flag indicating whether the component has a title bar or not
             * @config header
             * @default false
             */
            header:false,
            /**
             * Prevent the user to click outside and add an overlay to focus on the modal window
             * @config modal
             * @default true
             */
            modal:true,
            /**
             * Determine the way the user will close the modal window
             * @config close
             * @default jplex.components.Window.CLOSE_CLICK_OUT
             */
            close: jplex.components.Window.CLOSE_CLICK_OUT,
            /**
             * z-index base for the window and its overlay
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
