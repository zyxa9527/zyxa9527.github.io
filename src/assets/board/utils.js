const Utils = {};

//生成指定大小且成對的隨機陣列
Utils.arrayRandom = function (fillCount, group) { 
    let at = [] ; 
    for(let i=0; i< fillCount/2; i++){ 
        let random = Math.floor( Math.random()* group.length) 
        at[i]=  Object.assign({}, group[random] ).valueOf();
        at[i+fillCount/2]=  Object.assign({}, group[random] ).valueOf();
    }   
    return at.sort(arrayrandomsort)
}

//隨機排列
const arrayrandomsort = function() {
  return Math.random()>.5 ? -1 : 1;
}
 
//外層加上空白方塊
Utils.arrayAddWhiteBlocks = function ( row , col , arr, cell) {
  let result = [];
  for(let i =0;i<= row-1 ;i++){
      let ar =  arr.slice( i * col  , (i+1) * col)
      ar.splice(0, 0, Object.assign({}, cell).valueOf())
      ar.splice(ar.length, 0, Object.assign({}, cell).valueOf())
      result.push(ar)
  }
  result.splice(0, 0, Array( col+2 ).fill().map(() => Object.assign({}, cell).valueOf()));
  result.splice(result.length, 0, Array( col+2 ).fill().map(() => Object.assign({}, cell).valueOf()));
  return result
}

export default Utils


