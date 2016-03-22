<?php

/**
 * HTTP method for starting a subscription
 * @param {array} $_REQUEST
 * @param {string} $_REQUEST.payments Required. Should be either "authnet" or "stripe"
 *  @param {String} $_REQUEST.planStreamName the name of the subscription plan's stream
 *  @param {String} [$_REQUEST.planPublisherId=Users::communityId()] the publisher of the subscription plan's stream
 *  @param {String} [$_REQUEST.token=null] if using stripe, pass the token here
 */
function Awards_subscription_post($params = array())
{
    $req = array_merge($_REQUEST, $params);
	Q_Valid::requireFields(array('payments'), $req, true);
	
	// to be safe, we only start subscriptions from existing plans
	$planPublisherId = Q::ifset($req, 'planPublisherId', Users::communityId());
	$plan = Streams::fetchOne($planPublisherId, $planPublisherId, $req['planStreamName'], true);
	
	// the currency will always be assumed to be "USD" for now
	// and the amount will always be assumed to be in dollars, for now
	if ($req['payments'] === 'authnet') {
		Q_Valid::requireFields(array('token'), $req, true);
		$token = $req['token'];
	}
	if ($req['payments'] === 'stripe') {
		Q_Valid::requireFields(array('token'), $req, true);
		$token = $req['token'];
	}

	$subscription = Awards::startSubscription($plan, $req['payments'], compact('token'));
	Q_Response::setSlot('subscription', $subscription);
}