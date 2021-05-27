function str2int(str) {
  const charCodes = [...str].map(char => {
    if (Number.isInteger(parseInt(char))) {
      return char;
    } 
    return char.charCodeAt(char[0]);
  })

  return charCodes.join('');
}
function int2bin(int) {
  return int.toString(2);
}

function lokesh256(str) {
    let ints = str2int(str);
    return ints.substring(0, 64);
}

module.export = lokesh256;
