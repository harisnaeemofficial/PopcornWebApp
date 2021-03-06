(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name app.controller:recentCtrl
     * @description
     * # recentCtrl
     * Controller of the app
     */

    angular
        .module('recent')
        .controller('RecentCtrl', Recent);

    Recent.$inject = ['RecentService', '$rootScope', 'localStorageService'];

    /*
     * recommend
     * Using function declarations
     * and bindable members up top.
     */

    function Recent(RecentService, $rootScope, localStorageService) {
        /*jshint validthis: true */
        var vm = this;
        vm.page = 0;
        vm.movies = [];
        var loadMovies = function(pageNumber) {
            RecentService.getMovies(pageNumber).$promise.then(function(res) {
                vm.page++;
                for (var i = 0; i < res.movies.length; i++) {
                    var movie = res.movies[i];
                    var storedMovie = localStorageService.get(movie.imdb_code);
                    if(storedMovie !== undefined && storedMovie !== null){
                        movie.like = storedMovie.like;
                    }
                    
                    vm.movies.push(movie);
                }
                $rootScope.$broadcast('loaded');
            }).catch(function(err) {
                $rootScope.$broadcast('loaded');
            });
        };

        vm.paginate = function() {
            $rootScope.$broadcast('loading');
            loadMovies(vm.page + 1);
        };

        vm.toggleLike = function(movie) {
            if (movie.like === undefined) {
                movie.like = true;

            } else {
                movie.like = !movie.like;
            }

            var movieToStore = {
                imdb_code: movie.imdb_code,
                like: movie.like,
                watched: false
            };

            localStorageService.set(movie.imdb_code, movieToStore);
        };
    }

})();
