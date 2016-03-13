describe('Agnular Sails service', function () {

    var $scope,
        $sails,
        mockIoSocket;
    describe('CSRF Token handle', function () {
        it('should call for the csrf token on module instantiation', function () {
            var s = io.sails.connect();
            var origreq = s.request;
            var sstub = sinon.stub(io.sails, "connect", function () {
                return s;
            });
            
            var spy = sinon.spy();
            var reqstub = sinon.stub(s, 'request', function (config, cb) {
                if (config.url === '/csrfToken') {
                    spy();
                    var d = $.Deferred();
                    d.resolve({
                        data: 'thecsrftoken',
                        status: 200
                    });
                    return d;

                } else {
                    return originalGet(config, cb);
                }
            });
            angular.module('testmod', [])
                .config(function ($sailsProvider) {
                    //Set the provider to use CSRF Tokens
                    $sailsProvider.useCSRFToken = true;
                })
                .controller('testController', function ($sails) {});
            module('ngSails', 'testmod');
            inject(function (_$rootScope_, _$sails_) {
                $scope = _$rootScope_;
                $scope.$digest();
            });
            expect(spy.called).to.be.true;
            reqstub.restore();
            sstub.restore();

        });
        it('should include a csrfToken in a post request', function(done) {
            this.timeout(20000);
            var s = io.sails.connect();
            var origreq = s.request;
            var reqstub;
            var fn;
            var sstub = sinon.stub(io.sails, "connect", function () {
                reqstub = sinon.stub(s, 'request', function (config, cb) {
                    fn(config,cb);
                });
                return s;
            });
            angular.module('testmod', [])
                .config(function ($sailsProvider) {
                    //Set the provider to use CSRF Tokens
                    $sailsProvider.useCSRFToken = true;
                    //Configure the provider to send the _csrf in the Headers
                    $sailsProvider.csrfTokenAsHeader = true;
                })
                .run(function() {
                    fn = function(config, cb) {
                        if (config.url === '/csrfToken') {
                            var opts = {
                                body: {_csrf:'thecsrftoken'},
                                statusCode: 200
                            };
                            cb(opts.body, opts);
                        } else {
                            return origreq.call($sails, config, cb);
                        }
                    };  
                })
                .controller('testController', function ($sails) {});
            module('ngSails', 'testmod');
            inject(function (_$rootScope_, _$sails_) {
                $scope = _$rootScope_;
                $sails = _$sails_;
                mockIoSocket = $sails._raw;
                mockIoSocket.on('post', function (ctx, cb) {
                    expect(ctx.headers).to.exist;
                    expect(ctx.headers['X-CSRF-Token']).to.equal('thecsrftoken');
                    reqstub.restore();
                    sstub.restore();
                    done();
                });
                $sails.post('success');
                $scope.$digest();
            });
        });
        it('should wait 2 secs until the csrfToken is received to perform a post request', function (done) {
            this.timeout(20000);
            var s = io.sails.connect();
            var origreq = s.request;
            var reqstub;
            var fn;
            var sstub = sinon.stub(io.sails, "connect", function () {
                reqstub = sinon.stub(s, 'request', function (config, cb) {
                    fn(config,cb);
                });
                return s;
            });
            angular.module('testmod', [])
                .config(function ($sailsProvider) {
                    //Set the provider to use CSRF Tokens
                    $sailsProvider.useCSRFToken = true;
                    //Configure the provider to send the _csrf in the Headers
                    $sailsProvider.csrfTokenAsHeader = true;
                })
                .run(function($q, $timeout) {
                    fn = function(config, cb) {
                        if (config.url === '/csrfToken') {
                            var opts = {
                                body: {_csrf:'thecsrftoken'},
                                statusCode: 200
                            };
                            $timeout(function() {
                                cb(opts.body, opts);
                            }, 2000, false);
                            $timeout.flush();

                        } else {
                            return origreq.call($sails, config, cb);
                        }
                    };  
                })
                .controller('testController', function ($sails) {});
            module('ngSails', 'testmod');
            inject(function (_$rootScope_, _$sails_) {
                $scope = _$rootScope_;
                $sails = _$sails_;
                mockIoSocket = $sails._raw;
                mockIoSocket.on('post', function (ctx, cb) {
                    expect(ctx.headers).to.exist;
                    expect(ctx.headers['X-CSRF-Token']).to.not.equal('notthecsrftoken');
                    expect(ctx.headers['X-CSRF-Token']).to.equal('thecsrftoken');
                    done();
                });
                $sails.post('success');
                $scope.$digest();
            });
            reqstub.restore();
            sstub.restore();
        });
    });
});
