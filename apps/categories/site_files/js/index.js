app.controller("categories", function ($scope, $http) {

  $scope.category = {};


  $scope.loadAll = function (where) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/categories/all",
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

  $scope.newCategory = function () {
    $scope.error = '';
    $scope.category = {
      image_url: '/images/category.png'
    };
    site.showModal('#addCategoryModal');
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
      url: "/api/categories/add",
      data: $scope.category
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addCategoryModal');
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

  $scope.edit = function (category) {
    $scope.error = '';
    $scope.category = {};
    $scope.view(category);
    site.showModal('#updateCategoryModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/categories/update",
      data: $scope.category
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateCategoryModal');
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

  $scope.remove = function (category) {
    $scope.view(category);
    $scope.category = {};
    site.showModal('#deleteCategoryModal');
  };

  $scope.view = function (category) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/categories/view",
      data: {
        id: category.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.category = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };
  $scope.details = function (category) {
    $scope.view(category);
    $scope.category = {};
    site.showModal('#viewCategoryModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/categories/delete",
      data: {
        id: $scope.category.id,
        name: $scope.category.name
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteCategoryModal');
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


  $scope.loadCategories = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Categories/all",
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
          $scope.categories = response.data.list;
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
  $scope.loadCategories();

});