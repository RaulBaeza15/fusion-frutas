/* Trace an alpha silhouette, simplify it, and decompose concavities with poly-decomp. */
window.FusionSilhouette = (function () {
  'use strict';
  function alphaPolygon(img) {
    var size = 72, canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, size, size);
    var rgba = ctx.getImageData(0, 0, size, size).data;
    var on = function (x, y) { return x >= 0 && x < size && y >= 0 && y < size && rgba[(y * size + x) * 4 + 3] >= 100; };
    var edges = new Map(), sumX=0, sumY=0, countOn=0;
    function add(ax, ay, bx, by) {
      var k = ax + ',' + ay;
      if (!edges.has(k)) edges.set(k, []);
      edges.get(k).push([bx, by]);
    }
    for (var y = 0; y < size; y++) for (var x = 0; x < size; x++) {
      if (!on(x,y)) continue;
      sumX+=x+0.5; sumY+=y+0.5; countOn++;
      if (!on(x,y-1)) add(x,y,x+1,y);
      if (!on(x+1,y)) add(x+1,y,x+1,y+1);
      if (!on(x,y+1)) add(x+1,y+1,x,y+1);
      if (!on(x-1,y)) add(x,y+1,x,y);
    }
    var loops = [];
    while (edges.size) {
      var first = edges.keys().next().value, at = first, loop = [], count = 0;
      do {
        loop.push(at.split(',').map(Number));
        var candidates = edges.get(at);
        if (!candidates || !candidates.length) break;
        var next = candidates.pop();
        if (!candidates.length) edges.delete(at);
        at = next.join(',');
      } while (at !== first && ++count < 12000);
      if (at === first && loop.length > 10) loops.push(loop);
    }
    if (!loops.length) throw Error('No visible alpha contour');
    // Largest component is the physical hitbox. Tiny detached details are drawn, not collidable.
    loops.sort(function(a,b) { return Math.abs(area(b)) - Math.abs(area(a)); });
    var poly = simplify(loops[0], 1.3);
    for (var tol=2.4; poly.length>60 && tol<=8; tol+=1.2) poly=simplify(loops[0],tol);
    if (poly.length < 3 || poly.length > 100) throw Error('Silhouette too complex');
    var coords = poly.map(function(p) { return [(p[0] - 36) / 36, (p[1] - 36) / 36]; });
    if (window.decomp) {
      decomp.makeCCW(coords); decomp.removeCollinearPoints(coords, 0.01);
      decomp.removeDuplicatePoints(coords, 0.005);
      var parts = decomp.quickDecomp(coords);
      if (parts.length && parts.length <= 32) {
        return { center: {x:(sumX/countOn-36)/36,y:(sumY/countOn-36)/36}, polygons: parts.map(function(part) { return part.map(function(p) { return {x:p[0],y:p[1]}; }); }),
          outer: coords.map(function(p) { return {x:p[0],y:p[1]}; }) };
      }
    }
    throw Error('Could not decompose alpha contour');
  }
  function area(p) {
    var sum=0; for(var i=0;i<p.length;i++) { var q=p[(i+1)%p.length]; sum+=p[i][0]*q[1]-q[0]*p[i][1]; } return sum/2;
  }
  function simplify(points, epsilon) {
    // Closed boundary: sample turns at a fixed pixel tolerance, preserving concave corners.
    var result = [points[0]], last = points[0];
    for(var i=1;i<points.length;i++) {
      var p=points[i];
      if(Math.hypot(p[0]-last[0],p[1]-last[1])>=epsilon) { result.push(p); last=p; }
    }
    for(var j=result.length-1;j>=0&&result.length>3;j--) {
      var a=result[(j-1+result.length)%result.length], b=result[j], c=result[(j+1)%result.length];
      var cross=Math.abs((b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]));
      if(cross<0.8) result.splice(j,1);
    }
    return result;
  }
  return { trace: alphaPolygon };
})();
