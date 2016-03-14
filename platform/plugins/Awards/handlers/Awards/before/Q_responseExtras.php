<?php

function Awards_before_Q_responseExtras() {

	Q_Response::addScript('plugins/Awards/js/Awards.js');
	Q_Response::addScript('https://checkout.stripe.com/checkout.js');

	try {
		$amount = Awards_Credits::amount();
	} catch (Exception $e) {
		$amount = null;
	}

	$options['publishable'] = Q_Config::expect('Awards', 'payments', 'stripe', 'public');

	Q_Response::setScriptData('Q.plugins.Awards.credits', compact('amount'));
	Q_Response::setScriptData('Q.plugins.Awards.stripe.publishableKey', $options['publishable']);

	$user = Users::loggedInUser();
	if ($user) {
		Q_Response::setScriptData("Q.Users.loggedInUser.displayName", Streams::displayName($user));
	}
}