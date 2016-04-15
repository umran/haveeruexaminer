main
.controller('primary', function($scope, $http, Scopes, ngProgressFactory){

	//initialize model variables
	$scope.query ='';

	//Thaana keyboard mappings
	var thaanaKeyboard = {}
	thaanaKeyboard._defaultKeyboard = 'phonetic';
	thaanaKeyboard._transFrom = 'qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?() ';
	thaanaKeyboard._transTo = {'phonetic': 'ްއެރތޔުިޮޕ][\\ަސދފގހޖކލ؛\'ޒ×ޗވބނމ،./ޤޢޭޜޓޠޫީޯ÷}{|ާށޑﷲޣޙޛޚޅ:\"ޡޘޝޥޞޏޟ><؟)( ','phonetic-hh': 'ޤަެރތޔުިޮޕ][\\އސދފގހޖކލ؛\'ޒޝްވބނމ،./ﷲާޭޜޓޠޫީޯޕ}{|ޢށޑޟޣޙޛޚޅ:\"ޡޘޗޥޞޏމ><؟)( ','typewriter': 'ޫޮާީޭގރމތހލ[]ިުްަެވއނކފﷲޒޑސޔޅދބށޓޯ×’“/:ޤޜޣޠޙ÷{}<>.،\"ޥޢޘޚޡ؛ޖޕޏޗޟޛޝ\\ޞ؟)( '}

	//set background class
	$scope.bgCover = 'no-bg-cover';
	
	//create progress bar
	$scope.progressbar = ngProgressFactory.createInstance();
	$scope.progressbar.setColor('#093F84');
	//initially show primary search and hide results
	$scope.showResults = true;
	$scope.showDoc = false;
	
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
	$scope.toThaana = function(event){
		if($scope.langSh === 'en'){
			return true;
		}
		
		event = event || window.event
	
		if(event.which > 0){
			var key = event.which;
			
			//debug
			console.log(key);
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
	$scope.getResults = function(page){
		//start progress bar on click
		$scope.progressbar.start();
	
		$scope.showResults = true;
		$scope.showDoc = false;
		
		if(!page) {
			page = 1;
		}
		var query = $scope.query;
		
		$http.get('/search/'+query+'/'+page)
		.success(function(data, status, headers, config){
			if(data.code === 0){
				return;
			}

			$scope.meta = +data.response.meta.hits+' hits in '+(data.response.meta.time/1000)+' seconds';
			$scope.results = data.response.items;
			
			$scope.pages = [];
				
			for(i=1; i <= Math.ceil(data.response.meta.hits/15); i++){
				var s = i;
				if(s < 10){
					s = '0'+s;
				}
				$scope.pages.push(s);
			}
			
			//complete progress bar on load
			$scope.progressbar.complete();
		})
		.error(function(data, status, headers, config){
			//complete progress bar on error too
			$scope.progressbar.complete();
			return;
		});
	}
	
	//fetch document
	$scope.fetchDoc = function(hash){
		//start progress bar on click
		$scope.progressbar.start();
		
		$http.get('/fetch/'+hash)
		.success(function(data, status, headers, config){
			$scope.document = data.response;
			$scope.showResults = false;
			$scope.showDoc = true;
			
			//complete progress bar on load
			$scope.progressbar.complete();
		})
		.error(function(data, status, headers, config){
			//complete progress bar on error too
			$scope.progressbar.complete();
			return;
		});
	}
})
.controller('feed', function($scope, $http){
	$scope.items = [];
	//populate crawlerFeed with most recent db entries 
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