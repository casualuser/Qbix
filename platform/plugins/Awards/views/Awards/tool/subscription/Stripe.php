<?php echo Q_Html::form('https://test.authorize.net/profile/manage', 'POST', array('target' => 'Awards_authnet'))?>
	<button class="Q_button Awards_payment" type="submit"><?php echo $paymentButton ?></button>
</form>
<button class="Q_button Awards_subscribe"><?php echo $subscribeButton ?></button>