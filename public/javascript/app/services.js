var main = angular.module('main', ['angularMoment']);
main.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

main.factory('Scopes', function ($rootScope) {
  var mem = {};
 
  return {
    store: function (key, value) {
      mem[key] = value;
    },
    get: function (key) {
      return mem[key];
    }
  };
});

main.directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if(event.which === 13) {
				scope.$apply(function(){
					scope.$eval(attrs.ngEnter);
				});
				event.preventDefault();
			}
		});
	};
});

main.filter('excerpt_html', ['$sce', function ($sce) { 
  return function (highlight) {
  	if(highlight.r_intro && highlight.fulltext){
  		var aggregate = highlight.r_intro.concat(highlight.fulltext);
  		var text = aggregate.join('... ');
  	}else if(highlight.r_intro){
  		var text = highlight.r_intro.join('... ');
  	}else {
  		var text = highlight.fulltext.join('... ');
  	}
    return $sce.trustAsHtml(text);
  };    
}])