'use strict';

/**
*@NwtApp controllers module
*
*@description module that contains all the app controllers
*/
angular.module('nwtApp')

// base path that will be used to get the resources data
.constant('baseUrl', 'resources/')

/**
*@NwtApp controller
*@name TopController
*
*@description Top controller
*/
.controller('TopController', function($scope, $http, $location, $rootScope, $filter, $anchorScroll, objToArray, filterFilter, baseUrl){

	// object that will holds all the error msg
	$scope.data = {};

	// load the language data
	$http.get(baseUrl + 'lang.json')
	.success(function(data){
		
		$scope.languages = data;
	
	})
	.error(function(err){
		
		$scope.data.error = err;
	
	});

	// set the application language
	var language = localStorage.language;
	
	if(!language) {
		
		localStorage.language = "tl";
		language = localStorage.language;
	
	}

	// load the search data
	$http.get(baseUrl + language + '/searchData.json')
	.success(function(data){

		$scope.searchData = data;

	});

	// load the scripture type data
	$http.get(baseUrl + language + '/bible/scriptureType.json')
	.success(function(data){
		
		$scope.scriptureType = data;
	
	})
	.error(function(error){
		
		$scope.data.error = error;
	
	});


	// load all the bible part1 titles
	$http.get(baseUrl + language + '/bible/part1.json')
	.success(function(data){
		
		$rootScope.part1 = data;
	
	})
	.error(function(err){
		
		$scope.data.error = err;
	
	})
	// load all the bile part2 titles
	$http.get(baseUrl + language + '/bible/part2.json')
	.success(function(data){
		
		$rootScope.part2 = data;
	
	})
	.error(function(err){
		
		$scope.data.error = err;
	
	})

	// load the ban words data
	$http.get(baseUrl + language +'/banWords.json').success(function(data){
		
		$rootScope.ban_words = data;
	
	}).error(function(err){
		
		$scope.data.error = err;
	
	});

	/**
	*@ToController function
	*@name setLanguage
	*
	*@description function that set the language of the app
	*@param lang {{ str }} language
	*
	*/
	$scope.setLanguage = function(lang){
		
		// set the language
		localStorage.language = lang;
		// reload the page
		location.reload();

		console.log(lang);

	}

	/**
	*@ToController function
	*@name setBookmarks
	*
	*@description function that set the bookamarks in the localStorage
	@param key {{json object}} the object you want to sotre
	*
	*/
	$scope.setBookmark = function(key){

		var bms = localStorage.bms;

		if(!bms){

			var tmp_bms = [];

			tmp_bms.push(key);

			localStorage.bms = JSON.stringify(tmp_bms);

		}
		else {

			var tmp = JSON.parse(localStorage.bms);

			// convert the key['text'] to array
			var text = $filter('unique')(tmp, 'text');

			// remove item in the array 
			// if the item text property is found in the text array
			if(text.indexOf(key['text']) == -1){
				tmp.push(key);
			}

			localStorage.bms = JSON.stringify(tmp);

		}
		
	}

	/**
	*@ToController function
	*@name getBookmarks
	*
	*@description function that get the bookamarks form the local storage
	*
	*/
	$scope.getBookmarks = function(){
		
		$scope.bookmarks = JSON.parse(localStorage.bms);
		console.log($scope.bookmarks);
		$scope.showModal('#bookmark-modal');

	}

	/**
	*@ToController function
	*@name removeBookmarks
	*
	*@description function that remove the bookamarks form the local storage
	@param key {{json object}} the object you want to sotre
	*
	*/
	$scope.removeBookmarks = function(key){
		
		var bms = JSON.parse(localStorage.bms);

		for(var i = 0; i < bms.length; i++){
			
			if(typeof bms[i] != null){
				
				if(bms[i]['text'] == key['text']){
					bms.splice(i, 1);
				}
			}

		}

		$scope.bookmarks = bms;

		localStorage.bms = JSON.stringify(bms);

		console.log(bms);
	}

	/**
	*@TopController function
	*@name search
	*
	*@description function that search if the keyword is in the data
	*@param keyworkd {{ str }} search keyword
	*
	*@ return results {{ array }} result data 
	*/
	$scope.search = function(keyword){	

		// default selected page
		$scope.page = 1;
	
		// hide the no results msg
		$scope.no_results = false;

		// hide the verse div
		$scope.show_verse = false;

		// show loading bar
		$scope.loading = true;

		// concatenate the two parts of the bible
		var books_obj= $rootScope.part1.concat($rootScope.part2);
		// conver the object into array
		var books_array = objToArray.toIndexedArray(books_obj, 'book');

		// get the title of the book using this regular expression
		var title_regExp = /\b[a-zA-Z]{3,4}\s([a-zA-Z]{2}|[a-zA-Z+])\s[a-zA-Z]+\b|[a-zA-Z]{3,4}\s[a-zA-Z]+|^\d\s[a-zA-Z]+|^[a-zA-Z]+/;
		// get the chapter of the page using this regular expression
		var title_ch_regExp = /\s\d{1,3}(\s|$)/;
		// get the chapter verse using this regular expression
		var ch_verse_regExp = /\s\d{1,3}$/;
		// check the input regExp pattern using this regular expression
		var page_regExp = /^[a-zA-Z]+\s\d{1,3}$|^\d\s[a-zA-Z]+\s\d{1,3}$|^[a-zA-Z]{3,4}\s([a-zA-Z]{2}|[a-zA-Z]+)\s[a-zA-Z]+\s\d{1,3}$|^[a-zA-Z]{3,4}\s([a-zA-Z]{2}|[a-zA-Z]+)\s\d{1,3}$/; 
		// used this regExp to filter the data by books + chapter + verse
		var search_by_verse_regExp = /[a-zA-Z]+\s\d{1,3}\s\d{1,3}$/;

		//set the book and ch and verse values
		var book = title_regExp.exec(keyword);
		var ch = title_ch_regExp.exec(keyword);
		var verse = ch_verse_regExp.exec(keyword);

		// book
		if(books_array.indexOf(keyword.toLowerCase()) != -1){
			
			$location.path('/bible/' + keyword);

			$scope.loading = false;
		
		}

		// book + chapter
		// if keyword regExp is == to /str + num/ or /num + str + num/ or /str + str + num/ or /str + str + num/
		else if(page_regExp.test(keyword) == true ){

			$location.path('/bible/' + book[0] + '/' + ch[0] );

			$scope.loading = false;
		
		}

		// book + verse
		// input regExp is == to /str + num + num/ or /num + str + num + num/ or /str + str + num/ or /str + str + str + num/ 
		else if(search_by_verse_regExp.test(keyword) == true){
			
			for(var i = 0; i < $scope.searchData.length; i++){

				if( $scope.searchData[i]['book'].toLowerCase() ==  book[0].toLowerCase() && $scope.searchData[i]['ch'] == ch[0]
					&& $scope.searchData[i]['v'] == verse ){

					$scope.verse = $scope.searchData[i];

					$scope.showModal('#search-modal');

					$scope.show_verse = true;

				}

			}

			// hide the loading bar
			$scope.loading = false;

		}
		// keyword
		else {

				// store the baned
				var ban_words = objToArray.toIndexedArray($rootScope.ban_words, 'word');

				// pass the search key to the scope and use it as a highlight key in the highlight filter
				$scope.search_key = keyword;
				
				$scope.results = $filter('customSearch')($scope.searchData, keyword, ban_words);

				if($scope.results == ''){
					$scope.no_results = true;
				}

				// show the search-modal box
				$scope.showModal('#search-modal');

				// hide loading bar
				$scope.loading = false;

		}

		// clear the input field
		$scope.key = '';
		
	}

	/**
	*@TopController function
	*@name selecPage
	*
	*@description function that select the pagination page of results
	*
	*@return page {{ int }} selected page + 1
	*/
	$scope.selectPage = function(page){
		$scope.page = page;

		console.log($scope.page);
	}

	/**
	*@TopController function
	*@name showModal
	*
	*@description function that display the modal box
	*
	*@param str {{ id }} the id of the modal box
	*/
	$scope.showModal = function(id){
		$(id).modal('show');
	}

	/**
	*@TopController function
	*@name hideModal
	*
	*@description function that hide the modal box
	*
	*@param str {{ id }} the id of the modal box
	*/
	$scope.hideModal = function(id){
		$(id).modal('hide');
	}

})

/**
*@NwtApp controller
*@name HomeController
*
*@description controller thats holds all the Home page functionalities 
*/
.controller('HomeController', function($scope, $http, baseUrl){
	
	// get the language cookie value
	var language = localStorage.language; 

	// load the supported language data. This will be used to generate a list of supported language
	// in the view form
	$http.get(baseUrl + 'lang.json')
	.success(function(data){
		
		$scope.lang_items = data;
	
	})
	.error(function(error){
		
		$scope.data.error = error;
	
	});

})

/**
*@NwtApp controller
*@name BibleController
*
*@description controller that facilitates all the Bible page behavior
*/
.controller('BibleController', function($scope, $http, baseUrl){
	
	// load the set language
	var language = localStorage.language;

	// hide the loading bar
	$scope.loading = false;

})

/**
*@NwtApp controller
*@name BibleBookController
*
*@description controller that facilitates all the bibble book page behavior
*/
.controller('BibleBookController', function($scope, $routeParams, $http, $filter, baseUrl){
	
	// set the language
	var language = localStorage.language;

	// load all the book
	$http.get(baseUrl + language + '/bible/books/' + $routeParams.book + '.json')
	.success(function(data){

		$scope.chapters = $filter('unique')(data, 'ch');
		$scope.book = data[0]['book'];

		// hide the loading bar
		$scope.loading = false;
	
	});

})


/**
*@NwtApp controller
*@name BibleChapterController
*
*@description controller that facilitates all the bibble chapter page behavior
*/
.controller('BibleChapterController', function($scope, $routeParams, $http, $filter, baseUrl){
	
	// set the language
	var language = localStorage.language;

	// load the book
	$http.get(baseUrl + language + '/bible/books/' + $routeParams.book + '.json')
	.success(function(data){
		
		// get the specified chapter
		$scope.chapter = $filter('filterByPropName')(data, 'ch', $routeParams.chapter);

		// hide the loading bar
		$scope.loading = false;

	})
	.error(function(err){
		
		$scope.data.error= err;
	
	});
});