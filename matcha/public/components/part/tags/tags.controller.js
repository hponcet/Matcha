import _ from 'lodash'

const strncmp = (str1, str2, lgth) => {
  var s1 = (str1 + '').substr(0, lgth)
  var s2 = (str2 + '').substr(0, lgth)

  return ((s1 === s2) ? 0 : ((s1 > s2) ? 1 : -1))
}

const tagsController = ($scope, $rootScope, $http, authService) => {
  if ($rootScope.session.authentified === true) {
    $scope.currentUser = authService.getCurrentUser()
  }

  $http.get('/api/tags')
  .then((tags) => {
    $scope.allTags = tags.data
  })
  $scope.propositions = []

  $scope.delTag = (id) => {
    $scope.user.tags.splice(id, 1)
  }

  $scope.addTag = (tag) => {
    if (!$scope.user.tags) {
      $scope.user.tags = []
    }
    $scope.user.tags.push(tag)
    $scope.searchTag = ''
    $scope.propositions = []
  }

  $scope.compTags = (search) => {
    $scope.propositions = []
    if (search) {
      _.map($scope.allTags, (tag) => {
        if (strncmp(search.toLowerCase(), tag.name.toLowerCase(), search.length) === 0) {
          $scope.propositions.push(tag)
        }
      })
    } else {
      $scope.propositions = []
    }
  }

  $scope.addNewTag = (tagName) => {
    if (tagName) {
      $scope.addTag({
        name: _.capitalize(tagName)
      })
    }
  }
}

tagsController.$inject = ['$scope', '$rootScope', '$http', 'authService']

export default tagsController
