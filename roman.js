// Roman Numerals
// This week's quiz is to write a converter to and from Roman numerals.

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
  var val, diff = (length - (i + 1))

  switch (diff) {
    case 3:
     return constructRomanNumeral(number, {
       'low': 'M',
       'mid': '?',
       'high': '??',
       });
    case 2:
     return constructRomanNumeral(number, {
       'low': 'C',
       'mid': 'D',
       'high': 'M',
       });
    case 1:
     return constructRomanNumeral(number, {
       'low': 'X',
       'mid': 'L',
       'high': 'C',
       });
    case 0:
     return constructRomanNumeral(number, {
       'low': 'I',
       'mid': 'V',
       'high': 'X',
       });
    default:
      throw new Error(errors.can_not.number_too_large);
  }
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
  var numbers = arr.map(function(v) { return parseInt(v) });

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
