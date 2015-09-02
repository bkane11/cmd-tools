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
