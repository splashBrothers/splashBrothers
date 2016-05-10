/*
    splash brothers  水花兄弟
    add time 2015-12-07
*/
define(function(require, exports, module){
    var ajax  = require('./ajax');
    var URLS = {
        //退款相关
        getCategorySearch :'http://item.weidian.com/wd/item/getCategorySearch', //申请退款页
    };

    var Api = {
        //订单相关
        getCategorySearch:function(data, success, error){
            ajax.jsonp(URLS.getCategorySearch, data, success, error);
        }
    };

    return Api;
});
