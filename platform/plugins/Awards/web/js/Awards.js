/**
 * Various front-end functionality dealing with awards, badges, credits, etc.
 * @class Awards
 */

Q.Awards = Q.plugins.Awards = {

	/**
	 * Operates with dialogs.
	 * @class Awards.Dialogs
	 */

	Dialogs: {
		/**
		 * Show a dialog where the user can set up their payment information
		 * @method payment
		 *  @param {Function} [callback] The function to call, receives (err, paymentSlot)
		 *  @param {Object} [options] Any additional options to pass to the dialog
		 */
		authnet: function (callback, options) {
			var html = '<iframe ' +
				'name="Awards_authnet" ' +
				'src="" ' +
				'width="480" ' +
				'height="640" ' +
				'frameborder="0" ' +
				'scrolling="no" ' +
				'class="authnet" ' +
			'></iframe>';
			Q.Dialogs.push(Q.extend({
				title: 'Set Payment Information',
				apply: true
			}, options, {
				content: html
			}));
		},

		/**
		 * Show a dialog where the user can set up their payment information
		 * @method payment
		 *  @param {Function} [callback] The function to call, receives (err, paymentSlot)
		 *  @param {Object} [options] Any additional options to pass to the dialog
		 */

		stripe: function (callback, options) {

			jQuery(function($) {
				$('#payment-form').submit(function(event) {
					var $form = $(this);

					// Disable the submit button to prevent repeated clicks
					$form.find('button').prop('disabled', true);

					Stripe.card.createToken($form, stripeResponseHandler);

					// Prevent the form from submitting with the default action
					return false;
				});
			});

//			Q.plugins.Awards.stripe.handler.open({
//				amount: 2000
//			});
		}

	},
	
	/**
	 * Operates with dialogs.
	 * @class Awards
	 */

	/**
	 * Subscribe the logged-in user to a particular payment plan
	 * @method subscribe
	 *  @param {String} payments can be "authnet" or "stripe"
	 *  @param {String} planPublisherId the publisher of the subscription plan's stream
	 *  @param {String} planStreamName the name of the subscription plan's stream
	 *  @param {Function} [callback] The function to call, receives (err, paymentSlot)
	 */
	subscribe: function (payments, planPublisherId, planStreamName, callback) {
		var fields = {
			payments: payments,
			planPublisherId: planPublisherId,
			planStreamName: planStreamName
		};
		Q.req('Awards/subscription', 'payment', function (err, response) {
			var msg;
			if (msg = Q.firstErrorMessage(err, response)) {
				return callback(msg, null);
			}
			Q.handle(callback, this, [null, response.slots.payment]);
		}, {
			method: 'post',
			fields: fields
		});
	},

	/**
	 * Make payment to topup logged-in user Awards balance with funds
	 * @method subscribe
	 *  @param {String} payments can be "authnet" or "stripe"
	 *  @param {String} amount the amount of funds to add to account
	 *  @param {String} currency currency for funds values
	 *  @param {Function} [callback] The function to call, receives (err, paymentSlot)
	 */

	payment: function (payments, amount, currency, callback) {
		var fields = {
			payments: payments,
			amount: amount,
			currency: currency
		};
		Q.req('Awards/payment', 'payment', function (err, response) {
			var msg;
			if (msg = Q.firstErrorMessage(err, response)) {
				return callback(msg, null);
			}
			Q.handle(callback, this, [null, response.slots.payment]);
		}, {
			method: 'post',
			fields: fields
		});
	}
};

(function(Q, Awards, Streams, $) {

	Awards.onCredits = new Q.Event();
	
	Streams.onMessage('Awards/credits', "").set(function (data) {
		
		var amount = 199;

		Awards.amount = amount;
		Awards.onCredits.handle(amount);

	});

	Q.Tool.define({
		"Awards/subscription"           : "plugins/Awards/js/tools/subscription.js"
	});

	Q.Tool.define({
		"Awards/payment"          		: "plugins/Awards/js/tools/payment.js"
	});

//	Streams.onMessage('Awards/credits', "").set(function (data) {
//		Awards.amount = amount;
//		Awards.onCredits.handle(amount);
//	});

	Q.onReady.set(function () {
		Awards.onCredits.handle(Q.plugins.Awards.credits.amount);
	}, 'Awards');

	Q.onInit.set(function () {

		Q.plugins.Awards.stripe.handler = StripeCheckout.configure({
			key: Q.plugins.Awards.stripe.publishableKey,
//			image: '/img/documentation/checkout/marketplace.png',
			locale: 'auto',
			token: function(token, args) {

				// Use the token to create the charge with a server-side script.
				// You can access the token ID with `token.id`
				// ... get it in a common format
				// token.id, token.email, args.billing, args.shipping

				console.log(token)

//				Awards.onPurchase.handle(commonFormat, token);

				// EVENT!
			}
		});

	}, 'Awards');

})(Q, Q.plugins.Awards, Q.plugins.Streams, jQuery);