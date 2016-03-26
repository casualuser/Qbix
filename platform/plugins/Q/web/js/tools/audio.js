(function (Q, $) {

/**
 * @module Q-tools
 */
	
/**
 * Place this tool on page to create sound recording/playback feature
 * @class Q form
 * @constructor
 * @param {Object} [options] This is an object of parameters for this function
 *   @param {Q.Event} [options.onStartRecord] This event triggers on starting record process with 'Stop/Record' button
 *   @default Q.Event()
 *   @param {Q.Event} [options.onStopRecord] This event triggers on completing record process with 'Stop/Record' button
 *   @default Q.Event()
 *
*/

Q.Tool.define('Q/audio', function(options) {

	var tool = this;
	var state = tool.state;
	var $te = $(tool.element);

	Q.addStylesheet('plugins/Q/css/audio.css');

	Q.audio(
		"http://tonycuffe.com/mp3/tailtoddle_lo.mp3",
		function(){
			tool.$('.Q_audio_time').html('00:00');
			console.log('loaded it successfully')
		}
	);

	tool.media = Q.Audio.collection[Object.keys(Q.Audio.collection)[0]].audio;

	var fields = {};

	Q.Template.set(
		'Q/audio/ui',

		'<div style="display: inline-block;"><span><button class="Q_audio_record Q_audio_record_start"></button></span>'
		+ '<span><button class="Q_audio_play Q_audio_play_start"></button></span>'
		+ '<span><progress class="Q_audio_progress" value="0" max="1"></progress></span>'
		+ '<span><div class="Q_audio_time"></div></span></div>'
	);

	Q.Template.render(
		'Q/audio/ui',
		fields,
		function (err, html) {
			$te.append(html);
		}
	);

	tool.$('.Q_audio_record').on(Q.Pointer.click, function (e) {

		tool.record = this;

		if (tool.record.classList.contains('Q_audio_record_start')) {
			tool.record.classList.add('Q_audio_record_stop');
			tool.record.classList.remove('Q_audio_record_start');

			tool.record.uploadRecord();

		} else {
			tool.record.classList.add('Q_audio_record_start');
			tool.record.classList.remove('Q_audio_record_stop');

			tool.record.startRecord();
		}

		return false;
	});

	tool.$('.Q_audio_play').on(Q.Pointer.click, function (e) {

		tool.play = this;

		if (tool.play.classList.contains('Q_audio_play_start')) {
			tool.play.classList.add('Q_audio_play_pause');
			tool.play.classList.remove('Q_audio_play_start');

			tool.media.play();

		} else {
			tool.play.classList.add('Q_audio_play_start');
			tool.play.classList.remove('Q_audio_play_pause');

			tool.media.pause();

		}

		return false;
	});

	$('#Q-audio-container audio').bind('timeupdate', function() {
		tool.$('.Q_audio_progress').attr("value", tool.media.currentTime / tool.media.duration);
		var position = Math.floor(tool.media.currentTime).toString();
		tool.$('.Q_audio_time').html(formatSecondsAsTime(position));
	});

	$('#Q-audio-container audio').bind('ended', function() {
		tool.play.classList.add('Q_audio_play_start');
		tool.play.classList.remove('Q_audio_play_pause');
	});

	function formatSecondsAsTime(secs, format) {
		var hr  = Math.floor(secs / 3600);
		var min = Math.floor((secs - (hr * 3600))/60);
		var sec = Math.floor(secs - (hr * 3600) -  (min * 60));
		if (min < 10){min = "0" + min}
		if (sec < 10){sec  = "0" + sec}
		return min + ':' + sec;
	};
},

{
	onStartRecord: new Q.Event(),
	onStopRecord: new Q.Event()
},

{
	Q: {

	}
}
);

})(Q, jQuery);