
var Args = require('args-js');
var request = require('request');





function FeignRequestClient(){
	var args  = Args([
			{ request: Args.FUNCTION | Args.Optional, _default: request},
			{ debug: Args.BOOL | Args.Optional, _default: false},
			{ json:  Args.BOOL | Args.Optional, _default: true}
		], arguments);
	
	this.requestFn = args.request;
	this.requestFn.debug = args.debug;
	this.isJson = args.json;
	
	if (args.json){
		this.requestFn = this.requestFn.defaults({json: true});
	}
}

FeignRequestClient.prototype.request =  function(request){
	var options = this._createRequestJsOptions(request.baseUrl, request.options, request.parameters);
	var _this = this;
	var promise = new Promise(function(resolve, reject){
		_this.requestFn(options, function(error, response, body){
			if (error) 
				return reject(error);
			return resolve(body);
		});
	});
	return promise;
};

FeignRequestClient.prototype._createRequestJsOptions = function(baseUrl, requestOptions, parameters){
	var options  = Args([
			{ method: Args.STRING | Args.Optional, _default: 'GET' },
			{ uri: Args.STRING | Args.Required}
		], [requestOptions]);

			
	if (options.method == 'GET'){
		options.qs = parameters;
	} else if (this.isJson) {
		options.body = parameters;
	} else {
		options.form = parameters;
	}
	
	options.baseUrl = baseUrl;
	return options;
}


module.exports = FeignRequestClient;