<?php echo Q_Html::form('/charge.php', 'POST', array('target' => 'Awards_stripe'))?>
	<script
		src="https://checkout.stripe.com/checkout.js" class="stripe-button Q_button Awards_payment"
		data-key="<?php echo $options['authkey']; ?>"
		data-description="Access for a year"
		data-name="Demo Site"
		data-amount="2000"
		data-locale="auto"
		data-image="/128x128.png">
	</script>
</form>

<button class="Q_button Awards_subscribe"><?php echo $subscribeButton ?></button>