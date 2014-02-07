/**
 * Source files written by Dániel Adamkó, Eger, Hungary, 2014
 * GNU GPL v3 license applied to this project
 * daniel.adamko@gmail.com
 */
 
var PinnedBubbleViewport = (function (_super, WitBoxJST) {
  __extends(PinnedBubbleViewport, _super);
  function PinnedBubbleViewport() {
    _super.call(this, WitBoxJST.witbox_viewport_pinned, 'viewport-pinned', false);
    this.parameters = { left: 0, top: 0 };
  }
  PinnedBubbleViewport.prototype.show = function (callback) {
    _super.prototype.show.call(this);
    this.root.css({
      'left': limit(this.parameters.left, this.root.width(), $(window).width()),
      'top': limit(this.parameters.top, this.root.height(), $(window).height())
    });
    this.frame.transition({ opacity: 1 }, callback);
  };
  PinnedBubbleViewport.prototype.hide = function (callback) {
    _super.prototype.hide.call(this);
    var self = this;
    this.frame.transition({ opacity: 0 }, callback);
  };
  var limit = function(x, a, b) {
    return (b - x > a) ? x : x - a;
  };
  return PinnedBubbleViewport;
})(WitBox.Viewport, WitBoxJST);

var BorderedViewport = (function (_super, WitBoxJST) {
  __extends(BorderedViewport, _super);
  function BorderedViewport() {
    _super.call(this, WitBoxJST.witbox_viewport_bordered, 'viewport-bordered', true, true);
  }
  BorderedViewport.prototype.show = function (callback) {
    _super.prototype.show.call(this);
    this.frame.transition({ opacity: 1 }, callback);
  };
  BorderedViewport.prototype.hide = function (callback) {
    _super.prototype.hide.call(this);
    this.frame.transition({ opacity: 0 }, callback);
  };
  return BorderedViewport;
})(WitBox.Viewport, WitBoxJST);

var ConfirmModal = (function (_super, WitBoxJST) {
  __extends(ConfirmModal, _super);
  function ConfirmModal() {
    _super.call(this);
    this.parameters = { text: '' };
    this.callbacks = { 'ok': [], 'cancel': [] };
    this.templateObj = WitBoxJST.witbox_modal_confirm;
  }
  ConfirmModal.prototype.init = function() {
    _super.prototype.init.call(this);
  };
  return ConfirmModal;
})(WitBox.Modal, WitBoxJST);

var AlertModal = (function (_super, WitBoxJST) {
  __extends(AlertModal, _super);
  function AlertModal() {
    _super.call(this);
    this.parameters = { text: '' };
    this.callbacks = { 'ok': [] };
    this.templateObj = WitBoxJST.witbox_modal_alert;
  }
  AlertModal.prototype.init = function() {
    _super.prototype.init.call(this);
  };
  return AlertModal;
})(WitBox.Modal, WitBoxJST);

var BorderedPinnedViewport = (function (_super, WitBoxJST) {
  __extends(BorderedPinnedViewport, _super);
  function BorderedPinnedViewport() {
    _super.call(this, WitBoxJST.witbox_viewport_borderpinned, 'viewport-bordered-pinned', true, true);
  }
  BorderedPinnedViewport.prototype.show = function (callback) {
    _super.prototype.show.call(this);
    this.frame.transition({ opacity: 1 }, callback);
  };
  BorderedPinnedViewport.prototype.hide = function (callback) {
    _super.prototype.hide.call(this);
    var self = this;
    this.frame.transition({ opacity: 0 }, callback);
  };
  return BorderedPinnedViewport;
})(WitBox.Viewport, WitBoxJST);

var YTModal = (function (_super, WitBoxJST) {
  __extends(YTModal, _super);
  function YTModal() {
    _super.call(this);
    this.parameters = { yt: '' };
    this.templateObj = WitBoxJST.witbox_modal_yt;
  }
  YTModal.prototype.init = function() {
    _super.prototype.init.call(this);
  };
  return YTModal;
})(WitBox.Modal, WitBoxJST);

var GaleryViewport = (function (_super, WitBoxJST) {
  __extends(GaleryViewport, _super);
  var pos = 0;
  function GaleryViewport() {
    _super.call(this, WitBoxJST.witbox_viewport_galery, 'viewport-galery', true, false);
    this.parameters = { pages: [] };
  }
  GaleryViewport.prototype.show = function (callback) {
    _super.prototype.show.call(this);
    this.frame.transition({ opacity: 1 }, callback);
  };
  GaleryViewport.prototype.hide = function (callback) {
    _super.prototype.hide.call(this);
    this.frame.transition({ opacity: 0 }, callback);
  };
  GaleryViewport.prototype.load = function(p) {
    var self = this;
    var content = null;
    var it = self.parameters.pages[p];
    self.content.children().transition({ 'opacity': 0 }, function() {
      self.content.empty();
      switch(it.type) {
        case 'img':
          content = $(WitBoxJST.witbox_modal_galeryimg(it));
          break;
        case 'yt':
          content = $(WitBoxJST.witbox_modal_galeryyt(it));
          break;
      };
      self.content.append(content);
      content.load(function() {
        $.data(content[0], 'width', content.width());
        $.data(content[0], 'height', content.height());
        $(window).trigger('resize');
        window.setTimeout(function(){content.css({ 'opacity': 1 })}, 350);
      })
    });
  };
  GaleryViewport.prototype.refresh_pages = function() {
    var self = this;
    self.root.find('.page').removeClass('checked');
    $.each(self.root.find('.page'), function(i, v) {
      if($(v).data('id') == pos) {
        $(v).addClass('checked');
        return;
      }
    });
  };
  GaleryViewport.prototype.init = function() {
    _super.prototype.init.call(this);
    var self = this;
    pos = 0;
    self.root.find('.prev-button').click(function(){
      if(--pos < 0) pos = self.parameters.pages.length - 1;
      self.refresh_pages();
      self.load(pos);
    });
    self.root.find('.next-button').click(function(){
      if(++pos > self.parameters.pages.length - 1) pos = 0;
      self.refresh_pages();
      self.load(pos);
    });
    $(window).resize(function() {
      var content = self.content.children();
      var w = $.data(content[0], 'width');
      var h = $.data(content[0], 'height');
      if(w > window.innerWidth * 0.2 || h > window.innerHeight * 0.2) {
        if(w / h > window.innerWidth / window.innerHeight) {
          content.css({ 'width': window.innerWidth * 0.7, 'height': h / w * window.innerWidth * 0.7 });
        } else {
          content.css({ 'width': w / h * window.innerHeight * 0.7, 'height': window.innerHeight * 0.7 });
        }
      }
      self.content.css({
        'width': content.width() + 'px',
        'height': content.height() + 'px',
      });
      self.content.parent().css({
        'opacity': 1,
        'left': window.innerWidth / 2 - content.width() / 2 + 'px',
        'top': window.innerHeight / 2 - content.height() / 2 + 'px'
      });
    });
    $.each(self.parameters.pages, function(ix, it) {
      if(it.type == 'img') (new Image).src = it.url;
      self.root.find('.pages').append($('<span class="page'+(ix == 0 ? ' checked"' : '"')+' data-id="'+ix+'">'+(ix+1)+'</span>'));
    });
    self.root.find('.page').click(function() {
      self.root.find('.page').removeClass('checked');
      $(this).addClass('checked');
      pos = $(this).data('id');
      self.load(pos);
    });
    self.load(0);
  };
  return GaleryViewport;
})(WitBox.Viewport, WitBoxJST);

var CustomModal = (function (_super) {
  __extends(CustomModal, _super);
  function CustomModal() {
    _super.call(this);
    this.parameters = { jqobject: {} };
    this.callbacks = 'custom';
    this.templateObj = null;
  }
  CustomModal.prototype.initTemplate = function() {
    this.templateObj = this.parameters.jqobject.clone();
    this.templateObj.appendTo(this.root);
    this.templateObj.css({ 'opacity': 1, 'visibility': 'visible', 'display': 'table-cell' });
  };
  CustomModal.prototype.init = function() {
    _super.prototype.init.call(this);
  };
  return CustomModal;
})(WitBox.Modal);

WitBoxFactory.showConfirm = function(text, okCallback, cancelCallback) {
  new WitBox.Dialog(BorderedViewport, ConfirmModal, { 'ok': okCallback, 'cancel': cancelCallback }, { 'text': text }).show();
};

WitBoxFactory.showAlert = function(text, okCallback) {
  new WitBox.Dialog(BorderedViewport, AlertModal, { 'ok': okCallback }, { 'text': text }, true).show();
};

WitBoxFactory.showYT = function(yt) {
  new WitBox.Dialog(BorderedPinnedViewport, YTModal, null, { 'yt': yt }, true).show();
};

WitBoxFactory.showGalery = function(pages) {
  new WitBox.Dialog(GaleryViewport, null, null, { 'pages': pages }, true).show();
};

WitBoxFactory.show = function(jqobject, callbacks, overlayOnClickExit) {
  new WitBox.Dialog(BorderedPinnedViewport, CustomModal, callbacks, { 'jqobject': jqobject }, overlayOnClickExit).show();
};

