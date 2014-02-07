/**
 * Source files written by Dániel Adamkó, Eger, Hungary, 2014
 * GNU GPL v3 license applied to this project
 * daniel.adamko@gmail.com
 */
 
if(!jQuery) throw new Error('Dependency: jQuery with version >=1.10');

if(!jQuery.fn.transition) {
  jQuery.fn.extend({
    transition: function(css, callback) {
      this.css(css);
      if($.isFunction(callback)) {
        var delay = 0, delays = this.css('transition-duration');
        if(typeof delays != 'undefined') {
          delays = delays.split(',');
          for(var it in delays) {
            var d_s = delays[it].replace(/[^0-9.]/g, '');
            var d = delays[it].indexOf('ms') > 0 ? parseInt(d_s) : parseFloat(d_s) * 1000;
            if(d > delay) delay = d;
          }
          if(delay != 0) {
            window.setTimeout(callback, delay + 50);
            return this;
          }
        } 
        callback();
      }
      return this;
    }  
  });
}

var __extends = this.__extends || function (d, b) {
  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  function __() { this.constructor = d; }
  __.prototype = b.prototype;
  d.prototype = new __();
};

var WitBox = {
  Modal: (function () {
    function Modal(Root) {
      this.root = Root;
      this.parameters = {};
      this.callbacks = {};
      this.templateObj = null;
    }
    /**
     * Sets a parameter for the modal template
     * @param {String} parameterName 
     * @param {Object} parameterValue
     */
    Modal.prototype.setParameter = function (parameterName, parameterValue) {
      if(typeof parameterName != 'string') throw new Error();
      this.parameters[parameterName] = parameterValue;
    };
    /**
     * Sets a callback function for an event inside the modal
     * @param {String} objectName (Class)Name of the object
     * @param {String} eventFor Event name
     * @param {Function} callback Callback function
     */
    Modal.prototype.setCallback = function (objectName, eventFor, callback) {
      this.callbacks[objectName][eventFor] = callback;
    };
    Modal.prototype.initTemplate = function () {
      $(this.root).html(this.templateObj(this.parameters));
    };
    Modal.prototype.initCallbacks = function () {
      for(var it in this.callbacks) {
        if(typeof this.callbacks[it] == 'function') {
          $(this.root).find(it[0]=='#'?it:'.'+it).on('click', this.callbacks[it]);
        } else if(typeof this.callbacks[it] == 'object') {
          for(var c in this.callbacks[it]) {
            if(typeof this.callbacks[it][c] != 'function') continue;
            $(this.root).find(it[0]=='#'?it:'.'+it).on(c, this.callbacks[it][c]);
          }
        }
      }
    };
    Modal.prototype.init = function () {
      this.initTemplate();
      this.initCallbacks();
    };
    return Modal;
  })()
  ,
  Viewport: (function () {
    function Viewport(id, html, viewportcls, contentcls, overlayed, centered, overlayexit) {
      var self = this;
      this.centered = centered;
      this.overlayed = overlayed;
      this.contentClass = contentcls;
      this.frame = $('<div>');
      this.frame.attr('id', id);
      if(overlayed) {
        this.overlay = $('<div>');
        this.overlay.addClass('witbox-overlay');
        this.overlay.appendTo($(document.body));
        if(overlayexit) {
          this.overlay.click(function(e){
            self.hide();
          });
        }
      }
      this.frame.addClass((centered?'witbox-centered ':'') + 'witbox-' + viewportcls);
      this.frame.html(html);
      this.content = this.frame.find('.' + contentcls);
      this.frame.appendTo($(document.body));
      this.root = this.frame;
      this.closeButton = this.frame.find('.close');
      this.parameters = [];
      if(centered) {
        var self = this;
        $(window).resize(function() {
          self.frame.css({ 
            'left': window.innerWidth / 2 - self.frame.width() / 2 + 'px',
            'top': window.innerHeight / 2 - self.frame.height() / 2 + 'px'
          });
        });
      }
    };
    Viewport.prototype.show = function(/*callback*/) {
      if(this.centered) $(window).trigger('resize');
    };
    Viewport.prototype.hide = function(/*callback*/) { 
      $(window).off('resize');
      if(this.overlayed) $('.witbox-overlay').remove();
    };
    return Viewport;
  })()
  ,
  Dialog: (function () {
    var modalCounter = 0;
    function Dialog(Viewport, Modal, Callbacks, Parameters, CloseOnClickOverlay) {
      this.viewport = new Viewport("modal-" + (modalCounter++), CloseOnClickOverlay);
      this.events = { open: null, close: null };
      if(Modal) {
        this.modal = new Modal(this.viewport.content);
        this.viewport.modal = this.modal;
        if(Callbacks)
          if(this.modal.callbacks == 'custom')  
            this.modal.callbacks = Callbacks;
          else
            for(var it in this.modal.callbacks) {
              this.modal.callbacks[it] = Callbacks[it] ? Callbacks[it] : [];
            };
        if(Parameters)
          for(var it in this.modal.parameters) {
            this.modal.parameters[it] = Parameters[it] ? Parameters[it] : [];
            delete Parameters[it];
          };
      }
      if(Parameters) this.viewport.parameters = Parameters;
    }
    Dialog.prototype.openCallback = function (callback) {
      this.events.open = callback;
    };
    Dialog.prototype.closeCallback = function (callback) {
      this.events.close = callback;
    };
    Dialog.prototype.show = function () {
      var self = this;
      if(self.modal) self.modal.init();
      self.viewport.frame.find('.close').click(function(){self.hide();});
      self.viewport.show(self.events.open);
      return this;
    };
    Dialog.prototype.hide = function () {
      var self = this;
      self.viewport.hide(self.events.close);
      return this;
    };
    return Dialog;
  })()
};

var WitBoxFactory = (function () {
  var openedAny = null;
  var openedFor = [];
  function WitBoxFactory() { }
  /**
   * Creates a timed hiding action when leaving the dialog area for at least two seconds
   * @param {HTMLObject} sender 
   * @param {WitBox} witbox Witbox object instance
   */
  WitBoxFactory.mouseOutAfter2SecondsAction = function (sender, witbox) {
    var t = 0;
    var set = function () {
      t = setTimeout(function(){
        witbox.hide();
        WitBoxFactory.isClosed(sender);
        $(sender).off('mouseenter', unset);
        $(sender).off('mouseleave', set);
      }, 2000);
    };
    var unset = function () {
      clearTimeout(t);
    };
    openedAny = witbox;
    $(witbox.viewport.root).mouseleave(set);
    $(witbox.viewport.root).mouseenter(unset);
    $(sender).mouseenter(unset);
    $(sender).mouseleave(set);
  };
  WitBoxFactory.closeButtonAction = function (sender, witbox) {
    witbox.viewport.closeButton.click(function(){
      WitBoxFactory.isClosed(sender);
    });
  };
  /**
   * @returns True if a witbox modal already opened for @sender
   * @param {HTMLObject} sender
   */
  WitBoxFactory.isOpened = function(sender) {
    var result = openedFor.indexOf(sender);
    if(result > -1) return true;
    openedFor.push(sender);
    return false;
  };
  /**
   * @returns True if no witbox modal opened for @sender
   * @param {HTMLObject} sender
   */
  WitBoxFactory.isClosed = function(sender) {
    var result = openedFor.indexOf(sender);
    if(result == -1) return true;
    delete openedFor[openedFor.indexOf(sender)];
    return false;
  };
  /**
   * Hides the opened modals
   */
  WitBoxFactory.hideAll = function() {
    if(openedAny) {
      openedAny.hide();
      openedAny = null;
    }
  }
  return WitBoxFactory;
})();




