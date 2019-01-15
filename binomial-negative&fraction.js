//binomial: (a+bx)^c z times where c is negative or fraction
//a MUST BE ONE so new general formula is a^c * (1 + b/a x)^c (hidden away from user)
//approximate: using x
let a = 2;
let b = 3;
let c = -1/2;
let x = 0.1;

let question = `(${a}+${b}x)^${c}`;

let sum = "1 + ";
let approx = 0;

let z = 3; //this needs to be here otherwise it will go infinitely

let coeffReturn = 4; //return a coefficient if more than 0
let coeffs = [];

for (var count = 1; count < z; count++) {
	let numerator = calcNumerator(c, count) * (b/a)**count;
  let denominator = sFact(count)
  
  let coeff = numerator/denominator;
  
  sum += (coeff+"x^"+count+" + ");
  approx += coeff * (x)**count;
  
  coeffs.push(coeff);
}

sum = sum.substring(0, sum.length - 3);

console.log(sum);
console.log(approx);
console.log(coeffs);

if (coeffReturn > -1) {
	console.log(coeffs[coeffReturn]);
}

function calcNumerator(start, end) {
	let total = 1;
	for (var i = 0; i < end; i++) {
  	total *= (start - (1 * i))
  }
  return total;
}

function sFact(num)
{
    var rval=1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}
