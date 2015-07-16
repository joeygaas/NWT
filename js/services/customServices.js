'use strict';

/**
*@customServices services module
*
*@description module that contains all the custom services
*/
angular.module('customServices', [])

/**
*@customServices service
*@name objToArray
*
*@description service that convert an object to an array
*@param data {{ array }} data you want to convert in to an  array 
*/
.factory('objToArray', function(){
	return {
		toIndexedArray: function(data, prop_name){
			var results = [];

			if(angular.isArray(data)){
				for(var i = 0; i < data.length; i++){
					results.push(data[i][prop_name].toLowerCase());
				}

				return results;
			}

			return data;
		}
	};
});
