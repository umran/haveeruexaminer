var thaanaKeyboard = {}
thaanaKeyboard._defaultKeyboard = 'phonetic';
thaanaKeyboard._transFrom = 'qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?()';
thaanaKeyboard._transTo = {'phonetic': 'ްއެރތޔުިޮޕ][\\ަސދފގހޖކލ؛\'ޒ×ޗވބނމ،./ޤޢޭޜޓޠޫީޯ÷}{|ާށޑﷲޣޙޛޚޅ:\"ޡޘޝޥޞޏޟ><؟)(','phonetic-hh': 'ޤަެރތޔުިޮޕ][\\އސދފގހޖކލ؛\'ޒޝްވބނމ،./ﷲާޭޜޓޠޫީޯޕ}{|ޢށޑޟޣޙޛޚޅ:\"ޡޘޗޥޞޏމ><؟)(','typewriter': 'ޫޮާީޭގރމތހލ[]ިުްަެވއނކފﷲޒޑސޔޅދބށޓޯ×’“/:ޤޜޣޠޙ÷{}<>.،\"ޥޢޘޚޡ؛ޖޕޏޗޟޛޝ\\ޞ؟)('}

$(document).ready(function(){
	$('#search').keypress(function(event){
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
		
		event.preventDefault();
		
		// Set default state
		var keyboard = thaanaKeyboard._defaultKeyboard;
		
		// Look up the translated char
		var transChar = thaanaKeyboard._transTo[keyboard].substr(transIndex, 1);
		
		$(this).val($(this).val() + transChar);
	});
});
