define(function(require, exports, module){

    var cookie = {
        getCookie: function(name){
            var cookie_start = document.cookie.indexOf(name+"="),cookie_end = document.cookie.indexOf(";",cookie_start);
            return cookie_start == -1 ? "" : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
        },
        /**
         *   isSession 标识cookie是否在关闭浏览器后清除,默认有效期一个月
         *   setCookie(key, value, isSession)
         *
         *   setCookie({key1:value1, key2:value2}, isSession)
         *
         */
        setCookie :function(name,value,isSession){
            var expires = new Date();
            expires.setTime(expires.getTime() + 2592000000);//1month
            var path_domain = "; path=/"+ (document.domain.indexOf("vdian.com") != -1 ? "; domain=vdian.com" : (document.domain.indexOf("koudai.com") != -1 ? "; domain=koudai.com" : (document.domain.indexOf("weidian.com") != -1 ? "; domain=weidian.com" : "")) );
            if(typeof(name) === "object"){
                for(var v in name){
                    if(name[v] !='' || name[v]===0 || name[v].length){//如果值为空，就不设置cookie
                        console.log(Number(name[v])+'_'+name[v].length)
                        //console.log(name[v].length)
                        var cookie_content = escape(v) +"="+ escape(name[v]);
                        document.cookie = cookie_content + "; expires=" + expires.toGMTString() + path_domain;
                    } 
                }
            }
            else{
                if(value !='' || value===0 || value.length){////如果值为空，就不设置cookie
                    var cookie_content = escape(name) +"="+ escape(value);
                    document.cookie = cookie_content + (isSession ? "" : ("; expires=" + expires.toGMTString())) + path_domain;
                }
            }
        },
        delCookie :function(name){
            var path_domain = "; path=/"+ (document.domain.indexOf("vdian.com") != -1 ? "; domain=vdian.com" : (document.domain.indexOf("koudai.com") != -1 ? "; domain=koudai.com" : (document.domain.indexOf("weidian.com") != -1 ? "; domain=weidian.com" : "")) );
            document.cookie = escape(name) +"=; expires="+ new Date(0).toUTCString() + path_domain;
        },
        clearCookie :function(){
            var _keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (_keys){
                var l = _keys.length;
                for(var i = l; i--;){ cookie.delCookie(_keys[i]); }
            }
        },
        cookie : function(name, value){
            return !!value ? cookie.setCookie(name, value) : cookie.getCookie(name);
        },
        getSessionStorage : _session,
        setSessionStorage : _session,
        session : _session,

    }

    function _session(key, value) {
        if(window.sessionStorage) {
            return value ? sessionStorage.setItem(key, value) : sessionStorage.getItem(key);    
        }

        console.log('session storage not supported');
    }

    
    return cookie;
});
