define(["jquery"],function($){
    // var baseUrl = "http://test.dianjishenghuo.cn"//测试环境接口域名
    //  var baseUrl = "http://djsh.vipgz1.idcfengye.com" //本地环境
     var baseUrl = "https://product.dianjishenghuo.cn"//开发环境接口域名

    // var baseUrlz = "http://linzhiying.natapp1.cc"//本地接口域名
    // var serUrl = window.location.hostname;
    //  var serUrl = "http://wechattest.dianjishenghuo.cn"  //存放的测试环境的域名
    //  var serUrl = "http://wechat.dianjishenghuo.cn" //存放的生产环境的域名
    //获取地址栏参数
    function getUrlParms(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
    }
    //时间戳
    function getTimes() {
        return Math.round(new Date().getTime() / 1000)
    }

    //获取验证码
    function getPCode(mobile) {
        let timestamp = getTimes()
        $.ajax({
            url: baseUrl + "/api/third/smsCode",
            method: "POST",
            data: {
                mobile: mobile,
                timestamp: timestamp,
                deviceType: "3"
            },
            dataType: "json",
            success: function (res) {
                // if(res.code==200){
                //   return
                // }else{
                //     $.toast(res.message,"cancel")
                // }
                console.log("code", res)
            }
        })
    }
 
    //数字判断
    function NumberCheck(num) {
        var str = num;
        var len1 = str.substr(0, 1);
        var len2 = str.substr(1, 1);
        //如果第一位是0，第二位不是点，就用数字把点替换掉
        if (str.length > 1 && len1 == 0 && len2 != ".") {
            str = str.substr(1, 1);
        }
        //第一位不能是.
        if (len1 == ".") {
            str = "";
        }
        //限制只能输入一个小数点
        if (str.indexOf(".") != -1) {
            var str_ = str.substr(str.indexOf(".") + 1);
            if (str_.indexOf(".") != -1) {
                str = str.substr(0, str.indexOf(".") +str_.indexOf(".") +1);
            }
        }
        //正则替换，保留数字和小数点
        // str = str.replace(/[^\d^\.]+/g, '')
        //如果需要保留小数点后两位，则用下面公式
        str = str.replace(/\.\d{3,}$/, '')
        return str;
    }

    return{
        baseUrl: baseUrl,
        getUrlParms: getUrlParms,
        getTimes: getTimes,
        getPCode: getPCode,
        NumberCheck: NumberCheck
    }
})  
  
 