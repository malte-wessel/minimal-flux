function isCapital(letter) {
	return letter === letter.toUpperCase();
}

/**
 * Determine if string has a prefix
 * @param  {String}  str    String to be tested
 * @param  {String}  prefix Prefix
 * @return {Boolean}
 */
export default function hasPrefix(str, prefix) {
	return str.indexOf(prefix) === 0 &&
		(str.length === prefix.length || 
			isCapital(str[prefix.length]));
}