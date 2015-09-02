var fs = require('fs'),
turf = require('turf')
;

var intersections = turf.kinks(JSON.parse( fs.readFileSync( "C:/temp/feature_55e0e6471574151491421630.3.json") ) );

console.dir(intersections);