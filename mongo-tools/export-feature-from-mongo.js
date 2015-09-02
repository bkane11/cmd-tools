var conn = new Mongo();
var db = conn.getDB("geo_data");

// specify COLL and id as arguments in eval and write to file
// eg - 
// mongo -eval "var COLL='venturamhmp_flood_daminundation_waivereddaminundation_may2015'; var OID='55e4f7f358bb446d702c4375'" export-feature-from-mongo.js > cat c:\temp\feature_55e4f7f358bb446d702c4375.json
var collection = typeof COLL !== undefined ? COLL : 'venturamhmp_flood_daminundation_waivereddaminundation_may2015';
var id = typeof OID !== undefined ? ObjectId(OID) : ObjectId('55e0e647157415149142162f');
printjson( db[collection].findOne({ _id: id } ) ) 
// printjson( db.venturamhmp_flood_daminundation_daminundation_may2015.findOne( { _id: typeof OID !== undefined ? ObjectId(OID) : ObjectId('55e0e609157415149141fb8c') } ) ) 