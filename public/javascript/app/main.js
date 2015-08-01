main
	.controller('crawlerFeed', function($scope, $http, socket){
		$scope.updates = [];
		socket.on('update', function(data){
			$scope.updates.unshift({
				data:	data,
				time: new Date() 
			});
			if($scope.updates.length > 5){
				$scope.updates.splice(-1,1);
			}
		});
	})
	.controller('search', function($scope, $http, Scopes){
		$scope.getResults = function(){
			var query = $scope.query;
			$http.get('/search/'+query+'/1').
				success(function(data, status, headers, config){
					if(data.code === 0){
						return;
					}
					
					var meta = {};
					meta.took = data.response.took;
					meta.hits = data.response.hits.total;
					var results = data.response.hits.hits;
					
					Scopes.store('meta', meta);
					Scopes.store('results', results);
				}).
				error(function(data, status, headers, config){
					return;
				});
		}
	})
	.controller('searchResults', function($scope, Scopes){
		$scope.$watch(function () { return Scopes.get('meta'); }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.meta = 'fetched '+newValue.hits+' documents in '+(newValue.took/1000)+' seconds ';
    });
		$scope.$watch(function () { return Scopes.get('results'); }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.results = newValue;
    });
	});