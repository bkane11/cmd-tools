// @param `collection` - specified in arguments when running command
// ex: mongo --nodb --quiet --eval "var collection='%COLLECTION%'" "C:\projects\cmd-tools\mongo-tools\ensure-indexes-on-all-properties.js"

function addAllIndexes(collection){
  var conn = new Mongo();
  var db = conn.getDB("geo_data");

  print(collection)

  Object.keys(db[collection].findOne().properties).forEach(function(key){
    var q={};
    q[key]= 1;
    db[collection].ensureIndex(q)
  })

  db[collection].ensureIndex({geometry: '2dsphere'});
  // create text index on all properties with string values - for search api
  db[collection].createIndex( { "$**": "text" } );

  print(collection + ' has indexes:');
  db[collection].getIndexes().forEach(function(index){
    print(index.ns, Object.keys(index.key), index.name, index.v);
  })
}

addAllIndexes(collection);