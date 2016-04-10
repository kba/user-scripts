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
	<textarea></textarea>
</div>
`
	).appendTo('body')
	.dialog({
		autoOpen: false,
		modal: true,
		resizable: false,
		width: "100vw",
		buttons: {
			"Yeah!": function() {
				$(this).dialog("close");
			},
			"Sure, Why Not": function() {
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

function blurVisited() {
	GM_addStyle(".gm-history-visited, .gm-history-visited * { opacity: 0.2 !important }");
}

(function() {
	"use strict";
	GM_addStyle(GM_getResourceText("jquery_ui_theme"));
	GM_addStyle(
	`
	#${DIALOG_ID} textarea { width: 100%; }
	`);
	afterPageLoad();
	addDialog();
	GM_registerMenuCommand("Configure History", openDialog, "f");
	GM_registerMenuCommand("Blur visited", blurVisited, "b");
}());

// vim: sw=4 noet :
