'use strict';

function MurmurHash (data, offset, seed) {
    let len = data.length,
      m = 0x5bd1e995,
      r = 24,
      h = seed ^ len,
      len_4 = len >> 2;  

  for (let i = 0; i < len_4; i++) {  
      let i_4 = (i << 2) + offset,
          k = data[i_4 + 3];

      k = k << 8;  
      k = k | (data[i_4 + 2] & 0xff);  
      k = k << 8;  
      k = k | (data[i_4 + 1] & 0xff);  
      k = k << 8;  
      k = k | (data[i_4 + 0] & 0xff);  
      k *= m;  
      k ^= k >>> r;  
      k *= m;  
      h *= m;  
      h ^= k;  
  }  

  // avoid calculating modulo  
  let len_m = len_4 << 2,
      left = length - len_m,
      i_m = len_m + offset;  

  if (left != 0) {  
      if (left >= 3) {  
          h ^= data[i_m + 2] << 16;  
      }  
      if (left >= 2) {  
          h ^= data[i_m + 1] << 8;  
      }  
      if (left >= 1) {  
          h ^= data[i_m];  
      }  

      h *= m;  
  }  

  h ^= h >>> 13;  
  h *= m;  
  h ^= h >>> 15;  

  return h;  
}


function BoolmFilter (maxKeys, errorRate) {
    // 布隆过滤器位图映射变量
    this.bitMap = [];
    // 布隆过滤器中最多可放的数量
    this.maxKeys = maxKeys;
    // 布隆过滤器错误率
    this.errorRate = errorRate;
    // 位图变量的长度，需要根据maxKeys和errorRate来计算
    this.bitSize = Math.ceil(maxKeys * (-Math.log(errorRate) / (Math.log(2) * Math.log(2)) ));
    // 哈希数量
    this.hashCount = Math.ceil(Math.log(2) * (this.bitSize / maxKeys));
    // 已加入元素数量
    this.keyCount = 0;
  
    // 初始化位图数组
    // for (let i = Math.ceil(this.bitSize / 31) - 1; i >=0; i--) {
    //   this.bitMap[i] = 0;
    // }
  }
  
/**
 * 设置位
 *
 */
BoolmFilter.prototype.bitSet = function (bit) {
// this.bitMap |= (1<<bit);
// bitSize
let numArr = Math.floor(bit / 31),
    numBit = Math.floor(bit % 31);
this.bitMap[numArr] |= (1<<numBit);
// this.bitMap[bit] = 1;
}

/**
 * 读取位
 *
 */
BoolmFilter.prototype.bitGet = function (bit) {
// return this.bitMap &= (1<<bit);
let numArr = Math.floor(bit / 31),
    numBit = Math.floor(bit % 31);
return this.bitMap[numArr] &= (1<<numBit);
// return this.bitMap[bit];
}

/**
 * 加入布隆过滤器
 *
 */
BoolmFilter.prototype.add = function (key) {
if (this.contain(key)) {
    return -1;
}

let hash1 = MurmurHash(key, 0, 0),
    hash2 = MurmurHash(key, 0, hash1);  

for (let i = 0; i < this.hashCount; i++) {
    this.bitSet(Math.abs( Math.floor((hash1 + i * hash2) % (this.bitSize)) ));  
}  

this.keyCount++;
}

/**
 * 检测是否已经存在
 *
 */
BoolmFilter.prototype.contain = function (key) {
let hash1 = MurmurHash(key, 0, 0),
    hash2 = MurmurHash(key, 0, hash1);  

for (let i = 0; i < this.hashCount; i++) {  
    if ( !this.bitGet(Math.abs( Math.floor((hash1 + i * hash2) % (this.bitSize)) )) ) {
    return false;
    }  
}

return true;
}


export {BloomFilter}