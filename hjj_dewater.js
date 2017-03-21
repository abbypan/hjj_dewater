function banner_path() {
    return 'div[id="pager_top"]';
    //return 'div[style="float: left;"]';
}

function extract_floor_info(info) {
	var c = info.html();
	var w = info.text().length;
    var meta = info.parents("tr:eq(1)").next().text();
	var m = meta.match(/№(\d+).+?☆☆☆(.*?)于([\d\s:-]+)留言☆☆☆/);
	return {
		content: c,
		word_num: w, 
		id: parseInt(m[1]),
		poster: m[2] || '无名氏',
		time: m[3]
	};
}

function floor_path() {
    return 'td[class="read"]';
}

function page_charset() {
    return 'gb2312';
}

function get_topic_name() {
	return $('td[bgcolor="#E8F3FF"]:first').text();
}

function get_page_num() {
	var num = $('#pager_top').text();
	if (!num) return;

	var num_m = num.match(/共(\d+)页/);
	return num_m[1];
}

function format_thread_url_1st(url) {
    url = url.replace(/#.*$/, '').replace(/&page=\d+/, '&page=0');

    if(! url.match(/&page=\d+/)){
        url = url.concat('&page=0');
    }

    return url;
}

function format_thread_url_ith(url,i)  {
    var id = parseInt(i) - 1;
    var j = id.toString();
    var n_url = url.replace(/&page=\d+/, '&page='+ j);
    return n_url;
}
