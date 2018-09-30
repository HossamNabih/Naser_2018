app.controller("categories_items", function ($scope, $http, $timeout) {

  $scope.category_item = {};
  $scope.search = {};
  $scope.item = { current_count: 0 };


  $scope.addSize = function () {
    if (!$scope.category_item.sizes) {
      $scope.category_item.sizes = [];
    }
    $scope.category_item.sizes.push(Object.assign({}, $scope.item));
    $scope.item = { current_count: 0 };
  };

  $scope.deleteSize = function (itm) {
    if (!$scope.category_item.sizes) {
      $scope.category_item.sizes = [];
    }
    for (let i = 0; i < $scope.category_item.sizes.length; i++) {
      if ($scope.category_item.sizes[i] == itm) {
        $scope.category_item.sizes.splice(i, 1);
      }
    }
  };

  
  $scope.setCategoryCode = function () {
    if ($scope.category_item.category) {
      $scope.category_code = $scope.category_item.category.code;
    }
  };


  $scope.getCategory = function (ev) {
    if (ev.which === 13) {

      $http({
        method: "POST",
        url: "/api/categories/all",
        data: { where: { code: $scope.category_code } }
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data.done) {
            if (response.data.list.length > 0) {
              $scope.category_item.category = response.data.list[0];
            } else {
              $scope.category_item.category = {};
              $('#category_name').focus();
            }

          } else {
            $scope.error = response.data.error;

          }
        },
        function (err) {
          console.log(err);
        }
      );

    }

  };

  $scope.setCompanyCodeSearch = function () {
    if ($scope.search.company) {
      $scope.search.company_code = $scope.search.company.code;
    }
  };


  $scope.getCompanySearch = function (ev, code) {
    if (ev.which === 13) {

      $http({
        method: "POST",
        url: "/api/companies/all",
        data: { where: { code: $scope.search.company_code }, select: { id: 1, name: 1, code: 1 } }
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data.done) {
            if (response.data.list.length > 0) {
              $scope.search.company = response.data.list[0];
            } else {
              $scope.search.company = {};

            }
          } else {
            $scope.error = response.data.error;

          }
        },
        function (err) {
          console.log(err);
        }
      );
    }
  };


  $scope.setCompanyCode = function () {
    if ($scope.category_item.company) {
      $scope.category_item.company_code = $scope.category_item.company.code;
    }
  };

  $scope.getCompany = function (ev, code) {
    if (ev.which === 13) {

      $http({
        method: "POST",
        url: "/api/companies/all",
        data: { where: { code: $scope.category_item.company_code }, select: { id: 1, name: 1, code: 1 } }
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data.done) {
            if (response.data.list.length > 0) {
              $scope.category_item.company = response.data.list[0];
            } else {
              $scope.category_item.company = {};

            }
          } else {
            $scope.error = response.data.error;

          }
        },
        function (err) {
          console.log(err);
        }
      );
    }
  };



  $scope.loadCompanies = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies/all",
      data: {
        select: { id: 1, name: 1}
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
        select: { id: 1, name: 1, code: 1 }
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

  $scope.loadStores = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/stores/all",
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
          $scope.stores = response.data.list;
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

    if ($scope.search.code) {
      where['code'] = $scope.search.code;
    }

    if ($scope.search.name) {
      where['name'] = $scope.search.name;
    }


    if ($scope.search.size) {
      where['sizes.size'] = $scope.search.size;
    }

    if ($scope.search.cost) {
      where['sizes.cost'] = parseFloat($scope.search.cost);
    }

    if ($scope.search.price) {
      where['sizes.price'] = parseFloat($scope.search.price);
    }

    if ($scope.search.company) {
      where['company.id'] = $scope.search.company.id;
    }


    if ($scope.search.current_count) {
      where['sizes.current_count'] = parseFloat($scope.search.current_count);
    }

    if ($scope.search.current_countGt) {
      where['sizes.current_count'] = { $gte: parseFloat($scope.search.current_countGt) };
    }

    if ($scope.search.current_countLt) {
      where['sizes.current_count'] = { $lte: parseFloat($scope.search.current_countLt) };
    }

    if ($scope.search.current_countGt && $scope.search.current_countLt) {
      where['sizes.current_count'] = { $gte: parseFloat($scope.search.current_countGt), $lte: parseFloat($scope.search.current_countLt) };
    }

    $scope.loadAll(where);
  };

  $scope.loadAll = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: "POST",
      url: "/api/categories_items/all",
      data: { where: where }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#Category_ItemSearchModal');
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.newCategory_Item = function () {
    $scope.error = '';
    $scope.category_code = '';
    $scope.category_item = { image_url: '/images/category_item.png', with_discount: false };
    site.showModal('#addCategory_ItemModal');
  };
  $scope.add = function () {

    $scope.error = '';
    const v = site.validated();
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if($scope.category_item.sizes.length > 0){
      $scope.category_item.date = new Date();
      $scope.busy = true;
      $http({
        method: "POST",
        url: "/api/categories_items/add",
        data: $scope.category_item
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data.done) {
            site.hideModal('#addCategory_ItemModal');
            $scope.loadAll();
          } else {
            $scope.error = '##word.error##';
          }
        },
        function (err) {
          console.log(err);
        }
      )
    }else{
      $scope.error =" يجب ادخال الكية و الصنف بشكل صحيح"
    }
   
  };

  $scope.edit = function (category_item) {
    $scope.error = '';
    $scope.category_item = {};
    $scope.view(category_item);
    site.showModal('#updateCategory_ItemModal');
  };
  $scope.update = function () {
    $scope.error = '';
    const v = site.validated();
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/categories_items/update",
      data: $scope.category_item
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateCategory_ItemModal');
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

  $scope.remove = function (category_item) {
    $scope.error = '';
    $scope.view(category_item);
    $scope.category_item = {};
    site.showModal('#deleteCategory_ItemModal');
    $scope.error = "##word.warning_message##"
  };

  $scope.view = function (category_item) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/categories_items/view",
      data: { _id: category_item._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.category_item = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };
  $scope.details = function (category_item) {
    $scope.error = '';
    $scope.view(category_item);
    $scope.category_item = {};
    site.showModal('#viewCategory_ItemModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/categories_items/delete",
      data: { _id: $scope.category_item._id, name: $scope.category_item.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteCategory_ItemModal');
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



  $scope.loadCompanies();
  $scope.loadStores();
  $scope.loadAll();

});
