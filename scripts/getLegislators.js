/*
  Purpose: Query Google Civic Info API for all legislators and store
  in app/fixtures.
*/

const Promise = require('bluebird')
const https = require('https')
const fs = require('fs')
const statesCodes = require('../app/fixtures/statesFIPSToLetterCodes.js')
const statesCodesArr = Object.keys(statesCodes).map(k => { return statesCodes[k] });
const googleCivicInfoConfig = require('../app/config/googleCivicInfo.json')
const representativesResourceUrl = googleCivicInfoConfig.representatives
const API_KEY = googleCivicInfoConfig.key

const ocdIdTemplate = "ocd-division/country:us/"
const queryParamsTemplate = `key=${API_KEY}&levels=country`


module.exports = {
  getAndStoreSenators
}

/*
  ocd-division -> result
  ----------------------
  country:us -> president, vp
  country:us/state:<foo> -> senators, governor, lt. governor, att general, state comptroller
  country:us/state:<foo>/cd:<bar> -> congressperson
  country:us/state:<foo>/s
*/


function countStates() {
  let c = 0
  for (let prop in states) {
      c++
  }

  // should be 56 (50 states + 6 territories with reps)
  return c
}

/*
  state: two-letter lowercase state abbreviation (ex. ny, nj)
*/
function getSenators(state) {
  const ocdId = ocdIdTemplate + `state:${state.toLowerCase()}`
  const url = representativesResourceUrl + '/' + encodeURIComponent(ocdId) + '?' + queryParamsTemplate
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode == 200) {
        res.setEncoding('utf8')
        res.on('data', (data) => {
          resolve(data)
        })
      }
    }).on('error', (err) => {
      console.error(err)
      throw err
    })
  })
}

/*
  states: array containing states abbreviations
*/
function getAndStoreSenators(states) {
  let counter = 0
  fs.appendFileSync('senators.json', 'module.exports = {')
  states.map((state, index) => {
    getSenators(state).then(function(data) {
      const entry = `${state}: ${JSON.stringify(data)}}`

      if (counter === states.length-1) {
        console.log(data)
        fs.appendFileSync('senators.json', entry + '}')
      } else {
        fs.appendFileSync('senators.json', entry + ',')
      }

      counter++
    }, function(err) {
      throw err
    })
  })
}

const foo = ['ny', 'nj', 'ma']
getAndStoreSenators(foo)
console.log(`getting for ${foo}`)
