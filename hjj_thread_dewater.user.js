// --------------------------------------------------------------------
//
// ==UserScript==
// @name          hjj_thread_dewater 
// @namespace     http://abbypan.github.com/
// @description   红晋江( http://bbs.jjwxc.net ) 贴子脱水
// @author        Abby Pan (abbypan@gmail.com)
// @homepage      http://abbypan.github.com/
// @copyright     2013+, Abby Pan (http://abbypan.github.com/)
// @version       0.1
// @include       http://bbs.jjwxc.net/showmsg.php?board=*&id=*
// @resource      hjj_thread_dewater https://raw.github.com/abbypan/hjj_thread_dewater/master/hjj_thread_dewater.js
// ==/UserScript==
//
// --------------------------------------------------------------------
// @resource      hjj_thread_dewater hjj_thread_dewater.js


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
            <input type="submit" value="脱水" onclick="main_dewater_form()" />\
            </div>');

    $('title').after($dewater_div);
}

function add_dewater_div() {
    $main_floors = $('\
            <div id="dewater_div">\
            <div id="dewater_title"></div>\
            <div id="dewater_floor_num"></div>\
            <div id="dewater_toc"></div>\
            <div id="dewater_floors"></div></div>');
    $('title').after($main_floors);
}


function add_js_file(js){
    var text = GM_getResourceText(js);

    var add = document.createElement('script');
    add.setAttribute('type',"text/javascript");
    add.appendChild(document.createTextNode(text));

    document.getElementsByTagName('head')[0].appendChild(add);
}
