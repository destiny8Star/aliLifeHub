define(["jquery","ajs","public","wui"],function($,ajs,public){
    //生成时间戳
    let timestamp = new Date().getTime()
    //生成随机字符串
    function randomString(len) {
        len = len || 32;
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
        var maxPos = chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
    let nonceStr = randomString(16)
    //登录函数
    function authorize(code, timestamp) {
        ajs.showLoading("加载中")
        $.ajax({
            url: public.baseUrl + "/api/third/aliAuth",
            method: "POST",
            async: false,
            data: {
                code: code,
                timestamp: timestamp,
                deviceType: "3"
            },
            dataType: "json",
            success: function (res) {
                ajs.hideLoading();
                if (res.code == 200) {
                    let openid = res.data
                    localStorage.setItem("openid", openid)
                } else {
                    ajs.showToast({
                        content: "网络异常",
                        type: "fail"
                    });
                }
            }
        })
    }
 
    //获取店铺信息
    function getShopInfo(openid, storeId, timestamp2, auth_code,isF) {
        ajs.showLoading("加载中")
        $.ajax({
            url: public.baseUrl + "/api/thirdStore/payeeParam",
            method: "POST",
            data: {
                openid: openid,
                storeId: storeId,
                timestamp: timestamp2,
                deviceType: "3"
            },
            dataType: "json",
            success: function (res) {
                ajs.hideLoading();
                console.log(res)
                if (res.code == 200) {
                    let info = res.data
                    // storeUserId = info.storeUserId
                    discount = info.discount
                    $(".bt-leq").text("平台补贴" + discount + "%")
                    ajs.setNavigationBar(info.storeName);
                } else if (res.code == 11081) {
                    if(isF){
                        isF=false
                        authorize(auth_code, timestamp2)
                        openid = localStorage.getItem("openid");
                        getShopInfo(openid, storeId, timestamp2, auth_code,isF)
                    }else{
                        ajs.showToast({
                            content: "网络异常",
                            type: "fail"
                        });
                    }
                } else {
                    ajs.showToast({
                        content:"res.message",
                        type: "fail"
                    });
                }
            },
            error: function () {
                ajs.hideLoading();
                ajs.showToast({
                    content: "网络异常",
                    type: "fail"
                });
            }
        })
    }
    return {
        randomString:randomString,
        authorize:authorize,
        getShopInfo:getShopInfo,
        nonceStr:nonceStr,
        timestamp: timestamp
    }
})
