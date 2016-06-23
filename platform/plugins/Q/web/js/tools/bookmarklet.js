(function (Q, $, window, document, undefined) {

/**
 * Q Tools
 * @module Q-tools
 */

/**
 * Makes an infomation block for adding a bookmarklet on the browser's bookmarks bar
 * the way similar to how facebook does: http://www.facebook.com/share_options.php .
 * The main purpose of the tool is to present, in a cross-browser way,
 * user-friendly instructions on how to add bookmarklet in the browser.
 * @class Q bookmarklet
 * @constructor
 * @param {Object} options This is an object with properties for this function
 *   @param {Array} [options.scripts] Array of one or more script urls (will be run through Q.url()) to load and execute in order
 *   @param {Object} [options.skip] Object of {url: path.to.object} pairs to avoid loading script at the url if path.to.object is already defined. Typically names an object which has been defined by the loaded script.
 *	 @param {String} [options.code] Literal Javascript code to execute, typically a function call. If scripts option is provided, this code is executed after the scripts have been loaded.
 *	 @param {String} options.title Title for the button which will be added to user's browser bar.
 *	 @param {String} options.usage Text which is appended to instructions, identifying purpose and usage of this bookmarklet.
 *	 @param {String} [options.icon] Icon for the button which will be added to user's browser bar.
 */
Q.Tool.jQuery('Q/bookmarklet', function (o) {
	
	if (!o.scripts && !o.code) {
		throw new Q.Error("Q/bookmarklet: please provide the bookmarklet's scripts or code");
	}
	if (!o.title) {
		console.warn("Please provide 'title' for bookmarklet.");
	}
	if (!o.title) {
		console.warn("Please provide 'usage' for bookmarklet.");
	}
	
	Q.addStylesheet('plugins/Q/css/inplace.css');
	
	var bookmarkletSettings = {
		'common': {
			'instructions': 'Drag me to your Bookmarks Bar to ' + o.usage + '.<br /><br />' +
			'If you can\'t see the Bookmarks Bar, Choose "Show Bookmarks Bar" from your browser "View" menu.'
		}
	};
	Q.extend(bookmarkletSettings, {
		'safari': {
			'mac': {
				'instructions': bookmarkletSettings.common.instructions,
				'icon': false
			},
			'windows': {
				'instructions': bookmarkletSettings.common.instructions,
				'icon': false
			}
		},
		'chrome': {
			'mac': {
				'instructions': bookmarkletSettings.common.instructions,
				'icon': 'chrome_default_icon.png'
			},
			'windows': {
				'instructions': bookmarkletSettings.common.instructions,
				'icon': 'chrome_default_icon.png'
			}
		},
		'firefox': {
			'mac': {
				'instructions': bookmarkletSettings.common.instructions,
				'icon': 'firefox_mac_default_icon.png'
			},
			'windows': {
				'instructions': bookmarkletSettings.common.instructions,
				'icon': 'firefox_win_default_icon.png'
			}
		},
		'opera': {
			'mac': {
				'instructions': bookmarkletSettings.common.instructions,
				'icon': 'opera_mac_default_icon.png'
			},
			'windows': {
				'instructions': bookmarkletSettings.common.instructions,
				'icon': 'opera_win_default_icon.png'
			}
		},
		'explorer': {
			'windows': {
				'instructions': bookmarkletSettings.common.instructions,
				'icon': 'ie_default_icon.png'
			}
		}
	});
	
	var code = null;
	if (o.scripts && o.scripts.length) {
		var scripts = [];
		for (var i=0; i<o.scripts.length; ++i) {
			var orig = o.scripts[i];
			var url = Q.url(orig);
			scripts.push(url);
			if (o.skip && o.skip[orig]) {
				o.skip[url] = o.skip[orig];
				if (url !== orig) {
					delete o.skip[orig];
				}
			}
		}
		var json = JSON.stringify({
			scripts: scripts,
			skip: o.skip,
			code: o.code
		});
		var baseUrlJson = JSON.stringify(Q.info.baseUrl);
		code =
  '(function () {'
+ ' var o = ' + json + ';'
+ '	var i=-1, loaded = {};'
+ ' function loadScript(url, callback) {'
+ '   if (loaded[url] || (o.skip && getObject(o.skip[url]) !== undefined)) {'
+ ' 	return callback();'
+ '   }'
+ '   var script = document.createElement("script");'
+ '   script.type = "text/javascript";'
+ '   if (script.readyState) {'
+ '     script.onreadystatechange = function () {'
+ '       if (script.readyState == "loaded" || script.readyState == "complete") {'
+ '         script.onreadystatechange = null;'
+ '         loaded[url] = true;'
+ '         callback();'
+ '       }'
+ '     };'
+ '   } else {'
+ '     script.onload = function () {'
+ '         loaded[url] = true;'
+ '         callback();'
+ '     };'
+ '  }'
+ '  script.src = url;'
+ '  document.getElementsByTagName("head")[0].appendChild(script);'
+ ' }'
+ '	function loadNextScript() {'
+ '   if (++i < o.scripts.length) {'
+ ' 	loadScript(o.scripts[i], loadNextScript);'
+ '   } else {'
+ ' 	afterScripts();'
+ '   }'
+ '	}'
+ '	function afterScripts() {'
+ '   if (o.code) {'
+ '     var f = new Function("baseUrl", o.code);'
+ ' 	f(' + baseUrlJson + ');'
+ '   }'
+ '	}'
+ '	function getObject (name) {'
+ '   if (!name) return;'
+ '   var p, i = 0, c = window;'
+ '   var parts = name.split(".");'
+ '   if (!parts.length) return c;'
+ '   while (c && (p = parts[i++]) !== undefined){'
+ ' 	c = c[p];'
+ '   }'
+ '   return c;'
+ '	}'
+ '	loadNextScript();'
+ '})();';
	} else {
		code = o.code;
	}
	// NOTE: code should be under 2000 total characters
	// see http://stackoverflow.com/a/417184/467460
	code = 'javascript:'+encodeURIComponent(code.replaceAll({
		'\n': ' ',
		'    ': ' ',
		'  ': ' '
	}));

	var $this = $(this);
	
	var browser = Q.Browser.detect();

	$this.addClass('Q_clearfix');
	switch (browser.OS) {
	case 'android':
		$this.append( '<div class="Q_bookmarklet_tool_instructions">' +
							'<div class="Q_bookmarklet_tool_step">' +
								'<h3>Step 1: Select the text and copy it.</h3>' +
								'<textarea class="Q_bookmarklet_tool_code">' +
									code +
								'</textarea>' +
								'<ul>' +
									'<li>Tap inside.</li>' +
									'<li>Tap and hold for a bit, then release.</li>' +
									'<li>Tap <b>Select All</b>.</li>' +
									'<li>Tap <b>Copy</b>.</li>' + 
									'<li>Tap <b>Done</b>.</li>' + 
								'</ul>' +
							'</div>' +
							'<div class="Q_bookmarklet_tool_step">' +
								'<h3>Step 2: Bookmark this page.</h3>' +
								'<ol>' +
									'<li>Tap the bookmark icon next to the address bar, then tap &#9733; Add.</li>' +
									'<li>Tap the Location. Then, tap and hold to bring up the contextual menu, and select <b>Paste</b>.</li>' +
									'<li> Save the changes by tapping <b>Done</b> and <b>OK</b>.</li>' +
								'</ol>' +
							'</div>' +
							'<div class="Q_bookmarklet_tool_step">' +
								'<h3>Step 4: Installation complete.</h3>' +
								'<p>Installation should be complete!</p>' +
								'<p>Tap the bookmark icon next to the address bar, then tap "'+o.title+'" to use it on any page.</p>' +
							'</div>' +
						'</div>');
		break;
		
	case 'ios':
		var url = Q.info.browser.mainVersion >= 8
			? 'plugins/Q/img/bookmarklet/ios8_action.png'
			: 'plugins/Q/img/bookmarklet/ios_action.png';
		var icon = '<img src="'+Q.url(url)+'" class="Q_bookmarklet_ios_action_icon" />';
		if (browser.device === 'iPad') {
			$this.addClass('Q_bookmarklet_tool_iPad');
			$this.append( '<div class="Q_bookmarklet_tool_instructions">' +
								'<div class="Q_bookmarklet_tool_step">' +
									'<h3>Step 1: Bookmark this page.</h3>' +
									'<p>Tap the '+icon+' icon, then tap Add Bookmark, then tap Save.</p>' +
								'</div>' +
								'<div class="Q_bookmarklet_tool_step">' +
									'<h3>Step 2: Select the text and copy it.</h3>' +
									'<textarea class="Q_bookmarklet_tool_code">' +
										code +
									'</textarea>' +
									'<ul>' +
										'<li>Tap inside.</li>' +
										'<li>Tap and hold for a bit, then release.</li>' +
										'<li>Tap <b>Select All</b>.</li>' +
										'<li>Tap <b>Copy</b>.</li>' + 
										'<li>Tap <b>Done</b>.</li>' + 
									'</ul>' +
								'</div>' +
								'<div class="Q_bookmarklet_tool_step">' +
									'<h3>Step 3: Edit the bookmark.</h3>' +
									'<ol>' +
										'<li>Tap the Bookmarks button in the toolbar.</li>' +
										'<li>Tap <b>Edit</b>. Select the "'+o.title+'" bookmark to edit.</li>' +
										'<li>Tap its URL, tap the <b>x</b> to clear it, tap-and-hold for the magnifying glass, then tap <b>Paste</b>.</li>' +
										'<li> Save the changes by tapping <b>Done</b>.</li>' +
									'</ol>' +
								'</div>' +
								'<div class="Q_bookmarklet_tool_step">' +
									'<h3>Step 4: Installation complete.</h3>' +
									'<p>Installation should be complete!</p>' +
									'<p>Select the "'+o.title+'" bookmark from your Bookmarks list to use it on any page.</p>' +
								'</div>' +
							'</div>');
		} else {
			$this.addClass('Q_bookmarklet_tool_iPhone');
			$this.append( '<div class="Q_bookmarklet_tool_instructions">' +
								'<div class="Q_bookmarklet_tool_step">' +
									'<h3>Step 1: Bookmark this page.</h3>' +
									'<p>Tap the '+icon+' icon below, then tap Add Bookmark, then tap Save.</p>' +
								'</div>' +
								'<div class="Q_bookmarklet_tool_step">' +
									'<h3>Step 2: Select the text and copy it.</h3>' +
									'<textarea class="Q_bookmarklet_tool_code">' +
										code +
									'</textarea>' +
									'<ul>' +
										'<li>Tap inside.</li>' +
										'<li>Tap and hold for a bit, then release.</li>' +
										'<li>Tap <b>Select All</b>.</li>' +
										'<li>Tap <b>Copy</b>.</li>' + 
										'<li>Tap <b>Done</b>.</li>' + 
									'</ul>' +
								'</div>' +
								'<div class="Q_bookmarklet_tool_step">' +
									'<h3>Step 3: Edit the bookmark.</h3>' +
									'<ol>' +
										'<li>Tap the Bookmarks button in the toolbar.</li>' +
										'<li>Tap <b>Edit</b>. Select the "'+o.title+'" bookmark to edit.</li>' +
										'<li>Tap its URL, tap the <b>x</b> to clear it, tap-and-hold for the magnifying glass, then tap <b>Paste</b>.</li>' +
										'<li> Save the changes by tapping <b>Done</b>.</li>' +
									'</ol>' +
								'</div>' +
								'<div class="Q_bookmarklet_tool_step">' +
									'<h3>Step 4: Installation complete.</h3>' +
									'<p>Installation should be complete!</p>' +
									'<p>Select the "'+o.title+'" bookmark from your Bookmarks list to use it on any page.</p>' +
								'</div>' +
							'</div>');
		}
		break;
	default:
		$this.append('<div class="Q_bookmarklet_tool_instructions">' + 
						 '<div class="Q_bookmarklet_tool_drag_button">' +
							 '<div class="Q_bookmarklet_tool_sample_button_tip">Drag me to your<br />Bookmarks Bar</div><br />' +
							 '<div class="Q_bookmarklet_tool_sample_button Q_bookmarklet_tool_button_' + browser.name + '_' + browser.OS + '">' +
									 '<div class="Q_bookmarklet_tool_button_left"></div>' +
									 '<div class="Q_bookmarklet_tool_button_middle">' +
										 '<a href="#">' +
											 (bookmarkletSettings[browser.name][browser.OS]['icon'] ?
												'<img src="' +
												(o.icon ? o.icon : Q.info.proxyBaseUrl + '/plugins/Q/img/bookmarklet/' + bookmarkletSettings[browser.name][browser.OS]['icon']) +
												'" alt="" />'
												: '') +
											 o.title +
										 '</a>' +
									 '</div>' +
									 '<div class="Q_bookmarklet_tool_button_right"></div>' +
							 '</div>' +
						 '</div>' +
						 '<div class="Q_bookmarklet_tool_instruction_text">' +
							 bookmarkletSettings[browser.name][browser.OS]['instructions'] +
						 '</div>' +
					 '</div>');
$this.append('<div class="Q_bookmarklet_tool_bookmarks_bar_sample">' +
						 '<div class="Q_bookmarklet_tool_bar_screenshot Q_bookmarklet_tool_bar_screenshot_' + browser.name + '_' + browser.OS + '"">' +
							 '<div class="Q_bookmarklet_tool_sample_button Q_bookmarklet_tool_button_' + browser.name + '_' + browser.OS + '">' +
								 '<div class="Q_bookmarklet_tool_button_left"></div>' +
								 '<div class="Q_bookmarklet_tool_button_middle">' +
									 '<a href="#">' +
										 (bookmarkletSettings[browser.name][browser.OS]['icon'] ?
											'<img src="' +
											(o.icon ? o.icon : Q.info.proxyBaseUrl + '/plugins/Q/img/bookmarklet/' + bookmarkletSettings[browser.name][browser.OS]['icon']) +
											'" alt="" />'
											: '') +
										 o.title +
									 '</a>' +
								 '</div>' +
								 '<div class="Q_bookmarklet_tool_button_right"></div>' +
							 '</div>' +
						 '</div>' +
						 '<div class="Q_bookmarklet_tool_bookmarks_bar_description">' +
							 'After you drag the button to the Bookmarks Bar, it will look like this.' +
						 '</div>' +
					 '</div>');
		var $a = $this.find('.Q_bookmarklet_tool_button_middle a');
		$a.attr('href', code);
		$a.eq(0).on('click.Q_bookmarklet', function() {
			alert(o.clickPrompt);
			return false;
		});
	}
},

{
	icon: null,
	clickPrompt: 'This is a bookmarklet, drag it to your bookmarks bar.'
});

})(Q, jQuery, window, document);