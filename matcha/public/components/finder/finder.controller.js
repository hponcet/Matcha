import ol from 'openlayers'

FinderController.$inject = ['currentUser', 'authService', '$scope', '$http', '$rootScope']
function FinderController (currentUser, authService, $scope, $http, $rootScope) {
  const session = authService.getSession()
  $http.post('/api/search/km', {
    id: session.id,
    token: session.token,
    distance: 2000
  })
  .then((users) => {
    $scope.users = users.data
    console.log('users: ', users)
  })

  $scope.currentUser = currentUser

  function convertRad (input) {
    return (Math.PI * input) / 180
  }

  $scope.dist = function distance (lattitudeA, logitudeA, lattitudeB, logitudeB) {
    const R = 6378000 // Rayon de la terre en mètre

    const latA = convertRad(lattitudeA)
    const lonA = convertRad(logitudeA)
    const latB = convertRad(lattitudeB)
    const lonB = convertRad(logitudeB)

    const d = R * (Math.PI / 2 - Math.asin(Math.sin(latB) * Math.sin(latA) + Math.cos(lonB - lonA) * Math.cos(latA) * Math.cos(latA)))
    return Math.floor(d) / 1000 + 'KM'
  }

  const map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'map',
    controls: ol.control.defaults({
      attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
        collapsible: false
      })
    }),
    view: new ol.View({
      center: [0, 0],
      zoom: 2
    })
  })
}

export default FinderController
