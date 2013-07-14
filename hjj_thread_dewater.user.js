// --------------------------------------------------------------------
//
// ==UserScript==
// @name          hjj_thread_dewater 
// @namespace     http://abbypan.github.com/
// @version       0.1
// @author        Abby Pan (abbypan@gmail.com)
// @description   红晋江( http://bbs.jjwxc.net ) 贴子脱水
// @copyright     2013, Abby Pan (http://abbypan.github.com/) 
// @grant         GM_getResourceText
// @include       http://bbs.jjwxc.net/showmsg.php?board=*&id=*
// @downloadURL   http://userscripts.org/scripts/source/173233.user.js
// @updateURL     http://userscripts.org/scripts/source/173233.meta.js
// @resource      hjj_thread_dewater https://raw.github.com/abbypan/hjj_thread_dewater/master/hjj_thread_dewater.js
// ==/UserScript==
//
// --------------------------------------------------------------------
var $ = unsafeWindow.jQuery;

add_js_file('hjj_thread_dewater');

add_dewater_div();
add_dewater_form();

function add_dewater_form() {

	$dewater_div = $('\
            <div id="dewater_div_form" style="align:center;">\
            前<input id="max_page_num" name="max_page_num" size="5"/>页,\
            前<input id="max_floor_num" name="max_floor_num" size="5"/>楼, \
            每楼最少<input id="min_word_num" name="min_word_num" size="5"/>字,\
            <input type="checkbox" id="only_poster" name="only_poster">只看楼主,\
            <input type="checkbox" id="with_toc" name="with_toc" checked />生成目录, \
            <input type="submit" value="脱水" onclick="dewater_thread()" />\
            </div>');

	$('title').after($dewater_div);
}

function add_dewater_div() {
	$main_floors = $('\
            <div id="dewater_div">\
            <div id="dewater_title"></div>\
            <div id="dewater_toc"></div>\
            <div id="dewater_floors"></div></div>');
	$('title').after($main_floors);
}

function add_js_file(js) {
	var text = GM_getResourceText(js);

	var add = document.createElement('script');
	add.setAttribute('type', "text/javascript");
	add.appendChild(document.createTextNode(text));

	document.getElementsByTagName('head')[0].appendChild(add);
}

