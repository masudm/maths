//binomial: (a+bx)^c z times
//approximate: using x
let a = 1;
let b = -1/4;
let c = 10;
let x = 0.1;

let question = `(${a}+${b}x)^${c}`;

let sum = "";
let approx = 0;

let z = c + 1; //by default but could be 4 for example

for (var count = 0; count < z; count++) {
	let combine = (choose(c, count));
  let coeff = combine * (a**(c - count)) * (b**count);
  sum += (coeff+"x^"+count+" + ");
  approx += coeff * (x)**count;
}

sum = sum.substring(0, sum.length - 3);

console.log(sum);
console.log(approx);

function choose(n,k) {
   if (k > n-k) {k = n-k;} // Use symmetry for smaller computation
   var accum = 1;
   for(var i=1; i<=k; i++){
      accum *= (n-(k-i));
      accum = Math.round(accum/i);
   }
   return accum; 
}
