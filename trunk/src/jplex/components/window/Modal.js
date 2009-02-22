/**
 * A preconfigured modal window class
 * @class window.Modal
 * @extends jplex.components.Window
 */
jPlex.provide("jplex.components.window.Modal", "jplex.components.Window", {

    // TODO trouver un moyen pour que la redéfinition ci-dessous ne shunte pas les paramètres de configuration non surchargés
    // (par exemple dans le cas Modal ci-dessous, les paramètres 'footer', 'overlayColor', 'overlayOpacity' etc. ne sont plus
    // pris en compte au niveau de Window (et Component) parce que this._definition vaut le hash qu'on définit juste là.
    // (en rendant Object.extend récursif ???)
 
    _extension: {
        name: 'WindowModal',
        defaultConfig: {
            header:false,
            modal:true,
            close:'clickout',

            zBase: 9998
        }
    },

    initialize: function($super, eElement, oConfig) {
        //oConfig = Object.extend(Object.clone(this._definition.defaultConfig), oConfig);
        //oConfig.modal = true;
        $super(eElement, oConfig);
    }
});
