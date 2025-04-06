const lookup = require('country-code-lookup')
const nigerianStates = require('nigerian-states-and-lgas')


// import * as nigerianStates from "nigerian-states-and-lgas";


// {
//     continent: 'Europe',
//     region: 'Central Europe',
//     country: 'Hungary',
//     capital: 'Budapest',
//     fips: 'HU',
//     iso2: 'HU',
//     iso3: 'HUN',
//     isoNo: '348',
//     internet: 'HU'
//   }

console.log(nigerianStates.all())
const getCountryTelCode = country =>
  country && COUNTRIES.find(({ iso }) => iso === country).prefix;


// console.log(lookup.countries.map(({ country, isoNo }) => ({
//     label: country,
//     value: isoNo
//   })))