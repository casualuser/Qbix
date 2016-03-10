<?php
/**
 * @module Awards
 */
/**
 * Adapter implementing Stripe support for Awards_Payments functions
 *
 * @class Awards_Payments_Stripe
 * @implements Awards_Payments
 */

class Awards_Payments_Stripe extends Awards_Payments implements iAwards_Payments
{

	/**
	 * @constructor
	 * @param {array} [$options=array()] Any initial options
	 */
	function __construct($options = array())
	{
		Q::includeFile(implode(DS, array(
			Q_PLUGINS_DIR, 'Awards', 'classes', 'Composer', 'vendor', 'autoload.php'
		)));

		$options['secret'] = Q_Config::expect('Awards', 'payments', 'stripe', 'secret');
		$options['public'] = Q_Config::expect('Awards', 'payments', 'stripe', 'public');

		Q_Response::setScriptData(Q.Stripe, $options['public']);

		\Stripe\Stripe::setApiKey(
			$options['secret']
		);

		$this->options = $options;

	}
	
	/**
	 * Executes some API calls and obtains a customer id
	 * @method customerId
	 * @return {string} The customer id
	 */
	function customerId()
	{
		$options = $this->options;
	}
	
	/**
	 * Executes some API calls and obtains a payment profile id
	 * @method paymentProfileId
	 * @return {string} The payment profile id
	 */
	function paymentProfileId($customerId)
	{
		$options = $this->options;
	}
	
	/**
	 * Make a one-time charge using the payments processor
	 * @method charge
	 * @param {string} [$customerId=null] specify a customer id
	 * @param {string} [$paymentProfileId=null] specify a payment profile
	 * @throws Awards_Exception_DuplicateTransaction
	 * @throws Awards_Exception_HeldForReview
	 * @throws Awards_Exception_ChargeFailed
	 * @return {Awards_Charge} the saved database row corresponding to the charge
	 */
	function charge($customerId = null, $paymentProfileId = null)
	{
		$options = $this->options;

		try {
			if (!isset($_POST['stripeToken']))
				throw new Exception("The Stripe Token was not generated correctly");

			$token = $_POST['stripeToken'];

			\Stripe\Charge::create(
				array(
					"amount" => 1000,
					"currency" => "usd",
//					"source" => "tok_17A1a2LXyqhmsDs5Bk70KT01", // obtained with Stripe.js
					"card" => $_POST['stripeToken']
				)
			);
			$success = 'Your payment was successful.';
		}
		catch (Exception $e) {
			$error = $e->getMessage();
		}

		$customer = \Stripe\Customer::create(array(
				"source" => $token,
				"description" => "Example customer")
		);

		return $charge;
	}

	function authToken($customerId = null)
	{
		$options = $this->options;

		return $token;
	}

	public $options = array();

}