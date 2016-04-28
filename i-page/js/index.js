/// <reference path="../bower_components/knockout/dist/knockout.debug.js" />

define('base', ['knockout'], function (ko) {
    window.ko = window.ko || ko;
});
require(['base', 'iPage'], function () {
    function ViewModel() {
        var self = this;

        self.searchKey = ko.observable("");

        self.pageNo = ko.observable(0);
        self.pageSize = ko.observable(10);

        self.pageNoChange = function (pageNo, pageSize, callback) {
            self.pageNo(pageNo);           
            callback(self.list().length);
        };

      

        var arr = ko.observableArray();
        for (var i = 65 ; i < 91 ; i++) {          
            arr.push({
                ch: String.fromCharCode(i),
                code:i
            });
        }

        self.list = arr.searchKeyFilter({ ch: self.searchKey });
    }
    ko.observable.fn.searchKeyFilter = function (param) {       

        var input = this();
        return ko.pureComputed(function () {           
            if (input) {
                
                return ko.utils.arrayFilter(input, function (item) {
                    if (typeof (param) === "object") {
                        var match = true;
                        ko.utils.objectForEach(param, function (k,v) {
                            var value = ko.unwrap(v);
                            if (!value.length) {
                                return false;
                            }
                            if (item[k] != value) {
                                match = false;
                                return false;
                            }
                        });
                        return match;
                    }
                    else {
                        var value = ko.unwrap(param);
                        return value == item;
                    }
                });
            }
            return [];
        });
    };
    ko.computed.fn.pageNoFilter = function (pageNo, pageSize) {
        var input = this();     
        return ko.pureComputed(function () {
            if (input) {
                no = +parseInt(ko.unwrap(pageNo)) || 0;
                size = +parseInt(ko.unwrap(pageSize)) || 10;
                start = no * size;
                return input.slice(start, start + size);
            }
            return [];
        });     
    };
    ko.applyBindings(new ViewModel());
});