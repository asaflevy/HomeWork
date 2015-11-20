angular.module('kaminarioApp').service('ItemsModel', function ($http, $q) {
  var service = this;

  /**
   * return all the row Item from kaminario DB
   * @returns {*}
   */
  service.getAll = function () {
    var dfd = $q.defer();
    $http.get('/api/rowItems').then(function (response) {
      if (response.data) {
        dfd.resolve(response.data);
      } else {
        dfd.resolve(false);
      }
    });
    return dfd.promise;
  };

  service.deleteItem = function (rowId) {
    var dfd = $q.defer();
    $http.delete('/api/rowItems/'+ rowId).then(function (response) {
      if (response.data) {
        dfd.resolve(response.data);
      } else {
        dfd.resolve(false);
      }
    });
    return dfd.promise;
  }

  service.saveOrUpdate = function (rowItem) {
    var dfd = $q.defer();
    $http.post('/api/rowItems',rowItem).then(function (response) {
      if (response.data.success) {
        dfd.resolve(true);
      } else {
        dfd.resolve(false);
      }
    });
    return dfd.promise;
  }

  service.saveOrUpdate = function (rowItem) {
    var dfd = $q.defer();
    $http.post('/api/rowItems',rowItem).then(function (response) {
      if (response.data.success) {
        dfd.resolve(true);
      } else {
        dfd.resolve(false);
      }
    });
    return dfd.promise;
  }

});
