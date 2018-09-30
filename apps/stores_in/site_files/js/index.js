app.controller("stores_in", function ($scope, $http, $timeout) {

  $scope.store_in = {discountes : [] , taxes : [] , details : []};
  $scope.search = {};
  $scope.item = { sizes: [] };

  $scope.addTax = function () {
    $scope.store_in.taxes = $scope.store_in.taxes || [];
    $scope.store_in.taxes.push({
      name: $scope.tax.name,
      value: $scope.tax.value
    });
    $scope.tax = {};
    $scope.calc();
  };
  $scope.deleteTax = function (_tx) {
    for (let i = 0; i < $scope.store_in.taxes.length; i++) {
      let tx = $scope.store_in.taxes[i];
      if (tx.name == _tx.name && tx.value == _tx.value) {
        $scope.store_in.taxes.splice(i, 1);
      }
    }
    $scope.calc();
  };
  $scope.addDiscount = function () {
    $scope.store_in.discountes = $scope.store_in.discountes || [];
    $scope.store_in.discountes.push({
      name: $scope.discount.name,
      value: $scope.discount.value,
      type: $scope.discount.type
    });
    $scope.discount = {};
    $scope.calc();
  };
  $scope.deleteDiscount = function (_ds) {
    for (let i = 0; i < $scope.store_in.discountes.length; i++) {
      let ds = $scope.store_in.discountes[i];
      if (ds.name == _ds.name && ds.value == _ds.value && ds.type == _ds.type) {
        $scope.store_in.discountes.splice(i, 1);
      }
    }
    $scope.calc();
  };
  $scope.calc = function () {
    $scope.store_in.total_value = 0;
    $scope.store_in.net_value = 0;


    $scope.store_in.items.forEach(itm => {
      $scope.store_in.total_value += parseFloat(itm.total);
    });

    $scope.store_in.total_tax = 0;
    $scope.store_in.taxes.forEach(tx => {
      $scope.store_in.total_tax += $scope.store_in.total_value * parseFloat(tx.value) / 100;
    });

    $scope.store_in.total_discount = 0;
    $scope.store_in.discountes.forEach(ds => {
      if (ds.type == '%') {
        $scope.store_in.total_discount += $scope.store_in.total_value * parseFloat(ds.value) / 100;
      } else {
        $scope.store_in.total_discount += parseFloat(ds.value);
      }
    });

    $scope.store_in.net_value = $scope.store_in.total_value + $scope.store_in.total_tax - $scope.store_in.total_discount;
  };
  $scope.deleteRow = function (itm) {
    if (!$scope.store_in.items) {
      $scope.store_in.items = [];
    }
    for (let i = 0; i < $scope.store_in.items.length; i++) {
      if ($scope.store_in.items[i].code == itm.code && $scope.store_in.items[i].size == itm.size) {
        $scope.store_in.items.splice(i, 1);
      }
    }
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
  $scope.loadSafes = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/safes/all",
      data: {
        select: {
          id: 1,
          name: 1,
          number :1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.safes = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  $scope.loadTax_Types = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tax_types/all",
      data: {
        select: {
          id: 1,
          name: 1,
          value: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.tax_types = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  $scope.loadDiscount_Types = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/discount_types/all",
      data: {
        select: {}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.discount_types = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
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
  $scope.loadStores_In = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/stores_in/all",
      data: {
        select: {
          id: 1,
          name: 1,
          items: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.stores_in = response.data.list;
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

    if ($scope.search.number) {
      where['number'] = $scope.search.number;
    }

    if ($scope.search.date) {
      where['date'] = $scope.search.date;
    }

    if ($scope.search.dateFrom) {
      where['date_from'] = $scope.search.dateFrom;
    }

    if ($scope.search.dateTo) {
      where['date_to'] = $scope.search.dateTo;
    }

    if ($scope.search.company && $scope.search.company.id) {
      where['company.id'] = $scope.search.company.id;
    }


    if ($scope.search.total_valueGt) {
      where['total_value'] = {
        $gte: parseFloat($scope.search.total_valueGt)
      };
    }

    if ($scope.search.total_valueLt) {
      where['total_value'] = {
        $lte: parseFloat($scope.search.total_valueLt)
      };
    }

    if ($scope.search.total_valueGt && $scope.search.total_valueLt) {
      where['total_value'] = {
        $gte: parseFloat($scope.search.total_valueGt),
        $lte: parseFloat($scope.search.total_valueLt)
      };
    }


    $scope.loadAll(where);
  };
  $scope.loadAll = function (where) {
    $scope.list = {};
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/stores_in/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#StoresInSearchModal');
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  $scope.newStore_In = function () {
    $scope.error = '';
    $scope.code = '';
    $scope.store_in = {
      image_url: '/images/store_in.png',
      items: [],
      discountes : [] , taxes : [] , details : [],
      date: new Date(),
      supply_date : new Date()
    };
    site.showModal('#addStore_InModal');
  };
  $scope.add = function () {
    $scope.error = '';
    const v = site.validated();
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if($scope.store_in.items.length > 0  ){
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/stores_in/add",
      data: $scope.store_in
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addStore_InModal');
          $scope.loadAll();
          
        } else {
          $scope.error = '##word.error##';
        }
      },
      function (err) {
        console.log(err);
      }
    )}else{
      $scope.error = "يجب ادخال الكمية";
      return;
    }
  };
  $scope.remove = function (store_in) {
    $scope.error = '';
    $scope.view(store_in);
    $scope.store_in = {};
    site.showModal('#deleteStore_InModal');
  };
  $scope.view = function (store_in) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/stores_in/view",
      data: {
        _id: store_in._id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          response.data.doc.date = new Date(response.data.doc.date);
          $scope.store_in = response.data.doc;
          $scope.setCode();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };
  $scope.details = function (store_in) {
    $scope.error = '';
    $scope.view(store_in);
    $scope.store_in = {};
    site.showModal('#viewStore_InModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/stores_in/delete",
      data: {
        _id: $scope.store_in._id,
        name: $scope.store_in.name
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteStore_InModal');
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
  $scope.addToItems = function () {
    $scope.item.sizes.forEach(s => {
      if (s.count > 0) {
        $scope.store_in.items.push({
         image_url : $scope.item.image_url,
          code: $scope.item.code,
          name: $scope.item.name,
          size: s.size,
          count: s.count,
          cost: s.cost,
          price: s.price,
          total: s.count * s.cost
        });
      }
    });

    $scope.calc();
    $scope.item = {
      sizes: []
    }
  };
  $scope.addToSizes = function () {
    $scope.item.sizes = $scope.item.sizes || [];
    $scope.item.sizes.push({
      $new: true,
      size: $scope.size_name,
      count: 0,
      cost: 0,
      price: 0,
      total: 0
    });
    $scope.size_name = '';
  };
  $scope.getItem = function (ev) {
    if (ev.which === 13) {
      $scope.item.section = {};
      $scope.item.category = {};

      $http({
        method: "POST",
        url: "/api/categories_items/all",
        data: {
          where: {
            code: $scope.item.code,
            name : $scope.item.name
          }
        }
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data.done) {
            if (response.data.list.length > 0) {
              $('#public_count').focus();
              $scope.item = response.data.list[0];

              console.log($scope.item )
            } else {
              $scope.item = {
                sizes: [],
                code: $scope.item.code,
                name: $scope.item.name,
                total:$scope.item.total
              };
              $('#item_name').focus();
            }
          } else {
            $scope.error = response.data.error;
            $scope.item = {
              sizes: []
            };
          }
        },
        function (err) {
          console.log(err);
        }
      );
    }
  };


  $scope.loadStores_In();
  $scope.loadCompanies();
  $scope.loadStores();
  $scope.loadTax_Types();
  $scope.loadDiscount_Types();
  $scope.loadAll();
  $scope.loadSafes();
});