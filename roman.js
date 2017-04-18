// Roman Numerals
// This week's quiz is to write a converter to and from Roman numerals.
//
// The script should be a standard Unix filter, reading from files specified on the command-line or STDIN and writing to STDOUT. Each line of input will contain one integer (between 1 and 3999) expressed as an Arabic or Roman numeral. There should be one line of output for each line of input, containing the original number in the opposite format.
//
// For example:
// III = 3
// 29 = XXIX
// 38 = XXXVIII
// CCXCI = 291
// 1999 = MCMXCIX
//
// If you're not familiar with or need a refresher on Roman numerals, the rules are simple. First, there are seven letters associated with seven values:
// I = 1
// V = 5
// X = 10
// L = 50
// C = 100
// D = 500
// M = 1000
//
// You can combine letters to add values, by listing them largest to smallest from left to right:
//
// II is 2
// VIII is 8
// XXXI is 31
//
// However, you may only list three consecutive identical letters. That requires a special rule to express numbers like 4 and 900. That rule is that a single lower value may proceed a larger value, to indicate subtraction. This rule is only used to build values not reachable by the previous rules:
//
//
// IV is 4
// CM is 900
// But 15 is XV, not XVX.

var conversion = {
  'I': 1,
  'V': 5,
  'X': 10,
  'L': 50,
  'C': 100,
  'D': 500,
  'M': 1000,
}


// ===========================================
// THE CONVERTER
// ===========================================


var convert = function(input) {
  var output;

  if (typeof(input) === 'string') {
    output = convertToNumber(input);
  } else if (typeof(input) === 'number') {
    output = convertToRoman(input);
  } else {
    throw new Error(errors.can_not.convert_type)
  }

  console.log(output);
}





// ===========================================
// CONVERT TO ROMAN NUMERAL
// ===========================================
// 677
// DCLXXVII
// 600 70 7
// CM

// Converter functions
convertToRoman = function(number) {
  var roman = mapNumberToRoman(number).join("");
  return roman;
}

// Map array to converted value
mapNumberToRoman = function(number) {
  var arr = mapNumberToArray(number);
  var numbers = arr.map(function(v, i) { return convertNumberToRoman(v, i, arr.length) });
  return numbers;
}

convertNumberToRoman = function(number, i, length) {
  var diff = (length - (i + 1))
  var val, boundaries;

  if (diff === 3) {
    boundaries = {
      'low': 'M',
      'mid': '?',
      'high': '??',
    }
  } else if (diff === 2) {
    boundaries = {
      'low': 'C',
      'mid': 'D',
      'high': 'M',
    }
  } else if (diff === 1) {
    boundaries = {
      'low': 'X',
      'mid': 'L',
      'high': 'C',
    }
  } else if (diff === 0) {
    boundaries = {
      'low': 'I',
      'mid': 'V',
      'high': 'X',
    }
  } else {
    throw new Error(errors.can_not.number_too_large);
  }

  return constructRomanNumeral(number, boundaries);
}

constructRomanNumeral = function(number, bound) {
  switch (number) {
    case 0:
      return;
    case 1:
      return bound['low'];
    case 2:
      return bound['low'] + bound['low'];
    case 3:
      return bound['low'] + bound['low'] + bound['low'];
    case 4:
      return bound['low'] + bound['mid'];
    case 5:
      return bound['mid'];
    case 6:
      return bound['mid'] + bound['low'];
    case 7:
      return bound['mid'] + bound['low'] + bound['low'];
    case 8:
      return bound['mid'] + bound['low'] + bound['low'] + bound['low'];
    case 9:
      return bound['low'] + bound['high'];
    case 10:
      return bound['high'];
    default:
        throw new Error(errors.can_not.utilise_case)
  }
}

mapNumberToArray = function(number) {
  var string = number.toString(10); // define the base radix
  var arr = string.split("");
  var numbers = arr.map(function(v) { return parseInt(v) }); // map values back to numbers

  return numbers;
}





// ===========================================
// CONVERT TO NUMBER
// ===========================================


// Convert roman numerals to number
convertToNumber = function(roman) {
  var number = mapRomanToNumber(roman);
  var count = equateValueFromRoman(number);
  return count;
}

// Map roman numerals to numbers
mapRomanToNumber = function(roman) {
  var arr = mapRomanToArray(roman);
  var roman_numerals = arr.map(function(v) { return findNumberFromRoman(v) });
  return roman_numerals;
}

// Convert input to array
mapRomanToArray = function(roman) {
  var arr = roman.split("");
  return arr;
}

// Find the conversion from roman numeral to number
findNumberFromRoman = function(roman) {
  var key = roman.toUpperCase();
  var number = conversion[key];

  if (typeof(number) === 'undefined') {
    throw new Error(errors.can_not.map_to_number);
  } else {
    return number;
  }
}

// Equate the final given number based on conditional logic
equateValueFromRoman = function(input) {
  var count = 0, consectutive_count = 1, current, prev = null;

  for (var i = 0; i < input.length; i++) {
    prev = input[i-1] || null;
    current = input[i];

    cases = {
      first: prev === null,
      declining: current < prev,
      consectutive: current === prev,
      subtractable: capableOfSubtraction(prev, current),
    }

    if (cases.first) {
      count = current;

    } else if (cases.declining) {
      count += current;
      consectutive_count = 0;

    } else if (cases.subtractable) {
      count += ((current - prev) - prev);
      consectutive_count = 0;

    } else if (cases.consectutive) {
      count += current;
      consectutive_count += 1;

    } else {
      throw new Error(errors.can_not.not_permitted)
    }

    if (consectutive_count > 3) {
      throw new Error(errors.can_not.consectutive_chain)
    }
  }

  return count;
}

capableOfSubtraction = function(prev, current) {
  var divison = prev / current;

  if (divison === 0.1 || divison === 0.2) {
    return true;
  } else {
    return false;
  }
}




// ===========================================
// ERRORS
// ===========================================


var errors = {
  can_not: {
    convert_type: 'This type of input can not be converted',
    map_to_number: 'This character is not a roman numeral',
    not_permitted: 'This is not a permitted roman numeral',
    consectutive_chain: 'You can not chain more than three roman numerals in a row',
    number_too_large: 'Can not convert a number larger than 3999, I do apologise',
    utilise_case: ' No boundary can be found for given value'
  }
}
