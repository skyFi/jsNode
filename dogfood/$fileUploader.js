service('$fileUploader', ['$http', '$q', '$cookies',
    function ($http, $q, $cookies) {
        this.uploadFile = function(file, uploadUrl) {
            var deferred = $q.defer();

            var fd = new FormData();
            fd.append('file', file);

            var xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener("load", uploadComplete, false);
            xhr.addEventListener("error", uploadFailed, false);
            xhr.addEventListener("abort", uploadCanceled, false);
            xhr.addEventListener("failed", uploadCanceled, false);
            xhr.open("POST", uploadUrl);
            xhr.setRequestHeader('X-XSRF-TOKEN', $cookies['XSRF-TOKEN']);
            xhr.send(fd);

            function uploadProgress(evt) {
                deferred.notify({loaded: evt.loaded, total: evt.total});
            }

            function uploadComplete(evt) {
                $(document).off('keydown', '', cancelKeydown);
                deferred.resolve(JSON.parse(evt.target.responseText));
            }

            function uploadFailed(evt) {
                $(document).off('keydown', '', cancelKeydown);
                deferred.reject(JSON.parse(evt.target.responseText));
            }

            function uploadCanceled() {
                $(document).off('keydown', '', cancelKeydown);
                deferred.reject('failed');
            }

            $(document).on('keydown', cancelKeydown);

            function cancelKeydown(event) {
                if (event.keyCode == 27) {   //->'ESC'
                    xhr.abort();
                }
            }
            return deferred.promise;
        }
    }
]).directive('fileUploader', ['$fileUploader', '$parse', function($fileUploader, $parse){
    return {
        restrict: 'E',
        template: '<div style="position: relative;"><button class="sui-btn btn-primary btn-large">选择文件</button>' +
                  '<input id="angular-file" type="file" class="angular-file-input"><span style="margin-left: 10px;">{{file.name}}</span></div>',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            $('#angular-file', element).on('change', function(){
                scope.$apply(function(){
                    scope.file = $('#angular-file', element)[0].files[0];
                    modelSetter(scope, {file: scope.file, upload: function(url){return $fileUploader.uploadFile(this.file, url)}});
                });
            });
        }
    };
}]);
