/*
  run with:
  mongo --nodb --eval "var hazardgroup='crops'" "C:\Projects\cmd-tools\mongo-tools\update-collection-for-venturamhmp.js"
*/

var conn = new Mongo();
var db = conn.getDB("geo_data");

var mongobase = 'venturamhmp'
// , hazardgroup = 'climatechange_coastalstorm'
// , hazardgroup = 'climatechange_risingtide'
// , hazardgroup = 'criticalfacilities'
, hazardgroup = typeof hazardgroup !== undefined ? hazardgroup : 'crops'
;

db.getCollectionNames().forEach(function(possible){
  var test = new RegExp('^' + mongobase);
  if( test.test(possible) && possible.indexOf(hazardgroup)!==-1){
    var collection = possible;
    // print(possible)
    print(collection);
    var itemsToRemove = ['hlshd_30m', 'hil30m_v1.tif (30m hs statewide)', 'NAIP\\California_2014_1m', 'Bookmark 1'];
    itemsToRemove.forEach(function(removeItem){
      // print('finding item:', removeItem, db[collection].find({'properties.name': removeItem}).count() );
      print('removing item:', removeItem, db[collection].remove({'properties.name': removeItem}) )
    })
  }
})

// ['cities_outline', 'combinedstorm_combinedscenarios', 'countyframe', 'major_rivers', 'majorroads_hazus__i_us_st_', 'railroads', 'roads', 'usfs'].forEach(function(layername){
    // var collection = [mongobase, hazardgroup, layername].join('_');
// })