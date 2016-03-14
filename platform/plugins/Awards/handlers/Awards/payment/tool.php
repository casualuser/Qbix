<?php

/**
 * Standard tool for adding funds to Awards balance.
 * @class Awards payments
 * @constructor
 * @param {array} $options Override various options for this tool
 *  @param {string} $options.payments can be "authnet" or "stripe"
 *  @param {string} $options.amount the amount of funds to add to account
 *  @param {string} $options.currency currency for funds values
 */
function Awards_payment_tool($options)
{
    if (empty($options['payments'])) {
        throw new Q_Exception_RequiredField(array('field' => 'payments'));
    }
    $payments = ucfirst($options['payments']);
    $className = "Awards_Payments_$payments";
    $adapter = new $className($options);
    $token = $adapter->authToken();
    $options = $adapter->options;
    $paymentButton = Q::ifset($options, 'paymentButton', 'Make Payment');
    Q_Response::setToolOptions($options);
    return Q::view("Awards/tool/payment/$payments.php", compact(
        'token', 'amount', 'currency', 'paymentButton', 'publishable'
    ));
};