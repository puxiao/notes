// 计算 3D 空间中 2 个点(位置) 之间的旋转角度

function getVector(vec){
  return {
      theta:(Math.PI/2)+Math.atan2(vec.dz, vec.dx),
      phi:(3*Math.PI/2)+Math.atan2(vec.dz, vec.dy)
   };
}

V1 = { x: 3.296372727813439, y: -14.497928014719344, z: 12.004105246875968 }
V2 = { x: 2.3652551657790695, y: -16.732085083053185, z: 8.945905454164146 }

var v={dx:V2.x-V1.x, dy:V2.y-V1.y, dz:V2.z-V1.z}
getVector(v);
