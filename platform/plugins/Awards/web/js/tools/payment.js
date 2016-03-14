(function (window, Q, $, undefined) {

    /**
     * @module Awards
     */

    /**
     * Standard tool for performing payment and top-up Awards balance.
     * @class Awards payment
     * @constructor
     * @param {Object} options Override various options for this tool
     *  @param {String} options.payments can be "authnet" or "stripe"
     */

    Q.Tool.define("Awards/payment", function (options) {
            var tool = this;
            var state = tool.state;
            var $te = $(tool.element);

            if (!Q.Users.loggedInUser) {
                tool.element.style.display = 'none';
                console.warn("Don't render tool when user is not logged in");
                return;
            }

            tool.$('.Awards_payment_options').on(Q.Pointer.click, function () {
                Q.Awards.Dialogs.stripe();
            });

            tool.$('.Awards_payment').on(Q.Pointer.click, function () {

                Q.Awards.payment(state.payments, state.amount, state.currency, function () {
                    Q.handle(state.onSubscribe, this, arguments);
                });
            });
        },

        { // default options here

        },

        { // methods go here

        });

    Q.addStylesheet('plugins/Awards/css/Awards.css');

})(window, Q, jQuery);