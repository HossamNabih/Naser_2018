app.controller("mobiles_slides", function ($scope, $http) {

  $scope.mobile_slide = {};

  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/mobiles_slides/upload/image', fd, {
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
        $scope.mobile_slide.image_url = res.data.image_url;
      }
    }, function (error) {
      $scope.uploadStatus = error;
    });
  };

  $scope.loadmobiles_slides = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/mobiles_slides/all",
      data: {
        select : {id:1 , name : 1}
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
      url: "/api/mobiles_slides/all",
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

  $scope.newMobile_Slide = function () {
    $scope.error = '';
    $scope.mobile_slide = { image_url: '/images/mobile_slide.png' };
    site.showModal('#addMobile_SlideModal');
  };
  $scope.add = function () {
   $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/mobiles_slides/add",
      data: $scope.mobile_slide
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addMobile_SlideModal');
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

  $scope.edit = function (mobile_slide) {
    $scope.error = '';
    $scope.view(mobile_slide);
    $scope.mobile_slide = {};
    site.showModal('#updateMobile_SlideModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/mobiles_slides/update",
      data: $scope.mobile_slide
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateMobile_SlideModal');
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

  $scope.remove = function (mobile_slide) {
    $scope.view(mobile_slide);
    $scope.mobile_slide = {};
    site.showModal('#deleteMobile_SlideModal');
  };

  $scope.view = function (mobile_slide) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/mobiles_slides/view",
      data: { _id: mobile_slide._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.mobile_slide = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (mobile_slide) {
    $scope.view(mobile_slide);
    $scope.mobile_slide = {};
    site.showModal('#viewMobile_SlideModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/mobiles_slides/delete",
      data: { _id: $scope.mobile_slide._id, name: $scope.mobile_slide.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteMobile_SlideModal');
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
  $scope.loadmobiles_slides();
});
