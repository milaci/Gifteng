define(["angular", "bootstrap"], function (angular, bootstrap) {
    return angular.module("ui.bootstrap.modal", []).factory("$$stackedMap", function () {
        return {
            createNew: function () {
                var stack = [];
                return {
                    add: function (key, value) {
                        stack.push({
                            key: key,
                            value: value
                        })
                    },
                    get: function (key) {
                        for (var i = 0; i < stack.length; i++)
                            if (key == stack[i].key)
                                return stack[i]
                    },
                    keys: function () {
                        var keys = [];
                        for (var i = 0; i < stack.length; i++)
                            keys.push(stack[i].key);
                        return keys
                    },
                    top: function () {
                        return stack[stack.length - 1]
                    },
                    remove: function (key) {
                        var idx = -1;
                        for (var i = 0; i < stack.length; i++)
                            if (key == stack[i].key) {
                                idx = i;
                                break
                            }
                        return stack.splice(idx, 1)[0]
                    },
                    removeTop: function () {
                        return stack.splice(stack.length - 1, 1)[0]
                    },
                    length: function () {
                        return stack.length
                    }
                }
            }
        }
    }).directive("modalBackdrop", ["$modalStack", "$timeout",
        function ($modalStack, $timeout) {
            return {
                restrict: "EA",
                replace: !0,
                templateUrl: "app/partials/directives/modal/backdrop.html",
                controller: function($scope, $location) {
					$scope.$watch(function() {
					   return $location.path();
					   },  
					   function(newValue, oldValue) {  
					      if (newValue != oldValue) {
							var modal = $modalStack.getTop();
							if(typeof(modal)!=='undefined' && typeof(modal.key)!=='undefined')
								$modalStack.dismiss(modal.key, "back button");
					      }
					      else {
					      }
					   },
					   true);
                },
                link: function (scope, element, attrs) {
                    scope.close = function (evt) {
                        var modal = $modalStack.getTop();
                        modal && modal.value.backdrop && modal.value.backdrop != "static" && (evt.preventDefault(), evt.stopPropagation(), $modalStack.dismiss(modal.key, "backdrop click"))
                    }
                }
            }
        }
    ]).directive("modalWindow", ["$timeout", "$modalStack",
        function ($timeout, $modalStack) {
            return {
                restrict: "EA",
                scope: {
                    index: "@"
                },
                replace: !0,
                transclude: !0,
                templateUrl: "app/partials/directives/modal/window.html",
                link: function (scope, element, attrs) {
                	
                    scope.windowClass = attrs.windowClass || "", scope.close = function (evt) {
                    	
                    	if(typeof(scope.$parent.unclosable)==='undefined' || !scope.$parent.unclosable) {
                        	var modal = $modalStack.getTop();
                        	var dom = modal.value.modalDomEl;
                        	$('.modal-dialog',dom).removeClass('animated').removeClass('bounceInDown').addClass('bounceOutUp').addClass('animated');
                        	$('.modal-backdrop').removeClass('animated').removeClass('fadeIn').addClass('fadeOut').addClass('animated');
                        	$timeout(
                        		function() {
                        			modal && modal.value.backdrop && modal.value.backdrop != "static" && (evt.preventDefault(), evt.stopPropagation(), $modalStack.dismiss(modal.key, "backdrop click"))
                        		}, 1000
                        	);
                  		}
                    }, scope.prevent = function (evt) {
                        evt.target.className != "modal-dialog" && evt.stopPropagation()
                    };
                }
            }
        }
    ]).factory("$modalStack", ["$document", "$compile", "$rootScope", "$$stackedMap", "$timeout", "$location",
        function ($document, $compile, $rootScope, $$stackedMap, $timeout, $location) {
            var backdropjqLiteEl, backdropDomEl, backdropScope = $rootScope.$new(!0),
                body = $document.find("body").eq(0),
                openedWindows = $$stackedMap.createNew(),
                $modalStack = {};

            function backdropIndex() {
                var topBackdropIndex = -1,
                    opened = openedWindows.keys();
                for (var i = 0; i < opened.length; i++)
                    openedWindows.get(opened[i]).value.backdrop && (topBackdropIndex = i);
                return topBackdropIndex
            }
            $rootScope.$watch(backdropIndex, function (newBackdropIndex) {
                backdropScope.index = newBackdropIndex
            });

            function removeModalWindow(modalInstance) {
                var modalWindow = openedWindows.get(modalInstance).value;
                openedWindows.remove(modalInstance), modalWindow.modalDomEl.removeClass("in"), $timeout(function () {
                    modalWindow.modalDomEl.remove(), backdropDomEl && backdropIndex() == -1 && (backdropDomEl.remove(), backdropDomEl = undefined), modalWindow.modalScope.$destroy()
                }, 250)
            }
			   
            return $document.bind("keydown", function (evt) {
                var modal;
                evt.which === 27 && (modal = openedWindows.top(), modal && modal.value.keyboard && $rootScope.$apply(function () {
                    $modalStack.dismiss(modal.key)
                }))
            }), $modalStack.open = function (modalInstance, modal) {
                openedWindows.add(modalInstance, {
                    deferred: modal.deferred,
                    modalScope: modal.scope,
                    backdrop: modal.backdrop,
                    keyboard: modal.keyboard
                });
                var angularDomEl = angular.element("<div modal-window></div>");
                angularDomEl.attr("window-class", modal.windowClass), angularDomEl.attr("index", openedWindows.length() - 1), angularDomEl.html(modal.content);
                var modalDomEl = $compile(angularDomEl)(modal.scope);
                openedWindows.top().value.modalDomEl = modalDomEl, body.append(modalDomEl), $timeout(function () {
                    modalDomEl.addClass("in")
                }, 250);
                if (backdropIndex() >= 0 && !backdropDomEl) {
                    if (modal.scope.ad_id)
                        var bkdropHtml = '<div modal-backdrop class="ad-backdrop"></div>';
                    else
                        var bkdropHtml = "<div modal-backdrop></div>";
                    backdropjqLiteEl = angular.element(bkdropHtml), backdropDomEl = $compile(backdropjqLiteEl)(backdropScope), body.append(backdropDomEl)
                }
            }, $modalStack.close = function (modalInstance, result) {
                var modal = openedWindows.get(modalInstance);
                modal && (modal.value.deferred.resolve(result), removeModalWindow(modalInstance))
            }, $modalStack.dismiss = function (modalInstance, reason) {
                var modalWindow = openedWindows.get(modalInstance).value;
                modalWindow && (modalWindow.deferred.reject(reason), removeModalWindow(modalInstance))
            }, $modalStack.getTop = function () {
                return openedWindows.top()
            }, $modalStack
        }
    ]).provider("$modal", function () {
        var $modalProvider = {
            options: {
                backdrop: !0,
                keyboard: !0
            },
            $get: ["$injector", "$rootScope", "$q", "$http", "$templateCache", "$controller", "$modalStack",
                function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {
                    var $modal = {};

                    function getTemplatePromise(options) {
                        return options.template ? $q.when(options.template) : $http.get(options.templateUrl, {
                            cache: $templateCache
                        }).then(function (result) {
                            return result.data
                        })
                    }

                    function getResolvePromises(resolves) {
                        var promisesArr = [];
                        return angular.forEach(resolves, function (value, key) {
                            (angular.isFunction(value) || angular.isArray(value)) && promisesArr.push($q.when($injector.invoke(value)))
                        }), promisesArr
                    }
                    return $modal.open = function (modalOptions) {
                        var modalResultDeferred = $q.defer(),
                            modalOpenedDeferred = $q.defer(),
                            modalInstance = {
                                result: modalResultDeferred.promise,
                                opened: modalOpenedDeferred.promise,
                                close: function (result) {
                                    $modalStack.close(modalInstance, result)
                                },
                                dismiss: function (reason) {
                                    $modalStack.dismiss(modalInstance, reason)
                                }
                            };
                        modalOptions = angular.extend({}, $modalProvider.options, modalOptions), modalOptions.resolve = modalOptions.resolve || {};
                        if (!modalOptions.template && !modalOptions.templateUrl)
                            throw new Error("One of template or templateUrl options is required.");
                        var templateAndResolvePromise = $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));
                        return templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
                            var modalScope = (modalOptions.scope || $rootScope).$new();
                            modalScope.$close = modalInstance.close, modalScope.$dismiss = modalInstance.dismiss;
                            var ctrlInstance, ctrlLocals = {}, resolveIter = 1;
                            modalOptions.controller && (ctrlLocals.$scope = modalScope, ctrlLocals.$modalInstance = modalInstance, angular.forEach(modalOptions.resolve, function (value, key) {
                                ctrlLocals[key] = tplAndVars[resolveIter++]
                            }), ctrlInstance = $controller(modalOptions.controller, ctrlLocals)), $modalStack.open(modalInstance, {
                                scope: modalScope,
                                deferred: modalResultDeferred,
                                content: tplAndVars[0],
                                backdrop: modalOptions.backdrop,
                                keyboard: modalOptions.keyboard,
                                windowClass: modalOptions.windowClass
                            })
                        }, function resolveError(reason) {
                            modalResultDeferred.reject(reason)
                        }), templateAndResolvePromise.then(function () {
                            modalOpenedDeferred.resolve(!0)
                        }, function () {
                            modalOpenedDeferred.reject(!1)
                        }), modalInstance
                    }, $modal
                }
            ]

        };
        return $modalProvider
    })
});