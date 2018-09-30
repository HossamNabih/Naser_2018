app.controller("companies_categories", function ($scope, $http) {

  $scope.company_category = {};

  $scope.loadCompanies = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies/all",
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
          $scope.companies = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

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
      url: "/api/companies_categories/all",
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

  $scope.newCompany_Category = function () {
    $scope.error = '';
    $scope.company_category = {
      image_url: '/images/company_category.png'
    };
    site.showModal('#addCompany_CategoryModal');
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
      url: "/api/companies_categories/add",
      data: $scope.company_category
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addCompany_CategoryModal');
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

  $scope.edit = function (company_category) {
    $scope.error = '';
    $scope.company_category = {};
    $scope.view(company_category);
    site.showModal('#updateCompany_CategoryModal');
  };

  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies_categories/update",
      data: $scope.company_category
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateCompany_CategoryModal');
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

  $scope.remove = function (company_category) {
    $scope.error = '';
    $scope.view(company_category);
    $scope.company_category = {};
    site.showModal('#deleteCompany_CategoryModal');
  };

  $scope.view = function (company_category) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies_categories/view",
      data: {
        id: company_category.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.company_category = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.details = function (company_category) {
    $scope.error = '';
    $scope.view(company_category);
    $scope.company_category = {};
    site.showModal('#viewCompany_CategoryModal');
  };

  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies_categories/delete",
      data: {
        id: $scope.company_category.id,
        name: $scope.company_category.name
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteCompany_CategoryModal');
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

  $scope.loadCompanies = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Companies/all",
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
          $scope.companies = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
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

    if ($scope.search.company) {
      where['company.id'] = $scope.search.company.id;
    }
    if ($scope.search.category) {
      where['category.id'] = $scope.search.category.id;
    }

    $scope.loadAll(where);

    site.hideModal('#SearchModal')

  };

  $scope.loadAll();
  $scope.loadCompanies();
  $scope.loadCategories();
});