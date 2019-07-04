requirejs.config({
    baseUrl:"../js/",
    paths:{
        "flex": "apps/flexible",
        "public":"apps/public",
        "swx":"apps/setWx-config",
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
requirejs(["jquery", "wui", "flex", "ajs", "public","swx"], function ($,  wui, flex, ajs, public,swx){

    let timestamp2 = public.getTimes()
    console.log(timestamp2)
    var info; //获取绑定信息
    var payMethod = 2; //2-wx,3-余额
    var price; //支付金额
    price = $(".m-input").val()
    if (price && price > 0) {
        $(".weui-btn").addClass("weui-btn_zf")
    } else {
        $(".weui-btn").removeClass("weui-btn_zf")
    }
    //获取地址栏参数
    var auth_code = public.getUrlParms("auth_code");
    let openid = localStorage.getItem("openid");
    // ajs.confirm({
    //     title: '提示',
    //     content: "openid"+openid,
    // });
    if (!openid) {
        swx.authorize(auth_code, timestamp2)
        openid = localStorage.getItem("openid");
    }
    var storeId = public.getUrlParms("storeId"); //从地址栏获取storeid
    var storeUserId; //定义获取商铺id
    console.log("openid", openid, storeId)

    //进入页面获取storeid；
    let isF=true; //只重新授权一次，因为code只能用一次
    swx.getShopInfo(openid, storeId, timestamp2, auth_code,isF)
    //输入金额
    // let reg= /^\d+(\.\d{1,2})?$/

    $(".m-input").keyup(function() {
            //  price = public.NumberCheck($(this).val())
            //  $(this).val(price) 
            price=$(this).val()
            if(price.indexOf(".")!=-1){
                let len=price.substr(price.indexOf(".")+1)
                console.log("Aaaa", len.length)
                if(len.length>2){
                      price =""
                      $(this).val("") 
                }
            }
            console.log("pice",price)
            if (price && price > 0.01 || price == 0.01) {
                $(".weui-btn").addClass("weui-btn_zf")
            } else {
                $(".weui-btn").removeClass("weui-btn_zf")
            }

        })
    //确认支付
    // console.log("url",serUrl)
    $(".weui-btn").click(function() {
        if (price < 0.01) return
        // ajs.redirectTo({ url: "http://" + location.host + "/business/selPay.html", data: { inp: price, storeId:storeId}});
         location.href= "/business/selPay.html?inp="+price+"&storeId="+ storeId
        // location.replace("http://" + location.host + "/business/selPay.html")
        
    })
})