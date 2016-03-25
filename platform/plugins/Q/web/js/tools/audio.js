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

/*
	var audio = Q.audio(
		"http://tonycuffe.com/mp3/tailtoddle_lo.mp3",
		function(){ console.log('loaded it successfully') }
	);
*/

// div#Q-audio-container

	var audio = new Q.Audio("http://tonycuffe.com/mp3/tailtoddle_lo.mp3");

	var fields = { audio: audio.audio };

	Q.Template.set(
		'Q/audio/ui',
'' //		audio.audio
		+ '<button class="Q_audio_record_start"></button>'
		+ '<button class="Q_audio_play_start"></button>'
		+ '<progress id="seekbar" value="0" max="1" style="width:100%;"></progress>'
	);

	Q.Template.render(
		'Q/audio/ui',
		fields,
		function (err, html) {
			$te.append(html);
			$te.append(audio);
		}
	);

	tool.$('.Q_audio_record_start').on(Q.Pointer.click, function (e) {
		this.className = 'Q_audio_record_stop';

		return false;
	});

	tool.$('.Q_audio_record_stop').on(Q.Pointer.click, function (e) {
		this.className = 'Q_audio_record_start';

		return false;
	});

	tool.$('.Q_audio_play_start').on(Q.Pointer.click, function (e) {
		console.log(this);
		e.play();
		return false;
	});

	tool.$('.Q_audio_play_pause').on(Q.Pointer.click, function (e) {

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