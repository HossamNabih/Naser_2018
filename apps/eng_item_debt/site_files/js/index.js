app.controller("eng_item_debt", function ($scope, $http, $timeout) {

  $scope.eng_item_debt = { discountes: [], taxes: [], details: [] };
  $scope.search = {};

  $scope.item = { sizes: [] };


  $scope.btn = 'note'

  $scope.addTax = function () {
    $scope.eng_item_debt.taxes = $scope.eng_item_debt.taxes || [];
    $scope.eng_item_debt.taxes.push({
      name: $scope.tax.name,
      value: $scope.tax.value
    });
    $scope.tax = {};
    $scope.calc();
  };

  $scope.deleteTax = function (_tx) {
    for (let i = 0; i < $scope.eng_item_debt.taxes.length; i++) {
      let tx = $scope.eng_item_debt.taxes[i];
      if (tx.name == _tx.name && tx.value == _tx.value) {
        $scope.eng_item_debt.taxes.splice(i, 1);
      }
    }
    $scope.calc();
  };

  $scope.addDiscount = function () {
    $scope.eng_item_debt.discountes = $scope.eng_item_debt.discountes || [];
    $scope.eng_item_debt.discountes.push({
      name: $scope.discount.name,
      value: $scope.discount.value,
      type: $scope.discount.type
    });
    $scope.discount = {};
    $scope.calc();
  };

  $scope.deleteDiscount = function (_ds) {
    for (let i = 0; i < $scope.eng_item_debt.discountes.length; i++) {
      let ds = $scope.eng_item_debt.discountes[i];
      if (ds.name == _ds.name && ds.value == _ds.value && ds.type == _ds.type) {
        $scope.eng_item_debt.discountes.splice(i, 1);
      }
    }
    $scope.calc();
  };

  $scope.calc = function () {
    $scope.eng_item_debt.total_value = 0;
    $scope.eng_item_debt.net_value = 0;


    $scope.eng_item_debt.items.forEach(itm => {
      $scope.eng_item_debt.total_value += parseFloat(itm.total);
    
    });

    $scope.eng_item_debt.total_tax = 0;
    $scope.eng_item_debt.taxes.forEach(tx => {
      $scope.eng_item_debt.total_tax += $scope.eng_item_debt.total_value * parseFloat(tx.value) / 100;
    });

    $scope.eng_item_debt.total_discount = 0;
    $scope.eng_item_debt.discountes.forEach(ds => {
      if (ds.type == '%') {
        $scope.eng_item_debt.total_discount += $scope.eng_item_debt.total_value * parseFloat(ds.value) / 100;
      } else {
        $scope.eng_item_debt.total_discount += parseFloat(ds.value);
      }
    });

    $scope.eng_item_debt.net_value = $scope.eng_item_debt.total_value + $scope.eng_item_debt.total_tax - $scope.eng_item_debt.total_discount;
  };

  $scope.deleteRow = function (itm) {
    if (!$scope.eng_item_debt.items) {
      $scope.eng_item_debt.items = [];
    }
    for (let i = 0; i < $scope.eng_item_debt.items.length; i++) {
      if ($scope.eng_item_debt.items[i].code == itm.code && $scope.eng_item_debt.items[i].size == itm.size) {
        $scope.eng_item_debt.items.splice(i, 1);
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
      url: "/api/eng_item_debt/all",
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
          $scope.eng_item_debt = response.data.list;
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


    $scope.loadAll(where);
    
  };

$scope.loadAll = function (where) {
    $scope.list = {};
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/eng_item_debt/all",
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
    $scope.eng_item_debt = {
      image_url: '/images/eng_item_debt.png',
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
    if($scope.eng_item_debt.items.length > 0  ){
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/eng_item_debt/add",
      data: $scope.eng_item_debt
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

  

  $scope.edit = function (eng_item_debt) {
    $scope.error = '';
    
    
    $scope.view(eng_item_debt);
    $scope.eng_item_debt = {};
   
    site.showModal('#updateEngItemDebtModal');
   

  };
  
  $scope.editnote = function (eng_item_debt) {
    $scope.error = '';
    $scope.view(eng_item_debt);
    $scope.eng_item_debt = {};

    site.showModal('#updateEngItemDebtNotDeliveredModal');
    
  };

  $scope.update = function () {
    $scope.error = '';

   
   
    if ($scope.eng_item_debt.length <= 0) {
      document.getElementById("req").setAttribute("v" , "r");
      return;
    }
    
      if( $scope.eng_item_debt.store){
        $scope.eng_item_debt.deliver_status = true
      }else{
      $scope.eng_item_debt.deliver_status = false
      
    }
    
 
   
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/eng_item_debt/update",
      data: $scope.eng_item_debt
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateEngItemDebtModal');
          site.hideModal('#updateEngItemDebtNotDeliveredModal ');

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

 
  $scope.remove = function (eng_item_debt) {
    $scope.error = '';
    $scope.view(eng_item_debt);
    $scope.eng_item_debt = {};
    site.showModal('#deleteStoreOutModal');
  };

  $scope.view = function (eng_item_debt) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/eng_item_debt/view",
      data: {
        _id: eng_item_debt._id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          response.data.doc.date = new Date(response.data.doc.date);
          $scope.eng_item_debt = response.data.doc;
      
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.details = function (eng_item_debt) {
    $scope.error = '';
    $scope.view(eng_item_debt);
    $scope.eng_item_debt = {};
    site.showModal('#viewStoreOutModal');
  };

  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/eng_item_debt/delete",
      data: {
        id: $scope.eng_item_debt.id,
        _id: $scope.eng_item_debt._id,
        name: $scope.eng_item_debt.name
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
        $scope.eng_item_debt.items.push({
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