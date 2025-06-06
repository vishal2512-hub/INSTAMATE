function nonRepeating (str) {
    
    let charcount = {};

    for (const char of str) {
        charcount[char] = (charcount[char] || 0) + 1;
    }

    for (const char of str) {
        if (charcount[char] === 1) {
            return char;
        }
    }

    return null;
}

let str = "aabbccdef";
console.log(nonRepeating(str));
