app.controller("damages", function ($scope, $http) {

  $scope.damage = {};

  $scope.loadCategories = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/categories/all",
      data: {
        select: { id: 1, name: 1 }
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

  $scope.loadSub_Categories = function (category) {
    var where = {};

    if (typeof category === 'string') {
      category = JSON.parse(category);
    } else {
      category = category || {};
    }
    if (category && category.id) {
      where = {
        'category.id': category.id

      };

    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/sub_categories/all",
      data: {
        where: where,
        select: { id: 1, name: 1 }
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

  $scope.loadAll = function (where) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/damages/all",
      data: { 
        select: { id: 1, name: 1, image_url: 1, 'category.id': 1, 'category.name': 1, 'sub_category.id': 1, 'sub_category.name': 1 },
        where:where
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

  $scope.newDamage = function () {
    $scope.error = '';
    $scope.damage = { image_url: '/images/damage.png' };
    site.showModal('#addDamageModal');
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
      url: "/api/damages/add",
      data: $scope.damage
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addDamageModal');
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

  $scope.edit = function (damage) {
    $scope.error = '';
    $scope.view(damage);
    $scope.damage = {};
    site.showModal('#updateDamageModal');
  };

  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/damages/update",
      data: $scope.damage
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateDamageModal');
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

  $scope.remove = function (damage) {
    $scope.view(damage);
    $scope.damage = {};
    site.showModal('#deleteDamageModal');
  };

  $scope.view = function (damage) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/damages/view",
      data: { id: damage.id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.damage = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };

  $scope.details = function (damage) {
    $scope.view(damage);
    $scope.damage = {};
    site.showModal('#viewDamageModal');
  };

  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/damages/delete",
      data: { id: $scope.damage.id, name: $scope.damage.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteDamageModal');
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

  $scope.loadDamages = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Damages/all",
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
          $scope.damages = response.data.list;
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
    }
    if ($scope.search.sub_category) {
      where['sub_category.id'] = $scope.search.sub_category.id;
    }
    
    where['name'] = $scope.search.damage;

    $scope.loadAll(where);

    site.hideModal('#SearchModal')

  };

  $scope.loadAll();
  $scope.loadDamages();
  $scope.loadCategories();
  $scope.loadSub_Categories();
});
