requirejs.config({
    baseUrl: "../js/",
    paths: {
        "flex": "apps/flexible",
        "public": "apps/public",
        "md5": "libs/jQuery.md5",
        "jquery": "https://code.jquery.com/jquery-3.2.1.min",
        "wui": "https://cdn.bootcss.com/jquery-weui/1.2.1/js/jquery-weui.min",
        "ajs": "https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min",
    },
    shim: {
        "wui": {
            deps: ['jquery'],
        },
        "md5": {
            deps: ['jquery'],
        }
    }
})
requirejs(["jquery",  "wui", "flex", "public",  "md5","ajs"], function ($,wui, flex, public,  md5,ajs) {

    let openId = localStorage.getItem("openid")
    console.log("o111", openId)
    //获取验证码
    $(".btn-yzm").click(function () {
        let mobile = $("input[name='cPhone']").val()
        if (mobile) {
            let num = 60;
            console.log("aaa")
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
                type:"fail"
            });
        }
    })
    //输入数字
    $(".ck-input").keyup(function () {
        let inp = $(this).val()
        let reg = /^\d*$/
        if (!reg.test(inp)) {
            $(this).val("")
        }
    })
    // 点击确认
    $(".weui-btn_zf").click(function () {
        let Cphone = $("input[name='cPhone']").val()
        let Ccode = $("input[name='cCode']").val()
        let Cpass = $("input[name='cPass']").val()
        let timestamp = public.getTimes()
        let reg = /^\d{6}$/;
        if (!reg.test(Cpass)) {
            ajs.showToast({
                content: "请输入6位密码",
                type: "fail"
            });
            return
        }
        if (Cphone && Ccode && Cpass) {
            ajs.showLoading("加载中");
            Cpass += "djsh@#$*"
            Cpass = $.md5(Cpass)
            $.ajax({
                url: public.baseUrl + "/api/third/updateTransPwd",
                method: "POST",
                data: {
                    openid: openId,
                    mobileAuthCode: Ccode,
                    transPwd: Cpass,
                    timestamp: timestamp,
                    deviceType: '3'
                },
                dataType: "json",
                success: function (res) {
                    ajs.hideLoading();
                    console.log("绑定结果", res)
                    if (res.code == 200) {
                        ajs.showToast({
                            content: "设置成功",
                            duration: 3000,
                            type: "success",
                        }, function () {
                            ajs.popTo(-1)
                        });
                    } else if(res.code==500){
                        ajs.showToast({
                            content: "网络异常",
                            type: "fail"
                        });
                    } 
                    else {
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