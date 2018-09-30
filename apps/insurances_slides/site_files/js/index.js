app.controller("insurances_slides", function ($scope, $http) {

  $scope.insurance_slide = {};

  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/insurances_slides/upload/image', fd, {
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
        $scope.insurance_slide.image_url = res.data.image_url;
      }
    }, function (error) {
      $scope.uploadStatus = error;
    });
  };

  $scope.loadinsurances_slides = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/insurances_slides/all",
      data: {
        select : {id:1 , name : 1}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.insurances_slides = response.data.list;
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
      url: "/api/insurances_slides/all",
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

  $scope.newInsurance_Slide = function () {
    $scope.error = '';
    $scope.insurance_slide = { image_url: '/images/insurance_slide.png' };
    site.showModal('#addInsurance_SlideModal');
  };
  $scope.add = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/insurances_slides/add",
      data: $scope.insurance_slide
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addInsurance_SlideModal');
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

  $scope.edit = function (insurance_slide) {
    $scope.error = '';
    $scope.view(insurance_slide);
    $scope.insurance_slide = {};
    site.showModal('#updateInsurance_SlideModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/insurances_slides/update",
      data: $scope.insurance_slide
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateInsurance_SlideModal');
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

  $scope.remove = function (insurance_slide) {
    $scope.view(insurance_slide);
    $scope.insurance_slide = {};
    site.showModal('#deleteInsurance_SlideModal');
  };

  $scope.view = function (insurance_slide) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/insurances_slides/view",
      data: { _id: insurance_slide._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.insurance_slide = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (insurance_slide) {
    $scope.view(insurance_slide);
    $scope.insurance_slide = {};
    site.showModal('#viewInsurance_SlideModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/insurances_slides/delete",
      data: { _id: $scope.insurance_slide._id, name: $scope.insurance_slide.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteInsurance_SlideModal');
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
  $scope.loadinsurances_slides();
});
