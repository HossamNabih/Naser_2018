app.controller("eng_item_list", function ($scope, $http, $timeout) {

  $scope.eng_item_list = { discountes: [], taxes: [], details: [] };
  $scope.search = {};

  $scope.item = { sizes: [] };

  $scope.addTax = function () {
    $scope.eng_item_list.taxes = $scope.eng_item_list.taxes || [];
    $scope.eng_item_list.taxes.push({
      name: $scope.tax.name,
      value: $scope.tax.value
    });
    $scope.tax = {};
    $scope.calc();
  };

  $scope.deleteTax = function (_tx) {
    for (let i = 0; i < $scope.eng_item_list.taxes.length; i++) {
      let tx = $scope.eng_item_list.taxes[i];
      if (tx.name == _tx.name && tx.value == _tx.value) {
        $scope.eng_item_list.taxes.splice(i, 1);
      }
    }
    $scope.calc();
  };

  $scope.addDiscount = function () {
    $scope.eng_item_list.discountes = $scope.eng_item_list.discountes || [];
    $scope.eng_item_list.discountes.push({
      name: $scope.discount.name,
      value: $scope.discount.value,
      type: $scope.discount.type
    });
    $scope.discount = {};
    $scope.calc();
  };

  $scope.deleteDiscount = function (_ds) {
    for (let i = 0; i < $scope.eng_item_list.discountes.length; i++) {
      let ds = $scope.eng_item_list.discountes[i];
      if (ds.name == _ds.name && ds.value == _ds.value && ds.type == _ds.type) {
        $scope.eng_item_list.discountes.splice(i, 1);
      }
    }
    $scope.calc();
  };

  $scope.calc = function () {
    $scope.eng_item_list.total_value = 0;
    $scope.eng_item_list.net_value = 0;


    $scope.eng_item_list.items.forEach(itm => {
      $scope.eng_item_list.total_value += parseFloat(itm.total);
    
    });

    $scope.eng_item_list.total_tax = 0;
    $scope.eng_item_list.taxes.forEach(tx => {
      $scope.eng_item_list.total_tax += $scope.eng_item_list.total_value * parseFloat(tx.value) / 100;
    });

    $scope.eng_item_list.total_discount = 0;
    $scope.eng_item_list.discountes.forEach(ds => {
      if (ds.type == '%') {
        $scope.eng_item_list.total_discount += $scope.eng_item_list.total_value * parseFloat(ds.value) / 100;
      } else {
        $scope.eng_item_list.total_discount += parseFloat(ds.value);
      }
    });

    $scope.eng_item_list.net_value = $scope.eng_item_list.total_value + $scope.eng_item_list.total_tax - $scope.eng_item_list.total_discount;
  };

  $scope.deleteRow = function (itm) {
    if (!$scope.eng_item_list.items) {
      $scope.eng_item_list.items = [];
    }
    for (let i = 0; i < $scope.eng_item_list.items.length; i++) {
      if ($scope.eng_item_list.items[i].code == itm.code && $scope.eng_item_list.items[i].size == itm.size) {
        $scope.eng_item_list.items.splice(i, 1);
      }
    }
  };

  $scope.loadEng = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/all",
      data: {
        select: {
          name: 1,
          id: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.Engs = response.data.list;
          console.log($scope.Engs);
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

  $scope.loadStoresOut = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/eng_item_list/all",
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
          $scope.eng_item_list = response.data.list;
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
    if ($scope.search.store) {
      where['store.id'] = $scope.search.store.id;
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

    if ($scope.search.name) {
      where['name'] = $scope.search.name;
    }
    if ($scope.search.size) {
      where['size'] = $scope.search.size;
    }
    if($scope.search.eng){
      where['eng.name'] = $scope.search.eng.name;
    }
/*
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
*/

    $scope.loadAll(where);
    
  };

$scope.loadAll = function (where) {
    $scope.list = {};
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/eng_item_list/all",
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
          console.log(response); 
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };



  $scope.newStore_Out = function () {
    $scope.error = '';
    $scope.code = '';
    $scope.eng_item_list = {
      image_url: '/images/eng_item_list.png',
      items: [],
      discountes: [],
      taxes: [],
      details: [],
      date: new Date()
    };
    site.showModal('#addStoreOutModal');
  };

  $scope.add = function () {


    $scope.error = '';
    const v = site.validated();
    if (!v.ok ) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if($scope.eng_item_list.items.length > 0  ){
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/eng_item_list/add",
      data: $scope.eng_item_list
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addStoreOutModal');
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
      $scope.error = "يجب ادخال كمية";
      return;
    }
    
  };

  

  $scope.edit = function (eng_item_list) {
    $scope.error = '';
    $scope.view(eng_item_list);
    $scope.eng_item_list = {};
    site.showModal('#updateStoreOutModal');
  };

  $scope.update = function () {
    $scope.error = '';
    const v = site.validated();
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if ($scope.eng_item_list.length <= 0) {
      document.getElementById("req").setAttribute("v" , "r");
      return;
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/eng_item_list/update",
      data: $scope.eng_item_list
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateStoreOutModal');
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

  $scope.remove = function (eng_item_list) {
    $scope.error = '';
    $scope.view(eng_item_list);
    $scope.eng_item_list = {};
    site.showModal('#deleteStoreOutModal');
  };

  $scope.view = function (eng_item_list) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/eng_item_list/view",
      data: {
        _id: eng_item_list._id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          response.data.doc.date = new Date(response.data.doc.date);
          $scope.eng_item_list = response.data.doc;
      
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.details = function (eng_item_list) {
    $scope.error = '';
    $scope.view(eng_item_list);
    $scope.eng_item_list = {};
    site.showModal('#viewStoreOutModal');
  };

  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/eng_item_list/delete",
      data: {
        id: $scope.eng_item_list.id,
        _id: $scope.eng_item_list._id,
        name: $scope.eng_item_list.name
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteStoreOutModal');
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
        $scope.eng_item_list.items.push({
          image_url: $scope.item.image_url,
          code: $scope.item.code,
          name: $scope.item.name,
          size: s.size,
          count: s.count,
          cost: s.cost,
          price: s.price,
          total: s.total,
         
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


      $http({
        method: "POST",
        url: "/api/categories_items/all",
        data: {
          where: {
            code: $scope.item.code,
            name: $scope.item.name
          }
        }
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data.done) {
            if (response.data.list.length > 0) {
              $('#public_count').focus();
              $scope.item = response.data.list[0];
              console.log($scope.item)
              
            } else {
              $scope.item = {
                sizes: [],
                code: $scope.item.code,
                name: $scope.item.name
          
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

  $scope.loadStoresOut();
  $scope.loadEng();
  $scope.loadCompanies();
  $scope.loadStores();
  $scope.loadTax_Types();
  $scope.loadDiscount_Types();
  $scope.loadAll();
});