// ==UserScript==
// @name         History
// @namespace    http://github.com/kba
// @version      0.1
// @description  try to take over the world!
// @author       kba
// @match        */*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-2.2.3.min.js
// @require      https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @resource     jquery_ui_theme https://code.jquery.com/ui/1.11.4/themes/start/jquery-ui.css
// ==/UserScript==

/*jshint esversion: 6 */
/*global window */
/*global $ */
/*global GM_registerMenuCommand */
/*global GM_addStyle */
/*global GM_getResourceText */
/*global GM_setValue */
/*global GM_getValue */

var DIALOG_ID = 'gm-history-dialog';

function getCurrentHistoryName() {
	return GM_getValue("current", "default");
}
function setCurrentHistoryName(name) {
	return GM_setValue("current", name);
}
function loadHistory() {
	// return {};
	return JSON.parse(GM_getValue("history_" + getCurrentHistoryName(), "{}"));
}
function saveHistory(hist) {
	var name = getCurrentHistoryName();
	return GM_setValue("history_" + name, JSON.stringify(hist));
}
function addHistory(url, hist) {
	url = url.replace(/#.*/, "");
	if (!hist) {
		hist = loadHistory();
	}
	hist[url] = new Date();
	saveHistory(hist);
}

/*
 * Public API
 */
function afterPageLoad() {
	var hist = loadHistory();
	addHistory(window.location.href, hist);
	$("a").each(function() {
		var $a = $(this);
		var linkUrl = $a.attr("href");
		if (!linkUrl) {
			return;
		}
		linkUrl = linkUrl.replace(/#.*/, "").toLowerCase();
		if (hist[linkUrl] !== "undefined") {
			$a.addClass("gm-history-visited");
		}
	});
}

function openDialog() {
	var hist = loadHistory();
	var asText = "";
	for (var url in hist) {
		asText += hist[url] + " :: " + url + "\n";
	}
	$(`#${DIALOG_ID} textarea`).html(asText);
	$(`#${DIALOG_ID}`).dialog("open");
}
function addDialog() {
	$(
`
<div id="${DIALOG_ID}" title="Config GM History">
	<div>
		<h3>Current History</h3>
		<input placeholder='${getCurrentHistoryName()}' type='text'></input>
	</div>
	<div>
		<h3>Edit History</h3>
		<textarea rows=10></textarea>
	</div>
</div>
`
	).appendTo('body')
	.dialog({
		autoOpen: false,
		modal: true,
		resizable: true,
		height: 300,
		width: "95vw",
		buttons: {
			"Save": function() {
				var hist = {};
				var lines = $(`#${DIALOG_ID} textarea`).val().split(/\n/);
				for (var i = 0; i < lines.length ; i++) {
					var line = lines[i].split(/\s*::\s*/);
					hist[line[1]] = line[0];
				}
				saveHistory(hist);
				$(this).dialog("close");
			}
		}
	});
}

function promptName() {
	var newName = window.prompt("New history name? [Current: " + getCurrentHistoryName() + "]");
	if (newName) {
		setCurrentHistoryName(newName);
	}
}

function toggleBlurVisited() {
	$(".gm-history-visited").toggleClass('gm-history-blurred');
}

(function() {
	"use strict";
	GM_addStyle(GM_getResourceText("jquery_ui_theme"));
	GM_addStyle(
	`
	.gm-history-blurred, .gm-history-blurred * { opacity: 0.2 !important }
	#${DIALOG_ID} { overflow-y: scroll; max-height: 100%; }
	#${DIALOG_ID} h3 { width: 20%; float: left; }
	#${DIALOG_ID} h3 + * { width: 75%; float:right; }
	#${DIALOG_ID} div { clear: left; }
	`);
	afterPageLoad();
	addDialog();
	GM_registerMenuCommand("Configure History", openDialog, "f");
	GM_registerMenuCommand("Blur visited", toggleBlurVisited, "b");
}());

// vim: sw=4 noet :
