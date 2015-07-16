'use strict';

/**
*@angular module
*@name NWTApp
*
*@description main app module
*/
var nwtApp = angular.module('nwtApp', ['ngRoute', 'customFilters', 'customServices'])

/**
*@NWTApp config
*
*@description App routing configuration
*/
.config(function($routeProvider){
	$routeProvider
	// bible routes
	.when('/', {
		templateUrl: 'views/bible.html',
		controller: 'BibleController'
	})
	.when('/bible/:book', {
		templateUrl: 'views/bibleBook.html',
		controller: 'BibleBookController'
	})
	.when('/bible/:book/:chapter', {
		templateUrl: 'views/bibleChapter.html',
		controller: 'BibleChapterController'
	});
});