requirejs.config({
    baseUrl:"../js/",
    paths:{
        "flex": "apps/flexible",
        "public": "apps/public",
        "swx": "apps/setWx-config",
        "jquery": "https://code.jquery.com/jquery-3.2.1.min",
        "wui": "https://cdn.bootcss.com/jquery-weui/1.2.1/js/jquery-weui.min",
        "ajs": "https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min"
    },
    shim:{
        "wui": {
            deps: ['jquery'],
        },
    }
})
requirejs(["jquery",  "wui", "flex", "ajs", "public", "swx",], function ($, wui, flex, ajs, public, swx){
    let openId = localStorage.getItem("openid")
    //获取店铺id
    var storeUserId = public.getUrlParms("storeUserId");
    if (storeUserId) {
        $(".hbPhone").show()
        $(".getHb").hide()
    }
    console.log('storeUserId', openId, storeUserId)
    //获取验证码
    let flag = true
    $(".bnt-code").click(function () {
        let mobile = $(".phone").val()
        if (mobile) {
            if (flag) {
                flag = false
                let num = 60;
                $(this).addClass("btn-yzmN").text("重新获取 (" + num + "S)")
                let intTime = setInterval(function () {
                    num--;
                    if (num > 0) {
                        $(".bnt-code").text("重新获取 (" + num + "S)")

                    } else {
                        clearInterval(intTime)
                        num = 0;
                        $(".bnt-code").removeClass("btn-yzmN").text("获取验证码")
                        flag = true
                    }
                }, 1000)
                public.getPCode(mobile)
            } else {
                return
            }

        } else {
            ajs.showToast({
                content: "请输入手机号",
                type: "fail"
            });
        }
    })
    // 点击确认绑定
    $(".weui-btn_co").click(function () {
        let Cphone = $(".phone").val()
        let Ccode = $(".codeB").val()
        let timestamp = public.getTimes()
        console.log(Cphone, Ccode)
        if (Cphone && Ccode) {
            ajs.showLoading("加载中");
            $.ajax({
                url: public.baseUrl + "/api/third/bindOpenidAndUser",
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
                            type:"success",
                            duration: 3000
                        }, function () {
                                $(".hbPhone").hide()
                                $(".getHb").show()
                        });
                    } else if(res.code==500){
                        ajs.showToast({
                            content: "网络异常",
                            type: "fail"
                        });
                    }else{
                        ajs.showToast({
                            content: res.message,
                            type: "fail"
                        }); 
                    }
                }
            })
        } else {
            ajs.showToast({
                content: "请填写完整",
                type: "fail"
            });
        }
    })
    //去使用
    $(".goUse").click(function () {
        location.href = "/business.html"
    })
    //去下载
    $(".goDown").click(function () {
        location.href = "/my/down.html"
    }) 
})