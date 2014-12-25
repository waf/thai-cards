util = {
    inPlaceShuffle: function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    },
    loadModules: function(url, callback) {
        promise.get(url).then(function(err, json) {
            var moduleList = JSON.parse(json);
            var moduleRequests = moduleList.map(function(m) {
                var filename = "./modules/" + m + ".js";
                return promise.get(filename);
            });
            promise.join(moduleRequests).then(function(responses) {
                var modules = {};
                for(var i = 0; i < moduleList.length; i++) {
                    var moduleName = moduleList[i];
                    var error = responses[i][0];
                    var json = responses[i][1];
                    if(!error) {
                        modules[moduleName] = JSON.parse(json);
                    }
                }
                callback(modules);
            });
        });
    },
    shuffleCardsFromModules: function(modules, activeModules) {
        // combine the cards in each module into one, shuffled deck
        var cards = [];
        for(var name in modules) {
            if(activeModules.indexOf(name) >= 0) {
                cards = cards.concat(modules[name]);
            }
        }
        this.inPlaceShuffle(cards);
        return cards;
    },
    fitWordToWidth: function(element, adjustmentRatio) {
        adjustmentRatio = adjustmentRatio || 1;
        element.style.fontSize = "40px"; // baseline for our measurement
        var fontBase = window.innerWidth / element.offsetWidth * 30;
        var min = 40;
        var max = 130;
        var fontSize = fontBase > max ? max : fontBase < min ? min : fontBase;
        return fontSize * adjustmentRatio;
    },
    readFormChangeFromEvent: function(e) {
        var formChange = {};
        var name = e.target.name;
        if(e.target.nodeName === "SELECT") {
            formChange[name] = [];
            for(var key in e.target.options) {
                var opt = e.target.options[key];
                if(opt.selected) {
                    formChange[name].push(opt.value);
                }
            }
        } else if(e.target.nodeName === "INPUT" && e.target.type === "checkbox") {
            formChange[name] = e.target.checked;
        } else {
            formChange[name] = e.target.value;
        }
        return formChange;
    }
}
