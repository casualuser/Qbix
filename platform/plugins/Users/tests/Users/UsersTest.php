<?php

//require(Q_CLASSES_DIR.DS.'Q.php'); 

class UsersTest extends PHPUnit_Framework_TestCase
{

    public static function setUpBeforeClass()
    {
        print __METHOD__ . "\n";
    }

	protected function setUp()
    {
		print __METHOD__ . "\n";

        $this->stack = array();
    }

    protected function assertPreConditions()
    {
        print __METHOD__ . "\n";
    }

    public function loggedInUser()
    {
		print __METHOD__ . "\n";

    	if (true) {
    		User = Users::identify();
    	}
    }

    public function register()
    {
		print __METHOD__ . "\n";
    }

    protected function assertPostConditions()
    {
		print __METHOD__ . "\n";
    }

    protected function tearDown()
    {
		print __METHOD__ . "\n";
    }

    public static function tearDownAfterClass()
    {
		print __METHOD__ . "\n";
    }

    protected function onNotSuccessfulTest(Exception $e)
    {
        print __METHOD__ . "\n";
        throw $e;
    }

}