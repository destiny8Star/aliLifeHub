requirejs.config({
    baseUrl: "../js/",
    paths: {
        "flex": "apps/flexible",
        "public": "apps/public",
        "jquery": "https://code.jquery.com/jquery-3.2.1.min",
        "wui": "https://cdn.bootcss.com/jquery-weui/1.2.1/js/jquery-weui.min",
        "ajs": "https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min"
    },
    shim: {
        "wui": {
            deps: ['jquery'],
        },
    }
})
requirejs(["jquery", "wui", "flex", "ajs", "public" ], function ($, wui, flex, ajs, public) {
    ajs.showLoading("加载中")
    $.ajax({
        url: public.baseUrl + "/api/systemConstant/discountsThat",
        method: "POST",
        data: {
            timestamp: "121",
            deviceId: "1",
            appVersion: "1",
            deviceType: "1",
            phoneSystemVersion: "1"
        },
        success: function (res) {
            ajs.hideLoading();
            console.log("获取信息", res)
            if (res.code == 200) {
                let info = res.data
                let arr = info.split("*")
                let str = ''
                $.each(arr, function (i, e) {
                    if (e) {
                        str += '<span class="mask-cont">*' + e + '</span>'
                    }
                })
                $(".mask-box").append(str)
            } else {
                ajs.showToast({
                    content: "网络异常",
                    type: "fail"
                });
            }
        }
    })
})