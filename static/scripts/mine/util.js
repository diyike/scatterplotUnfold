const PI = Math.PI;
const sqrt = Math.sqrt;
const max = Math.max;
const min = Math.min;
const atan2 = Math.atan2;
const atan = Math.atan;
const tan = Math.tan;
const pow = Math.pow;
const floor = Math.floor;
const ceil = Math.ceil;
const abs = Math.abs;
const exp = Math.exp;
const log = Math.log;
const round = Math.round;
const sqrt_3 = Math.sqrt(3);


function dis(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function distance([x1, y1], [x2, y2]) {
    return Math.hypot(x1 - x2, y1 - y2);
}

function distance_sqrt([x1, y1], [x2, y2]) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}

function my_round(num, decimals = 2) {
    const x = pow(10, decimals);
    return round(num * x) / x;
}

const zip = (...arrays) => {
  const minLen = Math.min(...arrays.map(arr => arr.length));
  const [firstArr, ...restArrs] = arrays;
  return firstArr.slice(0, minLen).map(
    (val, i) => [val, ...restArrs.map( arr => arr[i]) ]
  );
}

const solve = path => {
  const array = d3.range(path.getTotalLength())
  const bisect = d3.bisector(d => path.getPointAtLength(d).x)
  const len = x => bisect.right(array, x)
  return x => path.getPointAtLength(len(x)).y
}

const solve2 = path => {
  const array = d3.range(path.getTotalLength())
  const bisect = d3.bisector(d => path.getPointAtLength(d).y)
  const len = y => bisect.right(array, y)
  return y => path.getPointAtLength(len(y)).x
}

