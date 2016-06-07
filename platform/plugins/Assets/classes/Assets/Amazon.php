<?php
/**
 * @module Assets
 */
/**
 * Class representing 'Amazon' rows in the 'Assets' database
 * You can create an object of this class either to
 * access its non-static methods, or to actually
 * represent a amazon row in the Assets database.
 *
 * @class Assets_Amazon
 * @extends Base_Assets_Amazon
 */
class Assets_Amazon extends Base_Assets_Amazon
{
	/**
	 * The setUp() method is called the first time
	 * an object of this class is constructed.
	 * @method setUp
	 */
	function setUp()
	{
		parent::setUp();
		// INSERT YOUR CODE HERE

		// e.g. $this->hasMany(...) and stuff like that.
	}

	/* 
	 * Add any Assets_Amazon methods here, whether public or not
	 * If file 'Amazon.php.inc' exists, its content is included
	 * * * */

    static function formatResults($hosts, $parsedXML) {

        $results = $parsedXML['Items']['Item'];

        $resultsClientRenderArray = [];

        foreach ($results as $key => $value) {

            $resultsClientRenderArray[$key]['ASIN'] = $results[$key]['ASIN'];
            $resultsClientRenderArray[$key]['title'] = $results[$key]['ItemAttributes']['Title'];

			if (isset($results[$key]['ImageSets']) && isset($results[$key]['ImageSets']['ImageSet']['0'])) {
				$resultsClientRenderArray[$key]['pic'] = end($results[$key]['ImageSets']['ImageSet'])['LargeImage']['URL'];
			} elseif (isset($results[$key]['ImageSets'])) {
				$resultsClientRenderArray[$key]['pic'] = $results[$key]['ImageSets']['ImageSet']['LargeImage']['URL'];
			}

			$resultsClientRenderArray[$key]['input'] = $parsedXML['OperationRequest']['Arguments']['Argument'][2]['@attributes']['Value'];

			$host = explode("/", $results[$key]['DetailPageURL'])[2];

			$resultsClientRenderArray[$key]['locale'] = Assets_Amazon::localeLookup($host, $hosts);

			if ( isset ($results[$key]['EditorialReviews'])) {
				$resultsClientRenderArray[$key]['desc'] = ''; //$resultsClientRenderArray[$key]['desc'] = $results[$key]['EditorialReviews']['EditorialReview']['Content'];
			} else {
				$resultsClientRenderArray[$key]['desc'] = '';
			};

			$resultsClientRenderArray[$key]['price'] = isset($results[$key]['ItemAttributes']['ListPrice']) ? $results[$key]['ItemAttributes']['ListPrice']['FormattedPrice'] : '';

			// TODO: replace _id with ASIN
			$resultsClientRenderArray[$key]['_id'] = '';//bin2hex(mhash(MHASH_SHA1, $resultsClientRenderArray[$key]['input'])); //Assets_Amazon::uuid();

			$item = new Assets_Amazon();
			$i = $resultsClientRenderArray[$key];

			foreach ($i as $k=>$v) {
				$item->$k = $v;
			}

			$item->save();
        }

        return $resultsClientRenderArray;

    }

	static function localeLookup($host, $hosts) {

		// set 'US' locale as default
		// $locale = 'US';

		$tld = explode(".", $host); array_shift($tld); array_shift($tld);
		$tld_d = explode(".", $host);
		$tld_r = array_slice($tld, 2, NULL, true);

		foreach ($hosts as $k=>$v) {
			$h = explode(".", $v); array_shift($h); array_shift($h);
			if ( $h == $tld ) {$locale = $k;}
		}

		if ( $locale == 'UK' ) {$locale = 'GB';}

		return $locale;
	}

	/**
	 * Get autocomplete results
	 * @method autocomplete
	 * @static
	 * @param {string} $input The text (typically typed by a user) to find completions for
	 * @param {boolean} [$throwIfBadValue=false]
	 *  Whether to throw Q_Exception if the result contains a bad value
	 * @param {array} [$types=array("establishment")] Can include "establishment", "locality", "sublocality", "postal_code", "country", "administrative_area_level_1", "administrative_area_level_2". Set to true to include all types.
	 * @param {double} [$latitude=userLocation] Override the latitude of the coordinates to search around
	 * @param {double} [$longitude=userLocation] Override the longitude of the coordinates to search around
	 * @param {double} [$miles=25] Override the radius, in miles, to search around
	 * @return {Streams_Stream|null}
	 * @throws {Q_Exception} if a bad value is encountered and $throwIfBadValue is true
	 */

		// -------------
		// Common Request Parameters
		// -------------
		//  AssociateTag
		//  AWSAccessKeyId
		//  ContentType -> text/html, text/xml !!!!!
		//  MerchantId
		//  Operation
		//
		//        Search
		//            ItemSearch
		//            Lookup
		//
		//        Browse
		//            NodeLookup
		//            ItemLookup
		//            SimilarityLookup
		//
		//        Cart
		//            CartAdd
		//            CartClear
		//            CartCreate
		//            CartGet
		//            CartModify
		//
		//  Service
		//  Validate -> Default: False; Valid values: True, False
		//  Version -> 2013-08-01
		//  XMLEscaping -> Single, Double
		//
		// -------------

    static function itemSearch($searchIndex, $keywords, $locale) {

		$hosts = [
			'BR' => 'webservices.amazon.com.br',
			'CA' => 'webservices.amazon.ca',
			'CN' => 'webservices.amazon.cn',
			'DE' => 'webservices.amazon.de',
			'ES' => 'webservices.amazon.es',
			'FR' => 'webservices.amazon.fr',
			'IN' => 'webservices.amazon.in',
			'IT' => 'webservices.amazon.it',
			'JP' => 'webservices.amazon.co.jp',
			'MX' => 'webservices.amazon.com.mx',
			'GB' => 'webservices.amazon.co.uk',
			'US' => 'webservices.amazon.com'
		];

		// $tag = Q_Config::expect('Assets', 'amazon', 'keys', 'tag');

		$accessKeyID = Q_Config::expect('Assets', 'amazon', 'keys', 'key');
		$accessKeyPrivate = Q_Config::expect('Assets', 'amazon', 'keys', 'secret');

		$host = $hosts[$locale];
		$associateTag = Q_Config::expect('Assets', 'amazon', 'keys', 'tag')[$locale];

		if (!$keywords) {
			return false;
		} else {

			$method = "GET";
			$operation = "ItemSearch";
			$responseGroup = "EditorialReview,Large";
			$searchIndex = 'All';
			$version = "2013-08-01"; // "2011-08-01";

			$params = array(
				"AWSAccessKeyId" => $accessKeyID,
				"AssociateTag" => $associateTag,
				"Availability" => "Available",
				"Keywords" => $keywords,
				"Operation" => $operation,
				"ResponseGroup" => $responseGroup,
				"SearchIndex" => $searchIndex,
				"Service" => "AWSECommerceService",
				"Timestamp" => gmdate('Y-m-d\TH:i:s\Z'),
				"Version" => $version
			);

			// sort the parameters
			ksort($params);

			// create the canonicalized query
			$canonicalized_query = array();
			foreach ($params as $param => $value) {
				$param = str_replace("%7E", "~", rawurlencode($param));
				$value = str_replace("%7E", "~", rawurlencode($value));
				$canonicalized_query[] = $param . "=" . $value;
			}
			$canonicalized_query = implode("&", $canonicalized_query);

			// create the string to sign
			$stringSign = $method . "\n" . $host . "\n/onca/xml" . "\n" . $canonicalized_query;

			// calculate HMAC with SHA256 and base64-encoding
			$signature = base64_encode(hash_hmac("sha256", $stringSign, $accessKeyPrivate, True));

			// encode the signature for the request
			$signature = str_replace("%7E", "~", rawurlencode($signature));

			// create request
			$request = "http://" . $host . "/onca/xml" . "?" . $canonicalized_query . "&Signature=" . $signature;

			// print $request;
			// print $private_key;

			// do request
			$response = @file_get_contents($request);
			if ($response === false) {
				return false;
			} else {
				// parse XML
				$xml = simplexml_load_string($response);
				if ($xml === false) {
					return false; // no xml
				} else {

					$parsedXML = json_decode(json_encode((array) $xml), 1);

					if ( array_key_exists('Errors', $parsedXML['Items']['Request'] )) {
						return false;
					} else {
						$results = Assets_Amazon::formatResults($hosts, $parsedXML);
					}

					return $results;
				}
			}
		}
	}

	static function uuid() {
		return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
				// 32 bits for "time_low"
				mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

				// 16 bits for "time_mid"
				mt_rand( 0, 0xffff ),

				// 16 bits for "time_hi_and_version",
				// four most significant bits holds version number 4
				mt_rand( 0, 0x0fff ) | 0x4000,

				// 16 bits, 8 bits for "clk_seq_hi_res",
				// 8 bits for "clk_seq_low",
				// two most significant bits holds zero and one for variant DCE1.1
				mt_rand( 0, 0x3fff ) | 0x8000,

				// 48 bits for "node"
				mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
		);
	}

	/**
	 * Implements the __set_state method, so it can work with
	 * with var_export and be re-imported successfully.
	 * @method __set_state
	 * @static
	 * @param {array} $array
	 * @return {Assets_Amazon} Class instance
	 */
	static function __set_state(array $array) {
		$result = new Assets_Amazon();
		foreach($array as $k => $v)
			$result->$k = $v;
		return $result;
	}
};