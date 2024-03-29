/**
 * A preconfigured dialog box frame class<p>
 * It automatically adds two buttons to the footer of the frame: typically OK and Cancel.
 * You can add extra buttons if you want or remove the default ones, customize labels,...
 * All configuration paraameters from jplex.components.Frame are inherited. The following ones
 * are overridden to configure the Dialog frame:
 * <ul>
 * <li>`header: true`</li>
 * <li>`center: true`</li>
 * <li>`draggable: true`</li>
 * </ul>
 *
 *
 * @class frame.Dialog
 * @extends jplex.components.Frame
 *
 * @param {Element|String} eElement
 * @param {Object} oConfig
 * @constructor
 */
jPlex.provide('jplex.components.frame.Dialog', 'jplex.components.Frame', {

    _extension: {
        name: 'WindowDialog',
        defaultConfig: {
            footer:true,
            center: true,
            draggable:true,

            /**
             * Shows the "ok" button if set to `true`.
             * @config okButton
             * @default true
             */
            okButton: true,
            /**
             * Shows the "cancel" button if set to `true`.
             * @config cancelButton
             * @default true
             */
            cancelButton: true,
            /**
             * Custom label for the 'OK' button
             * @config okButtonLabel
             * @default ""
             */
            okButtonLabel: '',
            /**
             * Custom label for the 'cancel' button
             * @config cancelButtonLabel
             * @default ""
             */
            cancelButtonLabel: '',
            /**
             * Array of optional button, each item of the array is an object like the following
             * <code>{
             *      label: "Label of the button",
             *      click: function: { Function triggered on click }
             * }</code>
             * Note that in the 'click' function, `this` will refer to the instance of Dialog.
             * @config otherButtons
             * @default []
             */
            otherButtons: []
        },
        events: {
            /**
             * When the "OK" button is clicked
             * @event onOkButtonClickEvent
             */
            onOkButtonClickEvent: Prototype.emptyFunction,
            /**
             * When the "CancelButton" is clicked
             * @event onCancelButtonClickEvent
             */
            onCancelButtonClickEvent: Prototype.emptyFunction
        },
        text: {
            fr: { OK: 'OK', CANCEL: 'Annuler'},
            en: { OK: 'OK', CANCEL: 'Cancel'}
        }
    },


    initialize: function($super, eElement, oConfig) {
        $super(eElement, oConfig);

        this._addButtons();

        if ($(this.sID + "-closecross")) {
            $(this.sID + "-closecross").observe('click', this._cancelButtonClick.bind(this));
        }
    },

    /**
     * Add the default buttons and custom buttons to the footer
     */
    _addButtons: function() {
        var down = this.component.down('div.footer');

        $A(this.cfg("otherButtons")).each(function(s, i) {
            var bt = new Element('input', {
                type: 'button',
                id: this.sID + '-bt' + i,
                value: s.label
            });
            down.appendChild(bt);
            bt.observe('click', s.click.bind(this));
        }.bind(this));

        if (this.cfg('okButton')) {
            var ok = new Element('input', {
                type: 'button',
                id: this.sID + '-ok',
                value: this.cfg('okButtonLabel').blank() ? this.lang('OK') : this.cfg('okButtonLabel')
            });
            down.appendChild(ok);
            ok.observe('click', this._okButtonClick.bind(this));
        }

        if (this.cfg('cancelButton')) {
            var cancel = new Element('input', {
                type: 'button',
                id: this.sID + '-cancel',
                value: this.cfg('cancelButtonLabel').blank() ? this.lang('CANCEL') : this.cfg('cancelButtonLabel')
            });
            down.appendChild(cancel);
            cancel.observe('click', this._cancelButtonClick.bind(this));
        }


    },

    /**
     * Handle click on the "OK" button
     */
    _okButtonClick: function() {
        this.fireEvent('onOkButtonClickEvent');
    },

    /**
     * Handle click on the "Cancel" Button, hide the dialog box
     */
    _cancelButtonClick: function() {
        this.fireEvent('onCancelButtonClickEvent');
        this.hide();
    }
});
