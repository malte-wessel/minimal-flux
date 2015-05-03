function isCapital(letter) {
	return letter === letter.toUpperCase();
}

export default function hasPrefix(str, prefix) {
	return str.indexOf(prefix) === 0 &&
		(str.length === prefix.length || 
			isCapital(str[prefix.length]));
}