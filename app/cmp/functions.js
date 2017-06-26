export function trim(str, chr) {
  var rgxtrim = (!chr) ? new RegExp('^\\s+|\\s+$', 'g') : new RegExp('^'+chr+'+|'+chr+'+$', 'g');
  return str.replace(rgxtrim, '');
}
export function rtrim(str, chr) {
  var rgxtrim = (!chr) ? new RegExp('\\s+$') : new RegExp(chr+'+$');
  return str.replace(rgxtrim, '');
}
export function ltrim(str, chr) {
  var rgxtrim = (!chr) ? new RegExp('^\\s+') : new RegExp('^'+chr+'+');
  return str.replace(rgxtrim, '');
}
export function rand( min, max, exclude ) {
	var rnd = min;
	if( max ) {
		rnd = Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
		max = min;
		rnd = Math.floor(Math.random() * (max + 1));
	}
	if(typeof exclude !== 'undefined' && exclude == rnd){
		rnd = --rnd < 0 ? max : rnd;
	}
	return rnd;
}
export const spell = (function(){
    var cases = [2, 0, 1, 1, 1, 2];
    var declOfNumSubFunction = function(titles, number){
        number = Math.abs(number);
        return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
    }
    return function(_titles) {
        if ( arguments.length === 1 ){
            return function(_number){
                return declOfNumSubFunction(_titles, _number)
            }
        }else{
            return declOfNumSubFunction.apply(null,arguments)
        }
    }
})()

export function decToHex(dec){
	let hexStr = '0123456789ABCDEF';
	let low = dec % 16;
	let high = (dec - low)/16;
	hex = '' + hexStr.charAt(high) + hexStr.charAt(low);
	return hex;
}
export function strTohex(string){
    let str = string;
    var hex = '';
    for(var i = 0; i < str.length; i++) {
        hex += ''+ str.charCodeAt(i).toString(16);
    }
    return hex;
}
export const str2color = (str) => '#'+ strTohex(str.toLowerCase().substr(0,3));