app.controller("trees_accounting", function ($scope, $http) {

  $scope.tree_account = {};

  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/trees_accounting/upload/image', fd, {
      withCredentials: true,
      headers: {
        'Content-Type': undefined
      },
      uploadEventHandlers: {
        progress: function (e) {
          $scope.uploadStatus = "Uploading : " + Math.round((e.loaded * 100 / e.total)) + " %";
          if (e.loaded == e.total) {
            $scope.uploadStatus = "100%";
          }
        }
      },
      transformRequest: angular.identity
    }).then(function (res) {
      if (res.data && res.data.done) {
        $scope.uploadStatus = "File Uploaded";
        $scope.tree_account.image_url = res.data.image_url;
      }
    }, function (error) {
      $scope.uploadStatus = error;
    });
  };

  $scope.loadParents = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/trees_accounting/all",
      data: {
        select: {id:1,image_url:1,debit:1,credit:1,child:1,'parent.child':1 }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.trees_accounting = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };

  $scope.loadAll = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/trees_accounting/all",
      data: {}
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

  $scope.newTree_Account = function () {
    $scope.tree_account = { image_url: '/images/tree_account.png', is_final : false };
    site.showModal('#addTree_AccountModal');
  };
  $scope.add = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/trees_accounting/add",
      data: $scope.tree_account
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addTree_AccountModal');
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

  $scope.edit = function (tree_account) {
    $scope.tree_account = {};
    $scope.view(tree_account);
    site.showModal('#updateTree_AccountModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/trees_accounting/update",
      data: $scope.tree_account
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateTree_AccountModal');
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

  $scope.remove = function (tree_account) {
    $scope.view(tree_account);
    $scope.tree_account = {};
    site.showModal('#deleteTree_AccountModal');
  };

  $scope.view = function (tree_account) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/trees_accounting/view",
      data: { _id: tree_account._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.tree_account = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (tree_account) {
    $scope.view(tree_account);
    $scope.tree_account = {};
    site.showModal('#viewTree_AccountModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/trees_accounting/delete",
      data: { _id: $scope.tree_account._id, name: $scope.tree_account.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteTree_AccountModal');
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
  $scope.loadAll();
  $scope.loadParents();
});
