/*
    splash brothers  水花兄弟
    add time 2015-12-07
*/
define(function(require, exports, module){
    var ajax = {
        jsonp: function(url, data, success, error){//jsonp

            data.param = data.param || {};
            data.param = JSON.stringify(data.param);
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'jsonp',
                data: data,
                success: function(json){

                    if(json.status&&Number(json.status.status_code)===0){
                        success&&success(json.result)
                    }else{
                        error&&error(json)
                    }
                },
                error: function(json){
                    error&&error(json)
                }
            });
        },
        orignPost : function(href,param,callback,errCallback){//同域post

            param = JSON.parse(param);

            param = JSON.stringify(param);

            var http = new XMLHttpRequest();
            http.open("POST",href,true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.onreadystatechange = function(){
                if(http.readyState == 4 && http.status == 200){ callback(JSON.parse(http.responseText)); }
            }

            http.send("param="+ param);
        }
    }
    return ajax;
});
