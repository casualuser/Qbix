<?php

function Streams_0_8_7_Streams_mysql()
{
	$app = Q_Config::expect('Q', 'app');
	$communityId = Users::communityId();
	$user = Users_User::fetch($communityId, true);
	
	$simulated = array(
		'row' => $user,
		'inserted' => true,
		'modifiedFields' => $user->fields,
		'query' => null
	);
	Q::event('Db/Row/Users_User/saveExecute', $simulated, 'after');
	
	$stream = array(
		'publisherId' => '', 
		'name' => "Streams/images/",
		'type' => 'Streams/template', 
		'title' => 'Image Gallery',
		'icon' => 'default',
		'content' => '',
		'attributes' => null,
		'readLevel' => Streams::$READ_LEVEL['messages'], 
		'writeLevel' => Streams::$WRITE_LEVEL['close'], 
		'adminLevel' => Streams::$ADMIN_LEVEL['invite']
	);
	$access = array(
		'publisherId' => '', 
		'streamName' => "Streams/images/",
		'ofUserId' => '',
		'grantedByUserId' => null,
		'ofContactLabel' => "$app/admins",
		'readLevel' => Streams::$READ_LEVEL['messages'], 
		'writeLevel' => Streams::$WRITE_LEVEL['close'], 
		'adminLevel' => Streams::$ADMIN_LEVEL['invite']
	);
	Streams_Stream::insert($stream)->execute();
	Streams_Access::insert($access)->execute();
	$stream['name'] = $access['streamName'] = 'Streams/image/';
	$stream['icon'] = 'Streams/image';
	$stream['title'] = 'Untitled Image';
	Streams_Stream::insert($stream)->execute();
	Streams_Access::insert($access)->execute();
	$stream['name'] = $access['streamName'] = 'Streams/file/';
	$stream['icon'] = 'files/_blank';
	$stream['title'] = 'Untitled File';
	Streams_Stream::insert($stream)->execute();
	Streams_Access::insert($access)->execute();
}

Streams_0_8_7_Streams_mysql();