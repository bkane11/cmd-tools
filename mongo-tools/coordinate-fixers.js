function flattenCoords(feature){
  return feature.geometry.coordinates.reduce(function(a,b){ return a.concat(b) })
}


function findDupesByGroup(feature, output){
  var arr = [];
  feature.geometry.coordinates.forEach(function(item, index){
    // printjson([index, find_duplicates(item)] )
    var obj = {};
    obj[index] = find_duplicates(item);
    if(item instanceof Array && item[0] instanceof Array && item[0][0] instanceof Array)
      item.forEach(function(subitem, index2){
        obj[index][index2] = find_duplicates(subitem)
      })
    arr.push(obj);
  })
  return output ? arr && showDupeGroups(arr) : printjson(arr);
}

function showDupeGroups(dupes){
  var objects = [];
  Object.keys(dupes).forEach(function(b){ var items = dupes[b][Object.keys(dupes[b])[0]]; var itemkeys = Object.keys(items); itemkeys.length > 1 && objects.push([b, itemkeys.map(function(n){ return [n, items[n]] })]); })
  printjson(objects);
  return objects
}

function updateCoord(vertex, base, up){
  var feature = this.geometry && this.geometry.coordinates ? this : this.feature;
  // printjson(feature);
  base = base || 0;
  // return printjson([vertex, feature.geometry.coordinates[base][vertex]])
  var coords = feature.geometry.coordinates[base][vertex];
  printjson(['coords 0 changing from:', coords[0], 'to:', parseFloat(coords[0])+(0.00000000000001 * (up ? 1 : -1))])
  printjson(['coords 1 changing from:', coords[1], 'to:', parseFloat(coords[1])-(0.00000000000001 * (up ? 1 : -1))])
  // return 
  feature.geometry.coordinates[base][vertex][0]+=(0.00000000000001 * (up ? 1 : -1) );
  feature.geometry.coordinates[base][vertex][1]-=(0.00000000000001 * (up ? 1 : -1) );
}

function updateMultipleCoordsInGroup(vertices, group){
  vertices.forEach(function(vertex){
    updateCoord(vertex, group || 0)
  })
}

function printCoords(min, max, base){
  base = base || 0;
  for(var i=min; i<max;i++)printjson([i, feature.geometry.coordinates[base][i] ])
}

// var feature = db.venturamhmp_flood_daminundation_waivereddaminundation_may2015.findOne({ _id: ObjectId('55e0e6471574151491421630') })

function flattenCoords(feature){
  return feature.geometry.coordinates.reduce(function(a,b){ return a.concat(b) })
}

function findDupesByGroup(feature, output){
  var arr = [];
  var coords = feature.geometry && feature.geometry.coordinates || feature
  coords.forEach(function(item, index){
    // printjson([index, find_duplicates(item)] )
    var obj = {};
    obj[index] = find_duplicates(item);
    arr.push(obj);
  })
  return output ? arr : printjson(arr);
}

function find_duplicates(arr) {
  var len=arr.length,
      out={},
      counts={},
      indexes={};

  for (var i=0;i<len;i++) {
    var item = arr[i];
    indexes[item] = indexes[item] || [];
    indexes[item].push(i);
    if(counts[item] = counts[item] >= 1)
      counts[item] += 1;
    else
      counts[item] = 1;
  }

  for (var item in counts) {
    if(counts[item] > 1)
      out[item] = indexes[item];
      // out.push(item);
  }

  return out;
}

function findDupe(b,index){
    var dupes = find_duplicates(b);
    printjson(dupes);
    var dupe = dupes[Object.keys(dupes)[0]];
    if(dupe && dupe.length>2){
      printjson(dupe);
      print(index);
      printjson(dupes);
      var badvertex = dupe[1];
      var coordpoint = feature.geometry.coordinates[index];
      printjson( [ coordpoint[0], coordpoint[badvertex-1],coordpoint[badvertex],coordpoint[badvertex+1], coordpoint[coordpoint.length-1] ] );
    }
}

function getCollections(mongobase, hazardgroup){
  var conn = new Mongo(),
  db = conn.getDB("geo_data")
  mongobase = mongobase || 'venturamhmp'
  ;
  var collections = [];
  db.getCollectionNames().forEach(function(possible){
    var test = new RegExp('^' + mongobase);
    if( test.test(possible) && (hazardgroup ? possible.indexOf(hazardgroup)!==-1 : true)){
      var collection = possible;
      // print(possible)
      // print(collection);
      collections.push(collection);
    }
  })
  return collections
}

function checkForGeoIndexes(mongobase, collection){
  getCollections(mongobase, collection).forEach(function(col){ 
    var hasgeoindex;
    db[col].getIndexes().forEach(function(index){
      if(index.name==="geometry_2dsphere"){
        hasgeoindex = true;
        // printjson([col, index])
      } 
    })
    if(!hasgeoindex)
      print(col, 'does not have geoindex')
  })
}

function checkForTextIndexes(mongobase, collection){
  getCollections(mongobase, collection).forEach(function(col){ 
    var hasindex;
    db[col].getIndexes().forEach(function(index){
      if(index.name==="$**_text"){
        hasindex = true;
        // printjson([col, index])
      } 
    })
    if(!hasindex){
      try{
        print('adding text index to', col);
        db[col].createIndex( { "$**": "text" } );
      }catch(err){
        print(col, 'does not have text index')
      }
    }
  })
}

function checkForDescriptionField(mongobase, collection){
  getCollections(mongobase, collection).forEach(function(col){ 
    var item = db[col].findOne({},{'properties': true});
    if(!item || !item.properties || !item.properties.description)
      print('no description field for:', col);
    // else
    //   printjson([col, 'has a description'])
  })
}

// var props = {'stroke-width': 0}
function updateSymbology(mongobase, collection, props){
  getCollections(mongobase, collection).forEach(function(col){
    print(col);
    db[col].find().toArray().forEach(function(feature){
      // printjson(feature.properties);
      updateProps(feature, props);
      db[col].save(feature);
    })
  })
}


function searchForDuplicatesInCollection(mongobase, collection, update){
  getCollections(mongobase, collection).forEach(function(col){
    printjson(['searching in:', col])
    db[col].find().toArray().forEach(function(feature){ 
    // db.venturamhmp_population_density_census_block.find().toArray().forEach(function(feature){ 
      var d = findDupesByGroup(feature, true);
      var base = 0;
      Object.keys(d).forEach(function(base){
        // print('base:', base, Object.keys(d[base]).join(' - '));
        var item = d[base][base];
        var keys = Object.keys(item);
        if(keys.length>1)
          print('num keys', keys.length);
        keys.forEach(function(key, index){
          if(index > 0 || item[key].length > 2){
            printjson(item);
            var vertex = item[key][1]; 
            print('\t', 'base:', base, 'vertex:', vertex)
            printjson(feature.geometry.coordinates[base][vertex]);
            if(update){
              updateCoord.call(feature, item[key][1], base);
              db[col].save(feature);
            }
            // printjson(feature.geometry.coordinates[0][0][item[key][1]]);
          }
        })
        // printjson(d[0][0]) 
      })
      })
  })
}

function forEachFeature(collection, func){
  db[collection].find().toArray().forEach(func);
}

function updateProps(feature, props){
  for(var prop in props){
    // printjson(['updating', prop])
    var og = feature.properties[prop];
    if(og)
      feature.properties['og_'+prop] = og;
    feature.properties[prop] = props[prop];
    print(prop, og || '', '==>', feature.properties[prop]);
  }
  return feature
}

function setPropertiesFromTable(feature, col){
  for(var prop in feature.properties){
    if( /<table/i.test(feature.properties[prop]) ){
      var propsArr = getPropsFromTable(feature.properties[prop]);
      if(propsArr && propsArr.length > 0){  
        propsArr.forEach(function(prop){
          printjson(prop);
          updateProps(feature, prop);
        })
        if(col && db[col])
          printjson(db[col].save(feature))
        
      }
    }
  }
}

function getPropsFromTable(table){
  return table.split(/<tr(.*)>/g)
      .map(function(item){
        return item && item.trim()
      })
      .filter(function(item){
          return item && /<td(.*)>/g.test( item )
      })
      .map(function(s2, i){
        var a = s2
          .replace(/<\/tr>/g, '')
          .replace(/<(\/)?td>/g, '')
          .replace(/\r/g, '')
          .trim()
          .split(/\n/)
          .map(function(item, index, arr){
            return arr.length == 2 ? item : null
          })
          .filter(function(item){
            return item
          })
        if(a.length == 2){
          var props = {};
          props[a[0]] = a[1];
          return props
        }
        return null
    }).filter(function(item){
      return item
    })
}

// var feature = db.venturamhmp_flood_daminundation_waivereddaminundation_may2015.findOne({ _id: ObjectId('55e0e6471574151491421630') })

// feature.geometry.coordinates.forEach(
//   function(b, index){
//     var dupes = find_duplicates(b);
//     var dupe = dupes[Object.keys(dupes)[0]];
//     if(dupe.length>2){
//       print(index);
//       printjson(dupes);
//       var badvertex = dupe[1];
//       // printjson(dupe)
//       var coordpoint = feature.geometry.coordinates[index];
//       coordpoint[badvertex][0]-=0.0000000000001;
//       coordpoint[badvertex][1]+=0.00000000000001;
//       printjson([coordpoint[0], coordpoint[badvertex],coordpoint[coordpoint.length-1]]);
//       // printjson([coordpoint[0], coordpoint[badvertex-1],coordpoint[badvertex],coordpoint[badvertex+1], coordpoint[coordpoint.length-1]]);
//     }
// })

// getCollections(null, 'daminundation').forEach(function(col){  
//   ['hlshd_30m', 'NAIP\\California_2014_1m', 'Bookmark 1'].forEach(function(removeItem){
//     db[col].remove({'properties.name': removeItem })
//   })  
// })
// feature.geometry.coordinates.forEach(findDupe);

function setPropertiesFromTableByCollectionSearch(search, test){
  getCollections(search).forEach(function(col){ 
    forEachFeature(col, function(feature){
      setPropertiesFromTable(feature, test ? null : col) 
    }) 
  })
}

// var lookup = [{
//     url: "Layer0_Symbol_15e0f278_0.png",
//     prop: 'Community'    
// }, {
//     url: "Layer0_Symbol_15e0ee10_0.png",
//     prop: 'Government'
// }, {
//     url: "Layer0_Symbol_15e0ec98_0.png",
//     prop: 'Public Utility'
// }, {
//     url: "Layer0_Symbol_15e0f3f0_0.png",
//     prop: 'Emergency Response'
// }, {
//     url: "Layer0_Symbol_15e0ef88_0.png",
//     prop: 'Education'
// }, {
//     url: "Layer0_Symbol_15e0f100_0.png",
//     prop: 'Medical Facility/Residential Care'
// }, {
//     url: "Layer0_Symbol_15e0f568_0.png",
//     prop: 'Fuel Distribution'
// }, {
//     url: "Layer0_Symbol_15e0f6e0_0.png",
//     prop: 'Transportation'
// }]

var lookup = [{
    url : 'Layer0_Symbol_23288aa8_0.png',
    prop: 'Severe Repetitive Loss Property'    
  },
  { 
    url: "Layer0_Symbol_23288c20_0.png",
    prop: 'Repetitive Loss Property'    
  }
]
function updateFeaturesByIconUrlAndPropLookup(col, lookup, propname, test){
  db[col].find().toArray().forEach(function(feature){
    lookup.some(function(item){
      if(item.url==feature.properties.icon.url){
        printjson([item, feature.properties.name]);
        feature.properties[propname] = item.prop;
        if(!test)
          db[col].save(feature);
        return true
      }  
    })
  })
}

// 'fill-opacity': 1,
// var lookup = [
//   {
//     COMMODITY: 'avocado',
//     props: {
//       fill: "rgb(0,176,80)"
//     }
//   },
//   {
//     COMMODITY: 'lemon',
//     props : {
//       fill: "rgb(255,255,0)"
//     }
//   },
//   {
//     COMMODITY: 'nursery',
//     props : {
//       fill: "rgb(0,176,240)"
//     }
//   },
//   {
//     COMMODITY: 'orange',
//     props : {
//       fill: "rgb(255,102,0)"
//     }
//   },
//   {
//     COMMODITY: 'nursery',
//     props : {
//       fill: "rgb(0,176,240)"
//     }
//   },
//   {
//     COMMODITY: 'raspberry',
//     props : {
//       fill: "rgb(204,0,255)"
//     }
//   },
//   {
//     COMMODITY: 'row crops',
//     props : {
//       fill: "rgb(152,230,0)"
//     }
//   },
//   {
//     COMMODITY: 'strawberry',
//     props : {
//       fill: "rgb(255,0,0)"
//     }
//   },
//   {
//     COMMODITY: 'tangerine',
//     props : {
//       fill: "rgb(255,192,0)"
//     }
//   }
// ]

// var nomatchprops = {fill: 'rgb(238,205,247)'};

function updateFeaturesByPropertyUrlAndPropLookup(col, lookup, propname, nomatchprops, test){
  forEachFeature(col, function(feature){
    var found;
    lookup.some(function(item){
      if(item[propname]==feature.properties[propname]){
        updateProps(feature, item.props);
        // if(!test)
        //   db[col].save(feature);
        // print(item[propname], 'FOUND')
        return found = true
      }  
    })
    if(!found){
      updateProps(feature, nomatchprops)
    }
    printjson(feature.properties[propname]);
    if(!test)
      db[col].save(feature);
  })
}
