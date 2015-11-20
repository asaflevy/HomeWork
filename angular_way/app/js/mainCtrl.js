var kaminario_app = angular.module('kaminarioApp', []);


(function () {
  "use strict";

  function mainController($scope, $filter,ItemsModel) {
    var vm = this;
    vm.copied_row = {};
    vm.editMode = false;
    vm.markAllItemState = false;
    ItemsModel.getAll().then(function(data){
      vm.tableRows = data;
    });

    /**
     * mark all ui rows
     */
    this.markAll = function () {
      angular.forEach(this.tableRows, function (rowItem) {
        rowItem.is_mark = vm.markAllItemState;
      })
    };

    /**
     * return the number of selected row
     * this logic used in order to disable edit and delete button
     */
    vm.numberOfMarksRows = function () {
      var count = 0;
      angular.forEach(this.tableRows, function (rowItem) {
        count += rowItem.is_mark ? 1 : 0;
      });
      return count;
    };

    /**
     * delete the selected row
     */
    vm.deleteSelectedRow = function () {
      var rowToDelete = $filter('filter')(vm.tableRows, {is_mark: true});
      vm.tableRows = $filter('filter')(vm.tableRows, {is_mark: false});
      angular.forEach(rowToDelete,function(d){
        ItemsModel.deleteItem(d._id);
      })
    };


    vm.editRow = function () {
      vm.editMode = true;
      var selected_row = getMarksRows();
      vm.copied_row = angular.copy(selected_row)[0];
    };


    vm.saveRow = function () {
      if (vm.editMode) {
        angular.extend(getMarksRows()[0], vm.copied_row);
      } else {
        this.tableRows.push(this.copied_row);
      }
      ItemsModel.saveOrUpdate(vm.copied_row);
      $('#myModal').modal('toggle');
    };


    function getMarksRows() {
      return $filter('filter')(vm.tableRows, {is_mark: true});
    }
  };

  kaminario_app.controller('mainCtrl', ['$scope', '$filter','ItemsModel', mainController]);
}());