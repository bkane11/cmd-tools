var conn = new Mongo();
var db = conn.getDB("geo_data");

print(collection)

// var collection = 'venturamhmp_tsunami_hazard_areas';

Object.keys(db[collection].findOne().properties).forEach(function(key){
  var q={};
  q[key]= 1;
  db[collection].ensureIndex(q)
})

db[collection].ensureIndex({geometry: '2dsphere'});

print(collection + ' has indexes:')
db[collection].getIndexes().forEach(function(index){
  print(index.ns, Object.keys(index.key), index.name, index.v);

})