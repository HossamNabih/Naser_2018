app.controller("sub_categories", function ($scope, $http) {

  $scope.sub_category = {};


  $scope.loadCategories = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/categories/all",
      data: {
        select: {
          id: 1,
          name: 1
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


  $scope.loadAll = function (where) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/sub_categories/all",
      data: {
        where: where
      }
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

  $scope.newSub_Category = function () {
    $scope.error = '';
    $scope.sub_category = {
      image_url: '/images/sub_category.png'
    };
    site.showModal('#addSub_CategoryModal');
  };
  $scope.add = function () {
    $scope.error = '';
    const v = site.validated();
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/sub_categories/add",
      data: $scope.sub_category
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addSub_CategoryModal');
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

  $scope.edit = function (sub_category) {
    $scope.error = '';
    $scope.error = '##word.error##';
    $scope.sub_category = {};
    $scope.view(sub_category);
    site.showModal('#updateSub_CategoryModal');
  };
  $scope.update = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/sub_categories/update",
      data: $scope.sub_category
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateSub_CategoryModal');
          $scope.loadAll();
        } else {
          $scope.error = 'خطأ';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.remove = function (sub_category) {
    $scope.error = '';
    $scope.view(sub_category);
    $scope.sub_category = {};
    site.showModal('#deleteSub_CategoryModal');
  };

  $scope.view = function (sub_category) {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/sub_categories/view",
      data: {
        id: sub_category.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.sub_category = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };
  $scope.details = function (sub_category) {
    $scope.error = '';
    $scope.view(sub_category);
    $scope.sub_category = {};
    site.showModal('#viewSub_CategoryModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/sub_categories/delete",
      data: {
        id: $scope.sub_category.id,
        name: $scope.sub_category.name
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteSub_CategoryModal');
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
  $scope.loadSub_categories = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Sub_categories/all",
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
          $scope.sub_categories = response.data.list;
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

    if ($scope.search.category) {
      where['category.id'] = $scope.search.category.id;

      where['name'] = $scope.search.sub_category;
    }

    $scope.loadAll(where);

    site.hideModal('#SearchModal')

  };

  $scope.loadAll();
  $scope.loadSub_categories();
  $scope.loadCategories();

});