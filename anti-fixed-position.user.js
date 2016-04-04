// ==UserScript==
// @name         Anti Fixed header
// @namespace    http://github.com/kba
// @version      0.1
// @description  Turns fixed headers (navbars and such) into relative positioned elements. Good for small screens.
// @author       kba
// @match        http://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	var elems = document.querySelectorAll('div,nav,header,footer');
	for (var i = 0; i < elems.length; i++) {
		var el = elems[i];
		var position = window.getComputedStyle(el).getPropertyValue('position');
		if (position === 'fixed') {
			el.style.position = 'relative';
		}
	}

})();
