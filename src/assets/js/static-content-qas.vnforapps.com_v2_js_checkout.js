(function () {
    if (this.VisanetCheckout) {
        return;
    }

    this.VisanetCheckout = {};

    var scriptTag = document.currentScript || (function () {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    function host(url) {
        // works in IE < 8
        // https://gist.github.com/jlong/2428561
        var div = document.createElement('div'), anchor;
        div.innerHTML = "<a></a>";
        div.firstChild.href = url;
        div.innerHTML = div.innerHTML; // Run the current innerHTML back through the parser

        anchor = div.firstChild;

        return "" + anchor.protocol + "//" + anchor.host;
    }

    function isSpanish() {
        var userLang = navigator.language || navigator.userLanguage;
        var lang = userLang.split("-");
        var result = false;
        if (lang.length >= 1) {
            result = lang[0] === "es";
        }
        return result;
    }
    
    function isNumeric(val, decimalPlaces) {
        // If the last digit is a . then add a 0 before testing so if they type 25. it will be accepted
        var lastChar = val.toString().substring(val.length - 1);
        if (lastChar === ".") val = val.toString() + "0";

        var objRegExp = new RegExp("^\\s*-?(\\d+(\\.\\d{1," + decimalPlaces + "})?|\\.\\d{1," + decimalPlaces + "})\\s*$", "g");
        if (decimalPlaces === -1)
            objRegExp = new RegExp("^\\s*-?(\\d+(\\.\\d{1,25})?|\\.\\d{1,25})\\s*$", "g");

        return objRegExp.test(val);        
    }

    this.VisanetCheckout.initfp = false;
    this.VisanetCheckout.isNumeric = isNumeric;
    this.VisanetCheckout.isSpanish = isSpanish();
    
    this.VisanetCheckout.onCI = (scriptTag.src.indexOf('qa=true') !== -1);
    this.VisanetCheckout.isStatic = (scriptTag.src.indexOf('static=true') !== -1);
    this.VisanetCheckout.onProd = (host(scriptTag.src).indexOf('static-content' + (this.VisanetCheckout.isStatic ? '-nlb' : '') + '.vnforapps.com') !== -1);
    
    this.VisanetCheckout.env = this.VisanetCheckout.onProd ? "/v2" : "/env/sandbox";
    this.VisanetCheckout.domainStatic =  this.VisanetCheckout.onProd ? "https://static-content" + (this.VisanetCheckout.isStatic ? "-nlb" : "") :  "https://static-content-qas" + (this.VisanetCheckout.isStatic ? "-nlb" : "");
    this.VisanetCheckout.subdomainStatic = this.VisanetCheckout.onProd ? ".vnforapps.com" : ".vnforapps.com";
    
    this.VisanetCheckout.host = this.VisanetCheckout.domainStatic + this.VisanetCheckout.subdomainStatic + this.VisanetCheckout.env;
    //this.VisanetCheckout.host = 'http://localhost:8080/visanet';
   
    this.VisanetCheckout.scriptTag = scriptTag;

}).call(this);
(function (document) {
    if (this.VisanetCheckout.validate) {
        return;
    }

    this.VisanetCheckout.validate = {
        inValues: function () {
            for (var i = 1; i < arguments.length; i++)
                if (arguments[i] == arguments[0])
                    return true;
            return false;
        },
        preprocess: function (params) {
            var isAmountValid = false;
            var isRecurrence = false;
            var isRecurrenceAmountValid = false;
            var isMaxAmountValid = false;
            
            if (params === null || params === undefined) {
                return null;
            }
            
            if (params.action === null || params.action === undefined) {
                return null;
            }
                        
            var isFixed = params.recurrencetype ? this.inValues(params.recurrencetype.toLowerCase(), 'fixed', 'fixedinitial') : false;
            
            if (!isFixed) {
                params.recurrenceamount = params.recurrenceamount ? params.recurrenceamount : "0.00";
            }
            
            params.currency = params.currency === null || params.currency === undefined ? 'PEN' : (params.currency !== 'USD' ? 'PEN' : params.currency);
            isRecurrence = (params.recurrence !== undefined && params.recurrence !== null) ? params.recurrence.toString().trim().toLowerCase() === "true" : false;
            isAmountValid = params.amount !== undefined && params.amount !== null ? VisanetCheckout.isNumeric(params.amount, 2) : isAmountValid;
            isRecurrenceAmountValid = params.recurrenceamount ? VisanetCheckout.isNumeric(params.recurrenceamount, 2) : isRecurrenceAmountValid;
            isMaxAmountValid = params.recurrencemaxamount ? VisanetCheckout.isNumeric(params.recurrencemaxamount, 2) : isMaxAmountValid;
            
            if (params.channel) {
                params.channel = this.inValues(params.channel.toLowerCase(), 'web', 'mobile', 'callcenter', 'recurrent', 'pasarela') ? params.channel.toLowerCase() : 'web';
            }
            
            if (params.expirationminutes && !VisanetCheckout.isNumeric(params.expirationminutes)) {
                alert('Field expirationminutes has to be set as a numeric value');
                return null;
            } else if (params.expirationminutes < 5 || params.expirationminutes > 20) {
                alert('Field expirationminutes has to be set between 5 to 20');
                return null;
            }
            
            if (!params.timeouturl) {
                alert('Field timeouturl is required');
                return null;
            }
            
            if (isRecurrence) {
                if (!isRecurrenceAmountValid) {
                    alert('Field recurrenceamount has to be set as a numeric value when ' +
                            'recurrence has been set to true.');
                    return null;
                } else if (!isAmountValid && isRecurrenceAmountValid) {
                    params.amount = params.recurrenceamount;
                    isAmountValid = true;
                } else if (isAmountValid && !isRecurrenceAmountValid) {
                    params.recurrenceamount = params.amount;
                    isRecurrenceAmountValid = true;
                }
                
                /*if (!isMaxAmountValid) {
                    alert('Field recurrencemaxamount has to be set as a numeric value when ' +
                            'recurrence has been set to true.');
                    return null;
                }*/
                
                if (params.recurrencetype) {
                    params.recurrencetype = this.inValues(params.recurrencetype.toLowerCase(), 'fixed', 'fixedinitial', 'variable', 'variableinitial') ? params.recurrencetype.toLowerCase() : 'fixed';
                    params.recurrenceamount = this.inValues(params.recurrencetype.toLowerCase(), 'variableinitial', 'variable') ? 0.00 : params.recurrenceamount;
                }
                
                if (params.recurrencefrequency) {
                    params.recurrencefrequency = this.inValues(params.recurrencefrequency.toLowerCase(), 'annual', 'monthly', 'biannual', 'quarterly') ? params.recurrencefrequency.toLowerCase() : 'monthly';
                }
                
            } else if (!isAmountValid) {
                /*alert('Field amount has to be a numeric value.');*/
                return null;
            }
                        
            params.isrecurrence = isRecurrence;

            return params;
        },
        combinate: function (params, config) {
            if (params && config) {
                config.channel = params.channel ? params.channel : config.channel;
                config.amount = (params.amount) ?  VisanetCheckout.isNumeric(params.amount, 2) ? params.amount : config.amount : config.amount;
                config.currency = params.currency ? params.currency : config.currency;
                config.merchantlogo = params.merchantlogo ? params.merchantlogo : config.merchantlogo;
                config.merchantid = params.merchantid ? params.merchantid : config.merchantid;
                config.merchantname = params.merchantname ? params.merchantname : config.merchantname;
                config.formbuttoncolor = params.formbuttoncolor ? params.formbuttoncolor : config.formbuttoncolor;
                config.formbuttontext = params.formbuttontext ? params.formbuttontext : config.formbuttontext;
                config.formbuttontextcolor = params.formbuttontextcolor ? params.formbuttontextcolor : config.formbuttontextcolor;
                config.formbackgroundcolor = params.formbackgroundtcolor ? params.formbackgroundtcolor : config.formbackgroundtcolor;
                config.showamount = params.showamount ? params.showamount.trim().toLowerCase() : config.showamount;
                config.purchasenumber = params.purchasenumber ? params.purchasenumber : config.purchasenumber;
                config.cardholdername = params.cardholdername ? params.cardholdername : config.cardholdername;
                config.cardholderlastname = params.cardholderlastname ? params.cardholderlastname : config.cardholderlastname;
                config.cardholderemail = params.cardholderemail ? params.cardholderemail : config.cardholderemail;
                config.usertoken = params.usertoken ? params.usertoken : config.usertoken;
                config.recurrence = params.recurrence ? params.recurrence.toLowerCase().trim() : config.recurrence;
                config.frequency = params.frequency ? params.frequency : config.frequency;
                config.recurrencetype = params.recurrencetype ? params.recurrencetype : config.recurrencetype;
                config.recurrenceamount = (params.recurrenceamount) ?  VisanetCheckout.isNumeric(params.recurrenceamount, 2) ? params.recurrenceamount : config.recurrenceamount : config.recurrenceamount;
                config.recurrencemaxamount = (params.recurrencemaxamount) ?  VisanetCheckout.isNumeric(params.recurrencemaxamount, 2) ? params.recurrenceamount : config.recurrencemaxamount : config.recurrencemaxamount;
                config.hidexbutton = (params.hidexbutton) ?  params.hidexbutton.trim().toLowerCase() : (config.hidexbutton ? config.hidexbutton.trim().toLowerCase() : 'false');
            }
            
            return config;
        },
        isValid: function (params) {
            if (!params) {
                return false;
            }
            
            if (!params.channel || !params.merchantid || !params.amount || !params.currency || !params.sessiontoken || !params.purchasenumber) {    
                alert('At a minimum, the action, channel, merchantid, sessiontoken, amount and purchasenumber options have to be set');
                return false;
            }

            return true;
        }
    };
}).call(this, document);
(function (document) {
    if (this.VisanetCheckout.utils) {
        return;
    }

    this.VisanetCheckout.utils = {
        bind: function (el, name, callback) {
            if (el.addEventListener) {
                return el.addEventListener(name, callback, false)
            } else if (el.attachEvent) {
                return el.attachEvent("on" + name, callback)
            }
        },
        bindFn: function (fn, obj) {
            return function () {
                return fn.apply(obj, arguments)
            }
        },
        addJsLink: function (link) {
            var js = document.createElement('script');
            js.src = link;
            js.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(js);
        },
        addCssLink: function (link) {
            var style = document.createElement('link');
            style.type = 'text/css';
            style.rel = 'stylesheet';
            style.href = link;
            document.getElementsByTagName('head')[0].appendChild(style);
        }, 
        addInput: function (name, value) {
            var input = document.createElement("input");

            input.type = "hidden";
            input.value = value;
            input.name = name;

            return input;
        }
    };
}).call(this, document);
(function () {
    if (this.VisanetCheckout.ua) {
        return;
    }

    this.VisanetCheckout.ua = {
        userAgent: window.navigator.userAgent,
        isiPhone: function () {
            return /(iPhone|iPod)/i.test(this.userAgent);
        },
        isiOSWebView: function () {
            return /(iPhone|iPod).*AppleWebKit(?!.*Safari)/i.test(this.userAgent);
        },
        isMobileDevice: function () {
            return this.isiPhone() && !this.isiOSWebView();
        }
    }
}).call(this);
(function () {
    if (this.VisanetCheckout.Navigator) {
        return;
    }

    this.VisanetCheckout.Navigator = (function () {
        function Navigator() {}

        Navigator.isSupportTLS1_2 = function () {
            var isSupport = true;

            var browser = getBrowserInfo();
            var version = parseInt(browser.version);

            switch (browser.name.toLowerCase()) {
                case "chrome":
                    if (version < 30) {
                        isSupport = false;
                    }
                    break;
                case "opera":
                    if (version < 17) {
                        isSupport = false;
                    }
                    break;
                case "ie":
                case "msie":
                    if (version < 10) {
                        isSupport = false;
                    }
                    break;
                case "safari":
                    if (version < 7) {
                        isSupport = false;
                    }
                    break;
                case "firefox":
                    if (version < 27) {
                        isSupport = false;
                    }
                    break;
            }

            return isSupport;
        };

        function getBrowserInfo() {
            var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return {name: 'IE', version: (tem[1] || '')};
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\bOPR\/(\d+)/)
                if (tem != null) {
                    return {name: 'Opera', version: tem[1]};
                }
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            
            if (!M[1] && (tem = ua.match(/version\/(\d+)/i)) != null) {
                M.splice(1, 1, tem[1]);
            }
            return {
                name: M[0],
                version: M[1]
            };
        }

        return Navigator;
    })();
}).call(this);
(function () {
    if (this.VisanetCheckout.RPC) {
        return;
    }

    var utils = this.VisanetCheckout.utils;

    this.VisanetCheckout.RPC = (function () {
        function RPC(params) {
            this.target = params.target;
            this.type = params.type || 'server';
            this.methods = {};
            this.messages = [];
            this.isReady = false;
            utils.bind(window, "message", function (self) {
                return function () {
                    return self.handleMessage.apply(self, arguments)
                }
            }(this));
        }

        RPC.prototype.sendMessage = function (message) {
            data = JSON.stringify(message);

            this.send(data);
        };

        RPC.prototype.send = function (data) {
            if (this.isReady === true) {
                this.target.postMessage(data, "*");
            } else {
                this.messages.push(data);
            }
        };

        RPC.prototype.handleMessage = function (event) {
            if (event.source == this.target) {
                this.processMessage(event.data)
            }
        };

        RPC.prototype.processMessage = function (data) {
            message = JSON.parse(data);

            // when client ready
            if (message.isReady === true && this.isReady === false) {
                this.ready();

                return;
            }

            if (this.methods[message.method] && typeof (this.methods[message.method] === "function")) {
                this.methods[message.method].apply(this.methods, message.args);
            }
        };

        RPC.prototype.whenReady = function (callback) {
            if (this.isReady) {
                return callback();
            } else {
                this.onReadyCallback = callback;
            }
        };

        // say that client is ready
        RPC.prototype.ready = function () {
            var message;

            this.isReady = true;

            this.onReadyCallback && this.onReadyCallback();

            this.sendMessage({isReady: true, type: this.type});

            while (message = this.messages.shift()) {
                this.send(message);
            }
        };

        RPC.prototype.invoke = function () {
            var method, args,
                    slice = Array.prototype.slice;

            method = arguments[0];
            args = slice.call(arguments, 1);

            this.sendMessage({
                method: method,
                args: args
            });
        };

        return RPC;
    })();

}).call(this);
(function (document) {
    if (this.VisanetCheckout.Iframe) {
        return;
    }

    var RPC = this.VisanetCheckout.RPC,
            utils = this.VisanetCheckout.utils,
            VisanetCheckout = this.VisanetCheckout;

    this.VisanetCheckout.Iframe = (function () {

        var documentHead,
                documentViewport,
                viewportInitialValue,
                $body = document.body,
                // overflowInitialValue,
                $html,
                $body,
                htmlInitialStyle,
                bodyInitialStyle,
                requiredStyle,
                bodyScrollPosition;

        function updateViewPort() {
            documentHead = document.getElementsByTagName('head')[0];
            documentViewport = document.querySelector('meta[name=viewport]');
            viewportInitialValue = '';
            $body = document.body;
            $html = document.documentElement;

            htmlInitialStyle = $html.style.cssText || '';
            bodyInitialStyle = $body.style.cssText || '';

            requiredStyle = 'position: relative; overflow: hidden; height: 100%';

            // overflowInitialValue = $body.style.overflow;

            if (!documentViewport) {
                // 1. create new meta tag
                var viewportMetaTag = document.createElement('meta');
                viewportMetaTag.name = 'viewport';
                viewportMetaTag.content = '';
                // 2. add new meta tag
                documentHead.appendChild(viewportMetaTag);
                // 3. init viewport
                documentViewport = viewportMetaTag;
            }

            // save init viewport value and scroll position
            viewportInitialValue = documentViewport.getAttribute('content');
            bodyScrollPosition = $body.scrollTop;

            // set required value
            documentViewport.setAttribute('content', 'width=device-width, user-scalable=no');
            $body.style.cssText = requiredStyle;
            $html.style.cssText = requiredStyle;
        }

        function restoreViewPort() {
            documentViewport.setAttribute('content', viewportInitialValue);

            $body.style.cssText = htmlInitialStyle;
            $html.style.cssText = bodyInitialStyle;
            $body.scrollTop = bodyScrollPosition;
        }

        function Iframe() {
            var src = VisanetCheckout.host + "/visanet.html" + '?' + Math.random();

            if (VisanetCheckout.onCI) {
                src += "&qa=true";
            }
            
            if (VisanetCheckout.isStatic) {
                src += "&static=true";
            }

            this.opened = false;

            this.src = src;

            this.iframe = this.addIframe();
            this.rpc = new RPC({target: this.iframe.contentWindow, type: 'server'});
            this.rpc.methods.cancel = utils.bindFn(this.cancel, this);
            this.rpc.methods.addfingerprint = utils.bindFn(this.addfingerprint, this);
            this.rpc.methods.qrcomplete = utils.bindFn(this.qrcomplete, this);
            this.rpc.methods.close = utils.bindFn(this.close, this);
            this.rpc.methods.complete = utils.bindFn(this.complete, this);
        }

        Iframe.prototype.config = function (options) {
            this.configuration = options || (options = {});
            this.rpc.invoke('config', this.configuration);
        };

        Iframe.prototype.open = function (params) {
            if (this.opened) {
                return;
            }

            this.opened = true;

            updateViewPort();
            this.iframe.style.display = 'block';
            
            this.rpc.invoke('open', params);
        };

        Iframe.prototype.complete = function (params) {
            this.configuration.complete(params);
        };

        Iframe.prototype.addfingerprint = function (params) {
            try {
                if (!VisanetCheckout.initfp) {
                    initDFP(params.sessiontoken, params.purchasenumber, params.clientip, params.merchantid);
                    VisanetCheckout.initfp = true;
                }
            } catch(e) {
              
            }
        };
        
        Iframe.prototype.qrcomplete = function (params) {
            try {
                window.location.replace(params.url);
            } catch(e) {
                console.log(e);
            }
        };

        Iframe.prototype.cancel = function () {
            this.close();

            if (this.configuration.cancel) {
                this.configuration.cancel();
            }
        };

        Iframe.prototype.close = function () {
            this.opened = false;
            this.iframe.style.display = 'none';
            document.body.className = document.body.className.replace("visanet-opened", "");
            restoreViewPort();
        };

        Iframe.prototype.addIframe = function () {
            var iframe;

            var div = document.createElement("div");
            div.id = "visaNetWrapper";

            iframe = document.createElement("iframe");
            iframe.id = "visaNetJS";

            iframe.setAttribute("frameBorder", "0");
            iframe.setAttribute("allowtransparency", "true");
            //iframe.style.cssText = "z-index: 10000;\ndisplay: none;\nbackground: transparent;\nbackground: rgba(0,0,0,0.005);\nborder: 0px none transparent;\noverflow-x: hidden;\noverflow-y: hidden;\nvisibility: hidden;\nmargin: 0;\npadding: 0;\n-webkit-tap-highlight-color: transparent;\n-webkit-touch-callout: none; position: fixed;\nleft: 0;\ntop: 0;\nwidth: 100%;\nheight: 100%;";
            iframe.style.cssText = "z-index: 2147483646;\ndisplay: none;\nbackground: transparent;\nbackground: rgba(0,0,0,0.005);\nborder: 0px none transparent;\noverflow-x: hidden;\noverflow-y: auto;\nvisibility: hidden;\nmargin: 0;\npadding: 0;\n-webkit-tap-highlight-color: transparent;\n-webkit-touch-callout: none; position: fixed;\nleft: 0;\ntop: 0;\nwidth: 100%;\nheight: 100%;"


            iframe.src = this.src;
            div.appendChild(iframe);
            document.body.appendChild(div);

            utils.bind(iframe, 'load', function () {
                iframe.style.visibility = "visible";
            });

            return iframe;
        };

        return Iframe;
    })();
}).call(this, document);
(function (document) {
    if (this.VisanetCheckout.Tab) {
        return;
    }

    var RPC = this.VisanetCheckout.RPC,
            utils = this.VisanetCheckout.utils,
            VisanetCheckout = this.VisanetCheckout;

    this.VisanetCheckout.Tab = (function () {

        function Tab() {
            var src = VisanetCheckout.host + "/visanet.html" + '?' + Math.random();

            if (VisanetCheckout.onCI) {
                src += "&ci=true";
            }
            this.opened = false;
            this.src = src;
        }

        Tab.prototype.config = function (options) {
            this.configuration = options || (options = {});
            this.configuration.inTab = true;
        };

        Tab.prototype.open = function (params) {
            if (this.opened) {
                return;
            }

            this.opened = true;

            this.createTab();

            this.rpc.invoke('config', this.configuration);
            this.rpc.invoke('open', params);
        };


        Tab.prototype.createTab = function () {
            var self = this;

            this.tab = window.open(this.src, 'btfljs');
            this.rpc = new RPC({target: this.tab, type: 'server'});
            this.rpc.methods.cancel = utils.bindFn(this.cancel, this);
            this.rpc.methods.addfingerprint = utils.bindFn(this.addfingerprint, this);
            this.rpc.methods.qrcomplete = utils.bindFn(this.qrcomplete, this);
            this.rpc.methods.complete = utils.bindFn(this.complete, this);
            this.rpc.whenReady(function () {
                self.checkIfClosed();
            });
        };

        Tab.prototype.checkIfClosed = function () {
            var self = this;
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
            }

            this.checkInterval = setInterval(function () {
                if (self.tab.closed) {
                    self.close();
                }
            }, 1000);
        };

        Tab.prototype.complete = function (params) {
            this.close();
            this.configuration.complete(params);
        };
        
        Tab.prototype.addfingerprint = function (params) {
            try {
                if (!VisanetCheckout.initfp) {
                    initDFP(params.sessiontoken, params.purchasenumber, params.clientip, params.merchantid);
                    VisanetCheckout.initfp = true;
                }
            } catch(e) {
              
            }
        };
        
        Tab.prototype.qrcomplete = function (params) {
            try {
                window.location.replace(params.url);
            } catch(e) {
                console.log(e);
            }
        };

        Tab.prototype.cancel = function () {
            this.close();

            if (this.configuration.cancel) {
                this.configuration.cancel();
            }
        };

        Tab.prototype.close = function () {
            clearInterval(this.checkInterval);
            this.opened = false;

            if (!this.tab.closed) {
                this.tab.close();
            }
        };

        return Tab;
    })();
}).call(this, document);
(function (document) {
    if (this.VisanetCheckout.View) {
        return;
    }

    var ua = this.VisanetCheckout.ua, VisanetCheckout = this.VisanetCheckout;

    this.VisanetCheckout.getView = function (options) {
        var viewClass;

        if (ua.isMobileDevice() && options.tabOnMobile) {
            viewClass = VisanetCheckout.Tab;
        } else {
            viewClass = VisanetCheckout.Iframe;
        }

        return viewClass;
    };
}).call(this, document);
(function () {
    var oldBrowserMessage = "Sorry, but you can't make payment using this browser as its version is considered unsecure. Please, use latest version of your browser or download and install latest version of free Firefox / Chrome.";

    if (this.VisanetCheckout.Checkout) {
        return;
    }

    if (this.VisanetCheckout.Navigator.isSupportTLS1_2() === false) {
        alert(oldBrowserMessage);
    }

    this.VisanetCheckout.Checkout = (function () {
        var initialized = false;

        function Checkout() {}

        // just do nothing with old browser...
        if (VisanetCheckout.Navigator.isSupportTLS1_2() === false) {
            Checkout.config = function (options) {};
            Checkout.open = function (params) {
                alert(oldBrowserMessage);
            };

            return Checkout;
        }
        this.VisanetCheckout.utils.addJsLink(this.VisanetCheckout.onProd ? this.VisanetCheckout.host + "/js/prd_dfp.js" : this.VisanetCheckout.host + "/js/dev_dfp.js");

        // for modern browsers we are gald to say hello
        var view;

        Checkout.config = function (options) {
            var self = this;
            var validate = this.validate;
            var utils = this.utils;
            options = validate.preprocess(options);
            
            if (options && validate.isValid(options)) {
                this.configuration = options;
                this.configuration.complete = function (params) {
                    var form = document.createElement("form");
                    form.appendChild(utils.addInput('transactionToken', params.token));
                    form.appendChild(utils.addInput('customerEmail', params.email));
                    form.appendChild(utils.addInput('channel', params.channel));
                    if (params.url && params.url !== '') {
                        form.appendChild(utils.addInput('url', params.url));
                    }

                    form.method = "POST";
                    form.action = self.configuration.action;

                    document.body.appendChild(form);

                    form.submit();
                };
                
                if (typeof (view) === 'undefined') {
                    viewClass = VisanetCheckout.getView(options);
                    view = new viewClass;
                }

                view.config(options);
            }
        };

        Checkout.open = function (params) {
            var validate = this.validate;
            if (this.configuration) {
                if (params) {
                    this.configuration = validate.combinate(params, this.configuration);
                    this.configuration = validate.preprocess(this.configuration);
                    
                    if (this.configuration && validate.isValid(this.configuration)) {
                        view.config(this.configuration);
                        view.open(this.configuration);
                    }
                } else {
                    view.open(this.configuration);
                }
            } else {
                alert('At a minimum, the action, merchantid, sessiontoken, amount and purchasenumber options have to be set');
            }
        };

        return Checkout;
    })();
}).call(this);
(function () {
    if (this.VisanetCheckout.Button) {
        return;
    }

    var utils = this.VisanetCheckout.utils,
            VisanetCheckout = this.VisanetCheckout,
            oldIE = window.attachEvent && !window.addEventListener;

    VisanetCheckout.Button = (function () {
        
        function Button(form, config) {
            
            this.form = form;
            this.complete = utils.bindFn(this.complete, this);
            this.open = utils.bindFn(this.open, this);
            this.cancel = utils.bindFn(this.cancel, this);

            this.config = config;
            this.config.complete = this.complete;
            this.config.cancel = this.cancel;
            this.config.tabOnMobile = false;

            this.params = {
                channel: config.channel,
                amount: config.amount,
                currency: config.currency,
                cardholderemail: config.cardholderemail,
                cardholdername: config.cardholdername,
                cardholderlastname: config.cardholderlastname,
                sessiontoken: config.sessiontoken,
                purchasenumber: config.purchasenumber
            };

            VisanetCheckout.configure(this.config);
            this.render();
        }

        Button.prototype.render = function () {
            
            var background = VisanetCheckout.host + '/img/button/';
            var isRecurrence = this.config['recurrence'] ? this.config['recurrence'].toString().trim().toLowerCase() === "true" : false;
            utils.addCssLink(VisanetCheckout.host + '/css/button.css');
            this.btn = document.createElement("button");
            this.btn.setAttribute("type", "submit");

            this.config.buttonsize = this.config.buttonsize ? this.config.buttonsize.trim().toLowerCase() : 'default';
            this.config.buttoncolor = this.config.buttoncolor ? this.config.buttoncolor.trim().toLowerCase() : 'navy';
            
            if (!VisanetCheckout.validate.inValues(this.config.channel, 'web', 'mobile', 'callcenter', 'recurrent', 'pasarela', 'paycard')) {
                this.config.channel = 'web';
            }

            if (!VisanetCheckout.validate.inValues(this.config.buttonsize, 'small', 'medium', 'large')) {
                this.config.buttonsize = 'default';
            }

            if (!VisanetCheckout.validate.inValues(this.config.buttoncolor, 'navy', 'gray')) {
                this.config.buttoncolor = 'navy';
            }
            this.btn.className = "start-js-btn modal-opener " + (this.config.buttonsize ? this.config.buttonsize : "default");
            this.btn.style = (this.config.custom === "true" ? "display:none;" : "");
            /*this.btn.innerHTML = this.config.label || (VisanetCheckout.isSpanish ? "Pagar con Visa" : "Pay with Visa");*/
            background += VisanetCheckout.isSpanish ? 'ES/' : 'EN/';
            background += this.config.buttoncolor;
            background += "/" + this.config.buttonsize + (isRecurrence ? '/SubscribeWith.png' : '/PayWith.png');
            this.btn.style.background = 'url("' + background + '")';

            utils.bind(this.btn, 'click', this.open);
            this.form.appendChild(this.btn);

        };

        Button.prototype.open = function (e) {
            e.preventDefault ? e.preventDefault() : e.returnValue = false;

            if (oldIE) {
                alert("Due to security reasons please, use modern browser (IE11, FireFox, Chrome or Safari) to make payment!");
            } else {
                if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                    window.scrollTo(0, 0);
                    document.body.className += 'visanet-opened';
                }
                VisanetCheckout.open(this.params);
            }

            return false;
        };

        Button.prototype.complete = function (params) {
            this.form.appendChild(utils.addInput('transactionToken', params.token));
            this.form.appendChild(utils.addInput('customerEmail', params.email));
            this.form.appendChild(utils.addInput('channel', params.channel));

            this.form.submit();
        };
        
        Button.prototype.cancel = function() {
            
        };


        return Button;
    })();
}).call(this);
(function () {
    if (this.VisanetCheckout.open) {
        return;
    }
    
    this.VisanetCheckout.open = this.VisanetCheckout.Checkout.open;
    this.VisanetCheckout.configure = this.VisanetCheckout.Checkout.config;
}).call(this);
(function () {
    if (this.VisanetCheckout.auto) {
        return;
    }

    this.VisanetCheckout.auto = true;

    var scriptTag = this.VisanetCheckout.scriptTag,
            formTag = scriptTag.parentElement,
            config = {};
            
    if (formTag.tagName != 'FORM') {
        return;
    }

    var attr, match;
    var action = 'action';

    for (i = 0; i < scriptTag.attributes.length; i++) {
        attr = scriptTag.attributes[i];
        match = attr.name.match(/^data-(.+)$/);
        if (match !== null) {
            paramName = camelize(match[1]);
            config[paramName] = attr.value;
        }
    }
    
    var formAction = formTag.getAttribute(action);
    config[action] = formAction;
    
    if (config !== undefined && config !== null) {
        config.tabOnMobile = false;

        var btn = new this.VisanetCheckout.Button(formTag, config);
    }

    function camelize(str) {
        function lowerToUpper(_, match) {
            return match.toUpperCase();
        }

        return str.replace(/(?:[-_])(\w)/g, lowerToUpper);
    }
}).call(this);