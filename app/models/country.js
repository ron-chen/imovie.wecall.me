/* 
* @Author: Ron Chen
* @Date:   2016-02-23 14:17:28
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-23 14:18:12
*/

var mongoose       = require('mongoose');
var CountrySchema  = require("../schemas/country");

var Country        = mongoose.model('countries',CountrySchema)

module.exports     = Country