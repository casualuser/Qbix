/**
 * Class representing amazon rows.
 *
 * This description should be revised and expanded.
 *
 * @module Assets
 */
var Q = require('Q');
var Db = Q.require('Db');
var Amazon = Q.require('Base/Assets/Amazon');

/**
 * Class representing 'Amazon' rows in the 'Assets' database
 * @namespace Assets
 * @class Amazon
 * @extends Base.Assets.Amazon
 * @constructor
 * @param {Object} fields The fields values to initialize table row as
 * an associative array of `{column: value}` pairs
 */
function Assets_Amazon (fields) {

	// Run mixed-in constructors
	Assets_Amazon.constructors.apply(this, arguments);

	/*
	 * Add any privileged methods to the model class here.
	 * Public methods should probably be added further below.
	 * If file 'Amazon.js.inc' exists, its content is included
	 * * * */

	/* * * */
}

Q.mixin(Assets_Amazon, Amazon);

/*
 * Add any public methods here by assigning them to Assets_Amazon.prototype
 */

/**
 * The setUp() method is called the first time
 * an object of this class is constructed.
 * @method setUp
 */
Assets_Amazon.prototype.setUp = function () {
	// put any code here
	// overrides the Base class
};

module.exports = Assets_Amazon;