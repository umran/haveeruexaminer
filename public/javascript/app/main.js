main
.controller('feed', function($scope, $http){
	$scope.items = [];
	//populate crawlerFeed with 5 most recent db entries 
	$http.get('/feed')
	.success(function(data, status, headers, config){
		data.response.forEach(function(record){
			$scope.items.push(record);
		});
	})
	.error(function(data, status, headers, config){
		return;
	});
})
.controller('crawlerFeed', function($scope, $http, socket){
	$scope.updates = [];
	$http.get('/crawlerfeed')
	.success(function(data, status, headers, config){
		data.response.forEach(function(record){
			$scope.updates.push(record);
		});
	})
	.error(function(data, status, headers, config){
		return;
	});
	
	socket.on('update', function(data){
		$scope.updates.unshift(data.response);
		if($scope.updates.length > 10){
			$scope.updates.splice(-1,1);
		}
	});
})
.controller('search', function($scope, $http, Scopes){
	$scope.getResults = function(){
		var query = $scope.query;
		$http.get('/search/'+query+'/1')
		.success(function(data, status, headers, config){
			if(data.code === 0){
				return;
			}
			
			var meta = data.response.meta;
			var results = data.response.items;
			
			Scopes.store('meta', meta);
			Scopes.store('results', results);
		})
		.error(function(data, status, headers, config){
			return;
		});
	}
})
.controller('searchResults', function($scope, $location, $anchorScroll, Scopes){
	$scope.$watch(function () { return Scopes.get('meta'); }, function (newValue, oldValue) {
		if (newValue !== oldValue){
			$scope.meta = 'fetched '+newValue.hits+' documents in '+(newValue.time/1000)+' seconds ';
		}
	});
	$scope.$watch(function () { return Scopes.get('results'); }, function (newValue, oldValue) {
		if (newValue !== oldValue){
			$scope.results = newValue;
			
			$location.hash('searchResults');
			$anchorScroll();
			$location.hash('');
		}
	});
});