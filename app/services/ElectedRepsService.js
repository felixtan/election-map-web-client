const config = require('../config/index.js')
const api = process.env.NODE_ENV === 'production' ? config.api.prod : config.api.dev
const representativesUri = api.representatives
const electionsUri = api.elections

// CONSTANTS
// levels of gov
const COUNTRY = 'country'
const ADMIN_AREA_1 = 'state'
const LOCAL = 'local'

// branches of gov
const LEGISLATIVE = 'legislative'
const EXECUTIVE = 'executive'

// roles
const HEAD_OF_GOV = 'headOfGov'
const UPPER = 'upper'
const LOWER = 'lower'


function createReq(url) {
  return new Request(url)
}

export function getAllElectionsForCountry(countryISOA2) {
  const url = electionsUri + countryISOA2
  const req = createReq(url)
  return fetch(req)
}

export function getAllCountryLevelExecutives(country) {
  const url = representativesUri + COUNTRY + '/' + EXECUTIVE + '/' + HEAD_OF_GOV + '/' + country.toLowerCase()
  const req = createReq(url)
  return fetch(req)
}

export function getAllCountryLegislatorsUpper(country) {
  const url = representativesUri + COUNTRY + '/' + LEGISLATIVE + '/' + UPPER + '/' + country.toLowerCase()
  const req = createReq(url)
  return fetch(req)
}

export function getAllCountryLegislatorsLower(country) {
  const url = representativesUri + COUNTRY + '/' + LEGISLATIVE + '/' + LOWER + '/' + country.toLowerCase()
  const req = createReq(url)
  return fetch(req)
}
