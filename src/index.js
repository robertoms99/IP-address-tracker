import { ABSOLUTE_ROUTE_API_IPIFY } from './settings/constants.js'
import './utils/lib/index.js'

const init = () => {
  const renderAddressInformation = addressInformation => {
    informationAddress.textContent = addressInformation.ip
    const location = addressInformation.location
    informationLocation.textContent = location.city || location.country
    informationTimezone.textContent = 'UTC ' + location.timezone
    informationIsp.textContent = addressInformation.isp
    changeCoordsPosition({ lat: location.lat, lng: location.lng })
  }

  const fetchToApi = resource => {
    const xhr = new window.XMLHttpRequest()
    xhr.open('GET', resource)
    xhr.responseType = 'json'
    xhr
      .send()
      .then(renderAddressInformation)
      .catch(console.log)
  }

  const fetchAsIp = ip => {
    const resource = new URL(ABSOLUTE_ROUTE_API_IPIFY)
    resource.searchParams.append('ipAddress', ip)
    fetchToApi(resource)
  }

  const fetchAsDomain = domainName => {
    const resource = new URL(ABSOLUTE_ROUTE_API_IPIFY)
    resource.searchParams.append('domain', domainName)
    fetchToApi(resource)
  }

  const handleSubmit = submitEvent => {
    submitEvent.preventDefault()
    const searchControlValue = searchControl.value
    if (!searchControlValue.equals('')) {
      if (ipRegex.test(searchControlValue)) {
        fetchAsIp(searchControlValue)
        return
      }
      fetchAsDomain(searchControlValue)
    }
  }

  let marker = null
  let map = null
  const renderMap = ({ lat, lng }) => {
    map = L.map('address-geolocation')
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
    const customMarkerIcon = L.icon({
      iconUrl: '/images/icon-location.svg',
      iconSize: [40, 50] // size of the icon
    })
    marker = L.marker([lat, lng], { icon: customMarkerIcon })
    marker.addTo(map)
  }

  const changeCoordsPosition = coords => {
    marker?.setLatLng(coords)
    map?.setView(coords, 13)
  }

  renderMap({ lat: 51.5, lng: -0.09 })
  const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  fetchToApi(ABSOLUTE_ROUTE_API_IPIFY)
  const addressSearchForm = document.forms['address-form']
  const searchControl = addressSearchForm.elements['address-search']
  const informationAddress = document.querySelector(
    '[data-information-address]'
  )
  const informationLocation = document.querySelector(
    '[data-information-location]'
  )
  const informationIsp = document.querySelector('[data-information-isp]')
  const informationTimezone = document.querySelector(
    '[data-information-timezone]'
  )
  addressSearchForm.addEventListener('submit', handleSubmit)
}

document.addEventListener('DOMContentLoaded', init)
