app.controller("spare_parts", function($scope, $http) {

$scope.spare_part = {};

  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/spare_parts/upload/image', fd, {
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
        $scope.spare_part.image_url = res.data.image_url;
        }
    }, function (error) {
        $scope.uploadStatus = error;
    });
};

  $scope.loadAll = function() {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/spare_parts/all",
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

    
  $scope.newSpare_Part = function(){
    $scope.spare_part = {image_url : '/images/spare_part.png'};
    site.showModal('#addSpare_PartModal');
  };
  $scope.add = function() {
    $scope.busy = true;
     $http({
       method: "POST",
       url: "/api/spare_parts/add",
       data: $scope.spare_part
     }).then(
       function(response) {
        $scope.busy = false;
         if (response.data.done) {
          site.hideModal('#addSpare_PartModal');
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

   $scope.edit = function(spare_part){
    $scope.view(spare_part);
    $scope.spare_part = {};
     site.showModal('#updateSpare_PartModal');
   };
   $scope.update = function() {
    $scope.busy = true;
     $http({
       method: "POST",
       url: "/api/spare_parts/update",
       data: $scope.spare_part
     }).then(
       function(response) {
        $scope.busy = false;
         if (response.data.done) {
          site.hideModal('#updateSpare_PartModal');
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

   $scope.remove = function(spare_part){
    $scope.view(spare_part);
    $scope.spare_part = {};
    site.showModal('#deleteSpare_PartModal');
  };

  $scope.view = function(spare_part){
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/spare_parts/view",
      data: {_id : spare_part._id}
    }).then(
      function(response) {
       $scope.busy = false;
        if (response.data.done) {
          $scope.spare_part = response.data.doc;
        }else{
         $scope.error = response.data.error;
        }
      },
      function(err) {
        console.log(err);
      }
    )
  };
  $scope.details = function(spare_part){
    $scope.view(spare_part);
    $scope.spare_part = {};
   site.showModal('#viewSpare_PartModal');
  };
   $scope.delete = function() {
    $scope.busy = true;
     $http({
       method: "POST",
       url: "/api/spare_parts/delete",
       data: {_id : $scope.spare_part._id , name : $scope.spare_part.name}
     }).then(
       function(response) {
        $scope.busy = false;
         if (response.data.done) {
          site.hideModal('#deleteSpare_PartModal');
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

});
