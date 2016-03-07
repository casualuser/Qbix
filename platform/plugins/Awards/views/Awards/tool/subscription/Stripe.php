<?php echo Q_Html::form('', 'POST', array('target' => 'Awards_stripe'))?>
	<?php echo Q_Html::hidden(array('Token' => $token )) ?>
	<button class="Q_button Awards_payment" type="submit"><?php echo $paymentButton ?></button>
</form>
<button class="Q_button Awards_subscribe"><?php echo $subscribeButton ?></button>