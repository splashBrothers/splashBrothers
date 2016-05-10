/*
    splash brothers  水花兄弟
    add time 2015-12-07
*/

define(function(require, exports, module){

    var Cookie = require('../base/cookie'),
        C_base = require('../base/common'),
        Api = require('../common/api')

    var contentWrap =$('#content-wrap');

    var Index = {
        getItemList:function(){

            Api.getCategorySearch({
                param:{
                    "productSource":"w2c",
                    "keyword":"礼品",
                    "page":1,
                    "limit":10,
                    "api_v":27,
                    "appid":"com.koudai.weishop",
                    "userID":"234605",
                    "taobao_category_id":"21---50016434"
                }
            },function(data){
                var html = '<ul>'
                    var r = data.items
                    for (var i = 0; i < r.length; i++) {
                        html+='<li><img src="'+r[i].item.image_620+'"/></li>'
                    }; 
                    html+='</ul>'
                    contentWrap.html(html)
            })

            
        },
        init:function(){
            Index.getItemList();
            /*
            Cookie.setCookie('cookie','2345678');
            C_base._confirm('文案','确定',function(){
                alert('确定')
            },'取消',function(){
                alert('取消')
            })
            */
        }
    }
    
    return Index;
})