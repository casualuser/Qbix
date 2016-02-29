<?php

/**
 * @module Q-tools
 */

/**
 * This tool contains functionality to show things in columns
 * @class Q columns
 * @constructor
 * @param {array}   [options] Provide options for this tool
 *  @param {array}  [options.animation] For customizing animated transitions
 *  @param {integer}  [options.animation.duration] The duration of the transition in milliseconds, defaults to 500
 *  @param {array}  [options.animation.hide] The css properties in "hide" state of animation
 *  @param {array}  [options.animation.show] The css properties in "show" state of animation
 *  @param {array}  [options.back] For customizing the back button on mobile
 *  @param {string}  [options.back.src] The src of the image to use for the back button
 *  @param {boolean} [options.back.triggerFromTitle] Whether the whole title would be a trigger for the back button. Defaults to true.
 *  @param {boolean} [options.back.hide] Whether to hide the back button. Defaults to false, but you can pass true on android, for example.
 *  @param {array}  [options.close] For customizing the back button on desktop and tablet
 *  @param {string}  [options.close.src] The src of the image to use for the close button
 *  @param {string}  [options.title] You can put a default title for all columns here (which is shown as they are loading)
 *  @param {string}  [options.column] You can put a default content for all columns here (which is shown as they are loading)
 *  @param {array}  [options.clickable] If not null, enables the Q/clickable tool with options from here. Defaults to null.
 *  @param {array}  [options.scrollbarsAutoHide] If not null, enables Q/scrollbarsAutoHide functionality with options from here. Enabled by default.
 *  @param {boolean} [options.fullscreen] Whether to use fullscreen mode on mobile phones, using document to scroll instead of relying on possibly buggy "overflow" CSS implementation. Defaults to true on Android, false everywhere else.
 *  @param {array}   [options.columns] In PHP only, an array of $name => $column pairs, where $column is in the form array('title' => $html, 'content' => $html, 'close' => true)
 * @return {string}
 */
function Q_columns_tool($options)
{
	$jsOptions = array(
		'animation', 'back', 'close', 'title',
		'scrollbarsAutoHide', 'fullscreen'
	);
	Q_Response::setToolOptions(Q::take($options, $jsOptions));
	if (!isset($options['columns'])) {
		return '';
	}
	Q_Response::addScript('plugins/Q/js/tools/columns.js');
	Q_Response::addStylesheet('plugins/Q/css/columns.css');
	$result = '<div class="Q_columns_container Q_clearfix">';
	$columns = array();
	$i=0;
	foreach ($options['columns'] as $name => $column) {
		$close = Q::ifset($column, 'close', $i > 0);
		$closeSrc = Q::ifset($column, 'close', 'src', "plugins/Q/img/x.png");
		$backSrc = Q::ifset($column, 'back', 'src', "plugins/Q/img/back-v.png");
		$Q_close = Q_Request::isMobile() ? 'Q_close' : 'Q_close Q_back';
		$closeHtml = !$close ? '' : (Q_Request::isMobile()
			? '<div class="Q_close Q_back">'.Q_Html::img($backSrc, 'Back').'</div>'
			: '<div class="Q_close">'.Q_Html::img($closeSrc, 'Close').'</div>');
		$n = Q_Html::text($name);
		$columnClass = 'Q_column_'.Q_Utils::normalize($name) . ' Q_column_'.$i;
		if (isset($column['html'])) {
			$html = $column['html'];
			$columns[] = <<<EOT
	<div class="Q_columns_column $columnClass" data-index="$i" data-name="$n">
		$html
	</div>
EOT;
		} else {
			$titleHtml = Q::ifset($column, 'title', '[title]');
			$columnHtml = Q::ifset($column, 'column', '[column]');
			$classes = $columnClass . ' ' . Q::ifset($column, 'class', '');
			$attrs = '';
			if (isset($column['data'])) {
				$json = Q::json_encode($column['data']);
				$attrs = 'data-more="' . Q_Html::text($json) . '"';
				foreach ($column['data'] as $k => $v) {
					$attrs .= 'data-'.Q_Html::text($k).'="'.Q_Html::text($v).'" ';
				}
			}
			$data = Q::ifset($column, 'data', '');
			$columns[] = <<<EOT
	<div class="Q_columns_column $classes" data-index="$i" data-name="$n" $attrs>
		<div class="Q_columns_title">
			$closeHtml
			<h2 class="title_slot">$titleHtml</h2>
		</div>
		<div class="column_slot">$columnHtml</div>
	</div>
EOT;
		}
		++$i;
	}
	$result .= "\n" . implode("\n", $columns) . "\n</div>";
	return $result;
}