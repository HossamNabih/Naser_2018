app.controller("unemployees_insurances", function($scope, $http) {

$scope.unemployee_insurance = {};




  /* upload files */

  $scope.uploadFile = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/unemployee_insurance/upload/file', fd, {
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
        $scope.unemployee_insurance.files.push({
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
    for (let i = 0; i < $scope.unemployee_insurance.files.length; i++) {
      let f = $scope.unemployee_insurance.files[i];
      if (f.url === file.url) {
        $scope.unemployee_insurance.files.splice(i, 1);
        return;
      }
    }
  };



  /* end*/



  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/unemployees_insurances/upload/image', fd, {
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
        $scope.unemployee_insurance.image_url = res.data.image_url;
      }
    }, function (error) {
      $scope.uploadStatus = error;
    });
  };

  $scope.uploadFile = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/unemployees_insurances/upload/file', fd, {
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
        $scope.unemployee_insurance.files.push({
          url: res.data.file_url,
          name: $scope.fileName
        });
        $scope.fileName = '';
      }
    }, function (error) {
      $scope.fileStatus = error;
    });
  };



$scope.loadUnEmployees = function() {
  $scope.busy = true;
  $http({
    method: "POST",
    url: "/api/unemployees/all",
    data: {
      select : {id:1 , name : 1}
    }
  }).then(
    function(response) {
      $scope.busy = false;
      if (response.data.done) {
        $scope.unemployees = response.data.list;
      }
    },
    function(err) {
      $scope.busy = false;
      $scope.error = err;
    }
  )
};


$scope.loadInsurances_Slides = function () {
  $scope.busy = true;
  $http({
    method: "POST",
    url: "/api/insurances_slides/all",
    data: {
      select : {id:1 , name : 1,value:1}
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

  $scope.loadAll = function() {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/unemployees_insurances/all",
      data: {}
    }).then(
      function(response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list = response.data.list;
        }
      },
      function(err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.newUnEmployee_Insurance = function(){
    $scope.error = '';
    $scope.unemployee_insurance = {image_url : '/images/unemployee_insurance.png'};
    site.showModal('#addUnEmployee_InsuranceModal');
  };
  $scope.add = function() {
    $scope.busy = true;
     $http({
       method: "POST",
       url: "/api/unemployees_insurances/add",
       data: $scope.unemployee_insurance
     }).then(
       function(response) {
        $scope.busy = false;
         if (response.data.done) {
          site.hideModal('#addUnEmployee_InsuranceModal');
          $scope.loadAll();
         }else{
          $scope.error = '##word.error##';
         }
       },
       function(err) {
        console.log(err);
       }
     )
   };

   $scope.edit = function(unemployee_insurance){
    $scope.error = '';
    $scope.view(unemployee_insurance);
    $scope.unemployee_insurance = {};
     site.showModal('#updateUnEmployee_InsuranceModal');
   };
   $scope.update = function() {
    $scope.busy = true;
     $http({
       method: "POST",
       url: "/api/unemployees_insurances/update",
       data: $scope.unemployee_insurance
     }).then(
       function(response) {
        $scope.busy = false;
         if (response.data.done) {
          site.hideModal('#updateUnEmployee_InsuranceModal');
          $scope.loadAll();
         }else{
          $scope.error = '##word.error##';
         }
       },
       function(err) {
         console.log(err);
       }
     )
   };

   $scope.remove = function(unemployee_insurance){
    $scope.view(unemployee_insurance);
    $scope.unemployee_insurance = {};
    site.showModal('#deleteUnEmployee_InsuranceModal');
  };

  $scope.view = function(unemployee_insurance){
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/unemployees_insurances/view",
      data: {_id : unemployee_insurance._id}
    }).then(
      function(response) {
       $scope.busy = false;
        if (response.data.done) {
          $scope.unemployee_insurance = response.data.doc;
        }else{
         $scope.error = response.data.error;
        }
      },
      function(err) {
        console.log(err);
      }
    )
  };
  $scope.details = function(unemployee_insurance){
    $scope.view(unemployee_insurance);
    $scope.unemployee_insurance = {};
   site.showModal('#viewUnEmployee_InsuranceModal');
  };
   $scope.delete = function() {
    $scope.busy = true;
     $http({
       method: "POST",
       url: "/api/unemployees_insurances/delete",
       data: {_id : $scope.unemployee_insurance._id , name : $scope.unemployee_insurance.name}
     }).then(
       function(response) {
        $scope.busy = false;
         if (response.data.done) {
          site.hideModal('#deleteUnEmployee_InsuranceModal');
          $scope.loadAll();
         }else{
          $scope.error = response.data.error;
         }
       },
       function(err) {
         console.log(err);
       }
     )
   };
  $scope.loadAll();
  $scope.loadUnEmployees();
  $scope.loadInsurances_Slides();
});
