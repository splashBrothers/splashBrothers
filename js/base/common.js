/*
    splash brothers  水花兄弟
    add time 2015-12-07
*/
define(function(require, exports, module){
    require('./fx');
    require('./fx-methods');

    var C_base = {
        //* _alert('文案')
        _alert: function(txt, callback, noClose, keepTime) {
            if (typeof callback === 'number') {
                keepTime = callback;
                callback = undefined;
            }

            function doCallback(t) {
                if (noClose) {
                    callback && callback();
                } else {
                    setTimeout(function() {
                        t.fadeOut(function() {
                            t.parent().fadeOut(function() {
                                $(this).remove();
                            });
                            callback && callback();
                        })
                    }, keepTime || 1500)
                }
            }

            if ($("#_alert_bg").length) {
                $("#_alert_content").html(txt);
                doCallback($("#_alert_content"));
            } else {
                var _d = window.top.document,
                    _alert_bg = _d.createElement("div");
                _alert_bg.setAttribute("id", "_alert_bg");
                _d.body.appendChild(_alert_bg);

                var _alert_content = _d.createElement("div");
                _alert_content.setAttribute("id", "_alert_content");
                _alert_bg.appendChild(_alert_content);

                $(_alert_content).html(txt).fadeIn(function() {
                    doCallback($(this));
                });
            }
        },
       
        remove_alert : function(callback){
            if($("#_alert_bg").length){
                $("#_alert_bg").fadeOut(150,function(){
                    $(this).remove();
                    callback && callback();
                })
            }
            else{
                callback && callback();
            }
        },
        clearAlert : function(){
            var $target = $('#_alert_bg');
            $target && $target.removeClass('alert-showing').hide();
        },

        /*
            _confirm('文案','确定',function(){
                alert('确定')
            },'取消',function(){
                alert('取消')
            })
        */
        _confirm :function(title,okText,okback,cancelText,resetback){
            var html = ['<div id="_confirm_bg" class="hide">'+
                '<div id="_confirm_content">' +
                    '<div id="_confirm_text">' + title + '</div>' +
                    '<div id="_confirm_btnW">' +
                        (cancelText ? ('<div id="_confirm_btnA" class="confirm_btn">' + cancelText + '</div>'): '') +
                        '<div id="_confirm_btnB" class="confirm_btn">' + okText + '</div>' +
                    '</div>' +
                '</div>'+
            '</div>'].join('')

            if($('#_confirm_bg').length){
                $('#_confirm_bg').fadeIn(500);
            }else{
                $('body').append(html);
                $('#_confirm_bg').fadeIn(500);
            }
                
            if(!okText || !cancelText){
                $(".confirm_btn").css({width:"100%",color:"#337ab7"});
            }

            if(okText){
                $('#_confirm_btnB').bind('click',function(){
                    $('#_confirm_bg').fadeOut(500);
                    okback&&okback()
                })
            }

            if(cancelText){
                $('#_confirm_btnA').bind('click',function(){
                    $('#_confirm_bg').fadeOut(500);
                    resetback&&resetback()
                })
            }
        },
        ua : function(){ 
            return navigator.userAgent.toLowerCase(); 
        },
        isMobile : function(){ 
            return C_base.ua().match(/iPhone|iPad|iPod|Android|IEMobile/i); 
        },
        isAndroid : function(){ 
            return C_base.ua().indexOf("android") != -1 
        },
        isIOS : function(){ 
            var a  = C_base.ua(); 
            return (a.indexOf("iphone") != -1 || a.indexOf("ipad") != -1 || a.indexOf("ipod") != -1); 
        },
        platform : function(){
            if(C_base.isMobile()){
                if(C_base.isIOS()){ return "IOS"; }
                if(C_base.isAndroid()){ return "Android"; }
                return "other-mobile";
            }
            return "PC";
        },
        isWeixin : function(){ 
            return (C_base.ua().indexOf("micromessenger") != -1);
        },
        isWQQ: function(){ 
            return (C_base.ua().indexOf("QQ") != -1);
        },
        urlQuery: function(name) {
           var href = location.search;
            href = href.substr(1).replace(/#[^&]*$/, ''),
            res = '';
            var params = href.split('&');
            for (var i = 0, j = params.length; i < j; i++) {
                var temp = params[i].split('=');
                if (name == temp[0]) {
                    if(temp.length > 2){
                        for(var k = 1; k < temp.length-1; k++) {
                            res += temp[k] +'=';
                        }
                    }else{
                        res = temp[1];
                    }
                    break;
                }
            }
            return res;
        }
    }

    return C_base;
});
