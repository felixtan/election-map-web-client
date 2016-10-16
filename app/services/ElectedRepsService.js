// TODO: service countries other than the US

export default {
  // getHeadOfState,
  // getHouseRepresentatives,
  getSenators,
  // getStateExecutives,
  // getStateAssemblyMembers,
  // getStateSenators,
}

import googleCivicInfoConfig from '../config/googleCivicInfo.json'
const representativesResource = googleCivicInfoConfig.representatives
const civicInfoAPIKey = googleCivicInfoConfig.key

// custom api
import api from '../config/api.json'
const apiUrl = api.url

const ocdIdTemplate = "ocd-division/country:us/"
const queryParamsTemplate = `key=${civicInfoAPIKey}&levels=country`

// constants
// levels of gov
const COUNTRY = 'country'
const ADMIN_AREA_1 = 'state'    // TODO: make dict for matching country with appropriate name for this area
const LOCAL = 'local'
// branches of gov
const LEGISLATIVE = 'legislative'
const EXECUTIVE = 'executive'
// roles
const HEAD_OF_GOV = 'headOfGov'
const UPPER = 'upper'
const LOWER = 'lower'



export function getHeadOfState() {

}

export function getHouseReps(state, district) {

}

export function getAllCountryLevelExecutives(country) {
  const url = apiUrl + COUNTRY + '/' + EXECUTIVE + '/' + HEAD_OF_GOV + '/' + country.toLowerCase()
  const req = new Request(url)
  return fetch(req)
}

export function getAllCountryLegislatorsUpper(country) {
  const url = apiUrl + COUNTRY + '/' + LEGISLATIVE + '/' + UPPER + '/' + country.toLowerCase()
  const req = new Request(url)
  return fetch(req)
}

export function getAllCountryLegislatorsLower(country) {
  const url = apiUrl + COUNTRY + '/' + LEGISLATIVE + '/' + LOWER + '/' + country.toLowerCase()
  const req = new Request(url)
  return fetch(req)
}

export function getSenators(state) {
  const ocdId = ocdIdTemplate + `state:${state}`
  const roles = 'legislatorUpperBody'
  const url = createUrl(ocdId, { roles: roles })
  return new Promise(function(resolve, reject) {
    const request = new Request(url)
    fetch(request).then(function(response) {
      if (response.status !== 200) {
        console.log(`Looks like there was a problem. Status Code: + ${response.status}`)
        reject(response)
      }

      response.json().then(function(data) {
        resolve(data)
      })
    }, function(err) {
      console.log(`Looks like there was a problem. ${err}`)
      reject(err)
    })
  })
}

export function getStateAssemblyMembers(state, district) {

}

export function getStateExecutives(state) {

}

export function getStateSenators(state, district) {

}

// Helpers
function createUrl(ocdId, opts = {}) {
  let url = representativesResource + '/' + encodeURIComponent(ocdId) + '?' + queryParamsTemplate
  for (let prop in opts) {
    url += `&${prop}=${opts[prop]}`
  }
  return url
}
