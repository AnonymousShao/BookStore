angular.module('module.controller',[])
    .controller('homeCtrl',function ($scope) {
        $scope.a = 'Hello!'
    }).controller('listCtrl',function ($scope,Book) {
        $scope.books = Book.query();
    }).controller('addCtrl',function ($scope,Book,$location) {
        $scope.add = function () {
            Book.save($scope.book).$promise.then(function () {
                $scope.books = Book.query();
                $location.path('/list');
            });
        }
    }).controller('detailCtrl',function ($scope,Book,$location,$routeParams) {
        var id = $routeParams.bid;
        $scope.book = Book.get({id:id});
        $scope.remove = function () {
            Book.delete({id:id}).$promise.then(function () {
                $location.path('/list');
            });
        }
    });
