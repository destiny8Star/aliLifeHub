requirejs.config({
	baseUrl:"js/",
    paths:{
    	"hello":"apps/hello",
    	"index":"apps/index",
		"jquery": "https://code.jquery.com/jquery-3.2.1.min",
		"wjs":"http://res.wx.qq.com/open/js/jweixin-1.4.0",
		"wui":"https://cdn.bootcss.com/jquery-weui/1.2.1/js/jquery-weui.min",
		"flex":"apps/flexible",
		"ajs":"https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min"
	},
	shim: {
	    "wui": {
	           deps: ['jquery'],
	         },
    }
})
requirejs(["hello", "index", "jquery", "wjs","wui","ajs"],function(hello,index,$,wjs,wui,ajs){
    //    ajs.confirm('Hello Alipay!', function (result) {
	// 	  ap.showToast(result.confirm ? '确定' : '取消');
	//   });
}) 