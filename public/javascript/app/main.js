main
.controller('primary', function($scope, $http, Scopes){

	//initialize model variables
	$scope.query ='';

	//Thaana keyboard mappings
	var thaanaKeyboard = {}
	thaanaKeyboard._defaultKeyboard = 'phonetic';
	thaanaKeyboard._transFrom = 'qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?() ';
	thaanaKeyboard._transTo = {'phonetic': 'ްއެރތޔުިޮޕ][\\ަސދފގހޖކލ؛\'ޒ×ޗވބނމ،./ޤޢޭޜޓޠޫީޯ÷}{|ާށޑﷲޣޙޛޚޅ:\"ޡޘޝޥޞޏޟ><؟)( ','phonetic-hh': 'ޤަެރތޔުިޮޕ][\\އސދފގހޖކލ؛\'ޒޝްވބނމ،./ﷲާޭޜޓޠޫީޯޕ}{|ޢށޑޟޣޙޛޚޅ:\"ޡޘޗޥޞޏމ><؟)( ','typewriter': 'ޫޮާީޭގރމތހލ[]ިުްަެވއނކފﷲޒޑސޔޅދބށޓޯ×’“/:ޤޜޣޠޙ÷{}<>.،\"ޥޢޘޚޡ؛ޖޕޏޗޟޛޝ\\ޞ؟)( '}

	//set background class
	$scope.bgCover = 'bg-cover';
	
	//initially show primary search and hide results
	$scope.hideSearch = false;
	$scope.showResults = false;
	
	//set default language and input type to English
	$scope.lang = 'English';
	$scope.langSh ='en';
	$scope.inputClass = 'form-control';
	
	//language controller
	$scope.setLang = function(language){
		if(language === 1){
			$scope.lang = 'ދިވެހި';
			$scope.langSh ='dv';
			$scope.inputClass = 'form-control thaana';
		} else{
			$scope.lang = 'English';
			$scope.langSh ='en';
			$scope.inputClass = 'form-control';
		}
	}

	//handle thaana keyboard input
	$scope.toThaana = function(){
		if($scope.langSh === 'en'){
			return true;
		}
	
		if(event.which > 0){
			var key = event.which;
		}
		else {
			// Ignore special keys
			return true;
		}
		
		// Check for CTRL modifier key
		if (event.modifier) {
			var ctrl = event.modifiers & Event.CONTROL_MASK;
		}
		else if (typeof(event.ctrlKey) != 'undefined') {
			var ctrl = event.ctrlKey;
		}
		
		var transIndex = thaanaKeyboard._transFrom.indexOf(String.fromCharCode(key));
		
		// If pressed key does not require translation, let default action proceed
		if (transIndex == -1 || ctrl) {
			return true;
		}
		
		if (typeof event.preventDefault == 'function') {
			event.preventDefault();
		}
		else {
			event.returnValue = false;
		}
		
		// Set default state
		var keyboard = thaanaKeyboard._defaultKeyboard;
		
		// Look up the translated char
		var transChar = thaanaKeyboard._transTo[keyboard].substr(transIndex, 1);
		
		$scope.query += transChar;
	}

	//do elasticsearch query
	$scope.getResults = function(){
	
		if($scope.hideSearch === false){
			$scope.hideSearch = true;
		}
		
		if($scope.showResults === false){
			$scope.showResults = true;
		}	
		
		if($scope.bgCover === 'bg-cover'){
			$scope.bgCover = 'no-bg-cover';
		}
	
		var query = $scope.query;
		
		$http.get('/search/'+query+'/1')
		.success(function(data, status, headers, config){
			if(data.code === 0){
				return;
			}

			$scope.meta = 'a total of '+data.response.meta.hits+' hits in '+(data.response.meta.time/1000)+' seconds';
			$scope.results = data.response.items;
		})
		.error(function(data, status, headers, config){
			return;
		});
	}
})
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
			$scope.updates.push({
				title: record.title,
				url: record.url,
				time: record.timestamp,
				hash: record.hash
			});
		});
	})
	.error(function(data, status, headers, config){
		return;
	});
	
	socket.on('update', function(data){
		$scope.updates.unshift({
			title: data.response.title,
			url: data.response.url,
			time: data.response.timestamp,
			hash: data.response.hash
		});
		if($scope.updates.length > 10){
			$scope.updates.splice(-1,1);
		}
	});
});