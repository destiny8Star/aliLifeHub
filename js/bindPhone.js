requirejs.config({
    baseUrl: "../js/",
    paths: {
        "flex": "apps/flexible",
        "public": "apps/public",
        "swx": "apps/setWx-config",
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
require(["jquery", "wui", "flex", "ajs", "public", "swx",], function ($, wui, flex, ajs, public, swx){
    let openId = localStorage.getItem("openid")
    console.log("o111", openId)
    //获取店铺id

    var storeUserId = public.getUrlParms("storeUserId");
    console.log('storeUserId', storeUserId)


    //获取验证码
    // function getPCode(mobile) {
    //     let timestamp = public.getTimes()
    //     $.ajax({
    //         url: public.baseUrl + "/api/third/smsCode",
    //         method: "POST",
    //         data: {
    //             mobile: mobile,
    //             timestamp: timestamp,
    //             deviceType: "3"
    //         },
    //         dataType: "json",
    //         success: function (res) {
    //             console.log("code", res)
    //         }
    //     })
    // }

    $(".btn-yzm").click(function () {
        let mobile = $("input[name='cPhone']").val()
        if (mobile) {
            let num = 60;
            $(this).addClass("btn-yzmN").attr("disabled", "true").text("重新获取 (" + num + "S)")
            let intTime = setInterval(function () {
                num--;
                if (num > 0) {
                    $(".btn-yzm").text("重新获取 (" + num + "S)")

                } else {
                    clearInterval(intTime)
                    num = 0;
                    $(".btn-yzm").removeClass("btn-yzmN").removeAttr("disabled").text("获取验证码")
                }

            }, 1000)
            public.getPCode(mobile)
        } else {
            
            ajs.showToast({
                content: "请输入手机号",
                type: "fail"
            });
        }
    })
    // 点击确认
    $(".weui-btn_zf").click(function () {
        let Cphone = $("input[name='cPhone']").val()
        let Ccode = $("input[name='cCode']").val()
        let timestamp = public.getTimes()
        console.log(Cphone, Ccode)
        if (Cphone && Ccode) {
            ajs.showLoading("加载中");
            $.ajax({
                url: baseUrl + "/api/third/bindOpenidAndUser",
                method: "POST",
                data: {
                    openid: openId,
                    timestamp: timestamp,
                    deviceType: "3",
                    mobile: Cphone,
                    mobileAuthCode: Ccode,
                    storeUserId: storeUserId
                },
                dataType: "json",
                success: function (res) {
                    ajs.hideLoading();
                    console.log("绑定结果", res)
                    if (res.code == 200) {
                        ajs.showToast({
                            content: "绑定成功",
                            type: "success",
                            duration: 3000
                        }, function () {
                            // history.back(-1)
                                ajs.popTo(-1);
                        });
                    } else {
                       
                        ajs.showToast({
                            content: res.message,
                            type: "fail"
                        });
                    }
                }
            })
        } else {
            
            ajs.showToast({
                content: "请输入完整",
                type: "fail"
            });
        }
    })
})