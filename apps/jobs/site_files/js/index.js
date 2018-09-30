app.controller("jobs", function ($scope, $http) {

  $scope.job = {};

  $scope.loadAll = function (where) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/jobs/all",
      data: {where:where}
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

  $scope.newJob = function () {
    $scope.error = '';
    $scope.job = { image_url: '/images/job.png' };
    site.showModal('#addJobModal');
  };
  $scope.add = function () {

    $scope.error = '';
    const v = site.validated();
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/jobs/add",
      data: $scope.job
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addJobModal');
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

  $scope.edit = function (job) {
    $scope.error = '';
    $scope.view(job);
    $scope.job = {};
    site.showModal('#updateJobModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/jobs/update",
      data: $scope.job
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateJobModal');
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

  $scope.remove = function (job) {
    $scope.view(job);
    $scope.job = {};
    site.showModal('#deleteJobModal');
  };

  $scope.view = function (job) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/jobs/view",
      data: { id: job.id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.job = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };
  $scope.details = function (job) {
    $scope.view(job);
    $scope.job = {};
    site.showModal('#viewJobModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/jobs/delete",
      data: { id: $scope.job.id, name: $scope.job.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteJobModal');
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

  $scope.loadJobs = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Jobs/all",
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
          $scope.jobs = response.data.list;
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

    if ($scope.search.name) {
     
      where['name'] = $scope.search.name;
    }

    $scope.loadAll(where);
    
    site.hideModal('#SearchModal')

  };

  $scope.loadAll();
  $scope.loadJobs();
});
