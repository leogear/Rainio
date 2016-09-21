/**************************************************************************
* Author: Nguyen Ba Anh Dung
* Author URL: www.fb.com/harrynhokz, www.fb.com/leogearsoftware
* Mail: dungnb4@gmail.com, harrynhok@gmail.com
* FB: harrynhokz, nb4dz
**************************************************************************/

//////////----------Init----------\\\\\\\\\
injectHTMl();

//////////----------UI----------\\\\\\\\\
//1.Show download panel 
$(document).on('click', '.action-panel-trigger-download', function (e) {
	var yid = $('.yt-uix-videoactionmenu').data('video-id');
	var url = 'https://savevideos.xyz/api?v=' + yid;
	//Toggled
	$(this).toggleClass('yt-uix-button-toggled');
	//Show loading panel
	$('#download-action-panels').toggleClass('hid');
	$('#download-actions-loading').removeClass('hid');

	//Hide Audio/Video panel
	$('#download-actions-panel').addClass('hid');
	if (!$('#download-action-panels').is('hid')) {
		$('#download-action-panels').css('display', '');
	}

	//Get download links
	$.get(url, function (data, status) {
		var html = $('.download-panel-audio').html();
		var htmlvideo = $('.download-panel-video').html();
		var audio = '';
		var video = '';

		data.audio.forEach(function (v, i) {
			audio += '<li class="watch-meta-item has-image"><h4 class="title">' + v.abr + '</h4>'
				+ '<ul class="content watch-info-tag-list">'
				+ '<li><a class="yt-download-file" href="' + v.url + '" download="' + data.title + v.ext + '">' + data.title + '.' + v.ext + '</a></li>'
				+ '<li>size: ' + v.size + '</li>'
				+ '</ul>'
				+ '</li>';
		});

		data.video.forEach(function (v, i) {
			video += '<li class="watch-meta-item has-image"><h4 class="title">' + v.res + '</h4>'
				+ '<ul class="content watch-info-tag-list">'
				+ '<li><a class="yt-download-file" href="' + v.url + '" download="' + data.title + '.' + v.ext + '">' + data.title + '.' + v.ext + '</a></li>'
				+ '<li>size: ' + v.size + '</li>'
				+ '</ul>'
				+ '</li>';
		});

		html = html.replace('{audiolist}', audio);
		htmlvideo = htmlvideo.replace('{videolist}', video);
		//Set data
		$('.download-panel-audio').html(html);
		$('.download-panel-video').html(htmlvideo);
		//Show Audio/Video panel
		$('#download-actions-panel').removeClass('hid');
		//Hide loading panel
		$('#download-actions-loading').addClass('hid');
	}, 'JSON');
});

//2.Close download panel
$(document).on('click', '#download-panel-dismiss', function (e) {
	var panel = '#' + $(this).data('close-parent-id');
	$(panel).addClass('hid');
	$('.action-panel-trigger-download').removeClass('yt-uix-button-toggled');
});

//3.Download tabs
$(document).on('click', '#download-action-panels .yt-uix-button-group .yt-uix-button', function (e) {
	e.preventDefault();
	var panel = '.' + $(this).data('panel');
	if (!$(this).is('yt-uix-button-toggled')) {
		$('.download-panel').addClass('hid');
		$(panel).removeClass('hid');

		$('#download-action-panels .yt-uix-button-group .yt-uix-button').removeClass('yt-uix-button-toggled');
		$(this).addClass('yt-uix-button-toggled');
	}
});

//4.Reload UI when navigate
var observer = new MutationObserver(function (mutations, observer) {
	mutations.forEach(function (mutation) {
		if (mutation.attributeName === 'class') {
			injectHTMl();
		}
	});
});

var config = { attributes: true, childList: true, characterData: true };
var node = $('#content')[0];
observer.observe(node, config);

//////////----------Functions----------\\\\\\\\\
//1.Inject UI
function injectHTMl() {
	//Inject button
	$.get(chrome.extension.getURL('src/html/button.html'), function (data) {
		$('#watch8-secondary-actions').append(data);
	});
	//Inject panel
	$.get(chrome.extension.getURL('src/html/panel.html'), function (data) {
		$('#watch-header').after(data);
	});
}