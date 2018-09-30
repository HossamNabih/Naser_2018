app.controller("unemployees_mobiles", function ($scope, $http) {

  $scope.unemployee_mobile = {};

  /* upload files */

  $scope.uploadFile = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/unemployee_mobile/upload/file', fd, {
      withCredentials: true,
      headers: {
        'Content-Type': undefined
      },
      uploadEventHandlers: {
        progress: function (e) {
          $scope.fileStatus = "Uploading : " + Math.round((e.loaded * 100 / e.total)) + " %";
          if (e.loaded == e.total) {
            $scope.fileStatus = "100%";
          }
        }
      },
      transformRequest: angular.identity
    }).then(function (res) {
      if (res.data && res.data.done) {
        $scope.fileStatus = "File Uploaded";
        $scope.unemployee_mobile.files.push({
          url: res.data.file_url,
          name: $scope.fileName || res.data.file_name
        });
        $scope.fileName = '';
      }
    }, function (error) {
      $scope.fileStatus = error;
    });
  };

  $scope.deleteFile = function (file) {
    for (let i = 0; i < $scope.unemployee_mobile.files.length; i++) {
      let f = $scope.unemployee_mobile.files[i];
      if (f.url === file.url) {
        $scope.unemployee_mobile.files.splice(i, 1);
        return;
      }
    }
  };



  /* end*/



  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/unemployees_mobiles/upload/image', fd, {
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
        $scope.unemployee_mobile.image_url = res.data.image_url;
      }
    }, function (error) {
      $scope.uploadStatus = error;
    });
  };

  $scope.uploadFile = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/unemployees_mobiles/upload/file', fd, {
      withCredentials: true,
      headers: {
        'Content-Type': undefined
      },
      uploadEventHandlers: {
        progress: function (e) {
          $scope.fileStatus = "Uploading : " + Math.round((e.loaded * 100 / e.total)) + " %";
          if (e.loaded == e.total) {
            $scope.fileStatus = "100%";
          }
        }
      },
      transformRequest: angular.identity
    }).then(function (res) {
      if (res.data && res.data.done) {
        $scope.fileStatus = "File Uploaded";
        $scope.unemployee_mobile.files.push({
          url: res.data.file_url,
          name: $scope.fileName
        });
        $scope.fileName = '';
      }
    }, function (error) {
      $scope.fileStatus = error;
    });
  };


  $scope.loadUnEmployees = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/unemployees/all",
      data: {
        select: { id: 1, name: 1 }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.unemployees = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };


  $scope.loadMobiles_Slides = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/mobiles_slides/all",
      data: {
        select: { id: 1, name: 1, number: 1, value: 1, slide_name: 1 }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.mobiles_slides = response.data.list;
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
      url: "/api/unemployees_mobiles/all",
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

  $scope.newUnEmployee_Mobile = function () {
    $scope.error = '';
    $scope.unemployee_mobile = { image_url: '/images/unemployee_mobile.png' };
    site.showModal('#addUnEmployee_MobileModal');
  };
  $scope.add = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/unemployees_mobiles/add",
      data: $scope.unemployee_mobile
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addUnEmployee_MobileModal');
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

  $scope.edit = function (unemployee_mobile) {
    $scope.error = '';
    $scope.view(unemployee_mobile);
    $scope.unemployee_mobile = {};
    site.showModal('#updateUnEmployee_MobileModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/unemployees_mobiles/update",
      data: $scope.unemployee_mobile
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateUnEmployee_MobileModal');
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

  $scope.remove = function (unemployee_mobile) {
    $scope.view(unemployee_mobile);
    $scope.unemployee_mobile = {};
    site.showModal('#deleteUnEmployee_MobileModal');
  };

  $scope.view = function (unemployee_mobile) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/unemployees_mobiles/view",
      data: { _id: unemployee_mobile._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.unemployee_mobile = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (unemployee_mobile) {
    $scope.view(unemployee_mobile);
    $scope.unemployee_mobile = {};
    site.showModal('#viewUnEmployee_MobileModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/unemployees_mobiles/delete",
      data: { _id: $scope.unemployee_mobile._id, name: $scope.unemployee_mobile.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteUnEmployee_MobileModal');
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
  $scope.loadUnEmployees();
  $scope.loadMobiles_Slides();
});
