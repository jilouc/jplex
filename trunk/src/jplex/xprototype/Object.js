/**
 * jPlex's XPrototype extended Object class
 * @class Object
 */


Object.extendRecursive = function(destination, source) {
    for (var property in source) {
        if(typeof(source[property]) == 'object' && typeof(destination[property]) == 'object')
            destination[property] = Object.extendRecursive(destination[property], source[property]); 
        else                                                                                  
            destination[property] = source[property];
    }
    return destination;
};
