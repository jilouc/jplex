
jPlex.include("jplex.xprototype.*");

/**
 *
 */
jPlex.provide("jplex.common.DataSource", function() {
    var CACHE = $H();
    var UID = 0;

    return {
        initialize: function(type, source, config) {
            this.UID = "jplex-ds-" + (++UID);
            this.type = type;
            this.source = source;
            this.config = {
                schema: {
                    root: "datasource",
                    item: "item",
                    properties: []
                },
                parser: null,
                cache: false,
                lifetime: 1800,
                parameters: {},
                poll: false,
                pollInterval: 60,
                process: Prototype.emptyFunction
            };

            Object.extendRecursive(this.config, config || {});

            CACHE.set(this.UID, {last: null, data: null});

            if(this.config.poll) {
                this.poller = new PeriodicalExecuter(this.request.bind(this), this.config.pollInterval);
            }
        },

        request: function() {
            var cache = CACHE.get(this.UID);
            var now = new Date();

            if (this.config.cache && cache.last !== null && now.compareTo(cache.last) < this.config.lifetime * 1000) {
                this.update(cache.data, true);
            } else {
                this.retrieve(this.update.bind(this));
            }
        },

        stop: function() {
            if(!Object.isUndefined(this.poller)) {
                this.poller.stop();
            }
        },

        update: function(data, fromCache) {
            var cache = CACHE.get(this.UID);
            if(!fromCache) {
                cache.last = new Date();
                cache.data = this.parse(data);
            }

            this.config.process(cache.data);
        },

        retrieve: function(callback) {
            switch (this.type) {
                case jplex.common.DataSource.TYPE_ARRAY:
                    callback(this.source);
                    break;
                case jplex.common.DataSource.TYPE_JSON:
                    new Ajax.Request(this.source, {
                        parameters: this.config.parameters,

                        onComplete: function(transport) {
                            if (transport.responseJSON === null) {
                                transport.responseJSON = transport.responseText.evalJSON();
                            }
                            if (transport.responseJSON !== null) {
                                callback(transport.responseJSON);
                            } else {
                                // throw some stuff
                            }
                        }
                    });
                    break;
                case jplex.common.DataSource.TYPE_XML:
                    new Ajax.Request(this.source, {
                        parameters: this.config.parameters,

                        onComplete: function(transport) {
                            callback(transport.responseXML);
                        }
                    });
                    break;
                case jplex.common.DataSource.TYPE_FUNCTION:
                    callback(this.source());
                    break;
                default:
                    throw {
                        name: "UnknownDataSourceType",
                        messsage: "'" + this.type + "' is not a supported DataSource type."
                    };
            }
        },

        parse: function(data) {
            var res;
            switch (this.type) {
                case jplex.common.DataSource.TYPE_ARRAY:
                case jplex.common.DataSource.TYPE_FUNCTION:
                    return data;
                case jplex.common.DataSource.TYPE_JSON:

                    if(this.config.parser !== null) {
                        res = this.config.parser(data);
                    } else {
                        res = data.data;
                    }
                    return res;
                case jplex.common.DataSource.TYPE_XML:

                    res = $A();

                    if (this.config.parser !== null) {
                        res = this.config.parser(data);
                    } else {
                        $A(data.getElementsByTagName(this.config.schema.item)).each(function(item) {
                            var it = {};
                            if (this.config.schema.properties.length > 0) {
                                this.config.schema.properties.each(function(prop) {
                                    if(item[prop]) {
                                        it[prop] = item[prop];
                                    } else {
                                        var ch = item.getElementsByTagName(prop);
                                        if(ch.length > 0) {
                                            it[prop] = ch[0].textContent.strip();
                                        } else {
                                            it[prop] = null;
                                        }
                                    }
                                }, this);
                            } else {
                                it = item.textContent.strip();
                            }
                            res.push(it);
                        }, this);
                    }

                    return res;
                default:
                    throw {
                        name: "UnknownDataSourceType",
                        messsage: "'" + this.type + "' is not a supported DataSource type."
                    };
            }
        }

    };

}());

jPlex.extend("jplex.common.DataSource", {
    TYPE_ARRAY: 0,
    TYPE_JSON: 1,
    TYPE_XML: 2,
    TYPE_FUNCTION: 3

});