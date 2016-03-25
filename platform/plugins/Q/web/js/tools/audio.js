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
		function(){ console.log('loaded it successfully') }
	);

	var au = Q.Audio.collection[Object.keys(Q.Audio.collection)[0]];

	var position = au.currentTime;

	var fields = {position: position};

	Q.Template.set(
		'Q/audio/ui',
		'<button class="Q_audio_record Q_audio_record_start"></button>'
		+ '<button class="Q_audio_play Q_audio_play_start"></button>'
		+ '<progress id="seekbar" value="0" max="1" style="width:100%;"></progress>'
		+ '<div class="Q_audio_time"></div>'
	);

	Q.Template.render(
		'Q/audio/ui',
		fields,
		function (err, html) {
			$te.append(html);
		}
	);

	tool.$('.Q_audio_record').on(Q.Pointer.click, function (e) {

		if (this.classList.contains('Q_audio_record_start')) {
			this.classList.add('Q_audio_record_stop');
			this.classList.remove('Q_audio_record_start');
		} else {
			this.classList.add('Q_audio_record_start');
			this.classList.remove('Q_audio_record_stop');
		}

		return false;
	});

	tool.$('.Q_audio_play').on(Q.Pointer.click, function (e) {

		if (this.classList.contains('Q_audio_play_start')) {
			this.classList.add('Q_audio_play_pause');
			this.classList.remove('Q_audio_play_start');

			au.audio.play();

		} else {
			this.classList.add('Q_audio_play_start');
			this.classList.remove('Q_audio_play_pause');

			au.audio.pause();
		}

		return false;
	});

/*
	$('#play').on('click', function() {
		document.getElementById('player').play();
	});

	$('#pause').on('click', function() {
		document.getElementById('player').pause();
	});

	$('#player').on('timeupdate', function() {
		$('#seekbar').attr("value", this.currentTime / this.duration);
	});
*/

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