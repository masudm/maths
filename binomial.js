//binomial: (a+bx)^c
//approximate: using x
let a = 5;
let b = 2;
let c = 4;
let x = 1;

let question = `(${a}+${b}x)^${c}`;

let sum = "";
let approx = 0;

for (var count = 0; count < c + 1; count++) {
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
