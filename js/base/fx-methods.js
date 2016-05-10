define(function(require, exports, module){
    var $ = require('./zepto');
    require('./fx');
    //     Zepto.js
    //     (c) 2010-2015 Thomas Fuchs
    //     Zepto.js may be freely distributed under the MIT license.

    var document = window.document, docElem = document.documentElement,
      origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle

    function anim(el, speed, opacity, scale, callback, delay) {
      if (typeof speed == 'function' && !callback) callback = speed, speed = undefined
      var props = { opacity: opacity }
      if (scale) {
        props.scale = scale
        el.css($.fx.cssPrefix + 'transform-origin', '0 0')
      }
      return el.animate(props, speed, null, callback, delay | 50)
    }

    function hide(el, speed, scale, callback, delay) {
      return anim(el, speed, 0, scale, function(){
        origHide.call($(this))
        callback && callback.call(this)
      }, delay)
    }

    $.fn.show = function(speed, callback, delay) {
      origShow.call(this)
      if (speed === undefined) speed = 0
      else this.css('opacity', 0);
      return anim(this, speed, null, callback, delay)
    }

    $.fn.hide = function(speed, callback, delay) {
      if (speed === undefined) return origHide.call(this)
      else return hide(this, speed, null, callback, delay)
    }

    $.fn.toggle = function(speed, callback, delay) {
      if (speed === undefined || typeof speed == 'boolean')
        return origToggle.call(this, speed)
      else return this.each(function(){
        var el = $(this)
        el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback, delay)
      })
    }

    $.fn.fadeTo = function(speed, opacity, callback, delay) {
      return anim(this, speed, opacity, null, callback, delay)
    }

    $.fn.fadeIn = function(speed, callback, delay) {
      var target = this.css('opacity')
      if (target > 0) this.css('opacity', 0)
      else target = 1
      return origShow.call(this).fadeTo(speed, target, callback, delay)
    }

    $.fn.fadeOut = function(speed, callback, delay) {
      return hide(this, speed, null, callback, delay)
    }

    $.fn.fadeToggle = function(speed, callback, delay) {
      return this.each(function(){
        var el = $(this)
        el[
          (el.css('opacity') == 0 || el.css('display') == 'none') ? 'fadeIn' : 'fadeOut'
        ](speed, callback, delay)
      })
    }

    module.exports = $;
});
