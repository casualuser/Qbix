<?php

define ('APP_DIR', dirname(__FILE__)."/../../../../../MyApp/");
include (dirname(__FILE__)."/../../../../Q.php");

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

    public function testLoggedInUser()
    {
		print __METHOD__ . "\n";

	    new	Users_User();
    }

    public function testRegister()
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