function get_dewater_option() {
    return {
        max_page_num : $("#max_page_num").attr("value"),
                     max_floor_num : $("#max_floor_num").attr("value"),
                     only_poster : $("#only_poster").attr("checked"),
                     with_toc : $("#with_toc").attr("checked"),
                     min_word_num : $("#min_word_num").attr("value")
    };

}

// get_page_floors  {

function extract_floor_info (info) {
    var text = info.text();
    var m = text.match(/№(\d+).+?☆☆☆(.+?)于([\d\s:-]+)留言☆☆☆/);
    return {
        id : parseInt(m[1]), 
           poster : m[2],
           time : m[3]
    };
}

function extract_floor_content (td) {
    var c = td.html();
    var w = td.text().length;
    return {
        content : c, 
                word_num : w
    };
}

function merge_floors_info ( info , content ) {
    for(var i in info){
        var x = info[i];
        var c = content[i];
        for( k in c){
            x[k] = c[k];
        }
    }
}

function get_page_floors(u) {
    $('#dewater_title').html("正在取 ：" + u);
    var floors_info = new Array();
    $.ajax({
        type:"get",
        url: u,
        cache:false ,
        async : false, 
        beforeSend: function(jqXHR) {
            jqXHR.overrideMimeType('text/html; charset=gb2312');
        },
        success: function(data){
            var $resp = $(data);

            $resp.find('font[color="99CC00"][size="-1"]').each(function(){
                var bot = $(this).parent();
                floors_info.push(extract_floor_info(bot));
            });

            var floors_content = new Array();
            $resp.find('td[class="read"]').each(function(){
                floors_content.push(extract_floor_content($(this)));
            });

            merge_floors_info(floors_info, floors_content); 
        }
    });    
    return floors_info;
}

// }

// set_topic {
function get_topic_url() {
    return  window.location.href ;
}

function get_topic_name() {
    return  $('td[bgcolor="#E8F3FF"]:first').text();
}

function set_topic(dst) {
    var c = '<a href="'+ get_topic_url() + 
        '">' + get_topic_name() + 
        '</a>';
    $(dst).html(c);
}
//  }

// get_page_urls {
function get_page_num() {
    var num = $('#pager_top').text();
    if(!num) return;

    var num_m = num.match(/共(\d+)页/);
    return num_m[1]; 
}


function get_page_urls() {
    var num = get_page_num();
    if(!num) return [ get_topic_url() ];

    var url = $('#pager_top a:first').attr('href');
    url=url.replace(/\d+$/,'').replace(/^/, 'http://bbs.jjwxc.net/showmsg.php');

    var url_list = new Array();

    for(var i = 0; i< num; i++){
        var j = i.toString();
        url_list.push(url.concat(j));
    }
    return url_list;
}
// }

// get_main_floors {
function select_page_urls(option) {
    var page_urls = get_page_urls();

    if(!option.max_page_num) return page_urls;

    var urls = new Array();
    var n = 1;
    for(var i in page_urls){
        if(n>option.max_page_num) break;
        var u = page_urls[i];
        urls.push(u);
        ++n;
    }
    return urls;
}

function is_floor_overflow(id, option) {
    if(!option.max_floor_num) return 0;
    if(id <= option.max_floor_num) return 0;
    return 1;
}

function get_main_floors(option) {
    var main_floors = new Array();

    var select_urls = select_page_urls(option);
    for(var i in select_urls){
        var u = select_urls[i];
        var f = get_page_floors(u);
        var flen = f.length;
        for(var j = 0 ; j < flen; j++){
            var id = f[j].id;
            if(is_floor_overflow(id,option)) return main_floors;
            main_floors[id] = f[j];
            $('#dewater_floor_num').html("floor : " + id);
        }
    }
    return main_floors; 
}
// }


function is_skip_floor(f, opt) {
    if(opt.only_poster && (f.poster!= opt.poster)) return 1;
    if(opt.min_word_num && (f.word_num < opt.min_word_num)) return 1;
    return ;
}




function add_floor_content(dst, f) {
    // №9 ☆☆☆墨君于2013-07-10 23:07:14留言☆☆☆
    var html = '<div class="floor" id="floor'+ f.id + 
        '">' + 
        '<div class="flcontent">' + f.content + 
        '</div>' +
        '<div class="fltitle"><a name="toc' + f.id + 
        '">№'+ f.id +
        '<span class="star">☆☆☆</span>' + f.poster + 
        '<span class="star">于☆☆☆</span>' + f.time +
        '<span class="star">留言☆☆☆</span></a></div>' +
        '</div>';
    $floor = $(html);
    $(dst).append($floor);
}

function add_floor_toc(dst, f) {
    var html = '<p>' + f.id +
        '# <a href="#toc'+ f.id + 
        '">' + f.time + 
        ' ' + f.poster + 
        '</a></p>';
    $floor = $(html);
    $(dst).append($floor);
}

function set_dewater_css() {

    $('body').css(    {
        'font-size': 'medium', 
    'font-family': 'Verdana, Arial, Helvetica, sans-serif',
    'margin': '1em 8em 1em 8em',
    'text-indent': '2em',
    });

    //$('#dewater_toc').css({
    //'line-height' : '120%'
    //});

    $('.flcontent').css({
        'line-height' : '125%'
    });

    //'border-bottom':'0.2em solid #ee9b73',
    $('#dewater_title,.fltitle,#dewater_toc').css({
        'border-bottom':'0.1em solid #99cc00',
        'margin':'0.8em 0.2em 2.8em 0.2em', 
        'text-indent': '0em',
        'padding-bottom': '0.25em',
    });

    $('.star').css({
        'color' : '#99cc00', 
    });


    $('#dewater_title').css({
        'text-align' : 'center', 
        'font-size': 'large',
    });
}

function main_dewater_form() {
    var option = get_dewater_option();

    var main_floors = get_main_floors(option);
    option.poster = main_floors[0].poster;

    set_topic('#dewater_title');

    $('#dewater_toc').html('');
    $('#dewater_floors').html('');

    for(var i in main_floors){
        var f = main_floors[i];
        if(is_skip_floor(f,option)) continue;

        if(option.with_toc) add_floor_toc('#dewater_toc', f);
        add_floor_content('#dewater_floors', f);
    }

    $('#dewater_floor_num').html('');
    $('body').html($('#dewater_div').html());
    set_dewater_css();
}
