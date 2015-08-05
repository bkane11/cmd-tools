var collections = [
'explorations'
// , 'geomorph_lines'
// , 'geomorph_polys'
, 'levee_mile_markers'
, 'nule_levee_reports'
, 'nule_stationing_alignment'
, 'poi_lines'
, 'poi_points'
, 'subsurface_exploration_locations'
];

var props = [/*'shape_area', 'shape_leng', */'shape_length'];

collections.forEach( function(coll){
	db[coll].find().forEach( function(doc){
		props.forEach(function(prop){
			print (coll)
			if(doc.properties[prop]){
				var featureprop = doc.properties[prop];
				if( !isNaN(parseFloat(featureprop) ) ) {
					print (prop, featureprop)
					db[coll].update( 
			           { _id: doc._id}, 
			           { $set : {  'properties.shape_length' : parseFloat(featureprop) } }
			        )
				}
			}
		})
	})
})


 db.geomorph_polys.ensureIndex({'shape_leng':1})
 db.geomorph_polys.ensureIndex({'shape_area':1})
 db.geomorph_lines.ensureIndex({'shape_leng':1})

 db.nule_levee_reports.ensureIndex({'shape_length':1})
 db.poi_lines.ensureIndex({'shape_length':1})
 db.nule_stationing_alignment.ensureIndex({'shape_length':1})

// collections.forEach(function(coll){
// 	var doc = db[coll].findOne();
// 	for(var prop in doc.properties){
// 		db[coll].ensureIndex({prop: 1})
// 	}
// })

db.geomorph_polys.findOne({ 'properties.shape_leng' : { $gte: 999} }).properties
db.geomorph_polys.findOne({ 'properties.shape_area' : { $gte: 999} }).properties
db.poi_lines.findOne({ 'properties.shape_area' : { $gte: 999} }).properties
db.poi_lines.findOne().properties