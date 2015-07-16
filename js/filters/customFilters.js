'use strict';

/**
*@customFilters filters module
*
*@description module that contains all the custom filters
*/
angular.module('customFilters', [])

/**
*@customFilter filter
*@name unique
*
*@description filters unique items 
*@param data {{ array }} data you want to filter 
*@param prop_name {{ str }} name of the object property
*/
.filter('unique', function(){
	
	return function(data, prop_name){
		
		if(angular.isArray(data) && angular.isString(prop_name)){
			
			var results = [];

			for(var i = 0; i < data.length; i++){
				
				var val = data[i][prop_name];

				if(results.indexOf(data[i][prop_name]) == -1){
					
					results.push(val);
				
				}
			}

			return results;
		
		}
		else {
			
			return data;
		
		}
	};

})

/**
*@customFilter filter
*@name filterByPropName
*
*@description filter the data by porperty name 
*@param data {{ array }} data you want to filter
*@param prop_name {{ str }} name of the object property
*@param name {{ str }} value of the pro_name, That you want to get 
*/
.filter('filterByPropName', function(){
	
	return function(data, prop_name, name){

		if(angular.isArray(data) && angular.isString(prop_name)){
			
			var results = [];

			for(var i = 0; i < data.length; i++){
				
				if(data[i][prop_name] == name){
					
					results.push(data[i]);
				
				}
			} 

			return results;
		
		}
		else {
			
			return data;
		
		}
	};

})

/**
*@customFilter filter
*@name filterKeyword
*
*@description filter the data by keyword
*@param data {{ array }} data you want to filter
*@param prop_name {{ str }} proper name you want to filter
*@param keyword {{ str }}  the filter word
*/

.filter('filterKeyword', function(){
	
	return	function(data, prop_name, keyword, exempted){	

		if(angular.isArray(data) && angular.isString(keyword)){

			var key_array = keyword.split(' ');
			var results = [];
			var existed = 0;
			var text = "";
			var key = "";

			console.log(key_array);
			console.log(exempted);


			for(var i = 0; i < key_array.length; i++){
				
				if(key_array[i].length > 3 || exempted.indexOf(key_array[i]) == -1){
					
					existed++;
				}

			}

			console.log(existed);
			
			for(var i = 0; i < data.length; i++){
				
				var times = 0;

				for(var x = 0; x < key_array.length; x++){
					
					text = data[i][prop_name].toLowerCase();
					key = key_array[x].toLowerCase();

					if(exempted.indexOf(key) == -1 && text.indexOf(key) != -1){
						
						times++;
					}
				}

				if(times >= existed){

					results.push(data[i]);

				}
			}

			return results;

		}
		else {

			return data;
		
		}
	};

})

/**
*@customFilter filter
*@name paginate
*
*@description paginate the results
*@param data {{ array }} data you want to filter
*@param size {{ int }}  items allowed per page
*@param selected_page {{ int }} the current selected page
*/
.filter('paginate', function(){

	return function(data, size, selected_page){

		if(angular.isArray(data)){

			var results = []; // stores the results data

			// conpute the first and last index of the array
			var first_index = size * (selected_page - 1); 
			var last_index = first_index + size;

			results =  data.slice(first_index, last_index);

			return results;

		}
		else {

			return data;

		}

	};

})

/**
*@customFilter filter
*@name range
*
*@description paginate the results
*@param data {{ array }} data you want to filter
*@param page {{ int }} items per page
*/
.filter('range', function(){

	return function(data, size){

		if(angular.isArray(data)){

			var length = data.length / size;

			// return and round to the nearest integer
			return Math.ceil(length);

		}
		else {

			return data;

		}
	};

})

/**
*@customFilter filter
*@name search
*
*@description filter the results using the keyword
*@param data {{ array }} data you want to filter
*@param keyword {{ string }} keyword
*
*@return array 
*/
.filter('customSearch', function($filter, filterFilter){
	
	return function(data, keyword, ban_words){

		var results = [];

		results = filterFilter(data, keyword);

		if(results != ''){
			
			return results;
		
		}
		else if(results == ''){

			results = $filter('filterKeyword')(data, 'text', keyword, ban_words);

			if(results != ''){

				return results;
			
			}
			else {

				return results;
			}
		}
	
	};

})

/**
*@custom filter function
*@name highlight
*
*@description underilne the filtered string in the display
*@param data {{aray}}, supplied by angularjs
*@param key {{string}}, the key string you want to highlight
*/
.filter("highlight", function($sce){
	return function(data, key){
		// variable declaration
		var new_str = ""; // store ne string
		var result = ""; // store the final string
		var replacement_str = ""; // replacement string
		var match_str; // store the match string

		if(angular.isString(data)){
			//get the match substring and store it
			match_str = data.match(new RegExp(key, "i"));

			// check if the match_str is empty
			if(match_str != " "){

				// split all the data
				var data_split  = data.split(' ');
				var key_split = key.split(' ');
				var index, new_val, old_val;

				for(var i = 0; i < data_split.length; i++){

					// store the old value of the array element. This will be used to  create a new value 
					// if the conditional if statement is true. To retain the formating of the text.
					old_val = data_split[i];

					for(var x = 0; x < key_split.length; x++){

						if(data_split[i].toUpperCase() == key_split[x].toUpperCase()){

							// create a new value string using the old value 
							new_val = old_val;

							// delete the old value
							delete data_split[i];

							// set the new value
							data_split[i] = "<b class=bg-danger>" + new_val + "</b>"; 

						}
					}
				}

				// conver the array into a string 
				new_str = data_split.join(' ');

			}
			else {
				// set the new str to the original value
				new_str = data;
			}

			// unsanitize the string 
			result = $sce.trustAsHtml(new_str);

			return result;
		}
		else {
			// do nothing with the data
			return data;
		}
	}
});
