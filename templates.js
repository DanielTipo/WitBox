WitBoxJST= function(){ return new Function();};WitBoxJST['witbox_modal_alert'] = function(it) {
var out='<div class="witbox-modal-messagebox"> <div class="witbox-text">'+(it.text)+'</div> <div class="witbox-buttons" style="text-align:center"> <button class="witbox-ok witbox-close">OK</button> </div></div>';return out;
};
WitBoxJST['witbox_modal_confirm'] = function(it) {
var out='<div class="witbox-modal-messagebox"> <div class="witbox-text">'+(it.text)+'</div> <div class="witbox-buttons"> <button class="witbox-ok witbox-close">OK</button> <button class="witbox-cancel witbox-close">Cancel</button> </div></div>';return out;
};
WitBoxJST['witbox_modal_galeryimg'] = function(it) {
var out='<img src="'+(it.url)+'" />';return out;
};
WitBoxJST['witbox_modal_galeryyt'] = function(it) {
var out='<iframe marginwidth="0" marginheight="0" frameborder="0" src="https://www.youtube.com/embed/'+(it.yt)+'?autoplay=0&rel=0" style="width: 1280px; height: 720px" allowfullscreen></iframe>';return out;
};
WitBoxJST['witbox_modal_yt'] = function(it) {
var out='<iframe marginwidth="0" marginheight="0" frameborder="0" width="853" height="480" src="https://www.youtube.com/embed/'+(it.yt)+'?autoplay=1&rel=0" allowfullscreen></iframe>';return out;
};
WitBoxJST['witbox_viewport_bordered'] = function(it) {
var out='<div class="witbox-viewport-bordered"> <div class="witbox-content"></div></div>';return out;
};
WitBoxJST['witbox_viewport_borderpinned'] = function(it) {
var out='<div class="witbox-viewport-bordered-pinned"> <div class="witbox-close"></div> <div class="witbox-content"></div></div>';return out;
};
WitBoxJST['witbox_viewport_galery'] = function(it) {
var out='<div class="witbox-viewport-galery"> <div class="witbox-prev-button"></div> <div class="witbox-next-button"></div> <div class="witbox-modal-galery" style="opacity: 0"> <div class="witbox-close"></div> <div class="witbox-content"></div> </div> <div class="witbox-pages"></div></div>';return out;
};
WitBoxJST['witbox_viewport_pinned'] = function(it) {
var out='<div class="witbox-viewport-pinned"> <div class="witbox-close"></div> <div class="witbox-content"></div></div>';return out;
};
