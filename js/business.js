requirejs.config({
    baseUrl: "js/",
    paths: {
        "flex": "apps/flexible",
        "public": "apps/public",
        "swx": "apps/setWx-config",
        "jquery": "https://code.jquery.com/jquery-3.2.1.min",
        "wui": "https://cdn.bootcss.com/jquery-weui/1.2.1/js/jquery-weui.min",
        "ajs": "https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min",
        "Swiper":"libs/swiper.min"
    },
    shim: {
        "wui": {
            deps: ['jquery'],
        },
      
    }
})
requirejs(["jquery", "wui", "flex", "ajs", "public", "swx","Swiper"],function($,wui,flex,ajs,public,swx,Swiper){
    //登录授权
    var code = public.getUrlParms("auth_code");
    let openid = localStorage.getItem("openid");
    let timestamp = public.getTimes()
    if (!openid) {
        swx.authorize(code, timestamp)
        openid = localStorage.getItem("openid");
    }
    //判断是否返回页面
    var isPageHide = false;
    window.addEventListener('pageshow', function () {
        if (isPageHide) {
            window.location.reload();
        }
    });
    window.addEventListener('pagehide', function () {
        isPageHide = true;
    });
   

    //是否绑定手机号,判断是否需要重新授权
    function isBind(openid, isF) {
        $.ajax({
            url: public.baseUrl + "/api/third/Mall/isCardUser",//zy接口
            data: {
                timestamp: "121",
                deviceId: "1",
                appVersion: "1",
                deviceType: "1",
                phoneSystemVersion: "1",
                openId: openid
            },
            method: "POST",
            dataType: "json",
            success: function (res) {
                console.log("板顶结果", res)
                if (res.code == 200) {
                    return
                } else if (res.code == 11081) {
                    if(isF){
                      isF=false
                     swx.authorize(code, timestamp)
                    openid = localStorage.getItem("openid");
                    //重新调用
                    isBind(openid, isF)
                    }
                 
                } else {
                    ajs.showToast({
                        content: "网络异常",
                        type: "fail"
                    });
                }
            }
        })
    }
    let isF=true
    isBind(openid, isF)

    var cityAred = JSON.parse(localStorage.getItem("dcity"));//获取定位的城市
    var cityAre = JSON.parse(localStorage.getItem("city")) || cityAred;//获取选择的城市
    var address = JSON.parse(localStorage.getItem("address")) //获取经纬度
    console.log("获取城市", cityAre, address)
    if (!cityAred) {
        $(".lack").show()
        
        getLoc()
    } else if (cityAre) {
        $(".add-woc").text(cityAre.city)
    } else {
        $(".add-woc").text(cityAred.city)
    }
    //获取位置
    function getLoc(){
        ajs.getLocation({ type: 1 }, function (res) {
            if(res.error==11){
               return 
            }
            $(".lack").hide()
            address={
                longitude: res.longitude,
                latitude: res.latitude
            }//经纬度
            // ajs.confirm({
            //     title: '温馨提示',
            //     content: res,
            //     confirmButtonText: '马上查询',
            //     cancelButtonText: '暂不需要'
            // }, );
            localStorage.setItem("address", JSON.stringify(address))
            let adds =res.address
            // let reg = /市.+?区/
            // let district = adds.match(reg)[0].slice(1)
            let citys = { "province": res.province, "city": res.city}
                cityAred =citys
                cityAre = citys
                $(".add-woc").text(cityAred.city)
                let city = JSON.stringify(citys)
                localStorage.setItem("dcity", city)
                loadlist(1, type, cid);
        });
    }
    //手动获取
    $(".weui-btn").click(function () {
        getLoc()
    })
    //---------------------------------------------------
    var cursor = 1;//页数
    var tops;  //tab距离顶部的高度
    // var size = 4;
    var loading = false; //状态标记
    var type = 1; //默认选中tab
    var aid; //分类1及
    var cid;//选中的分类
    $(function () {
        ajs.showLoading("加载中");
        tabList();
        if (cityAred) {
            loadlist(1, type, cid)
        }

    })
    //=========================下拉刷新
    $("#listwrap").pullToRefresh().on("pull-to-refresh", function () {
        setTimeout(function () {
            cursor = 1;
            console.log("loading", loading)
            if (loading) loading = false;
            loadlist(1, type, cid);
            tabList();
            tops -= 50
            $("#listwrap").pullToRefreshDone(); // 重置下拉刷新
        }, 1500); //模拟延迟
    });
    //============================滚动加载
    $("#listwrap").infinite().on("infinite", function () {
        console.log("loading", cursor)
        if (loading) return;
        loading = true;

        $(".weui-cells__title").removeClass("show-more")
        $('.weui-loadmore').show();
        setTimeout(function () {
            loadlist(cursor, type, cid);
            loading = false;
            // console.log("gd", loading)
        }, 500); //模拟延迟
    });
    // =======加载数据loadlist();
    function tabList() {
        $.ajax({
            url: public.baseUrl + "/api/third/Mall/banner",//zy接口
            type: "POST",
            async: false,
            data: {
                timestamp: "121",
                deviceId: "1",
                appVersion: "1",
                deviceType: "1",
                phoneSystemVersion: "1"
            },
            dataType: "json",
            success: function (res) {
                ajs.hideLoading();
                console.log("banner", res)
                if (res.code == 200) {
                    let data = res.data
                    let str = ""
                    $.each(data, function (i, e) {
                        switch (e.targetWay) {
                            case 0: str += '<a href="#"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                            case 1: str += '<a href="#"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                            case 2: str += '<a href="#"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                            case 3: str += '<a href="' + e.linkUrl + '"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                            case 4: str += '<a href="#"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                            case 5: str += '<a href="business/detail.html?storeId=' + e.targetId + '"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                            case 6: str += '<a href="#"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                            case 7: str += '<a href="business/busListB.html?cid=' + e.targetId + '"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                        }
                    })
                    $(".bus-type").html(str)
                    tops = $(".tabBox").offset().top;
                    console.log("top", tops)
                } else {
                    ajs.showToast({
                        content: "网络异常",
                        type: "fail"
                    });
                }
            }
        })
    }
    function loadlist(page, type, cid) {
         
        console.log("cityAre", cityAred)
        ajs.showLoading("加载中")
        let datas = {
            timestamp: "121",
            deviceId: "1",
            appVersion: "1",
            deviceType: "1",
            phoneSystemVersion: "1",
            cursor: page,
            city: cityAre.city,
            //    area: cityAre.district,
            ownCity: cityAred.city,
            status: type,
            longitude: address.longitude,
            latitude: address.latitude,
            cid: cid
        }
        $.ajax({
            type: "POST",
            url: public.baseUrl + "/api/third/Mall/list/total",//zy接口
            data: datas,
            dataType: "json",
            error: function (request) {
             
                $(".weui-loadmore").hide();
                $(".weui-cells__title").addClass("show-more")
            },
        
            success: function (res) {
                ajs.hideLoading();
                console.log("list", res)
                if (res.code == 200 && res.data.data.length > 0) {
                    let data = res.data.data
                    let str = ""
                    $.each(data, function (i, e) {
                        if (e.categoryName) {
                            if (e.detailPic.length > 0) {
                                if (e.detailPic.length == 1) {
                                    str += '<a href="business/detail.html?storeId=' + e.storeId + '"><div class="store-item-box"><div class="store-item flex"><div class="store-item-img"><img src="' + e.storeUrl + '" alt=""></div><div class="store-item-woc"><div class="store-item-tits flex"><h3 class="store-tit">' + e.storeName + '</h3><div class="store-tit-ico">' + e.discount + '</div> </div><div class="store-det"><span>' + e.categoryName + '</span> | <span class="mood">销量' + e.sentiment + '</span></div><p class="store-add flex_bet"><span class="storeAdd-left">' + e.address + '</span><span class="storeNum">' + e.distance + '</span></p></div></div><div class="store-item-imgs flex_bet"><img src="' + e.detailPic[0] + '" alt=""></div></div></a>'
                                } else {
                                    str += '<a href="business/detail.html?storeId=' + e.storeId + '"><div class="store-item-box"><div class="store-item flex"><div class="store-item-img"><img src="' + e.storeUrl + '" alt=""></div><div class="store-item-woc"><div class="store-item-tits flex"><h3 class="store-tit">' + e.storeName + '</h3><div class="store-tit-ico">' + e.discount + '</div> </div><div class="store-det"><span>' + e.categoryName + '</span> | <span class="mood">销量' + e.sentiment + '</span></div><p class="store-add flex_bet"><span class="storeAdd-left">' + e.address + '</span><span class="storeNum">' + e.distance + '</span></p></div></div><div class="store-item-imgs flex_bet"><img src="' + e.detailPic[0] + '" alt=""><img src="' + e.detailPic[1] + '" alt=""></div></div></a>'
                                }
                            } else {
                                str += '<a href="business/detail.html?storeId=' + e.storeId + '"><div class="store-item-box"><div class="store-item flex"><div class="store-item-img"><img src="' + e.storeUrl + '" alt=""></div><div class="store-item-woc"><div class="store-item-tits flex"><h3 class="store-tit">' + e.storeName + '</h3><div class="store-tit-ico">' + e.discount + '</div> </div><div class="store-det"><span>' + e.categoryName + '</span> | <span class="mood">销量' + e.sentiment + '</span></div><p class="store-add flex_bet"><span class="storeAdd-left">' + e.address + '</span><span class="storeNum">' + e.distance + '</span></p></div></div></div></a>'
                            }
                            // str += '<a href="business/detail.html?storeId=' + e.storeId + '"><div class="store-item flex"><div class="store-item-img"><img src="' + e.storeUrl+ '" alt=""></div><div class="store-item-woc"><h3 class="store-tit">' + e.storeName + '</h3><div class="store-det"><span></span> | <span>人气' + e.sentiment + '</span></div><p class="store-add">' + e.address + '</p></div></div></a>'
                        } else {
                            if (e.detailPic.length > 0) {
                                if (e.detailPic.length == 1) {
                                    str += '<a href="business/detail.html?storeId=' + e.storeId + '"><div class="store-item-box"><div class="store-item flex"><div class="store-item-img"><img src="' + e.storeUrl + '" alt=""></div><div class="store-item-woc"><div class="store-item-tits flex"><h3 class="store-tit">' + e.storeName + '</h3><div class="store-tit-ico">' + e.discount + '</div> </div><div class="store-det"><span> </span> | <span class="mood">销量' + e.sentiment + '</span></div><p class="store-add flex_bet"><span class="storeAdd-left">' + e.address + '</span><span class="storeNum">' + e.distance + '</span></p></div></div><div class="store-item-imgs flex_bet"><img src="' + e.detailPic[0] + '" alt=""></div></div></a>'
                                } else {
                                    str += '<a href="business/detail.html?storeId=' + e.storeId + '"><div class="store-item-box"><div class="store-item flex"><div class="store-item-img"><img src="' + e.storeUrl + '" alt=""></div><div class="store-item-woc"><div class="store-item-tits flex"><h3 class="store-tit">' + e.storeName + '</h3><div class="store-tit-ico">' + e.discount + '</div> </div><div class="store-det"><span> </span> | <span class="mood">销量' + e.sentiment + '</span></div><p class="store-add flex_bet"><span class="storeAdd-left">' + e.address + '</span><span class="storeNum">' + e.distance + '</span></p></div></div><div class="store-item-imgs flex_bet"><img src="' + e.detailPic[0] + '" alt=""><img src="' + e.detailPic[1] + '" alt=""></div></div></a>'
                                }
                            } else {
                                str += '<a href="business/detail.html?storeId=' + e.storeId + '"><div class="store-item-box"><div class="store-item flex"><div class="store-item-img"><img src="' + e.storeUrl + '" alt=""></div><div class="store-item-woc"><div class="store-item-tits flex"><h3 class="store-tit">' + e.storeName + '</h3><div class="store-tit-ico">' + e.discount + '</div> </div><div class="store-det"><span> </span> | <span class="mood">销量' + e.sentiment + '</span></div><p class="store-add flex_bet"><span class="storeAdd-left">' + e.address + '</span><span class="storeNum">' + e.distance + '</span></p></div></div></div></a>'
                            }

                        }
                    })
                    cursor++; //页数
                    $(".lack-img-pig").hide()
                    if (page > 1) {
                        $(".bus-store").append(str);
                    } else {
                        $(".bus-store").html(str);
                    }
                    loading = false;
                } else {
                    if (page > 1) {
                        $(".weui-cells__title").addClass("show-more")
                        $(".lack-img-pig").hide()
                    } else {
                        $(".bus-store").empty()
                        $(".lack-img-pig").show()
                        $(".weui-cells__title").removeClass("show-more")
                    }
                    loading = true;
                }
                $(".weui-loadmore").hide();
            },
           
        });
    }
    //滚动添加
    $(".weui-form-preview").scroll(function () {
        let sc = $(".weui-form-preview").scrollTop()
        if (tops - 50 < sc) {
            $(".tabBox").addClass("tabBox-fix")
        } else {
            $(".tabBox").removeClass("tabBox-fix")
        }
    })
    //获取全部按钮的内容
    function getBtn(id, handler) {
        ajs.showLoading("加载中")
        $.ajax({
            type: "POST",
            url: public.baseUrl + "/api/third/Mall/v13/category",//zy接口
            data: {
                timestamp: "121",
                deviceId: "1",
                appVersion: "1",
                deviceType: "1",
                phoneSystemVersion: "1",
                id: id,
            },
            dataType: "json",
            success: function (res) {
                console.log("获取btn", res)
                if (res.code == 200) {
                    ajs.hideLoading()
                    handler(res)
                } else {
                    ajs.showToast({
                        content: "网络异常",
                        type: "fail"
                    });
                }
            }
        })
    }
    //处理函数
    function handBtnL(res) {
        let data = res.data
        let str = ''
        $.each(data, function (i, e) {
            str += ' <div class="tabMask-botL-item" data-id="' + e.cid + '">' + e.categoryName + '</div>'
        })
        $(".tabMask-botL").html(str)
    }
    function handBtnR(res) {
        let data = res.data
        let str = ''
        $.each(data, function (i, e) {
            str += ' <div class="tabMask-botL-item" data-id="' + e.cid + '">' + e.categoryName + '</div>'
        })
        $(".tabMask-botR").html(str)
    }
    //点击taball,中间的"全部"按钮
    let tabFlag = true//第一次点击请求数据
    $(".tabAll").click(function () {
        $(".tabMask").show()
        if (tabFlag) {
            getBtn(0, handBtnL)
            tabFlag = false
        }
        console.log("typeeee", type)
        if (type == 2) {
            $(".tabJl").addClass("selBar")
        } else if (type == 3) {
            $(".tabRq").addClass("selBar")
        }
    })
    //点击上面的taball隐藏
    $(".hideTaball").click(function () {
        $(".tabMask").hide()
    })
    //点击中间的tab
    $(".tabType").click(function () {
        let isType = !$(this).data("type")
        // $(this).data("type",isType)
        console.log("tyoe", isType)
        $(".tabType").removeClass("selBar").data("type", false)
        if (isType) {
            // $(this).addClass("selBar").data("type", true)
            type = $(this).data("type2")
        } else {
            type = 1
        }
        cursor = 1
        loadlist(cursor, type, cid)   //请求数据
        if (type == 2) {
            $(".tabJl").addClass("selBar").data("type", true)
        } else if (type == 3) {
            $(".tabRq").addClass("selBar").data("type", true)
        } else {
            $(".tabType").removeClass("selBar").data("type", false)
        }
        console.log("index", type)
    })
    //选择tab,弹框出来的一级
    $(".tabMask-botL").click(function (e) {
        let id = $(e.target).data("id")
        aid = id;
        cid = id;
        $(e.target).addClass("selTM").siblings().removeClass("selTM")
        if (id) {
            getBtn(id, handBtnR)
        } else {
            $(".tabMask-botR").empty()
            cursor = 1;
            loadlist(cursor, type, cid);
            $(".tabMask").hide()
        }
        console.log(e.target.className, id, cid)

    })
    //选择tab,弹框出来的2级
    $(".tabMask-botR").click(function (e) {
        //   console.log(e.target)
        let id = $(e.target).data("id")
        $(e.target).addClass("selTMI").siblings().removeClass("selTMI")
        if (id) {
            cid = id
        } else {
            cid = aid
        }
        cursor = 1;
        loadlist(cursor, type, cid);
        $(".tabMask").hide()
        console.log("看id", id, cid)
    })
    //取消tab
    $(".tabMask").click(function () {
        $(this).hide()
    })
    //阻止莫阿潘
    $(".tabMask-box").click(function (e) {
        e.stopPropagation()
    })
    //获取顶部banner
    function getBan() {
        $.ajax({
            url: public.baseUrl + "/api/third/Mall/top/banner",//zy接口
            type: "POST",
            async: false,
            data: {
                timestamp: "121",
                deviceId: "1",
                appVersion: "1",
                deviceType: "1",
                phoneSystemVersion: "1"
            },
            dataType: "json",
            success: function (res) {
                console.log("获取banner", res)
                if (res.code == 200) {
                    if (res.data) {
                        let str = '';
                        switch (res.data.targetWay) {
                            case 0: str += '<img src="' + res.data.detailPic + '" alt="" class="topImg">';
                                break;
                            case 1: str += '<img src="' + res.data.detailPic + '" alt="" class="topImg">';
                                break;
                            case 2: str += '<img src="' + res.data.detailPic + '" alt="" class="topImg">';
                                break;
                            case 3: str += '<a href="' + res.data.linkUrl + '"><img src="' + res.data.detailPic + '" alt="" class="topImg"></a>';
                                break;
                            case 4: str += '<img src="' + res.data.detailPic + '" alt="" class="topImg">';
                                break;
                            case 5: str += '<a href="business/detail.html?storeId=' + res.data.targetId + '"><img src="' + res.data.detailPic + '" alt="" class="topImg"></a>';
                                break;
                            case 6: str += '<img src="' + res.data.detailPic + '" alt="" class="topImg">';
                                break;
                            case 7: str += '<a href="business/busListB.html?cid=' + res.data.targetId + '"><img src="' + res.data.detailPic + '" alt="" class="topImg"></a>';
                                break;
                        }
                        $(".topBox").html(str)

                    } else {
                        $(".topBox").hide()
                    }
                    //  $(".topImg").attr("src",)
                } else {
                    ajs.showToast({
                        content: "网络异常",
                        type: "fail"
                    });
                }
            }
        })
        $.ajax({
            url: public.baseUrl + "/api/third/Mall/v13/store/message",//zy接口
            type: "POST",
            async: false,
            data: {
                timestamp: "121",
                deviceId: "1",
                appVersion: "1",
                deviceType: "1",
                phoneSystemVersion: "1"
            },
            dataType: "json",
            success: function (res) {
                console.log("获取通知信息", res)
                if (res.code == 200) {
                    let str = ""
                    $.each(res.data, function (i, e) {
                        str += ' <div class="swiper-slide">' + e + '</div>'
                    })
                    $('.swiper-wrapper').html(str)
                    //swiper组件
                    new Swiper('.swi-tips', {
                        loop: true, // 循环模式选项
                        autoplay: { disableOnInteraction: false },
                        direction: 'vertical',
                        noSwiping: true,
                    })
                } else {
                    ajs.showToast({
                        content: "网络异常",
                        type: "fail"
                    });
                }
            }
        })
    }
    getBan()
})