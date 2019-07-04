requirejs.config({
    baseUrl:"../js/",
    paths: {
        "flex": "apps/flexible",
        "public": "apps/public",
        "swx": "apps/setWx-config",
        "md5": "libs/jQuery.md5",
        "jquery": "https://code.jquery.com/jquery-3.2.1.min",
        "wui": "https://cdn.bootcss.com/jquery-weui/1.2.1/js/jquery-weui.min",
        "ajs": "https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min",
    },
    shim: {
        "wui": {
            deps: ['jquery'],
        },
        "md5":{
            deps: ['jquery'],
        }
    }
})
requirejs(["jquery", "wui", "flex", "ajs", "public", "swx", "md5"], function ($, wui, flex, ajs, public, swx, md5){
    //判断是否返回页面
    // console.log(ajs)
    // var isPageHide = false;
    // window.addEventListener('pageshow', function () {
    //     if (isPageHide) {
    //         console.log("重新来了")
    //         window.location.reload();
    //     }
    // });
    // window.addEventListener('pagehide', function () {
    //     console.log("走了")
    //     isPageHide = true;
    // });
    ajs.onPageResume(function () {
        window.location.reload();
    });

    //进页面让输入框为空
    $(".dk").val("")
    let timestamp2 = public.getTimes()
    var info; //获取绑定信息
    var payMethod = false; //true:选中wx,false：不选
    var inp = Number(public.getUrlParms("inp")); //要付款金额
    var price = 0; //输入的要抵扣的金额
    $("h1").text(inp)
    $(".pay-bot-titM").text("(剩余应支付¥" + (inp - price) + ")")
    //获取地址栏参数
    let openid = localStorage.getItem("openid");
    var storeId = public.getUrlParms("storeId"); //从地址栏获取storeid
    var storeUserId; //定义获取商铺id
    console.log("openid", openid, storeId, inp)
    //进入页面获取storeid；
    function getShopInfo2(openid, storeId, timestamp2) {
        ajs.showLoading("数据加载中")
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
                    let str = '';
                    info = res.data
                    storeUserId = info.storeUserId
                    $(".selTop-bot").text('账户余额(￥' + info.balance + ')')
                    if (info.isHavePsd == 0 || info.isBindUser == 0) { $(".dk").attr("disabled", true) }
                    //添加最多可抵扣
                    if (info.balance > inp) {
                        $(".dk").attr("placeholder", "可抵扣" + inp + "元")
                    } else {
                        $(".dk").attr("placeholder", "可抵扣" + info.balance + "元")
                    }
                } else {
                   
                    ajs.showToast({
                        content: res.message,
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
    getShopInfo2(openid, storeId, timestamp2)

    //选择支付
    // $(".pay-bot-item2").click(function () {
    //     payMethod = !payMethod
    //     if (payMethod) {
    //         $(this).children(".pay-type").html('<img src="../img/GX-yixuan.png" alt="">')
    //     } else {
    //         $(this).children(".pay-type").html('<div class="circle"></div>')
    //     }
    // })
    //判断是否绑定手机号
    $(".selMin").click(function () {
        if (info.isBindUser == 0 && info.balance > 0) {
            $(".bindPhone").show()
            $(".phone").focus()
            return
        }
        if (info.isHavePsd == 0) {
            $(".phone").focus()
                   ajs.confirm({
                        title: '提示',
                        content: "请先设置密码",
                        confirmButtonText: '去设置',
                        cancelButtonText: '暂不需要'
                    }, function (result) {
                        // ajs.alert('' + result.confirm);
                        if(result.confirm){
                            ajs.pushWindow("/my/changeKey.html");
                            // location.href = "/my/changeKey.html"
                        }
                    });
            }
    })


    //输入金额
    $(".dk").keyup(function () {
        // let keyMon = public.NumberCheck($(this).val())
        // $(this).val(keyMon)

        let keyMon = $(this).val()
        if (keyMon.indexOf(".") != -1) {
            let len = keyMon.substr(keyMon.indexOf(".") + 1)
            console.log("Aaaa", len.length)
            if (len.length > 2) {
                keyMon = ""
                $(this).val("")
            }
        }
        let bodyMon = Number(info.balance)  
        let toMon = inp
        // console.log($(this).val(), keyMon, bodyMon, toMon, typeof keyMon,typeof bodyMon,typeof toMon)
        if (keyMon > toMon || keyMon > bodyMon) {
            if (toMon > bodyMon) {
                $(this).val(bodyMon)
            } else {
                $(this).val(toMon)
            }
        }
        price = $(this).val()
        if (inp > price) {
            $(".pay-type").html('<img src="../img/GX-yixuan.png" alt="">')
        } else {
            $(".pay-type").html('<div class="circle"></div>')
        }
        $(".pay-bot-titM").text("(剩余应支付¥" + ((inp * 1000 - price * 1000) / 1000).toFixed(2) + ")")
    })
    //全部抵用
    $(".allMon").click(function () {
        if (info.isHavePsd == 0 || info.isBindUser == 0) return
        let bodyMon = Number(info.balance)
        let toMon = inp
        if (toMon > bodyMon) {
            $(".dk").val(bodyMon)
            price = bodyMon
        } else {
            $(".dk").val(toMon)
            price = toMon
        }
        if (inp > price) {
            $(".pay-type").html('<img src="../img/GX-yixuan.png" alt="">')
        } else {
            $(".pay-type").html('<div class="circle"></div>')
        }
        $(".pay-bot-titM").text("(剩余应支付¥" + ((inp * 1000 - price * 1000) / 1000).toFixed(2) + ")")
    })

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
    //取消绑定手机号
    $(".cancelB").click(function () {
        $(".bindPhone").hide()
    })
    //绑定手机号
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
                    openid: openid,
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
                            content: '绑定成功',
                            duration: 3000,
                            type: "success",
                        }, function () {
                                $(".bindPhone").hide()
                                getShopInfo2(openid, storeId, timestamp)
                        });

                    } else if(res.code==500) {
                       
                        ajs.showToast({
                            content: "网络异常",
                            type: "fail"
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
    //支付函数
    // payMethod:2微信，3余额,1支付宝
    function toPay(payMethod, price, balance, storeUserId, openid, transPwd, info) {
        let timestamp = public.getTimes()
        ajs.showLoading("加载中")
        $.ajax({
            url: public.baseUrl + "/api/pay/payee",
            method: "POST",
            data: {
                payMethod: payMethod,
                price: price,
                balance: balance,
                storeUserId: storeUserId,
                orderType: "4",
                openid: openid,
                timestamp: timestamp,
                deviceType: "3",
                transPwd: transPwd
            },
            success: function (res) {
                ajs.hideLoading();
                let trad=res
                console.log("Zhi福结果", trad)
                if (res.code == 200) {
                    if (payMethod == 3) {
                    
                        ajs.showToast({
                            content: '支付成功',
                            duration: 3000,
                            type: "success",
                        }, function () {
                                $(".key-inp").val("")
                                $("i").removeClass("i-show")
                                num = 0
                                $(".mask").removeClass("show-mask")
                                // location.href = "/business/payEnd.html?storeId=" + storeId + "&amount=" + inp
                                ajs.redirectTo("http://"+location.host+"/business/payEnd.html?storeId=" + storeId + "&amount=" + inp) 

                        });
                    } else {
                        ajs.tradePay({
                            orderStr: res.data
                        }, function (res) {
                                if (res.resultCode == 9000){
                                    if (info.isBindUser == 1) {
                                        ajs.redirectTo("http://" + location.host + "/business/payEnd.html?storeId=" + storeId + "&amount=" + inp) 
                                    } else {
                                        // location.href = "/business/payEnd.html?storeUserId=" + info.storeUserId + "&storeId=" + storeId + "&amount=" + inp
                                        ajs.redirectTo("http://" + location.host + "/business/payEnd.html?storeUserId=" + info.storeUserId + "&storeId=" + storeId + "&amount=" + inp) 
                                    }
                                }else{
                                    ajs.showToast({
                                        content: "支付失败",
                                        type: "fail"
                                    });
                                }
                        });
                    }
                } else {
            
                    ajs.showToast({
                        content:res.message,
                        duration: 3000,
                        type: "fail",
                    }, function () {
                            $(".key-inp").val("")
                            $("i").removeClass("i-show")
                            num = 0
                            $(".mask").removeClass("show-mask")
                    });
                }
            }
        })
    }
    //输入密码
    let num = 0; //做是否删除对比
    $(".key-inp").keyup(function () {
        let key = $(this).val()
        let length = key.length;
        console.log(length, num)
        if (length > 6) return
        if (length == 6) {
            $($("i")[5]).addClass("i-show")
            key += "djsh@#$*"
            key = $.md5(key)
            // alert("请求")
            console.log("请求接口", payMethod, price, storeUserId)
            toPay(3, price, "", storeUserId, openid, key, info)

        } else if (length > num) {
            for (let i = 0; i < key.length; i++) {
                console.log($($("i")[i]))
                $($("i")[i]).addClass("i-show")
            }
        } else if (length < num) {
            $($("i")[length]).removeClass("i-show")
        }
        num = length
    })
    //取消
    $(".mask-cancel").click(function () {
        $(".key-inp").val("")
        num = 0
        $("i").removeClass("i-show")
        $(".mask").removeClass("show-mask")
    })

    //确认支付
    $(".weui-btn_zf").click(function () {
        let wxMon = ((inp * 1000 - price * 1000) / 1000).toFixed(2)
        console.log("price", price, inp, wxMon)
        if (price == inp) {
            //支付密码
            $(".mask").addClass("show-mask")
            $(".key-inp").focus()
        } else {
            if (price) {
                toPay(1, inp, price, storeUserId, openid, "", info)
            } else {
                toPay(1, wxMon, "", storeUserId, openid, "", info)
            }
        }

    })
})