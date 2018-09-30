app.controller("item_transaction", function ($scope, $http, $timeout) {

  $scope.search = {};
  $scope.transaction_types=[
  {name:"##word.item_transaction_type_in##" , id:1, type:'in'},
  {name:"##word.item_transaction_type_out##" , id:2 , type:'out'},
  ]

  $scope.loadCompanies = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Companies/all",
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


  $scope.searchAll = function () {
    let where = {};


    if ($scope.search.code) {
      where['code'] = $scope.search.code;
    }

    if ($scope.search.name) {
      where['name'] = $scope.search.name;
    }


    if ($scope.search.size) {
      where['size'] = $scope.search.size;
    }

    if ($scope.search.cost) {
      where['cost'] = parseFloat($scope.search.cost);
    }


    if ($scope.search.count) {
      where['count'] = parseFloat($scope.search.count);
    }

    if ($scope.search.price) {
      where['price'] = parseFloat($scope.search.price);
    }

    if ($scope.search.transaction_type) {
      where['transaction_type'] = $scope.search.transaction_type.type;
      console.log($scope.search.transaction_type.type);
    }

    if ($scope.search.company) {
      where['Company.id'] = $scope.search.company.id;
    }

    if ($scope.search.current_count) {
      where['current_count'] = parseFloat($scope.search.current_count);
    }

    if ($scope.search.current_countGt) {
      where['current_count'] = {
        $gte: parseFloat($scope.search.current_countGt)
      };
    }


    if ($scope.search.current_countLt) {
      where['current_count'] = {
        $lte: parseFloat($scope.search.current_countLt)
      };
    }

    if ($scope.search.date) {
      where['date'] = $scope.search.date;
    }

    if ($scope.search.current_countGt && $scope.search.current_countLt) {
      where['current_count'] = {
        $gte: parseFloat($scope.search.current_countGt),
        $lte: parseFloat($scope.search.current_countLt)
      };
    }

    $scope.loadAll(where);
  };

  $scope.loadAll = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: "POST",
      url: "/api/item_transaction/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#itemTransactionSearchModal');
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.details = function (item_transaction) {
    $scope.error = '';
    $scope.view(item_transaction);
    $scope.item_transaction = {};
    site.showModal('#viewItemTranactionModal');
  };

  $scope.view = function (item_transaction) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/item_transaction/view",
      data: {
        _id: item_transaction._id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.item_transaction = response.data.doc;
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
  $scope.loadAll();

});