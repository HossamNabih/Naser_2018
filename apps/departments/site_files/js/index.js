app.controller("departments", function ($scope, $http) {

  $scope.department = {};

  $scope.loadAll = function (where) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/departments/all",
      data: {where:where}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.newdepartment = function () {
    $scope.error = '';
    $scope.department = { image_url: '/images/department.png' };
    site.showModal('#adddepartmentModal');
  };
  $scope.add = function () {

    $scope.error = '';
    const v = site.validated();
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/departments/add",
      data: $scope.department
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#adddepartmentModal');
          $scope.loadAll();
        } else {
          $scope.error = '##word.error##';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.edit = function (department) {
    $scope.error = '';
    $scope.view(department);
    $scope.department = {};
    site.showModal('#updatedepartmentModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/departments/update",
      data: $scope.department
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updatedepartmentModal');
          $scope.loadAll();
        } else {
          $scope.error = '##word.error##';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.remove = function (department) {
    $scope.view(department);
    $scope.department = {};
    site.showModal('#deletedepartmentModal');
  };

  $scope.view = function (department) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/departments/view",
      data: { id: department.id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.department = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };
  $scope.details = function (department) {
    $scope.view(department);
    $scope.department = {};
    site.showModal('#viewdepartmentModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/departments/delete",
      data: { id: $scope.department.id, name: $scope.department.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deletedepartmentModal');
          $scope.loadAll();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.loadDepartments = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Departments/all",
      data: {
        select: {
          id: 1,
          name: 1,
          balance: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.departments = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.searchAll = function () {
    
    let where = {};

    if ($scope.search.name) {
     
      where['name'] = $scope.search.name;
    }

    $scope.loadAll(where);
    
    site.hideModal('#SearchModal')

  };


  $scope.loadAll();
  $scope.loadDepartments();
});
