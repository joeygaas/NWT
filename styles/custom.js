'use strict';

// custom jQuery for page styling

$(document).ready(function(){

	// remove the focus to the search box when the user resize the box
	$(window).resize(function(){
		$('input[type=search]').blur();
	});

	// apply tooltips to all the menu items
	$('title').tooltip();

	// show the search box when the search button is clicked
	$('.trigger').click(function(){

		// get the width of the window
		var width = $(window).width();
		// show the search box
		$('input[type=search]').width( width - (width * 0.20) ).css('display', 'block').focus();
		// hide the search button and menu
		$('.trigger').css('display', 'none');
		$('.menu').css('display', 'none');
	});

	// hide the search box when it is out of focus
	$('input[type=search]').blur(function(){
		// hide the search box
		$('input[type=search]').width(0).css('display', 'none');
		// show the search button
		$('.trigger').css('display', 'block');
		$('.menu').css('display', 'block');
	});
});