var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("./framework/runtime/engine");
/**
 * @author Sun
 * @time 2019-08-11 19:05
 * @project SFramework_LayaAir
 * @description 游戏启动入口
 *
 */
class Main {
    // 	Laya["Physics"] && Laya["Physics"].enable();
    // 	Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    // 	//兼容微信不支持加载scene后缀场景
    // 	Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
    // 	//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    // 	if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    // 	if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    // 	if (GameConfig.stat) Laya.Stat.show();
    // 	Laya.alertGlobalError = true;
    // 	//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    // 	// Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    // 	let view = new LoadingView();
    // 	Laya.stage.addChild(view);
    // }
    // onVersionLoaded(): void {
    // 	//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    // 	Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    // }
    // onConfigLoaded(): void {
    // 	//加载IDE指定的场景
    // 	GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    // }
    constructor() {
        engine_1.Engine.$.run();
    }
}
//激活启动类
new Main();
},{"./framework/runtime/engine":29}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scene_base_1 = require("../../framework/manager/ui/scene-base");
var LyScene = scene_base_1.CustomScene.LyScene;
/**
* @author Sun
* @time 2019-08-11 11:20
* @project SFramework_LayaAir
* @description 主场景
*
*/
class MainScene extends LyScene {
    constructor() {
        super();
        this.needLoadRes
            .add("res/bg/123.png", Laya.Loader.IMAGE);
    }
}
exports.MainScene = MainScene;
},{"../../framework/manager/ui/scene-base":27}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
var lotteryUI = layaMaxUI_1.ui.view.com.lotteryUI;
const json_manager_1 = require("../../../framework/manager/json/json-manager");
const enum_1 = require("../../../framework/setting/enum");
const math_1 = require("../../../framework/util/math");
const log_1 = require("../../../framework/core/log");
/**
 * @author Sun
 * @time 2019-08-12 17:31
 * @project SFramework_LayaAir
 * @description 转盘模板
 *
 */
class LotteryView extends lotteryUI {
    constructor() {
        super();
        /****************************************主页面属性设置****************************************/
        /** Des:倍率 */
        this.rewardMul = 2;
        /** Des:转盘数据 */
        this.lotteryData = null;
    }
    static get $() {
        if (this.instance == null)
            this.instance = new LotteryView();
        return this.instance;
    }
    onAwake() {
        super.onAwake();
        this.init();
    }
    close() {
        super.close();
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /****************************************主页面初始数据****************************************/
    init() {
        this.lotteryData = json_manager_1.JsonManager.$.getTable(enum_1.enumJsonDefine.lottery);
        this.btnConfirm.on(Laya.Event.CLICK, this, this.onBtnStart);
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /****************************************主页面点击事件****************************************/
    onBtnStart() {
        let random = math_1.UtilMath.random(1, 100);
        for (let i = 0; i < 6; i++) {
            if (this.lotteryData[i].rangeMin <= random && random <= this.lotteryData[i].rangeMax) {
                this.rewardMul = this.lotteryData[i].reward;
                this.onTurning(i);
                break;
            }
        }
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************转盘动画显示*****************************************/
    onTurning(reward = 0) {
        //关闭关闭按钮显示
        this.btnClose.visible = false;
        //禁用转盘按钮
        this.btnConfirm.mouseEnabled = false;
        //转盘动画
        let aCount = Object.keys(this.lotteryData).length;
        let cIndex = reward;
        let perDeg = 360 / aCount;
        let curDeg = (360 - perDeg * (cIndex - 1)) + math_1.UtilMath.randRangeInt(-perDeg / 2, perDeg / 2);
        this.imgContext.rotation = 0;
        let dstRotation = 3600 + curDeg;
        Laya.Tween.to(this.imgContext, {
            rotation: dstRotation,
        }, 6000, Laya.Ease.strongOut, Laya.Handler.create(this, () => {
            this.btnConfirm.mouseEnabled = true;
            this.btnClose.visible = true;
            log_1.Log.log("倍率：" + this.rewardMul);
        }), 0, false, false);
    }
}
exports.LotteryView = LotteryView;
},{"../../../framework/core/log":9,"../../../framework/manager/json/json-manager":17,"../../../framework/setting/enum":31,"../../../framework/util/math":37,"../../../ui/layaMaxUI":42}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
var bgUI = layaMaxUI_1.ui.view.main.bgUI;
/**
 * @author Sun
 * @time 2019-08-11 11:23
 * @project SFramework_LayaAir
 * @description
 *
 */
class BgView extends bgUI {
    static get $() {
        if (!this.instance)
            this.instance = new BgView();
        return this.instance;
    }
    constructor() {
        super();
    }
    onAwake() {
        super.onAwake();
        this.Init();
        this.suitInit();
    }
    /**
     * 初始化一次
     */
    Init() {
        this.initOnce();
        // //数据监听
        // this.addDataWatch(DataDefine.UserInfo);
        if (Laya.Browser.onWeiXin) {
            this.initLink();
        }
    }
    /**
     * 适配
     */
    suitInit() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************页面初始数据*****************************************/
    /** Des:构造是初始化一次 */
    initOnce() {
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /***************************************外部连接进入判断***************************************/
    /** Des:判断进入连接信息 */
    initLink() {
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************页面事件相关*****************************************/
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /****************************************数据改变的监听****************************************/
    /**
     * 刷新数据
     */
    onData(data) {
    }
}
exports.BgView = BgView;
},{"../../../ui/layaMaxUI":42}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
var d3UI = layaMaxUI_1.ui.view.main.d3UI;
const load3d_1 = require("../../../framework/util/load3d");
const config_1 = require("../../../framework/setting/config");
/**
 * @author Sun
 * @time 2019-08-11 12:03
 * @project SFramework_LayaAir
 * @description 3D场景层
 *
 */
class D3View extends d3UI {
    static get $() {
        if (!this.instance)
            this.instance = new D3View();
        return this.instance;
    }
    constructor() {
        super();
    }
    onAwake() {
        super.onAwake();
        this.Init();
        this.suitInit();
    }
    /**
     * 初始化一次
     */
    Init() {
        this.initOnce();
        // //数据监听
        // this.addDataWatch(DataDefine.UserInfo);
    }
    /**
     * 每次弹出初始化一次
     */
    popupInit() {
        this.initAll();
    }
    /**
     * 适配
     */
    suitInit() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************页面初始数据*****************************************/
    /** Des:构造是初始化一次 */
    initOnce() {
    }
    /** Des:每次弹出初始化 */
    initAll() {
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /***************************************外部连接进入判断***************************************/
    /** Des:判断进入连接信息 */
    initLink() {
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************页面事件相关*****************************************/
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /****************************************3D场景加载完成回调****************************************/
    /**
     * 加载3D场景
     */
    load3DScene(area, callBack) {
        load3d_1.UtilLoad3D.loadScene(config_1.Config3D.$.scenePath, area, callBack);
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /****************************************数据改变的监听****************************************/
    /**
     * 刷新数据
     */
    onData(data) {
    }
}
exports.D3View = D3View;
},{"../../../framework/setting/config":30,"../../../framework/util/load3d":36,"../../../ui/layaMaxUI":42}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
var effectUI = layaMaxUI_1.ui.view.main.effectUI;
var Browser = Laya.Browser;
const lottery_view_1 = require("../component-view/lottery-view");
class EffectView extends effectUI {
    static get $() {
        if (!this.instance)
            this.instance = new EffectView();
        return this.instance;
    }
    constructor() {
        super();
    }
    onAwake() {
        super.onAwake();
        this.Init();
        this.suitInit();
    }
    /**
     * 初始化一次
     */
    Init() {
        this.initOnce();
        // //数据监听
        // this.addDataWatch(DataDefine.UserInfo);
        if (Browser.onWeiXin) {
            this.initLink();
        }
    }
    /**
     * 每次弹出初始化一次
     */
    popupInit() {
        this.initAll();
    }
    /**
     * 适配
     */
    suitInit() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************页面初始数据*****************************************/
    /** Des:构造是初始化一次 */
    initOnce() {
        this.btnLucky.on(Laya.Event.CLICK, this, () => {
            let view = lottery_view_1.LotteryView.$;
            view.popupDialog();
        });
    }
    /** Des:每次弹出初始化 */
    initAll() {
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /***************************************外部连接进入判断***************************************/
    /** Des:判断进入连接信息 */
    initLink() {
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************页面点击事件*****************************************/
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /****************************************数据改变的监听****************************************/
    /**
     * 刷新数据
     */
    onData(data) {
    }
}
exports.EffectView = EffectView;
},{"../../../ui/layaMaxUI":42,"../component-view/lottery-view":3}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
var Browser = Laya.Browser;
var gameUI = layaMaxUI_1.ui.view.main.gameUI;
/**
 * @author Sun
 * @time 2019-08-11 18:08
 * @project SFramework_LayaAir
 * @description 主页
 *
 */
class GameView extends gameUI {
    static get $() {
        if (!this.instance)
            this.instance = new GameView();
        return this.instance;
    }
    constructor() {
        super();
    }
    onAwake() {
        super.onAwake();
        this.Init();
        this.suitInit();
    }
    /**
     * 初始化一次
     */
    Init() {
        this.initOnce();
        // //数据监听
        // this.addDataWatch(DataDefine.UserInfo);
        if (Browser.onWeiXin) {
            this.initLink();
        }
    }
    /**
     * 每次弹出初始化一次
     */
    popupInit() {
        this.initAll();
    }
    /**
     * 适配
     */
    suitInit() {
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************页面初始数据*****************************************/
    /** Des:构造是初始化一次 */
    initOnce() {
    }
    /** Des:每次弹出初始化 */
    initAll() {
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /***************************************外部连接进入判断***************************************/
    /** Des:判断进入连接信息 */
    initLink() {
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************页面点击事件*****************************************/
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /****************************************数据改变的监听****************************************/
    /**
     * 刷新数据
     */
    onData(data) {
    }
}
exports.GameView = GameView;
},{"../../../ui/layaMaxUI":42}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
var loadingUI = layaMaxUI_1.ui.view.main.loadingUI;
const bg_view_1 = require("./bg-view");
const d3_view_1 = require("./d3-view");
const config_1 = require("../../../framework/setting/config");
const number_1 = require("../../../framework/util/number");
const enum_1 = require("../../../framework/setting/enum");
const game_view_1 = require("./game-view");
const effect_view_1 = require("./effect-view");
const event_data_1 = require("../../../framework/manager/event/event-data");
const res_manager_1 = require("../../../framework/manager/res/res-manager");
class LoadingView extends loadingUI {
    /*****************************************页面属性管理*****************************************/
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************页面生命周期*****************************************/
    constructor() {
        super();
    }
    onAwake() {
        super.onAwake();
        this.Init();
        this.suitInit();
    }
    /**
   * 加载页面启动项
   */
    onStart() {
        //加载主场景所需要的资源信息
        res_manager_1.ResManager.$.loadGroup(config_1.ConfigRes.$.defaultMainRes, new event_data_1.EventFunc(this, this.onProgress), new event_data_1.EventFunc(this, this.onCompleted));
        this.lblLoading.text = "游戏登录中...";
    }
    /**
     * 加载完成回调
     * @param success
     */
    onCompleted(success) {
        //Bg页面
        let bgView = bg_view_1.BgView.$;
        Laya.stage.addChild(bgView);
        if (config_1.ConfigGame.$.dimension == enum_1.enumDimension.Dim3) {
            //3D页面
            let d3View = d3_view_1.D3View.$;
            Laya.stage.addChild(d3View);
            d3View.load3DScene(this, this.showView);
        }
        else {
            this.showView();
        }
    }
    showView() {
        //主页
        let gameView = game_view_1.GameView.$;
        Laya.stage.addChild(gameView);
        //效果页
        let effectView = effect_view_1.EffectView.$;
        Laya.stage.addChild(effectView);
        //结束销毁加载页
        this.destroy();
    }
    /**
     * 加载进度
     * @param progress
     */
    onProgress(progress) {
        let fixed = number_1.UtilNumber.toFixed(progress * 100, 0);
        this.lblLoading.text = fixed + "%";
        this.pro_Loading.value = fixed / 100;
    }
    /**
     * 初始化一次
     */
    Init() {
        this.initOnce();
    }
    /**
     * 每次弹出初始化一次
     */
    popupInit() {
        this.initAll();
    }
    /**
     * 适配
     */
    suitInit() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.img_bg.width = this.width;
        this.img_bg.height = this.height;
        this.img_bg.x = 0;
        this.img_bg.y = 0;
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************页面初始数据*****************************************/
    /** Des:构造是初始化一次 */
    initOnce() {
    }
    /** Des:每次弹出初始化 */
    initAll() {
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /***************************************外部连接进入判断***************************************/
    /** Des:判断进入连接信息 */
    initLink() {
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************页面点击事件*****************************************/
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /****************************************数据改变的监听****************************************/
    /**
     * 刷新数据
     */
    onData(data) {
    }
    /********************************************——**********************************************/
    ///////////////////////////////////////////-分界线-///////////////////////////////////////////
    /******************************************销毁自身******************************************/
    destroy() {
        // this.removeSelf();
        // ResManager.$.releaseGroup(ConfigRes.$.defaultLoadRes);
    }
}
exports.LoadingView = LoadingView;
},{"../../../framework/manager/event/event-data":14,"../../../framework/manager/res/res-manager":21,"../../../framework/setting/config":30,"../../../framework/setting/enum":31,"../../../framework/util/number":39,"../../../ui/layaMaxUI":42,"./bg-view":4,"./d3-view":5,"./effect-view":6,"./game-view":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../setting/config");
/**
* @author Sun
* @time 2019-08-09 15:59
* @project SFramework_LayaAir
* @description 输出信息管理
*/
class Log {
    static debug(...args) {
        if (config_1.ConfigDebug.$.isDebug)
            console.debug("[debug]", args.toString());
    }
    static info(...args) {
        if (config_1.ConfigDebug.$.isDebug)
            console.info("[info]", args.toString());
    }
    static warn(...args) {
        if (config_1.ConfigDebug.$.isDebug)
            console.warn("[warn]", args.toString());
    }
    static error(...args) {
        if (config_1.ConfigDebug.$.isDebug)
            console.error("[error]", args.toString());
    }
    static exception(...args) {
        if (config_1.ConfigDebug.$.isDebug)
            console.exception("[exce]", args.toString());
    }
    static log(...args) {
        if (config_1.ConfigDebug.$.isDebug)
            console.log("[log]", args.toString());
    }
    /**打印设备信息*/
    static printDeviceInfo() {
        if (config_1.ConfigDebug.$.isDebug && navigator) {
            let agentStr = navigator.userAgent;
            let start = agentStr.indexOf("(");
            let end = agentStr.indexOf(")");
            if (start < 0 || end < 0 || end < start) {
                return;
            }
            let infoStr = agentStr.substring(start + 1, end);
            let device, system, version;
            let infos = infoStr.split(";");
            if (infos.length == 3) {
                //如果是三个的话， 可能是android的， 那么第三个是设备号
                device = infos[2];
                //第二个是系统号和版本
                let system_info = infos[1].split(" ");
                if (system_info.length >= 2) {
                    system = system_info[1];
                    version = system_info[2];
                }
            }
            else if (infos.length == 2) {
                system = infos[0];
                device = infos[0];
                version = infos[1];
            }
            else {
                system = navigator.platform;
                device = navigator.platform;
                version = infoStr;
            }
            Log.info(system, device, version);
        }
    }
}
exports.Log = Log;
},{"../setting/config":30}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./log");
/**
 * @author Sun
 * @time 2019-08-09 23:25
 * @project SFramework_LayaAir
 * @description  对象池
 *
 */
class ObjectPool {
    /**
     * 获取一个对象，不存在则创建
     * @param classDef  类名
     */
    static get(classDef) {
        let sign = "dc." + classDef.name;
        let obj = Laya.Pool.getItem(sign);
        if (!obj) {
            if (!Laya.ClassUtils.getRegClass(sign)) {
                log_1.Log.debug("[pools]注册对象池:" + sign);
                Laya.ClassUtils.regClass(sign, classDef);
            }
            obj = Laya.ClassUtils.getInstance(sign);
        }
        if (obj && obj["init"])
            obj.init();
        return obj;
    }
    /**
     * 回收对象
     * @param obj  对象实例
     */
    static recover(obj) {
        if (!obj)
            return;
        let proto = Object.getPrototypeOf(obj);
        let clazz = proto["constructor"];
        let sign = "dc." + clazz.name;
        obj.close();
        Laya.Pool.recover(sign, obj);
    }
}
exports.ObjectPool = ObjectPool;
},{"./log":9}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./log");
/**
* @author Sun
* @time 2019-08-09 15:57
* @project SFramework_LayaAir
* @description 单例工具类
*/
class Singleton {
    constructor() {
        let clazz = this["constructor"];
        if (!clazz) {
            console.warn("Not support constructor!");
            log_1.Log.warn("Not support constructor!");
            return;
        }
        // 防止重复实例化
        if (Singleton.classKeys.indexOf(clazz) != -1)
            throw new Error(this + "Only instance once!");
        else {
            Singleton.classKeys.push(clazz);
            Singleton.classValues.push(this);
        }
    }
}
Singleton.classKeys = [];
Singleton.classValues = [];
exports.Singleton = Singleton;
},{"./log":9}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Sun
 * @time 2019-08-09 23:31
 * @project SFramework_LayaAir
 * @description  事件任务属性
 *
 */
class TimeDelayData {
    set(interval, repeat, callback, thisObj, param) {
        this.interval = interval;
        this.repeat = repeat;
        this.callback = callback;
        this.param = param;
        this.thisObj = thisObj;
    }
}
exports.TimeDelayData = TimeDelayData;
/**
* @author Sun
* @time 2019-08-09 23:25
* @project SFramework_LayaAir
* @description  时间控制核心类
*
*/
const singleton_1 = require("./singleton");
class TimeDelay extends singleton_1.Singleton {
    constructor() {
        super();
        /**当前事件执行的次数 */
        this.repeat = 0;
        this.items = new Array();
        this.toAdd = new Array();
        this.toRemove = new Array();
        this.pool = new Array();
        this.lastTime = 0;
        this.deltaTime = 0;
        Laya.timer.frameLoop(0.01, this, this.update);
    }
    static get $() {
        if (this.mInstance == null) {
            this.mInstance = new TimeDelay();
        }
        return this.mInstance;
    }
    /**
     * 从池子中获取data类
     */
    getFromPool() {
        let t;
        if (this.pool.length > 0) {
            t = this.pool.pop();
        }
        else
            t = new TimeDelayData();
        return t;
    }
    /**
     * data类放回池子
     * @param t
     */
    returnToPool(t) {
        t.set(0, 0, null, null, null);
        t.elapsed = 0;
        t.deleted = false;
        this.pool.push(t);
    }
    exists(callback, thisObj) {
        let t = this.toAdd.find((value, index, obj) => {
            return value.callback == callback && value.thisObj == thisObj;
        });
        if (t != null) {
            return true;
        }
        t = this.items.find((value, index, obj) => {
            return value.callback == callback && value.thisObj == thisObj;
        });
        if (t != null && !t.deleted) {
            return true;
        }
        return false;
    }
    add(interval, repeat, callback, thisObj, callbackParam = null) {
        let t;
        t = this.items.find((value, index, obj) => {
            return value.callback == callback && value.thisObj == thisObj;
        });
        if (t == null) {
            t = this.toAdd.find((value, index, obj) => {
                return value.callback == callback && value.thisObj == thisObj;
            });
        }
        if (t == null) {
            t = this.getFromPool();
            this.toAdd.push(t);
        }
        t.set(interval, repeat, callback, thisObj, callbackParam);
        t.deleted = false;
        t.elapsed = 0;
    }
    addUpdate(callback, thisObj, callbackParam = null) {
        this.add(0.001, 0, callback, thisObj, callbackParam);
    }
    remove(callback, thisObj) {
        let findindex = -1;
        let t = this.toAdd.find((value, index, obj) => {
            if (value.callback == callback && value.thisObj == thisObj) {
                findindex = index;
                return true;
            }
            else {
                return false;
            }
        });
        if (t != null) {
            this.toAdd.splice(findindex, 1);
            this.returnToPool(t);
        }
        t = this.items.find((value, index, obj) => {
            return value.callback == callback && value.thisObj == thisObj;
        });
        if (t != null)
            t.deleted = true;
    }
    start() {
        this.lastTime = Laya.timer.currTimer;
    }
    update() {
        this.deltaTime = (Laya.timer.currTimer - this.lastTime) / 1000;
        this.lastTime = Laya.timer.currTimer;
        for (let index = 0; index < this.items.length; index++) {
            let t = this.items[index];
            if (t.deleted) {
                this.toRemove.push(t);
                continue;
            }
            t.elapsed += this.deltaTime;
            if (t.elapsed < t.interval) {
                continue;
            }
            t.elapsed = 0;
            if (t.repeat > 0) {
                t.repeat--;
                if (t.repeat == 0) {
                    t.deleted = true;
                    this.toRemove.push(t);
                }
            }
            this.repeat = t.repeat;
            if (t.callback != null) {
                try {
                    t.callback.call(t.thisObj, t.param);
                }
                catch (error) {
                    t.deleted = true;
                }
            }
        }
        let len = this.toRemove.length;
        while (len) {
            let t = this.toRemove.pop();
            let index = this.items.indexOf(t);
            if (t.deleted && index != -1) {
                this.items.splice(index, 1);
                this.returnToPool(t);
            }
            len--;
        }
        len = this.toAdd.length;
        while (len) {
            let t = this.toAdd.pop();
            this.items.push(t);
            len--;
        }
    }
}
TimeDelay.mInstance = null;
exports.TimeDelay = TimeDelay;
},{"./singleton":11}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_node_1 = require("../event/event-node");
/**
 * @author Sun
 * @time 2019-08-09 15:51
 * @project SFramework_LayaAir
 * @description 数据管理类
 */
class DataManager extends event_node_1.EventNode {
    constructor() {
        super();
        this.datas = new Map();
    }
    static get $() {
        if (!this.instance)
            this.instance = new DataManager();
        return this.instance;
    }
    setup() {
    }
    update() {
    }
    destroy() {
        this.datas.clear();
    }
    register(data) {
        this.datas.set(data.cmd, data);
        return this;
    }
    get(cmd) {
        return this.datas.get(cmd);
    }
}
DataManager.instance = null;
exports.DataManager = DataManager;
},{"../event/event-node":16}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* @author Sun
* @time 2019-08-12 17:13
* @project SFramework_LayaAir
* @description 事件数据定义类
*/
class EventData {
    constructor(cmd, obj = null, isStop = false) {
        this.isStop = false;
        this.cmd = cmd;
        this.data = obj;
        this.isStop = false;
    }
    /**
     * 快速创建事件数据
     * @param cmd
     * @param data
     * @param isStop
     */
    static create(cmd, data = null, isStop = false) {
        return new EventData(cmd, data, isStop);
    }
    stop() {
        this.isStop = true;
    }
}
exports.EventData = EventData;
/**
* @author Sun
* @time 2019-01-20 00:24
* @project SFramework_LayaAir
* @description 事件回调函数定义
*/
class EventFunc {
    constructor(thisObj, callBack) {
        this.m_this = thisObj;
        this.m_cb = callBack;
    }
    invoke(...args) {
        this.m_cb.call(this.m_this, ...args);
    }
}
exports.EventFunc = EventFunc;
},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_node_1 = require("./event-node");
/**
* @author Sun
* @time 2019-01-18 16:20
* @project SFramework_LayaAir
* @description 事件管理器
*/
class EventManager extends event_node_1.EventNode {
    constructor() {
        super();
    }
    static get $() {
        if (!this.instance)
            this.instance = new EventManager();
        return this.instance;
    }
    setup() {
        event_node_1.EventContext.eventNodes.clear();
    }
    update() {
    }
    destroy() {
        event_node_1.EventContext.eventNodes.clear();
    }
    /**
     * 移除一个消息监听节点
     * @param node
     */
    remove(node) {
        node.removeEventListenerAll();
        event_node_1.EventContext.eventNodes.delete(node);
    }
    /**
     * 给所有本地消息节点通知消息
     * @param ed
     */
    dispatchEventLocalAll(ed) {
        event_node_1.EventContext.eventNodes.forEach((en) => {
            en.dispatchEvent(ed);
        });
    }
    /**
     * 给所有本地消息节点通知消息
     * @param cmd
     * @param data
     */
    dispatchEventLocalAllByCmd(cmd, data = null) {
        event_node_1.EventContext.eventNodes.forEach((en) => {
            en.dispatchEventByCmd(cmd, data);
        });
    }
    /**
     * 添加一个消息监听器
     * @param type 消息类型
     * @param callBack 回调函数
     * @param target 作用对象
     * @param priority 消息的优先级
     * @param once 是否只监听一次
     */
    addListener(type, callBack, target, priority = 0, once = false) {
        event_node_1.EventNode.addGlobalListener(type, callBack, target, priority, once);
    }
    /**
     * 移除一个消息监听器
     * @param type 消息id
     * @param callBack 回调函数
     * @param target 作用的对象
     */
    removeListener(type, callBack, target) {
        event_node_1.EventNode.removeGlobalListener(type, callBack, target);
    }
    /**
     * 是否存在这个监听消息
     * @param type 消息类型
     * @param callBack 回调类型
     * @param target 回调对象
     */
    hasListener(type, callBack, target) {
        event_node_1.EventNode.hasGlobalListener(type, callBack, target);
    }
    /**
     * 派发消息
     * @param cmd 消息id
     * @param data 消息内容
     */
    dispatchEventByCmd(cmd, data = null) {
        event_node_1.EventNode.dispatchGlobalByCmd(cmd, data);
    }
}
EventManager.instance = null;
exports.EventManager = EventManager;
},{"./event-node":16}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_data_1 = require("./event-data");
const log_1 = require("../../core/log");
const singleton_1 = require("../../core/singleton");
/**
* @author Sun
* @time 2019-01-18 16:20
* @project SFramework_LayaAir
* @description 所有需要监控事件节点的基类
*/
class EventNode extends singleton_1.Singleton {
    constructor() {
        super();
        // ==================================================
        // ==============  Local Event Section ==============
        // ==================================================
        this.m_eventData = new Array();
        this.m_eventDict = {};
        EventContext.eventNodes.set(this, this);
    }
    static createGlobalData(cmd, data) {
        let ed;
        if (EventNode.m_globalEventData.length > 0) {
            ed = EventNode.m_globalEventData.pop();
            ed.cmd = cmd;
            ed.data = data;
            ed.isStop = false;
        }
        else {
            ed = new event_data_1.EventData(cmd, data);
        }
        return ed;
    }
    static returnGlobalEventData(ed) {
        ed.data = null;
        ed.cmd = null;
        ed.isStop = false;
        EventNode.m_globalEventData.push(ed);
    }
    /**
     * 添加一个消息监听器
     * @param type 消息类型
     * @param callBack 回调函数
     * @param target 作用对象
     * @param priority 消息的优先级
     * @param once 是否只监听一次
     */
    static addGlobalListener(type, callBack, target, priority = 0, once = false) {
        type = type.toString();
        let info = {
            type: type,
            callBack: callBack,
            target: target,
            priority: priority,
            once: once
        };
        let array = EventNode.m_globalEventDict[type];
        let has = false;
        let pos = 0;
        if (array != null) {
            array.forEach(element => {
                if (element.target == target && element.callBack == callBack) {
                    has = true;
                }
                if (element.priority > info.priority) {
                    pos++;
                }
            });
        }
        else {
            array = new Array();
            EventNode.m_globalEventDict[type] = array;
        }
        if (has) {
            // console.error("重复注册消息：type=" + type);
            log_1.Log.error("重复注册消息：type=" + type);
        }
        else {
            array.splice(pos, 0, info);
        }
    }
    /**
     * 移除一个消息监听器
     * @param type 消息id
     * @param callBack 回调函数
     * @param target 作用的对象
     */
    static removeGlobalListener(type, callBack, target) {
        type = type.toString();
        let info = null;
        let array = EventNode.m_globalEventDict[type];
        if (array != null) {
            let infoIndex = -1;
            array.every((value, index, array) => {
                if (value.target == target && value.callBack == callBack) {
                    infoIndex = index;
                    info = value;
                    return false;
                }
                return true;
            });
            if (infoIndex != -1) {
                array.splice(infoIndex, 1);
            }
        }
    }
    /**
     * 是否存在这个监听消息
     * @param type 消息类型
     * @param callBack 回调类型
     * @param target 回调对象
     */
    static hasGlobalListener(type, callBack, target) {
        let flag = false;
        let array = EventNode.m_globalEventDict[type];
        if (array) {
            // @ts-ignore
            let index = array.findIndex((obj, index, any) => {
                return obj.target == target && obj.callBack == callBack;
            });
            flag = index != -1;
        }
        return flag;
    }
    /**
     * 派发消息
     * @param ed 派发的消息内容
     */
    static dispatchGlobal(ed) {
        EventNode._dispatchGlobal(ed);
    }
    /**
     * 派发消息
     * @param cmd 消息id
     * @param data 消息内容
     */
    static dispatchGlobalByCmd(cmd, data = null) {
        let ed = EventNode.createGlobalData(cmd, data);
        EventNode._dispatchGlobal(ed);
        if (ed != null) {
            EventNode.returnGlobalEventData(ed);
        }
    }
    static _dispatchGlobal(ed) {
        let array = EventNode.m_globalEventDict[ed.cmd];
        if (array != null) {
            for (let i = 0; i < array.length; i++) {
                let info = array[i];
                if (info.callBack != null) {
                    info.callBack.call(info.target, ed);
                }
                if (info.once) {
                    array.splice(i--, 1);
                }
                if (ed.isStop) {
                    break;
                }
            }
        }
    }
    createEventData(cmd, data) {
        let ed;
        if (this.m_eventData.length > 0) {
            ed = this.m_eventData.pop();
            ed.cmd = cmd;
            ed.data = data;
            ed.isStop = false;
        }
        else {
            ed = new event_data_1.EventData(cmd, data);
        }
        return ed;
    }
    returnEventData(ed) {
        ed.data = null;
        ed.cmd = null;
        ed.isStop = false;
        this.m_eventData.push(ed);
    }
    /**
     * 添加一个消息监听器
     * @param type 消息类型
     * @param callBack 回调函数
     * @param target 作用对象
     * @param priority 消息的优先级
     * @param once 是否只监听一次
     */
    addEventListener(type, callBack, target, priority = 0, once = false) {
        type = type.toString();
        let info = {
            type: type,
            callBack: callBack,
            target: target,
            priority: priority,
            once: once
        };
        let array = this.m_eventDict[type];
        let has = false;
        let pos = 0;
        if (array != null) {
            array.forEach(element => {
                if (element.target == target && element.callBack == callBack) {
                    has = true;
                }
                if (element.priority > info.priority) {
                    pos++;
                }
            });
        }
        else {
            array = new Array();
            this.m_eventDict[type] = array;
        }
        if (has) {
            // console.error("重复注册消息：type=" + type);
            log_1.Log.error("重复注册消息：type=" + type);
            return null;
        }
        else {
            array.splice(pos, 0, info);
            return info;
        }
    }
    /**
     * 移除一个消息监听器
     * @param type 消息id
     * @param callBack 回调函数
     * @param target 作用的对象
     */
    removeEventListener(type, callBack, target) {
        type = type.toString();
        let info = null;
        let array = this.m_eventDict[type];
        if (array != null) {
            let infoIndex = -1;
            array.every((value, index, array) => {
                if (value.target == target && value.callBack == callBack) {
                    infoIndex = index;
                    info = value;
                    return false;
                }
                return true;
            });
            if (infoIndex != -1) {
                array.splice(infoIndex, 1);
            }
        }
    }
    removeEventListenerAll() {
        this.m_eventData = new Array();
        this.m_eventDict = {};
    }
    /**
     * 是否存在这个监听消息
     * @param type 消息类型
     * @param callBack 回调类型
     * @param target 回调对象
     */
    hasEventListener(type, callBack, target) {
        let flag = false;
        let array = this.m_eventDict[type];
        if (array) {
            // @ts-ignore
            let index = array.findIndex((obj, index, any) => {
                return obj.target == target && obj.callBack == callBack;
            });
            flag = index != -1;
        }
        return flag;
    }
    /**
     * 派发消息
     * @param ed 派发的消息内容
     */
    dispatchEvent(ed) {
        this._dispatchEvent(ed);
    }
    /**
     * 派发消息
     * @param cmd 消息id
     * @param data 消息内容
     */
    dispatchEventByCmd(cmd, data = null) {
        let ed = this.createEventData(cmd, data);
        this._dispatchEvent(ed);
        if (ed != null) {
            this.returnEventData(ed);
        }
    }
    _dispatchEvent(ed) {
        let array = this.m_eventDict[ed.cmd];
        if (array != null) {
            for (let i = 0; i < array.length; i++) {
                let info = array[i];
                if (info.callBack != null) {
                    info.callBack.call(info.target, ed);
                }
                if (info.once) {
                    array.splice(i--, 1);
                }
                if (ed.isStop) {
                    break;
                }
            }
        }
    }
}
// ==================================================
// ==============  Local Event Section ==============
// ==================================================
EventNode.m_globalEventData = new Array();
EventNode.m_globalEventDict = {};
exports.EventNode = EventNode;
class EventContext {
}
EventContext.eventNodes = new Map();
exports.EventContext = EventContext;
},{"../../core/log":9,"../../core/singleton":11,"./event-data":14}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const res_manager_1 = require("../res/res-manager");
const singleton_1 = require("../../core/singleton");
const dictionary_1 = require("../../structure/dictionary");
const config_1 = require("../../setting/config");
const log_1 = require("../../core/log");
/**
* @author Sun
* @time 2019-08-12 14:40
* @project SFramework_LayaAir
* @description 配置表管理
*
*/
class JsonManager extends singleton_1.Singleton {
    constructor() {
        super();
        /**
         * 存放所有配置表模板
         */
        this.m_DicTemplate = null;
        /**
         * 存放所有解析过的配置表
         */
        this.m_DicData = null;
    }
    static get $() {
        if (!this.instance)
            this.instance = new JsonManager();
        return this.instance;
    }
    /**
     * 管理器统一设置方法
     */
    setup() {
        this.m_DicTemplate = new dictionary_1.Dictionary();
        this.m_DicData = new dictionary_1.Dictionary();
        this.load(config_1.ConfigData.$.jsonTemplateList);
    }
    update() {
    }
    /**
     * 管理器统一销毁方法
     */
    destroy() {
        this.unloadAll();
        if (this.m_DicTemplate) {
            this.m_DicTemplate.clear();
            this.m_DicTemplate = null;
        }
        if (this.m_DicData) {
            this.m_DicData.clear();
            this.m_DicData = null;
        }
    }
    /**
    * 加载所有的数据模板
    * @param list
    */
    load(list) {
        for (let i = 0; i < list.length; ++i) {
            log_1.Log.log("[load]加载配置表:" + list[i].url);
            this.m_DicTemplate.add(list[i].name, list[i]);
        }
    }
    /**
     * 获取一个单一结构的数据
     * @param name
     */
    getTable(name) {
        let data = this.m_DicData.value(name);
        if (data == null) {
            data = res_manager_1.ResManager.$.getRes(this.m_DicTemplate.value(name).url);
            this.m_DicData.add(name, data);
        }
        return data;
    }
    /**
     * 获取一行复合表的数据
     * @param name
     * @param key
     */
    getTableRow(name, key) {
        return this.getTable(name)[key];
    }
    /**
     * 卸载指定的模板
     * @param url
     */
    unload(name) {
        let template = this.m_DicTemplate.value(name);
        if (template) {
            this.m_DicData.remove(name);
        }
        res_manager_1.ResManager.$.releaseUrl(template.url);
        this.m_DicTemplate.remove(name);
    }
    /**
     * 卸载所有的模板
     * @constructor
     */
    unloadAll() {
        if (!this.m_DicTemplate)
            return;
        this.m_DicTemplate.foreach(function (key, value) {
            this.unload(key);
            return true;
        });
        this.m_DicData.clear();
        this.m_DicTemplate.clear();
    }
}
JsonManager.instance = null;
exports.JsonManager = JsonManager;
},{"../../core/log":9,"../../core/singleton":11,"../../setting/config":30,"../../structure/dictionary":32,"../res/res-manager":21}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* @author Sun
* @time 2019-08-12 10:59
* @project SFramework_LayaAir
* @description 配置表模板项
*
*/
class JsonTemplate {
    constructor(url, name) {
        this.url = url;
        this.name = name;
    }
}
exports.JsonTemplate = JsonTemplate;
},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const res_item_1 = require("./res-item");
/**
* @author Sun
* @time 2019-08-09 19:31
* @project SFramework_LayaAir
* @description 场景管理器所需的资源包定义
*
*/
class ResGroup {
    constructor() {
        /**加载进度 */
        this.progress = 0;
        /**加载资源 */
        this.needLoad = new Array();
    }
    /**
     * 向资源组添加目标
     * @param url 相对路径
     * @param type 类型
     * @param isKeepMemory 是否常驻内存
     */
    add(url, type, isKeepMemory = false) {
        let index = this.needLoad.findIndex((value, index, obj) => {
            return value.url == url;
        });
        if (index == -1) {
            let info = new res_item_1.ResItem();
            info.isKeepMemory = isKeepMemory;
            info.url = url;
            info.type = type;
            this.needLoad.push(info);
        }
        return this;
    }
}
exports.ResGroup = ResGroup;
},{"./res-item":20}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Sun
 * @time 2019-08-09 19:18
 * @project SFramework_LayaAir
 * @description 资源属性
 *
 */
class ResItem {
    constructor() {
        this.isKeepMemory = false;
    }
    get fullUrl() {
        return this.url;
    }
}
exports.ResItem = ResItem;
},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handler = Laya.Handler;
const event_node_1 = require("../event/event-node");
const log_1 = require("../../core/log");
/**
 * @author Sun
 * @time 2019-08-12 13:33
 * @project SFramework_LayaAir
 * @description  资源管理  （所有资源均通过ResGroup的形式来加载）
 *
 */
class ResManager extends event_node_1.EventNode {
    constructor() {
        super();
        //存放所有已加载的资源
        this.m_dictResItem = new Map();
    }
    static get $() {
        if (this.instance == null)
            this.instance = new ResManager();
        return this.instance;
    }
    setup() {
    }
    update() {
    }
    destroy() {
    }
    /**
     * 通过URL获取资源
     * @param url
     */
    getRes(url) {
        return Laya.loader.getRes(url);
    }
    /**
     * 加载资源组
     * @param loads 资源信息
     * @param progressFuc 加载进度回调
     * @param completeFuc 加载完成回调
     */
    loadGroup(loads, progressFuc, completeFuc) {
        let urls = new Array();
        loads.needLoad.forEach(element => {
            urls.push({ url: element.url, type: element.type });
        });
        Laya.loader.load(urls, Handler.create(this, (success) => {
            if (success) {
                //完成回调
                if (completeFuc != null)
                    completeFuc.invoke();
                //标记资源
                for (let index = 0; index < loads.needLoad.length; index++) {
                    let info = loads.needLoad[index];
                    if (!this.m_dictResItem.has(info.url)) {
                        this.m_dictResItem.set(info.url, info);
                    }
                }
            }
            else {
                log_1.Log.error("Load Resource Error：");
                log_1.Log.debug(urls);
            }
        }), Handler.create(this, (progress) => {
            //进度回调
            if (progressFuc != null)
                progressFuc.invoke(progress);
        }, null, false));
    }
    /**
     * 释放资源组
     * @param loads 资源组
     */
    releaseGroup(loads) {
        let urls = new Array();
        loads.needLoad.forEach(element => {
            urls.push(element.url);
        });
        for (let i = 0; i < urls.length; i++) {
            Laya.loader.clearRes(urls[i]);
            this.m_dictResItem.forEach((v, key) => {
                if (key == urls[i]) {
                    this.m_dictResItem.delete(key);
                }
            });
        }
    }
    /**
     * 释放指定资源
     * @param url
     */
    releaseUrl(url) {
        let isActive = false;
        this.m_dictResItem.forEach((v, key) => {
            if (key == url) {
                isActive = true;
            }
        });
        if (isActive) {
            Laya.loader.clearRes(url);
        }
        else {
            log_1.Log.error("加载资源组内不存在该资源");
        }
    }
}
ResManager.instance = null;
exports.ResManager = ResManager;
},{"../../core/log":9,"../event/event-node":16}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_1 = require("../../util/string");
var SoundChannel = Laya.SoundChannel;
var Handler = Laya.Handler;
const event_node_1 = require("../event/event-node");
const log_1 = require("../../core/log");
const dictionary_1 = require("../../structure/dictionary");
const config_1 = require("../../setting/config");
/**
 * @author Sun
 * @time 2019-08-12 15:08
 * @project SFramework_LayaAir
 * @description 音效管理
 *
 */
class SoundManager extends event_node_1.EventNode {
    constructor() {
        /********************************************——**********************************************/
        ////////////////////////////////////////////分界线////////////////////////////////////////////
        /******************************************属性信息*******************************************/
        super(...arguments);
        /** Des:背景音乐 */
        this.m_CurBGSound = null;
        /**音效名字对应Url */
        this.dictSoundUrl = null;
        /********************************************——**********************************************/
        ////////////////////////////////////////////分界线////////////////////////////////////////////
    }
    static get $() {
        if (!this.instance)
            this.instance = new SoundManager();
        return this.instance;
    }
    setup() {
        this.m_CurBGSound = new SoundChannel();
        this.dictSoundUrl = new dictionary_1.Dictionary();
        config_1.ConfigSound.$.soundResList.forEach(item => {
            this.dictSoundUrl.add(item.name, item.url);
        });
        if (!string_1.UtilString.isEmpty(config_1.ConfigSound.$.bgSoundName)) {
            this.playBGSound(config_1.ConfigSound.$.bgSoundName, 0);
            this.setAllVolume(config_1.ConfigSound.$.volumeVoiceSound);
        }
    }
    update() {
    }
    destroy() {
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /****************************************设置整体音量*****************************************/
    /**
     * 设置整体音量
     * @param number
     */
    setAllVolume(number) {
        config_1.ConfigSound.$.volumeVoiceSound = number;
        this.m_CurBGSound.volume = number;
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************控制背景音乐*****************************************/
    /**
     * 播放背景声音
     * @param    file_name    资源名字
     * @param    count        播放次数(0为循环)
     */
    playBGSound(file_name, count) {
        if (string_1.UtilString.isEmpty(file_name)) {
            log_1.Log.error("Sound file error!");
            return;
        }
        this.m_CurBGSound = Laya.SoundManager.playMusic(this.dictSoundUrl.value(file_name), count);
    }
    /**
     * 停止背景音播放
     */
    stopBGSound() {
        if (this.m_CurBGSound) {
            this.m_CurBGSound.stop();
        }
    }
    /**
     * 暂停背景音乐
     */
    pauseBGSound() {
        if (this.m_CurBGSound) {
            this.m_CurBGSound.pause();
        }
    }
    /**
     * 恢复背景音乐播放
     */
    resumeBGSound() {
        if (this.m_CurBGSound) {
            this.m_CurBGSound.resume();
        }
    }
    /**
     * 设置背景音量
     * @param volume
     */
    setBGSoundVolume(volume) {
        if (this.m_CurBGSound) {
            this.m_CurBGSound.volume = volume;
        }
    }
    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************控制音效播放*****************************************/
    /**
     * 播放效果声音
     * @param    file_name    资源
     * @param    count        播放次数
     */
    playSoundEffect(file_name, count) {
        if (string_1.UtilString.isEmpty(file_name)) {
            log_1.Log.error("声音文件错误");
            return null;
        }
        let sound = Laya.Pool.getItemByClass("Sound", SoundChannel);
        sound = Laya.SoundManager.playSound(this.dictSoundUrl.value(file_name), count, Handler.create(this, () => {
            Laya.Pool.recover("Sound", sound);
        }));
        sound.volume = config_1.ConfigSound.$.volumeVoiceSound;
        return sound;
    }
    /**
     * 停止播放
     * @param sound
     */
    stopSoundEffect(sound) {
        if (sound) {
            sound.stop();
        }
    }
}
/********************************************——**********************************************/
////////////////////////////////////////////分界线////////////////////////////////////////////
/******************************************生命周期*******************************************/
SoundManager.instance = null;
exports.SoundManager = SoundManager;
},{"../../core/log":9,"../../setting/config":30,"../../structure/dictionary":32,"../../util/string":40,"../event/event-node":16}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const time_1 = require("../../util/time");
const timer_interval_1 = require("./timer-interval");
/**
 * @author Sun
 * @time 2019-08-10 20:06
 * @project SFramework_LayaAir
 * @description  计时器基类
 *
 */
class TimerEntity {
    constructor() {
        this.mTime = new timer_interval_1.TimerInterval();
    }
    init() {
    }
    close() {
    }
    clear() {
        if (this.handle != null) {
            this.handle.recover();
            this.handle = null;
        }
    }
    set(id, rate, ticks, handle) {
        this.id = id;
        this.mRate = rate < 0 ? 0 : rate;
        this.mTicks = ticks < 0 ? 0 : ticks;
        this.handle = handle;
        this.mTicksElapsed = 0;
        this.isActive = true;
        this.mTime.init(this.mRate, false);
    }
    update(removeTimer) {
        if (this.isActive && this.mTime.update(time_1.UtilTime.deltaTime)) {
            if (this.handle != null)
                this.handle.run();
            this.mTicksElapsed++;
            if (this.mTicks > 0 && this.mTicks == this.mTicksElapsed) {
                this.isActive = false;
                removeTimer(this.id);
            }
        }
    }
}
exports.TimerEntity = TimerEntity;
},{"../../util/time":41,"./timer-interval":24}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Sun
 * @time 2019-08-10 20:02
 * @project SFramework_LayaAir
 * @description  定时执行
 *
 */
class TimerInterval {
    constructor() {
        this.m_now_time = 0;
    }
    /**
     * 初始化定时器
     * @param    interval    触发间隔
     * @param    first_frame    是否第一帧开始执行
     */
    init(interval, first_frame) {
        this.m_interval_time = interval;
        if (first_frame)
            this.m_now_time = this.m_interval_time;
    }
    reset() {
        this.m_now_time = 0;
    }
    update(elapse_time) {
        this.m_now_time += elapse_time;
        if (this.m_now_time >= this.m_interval_time) {
            this.m_now_time -= this.m_interval_time;
            return true;
        }
        return false;
    }
}
exports.TimerInterval = TimerInterval;
},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handler = Laya.Handler;
const array_1 = require("../../util/array");
const event_node_1 = require("../event/event-node");
const time_delay_1 = require("../../core/time-delay");
const object_pool_1 = require("../../core/object-pool");
const timer_entity_1 = require("./timer-entity");
/**
 * @author Sun
 * @time 2019-08-09 23:22
 * @project SFramework_LayaAir
 * @description  定时管理器
 *
 */
class TimerManager extends event_node_1.EventNode {
    constructor() {
        super(...arguments);
        this.m_idCounter = 0;
        this.m_RemovalPending = [];
        this.m_Timers = [];
    }
    static get $() {
        if (!this.instance)
            this.instance = new TimerManager();
        return this.instance;
    }
    setup() {
        this.m_idCounter = 0;
        time_delay_1.TimeDelay.$.add(0.1, 0, this.remove, this);
        time_delay_1.TimeDelay.$.addUpdate(this.tick, this);
    }
    update() {
    }
    destroy() {
        array_1.UtilArray.clear(this.m_RemovalPending);
        array_1.UtilArray.clear(this.m_Timers);
        time_delay_1.TimeDelay.$.remove(this.remove, this);
        time_delay_1.TimeDelay.$.remove(this.tick, this);
    }
    tick() {
        for (let i = 0; i < this.m_Timers.length; i++) {
            this.m_Timers[i].update(this.removeTimer);
        }
    }
    /**
     * 定时重复执行
     * @param    rate    间隔时间(单位毫秒)。
     * @param    ticks    执行次数
     * @param    caller    执行域(this)。
     * @param    method    定时器回调函数：注意，返回函数第一个参数为定时器id，后面参数依次时传入的参数。例OnTime(timer_id:number, args1:any, args2:any,...):void
     * @param    args    回调参数。
     */
    addLoop(rate, ticks, caller, method, args = null) {
        if (ticks <= 0)
            ticks = 0;
        let newTimer = object_pool_1.ObjectPool.get(timer_entity_1.TimerEntity);
        ++this.m_idCounter;
        if (args != null)
            array_1.UtilArray.insert(args, this.m_idCounter, 0);
        newTimer.set(this.m_idCounter, rate, ticks, Handler.create(caller, method, args, false));
        this.m_Timers.push(newTimer);
        return newTimer.id;
    }
    /**
     * 单次执行
     */
    addOnce(rate, caller, method, args = null) {
        let newTimer = object_pool_1.ObjectPool.get(timer_entity_1.TimerEntity);
        ++this.m_idCounter;
        if (args != null)
            array_1.UtilArray.insert(args, this.m_idCounter, 0);
        newTimer.set(this.m_idCounter, rate, 1, Handler.create(caller, method, args, false));
        this.m_Timers.push(newTimer);
        return newTimer.id;
    }
    /**
     * 移除定时器
     * @param    timerId    定时器id
     */
    removeTimer(timerId) {
        this.m_RemovalPending.push(timerId);
    }
    /**
     * 移除过期定时器
     */
    remove() {
        let timer;
        if (this.m_RemovalPending.length > 0) {
            for (let id of this.m_RemovalPending) {
                for (let i = 0; i < this.m_Timers.length; i++) {
                    timer = this.m_Timers[i];
                    if (timer.id == id) {
                        timer.clear();
                        object_pool_1.ObjectPool.recover(timer);
                        this.m_Timers.splice(i, 1);
                        break;
                    }
                }
            }
            array_1.UtilArray.clear(this.m_RemovalPending);
        }
    }
}
TimerManager.instance = null;
exports.TimerManager = TimerManager;
},{"../../core/object-pool":10,"../../core/time-delay":12,"../../util/array":33,"../event/event-node":16,"./timer-entity":23}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tween = Laya.Tween;
var Ease = Laya.Ease;
var Handler = Laya.Handler;
const display_1 = require("../../util/display");
var CustomDialog;
(function (CustomDialog) {
    /**
     * @author Sun
     * @time 2019-08-09 17:41
     * @project SFramework_LayaAir
     * @description  UI组件的基类，继承自Laya.View
     *
     */
    class DialogBase extends Laya.Dialog {
        constructor() {
            super();
            /**遮罩层 */
            this.maskLayer = null;
            /**弹窗内物体 */
            this.contentPnl = null;
            /**弹窗数据 */
            this.popupData = new PopupData();
            this.bundleButtons();
            this.contentPnl = this.getChildAt(0);
        }
        createView(view) {
            super.createView(view);
        }
        /**
         * 添加遮罩层
         */
        crateMaskLayer() {
            this.maskLayer = display_1.UtilDisplay.createMaskLayer();
            this.maskLayer.mouseEnabled = true;
            let t = this.maskLayer;
            t.x = Math.round(((Laya.stage.width - t.width) >> 1) + t.pivotX);
            t.y = Math.round(((Laya.stage.height - t.height) >> 1) + t.pivotY);
            this.addChild(this.maskLayer);
            this.maskLayer.zOrder = -1;
        }
        /**
         * 在场景中居中组件
         */
        center(view) {
            if (view == null)
                view = this;
            view.x = Math.round(((Laya.stage.width - view.width) >> 1) + view.pivotX);
            view.y = Math.round(((Laya.stage.height - view.height) >> 1) + view.pivotY);
        }
        /**
         * 添加默认按钮事件
         */
        bundleButtons() {
            if (this["btnClose"] != null) {
                this["btnClose"].on(Laya.Event.CLICK, this, this.close);
            }
        }
        /**
         * 关闭空白处点击关闭事件
         */
        closeOutsieClick() {
            if (this.maskLayer != null) {
                this.maskLayer.off(Laya.Event.CLICK, this, this.close);
            }
        }
        /**
         * 对话框弹出方法
         * @param time 弹出时间
         * @param data 数据
         * @param isMask 是否生成遮罩
         * @param closeOutside 是否点击空白处关闭
         */
        popupDialog(popupData = null) {
            this.popup(false, false);
            if (popupData == null) {
                popupData = this.popupData;
            }
            else {
                this.popupData = popupData;
            }
            Laya.stage.addChild(this);
            this.popupInit();
            if (popupData.isMask && this.maskLayer == null) {
                this.crateMaskLayer();
                if (!popupData.closeOutside)
                    this.maskLayer.on(Laya.Event.CLICK, this, this.close);
            }
            this.onShowAnimation(popupData.time, () => {
                if (popupData.callBack)
                    popupData.callBack.invoke();
            });
        }
        /** Des:弹出调用 */
        popupInit() {
        }
        onShowAnimation(time = 300, cb) {
            let target = this.contentPnl;
            this.center();
            // @ts-ignore
            target.scale(0, 0);
            Tween.to(target, {
                scaleX: 1,
                scaleY: 1
            }, time, Ease.backOut, Handler.create(this, cb, [this]), 0, false, false);
        }
        close() {
            this.removeSelf();
        }
    }
    CustomDialog.DialogBase = DialogBase;
})(CustomDialog = exports.CustomDialog || (exports.CustomDialog = {}));
/**
 * @author Sun
 * @time 2019-08-12 17:43
 * @project SFramework_LayaAir
 * @description  窗体弹出数据
 *time: number = 300, data: any = null, isMask: boolean = true, closeOutside: boolean = true,cb?
 */
class PopupData {
    constructor(time = 300, data = null, isMask = true, closeOutside = true, cb = null) {
        this.time = 300;
        this.data = null;
        this.isMask = true;
        this.closeOutside = true;
        this.callBack = null;
        if (time != null)
            this.time = time;
        if (data != null)
            this.data = data;
        if (isMask != null)
            this.isMask = isMask;
        if (closeOutside != null)
            this.closeOutside = closeOutside;
        if (cb != null)
            this.callBack = cb;
    }
}
exports.PopupData = PopupData;
},{"../../util/display":35}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const res_group_1 = require("../res/res-group");
const res_manager_1 = require("../res/res-manager");
const log_1 = require("../../core/log");
const timer_manager_1 = require("../timer/timer-manager");
var CustomScene;
(function (CustomScene) {
    /**
     * @author Sun
     * @time 2019-08-09 19:12
     * @project SFramework_LayaAir
     * @description  Scene的基类
     *
     */
    class LyScene extends Laya.Scene {
        constructor() {
            super();
            /**
             * 场景第一个加载的窗口
             */
            this.firstView = null;
            this.m_loaded = false;
            this.sceneTimers = new Array();
            this.needLoadRes = new res_group_1.ResGroup();
        }
        createChildren() {
            super.createChildren();
            this.createView(LyScene.uiView);
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
        }
        /**
         * 进入场景
         * @param param 参数
         * @param progressFuc 进度回调
         * @param completeFuc 完成回调
         */
        enter(param, progressFuc, completeFuc) {
            this.m_loaded = false;
            this.m_param = param;
            this.onInit(param);
            res_manager_1.ResManager.$.loadGroup(this.needLoadRes, progressFuc, completeFuc);
        }
        leave() {
            this.onLeave();
            this.destroy();
        }
        destroy() {
            this.onClean();
            this.sceneTimers.forEach((timer) => {
                timer_manager_1.TimerManager.$.removeTimer(timer);
            });
            super.destroy();
        }
        /**
         * 加载完成
         * @param error 加载错误
         */
        loaded(error) {
            if (error != null) {
                log_1.Log.error(error);
            }
            else {
                this.onLoaded();
                this.m_loaded = true;
                this.chechEnter();
            }
        }
        chechEnter() {
            if (this.m_loaded) {
                if (this.firstView != null) {
                    let cls = this.firstView;
                    let win = new cls();
                    this.addChild(win);
                }
                this.onEnter(this.m_param);
            }
        }
        /**
         * 加载完成
         */
        onLoaded() {
        }
        /**
         * 场景初始化
         * @param param 参数
         */
        onInit(param) {
        }
        /**
         * 进入场景
         */
        onEnter(param) {
        }
        /**
         * 逐帧循环
         */
        update() {
        }
        /**
         * 离开场景
         */
        onLeave() {
        }
        /**
         * 当场景被销毁的时候
         */
        onClean() {
        }
    }
    /**
     * 内嵌模式空的场景资源，必须实现这个createView，否则有问题
     */
    LyScene.uiView = { "type": "Scene", "props": { "width": 1334, "height": 750 }, "loadList": [], "loadList3D": [] };
    CustomScene.LyScene = LyScene;
})(CustomScene = exports.CustomScene || (exports.CustomScene = {}));
},{"../../core/log":9,"../res/res-group":19,"../res/res-manager":21,"../timer/timer-manager":25}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_manager_1 = require("../data/data-manager");
var CustomView;
(function (CustomView) {
    /**
     * @author Sun
     * @time 2019-08-09 15:51
     * @project SFramework_LayaAir
     * @description  UI组件的基类，继承自Laya.View
     *
     */
    class ViewBase extends Laya.View {
        constructor() {
            super(...arguments);
            /*所有数据观察者*/
            this.dataWatchs = [];
            this.data = null;
        }
        //override
        createView(view) {
            super.createView(view);
            this.fullScreen();
            this.parseElement();
        }
        onDisable() {
            this.dataWatchs.forEach((cmd) => {
                data_manager_1.DataManager.$.removeEventListener(cmd, this.onData, this);
            });
        }
        /**
         * 背景图适应
         */
        parseElement() {
            if (this["imgBg"] != null) {
                let imgBg = this["imgBg"];
                this.fullScreen(imgBg);
            }
        }
        /**
         * 在场景中居中组件
         */
        center(view) {
            if (view == null)
                view = this;
            view.x = Math.round(((Laya.stage.width - view.width) >> 1) + view.pivotX);
            view.y = Math.round(((Laya.stage.height - view.height) >> 1) + view.pivotY);
        }
        /**
         * 设置大小为全屏
         * @param view Laya.Sprite
         */
        fullScreen(view) {
            if (view == null)
                view = this;
            view.width = Laya.stage.width;
            view.height = Laya.stage.height;
        }
        /**
         * 绑定数据监听
         * @param cmd 监听类型
         */
        addDataWatch(cmd) {
            this.dataWatchs.push(cmd);
            data_manager_1.DataManager.$.addEventListener(cmd, this.onData, this);
            data_manager_1.DataManager.$.get(cmd).notify();
        }
        /**
         * 当数据刷新是重绘
         */
        onData(data) {
            // if (data.cmd == DataDefine.CoinInfo){
            //
            // }
        }
        /**
         * 添加到画布
         * @param data 数据
         */
        add(data = null) {
            this.data = data;
            Laya.stage.addChild(this);
            this.show();
        }
        /**
         * 显示view
         */
        show() {
            this.visible = true;
        }
        /**
         * 隐藏view
         */
        hide() {
            this.visible = false;
        }
    }
    CustomView.ViewBase = ViewBase;
})(CustomView = exports.CustomView || (exports.CustomView = {}));
},{"../data/data-manager":13}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../setting/config");
const log_1 = require("../core/log");
const time_1 = require("../util/time");
const enum_1 = require("../setting/enum");
var Browser = Laya.Browser;
const res_manager_1 = require("../manager/res/res-manager");
const event_data_1 = require("../manager/event/event-data");
const data_manager_1 = require("../manager/data/data-manager");
const event_manager_1 = require("../manager/event/event-manager");
const json_manager_1 = require("../manager/json/json-manager");
const sound_manager_1 = require("../manager/sound/sound-manager");
const timer_manager_1 = require("../manager/timer/timer-manager");
/**
 * @author Sun
 * @time 2019-08-11 18:08
 * @project SFramework_LayaAir
 * @description 框架初始化和游戏入口
 *
 */
class Engine {
    constructor() {
        this.layout = config_1.ConfigLayout.$;
        this.game = config_1.ConfigGame.$;
        this.ui = config_1.ConfigUI.$;
        this.debug = config_1.ConfigDebug.$;
    }
    static get $() {
        if (this.instance == null)
            this.instance = new Engine();
        return this.instance;
    }
    /**
     * 引擎启动入口
     */
    run() {
        log_1.Log.info("::: Game Engine Run :::");
        if (config_1.ConfigUI.$.defaultLoadView != null && config_1.ConfigRes.$.defaultLoadRes != null) {
            this.engineSetup(() => {
                //游戏开始
                time_1.UtilTime.start();
                //初始化游戏管理器
                this.managerSetUp();
                //初始化游戏主循环
                Laya.timer.frameLoop(1, this, this.managerUpdate);
                //加载Loading页的默认资源并显示Loading页
                res_manager_1.ResManager.$.loadGroup(config_1.ConfigRes.$.defaultLoadRes, null, new event_data_1.EventFunc(this, () => {
                    let scrpt = config_1.ConfigUI.$.defaultLoadView;
                    if (scrpt != undefined) {
                        let loadingView = new scrpt();
                        Laya.stage.addChild(loadingView);
                        loadingView.onStart();
                    }
                }));
            });
        }
        else {
            log_1.Log.error("Error:Loading资源为空加载失败！");
        }
    }
    /**
     * 引擎的初始化设置
     */
    engineSetup(startCallback) {
        /**初始化Laya */
        if (this.game.dimension == enum_1.enumDimension.Dim3) {
            Laya3D.init(config_1.ConfigLayout.$.designWidth, config_1.ConfigLayout.$.designHeight);
        }
        else {
            Laya.init(config_1.ConfigLayout.$.designWidth, config_1.ConfigLayout.$.designHeight, Laya.WebGL);
        }
        /**背景颜色 */
        Laya.stage.bgColor = "none";
        /**缩放模式 */
        Laya.stage.scaleMode = enum_1.enumScaleType.ScaleShowAll.toString();
        /**设置屏幕大小 */
        Laya.stage.setScreenSize(Browser.clientWidth, Browser.clientHeight);
        /**设置横竖屏 */
        Laya.stage.screenMode = enum_1.enumScreenModel.ScreenNone;
        /**水平对齐方式 */
        Laya.stage.alignH = enum_1.enumAlige.AligeCenter;
        /**垂直对齐方式 */
        Laya.stage.alignV = enum_1.enumAlige.AligeMiddle;
        /**开启物理引擎 */
        if (config_1.ConfigGame.$.physics)
            Laya["Physics"] && Laya["Physics"].enable();
        /**打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板） */
        if (config_1.ConfigDebug.$.isEnableDebugPanel || Laya.Utils.getQueryString("debug") == "true")
            Laya.enableDebugPanel();
        /**物理辅助线 */
        if (config_1.ConfigDebug.$.isPhysicsDebug && Laya["PhysicsDebugDraw"])
            Laya["PhysicsDebugDraw"].enable();
        /**性能同级面板 */
        if (config_1.ConfigDebug.$.isStat)
            Laya.Stat.show(config_1.ConfigDebug.$.panelX, config_1.ConfigDebug.$.panelY);
        /**微信开放域子域设置*/
        if (Browser.onWeiXin || Browser.onMiniGame) {
            Laya.MiniAdpter.init();
            Laya.isWXOpenDataContext = false;
        }
        /**模式窗口点击边缘 */
        UIConfig.closeDialogOnSide = true;
        /**是否显示滚动条按钮 */
        UIConfig.showButtons = true;
        /**按钮的点击效果 */
        UIConfig.singleButtonStyle = "scale"; //"color","scale"
        /**弹出框背景透明度 */
        UIConfig.popupBgAlpha = 0.75;
        /**兼容Scene后缀场景 */
        Laya.URL.exportSceneToJson = true;
        /**是否开启版本管理 */
        if (config_1.ConfigVersion.$.isOpenVersion) {
            Laya.ResourceVersion.enable(config_1.ConfigVersion.$.versionFloder, Laya.Handler.create(this, startCallback), Laya.ResourceVersion.FILENAME_VERSION);
        }
        else {
            startCallback.call();
        }
    }
    /**
     * 管理器的初始化
     */
    managerSetUp() {
        data_manager_1.DataManager.$.setup();
        event_manager_1.EventManager.$.setup();
        res_manager_1.ResManager.$.setup();
        json_manager_1.JsonManager.$.setup();
        sound_manager_1.SoundManager.$.setup();
        timer_manager_1.TimerManager.$.setup();
    }
    /**
     * 管理器的Update
     */
    managerUpdate() {
    }
}
Engine.instance = null;
exports.Engine = Engine;
},{"../core/log":9,"../manager/data/data-manager":13,"../manager/event/event-data":14,"../manager/event/event-manager":15,"../manager/json/json-manager":17,"../manager/res/res-manager":21,"../manager/sound/sound-manager":22,"../manager/timer/timer-manager":25,"../setting/config":30,"../setting/enum":31,"../util/time":41}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("./enum");
const singleton_1 = require("../core/singleton");
const main_scene_1 = require("../../client/scene/main-scene");
const res_group_1 = require("../manager/res/res-group");
const loading_view_1 = require("../../client/view/layer-view/loading-view");
const json_template_1 = require("../manager/json/json-template");
/**
* @author Sun
* @time 2019-08-09 14:01
* @project SFramework_LayaAir
* @description 游戏配置信息
*/
/**
 * 界面配置
 */
class ConfigUI extends singleton_1.Singleton {
    constructor() {
        super(...arguments);
        /**默认字体 */
        this.defaultFontName = '黑体';
        /**默认字体大小 */
        this.defaultFontSize = 16;
        /**默认加载场景 */
        this.defaultMainScene = main_scene_1.MainScene;
        /**默认加载的Loading页面 */
        this.defaultLoadView = loading_view_1.LoadingView;
    }
    static get $() {
        if (!this.instance)
            this.instance = new ConfigUI();
        return this.instance;
    }
}
ConfigUI.instance = null;
exports.ConfigUI = ConfigUI;
/**
 * 资源配置
 */
class ConfigRes extends singleton_1.Singleton {
    constructor() {
        super();
        /**默认Loading页面的资源信息 */
        this.defaultLoadRes = null;
        /**默认的基础页面资源信息 */
        this.defaultMainRes = null;
        //手动配置loading资源
        this.defaultLoadRes = new res_group_1.ResGroup();
        this.defaultLoadRes
            .add("res/loading/img_loading_bg.png", Laya.Loader.IMAGE)
            .add("res/loading/progress_loading.png", Laya.Loader.IMAGE)
            .add("res/loading/img_8r.png", Laya.Loader.IMAGE);
        //手动配置主页资源
        this.defaultMainRes = new res_group_1.ResGroup();
        this.defaultMainRes
            .add("res/atlas/res/main/effect.atlas", Laya.Loader.ATLAS)
            .add("res/atlas/res/com.atlas", Laya.Loader.ATLAS)
            .add("res/com/img_lottery_border.png", Laya.Loader.IMAGE)
            .add("res/com/img_lottery_content.png", Laya.Loader.IMAGE)
            .add("res/main/bg/bg.png", Laya.Loader.IMAGE);
        //加载Json配置文件
        ConfigData.$.jsonTemplateList.forEach(item => {
            this.defaultMainRes
                .add(item.url, Laya.Loader.JSON);
        });
        //加载音效资源
        ConfigSound.$.soundResList.forEach(item => {
            this.defaultMainRes
                .add(item.url, Laya.Loader.SOUND);
        });
    }
    static get $() {
        if (!this.instance)
            this.instance = new ConfigRes();
        return this.instance;
    }
}
ConfigRes.instance = null;
exports.ConfigRes = ConfigRes;
/**
 * 声音配置
 */
class ConfigSound extends singleton_1.Singleton {
    constructor() {
        super();
        /**背景音乐名字 */
        this.bgSoundName = "";
        /**背景音开关 */
        this.isCloseBGSound = false;
        /**效果音开关 */
        this.isCloseEffectSound = false;
        /**所有音效开关 */
        this.isCloseVoiceSound = false;
        /**总音量 */
        this.volumeVoiceSound = 1;
        /**音效资源 */
        this.soundResList = null;
        this.soundResList = new Array();
        // this.soundResList.push(new SoundTemplate("res/sound/bg.mp3",enumSoundName.bg));
    }
    static get $() {
        if (!this.instance)
            this.instance = new ConfigSound();
        return this.instance;
    }
}
ConfigSound.instance = null;
exports.ConfigSound = ConfigSound;
/**
 * 数据表配置
 */
class ConfigData extends singleton_1.Singleton {
    constructor() {
        super();
        this.jsonTemplateList = new Array();
        this.jsonTemplateList = [
            new json_template_1.JsonTemplate("res/data/InviteData.json", enum_1.enumJsonDefine.invite),
            new json_template_1.JsonTemplate("res/data/LevelData.json", enum_1.enumJsonDefine.level),
            new json_template_1.JsonTemplate("res/data/OfflineData.json", enum_1.enumJsonDefine.offline),
            new json_template_1.JsonTemplate("res/data/TurntableData.json", enum_1.enumJsonDefine.lottery),
        ];
    }
    static get $() {
        if (!this.instance)
            this.instance = new ConfigData();
        return this.instance;
    }
}
ConfigData.instance = null;
exports.ConfigData = ConfigData;
/**
 * 游戏配置
 */
class ConfigGame extends singleton_1.Singleton {
    constructor() {
        super(...arguments);
        /**默认模式信息 2D/3D */
        this.dimension = enum_1.enumDimension.Dim3;
        /**物理开关 */
        this.physics = false;
    }
    static get $() {
        if (!this.instance)
            this.instance = new ConfigGame();
        return this.instance;
    }
}
ConfigGame.instance = null;
exports.ConfigGame = ConfigGame;
/**
 * 版本配置
 */
class ConfigVersion extends singleton_1.Singleton {
    constructor() {
        super(...arguments);
        /**版本控制开关 */
        this.isOpenVersion = false;
        /**版本号 */
        this.versionNum = 0;
        /**版本控制文件名 */
        this.versionFloder = "Version" + this.versionNum;
    }
    static get $() {
        if (!this.instance)
            this.instance = new ConfigVersion();
        return this.instance;
    }
}
ConfigVersion.instance = null;
exports.ConfigVersion = ConfigVersion;
/**
 * 布局配置
 */
class ConfigLayout extends singleton_1.Singleton {
    constructor() {
        super(...arguments);
        /**设计分辨率X */
        this.designWidth = 750;
        /**设计分辨率Y */
        this.designHeight = 1334;
        /**缩放模式 */
        this.scaleMode = enum_1.enumScaleType.ScaleFixedAuto;
    }
    static get $() {
        if (!this.instance)
            this.instance = new ConfigLayout();
        return this.instance;
    }
}
ConfigLayout.instance = null;
exports.ConfigLayout = ConfigLayout;
/**
 * Debug配置
 */
class ConfigDebug extends singleton_1.Singleton {
    constructor() {
        super(...arguments);
        /**调试信息开关 */
        this.isDebug = true;
        /**物理辅助线开关 */
        this.isPhysicsDebug = false;
        /**调试面板 */
        this.isEnableDebugPanel = false;
        /**性能面板开关 */
        this.isStat = true;
        /**性能统计面板X */
        this.panelX = 0;
        /**性能统计面板Y */
        this.panelY = 100;
    }
    static get $() {
        if (!this.instance)
            this.instance = new ConfigDebug();
        return this.instance;
    }
}
ConfigDebug.instance = null;
exports.ConfigDebug = ConfigDebug;
/**
 * 3D配置
 */
class Config3D extends singleton_1.Singleton {
    constructor() {
        super(...arguments);
        /**场景资源路径 */
        this.scenePath = "res/u3d/LayaScene_Main/Conventional/Main.ls";
    }
    static get $() {
        if (!this.instance)
            this.instance = new Config3D();
        return this.instance;
    }
}
Config3D.instance = null;
exports.Config3D = Config3D;
// /**
//  * Network配置
//  */
// export class ConfigNet extends Singleton {
//     public httpUrl: string = "http://127.0.0.1:34568";
//     public wsUrl: string = "wss://wx.donopo.com/ws/ws";
//     public resUrl: string = "ws://127.0.0.1:16669";
//     public timeOut: number = 10;
//     public heartBeat: number = 10;
//     public serverHeartBeat: number = 3;
//     private static instance: ConfigNet = null;
//     public static get $():ConfigNet {
//         if (!this.instance) this.instance = new ConfigNet();
//         return this.instance;
//     }
// }
// /**
//  * 微信配置
//  */
// export class ConfWechat extends Singleton {
//     public appid: string = "";
//     public secret: string = "";
//     public adUnitId: string = "";
//     public code2sessionUrl = "https://api.weixin.qq.com/sns/jscode2session?appid={0}&secret={1}&js_code={2}&grant_type=authorization_code";
//     private static instance: ConfWechat = null;
//     public static get $():ConfWechat {
//         if (!this.instance) this.instance = new ConfWechat();
//         return this.instance;
//     }
// }
},{"../../client/scene/main-scene":2,"../../client/view/layer-view/loading-view":8,"../core/singleton":11,"../manager/json/json-template":18,"../manager/res/res-group":19,"./enum":31}],31:[function(require,module,exports){
"use strict";
/**
 * 重要的枚举定义,框架级别
 *
 * @author Tim Wars
 * @date 2019-01-18 16:20
 * @project firebolt
 * @copyright (C) DONOPO
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Stage = Laya.Stage;
/**
 * 舞台的缩放格式
 */
var enumScaleType;
(function (enumScaleType) {
    // @ts-ignore
    enumScaleType[enumScaleType["ScaleNoScale"] = Stage.SCALE_FULL] = "ScaleNoScale";
    // @ts-ignore
    enumScaleType[enumScaleType["ScaleExactFit"] = Stage.SCALE_EXACTFIT] = "ScaleExactFit";
    // @ts-ignore
    enumScaleType[enumScaleType["ScaleShowAll"] = Stage.SCALE_SHOWALL] = "ScaleShowAll";
    // @ts-ignore
    enumScaleType[enumScaleType["ScaleNoBorder"] = Stage.SCALE_NOBORDER] = "ScaleNoBorder";
    // @ts-ignore
    enumScaleType[enumScaleType["ScaleFull"] = Stage.SCALE_FULL] = "ScaleFull";
    // @ts-ignore
    enumScaleType[enumScaleType["ScaleFixedWidth"] = Stage.SCALE_FIXED_WIDTH] = "ScaleFixedWidth";
    // @ts-ignore
    enumScaleType[enumScaleType["ScaleFixedHeight"] = Stage.SCALE_FIXED_HEIGHT] = "ScaleFixedHeight";
    // @ts-ignore
    enumScaleType[enumScaleType["ScaleFixedAuto"] = Stage.SCALE_FIXED_AUTO] = "ScaleFixedAuto";
    // @ts-ignore
    enumScaleType[enumScaleType["ScaleNoScale"] = Stage.SCALE_NOSCALE] = "ScaleNoScale";
})(enumScaleType = exports.enumScaleType || (exports.enumScaleType = {}));
/**
 * 屏幕的自适应方式
 */
var enumScreenModel;
(function (enumScreenModel) {
    enumScreenModel["ScreenNone"] = "none";
    enumScreenModel["ScreenHorizontal"] = "horizontal";
    enumScreenModel["ScreenVertical"] = "vertical";
})(enumScreenModel = exports.enumScreenModel || (exports.enumScreenModel = {}));
/**
 * 数组排序方式
 * */
var enumArraySortOrder;
(function (enumArraySortOrder) {
    enumArraySortOrder[enumArraySortOrder["Ascending"] = 0] = "Ascending";
    enumArraySortOrder[enumArraySortOrder["Descending"] = 1] = "Descending";
})(enumArraySortOrder = exports.enumArraySortOrder || (exports.enumArraySortOrder = {}));
/**
 * 游戏的运行容器
 */
var enumGamePlatform;
(function (enumGamePlatform) {
    enumGamePlatform[enumGamePlatform["Web"] = 0] = "Web";
    enumGamePlatform[enumGamePlatform["Phone"] = 1] = "Phone";
    enumGamePlatform[enumGamePlatform["Weixin"] = 2] = "Weixin";
})(enumGamePlatform = exports.enumGamePlatform || (exports.enumGamePlatform = {}));
/**
 * 对齐方式
 */
var enumAligeType;
(function (enumAligeType) {
    enumAligeType[enumAligeType["NONE"] = 0] = "NONE";
    enumAligeType[enumAligeType["RIGHT"] = 1] = "RIGHT";
    enumAligeType[enumAligeType["RIGHT_BOTTOM"] = 2] = "RIGHT_BOTTOM";
    enumAligeType[enumAligeType["BOTTOM"] = 3] = "BOTTOM";
    enumAligeType[enumAligeType["LEFT_BOTTOM"] = 4] = "LEFT_BOTTOM";
    enumAligeType[enumAligeType["LEFT"] = 5] = "LEFT";
    enumAligeType[enumAligeType["LEFT_TOP"] = 6] = "LEFT_TOP";
    enumAligeType[enumAligeType["TOP"] = 7] = "TOP";
    enumAligeType[enumAligeType["RIGHT_TOP"] = 8] = "RIGHT_TOP";
    enumAligeType[enumAligeType["MID"] = 9] = "MID";
})(enumAligeType = exports.enumAligeType || (exports.enumAligeType = {}));
/**
 * 对齐标注
 */
var enumAlige;
(function (enumAlige) {
    enumAlige["AligeLeft"] = "left";
    enumAlige["AligeCenter"] = "center";
    enumAlige["AligeRight"] = "right";
    enumAlige["AligeTop"] = "top";
    enumAlige["AligeMiddle"] = "middle";
    enumAlige["AligeBottom"] = "bottom";
})(enumAlige = exports.enumAlige || (exports.enumAlige = {}));
/**
 * 清理资源的次序策略
 */
var enumClearStrategy;
(function (enumClearStrategy) {
    enumClearStrategy[enumClearStrategy["FIFO"] = 0] = "FIFO";
    enumClearStrategy[enumClearStrategy["FILO"] = 1] = "FILO";
    enumClearStrategy[enumClearStrategy["LRU"] = 2] = "LRU";
    enumClearStrategy[enumClearStrategy["UN_USED"] = 3] = "UN_USED";
    enumClearStrategy[enumClearStrategy["ALL"] = 4] = "ALL";
})(enumClearStrategy = exports.enumClearStrategy || (exports.enumClearStrategy = {}));
/**
 * 游戏是否采用的2D或者3D
 */
var enumDimension;
(function (enumDimension) {
    enumDimension["Dim2"] = "2d";
    enumDimension["Dim3"] = "3d";
})(enumDimension = exports.enumDimension || (exports.enumDimension = {}));
/**
 * 游戏的状态
 */
var enumGameStatus;
(function (enumGameStatus) {
    enumGameStatus["Start"] = "GAME-STATUS-START";
    enumGameStatus["Stop"] = "GAME-STATUS-STOP";
    enumGameStatus["Restart"] = "GAME-STATUS-RESTART";
})(enumGameStatus = exports.enumGameStatus || (exports.enumGameStatus = {}));
/**
 lbl  --->Label(文本)
 txt  --->Text(文本)
 rtxt  --->RichText(富文本)
 ipt  --->Input(输入框)
 img  --->Image(图片)
 spt  --->Sprite(精灵)
 grh  --->Graph(图形)
 list --->List(列表)
 load --->Load(装载器)
 gup  --->Group(组)
 com  --->Component(组件)
 btn  --->Button(按钮)
 cob  --->ComboBow(下拉框)
 pbar --->ProgressBar(进度条)
 sld  --->Slider(滑动条)
 win  --->Window（窗口）
 ani  --->Movie(动画)
 eft  --->Transition(动效)
 ctl  --->Controller(控制器)
 */
/**
 * 控件前缀
 */
var enumElementPrefix;
(function (enumElementPrefix) {
    enumElementPrefix["Lable"] = "lbl_";
    enumElementPrefix["Input"] = "ipt_";
    enumElementPrefix["Text"] = "txt_";
    enumElementPrefix["RichText"] = "rtxt_";
    enumElementPrefix["Image"] = "img_";
    enumElementPrefix["Sprite"] = "spt_";
    enumElementPrefix["Graph"] = "grh_";
    enumElementPrefix["List"] = "list_";
    enumElementPrefix["Load"] = "load_";
    enumElementPrefix["Group"] = "gup_";
    enumElementPrefix["Component"] = "com_";
    enumElementPrefix["Button"] = "btn_";
    enumElementPrefix["ComboBow"] = "cob_";
    enumElementPrefix["ProgressBar"] = "pbar_";
    enumElementPrefix["Slider"] = "sld_";
    enumElementPrefix["Window"] = "win_";
    enumElementPrefix["Movie"] = "ani_";
    enumElementPrefix["Transition"] = "eft_";
    enumElementPrefix["Controller"] = "ctl_";
})(enumElementPrefix = exports.enumElementPrefix || (exports.enumElementPrefix = {}));
/**
 * 数据表配置
 */
var enumJsonDefine;
(function (enumJsonDefine) {
    enumJsonDefine["invite"] = "invite";
    enumJsonDefine["level"] = "level";
    enumJsonDefine["lottery"] = "lottery";
    enumJsonDefine["offline"] = "offline";
})(enumJsonDefine = exports.enumJsonDefine || (exports.enumJsonDefine = {}));
/**
 * 音效标记
 */
var enumSoundName;
(function (enumSoundName) {
    enumSoundName["bg"] = "bgSound";
    enumSoundName["botton"] = "btnSound";
})(enumSoundName = exports.enumSoundName || (exports.enumSoundName = {}));
},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dict_1 = require("../util/dict");
/**
 * @author Sun
 * @time 2019-05-21 19:22
 * @project SFramework_LayaAir
 * @description  字典
 *
 */
class Dictionary {
    constructor() {
        this.m_dict = {};
    }
    add(key, value) {
        if (this.hasKey(key))
            return false;
        this.m_dict[key] = value;
        return true;
    }
    remove(key) {
        delete this.m_dict[key];
    }
    hasKey(key) {
        return (this.m_dict[key] != null);
    }
    value(key) {
        if (!this.hasKey(key))
            return null;
        return this.m_dict[key];
    }
    keys() {
        let list = [];
        for (let key in this.m_dict) {
            list.push(key);
        }
        return list;
    }
    values() {
        let list = [];
        for (let key in this.m_dict) {
            list.push(this.m_dict[key]);
        }
        return list;
    }
    clear() {
        for (let key in this.m_dict) {
            delete this.m_dict[key];
        }
    }
    foreach(compareFn) {
        for (let key in this.m_dict) {
            compareFn.call(null, key, this.m_dict[key]);
        }
    }
    foreachBreak(compareFn) {
        for (let key in this.m_dict) {
            if (!compareFn.call(null, key, this.m_dict[key]))
                break;
        }
    }
    get length() {
        return dict_1.UtilDict.size(this.m_dict);
    }
}
exports.Dictionary = Dictionary;
},{"../util/dict":34}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../setting/enum");
/**
* @author Sun
* @time 2019-08-09 23:15
* @project SFramework_LayaAir
* @description 数组工具类
*/
class UtilArray {
    /** 插入元素
     * @param arr 需要操作的数组
     * @param value 需要插入的元素
     * @param index 插入位置
     */
    static insert(arr, value, index) {
        if (index > arr.length - 1) {
            arr.push(value);
        }
        else {
            arr.splice(index, 0, value);
        }
    }
    /**从数组移除元素*/
    static remove(arr, v) {
        let i = arr.indexOf(v);
        if (i != -1) {
            arr.splice(i, 1);
        }
    }
    /**移除所有值等于v的元素*/
    static removeAll(arr, v) {
        let i = arr.indexOf(v);
        while (i >= 0) {
            arr.splice(i, 1);
            i = arr.indexOf(v);
        }
    }
    /**包含元素*/
    static contain(arr, v) {
        return arr.length > 0 ? arr.indexOf(v) != -1 : false;
    }
    /**复制*/
    static copy(arr) {
        return arr.slice();
    }
    /**
     * 排序
     * @param arr 需要排序的数组
     * @param key 排序字段
     * @param order 排序方式
     */
    static sort(arr, key, order = enum_1.enumArraySortOrder.Descending) {
        if (arr == null)
            return;
        arr.sort(function (info1, info2) {
            switch (order) {
                case enum_1.enumArraySortOrder.Ascending: {
                    if (info1[key] < info2[key])
                        return -1;
                    if (info1[key] > info2[key])
                        return 1;
                    else
                        return 0;
                }
                case enum_1.enumArraySortOrder.Descending: {
                    if (info1[key] > info2[key])
                        return -1;
                    if (info1[key] < info2[key])
                        return 1;
                    else
                        return 0;
                }
            }
        });
    }
    /**清空数组*/
    static clear(arr) {
        let i = 0;
        let len = arr.length;
        for (; i < len; ++i) {
            arr[i] = null;
        }
        arr.splice(0);
    }
    /**数据是否为空*/
    static isEmpty(arr) {
        if (arr == null || arr.length == 0) {
            return true;
        }
        return false;
    }
}
exports.UtilArray = UtilArray;
},{"../setting/enum":31}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* @author Sun
* @time 2019-08-10 20:22
* @project SFramework_LayaAir
* @description  字典工具类
*
*/
class UtilDict {
    /**
     * 键列表
     */
    static keys(d) {
        let a = [];
        for (let key in d) {
            a.push(key);
        }
        return a;
    }
    /**
     * 值列表
     */
    static values(d) {
        let a = [];
        for (let key in d) {
            a.push(d[key]);
        }
        return a;
    }
    /**
     * 清空字典
     */
    static clear(dic) {
        let v;
        for (let key in dic) {
            v = dic[key];
            if (v instanceof Object) {
                UtilDict.clear(v);
            }
            delete dic[key];
        }
    }
    /**
     * 全部应用
     */
    static foreach(dic, compareFn) {
        for (let key in dic) {
            if (!compareFn.call(null, key, dic[key]))
                break;
        }
    }
    static isEmpty(dic) {
        if (dic == null)
            return true;
        // @ts-ignore
        for (let key in dic) {
            return false;
        }
        return true;
    }
    static size(dic) {
        if (dic == null)
            return 0;
        let count = 0;
        for (let key in dic) {
            ++count;
        }
        return count;
    }
}
exports.UtilDict = UtilDict;
},{}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sprite = Laya.Sprite;
class UtilDisplay {
    /**
     * 移除全部子对象
     * @param container
     */
    static removeAllChild(container) {
        if (!container)
            return;
        if (container.numChildren <= 0)
            return;
        while (container.numChildren > 0) {
            container.removeChildAt(0);
        }
    }
    /**
     *
     * @param node 销毁UI节点
     */
    static destroyUINode(node) {
        if (node) {
            node.removeSelf();
            node.destroy();
            node = null;
        }
    }
    /**
     * 通过名字获得子节点
     * @param parent
     * @param name
     */
    static getChildByName(parent, name) {
        if (!parent)
            return null;
        if (parent.name === name)
            return parent;
        let child = null;
        let num = parent.numChildren;
        for (let i = 0; i < num; ++i) {
            child = UtilDisplay.getChildByName(parent.getChildAt(i), name);
            if (child)
                return child;
        }
        return null;
    }
    // /**
    //  * 设置对齐方式
    //  * @param alige 对齐方式
    //  */
    // public static setAlige(node: Sprite, alige: enumAligeType, w: number = 0, h: number = 0) {
    //     if (!node) return;
    //     let rect: Rectangle;
    //     if (w <= 0 || h <= 0) rect = node.getBounds();
    //     let width: number = w > 0 ? w : rect.width;
    //     let heigth: number = h > 0 ? h : rect.height;
    //     switch (alige) {
    //         case enumAligeType.LEFT_TOP:
    //             node.pivot(0, 0);
    //             break;
    //         case enumAligeType.LEFT:
    //             node.pivot(0, heigth * 0.5);
    //             break;
    //         case enumAligeType.LEFT_BOTTOM:
    //             node.pivot(0, heigth);
    //             break;
    //         case enumAligeType.TOP:
    //             node.pivot(width * 0.5, 0);
    //             break;
    //         case enumAligeType.MID:
    //             node.pivot(width * 0.5, heigth * 0.5);
    //             break;
    //         case enumAligeType.BOTTOM:
    //             node.pivot(width * 0.5, heigth);
    //             break;
    //         case enumAligeType.RIGHT_TOP:
    //             node.pivot(width, 0);
    //             break;
    //         case enumAligeType.RIGHT:
    //             node.pivot(width, heigth * 0.5);
    //             break;
    //         case enumAligeType.RIGHT_BOTTOM:
    //             node.pivot(width, heigth);
    //             break;
    //     }
    // }
    /**
     * 创建透明遮罩
     */
    static createMaskLayer() {
        let layer = new Sprite();
        layer.mouseEnabled = true;
        let width = layer.width = Laya.stage.width + 200;
        var height = layer.height = Laya.stage.height + 400;
        layer.graphics.clear(true);
        layer.graphics.drawRect(0, 0, width, height, UIConfig.popupBgColor);
        layer.alpha = UIConfig.popupBgAlpha;
        return layer;
    }
}
exports.UtilDisplay = UtilDisplay;
},{}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../core/log");
/**
* @author Sun
* @time 2019-02-25 17:22
* @project SFramework_LayaAir
* @description  3D模型加载工具类
*
*/
class UtilLoad3D {
    /**
     * 加载U3D场景
     * @param area 作用域
     * @param path 场景文件路径
     * @param cb   加载完成回调
     */
    static loadScene(path, area, cb) {
        Laya.loader.create(path, Laya.Handler.create(this, () => {
            Laya.stage.addChild(Laya.loader.getRes(path));
            if (cb) {
                cb.call(area);
            }
        }));
    }
    /**
     * 获取场景内物体
     * @param scene3d 场景
     * @param childName 子物体名字
     */
    static getScene3DChild(scene3d, childName) {
        let ms = scene3d.getChildByName(childName);
        if (ms) {
            return ms;
        }
        log_1.Log.error("Error:获取场景物体失败");
        return null;
    }
    /**
     * 获取模型的子物体模型
     * @param fatSP 父方
     * @param childName 子方名字
     */
    static getModelChildByName(fatSP, childName) {
        let child = fatSP.getChildByName(childName);
        if (child) {
            return child;
        }
        log_1.Log.error("Error:获取模型子物体信息错误");
        return null;
    }
    /**
     * 替换模型
     * @param targetSP 被替换模型
     * @param mianSP   替换模型
     */
    static replaceModel(targetSP, mainSP) {
        if (!targetSP || !mainSP) {
            log_1.Log.error("Error:替换或被替换模型信息错误");
            return null;
        }
        if (targetSP.parent) {
            targetSP.parent.addChild(mainSP);
        }
        mainSP.transform.position = new Laya.Vector3(targetSP.transform.position.x, targetSP.transform.position.y, targetSP.transform.position.z);
        mainSP.transform.scale = new Laya.Vector3(targetSP.transform.scale.x, targetSP.transform.scale.y, targetSP.transform.scale.y);
    }
    /**
     * 替换Mesh模型材质
     * @param targetSP 目标模型
     * @param targetMat 目标材质
     */
    static replaceModelMeshMat(targetSP, targetMat) {
        if (!targetSP || !targetMat) {
            log_1.Log.error("Error:模型或材质信息错误");
            return null;
        }
        targetSP;
        targetSP.meshRenderer.material = targetMat;
    }
    /**
     * 替换SkinMesh模型材质
     * @param targetSP 目标模型
     * @param targetMat 目标材质
     */
    static replaceModelSkinMeshMat(targetSP, targetMat) {
        if (!targetSP || !targetMat) {
            log_1.Log.error("Error:模型或材质信息错误");
            return null;
        }
        targetSP;
        targetSP.skinnedMeshRenderer.material = targetMat;
    }
    /**
     * 获取容器上的材质并存入哈希表
     * @param targetObj 承载材质的容器
     */
    static getMaterials(scene3d) {
        /**Unity场景存贮一个空物体，附带MeshRender用来存储材质**/
        var container = UtilLoad3D.getScene3DChild(scene3d, "MatContainer");
        if (!container) {
            log_1.Log.error("Error:材质容器错误或不存在");
            return null;
        }
        var userInfo = {};
        var matArrary = container.meshRenderer.materials;
        for (var i = 0; i < matArrary.length; i++) {
            var name = matArrary[i].name.slice(0, matArrary[i].name.length - 10);
            userInfo[name] = matArrary[i];
        }
        return userInfo;
    }
    /**
     * 返回指定名字的材质
     * @param matArraty 存放材质的哈希表
     * @param matName   材质名字
     */
    static getMaterialByName(matArrary, matName) {
        if (!matArrary) {
            log_1.Log.error("Error:材质哈希表信息错误");
            return null;
        }
        if (!matArrary[matName]) {
            log_1.Log.error("Error:指定哈希表内不存在[" + matName + "]材质");
            return null;
        }
        return matArrary[matName];
    }
    /**
     * 播放模型动画
     * @param targetSp 播放物体
     * @param aniName  动画名字
     * @param isCross  是否过度
     * 通过this.animator.getCurrentAnimatorPlayState(0).normalizedTime>=1去判断当前动画是否播放完成
     */
    static playAnimatorByName(targetSp, aniName, isCross) {
        var animator = targetSp.getComponent(Laya.Animator);
        if (!animator) {
            log_1.Log.error("Error:动画机信息错误");
            return;
        }
        if (isCross != null && isCross == false) {
            animator.play(aniName);
            return;
        }
        animator.crossFade(aniName, 0.2);
        return animator;
    }
    /**
     * 控制动画速度
     * @param targetSp 目标物体
     * @param speed 播放速度
     */
    static controlAnimatorSpeed(targetSp, speed) {
        var animator = targetSp.getComponent(Laya.Animator);
        if (!animator) {
            log_1.Log.error("Error:动画机信息错误");
            return;
        }
        if (speed) {
            animator.speed = speed;
        }
        else {
            animator.speed = 1;
        }
    }
    /**
     * 判断动画是否完成
     * @param animator
     */
    static confirmAniComplete(animator) {
        var bool = false;
        let index = animator.getCurrentAnimatorPlayState(0).normalizedTime;
        if (index >= 1) {
            bool = true;
        }
        return bool;
    }
}
exports.UtilLoad3D = UtilLoad3D;
},{"../core/log":9}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math3d_1 = require("./math3d");
/**
 * @author Sun
 * @time 2019-01-18 16:20
 * @project SFramework_LayaAir
 * @description 算法工具类
 *
 */
class UtilMath {
    static Sign(f) {
        return ((f < 0) ? -1 : 1);
    }
    /**
     * 限定数字在范围区间并返回
     * @param num
     * @param min
     * @param max
     * @constructor
     */
    static clamp(num, min, max) {
        if (num < min) {
            num = min;
        }
        else if (num > max) {
            num = max;
        }
        return num;
    }
    static clamp01(value) {
        if (value < 0)
            return 0;
        if (value > 1)
            return 1;
        return value;
    }
    static lerp(from, to, t) {
        return (from + ((to - from) * UtilMath.clamp01(t)));
    }
    static lerpAngle(a, b, t) {
        let num = UtilMath.repeat(b - a, 360);
        if (num > 180)
            num -= 360;
        return (a + (num * UtilMath.clamp01(t)));
    }
    static repeat(t, length) {
        return (t - (Math.floor(t / length) * length));
    }
    /**
     * 产生随机数
     * 结果：x>=param1 && x<param2
     */
    static randRange(param1, param2) {
        let loc = Math.random() * (param2 - param1) + param1;
        return loc;
    }
    /**
     * 产生随机数
     * 结果：x>=param1 && x<=param2
     */
    static randRangeInt(param1, param2) {
        let loc = Math.random() * (param2 - param1 + 1) + param1;
        return Math.floor(loc);
    }
    /**
     * 从数组中产生随机数[-1,1,2]
     * 结果：-1/1/2中的一个
     */
    static randRangeArray(arr) {
        if (arr.length == 0)
            return null;
        let loc = arr[UtilMath.randRangeInt(0, arr.length - 1)];
        return loc;
    }
    /**
     * 转换为360度角度
     */
    static clampDegrees(degrees) {
        while (degrees < 0)
            degrees = degrees + 360;
        while (degrees >= 360)
            degrees = degrees - 360;
        return degrees;
    }
    /**
     * 转换为360度弧度
     */
    static clampRadians(radians) {
        while (radians < 0)
            radians = radians + 2 * Math.PI;
        while (radians >= 2 * Math.PI)
            radians = radians - 2 * Math.PI;
        return radians;
    }
    /**
     * 两点间的距离
     */
    static getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    }
    static getSquareDistance(x1, y1, x2, y2) {
        return Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2);
    }
    /**
     * 两点间的弧度：x正方形为0，Y轴向下,顺时针为正
     */
    static getLineRadians(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }
    static getLineDegree(x1, y1, x2, y2) {
        let degree = UtilMath.toDegree(UtilMath.getLineRadians(x1, y1, x2, y2));
        return UtilMath.clampDegrees(degree);
    }
    static getPointRadians(x, y) {
        return Math.atan2(y, x);
    }
    static getPointDegree(x, y) {
        let degree = UtilMath.toDegree(UtilMath.getPointRadians(x, y));
        return UtilMath.clampDegrees(degree);
    }
    /**
     * 弧度转化为度
     */
    static toDegree(radian) {
        return radian * (180.0 / Math.PI);
    }
    /**
     * 度转化为弧度
     */
    static toRadian(degree) {
        return degree * (Math.PI / 180.0);
    }
    static moveTowards(current, target, maxDelta) {
        if (Math.abs(target - current) <= maxDelta) {
            return target;
        }
        return (current + (UtilMath.Sign(target - current) * maxDelta));
    }
    /**
     * 获取一定范围内的随机整数
     * @param min 最小值
     * @param max 最大值
     * @constructor
     */
    static random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    /**
     * 二维向量归一化
     * @param x
     * @param y
     */
    static normalize(x, y) {
        return Math.sqrt(x * x + y * y);
    }
    /**
     * 返回两向量夹角
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     */
    static vectorAngle(x1, y1, x2, y2) {
        if (x1 == x2 && y1 == y2) {
            return;
        }
        var cosAngle = (x1 * x2 + y1 * y2) / (UtilMath.normalize(x1, y1) * UtilMath.normalize(x2, y2));
        var aCosAngle = Math.acos(cosAngle);
        var angle = math3d_1.UtilMath3D.Rad2Deg(aCosAngle);
        if (x1 / y1 < x2 / y2)
            angle = -angle;
        return angle;
    }
}
/**字节转换M*/
UtilMath.BYTE_TO_M = 1 / (1024 * 1024);
/**字节转换K*/
UtilMath.BYTE_TO_K = 1 / (1024);
UtilMath.Deg2Rad = 0.01745329;
UtilMath.Rad2Deg = 57.29578;
exports.UtilMath = UtilMath;
},{"./math3d":38}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector2 = Laya.Vector2;
var Vector3 = Laya.Vector3;
var Vector4 = Laya.Vector4;
const string_1 = require("./string");
/**
 * @author Sun
 * @time 2019-08-11 18:08
 * @project SFramework_LayaAir
 * @description 3d算法工具类
 *
 */
class UtilMath3D {
    static get TempVec2() {
        if (!UtilMath3D._Vec2Temp)
            UtilMath3D._Vec2Temp = new Vector2(0, 0);
        return UtilMath3D._Vec2Temp;
    }
    static get TempVec3() {
        if (!UtilMath3D._Vec3Temp)
            UtilMath3D._Vec3Temp = new Vector3(0, 0, 0);
        return UtilMath3D._Vec3Temp;
    }
    static get TempVec4() {
        if (!UtilMath3D._Vec4Temp)
            UtilMath3D._Vec4Temp = new Vector4(0, 0, 0, 0);
        return UtilMath3D._Vec4Temp;
    }
    /**转换为水平方向*/
    static ToHorizontal(vec) {
        vec.y = 0;
        return vec;
    }
    /**水平距离*/
    static HorizontalDistance(vec1, vec2) {
        vec1.y = 0;
        vec2.y = 0;
        return Vector3.scalarLength(Vec3Sub(vec1, vec2));
    }
    /**射线上的一点*/
    static GetRayPoint(ray, distance) {
        return Vec3Add(ray.origin, Vec3Mul(ray.direction, distance));
    }
    /** Des:三维求两点距离 */
    static Vec3Magnitude(vec1, vec2) {
        return Math.sqrt((vec1.x - vec2.x) * (vec1.x - vec2.x) + ((vec1.y - vec2.y) * (vec1.y - vec2.y)) + ((vec1.z - vec2.z) * (vec1.z - vec2.z)));
    }
    /** Des:二维求两点距离 */
    static Vec2Magnitude(vec1, vec2) {
        return Math.sqrt((vec1.x - vec2.x) * (vec1.x - vec2.x) + ((vec1.y - vec2.y) * (vec1.y - vec2.y)));
    }
    /** Des:角度转弧度 */
    static Deg2Rad(angle) {
        return Laya.Utils.toRadian(angle);
    }
    /** Des:弧度转角度 */
    static Rad2Deg(radian) {
        return Laya.Utils.toAngle(radian);
    }
    /** Des:正弦 */
    static sin(angle) {
        var radian = UtilMath3D.Deg2Rad(angle);
        return Math.sin(radian);
    }
    /** Des:余弦 */
    static cos(angle) {
        var radian = UtilMath3D.Deg2Rad(angle);
        return Math.cos(radian);
    }
    /** Des:正切 */
    static tan(angle) {
        var radian = UtilMath3D.Deg2Rad(angle);
        return Math.tan(radian);
    }
    /** Des:反正弦 */
    static asin(angle) {
        var radian = UtilMath3D.Deg2Rad(angle);
        return Math.asin(radian);
    }
    /** Des:反余弦 */
    static acos(angle) {
        var radian = UtilMath3D.Deg2Rad(angle);
        return Math.acos(radian);
    }
    /** Des:反正切 */
    static atan(angle) {
        var radian = UtilMath3D.Deg2Rad(angle);
        return Math.atan(radian);
    }
}
UtilMath3D._Vec2Temp = null;
UtilMath3D._Vec3Temp = null;
UtilMath3D._Vec4Temp = null;
exports.UtilMath3D = UtilMath3D;
//～～～～～～～～～～～～～～～～～～～～～～～vec2～～～～～～～～～～～～～～～～～～～～～～～//
function Vec2Add(a, b) {
    return new Vector2(a.x + b.x, a.y + b.y);
}
exports.Vec2Add = Vec2Add;
function Vec2Sub(a, b) {
    return new Vector2(a.x - b.x, a.y - b.y);
}
exports.Vec2Sub = Vec2Sub;
function Vec2Multiply(a, b) {
    return new Vector2(a.x * b.x, a.y * b.y);
}
exports.Vec2Multiply = Vec2Multiply;
function Vec2Mul(a, d) {
    return new Vector2(a.x * d, a.y * d);
}
exports.Vec2Mul = Vec2Mul;
function Vec2Div(a, d) {
    return new Vector2(a.x / d, a.y / d);
}
exports.Vec2Div = Vec2Div;
function Vec2Dot(lhs, rhs) {
    return ((lhs.x * rhs.x) + (lhs.y * rhs.y));
}
exports.Vec2Dot = Vec2Dot;
function Vec2Project(vector, onNormal) {
    let num = Vec2Dot(onNormal, onNormal);
    if (num < 1E-05) {
        return Vector2.ZERO;
    }
    return (Vec2Div(Vec2Mul(onNormal, Vec2Dot(vector, onNormal)), num));
}
exports.Vec2Project = Vec2Project;
function Vec2Min(lhs, rhs) {
    return new Vector2(Math.min(lhs.x, rhs.x), Math.min(lhs.y, rhs.y));
}
exports.Vec2Min = Vec2Min;
function Vec2Max(lhs, rhs) {
    return new Vector2(Math.max(lhs.x, rhs.x), Math.max(lhs.y, rhs.y));
}
exports.Vec2Max = Vec2Max;
function Vec2Magnitude(vec) {
    return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
}
exports.Vec2Magnitude = Vec2Magnitude;
function Vec2SqrMagnitude(vec) {
    return (vec.x * vec.x) + (vec.y * vec.y);
}
exports.Vec2SqrMagnitude = Vec2SqrMagnitude;
function Vec2Normalized(vec) {
    let magnitude = Vec2Magnitude(vec);
    let v;
    if (magnitude > 1E-05)
        v = Vec2Div(vec, magnitude);
    else
        v = new Vector2(0, 0);
    return v;
}
exports.Vec2Normalized = Vec2Normalized;
function Vec2Normal(vec) {
    let magnitude = Vec2Magnitude(vec);
    if (magnitude > 1E-05) {
        let v = Vec2Div(vec, magnitude);
        Vec2Set(vec, v.x, v.y);
    }
    else
        Vec2Set(vec, 0, 0);
}
exports.Vec2Normal = Vec2Normal;
function Vec2Set(v, x, y) {
    v.x = x;
    v.y = y;
    ;
    return v;
}
exports.Vec2Set = Vec2Set;
// export function Vec2Angle(from: Vector2, to: Vector2): number {
//     return (Math.acos(UtilMath.clamp(Vec2Dot(Vec2Normalized(from), Vec2Normalized(to)), -1, 1)) * 57.29578);
// }
function Vec2ClampMagnitude(vector, maxLength) {
    if (Vec2SqrMagnitude(vector) > (maxLength * maxLength)) {
        return (Vec2Mul(Vec2Normalized(vector), maxLength));
    }
    return vector;
}
exports.Vec2ClampMagnitude = Vec2ClampMagnitude;
// export function Vec2Lerp(from: Vector2, to: Vector2, t: number): Vector2 {
//     t = UtilMath.clamp(t, 0, 1);
//     return new Vector2(from.x + ((to.x - from.x) * t), from.y + ((to.y - from.y) * t));
// }
function Vec2MoveTowards(current, target, maxDistanceDelta) {
    let vector = Vec2Sub(target, current);
    let magnitude = Vec2Magnitude(vector);
    if ((magnitude > maxDistanceDelta) && (magnitude != 0)) {
        return Vec2Add(current, (Vec2Mul(Vec2Div(vector, magnitude), maxDistanceDelta)));
    }
    return target;
}
exports.Vec2MoveTowards = Vec2MoveTowards;
function Vec2ToString(vec) {
    return string_1.UtilString.format("({0}, {1})", vec.x, vec.y);
}
exports.Vec2ToString = Vec2ToString;
//～～～～～～～～～～～～～～～～～～～～～～～vec3～～～～～～～～～～～～～～～～～～～～～～～//
function Vec3Add(a, b) {
    return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
}
exports.Vec3Add = Vec3Add;
function Vec3Sub(a, b) {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
}
exports.Vec3Sub = Vec3Sub;
function Vec3Multiply(a, b) {
    return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
}
exports.Vec3Multiply = Vec3Multiply;
function Vec3Mul(a, d) {
    return new Vector3(a.x * d, a.y * d, a.z * d);
}
exports.Vec3Mul = Vec3Mul;
function Vec3Div(a, d) {
    return new Vector3(a.x / d, a.y / d, a.z / d);
}
exports.Vec3Div = Vec3Div;
function Vec3Cross(lhs, rhs) {
    return new Vector3((lhs.y * rhs.z) - (lhs.z * rhs.y), (lhs.z * rhs.x) - (lhs.x * rhs.z), (lhs.x * rhs.y) - (lhs.y * rhs.x));
}
exports.Vec3Cross = Vec3Cross;
function Vec3Project(vector, onNormal) {
    let num = Vector3.dot(onNormal, onNormal);
    if (num < 1E-05) {
        return new Vector3();
    }
    return (Vec3Div(Vec3Mul(onNormal, Vector3.dot(vector, onNormal)), num));
}
exports.Vec3Project = Vec3Project;
function Vec3Min(lhs, rhs) {
    return new Vector3(Math.min(lhs.x, rhs.x), Math.min(lhs.y, rhs.y), Math.min(lhs.z, rhs.z));
}
exports.Vec3Min = Vec3Min;
function Vec3Max(lhs, rhs) {
    return new Vector3(Math.max(lhs.x, rhs.x), Math.max(lhs.y, rhs.y), Math.max(lhs.z, rhs.z));
}
exports.Vec3Max = Vec3Max;
function Vec3Magnitude(vec) {
    return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y) + (vec.z * vec.z));
}
exports.Vec3Magnitude = Vec3Magnitude;
function Vec3SqrMagnitude(vec) {
    return (vec.x * vec.x) + (vec.y * vec.y) + (vec.z * vec.z);
}
exports.Vec3SqrMagnitude = Vec3SqrMagnitude;
function Vec3Normalized(vec) {
    let magnitude = Vector3.scalarLength(vec);
    let v;
    if (magnitude > 1E-05)
        v = Vec3Div(vec, magnitude);
    else
        v = new Vector3(0, 0, 0);
    return v;
}
exports.Vec3Normalized = Vec3Normalized;
function Vec3Normal(vec) {
    let magnitude = Vector3.scalarLength(vec);
    if (magnitude > 1E-05) {
        let v = Vec3Div(vec, magnitude);
        Vec3Set(vec, v.x, v.y, v.z);
    }
    else
        Vec3Set(vec, 0, 0, 0);
}
exports.Vec3Normal = Vec3Normal;
function Vec3Set(v, x, y, z) {
    v.x = x;
    v.y = y;
    v.z = z;
    return v;
}
exports.Vec3Set = Vec3Set;
// export function Vec3Angle(from: Vector3, to: Vector3): number {
//     return (Math.acos(UtilMath.clamp(Vector3.dot(Vec3Normalized(from), Vec3Normalized(to)), -1, 1)) * 57.29578);
// }
function Vec3ClampMagnitude(vector, maxLength) {
    if (Vector3.scalarLengthSquared(vector) > (maxLength * maxLength)) {
        return (Vec3Mul(Vec3Normalized(vector), maxLength));
    }
    return vector;
}
exports.Vec3ClampMagnitude = Vec3ClampMagnitude;
// export function Vec3Lerp(from: Vector3, to: Vector3, t: number): Vector3 {
//     t = UtilMath.clamp(t, 0, 1);
//     return new Vector3(from.x + ((to.x - from.x) * t), from.y + ((to.y - from.y) * t), from.z + ((to.z - from.z) * t));
// }
function Vec3MoveTowards(current, target, maxDistanceDelta) {
    let vector = Vec3Sub(target, current);
    let magnitude = Vector3.scalarLength(vector);
    if ((magnitude > maxDistanceDelta) && (magnitude != 0)) {
        return Vec3Add(current, (Vec3Mul(Vec3Div(vector, magnitude), maxDistanceDelta)));
    }
    return target;
}
exports.Vec3MoveTowards = Vec3MoveTowards;
function Vec3ToString(vec) {
    return string_1.UtilString.format("({0}, {1}, {2})", vec.x, vec.y, vec.z);
}
exports.Vec3ToString = Vec3ToString;
/**
 * 弧度转向量
 * @param    radians    弧度
 */
function getLineFromRadians(radians) {
    let x = Math.cos(radians);
    let y = Math.sin(radians);
    let dir = new Vector2(x, y);
    Vec2Normal(dir);
    return dir;
}
exports.getLineFromRadians = getLineFromRadians;
},{"./string":40}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_1 = require("./string");
/**
 * @author Sun
 * @time 2019-08-11 18:54
 * @project SFramework_LayaAir
 * @description 数值工具类
 *
 */
class UtilNumber {
    /**
     * 保留小数点后几位
     */
    static toFixed(value, p) {
        return string_1.UtilString.toNumber(value.toFixed(p));
    }
    static toInt(value) {
        return Math.floor(value);
    }
    static isInt(value) {
        return Math.ceil(value) == value;
    }
    /**
     * 保留有效数值
     */
    static reserveNumber(num, size) {
        let str = String(num);
        let l = str.length;
        let p_index = str.indexOf(".");
        if (p_index < 0) {
            return num;
        }
        let ret = str.slice(0, p_index + 1);
        let lastNum = l - p_index;
        if (lastNum > size) {
            lastNum = size;
        }
        let lastStr = str.slice(p_index + 1, p_index + 1 + lastNum);
        return string_1.UtilString.toNumber(ret + lastStr);
    }
    /**
     * 保留有效数值，不够补0；注意返回的是字符串
     */
    static reserveNumberWithZero(num, size) {
        let str = String(num);
        let l = str.length;
        let p_index = str.indexOf(".");
        if (p_index < 0) { //是整数
            str += '.';
            for (let i = 0; i < size; ++i)
                str += '0';
            return str;
        }
        let ret = str.slice(0, p_index + 1);
        let lastNum = l - p_index - 1;
        if (lastNum > size) { //超过
            lastNum = size;
            let lastStr = str.slice(p_index + 1, p_index + 1 + lastNum);
            return ret + lastStr;
        }
        else if (lastNum < size) { //不足补0
            let diff = size - lastNum;
            for (let i = 0; i < diff; ++i)
                str += '0';
            return str;
        }
        else
            return str;
    }
    /**
     *
     */
    static formatThousandsNumber(num) {
        if (num < 1000000) {
            return num.toLocaleString();
        }
        else if (num < 1000000000) {
            let t = Math.floor(num / 1000);
            return t.toLocaleString() + "K";
        }
        else {
            let t = Math.floor(num / 1000000);
            return t.toLocaleString() + "M";
        }
    }
    /**
     *
     */
    static formatNumberShort(num, fixed = 0) {
        if (num < 1000) {
            return num;
        }
        else if (num < 1000000) {
            let t = Math.floor(num / 1000).toFixed(fixed);
            return t + "K";
        }
        else if (num < 1000000000) {
            let t = Math.floor(num / 1000000).toFixed(fixed);
            return t + "M";
        }
        else {
            let t = Math.floor(num / 1000000000).toFixed(fixed);
            return t.toLocaleString() + "G";
        }
    }
    /**
     * 科学计数法显示
     * @param num1
     */
    static bigNumberFormat(num, fixed = 2) {
        let exts = [
            '', 'K', "M", "G", "T", "P", "E", "Z", "Y", "AA",
            "BB", "CC", 'DD', 'EE', "FF", "GG", "HH", "II",
            "JJ", "KK", 'LL', 'MM', "NN", "OO", "PP", "QQ",
            "RR", "SS", 'TT', 'UU', "VV", "WW", "XX", "YY",
            "ZZ", "aa", 'bb', 'cc', "dd", "ee", "ff", "gg",
            "hh", "ii", 'gg', 'kk', "ll", "mm", "nn", "oo",
            "pp", "qq", 'rr', 'ss', "tt", "uu", "vv", "ww"
        ];
        let t1, t2;
        let n1 = num.indexOf("e+");
        if (n1 == -1)
            n1 = num.indexOf("E");
        if (n1 && n1 != -1) {
            t1 = parseFloat(num.substr(0, n1));
            t2 = parseInt(num.substr(n1 + 2));
            let ext = Math.floor(t2 / 3);
            let m = t2 % 3;
            return (t1 * Math.pow(10, m)).toFixed(fixed) + exts[ext];
        }
        return num;
    }
    /**
     * 数字相加
     */
    static bigNumberAdd(num1, num2) {
        let b = Number(num1) + Number(num2);
        return b.toExponential(4);
    }
    /**
     * 数字相减
     */
    static bigNumberSub(num1, num2) {
        let n1 = Number(num1);
        let n2 = Number(num2);
        if (n1 < n2) {
            return null;
        }
        return (n1 - n2).toExponential(4);
    }
    /**
     * 数字相乘法
     */
    static bigNumberMul(num1, num2) {
        return (Number(num1) * num2).toExponential(4);
    }
    /**
     * 数字相除
     */
    static bigNumberDiv(num1, num2) {
        return (Number(num1) / num2).toExponential(4);
    }
    /**
     * 两个科学计数相除
     */
    static bigNumberDivDounble(num1, num2) {
        return (Number(num1) / Number(num2));
    }
}
exports.UtilNumber = UtilNumber;
},{"./string":40}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Sun
 * @time 2019-08-11 18:55
 * @project SFramework_LayaAir
 * @description 字符串工具类
 *
 */
class UtilString {
    static get empty() {
        return "";
    }
    /**
     * 字符串是否有值
     */
    static isEmpty(s) {
        return (s != null && s.length > 0) ? false : true;
    }
    static toInt(str) {
        if (!str || str.length == 0)
            return 0;
        return parseInt(str);
    }
    static toNumber(str) {
        if (!str || str.length == 0)
            return 0;
        return parseFloat(str);
    }
    /**
     * 获取字符串真实长度,注：
     * 1.普通数组，字符占1字节；汉子占两个字节
     * 2.如果变成编码，可能计算接口不对
     */
    static getNumBytes(str) {
        let realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128)
                realLength += 1;
            else
                realLength += 2;
        }
        return realLength;
    }
    /**
     * 补零
     * @param str
     * @param len
     * @param dir 0-后；1-前
     * @return
     */
    static addZero(str, len, dir = 0) {
        let _str = "";
        let _len = str.length;
        let str_pre_zero = "";
        let str_end_zero = "";
        if (dir == 0)
            str_end_zero = "0";
        else
            str_pre_zero = "0";
        if (_len < len) {
            let i = 0;
            while (i < len - _len) {
                _str = str_pre_zero + _str + str_end_zero;
                ++i;
            }
            return _str + str;
        }
        return str;
    }
    /**
     * 去除左右空格
     * @param input
     * @return
     */
    static trim(input) {
        if (input == null) {
            return "";
        }
        return input.replace(/^\s+|\s+$""^\s+|\s+$/g, "");
    }
    /**
     * 去除左侧空格
     * @param input
     * @return
     */
    static trimLeft(input) {
        if (input == null) {
            return "";
        }
        return input.replace(/^\s+""^\s+/, "");
    }
    /**
     * 去除右侧空格
     * @param input
     * @return
     */
    static trimRight(input) {
        if (input == null) {
            return "";
        }
        return input.replace(/\s+$""\s+$/, "");
    }
    /**
     * 分钟与秒格式(如-> 40:15)
     * @param seconds 秒数
     * @return
     */
    static minuteFormat(seconds) {
        let min = Math.floor(seconds / 60);
        let sec = Math.floor(seconds % 60);
        let min_str = min < 10 ? ("0" + min.toString()) : (min.toString());
        let sec_str = sec < 10 ? ("0" + sec.toString()) : (sec.toString());
        return min_str + ":" + sec_str;
    }
    /**
     * 时分秒格式(如-> 05:32:20)
     * @param seconds(秒)
     * @return
     */
    static hourFormat(seconds) {
        let hour = Math.floor(seconds / 3600);
        let hour_str = hour < 10 ? ("0" + hour.toString()) : (hour.toString());
        return hour_str + ":" + UtilString.minuteFormat(seconds % 3600);
    }
    /**
     * 格式化字符串
     * @param str 需要格式化的字符串，【"杰卫，这里有{0}个苹果，和{1}个香蕉！", 5,10】
     * @param args 参数列表
     */
    static format(str, ...args) {
        for (let i = 0; i < args.length; i++) {
            str = str.replace(new RegExp("\\{" + i + "\\}", "gm"), args[i]);
        }
        return str;
    }
    /**
     * 以指定字符开始
     */
    static beginsWith(input, prefix) {
        return prefix == input.substring(0, prefix.length);
    }
    /**
     * 以指定字符结束
     */
    static endsWith(input, suffix) {
        return suffix == input.substring(input.length - suffix.length);
    }
    /**guid*/
    static getGUIDString() {
        let d = Date.now();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    /**
     * 首字母大学
     */
    static firstUpperCase(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    /**
     * 格式化下划线的单词
     */
    static formatDashWord(word, capFirst = false) {
        let first = true;
        let result = "";
        word.split('_').forEach((sec) => {
            if (first) {
                if (capFirst) {
                    result = UtilString.firstUpperCase(sec);
                }
                else {
                    result = sec;
                }
                first = false;
            }
            else {
                result = result + UtilString.firstUpperCase(sec);
            }
        });
        return result;
    }
    /**
     * 截取字符串
     * @param str 字符串
     * @param start 开始位置
     * @param end 结束位置
     */
    static substring(str, start, end) {
        return str.substring(start, end);
    }
    /**
     * 截取字符串
     * @param str 字符串
     * @param start 开始位置
     * @param long 截取长度
     */
    static substr(str, start, long) {
        return str.substr(start, long);
    }
    /**
     * 字符串转对象
     * @param str
     */
    static strToObject(str) {
        const strToObj = JSON.parse(str);
        return strToObj;
    }
    /**
     * 对象转字符串
     * @param str
     */
    static objToStr(obj) {
        const objToStr = JSON.stringify(obj);
        return objToStr;
    }
}
exports.UtilString = UtilString;
},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Sun
 * @time 2019-08-09 19:18
 * @project SFramework_LayaAir
 * @description  时间工具
 *
 */
class UtilTime {
    static start() {
        this.m_StartTime = Laya.timer.currTimer;
    }
    /**两帧之间的时间间隔,单位秒*/
    static get deltaTime() {
        return Laya.timer.delta * 0.001;
    }
    /**固定两帧之间的时间间隔*/
    static get fixedDeltaTime() {
        return 0;
    }
    /**当前时间，相对xxxx年开始经过的毫秒数*/
    static get time() {
        return Laya.timer.currTimer;
    }
    /**游戏启动到现在的时间,单位毫秒*/
    static get timeSinceStartup() {
        return (Laya.timer.currTimer - this.m_StartTime);
    }
    /**游戏启动后，经过的帧数*/
    static get frameCount() {
        return Laya.timer.currFrame;
    }
    static get timeScale() {
        return Laya.timer.scale;
    }
    static set timeScale(scale) {
        Laya.timer.scale = scale;
    }
}
UtilTime.m_StartTime = 0;
exports.UtilTime = UtilTime;
},{}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const view_base_1 = require("../framework/manager/ui/view-base");
const dialog_base_1 = require("../framework/manager/ui/dialog-base");
var DialogBase = dialog_base_1.CustomDialog.DialogBase;
var ViewBase = view_base_1.CustomView.ViewBase;
var REG = Laya.ClassUtils.regClass;
var ui;
(function (ui) {
    var view;
    (function (view) {
        var com;
        (function (com) {
            class day7sUI extends DialogBase {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(day7sUI.uiView);
                }
            }
            day7sUI.uiView = { "type": "DialogBase", "props": { "width": 750, "height": 1334 }, "compId": 2, "loadList": [], "loadList3D": [] };
            com.day7sUI = day7sUI;
            REG("ui.view.com.day7sUI", day7sUI);
            class inviteUI extends DialogBase {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(inviteUI.uiView);
                }
            }
            inviteUI.uiView = { "type": "DialogBase", "props": { "width": 750, "height": 1334 }, "compId": 2, "loadList": [], "loadList3D": [] };
            com.inviteUI = inviteUI;
            REG("ui.view.com.inviteUI", inviteUI);
            class lotteryUI extends DialogBase {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(lotteryUI.uiView);
                }
            }
            lotteryUI.uiView = { "type": "DialogBase", "props": { "y": 0, "x": 0, "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 615, "x": 375, "skin": "res/com/img_lottery_border.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 45, "child": [{ "type": "Image", "props": { "y": 314, "x": 314, "var": "imgContext", "skin": "res/com/img_lottery_content.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 46 }, { "type": "Image", "props": { "y": -66, "x": 253, "skin": "res/com/img_zhen.png" }, "compId": 47 }, { "type": "Button", "props": { "y": 780, "x": 314, "width": 258, "var": "btnConfirm", "stateNum": 1, "skin": "res/main/effect/btn_common_2.png", "height": 130, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 48, "child": [{ "type": "Label", "props": { "valign": "middle", "top": 0, "text": "抽奖", "right": 0, "left": 0, "fontSize": 60, "bottom": 0, "bold": true, "align": "center" }, "compId": 49 }] }, { "type": "Button", "props": { "y": -194, "x": 587, "var": "btnClose", "stateNum": 1, "skin": "res/main/effect/btn_close.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 50 }] }], "animations": [{ "nodes": [{ "target": 34, "keyframes": { "x": [{ "value": 367, "tweenMethod": "linearNone", "tween": true, "target": 34, "key": "x", "index": 0 }, { "value": 367, "tweenMethod": "linearNone", "tween": true, "target": 34, "key": "x", "index": 10 }, { "value": 367, "tweenMethod": "linearNone", "tween": true, "target": 34, "key": "x", "index": 25 }], "visible": [{ "value": true, "tweenMethod": "linearNone", "tween": false, "target": 34, "key": "visible", "index": 0 }, { "value": false, "tweenMethod": "linearNone", "tween": false, "target": 34, "key": "visible", "index": 10 }, { "value": true, "tweenMethod": "linearNone", "tween": false, "target": 34, "key": "visible", "index": 15 }, { "value": false, "tweenMethod": "linearNone", "tween": false, "target": 34, "key": "visible", "index": 25 }, { "value": true, "tweenMethod": "linearNone", "tween": false, "target": 34, "key": "visible", "index": 30 }], "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 34, "key": "rotation", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 34, "key": "rotation", "index": 10 }, { "value": 7, "tweenMethod": "linearNone", "tween": true, "target": 34, "key": "rotation", "index": 15 }, { "value": 7, "tweenMethod": "linearNone", "tween": true, "target": 34, "key": "rotation", "index": 25 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 34, "key": "rotation", "index": 30 }] } }], "name": "idle", "id": 1, "frameRate": 24, "action": 0 }], "loadList": ["res/com/img_lottery_border.png", "res/com/img_lottery_content.png", "res/com/img_zhen.png", "res/main/effect/btn_common_2.png", "res/main/effect/btn_close.png"], "loadList3D": [] };
            com.lotteryUI = lotteryUI;
            REG("ui.view.com.lotteryUI", lotteryUI);
            class rankUI extends DialogBase {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(rankUI.uiView);
                }
            }
            rankUI.uiView = { "type": "DialogBase", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "WXOpenDataViewer", "props": { "y": 381, "x": 116, "width": 524, "mouseThrough": true, "iconSign": "wx", "height": 858, "runtime": "laya.ui.WXOpenDataViewer" }, "compId": 3 }], "loadList": [], "loadList3D": [] };
            com.rankUI = rankUI;
            REG("ui.view.com.rankUI", rankUI);
            class shopUI extends DialogBase {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(shopUI.uiView);
                }
            }
            shopUI.uiView = { "type": "DialogBase", "props": { "width": 750, "mouseThrough": true, "height": 1334 }, "compId": 2, "loadList": [], "loadList3D": [] };
            com.shopUI = shopUI;
            REG("ui.view.com.shopUI", shopUI);
        })(com = view.com || (view.com = {}));
    })(view = ui.view || (ui.view = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var view;
    (function (view) {
        var main;
        (function (main) {
            class bgUI extends ViewBase {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(bgUI.uiView);
                }
            }
            bgUI.uiView = { "type": "ViewBase", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "var": "imgBg", "top": 0, "skin": "res/main/bg/bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 5 }], "loadList": ["res/main/bg/bg.png"], "loadList3D": [] };
            main.bgUI = bgUI;
            REG("ui.view.main.bgUI", bgUI);
            class d3UI extends ViewBase {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(d3UI.uiView);
                }
            }
            d3UI.uiView = { "type": "ViewBase", "props": { "width": 750, "height": 1334 }, "compId": 2, "loadList": [], "loadList3D": [] };
            main.d3UI = d3UI;
            REG("ui.view.main.d3UI", d3UI);
            class effectUI extends ViewBase {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(effectUI.uiView);
                }
            }
            effectUI.uiView = { "type": "ViewBase", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 64, "x": 72, "width": 213, "skin": "res/main/effect/image_status.png", "height": 46 }, "compId": 3 }, { "type": "Image", "props": { "y": 64, "x": 459, "width": 213, "skin": "res/main/effect/image_status.png", "height": 46 }, "compId": 4 }, { "type": "Image", "props": { "y": 48, "x": 403, "skin": "res/main/effect/img_diamond.png" }, "compId": 5 }, { "type": "Image", "props": { "y": 44, "x": 30, "skin": "res/main/effect/img_glod.png" }, "compId": 6 }, { "type": "Button", "props": { "y": 282, "x": 375, "width": 207, "var": "btnLucky", "stateNum": 1, "skin": "res/main/effect/btn_common_1.png", "height": 104, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7, "child": [{ "type": "Label", "props": { "valign": "middle", "top": 0, "text": "转盘", "right": 0, "left": 0, "fontSize": 40, "bottom": 0, "bold": true, "align": "center" }, "compId": 11 }] }, { "type": "Button", "props": { "y": 439, "x": 375, "width": 207, "var": "btnRank", "stateNum": 1, "skin": "res/main/effect/btn_common_2.png", "height": 104, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8, "child": [{ "type": "Label", "props": { "valign": "middle", "top": 0, "text": "排行", "right": 0, "left": 0, "fontSize": 40, "bottom": 0, "bold": true, "align": "center" }, "compId": 12 }] }, { "type": "Button", "props": { "y": 606, "x": 375, "width": 207, "var": "btnInvite", "stateNum": 1, "skin": "res/main/effect/btn_common_3.png", "height": 104, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9, "child": [{ "type": "Label", "props": { "valign": "middle", "top": 0, "text": "邀请", "right": 0, "left": 0, "fontSize": 40, "bottom": 0, "bold": true, "align": "center" }, "compId": 13 }] }, { "type": "Button", "props": { "y": 776, "x": 375, "width": 207, "var": "btnSetting", "stateNum": 1, "skin": "res/main/effect/btn_common_4.png", "height": 104, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 10, "child": [{ "type": "Label", "props": { "valign": "middle", "top": 0, "text": "设置", "right": 0, "left": 0, "fontSize": 40, "bottom": 0, "bold": true, "align": "center" }, "compId": 14 }] }], "loadList": ["res/main/effect/image_status.png", "res/main/effect/img_diamond.png", "res/main/effect/img_glod.png", "res/main/effect/btn_common_1.png", "res/main/effect/btn_common_2.png", "res/main/effect/btn_common_3.png", "res/main/effect/btn_common_4.png"], "loadList3D": [] };
            main.effectUI = effectUI;
            REG("ui.view.main.effectUI", effectUI);
            class gameUI extends ViewBase {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(gameUI.uiView);
                }
            }
            gameUI.uiView = { "type": "ViewBase", "props": { "width": 750, "height": 1334 }, "compId": 2, "animations": [{ "nodes": [{ "target": 413, "keyframes": { "visible": [{ "value": false, "tweenMethod": "linearNone", "tween": false, "target": 413, "key": "visible", "index": 0 }, { "value": true, "tweenMethod": "linearNone", "tween": false, "target": 413, "key": "visible", "index": 2 }, { "value": false, "tweenMethod": "linearNone", "tween": false, "target": 413, "key": "visible", "index": 4 }, { "value": true, "tweenMethod": "linearNone", "tween": false, "target": 413, "key": "visible", "index": 6 }, { "value": false, "tweenMethod": "linearNone", "tween": false, "target": 413, "key": "visible", "index": 8 }, { "value": true, "tweenMethod": "linearNone", "tween": false, "target": 413, "key": "visible", "index": 10 }, { "value": false, "tweenMethod": "linearNone", "tween": false, "target": 413, "key": "visible", "index": 12 }] } }, { "target": 324, "keyframes": { "visible": [{ "value": true, "tweenMethod": "linearNone", "tween": false, "target": 324, "key": "visible", "index": 0 }, { "value": false, "tweenMethod": "linearNone", "tween": false, "target": 324, "key": "visible", "index": 2 }, { "value": true, "tweenMethod": "linearNone", "tween": false, "target": 324, "key": "visible", "index": 4 }, { "value": false, "tweenMethod": "linearNone", "tween": false, "target": 324, "key": "visible", "index": 6 }, { "value": true, "tweenMethod": "linearNone", "tween": false, "target": 324, "key": "visible", "index": 8 }, { "value": false, "tweenMethod": "linearNone", "tween": false, "target": 324, "key": "visible", "index": 10 }, { "value": true, "tweenMethod": "linearNone", "tween": false, "target": 324, "key": "visible", "index": 12 }] } }], "name": "ani_grap", "id": 29, "frameRate": 24, "action": 0 }, { "nodes": [{ "target": 468, "keyframes": { "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 468, "key": "rotation", "index": 0 }, { "value": 360, "tweenMethod": "linearNone", "tween": true, "target": 468, "key": "rotation", "index": 200 }], "alpha": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 468, "key": "alpha", "index": 0 }, { "value": 0.5, "tweenMethod": "linearNone", "tween": true, "target": 468, "key": "alpha", "index": 50 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 468, "key": "alpha", "index": 100 }, { "value": 0.5, "tweenMethod": "linearNone", "tween": true, "target": 468, "key": "alpha", "index": 150 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 468, "key": "alpha", "index": 200 }] } }, { "target": 469, "keyframes": { "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 469, "key": "rotation", "index": 0 }, { "value": -360, "tweenMethod": "linearNone", "tween": true, "target": 469, "key": "rotation", "index": 200 }], "alpha": [{ "value": 0.5, "tweenMethod": "linearNone", "tween": true, "target": 469, "key": "alpha", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 469, "key": "alpha", "index": 50 }, { "value": 0.5, "tweenMethod": "linearNone", "tween": true, "target": 469, "key": "alpha", "index": 100 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 469, "key": "alpha", "index": 150 }] } }], "name": "ani_luckBL", "id": 30, "frameRate": 24, "action": 0 }], "loadList": [], "loadList3D": [] };
            main.gameUI = gameUI;
            REG("ui.view.main.gameUI", gameUI);
            class loadingUI extends ViewBase {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(loadingUI.uiView);
                }
            }
            loadingUI.uiView = { "type": "ViewBase", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "var": "img_bg", "top": 0, "skin": "res/loading/img_loading_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 493, "var": "box_btm", "pivotY": 149, "pivotX": 249, "height": 149, "centerX": 0, "bottom": 0 }, "compId": 5, "child": [{ "type": "ProgressBar", "props": { "y": 20, "x": 247, "var": "pro_Loading", "skin": "res/loading/progress_loading.png", "pivotY": 12, "pivotX": 175 }, "compId": 6 }, { "type": "Label", "props": { "y": 20, "width": 238, "var": "lblLoading", "valign": "middle", "text": "100%", "strokeColor": "#ffffff", "stroke": 4, "pivotY": 16, "pivotX": 119, "height": 32, "fontSize": 26, "font": "Arial", "color": "#592222", "centerX": 0, "bold": true, "align": "center" }, "compId": 7 }, { "type": "Image", "props": { "y": 85, "x": 247, "width": 493, "skin": "res/loading/img_8r.png", "pivotY": 20, "pivotX": 247, "height": 39 }, "compId": 8 }, { "type": "Label", "props": { "y": 128, "x": 247, "width": 283, "var": "lbl_p", "valign": "middle", "text": "Powered by LayaAir Engine", "pivotY": 21, "pivotX": 142, "height": 42, "fontSize": 18, "color": "#ffffff", "bold": true, "align": "center" }, "compId": 9 }] }], "loadList": ["res/loading/img_loading_bg.png", "res/loading/progress_loading.png", "res/loading/img_8r.png"], "loadList3D": [] };
            main.loadingUI = loadingUI;
            REG("ui.view.main.loadingUI", loadingUI);
        })(main = view.main || (view.main = {}));
    })(view = ui.view || (ui.view = {}));
})(ui = exports.ui || (exports.ui = {}));
},{"../framework/manager/ui/dialog-base":26,"../framework/manager/ui/view-base":28}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkc6L0xheWFBaXJJREUvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL01haW4udHMiLCJzcmMvY2xpZW50L3NjZW5lL21haW4tc2NlbmUudHMiLCJzcmMvY2xpZW50L3ZpZXcvY29tcG9uZW50LXZpZXcvbG90dGVyeS12aWV3LnRzIiwic3JjL2NsaWVudC92aWV3L2xheWVyLXZpZXcvYmctdmlldy50cyIsInNyYy9jbGllbnQvdmlldy9sYXllci12aWV3L2QzLXZpZXcudHMiLCJzcmMvY2xpZW50L3ZpZXcvbGF5ZXItdmlldy9lZmZlY3Qtdmlldy50cyIsInNyYy9jbGllbnQvdmlldy9sYXllci12aWV3L2dhbWUtdmlldy50cyIsInNyYy9jbGllbnQvdmlldy9sYXllci12aWV3L2xvYWRpbmctdmlldy50cyIsInNyYy9mcmFtZXdvcmsvY29yZS9sb2cudHMiLCJzcmMvZnJhbWV3b3JrL2NvcmUvb2JqZWN0LXBvb2wudHMiLCJzcmMvZnJhbWV3b3JrL2NvcmUvc2luZ2xldG9uLnRzIiwic3JjL2ZyYW1ld29yay9jb3JlL3RpbWUtZGVsYXkudHMiLCJzcmMvZnJhbWV3b3JrL21hbmFnZXIvZGF0YS9kYXRhLW1hbmFnZXIudHMiLCJzcmMvZnJhbWV3b3JrL21hbmFnZXIvZXZlbnQvZXZlbnQtZGF0YS50cyIsInNyYy9mcmFtZXdvcmsvbWFuYWdlci9ldmVudC9ldmVudC1tYW5hZ2VyLnRzIiwic3JjL2ZyYW1ld29yay9tYW5hZ2VyL2V2ZW50L2V2ZW50LW5vZGUudHMiLCJzcmMvZnJhbWV3b3JrL21hbmFnZXIvanNvbi9qc29uLW1hbmFnZXIudHMiLCJzcmMvZnJhbWV3b3JrL21hbmFnZXIvanNvbi9qc29uLXRlbXBsYXRlLnRzIiwic3JjL2ZyYW1ld29yay9tYW5hZ2VyL3Jlcy9yZXMtZ3JvdXAudHMiLCJzcmMvZnJhbWV3b3JrL21hbmFnZXIvcmVzL3Jlcy1pdGVtLnRzIiwic3JjL2ZyYW1ld29yay9tYW5hZ2VyL3Jlcy9yZXMtbWFuYWdlci50cyIsInNyYy9mcmFtZXdvcmsvbWFuYWdlci9zb3VuZC9zb3VuZC1tYW5hZ2VyLnRzIiwic3JjL2ZyYW1ld29yay9tYW5hZ2VyL3RpbWVyL3RpbWVyLWVudGl0eS50cyIsInNyYy9mcmFtZXdvcmsvbWFuYWdlci90aW1lci90aW1lci1pbnRlcnZhbC50cyIsInNyYy9mcmFtZXdvcmsvbWFuYWdlci90aW1lci90aW1lci1tYW5hZ2VyLnRzIiwic3JjL2ZyYW1ld29yay9tYW5hZ2VyL3VpL2RpYWxvZy1iYXNlLnRzIiwic3JjL2ZyYW1ld29yay9tYW5hZ2VyL3VpL3NjZW5lLWJhc2UudHMiLCJzcmMvZnJhbWV3b3JrL21hbmFnZXIvdWkvdmlldy1iYXNlLnRzIiwic3JjL2ZyYW1ld29yay9ydW50aW1lL2VuZ2luZS50cyIsInNyYy9mcmFtZXdvcmsvc2V0dGluZy9jb25maWcudHMiLCJzcmMvZnJhbWV3b3JrL3NldHRpbmcvZW51bS50cyIsInNyYy9mcmFtZXdvcmsvc3RydWN0dXJlL2RpY3Rpb25hcnkudHMiLCJzcmMvZnJhbWV3b3JrL3V0aWwvYXJyYXkudHMiLCJzcmMvZnJhbWV3b3JrL3V0aWwvZGljdC50cyIsInNyYy9mcmFtZXdvcmsvdXRpbC9kaXNwbGF5LnRzIiwic3JjL2ZyYW1ld29yay91dGlsL2xvYWQzZC50cyIsInNyYy9mcmFtZXdvcmsvdXRpbC9tYXRoLnRzIiwic3JjL2ZyYW1ld29yay91dGlsL21hdGgzZC50cyIsInNyYy9mcmFtZXdvcmsvdXRpbC9udW1iZXIudHMiLCJzcmMvZnJhbWV3b3JrL3V0aWwvc3RyaW5nLnRzIiwic3JjL2ZyYW1ld29yay91dGlsL3RpbWUudHMiLCJzcmMvdWkvbGF5YU1heFVJLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1RBLHVEQUFvRDtBQUdwRDs7Ozs7O0dBTUc7QUFDSDtJQUVDLGdEQUFnRDtJ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LENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsYUFBYTtJQUNOLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBWTtRQUMxQixJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ0QsYUFBYTtJQUNOLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBWTtRQUMxQixJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ0QsYUFBYTtJQUNOLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBWTtRQUMxQixJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ0QsY0FBYztJQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBWTtRQUMzQixJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsY0FBYztJQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBWTtRQUMzQixJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsY0FBYztJQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBWTtRQUMzQixJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QixDQUFDOztBQXRGYyxvQkFBUyxHQUFZLElBQUksQ0FBQztBQUMxQixvQkFBUyxHQUFZLElBQUksQ0FBQztBQUMxQixvQkFBUyxHQUFZLElBQUksQ0FBQztBQUo3QyxnQ0E2RkM7QUFFRCxzREFBc0Q7QUFDdEQsaUJBQXdCLENBQVUsRUFBRSxDQUFVO0lBQzFDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFGRCwwQkFFQztBQUVELGlCQUF3QixDQUFVLEVBQUUsQ0FBVTtJQUMxQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRkQsMEJBRUM7QUFFRCxzQkFBNkIsQ0FBVSxFQUFFLENBQVU7SUFDL0MsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUZELG9DQUVDO0FBRUQsaUJBQXdCLENBQVUsRUFBRSxDQUFTO0lBQ3pDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBRkQsMEJBRUM7QUFFRCxpQkFBd0IsQ0FBVSxFQUFFLENBQVM7SUFDekMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFGRCwwQkFFQztBQUVELGlCQUF3QixHQUFZLEVBQUUsR0FBWTtJQUM5QyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUZELDBCQUVDO0FBRUQscUJBQTRCLE1BQWUsRUFBRSxRQUFpQjtJQUMxRCxJQUFJLEdBQUcsR0FBVyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLElBQUksR0FBRyxHQUFHLEtBQUssRUFBRTtRQUNiLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQztLQUN2QjtJQUNELE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4RSxDQUFDO0FBTkQsa0NBTUM7QUFFRCxpQkFBd0IsR0FBWSxFQUFFLEdBQVk7SUFDOUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBRkQsMEJBRUM7QUFFRCxpQkFBd0IsR0FBWSxFQUFFLEdBQVk7SUFDOUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBRkQsMEJBRUM7QUFFRCx1QkFBOEIsR0FBWTtJQUN0QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQUZELHNDQUVDO0FBRUQsMEJBQWlDLEdBQVk7SUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUZELDRDQUVDO0FBRUQsd0JBQStCLEdBQVk7SUFDdkMsSUFBSSxTQUFTLEdBQVcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBVSxDQUFDO0lBQ2YsSUFBSSxTQUFTLEdBQUcsS0FBSztRQUNqQixDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQzs7UUFFNUIsQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMxQixPQUFPLENBQUMsQ0FBQztBQUNiLENBQUM7QUFSRCx3Q0FRQztBQUVELG9CQUEyQixHQUFZO0lBQ25DLElBQUksU0FBUyxHQUFXLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzQyxJQUFJLFNBQVMsR0FBRyxLQUFLLEVBQUU7UUFDbkIsSUFBSSxDQUFDLEdBQVksT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN6QyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzFCOztRQUNHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNCLENBQUM7QUFQRCxnQ0FPQztBQUVELGlCQUF3QixDQUFVLEVBQUUsQ0FBUyxFQUFFLENBQVM7SUFDcEQsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDUixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNSLENBQUM7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNiLENBQUM7QUFMRCwwQkFLQztBQUVELGtFQUFrRTtBQUNsRSwrR0FBK0c7QUFDL0csSUFBSTtBQUVKLDRCQUFtQyxNQUFlLEVBQUUsU0FBUztJQUN6RCxJQUFJLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxFQUFFO1FBQ3BELE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7S0FDdkQ7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBTEQsZ0RBS0M7QUFFRCw2RUFBNkU7QUFDN0UsbUNBQW1DO0FBQ25DLDBGQUEwRjtBQUMxRixJQUFJO0FBRUoseUJBQWdDLE9BQWdCLEVBQUUsTUFBZSxFQUFFLGdCQUF3QjtJQUN2RixJQUFJLE1BQU0sR0FBWSxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLElBQUksU0FBUyxHQUFXLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QyxJQUFJLENBQUMsU0FBUyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUU7UUFDcEQsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEY7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBUEQsMENBT0M7QUFFRCxzQkFBNkIsR0FBWTtJQUNyQyxPQUFPLG1CQUFVLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBRkQsb0NBRUM7QUFFRCxzREFBc0Q7QUFDdEQsaUJBQXdCLENBQVUsRUFBRSxDQUFVO0lBQzFDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBRkQsMEJBRUM7QUFFRCxpQkFBd0IsQ0FBVSxFQUFFLENBQVU7SUFDMUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFGRCwwQkFFQztBQUVELHNCQUE2QixDQUFVLEVBQUUsQ0FBVTtJQUMvQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQUZELG9DQUVDO0FBRUQsaUJBQXdCLENBQVUsRUFBRSxDQUFTO0lBQ3pDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNsRCxDQUFDO0FBRkQsMEJBRUM7QUFFRCxpQkFBd0IsQ0FBVSxFQUFFLENBQVM7SUFDekMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFGRCwwQkFFQztBQUVELG1CQUEwQixHQUFZLEVBQUUsR0FBWTtJQUNoRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEksQ0FBQztBQUZELDhCQUVDO0FBRUQscUJBQTRCLE1BQWUsRUFBRSxRQUFpQjtJQUMxRCxJQUFJLEdBQUcsR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNsRCxJQUFJLEdBQUcsR0FBRyxLQUFLLEVBQUU7UUFDYixPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7S0FDeEI7SUFDRCxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzVFLENBQUM7QUFORCxrQ0FNQztBQUVELGlCQUF3QixHQUFZLEVBQUUsR0FBWTtJQUM5QyxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0YsQ0FBQztBQUZELDBCQUVDO0FBRUQsaUJBQXdCLEdBQVksRUFBRSxHQUFZO0lBQzlDLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvRixDQUFDO0FBRkQsMEJBRUM7QUFFRCx1QkFBOEIsR0FBWTtJQUN0QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRSxDQUFDO0FBRkQsc0NBRUM7QUFFRCwwQkFBaUMsR0FBWTtJQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFGRCw0Q0FFQztBQUVELHdCQUErQixHQUFZO0lBQ3ZDLElBQUksU0FBUyxHQUFXLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEQsSUFBSSxDQUFVLENBQUM7SUFDZixJQUFJLFNBQVMsR0FBRyxLQUFLO1FBQ2pCLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDOztRQUU1QixDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3QixPQUFPLENBQUMsQ0FBQztBQUNiLENBQUM7QUFSRCx3Q0FRQztBQUVELG9CQUEyQixHQUFZO0lBQ25DLElBQUksU0FBUyxHQUFXLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEQsSUFBSSxTQUFTLEdBQUcsS0FBSyxFQUFFO1FBQ25CLElBQUksQ0FBQyxHQUFZLE9BQU8sQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDekMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9COztRQUNHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBUEQsZ0NBT0M7QUFFRCxpQkFBd0IsQ0FBVSxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztJQUMvRCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNSLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDUixPQUFPLENBQUMsQ0FBQztBQUNiLENBQUM7QUFMRCwwQkFLQztBQUVELGtFQUFrRTtBQUNsRSxtSEFBbUg7QUFDbkgsSUFBSTtBQUVKLDRCQUFtQyxNQUFlLEVBQUUsU0FBUztJQUN6RCxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsRUFBRTtRQUMvRCxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0tBQ3ZEO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQUxELGdEQUtDO0FBRUQsNkVBQTZFO0FBQzdFLG1DQUFtQztBQUNuQywwSEFBMEg7QUFDMUgsSUFBSTtBQUVKLHlCQUFnQyxPQUFnQixFQUFFLE1BQWUsRUFBRSxnQkFBd0I7SUFDdkYsSUFBSSxNQUFNLEdBQVksT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvQyxJQUFJLFNBQVMsR0FBVyxPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELElBQUksQ0FBQyxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtRQUNwRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwRjtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFQRCwwQ0FPQztBQUVELHNCQUE2QixHQUFZO0lBQ3JDLE9BQU8sbUJBQVUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRSxDQUFDO0FBRkQsb0NBRUM7QUFFRDs7O0dBR0c7QUFDSCw0QkFBbUMsT0FBZTtJQUM5QyxJQUFJLENBQUMsR0FBVyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLElBQUksQ0FBQyxHQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsSUFBSSxHQUFHLEdBQVksSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQixPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFORCxnREFNQzs7OztBQ3RVRCxxQ0FBc0M7QUFFdEM7Ozs7OztHQU1HO0FBQ0g7SUFDSTs7T0FFRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBYSxFQUFFLENBQVM7UUFDMUMsT0FBTyxtQkFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBYTtRQUM3QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBYTtRQUM3QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBVyxFQUFFLElBQVk7UUFDakQsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDbkIsSUFBSSxPQUFPLEdBQVcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7WUFDYixPQUFPLEdBQUcsQ0FBQztTQUNkO1FBQ0QsSUFBSSxHQUFHLEdBQVcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTVDLElBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDMUIsSUFBSSxPQUFPLEdBQUcsSUFBSSxFQUFFO1lBQ2hCLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDbEI7UUFDRCxJQUFJLE9BQU8sR0FBVyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztRQUNwRSxPQUFPLG1CQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMscUJBQXFCLENBQUMsR0FBVyxFQUFFLElBQVk7UUFDekQsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDbkIsSUFBSSxPQUFPLEdBQVcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUUsRUFBQyxLQUFLO1lBQ25CLEdBQUcsSUFBSSxHQUFHLENBQUM7WUFDWCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQztnQkFBRSxHQUFHLElBQUksR0FBRyxDQUFDO1lBQzFDLE9BQU8sR0FBRyxDQUFDO1NBQ2Q7UUFDRCxJQUFJLEdBQUcsR0FBVyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFNUMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxPQUFPLEdBQUcsSUFBSSxFQUFFLEVBQUMsSUFBSTtZQUNyQixPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ2YsSUFBSSxPQUFPLEdBQVcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7WUFDcEUsT0FBTyxHQUFHLEdBQUcsT0FBTyxDQUFDO1NBQ3hCO2FBQU0sSUFBSSxPQUFPLEdBQUcsSUFBSSxFQUFFLEVBQUMsTUFBTTtZQUM5QixJQUFJLElBQUksR0FBVyxJQUFJLEdBQUcsT0FBTyxDQUFDO1lBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDO2dCQUFFLEdBQUcsSUFBSSxHQUFHLENBQUM7WUFDMUMsT0FBTyxHQUFHLENBQUM7U0FDZDs7WUFDRyxPQUFPLEdBQUcsQ0FBQztJQUNuQixDQUFDO0lBR0Q7O09BRUc7SUFDSSxNQUFNLENBQUMscUJBQXFCLENBQUMsR0FBVztRQUMzQyxJQUFJLEdBQUcsR0FBRyxPQUFPLEVBQUU7WUFDZixPQUFPLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUMvQjthQUFNLElBQUksR0FBRyxHQUFHLFVBQVUsRUFBRTtZQUN6QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQTtZQUM5QixPQUFPLENBQUMsQ0FBQyxjQUFjLEVBQUUsR0FBRyxHQUFHLENBQUM7U0FDbkM7YUFBTTtZQUNILElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFBO1lBQ2pDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsRUFBRSxHQUFHLEdBQUcsQ0FBQztTQUNuQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsUUFBZ0IsQ0FBQztRQUVsRCxJQUFJLEdBQUcsR0FBRyxJQUFJLEVBQUU7WUFDWixPQUFPLEdBQUcsQ0FBQztTQUNkO2FBQU0sSUFBSSxHQUFHLEdBQUcsT0FBTyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUM7U0FDbEI7YUFBTSxJQUFJLEdBQUcsR0FBRyxVQUFVLEVBQUU7WUFDekIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQztTQUNsQjthQUFNO1lBQ0gsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BELE9BQU8sQ0FBQyxDQUFDLGNBQWMsRUFBRSxHQUFHLEdBQUcsQ0FBQztTQUNuQztJQUVMLENBQUM7SUFHRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsZUFBZSxDQUFDLEdBQVcsRUFBQyxRQUFlLENBQUM7UUFDdEQsSUFBSSxJQUFJLEdBQUc7WUFDUCxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJO1lBQ2hELElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO1lBQzlDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO1lBQzlDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO1lBQzlDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO1lBQzlDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO1lBQzlDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO1NBQ2pELENBQUM7UUFFRixJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDWCxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNoQixFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFZixPQUFPLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMzRDtRQUdELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFZLEVBQUUsSUFBWTtRQUNqRCxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQVksRUFBRSxJQUFZO1FBQ2pELElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QixJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ1QsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUVELE9BQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBWSxFQUFFLElBQVk7UUFDakQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFZLEVBQUUsSUFBWTtRQUNqRCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBWSxFQUFFLElBQVk7UUFDeEQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDO0NBRUo7QUE5S0QsZ0NBOEtDOzs7O0FDdkxEOzs7Ozs7R0FNRztBQUNIO0lBRVcsTUFBTSxLQUFLLEtBQUs7UUFDbkIsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQVM7UUFDM0IsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDdEQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBVztRQUMzQixJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFTSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQVc7UUFDOUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0QyxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBVztRQUNqQyxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3BELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUIsUUFBUSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxRQUFRLElBQUksQ0FBQyxJQUFJLFFBQVEsSUFBSSxHQUFHO2dCQUFFLFVBQVUsSUFBSSxDQUFDLENBQUM7O2dCQUNqRCxVQUFVLElBQUksQ0FBQyxDQUFDO1NBQ3hCO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBVyxFQUFFLEdBQVcsRUFBRSxNQUFjLENBQUM7UUFDM0QsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDO1FBQ3RCLElBQUksSUFBSSxHQUFXLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDOUIsSUFBSSxZQUFZLEdBQVcsRUFBRSxDQUFDO1FBQzlCLElBQUksWUFBWSxHQUFXLEVBQUUsQ0FBQztRQUM5QixJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ1IsWUFBWSxHQUFHLEdBQUcsQ0FBQzs7WUFFbkIsWUFBWSxHQUFHLEdBQUcsQ0FBQztRQUV2QixJQUFJLElBQUksR0FBRyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsR0FBVyxDQUFDLENBQUM7WUFDbEIsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksRUFBRTtnQkFDbkIsSUFBSSxHQUFHLFlBQVksR0FBRyxJQUFJLEdBQUcsWUFBWSxDQUFDO2dCQUMxQyxFQUFFLENBQUMsQ0FBQzthQUNQO1lBRUQsT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ3JCO1FBRUQsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBYTtRQUM1QixJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7WUFDZixPQUFPLEVBQUUsQ0FBQztTQUNiO1FBQ0QsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFhO1FBQ2hDLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtZQUNmLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFDRCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFhO1FBQ2pDLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtZQUNmLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFDRCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFlO1FBQ3RDLElBQUksR0FBRyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLElBQUksR0FBRyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRTNDLElBQUksT0FBTyxHQUFXLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzNFLElBQUksT0FBTyxHQUFXLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRTNFLE9BQU8sT0FBTyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQWU7UUFDcEMsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDOUMsSUFBSSxRQUFRLEdBQVcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDL0UsT0FBTyxRQUFRLEdBQUcsR0FBRyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFXLEVBQUUsR0FBRyxJQUFJO1FBQ3JDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xDLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssR0FB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LEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEtBQUssRUFBQyxZQUFZLEVBQUMsTUFBTSxFQUFDLGlDQUFpQyxFQUFDLFNBQVMsRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLHNCQUFzQixFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsWUFBWSxFQUFDLFVBQVUsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLGtDQUFrQyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsT0FBTyxFQUFDLEVBQUMsUUFBUSxFQUFDLFFBQVEsRUFBQyxLQUFLLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxJQUFJLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsQ0FBQyxFQUFDLFVBQVUsRUFBQyxFQUFFLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsQ0FBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLFVBQVUsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLCtCQUErQixFQUFDLFNBQVMsRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxZQUFZLEVBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxXQUFXLEVBQUMsRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsYUFBYSxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEtBQUssRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLFNBQVMsRUFBQyxDQUFDLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUMsYUFBYSxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLFNBQVMsRUFBQyxPQUFPLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsYUFBYSxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLFNBQVMsRUFBQyxPQUFPLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxVQUFVLEVBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsYUFBYSxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsYUFBYSxFQUFDLFlBQVksRUFBQyxP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QUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBQyw4QkFBOEIsRUFBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLFVBQVUsRUFBQyxVQUFVLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxrQ0FBa0MsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxFQUFDLFFBQVEsRUFBQyxRQUFRLEVBQUMsS0FBSyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLENBQUMsRUFBQyxVQUFVLEVBQUMsRUFBRSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLFNBQVMsRUFBQyxVQUFVLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxrQ0FBa0MsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxFQUFDLFFBQVEsRUFBQyxRQUFRLEVBQUMsS0FBSyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLENBQUMsRUFBQyxVQUFVLEVBQUMsRUFBRSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLFdBQVcsRUFBQyxVQUFVLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxrQ0FBa0MsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxFQUFDLFFBQVEsRUFBQyxRQUFRLEVBQUMsS0FBSyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLENBQUMsRUFBQyxVQUFVLEVBQUMsRUFBRSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLFlBQVksRUFBQyxVQUFVLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxrQ0FBa0MsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxFQUFDLFFBQVEsRUFBQyxRQUFRLEVBQUMsS0FBSyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLENBQUMsRUFBQyxVQUFVLEVBQUMsRUFBRSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLFVBQVUsRUFBQyxDQUFDLGtDQUFrQyxFQUFDLGlDQUFpQyxFQUFDLDhCQUE4QixFQUFDLGtDQUFrQyxFQUFDLGtDQUFrQyxFQUFDLGtDQUFrQyxFQUFDLGtDQUFrQyxDQUFDLEVBQUMsWUFBWSxFQUFDLEVBQUUsRUFBQyxDQUFDO1lBTHBtRSxhQUFRLFdBV3BCLENBQUE7WUFDRCxHQUFHLENBQUMsdUJBQXVCLEVBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEMsWUFBb0IsU0FBUSxRQUFRO2dCQUloQyxnQkFBZSxLQUFLLEVBQUUsQ0FBQSxDQUFBLENBQUM7Z0JBQ3ZCLGNBQWM7b0JBQ1YsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkMsQ0FBQzs7WUFMYyxhQUFNLEdBQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBQyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsUUFBUSxFQUFDLElBQUksRUFBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsWUFBWSxFQUFDLENBQUMsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsV0FBVyxFQUFDLEVBQUMsU0FBUyxFQUFDLENBQUMsRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUMsYUFBYSxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLFNBQVMsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsYUFBYSxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLFNBQVMsRUFBQyxPQUFPLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxXQUFXLEVBQUMsRUFBQyxTQUFTLEVBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsYUFBYSxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLFNBQVMsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUMsYUFBYSxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLFNBQVMsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsYUFBYSxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLFNBQVMsRUFBQyxPQUFPLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLElBQUksRUFBQyxFQUFFLEVBQUMsV0FBVyxFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsV0FBVyxFQUFDLEVBQUMsVUFBVSxFQUFDLENBQUMsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsYUFBYSxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsYUFBYSxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLFdBQVcsRUFBQyxFQUFDLFVBQVUsRUFBQyxDQUFDLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLEdBQUcsRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsYUFBYSxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxFQUFDLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxhQUFhLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsSUFBSSxFQUFDLEVBQUUsRUFBQyxXQUFXLEVBQUMsRUFBRSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLFVBQVUsRUFBQyxFQUFFLEVBQUMsWUFBWSxFQUFDLEVBQUUsRUFBQyxDQUFDO1lBSHo2RixXQUFNLFNBU2xCLENBQUE7WUFDRCxHQUFHLENBQUMscUJBQXFCLEVBQUMsTUFBTSxDQUFDLENBQUM7WUFDbEMsZUFBdUIsU0FBUSxRQUFRO2dCQU9uQyxnQkFBZSxLQUFLLEVBQUUsQ0FBQSxDQUFBLENBQUM7Z0JBQ3ZCLGNBQWM7b0JBQ1YsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEMsQ0FBQzs7WUFMYyxnQkFBTSxHQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQUMsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFFBQVEsRUFBQyxJQUFJLEVBQUMsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxLQUFLLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxnQ0FBZ0MsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLFNBQVMsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsQ0FBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLGFBQWEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLGFBQWEsRUFBQyxNQUFNLEVBQUMsa0NBQWtDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLFlBQVksRUFBQyxRQUFRLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsYUFBYSxFQUFDLFNBQVMsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLFVBQVUsRUFBQyxFQUFFLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsU0FBUyxFQUFDLFNBQVMsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsd0JBQXdCLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsMkJBQTJCLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsVUFBVSxFQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sRUFBQyxJQUFJLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxVQUFVLEVBQUMsQ0FBQyxnQ0FBZ0MsRUFBQyxrQ0FBa0MsRUFBQyx3QkFBd0IsQ0FBQyxFQUFDLFlBQVksRUFBQyxFQUFFLEVBQUMsQ0FBQztZQU52d0MsY0FBUyxZQVlyQixDQUFBO1lBQ0QsR0FBRyxDQUFDLHdCQUF3QixFQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLENBQUMsRUExRHFCLElBQUksR0FBSixTQUFJLEtBQUosU0FBSSxRQTBEekI7SUFBRCxDQUFDLEVBMURnQixJQUFJLEdBQUosT0FBSSxLQUFKLE9BQUksUUEwRHBCO0FBQUQsQ0FBQyxFQTFEYSxFQUFFLEdBQUYsVUFBRSxLQUFGLFVBQUUsUUEwRGYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tICcuL2ZyYW1ld29yay9ydW50aW1lL2VuZ2luZSc7XHJcblxyXG5cclxuLyoqXHJcbiAqIEBhdXRob3IgU3VuXHJcbiAqIEB0aW1lIDIwMTktMDgtMTEgMTk6MDVcclxuICogQHByb2plY3QgU0ZyYW1ld29ya19MYXlhQWlyXHJcbiAqIEBkZXNjcmlwdGlvbiDmuLjmiI/lkK/liqjlhaXlj6NcclxuICpcclxuICovXHJcbmNsYXNzIE1haW4ge1xyXG5cclxuXHQvLyBcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cdC8vIFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XHJcblx0Ly8gXHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXHJcblx0Ly8gXHRMYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdhbWVDb25maWcuZXhwb3J0U2NlbmVUb0pzb247XHJcblxyXG5cdC8vIFx0Ly/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXHJcblx0Ly8gXHRpZiAoR2FtZUNvbmZpZy5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG5cdC8vIFx0aWYgKEdhbWVDb25maWcucGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcclxuXHQvLyBcdGlmIChHYW1lQ29uZmlnLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XHJcblx0Ly8gXHRMYXlhLmFsZXJ0R2xvYmFsRXJyb3IgPSB0cnVlO1xyXG5cclxuXHQvLyBcdC8v5r+A5rS76LWE5rqQ54mI5pys5o6n5Yi277yMdmVyc2lvbi5qc29u55SxSURF5Y+R5biD5Yqf6IO96Ieq5Yqo55Sf5oiQ77yM5aaC5p6c5rKh5pyJ5Lmf5LiN5b2x5ZON5ZCO57ut5rWB56iLXHJcblx0Ly8gXHQvLyBMYXlhLlJlc291cmNlVmVyc2lvbi5lbmFibGUoXCJ2ZXJzaW9uLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uVmVyc2lvbkxvYWRlZCksIExheWEuUmVzb3VyY2VWZXJzaW9uLkZJTEVOQU1FX1ZFUlNJT04pO1xyXG5cdC8vIFx0bGV0IHZpZXcgPSBuZXcgTG9hZGluZ1ZpZXcoKTtcclxuXHQvLyBcdExheWEuc3RhZ2UuYWRkQ2hpbGQodmlldyk7XHJcblx0Ly8gfVxyXG5cclxuXHQvLyBvblZlcnNpb25Mb2FkZWQoKTogdm9pZCB7XHJcblx0Ly8gXHQvL+a/gOa0u+Wkp+Wwj+WbvuaYoOWwhO+8jOWKoOi9veWwj+WbvueahOaXtuWAme+8jOWmguaenOWPkeeOsOWwj+WbvuWcqOWkp+WbvuWQiOmbhumHjOmdou+8jOWImeS8mOWFiOWKoOi9veWkp+WbvuWQiOmbhu+8jOiAjOS4jeaYr+Wwj+WbvlxyXG5cdC8vIFx0TGF5YS5BdGxhc0luZm9NYW5hZ2VyLmVuYWJsZShcImZpbGVjb25maWcuanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Db25maWdMb2FkZWQpKTtcclxuXHQvLyB9XHJcblxyXG5cdC8vIG9uQ29uZmlnTG9hZGVkKCk6IHZvaWQge1xyXG5cdC8vIFx0Ly/liqDovb1JREXmjIflrprnmoTlnLrmma9cclxuXHQvLyBcdEdhbWVDb25maWcuc3RhcnRTY2VuZSAmJiBMYXlhLlNjZW5lLm9wZW4oR2FtZUNvbmZpZy5zdGFydFNjZW5lKTtcclxuXHQvLyB9XHJcblxyXG5cdGNvbnN0cnVjdG9yKClcclxuXHR7XHJcblx0XHRFbmdpbmUuJC5ydW4oKTtcclxuXHR9XHJcbn1cclxuLy/mv4DmtLvlkK/liqjnsbtcclxubmV3IE1haW4oKTtcclxuIiwiaW1wb3J0IHtDdXN0b21TY2VuZX0gZnJvbSBcIi4uLy4uL2ZyYW1ld29yay9tYW5hZ2VyL3VpL3NjZW5lLWJhc2VcIjtcclxuaW1wb3J0IEx5U2NlbmUgPSBDdXN0b21TY2VuZS5MeVNjZW5lO1xyXG5pbXBvcnQgeyBCZ1ZpZXcgfSBmcm9tICcuLi92aWV3L2xheWVyLXZpZXcvYmctdmlldyc7XHJcbmltcG9ydCB7IExvZyB9IGZyb20gJy4uLy4uL2ZyYW1ld29yay9jb3JlL2xvZyc7XHJcblxyXG4gLyoqXHJcbiAqIEBhdXRob3IgU3VuXHJcbiAqIEB0aW1lIDIwMTktMDgtMTEgMTE6MjBcclxuICogQHByb2plY3QgU0ZyYW1ld29ya19MYXlhQWlyXHJcbiAqIEBkZXNjcmlwdGlvbiDkuLvlnLrmma9cclxuICpcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNYWluU2NlbmUgZXh0ZW5kcyBMeVNjZW5lIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMubmVlZExvYWRSZXNcclxuICAgICAgICAgICAgLmFkZChcInJlcy9iZy8xMjMucG5nXCIsIExheWEuTG9hZGVyLklNQUdFKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IHVpIH0gZnJvbSAnLi4vLi4vLi4vdWkvbGF5YU1heFVJJztcclxuaW1wb3J0IGxvdHRlcnlVSSA9ICB1aS52aWV3LmNvbS5sb3R0ZXJ5VUk7XHJcbmltcG9ydCB7IFJlc01hbmFnZXIgfSBmcm9tICcuLi8uLi8uLi9mcmFtZXdvcmsvbWFuYWdlci9yZXMvcmVzLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBKc29uTWFuYWdlciB9IGZyb20gJy4uLy4uLy4uL2ZyYW1ld29yay9tYW5hZ2VyL2pzb24vanNvbi1tYW5hZ2VyJztcclxuaW1wb3J0IHtlbnVtSnNvbkRlZmluZSB9IGZyb20gICcuLi8uLi8uLi9mcmFtZXdvcmsvc2V0dGluZy9lbnVtJztcclxuaW1wb3J0IHsgVXRpbE1hdGggfSBmcm9tICcuLi8uLi8uLi9mcmFtZXdvcmsvdXRpbC9tYXRoJztcclxuaW1wb3J0IHsgTG9nIH0gZnJvbSAnLi4vLi4vLi4vZnJhbWV3b3JrL2NvcmUvbG9nJztcclxuaW1wb3J0IHsgVXRpbFN0cmluZyB9IGZyb20gJy4uLy4uLy4uL2ZyYW1ld29yay91dGlsL3N0cmluZyc7XHJcblxyXG4vKipcclxuICogQGF1dGhvciBTdW5cclxuICogQHRpbWUgMjAxOS0wOC0xMiAxNzozMVxyXG4gKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcclxuICogQGRlc2NyaXB0aW9uIOi9rOebmOaooeadv1xyXG4gKlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExvdHRlcnlWaWV3IGV4dGVuZHMgbG90dGVyeVVJIHtcclxuXHJcbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirkuLvpobXpnaLlsZ7mgKforr7nva4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAvKiogRGVzOuWAjeeOhyAqL1xyXG4gIHByaXZhdGUgcmV3YXJkTXVsOm51bWJlciA9IDI7XHJcbiAgLyoqIERlczrovaznm5jmlbDmja4gKi9cclxuICBwcml2YXRlIGxvdHRlcnlEYXRhOmFueSA9IG51bGw7XHJcblxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirigJTigJQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8v5YiG55WM57q/Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuS4u+mhtemdoueUn+WRveWRqOacnyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5cclxuICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogTG90dGVyeVZpZXdcclxuXHJcbiAgcHVibGljIHN0YXRpYyBnZXQgJCgpOiBMb3R0ZXJ5VmlldyB7XHJcbiAgICAgIGlmICh0aGlzLmluc3RhbmNlPT1udWxsKSB0aGlzLmluc3RhbmNlID0gbmV3IExvdHRlcnlWaWV3KCk7XHJcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIG9uQXdha2UoKTogdm9pZCB7XHJcbiAgICAgIHN1cGVyLm9uQXdha2UoKTtcclxuICAgICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBjbG9zZSgpOiB2b2lkIHtcclxuICAgICAgc3VwZXIuY2xvc2UoKTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/liIbnlYznur8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq5Li76aG16Z2i5Yid5aeL5pWw5o2uKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcblxyXG4gIHByaXZhdGUgaW5pdCgpXHJcbiAge1xyXG4gICAgICB0aGlzLmxvdHRlcnlEYXRhID0gSnNvbk1hbmFnZXIuJC5nZXRUYWJsZShlbnVtSnNvbkRlZmluZS5sb3R0ZXJ5KVxyXG4gICAgICB0aGlzLmJ0bkNvbmZpcm0ub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25CdG5TdGFydCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq4oCU4oCUKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL+WIhueVjOe6vy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirkuLvpobXpnaLngrnlh7vkuovku7YqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICBvbkJ0blN0YXJ0KCkge1xyXG5cclxuICAgICAgbGV0IHJhbmRvbSA9IFV0aWxNYXRoLnJhbmRvbSgxLDEwMCk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xyXG4gICAgICAgICBpZiAodGhpcy5sb3R0ZXJ5RGF0YVtpXS5yYW5nZU1pbjw9cmFuZG9tJiZyYW5kb208PXRoaXMubG90dGVyeURhdGFbaV0ucmFuZ2VNYXgpe1xyXG4gICAgICAgICAgICAgdGhpcy5yZXdhcmRNdWwgPSB0aGlzLmxvdHRlcnlEYXRhW2ldLnJld2FyZDtcclxuICAgICAgICAgICAgIHRoaXMub25UdXJuaW5nKGkpO1xyXG4gICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/liIbnlYznur8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKui9rOebmOWKqOeUu+aYvuekuioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICBwcml2YXRlIG9uVHVybmluZyhyZXdhcmQ6IG51bWJlciA9IDApIHtcclxuXHJcbiAgICAgIC8v5YWz6Zet5YWz6Zet5oyJ6ZKu5pi+56S6XHJcbiAgICAgIHRoaXMuYnRuQ2xvc2UudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAvL+emgeeUqOi9rOebmOaMiemSrlxyXG4gICAgICB0aGlzLmJ0bkNvbmZpcm0ubW91c2VFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgIC8v6L2s55uY5Yqo55S7XHJcbiAgICAgIGxldCBhQ291bnQgPSBPYmplY3Qua2V5cyh0aGlzLmxvdHRlcnlEYXRhKS5sZW5ndGg7XHJcblxyXG4gICAgICBsZXQgY0luZGV4ID0gcmV3YXJkO1xyXG4gICAgICBsZXQgcGVyRGVnID0gMzYwIC8gYUNvdW50O1xyXG4gICAgICBsZXQgY3VyRGVnID0gKDM2MCAtIHBlckRlZyAqIChjSW5kZXggLSAxKSkgKyBVdGlsTWF0aC5yYW5kUmFuZ2VJbnQoLXBlckRlZyAvIDIsIHBlckRlZyAvIDIpO1xyXG5cclxuICAgICAgdGhpcy5pbWdDb250ZXh0LnJvdGF0aW9uID0gMDtcclxuICAgICAgbGV0IGRzdFJvdGF0aW9uID0gMzYwMCArIGN1ckRlZztcclxuICAgICAgTGF5YS5Ud2Vlbi50byh0aGlzLmltZ0NvbnRleHQsIHtcclxuICAgICAgICAgIHJvdGF0aW9uOiBkc3RSb3RhdGlvbixcclxuICAgICAgfSwgNjAwMCwgTGF5YS5FYXNlLnN0cm9uZ091dCwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCAoKT0+e1xyXG5cclxuICAgICAgdGhpcy5idG5Db25maXJtLm1vdXNlRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuYnRuQ2xvc2UudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgIExvZy5sb2coXCLlgI3njofvvJpcIit0aGlzLnJld2FyZE11bCk7XHJcblxyXG4gICAgICB9KSwgMCwgZmFsc2UsIGZhbHNlKTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyB1aSB9IGZyb20gJy4uLy4uLy4uL3VpL2xheWFNYXhVSSc7XG5pbXBvcnQgYmdVSSA9ICB1aS52aWV3Lm1haW4uYmdVSTtcbmltcG9ydCB7IERhdGFCYXNlIH0gZnJvbSAnLi4vLi4vLi4vZnJhbWV3b3JrL21hbmFnZXIvZGF0YS9kYXRhLWJhc2UnO1xuXG5cbi8qKlxuICogQGF1dGhvciBTdW5cbiAqIEB0aW1lIDIwMTktMDgtMTEgMTE6MjNcbiAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICogQGRlc2NyaXB0aW9uIFxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIEJnVmlldyBleHRlbmRzIGJnVUl7XG5cblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq6aG16Z2i5bGe5oCn566h55CGKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/liIbnlYznur8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKumhtemdoueUn+WRveWRqOacnyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBCZ1ZpZXdcblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0ICQoKTogQmdWaWV3IHtcbiAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlKSB0aGlzLmluc3RhbmNlID0gbmV3IEJnVmlldygpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICB9XG5cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIG9uQXdha2UoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm9uQXdha2UoKTtcbiAgICAgICAgdGhpcy5Jbml0KCk7XG4gICAgICAgIHRoaXMuc3VpdEluaXQoKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICog5Yid5aeL5YyW5LiA5qyhXG4gICAgICovXG4gICAgcHVibGljIEluaXQoKSB7XG5cbiAgICAgICAgdGhpcy5pbml0T25jZSgpO1xuXG4gICAgICAgIC8vIC8v5pWw5o2u55uR5ZCsXG4gICAgICAgIC8vIHRoaXMuYWRkRGF0YVdhdGNoKERhdGFEZWZpbmUuVXNlckluZm8pO1xuXG4gICAgICAgIGlmIChMYXlhLkJyb3dzZXIub25XZWlYaW4pIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdExpbmsoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOmAgumFjVxuICAgICAqL1xuICAgIHN1aXRJbml0KClcbiAgICB7XG4gICAgICAgIHRoaXMud2lkdGggPSBMYXlhLnN0YWdlLndpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IExheWEuc3RhZ2UuaGVpZ2h0O1xuICAgIH1cblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq4oCU4oCUKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL+WIhueVjOe6vy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq6aG16Z2i5Yid5aeL5pWw5o2uKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKiogRGVzOuaehOmAoOaYr+WIneWni+WMluS4gOasoSAqL1xuICAgIHByaXZhdGUgaW5pdE9uY2UoKVxuICAgIHtcblxuICAgIH1cblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq4oCU4oCUKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL+WIhueVjOe6vy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuWklumDqOi/nuaOpei/m+WFpeWIpOaWrSoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKiBEZXM65Yik5pat6L+b5YWl6L+e5o6l5L+h5oGvICovXG4gICAgcHJpdmF0ZSBpbml0TGluaygpIHtcblxuXG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq4oCU4oCUKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL+WIhueVjOe6vy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq6aG16Z2i5LqL5Lu255u45YWzKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq4oCU4oCUKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL+WIhueVjOe6vy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirmlbDmja7mlLnlj5jnmoTnm5HlkKwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICog5Yi35paw5pWw5o2uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIG9uRGF0YShkYXRhOiBEYXRhQmFzZSkge1xuICAgICAgIFxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy3liIbnlYznur8tLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xufSIsImltcG9ydCBCcm93c2VyID0gTGF5YS5Ccm93c2VyO1xuaW1wb3J0IHtHYW1lVmlld30gZnJvbSBcIi4vZ2FtZS12aWV3XCI7XG5pbXBvcnQge0VmZmVjdFZpZXd9IGZyb20gXCIuL2VmZmVjdC12aWV3XCI7XG5pbXBvcnQgeyB1aSB9IGZyb20gJy4uLy4uLy4uL3VpL2xheWFNYXhVSSc7XG5pbXBvcnQgZDNVSSA9ICB1aS52aWV3Lm1haW4uZDNVSTtcbmltcG9ydCB7IERhdGFCYXNlIH0gZnJvbSAnLi4vLi4vLi4vZnJhbWV3b3JrL21hbmFnZXIvZGF0YS9kYXRhLWJhc2UnO1xuaW1wb3J0IHsgVXRpbExvYWQzRCB9IGZyb20gJy4uLy4uLy4uL2ZyYW1ld29yay91dGlsL2xvYWQzZCc7XG5pbXBvcnQgeyBDb25maWczRCB9IGZyb20gJy4uLy4uLy4uL2ZyYW1ld29yay9zZXR0aW5nL2NvbmZpZyc7XG5pbXBvcnQgeyBFdmVudEZ1bmMgfSBmcm9tICcuLi8uLi8uLi9mcmFtZXdvcmsvbWFuYWdlci9ldmVudC9ldmVudC1kYXRhJztcblxuXG4vKipcbiAqIEBhdXRob3IgU3VuXG4gKiBAdGltZSAyMDE5LTA4LTExIDEyOjAzXG4gKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcbiAqIEBkZXNjcmlwdGlvbiAzROWcuuaZr+WxglxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIEQzVmlldyBleHRlbmRzIGQzVUl7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirpobXpnaLlsZ7mgKfnrqHnkIYqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKiBEZXM6M0TlnLrmma8gKi9cbiAgICBwdWJsaWMgc2NlbmUzRDpMYXlhLlNjZW5lM0Q7XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/liIbnlYznur8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKumhtemdoueUn+WRveWRqOacnyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBEM1ZpZXdcblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0ICQoKTogRDNWaWV3IHtcbiAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlKSB0aGlzLmluc3RhbmNlID0gbmV3IEQzVmlldygpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICB9XG5cblxuXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBvbkF3YWtlKCk6IHZvaWQge1xuICAgICAgICBzdXBlci5vbkF3YWtlKCk7XG4gICAgICAgIHRoaXMuSW5pdCgpO1xuICAgICAgICB0aGlzLnN1aXRJbml0KCk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIOWIneWni+WMluS4gOasoVxuICAgICAqL1xuICAgIHB1YmxpYyBJbml0KCkge1xuXG4gICAgICAgIHRoaXMuaW5pdE9uY2UoKTtcblxuICAgICAgICAvLyAvL+aVsOaNruebkeWQrFxuICAgICAgICAvLyB0aGlzLmFkZERhdGFXYXRjaChEYXRhRGVmaW5lLlVzZXJJbmZvKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmr4/mrKHlvLnlh7rliJ3lp4vljJbkuIDmrKFcbiAgICAgKi9cbiAgICBwb3B1cEluaXQoKSB7XG4gICAgICAgIHRoaXMuaW5pdEFsbCgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICog6YCC6YWNXG4gICAgICovXG4gICAgc3VpdEluaXQoKVxuICAgIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IExheWEuc3RhZ2Uud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gTGF5YS5zdGFnZS5oZWlnaHQ7XG4gICAgfVxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirigJTigJQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8v5YiG55WM57q/Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirpobXpnaLliJ3lp4vmlbDmja4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKiBEZXM65p6E6YCg5piv5Yid5aeL5YyW5LiA5qyhICovXG4gICAgcHJpdmF0ZSBpbml0T25jZSgpXG4gICAge1xuICAgICAgICBcbiAgICB9XG5cbiAgICAvKiogRGVzOuavj+asoeW8ueWHuuWIneWni+WMliAqL1xuICAgIHByaXZhdGUgaW5pdEFsbCgpXG4gICAge1xuXG4gICAgfVxuXG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/liIbnlYznur8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirlpJbpg6jov57mjqXov5vlhaXliKTmlq0qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKiogRGVzOuWIpOaWrei/m+WFpei/nuaOpeS/oeaBryAqL1xuICAgIHByaXZhdGUgaW5pdExpbmsoKSB7XG5cblxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/liIbnlYznur8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKumhtemdouS6i+S7tuebuOWFsyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/liIbnlYznur8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqM0TlnLrmma/liqDovb3lrozmiJDlm57osIMqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICog5Yqg6L29M0TlnLrmma9cbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZDNEU2NlbmUoYXJlYSxjYWxsQmFjaylcbiAgICB7XG4gICAgICAgIFV0aWxMb2FkM0QubG9hZFNjZW5lKENvbmZpZzNELiQuc2NlbmVQYXRoLGFyZWEsY2FsbEJhY2spO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/liIbnlYznur8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq5pWw5o2u5pS55Y+Y55qE55uR5ZCsKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIOWIt+aWsOaVsOaNrlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBvbkRhdGEoZGF0YTogRGF0YUJhc2UpIHtcbiAgICAgIFxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy3liIbnlYznur8tLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xufSIsImltcG9ydCB7dWl9IGZyb20gXCIuLi8uLi8uLi91aS9sYXlhTWF4VUlcIjtcbmltcG9ydCBlZmZlY3RVSSA9ICB1aS52aWV3Lm1haW4uZWZmZWN0VUk7XG5cbmltcG9ydCBCcm93c2VyID0gTGF5YS5Ccm93c2VyO1xuaW1wb3J0IHsgRGF0YUJhc2UgfSBmcm9tICcuLi8uLi8uLi9mcmFtZXdvcmsvbWFuYWdlci9kYXRhL2RhdGEtYmFzZSc7XG5pbXBvcnQgeyBMb2cgfSBmcm9tICcuLi8uLi8uLi9mcmFtZXdvcmsvY29yZS9sb2cnO1xuaW1wb3J0IHsgTG90dGVyeVZpZXcgfSBmcm9tICcuLi9jb21wb25lbnQtdmlldy9sb3R0ZXJ5LXZpZXcnO1xuaW1wb3J0IHsgUG9wdXBEYXRhIH0gZnJvbSAnLi4vLi4vLi4vZnJhbWV3b3JrL21hbmFnZXIvdWkvZGlhbG9nLWJhc2UnO1xuXG5leHBvcnQgY2xhc3MgRWZmZWN0VmlldyBleHRlbmRzIGVmZmVjdFVJe1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq6aG16Z2i5bGe5oCn566h55CGKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/liIbnlYznur8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKumhtemdoueUn+WRveWRqOacnyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBFZmZlY3RWaWV3XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldCAkKCk6IEVmZmVjdFZpZXcge1xuICAgICAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHRoaXMuaW5zdGFuY2UgPSBuZXcgRWZmZWN0VmlldygpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICB9XG5cblxuXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBvbkF3YWtlKCk6IHZvaWQge1xuICAgICAgICBzdXBlci5vbkF3YWtlKCk7XG4gICAgICAgIHRoaXMuSW5pdCgpO1xuICAgICAgICB0aGlzLnN1aXRJbml0KCk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIOWIneWni+WMluS4gOasoVxuICAgICAqL1xuICAgIHB1YmxpYyBJbml0KCkge1xuXG4gICAgICAgIHRoaXMuaW5pdE9uY2UoKTtcblxuICAgICAgICAvLyAvL+aVsOaNruebkeWQrFxuICAgICAgICAvLyB0aGlzLmFkZERhdGFXYXRjaChEYXRhRGVmaW5lLlVzZXJJbmZvKTtcblxuICAgICAgICBpZiAoQnJvd3Nlci5vbldlaVhpbikge1xuICAgICAgICAgICAgdGhpcy5pbml0TGluaygpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmr4/mrKHlvLnlh7rliJ3lp4vljJbkuIDmrKFcbiAgICAgKi9cbiAgICBwb3B1cEluaXQoKSB7XG4gICAgICAgIHRoaXMuaW5pdEFsbCgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICog6YCC6YWNXG4gICAgICovXG4gICAgc3VpdEluaXQoKVxuICAgIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IExheWEuc3RhZ2Uud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gTGF5YS5zdGFnZS5oZWlnaHQ7XG4gICAgfVxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirigJTigJQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8v5YiG55WM57q/Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirpobXpnaLliJ3lp4vmlbDmja4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKiBEZXM65p6E6YCg5piv5Yid5aeL5YyW5LiA5qyhICovXG4gICAgcHJpdmF0ZSBpbml0T25jZSgpXG4gICAge1xuICAgICAgICB0aGlzLmJ0bkx1Y2t5Lm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcywoKT0+e1xuICAgICAgICAgICBsZXQgdmlldyA9IExvdHRlcnlWaWV3LiQ7XG4gICAgICAgICAgIHZpZXcucG9wdXBEaWFsb2coKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIERlczrmr4/mrKHlvLnlh7rliJ3lp4vljJYgKi9cbiAgICBwcml2YXRlIGluaXRBbGwoKVxuICAgIHtcblxuICAgIH1cblxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirigJTigJQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8v5YiG55WM57q/Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq5aSW6YOo6L+e5o6l6L+b5YWl5Yik5patKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqIERlczrliKTmlq3ov5vlhaXov57mjqXkv6Hmga8gKi9cbiAgICBwcml2YXRlIGluaXRMaW5rKCkge1xuXG5cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirigJTigJQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8v5YiG55WM57q/Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirpobXpnaLngrnlh7vkuovku7YqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/liIbnlYznur8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq5pWw5o2u5pS55Y+Y55qE55uR5ZCsKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIOWIt+aWsOaVsOaNrlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBvbkRhdGEoZGF0YTogRGF0YUJhc2UpIHtcbiAgICAgXG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq4oCU4oCUKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLeWIhueVjOe6vy0vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG59IiwiaW1wb3J0IHt1aX0gZnJvbSBcIi4uLy4uLy4uL3VpL2xheWFNYXhVSVwiO1xuaW1wb3J0IEJyb3dzZXIgPSBMYXlhLkJyb3dzZXI7XG5pbXBvcnQgZ2FtZVVJID0gdWkudmlldy5tYWluLmdhbWVVSTtcbmltcG9ydCBQcmVmYWIgPSBMYXlhLlByZWZhYjtcbmltcG9ydCBUd2VlbiA9IExheWEuVHdlZW47XG5pbXBvcnQgRWFzZSA9IExheWEuRWFzZTtcbmltcG9ydCBIYW5kbGVyID0gTGF5YS5IYW5kbGVyO1xuaW1wb3J0IFBvaW50ID0gTGF5YS5Qb2ludDtcbmltcG9ydCB7IERhdGFCYXNlIH0gZnJvbSAnLi4vLi4vLi4vZnJhbWV3b3JrL21hbmFnZXIvZGF0YS9kYXRhLWJhc2UnO1xuaW1wb3J0IHsgUmVzTWFuYWdlciB9IGZyb20gJy4uLy4uLy4uL2ZyYW1ld29yay9tYW5hZ2VyL3Jlcy9yZXMtbWFuYWdlcic7XG5pbXBvcnQgeyBMb2cgfSBmcm9tICcuLi8uLi8uLi9mcmFtZXdvcmsvY29yZS9sb2cnO1xuXG5cbi8qKlxuICogQGF1dGhvciBTdW5cbiAqIEB0aW1lIDIwMTktMDgtMTEgMTg6MDhcbiAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICogQGRlc2NyaXB0aW9uIOS4u+mhtVxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIEdhbWVWaWV3IGV4dGVuZHMgZ2FtZVVJIHtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKumhtemdouWxnuaAp+euoeeQhioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirigJTigJQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8v5YiG55WM57q/Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirpobXpnaLnlJ/lkb3lkajmnJ8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogR2FtZVZpZXdcblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0ICQoKTogR2FtZVZpZXcge1xuICAgICAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHRoaXMuaW5zdGFuY2UgPSBuZXcgR2FtZVZpZXcoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgfVxuXG5cblxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgb25Bd2FrZSgpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25Bd2FrZSgpO1xuICAgICAgICB0aGlzLkluaXQoKTtcbiAgICAgICAgdGhpcy5zdWl0SW5pdCgpO1xuXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDliJ3lp4vljJbkuIDmrKFcbiAgICAgKi9cbiAgICBwdWJsaWMgSW5pdCgpIHtcblxuICAgICAgICB0aGlzLmluaXRPbmNlKCk7XG5cbiAgICAgICAgLy8gLy/mlbDmja7nm5HlkKxcbiAgICAgICAgLy8gdGhpcy5hZGREYXRhV2F0Y2goRGF0YURlZmluZS5Vc2VySW5mbyk7XG5cbiAgICAgICAgaWYgKEJyb3dzZXIub25XZWlYaW4pIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdExpbmsoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5q+P5qyh5by55Ye65Yid5aeL5YyW5LiA5qyhXG4gICAgICovXG4gICAgcG9wdXBJbml0KCkge1xuICAgICAgICB0aGlzLmluaXRBbGwoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIOmAgumFjVxuICAgICAqL1xuICAgIHN1aXRJbml0KClcbiAgICB7XG4gICAgXG4gICAgfVxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirigJTigJQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8v5YiG55WM57q/Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirpobXpnaLliJ3lp4vmlbDmja4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKiBEZXM65p6E6YCg5piv5Yid5aeL5YyW5LiA5qyhICovXG4gICAgcHJpdmF0ZSBpbml0T25jZSgpXG4gICAge1xuICAgIH1cblxuICAgIC8qKiBEZXM65q+P5qyh5by55Ye65Yid5aeL5YyWICovXG4gICAgcHJpdmF0ZSBpbml0QWxsKClcbiAgICB7XG5cbiAgICB9XG5cblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq4oCU4oCUKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL+WIhueVjOe6vy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuWklumDqOi/nuaOpei/m+WFpeWIpOaWrSoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKiBEZXM65Yik5pat6L+b5YWl6L+e5o6l5L+h5oGvICovXG4gICAgcHJpdmF0ZSBpbml0TGluaygpIHtcblxuXG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq4oCU4oCUKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL+WIhueVjOe6vy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq6aG16Z2i54K55Ye75LqL5Lu2KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuIFxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/liIbnlYznur8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq5pWw5o2u5pS55Y+Y55qE55uR5ZCsKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIOWIt+aWsOaVsOaNrlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBvbkRhdGEoZGF0YTogRGF0YUJhc2UpIHtcbiAgICAgICAgXG4gICAgfVxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirigJTigJQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8t5YiG55WM57q/LS8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxufVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJpbXBvcnQge3VpfSBmcm9tIFwiLi4vLi4vLi4vdWkvbGF5YU1heFVJXCI7XG5pbXBvcnQgbG9hZGluZ1VJID0gdWkudmlldy5tYWluLmxvYWRpbmdVSTtcbmltcG9ydCB7IElMb2FpbmcgfSBmcm9tICcuLi8uLi8uLi9mcmFtZXdvcmsvaW50ZXJmYWNlL2ktTG9hZGluZyc7XG5pbXBvcnQgeyBCZ1ZpZXcgfSBmcm9tICcuL2JnLXZpZXcnO1xuaW1wb3J0IHsgRDNWaWV3IH0gZnJvbSAnLi9kMy12aWV3JztcbmltcG9ydCB7IERhdGFCYXNlIH0gZnJvbSAnLi4vLi4vLi4vZnJhbWV3b3JrL21hbmFnZXIvZGF0YS9kYXRhLWJhc2UnO1xuaW1wb3J0IHsgQ29uZmlnVUksIENvbmZpZ0dhbWUsIENvbmZpZ1JlcyB9IGZyb20gJy4uLy4uLy4uL2ZyYW1ld29yay9zZXR0aW5nL2NvbmZpZyc7XG5pbXBvcnQgeyBFdmVudE1hbmFnZXIgfSBmcm9tICcuLi8uLi8uLi9mcmFtZXdvcmsvbWFuYWdlci9ldmVudC9ldmVudC1tYW5hZ2VyJztcbmltcG9ydCB7IFV0aWxOdW1iZXIgfSBmcm9tICcuLi8uLi8uLi9mcmFtZXdvcmsvdXRpbC9udW1iZXInO1xuaW1wb3J0IHsgZW51bURpbWVuc2lvbiB9IGZyb20gJy4uLy4uLy4uL2ZyYW1ld29yay9zZXR0aW5nL2VudW0nO1xuaW1wb3J0IHsgR2FtZVZpZXcgfSBmcm9tICcuL2dhbWUtdmlldyc7XG5pbXBvcnQgeyBFZmZlY3RWaWV3IH0gZnJvbSAnLi9lZmZlY3Qtdmlldyc7XG5pbXBvcnQgeyBFdmVudEZ1bmMgfSBmcm9tICcuLi8uLi8uLi9mcmFtZXdvcmsvbWFuYWdlci9ldmVudC9ldmVudC1kYXRhJztcbmltcG9ydCB7IExvZyB9IGZyb20gJy4uLy4uLy4uL2ZyYW1ld29yay9jb3JlL2xvZyc7XG5pbXBvcnQgeyBSZXNNYW5hZ2VyIH0gZnJvbSAnLi4vLi4vLi4vZnJhbWV3b3JrL21hbmFnZXIvcmVzL3Jlcy1tYW5hZ2VyJztcbmltcG9ydCB7IFJlc0dyb3VwIH0gZnJvbSAnLi4vLi4vLi4vZnJhbWV3b3JrL21hbmFnZXIvcmVzL3Jlcy1ncm91cCc7XG5cblxuXG5leHBvcnQgY2xhc3MgTG9hZGluZ1ZpZXcgZXh0ZW5kcyBsb2FkaW5nVUkgaW1wbGVtZW50cyBJTG9haW5ne1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq6aG16Z2i5bGe5oCn566h55CGKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/liIbnlYznur8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKumhtemdoueUn+WRveWRqOacnyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgb25Bd2FrZSgpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25Bd2FrZSgpO1xuICAgICAgICB0aGlzLkluaXQoKTtcbiAgICAgICAgdGhpcy5zdWl0SW5pdCgpO1xuICAgIH1cblxuICAgICAgLyoqXG4gICAgICog5Yqg6L296aG16Z2i5ZCv5Yqo6aG5XG4gICAgICovXG4gICAgb25TdGFydCgpOiB2b2lkIHtcbiAgICAgIFxuICAgICAgICAvL+WKoOi9veS4u+WcuuaZr+aJgOmcgOimgeeahOi1hOa6kOS/oeaBr1xuICAgICAgICBSZXNNYW5hZ2VyLiQubG9hZEdyb3VwKFxuICAgICAgICAgICAgQ29uZmlnUmVzLiQuZGVmYXVsdE1haW5SZXMsXG4gICAgICAgICAgICBuZXcgRXZlbnRGdW5jKHRoaXMsdGhpcy5vblByb2dyZXNzKSxcbiAgICAgICAgICAgIG5ldyBFdmVudEZ1bmModGhpcyx0aGlzLm9uQ29tcGxldGVkKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLmxibExvYWRpbmcudGV4dCA9IFwi5ri45oiP55m75b2V5LitLi4uXCI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yqg6L295a6M5oiQ5Zue6LCDXG4gICAgICogQHBhcmFtIHN1Y2Nlc3NcbiAgICAgKi9cbiAgICBvbkNvbXBsZXRlZChzdWNjZXNzOiBib29sZWFuKTogdm9pZCB7XG5cbiAgICAgICAgLy9CZ+mhtemdolxuICAgICAgICBsZXQgYmdWaWV3ID0gQmdWaWV3LiQ7XG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoYmdWaWV3KTtcblxuICAgICAgICBpZihDb25maWdHYW1lLiQuZGltZW5zaW9uPT1lbnVtRGltZW5zaW9uLkRpbTMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vM0TpobXpnaJcbiAgICAgICAgICAgIGxldCBkM1ZpZXcgPSBEM1ZpZXcuJDtcbiAgICAgICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoZDNWaWV3KTtcbiAgICAgICAgICAgIGQzVmlldy5sb2FkM0RTY2VuZSh0aGlzLHRoaXMuc2hvd1ZpZXcpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuc2hvd1ZpZXcoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIHNob3dWaWV3KClcbiAgICB7XG4gICAgICAgIC8v5Li76aG1XG4gICAgICAgIGxldCBnYW1lVmlldyA9IEdhbWVWaWV3LiQ7XG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoZ2FtZVZpZXcpO1xuICAgICAgICAvL+aViOaenOmhtVxuICAgICAgICBsZXQgZWZmZWN0VmlldyA9IEVmZmVjdFZpZXcuJDtcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZChlZmZlY3RWaWV3KTtcbiAgICAgICAgLy/nu5PmnZ/plIDmr4HliqDovb3pobVcbiAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yqg6L296L+b5bqmXG4gICAgICogQHBhcmFtIHByb2dyZXNzXG4gICAgICovXG4gICAgb25Qcm9ncmVzcyhwcm9ncmVzczogbnVtYmVyKTogdm9pZCB7XG5cbiAgICAgICAgbGV0IGZpeGVkID0gVXRpbE51bWJlci50b0ZpeGVkKHByb2dyZXNzKjEwMCwgMCk7XG4gICAgICAgIHRoaXMubGJsTG9hZGluZy50ZXh0ID0gZml4ZWQgKyBcIiVcIjtcbiAgICAgICAgdGhpcy5wcm9fTG9hZGluZy52YWx1ZSA9IGZpeGVkLzEwMDtcbiAgICB9XG5cbiAgXG5cblxuICAgIC8qKlxuICAgICAqIOWIneWni+WMluS4gOasoVxuICAgICAqL1xuICAgIHB1YmxpYyBJbml0KCkge1xuICAgICAgICB0aGlzLmluaXRPbmNlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5q+P5qyh5by55Ye65Yid5aeL5YyW5LiA5qyhXG4gICAgICovXG4gICAgcG9wdXBJbml0KCkge1xuICAgICAgICB0aGlzLmluaXRBbGwoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIOmAgumFjVxuICAgICAqL1xuICAgIHN1aXRJbml0KClcbiAgICB7XG4gICAgICAgIHRoaXMud2lkdGggPSBMYXlhLnN0YWdlLndpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IExheWEuc3RhZ2UuaGVpZ2h0O1xuICAgICAgICB0aGlzLmltZ19iZy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuaW1nX2JnLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICB0aGlzLmltZ19iZy54ID0gMDtcbiAgICAgICAgdGhpcy5pbWdfYmcueSA9IDA7XG4gICAgfVxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirigJTigJQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8v5YiG55WM57q/Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirpobXpnaLliJ3lp4vmlbDmja4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKiBEZXM65p6E6YCg5piv5Yid5aeL5YyW5LiA5qyhICovXG4gICAgcHJpdmF0ZSBpbml0T25jZSgpXG4gICAge1xuXG4gICAgfVxuXG4gICAgLyoqIERlczrmr4/mrKHlvLnlh7rliJ3lp4vljJYgKi9cbiAgICBwcml2YXRlIGluaXRBbGwoKVxuICAgIHtcblxuICAgIH1cblxuXG5cblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq4oCU4oCUKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL+WIhueVjOe6vy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuWklumDqOi/nuaOpei/m+WFpeWIpOaWrSoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKiBEZXM65Yik5pat6L+b5YWl6L+e5o6l5L+h5oGvICovXG4gICAgcHJpdmF0ZSBpbml0TGluaygpIHtcblxuXG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq4oCU4oCUKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL+WIhueVjOe6vy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq6aG16Z2i54K55Ye75LqL5Lu2KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/liIbnlYznur8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq5pWw5o2u5pS55Y+Y55qE55uR5ZCsKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIOWIt+aWsOaVsOaNrlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBvbkRhdGEoZGF0YTogRGF0YUJhc2UpIHtcbiAgICAgXG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq4oCU4oCUKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLeWIhueVjOe6vy0vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKumUgOavgeiHqui6qyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGRlc3Ryb3koKVxuICAgIHtcbiAgICAgICAgLy8gdGhpcy5yZW1vdmVTZWxmKCk7XG4gICAgICAgIC8vIFJlc01hbmFnZXIuJC5yZWxlYXNlR3JvdXAoQ29uZmlnUmVzLiQuZGVmYXVsdExvYWRSZXMpO1xuICAgIH1cblxuICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq4oCU4oCUKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLeWIhueVjOe6vy0vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG59IiwiaW1wb3J0IHsgQ29uZmlnRGVidWcgfSBmcm9tICcuLi9zZXR0aW5nL2NvbmZpZyc7XG5cbiAvKipcbiAqIEBhdXRob3IgU3VuXG4gKiBAdGltZSAyMDE5LTA4LTA5IDE1OjU5XG4gKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcbiAqIEBkZXNjcmlwdGlvbiDovpPlh7rkv6Hmga/nrqHnkIZcbiAqL1xuZXhwb3J0IGNsYXNzIExvZyB7XG5cbiAgICBwdWJsaWMgc3RhdGljIGRlYnVnKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGlmIChDb25maWdEZWJ1Zy4kLmlzRGVidWcpIGNvbnNvbGUuZGVidWcoXCJbZGVidWddXCIsIGFyZ3MudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBpbmZvKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGlmIChDb25maWdEZWJ1Zy4kLmlzRGVidWcpIGNvbnNvbGUuaW5mbyhcIltpbmZvXVwiLCBhcmdzLnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgd2FybiguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBpZiAoQ29uZmlnRGVidWcuJC5pc0RlYnVnKSBjb25zb2xlLndhcm4oXCJbd2Fybl1cIiwgYXJncy50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGVycm9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGlmIChDb25maWdEZWJ1Zy4kLmlzRGVidWcpIGNvbnNvbGUuZXJyb3IoXCJbZXJyb3JdXCIsIGFyZ3MudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBleGNlcHRpb24oLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgaWYgKENvbmZpZ0RlYnVnLiQuaXNEZWJ1ZykgY29uc29sZS5leGNlcHRpb24oXCJbZXhjZV1cIiwgYXJncy50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGxvZyguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBpZiAoQ29uZmlnRGVidWcuJC5pc0RlYnVnKSBjb25zb2xlLmxvZyhcIltsb2ddXCIsIGFyZ3MudG9TdHJpbmcoKSk7XG4gICAgfVxuXG5cbiAgICAvKirmiZPljbDorr7lpIfkv6Hmga8qL1xuICAgIHB1YmxpYyBzdGF0aWMgcHJpbnREZXZpY2VJbmZvKCkge1xuICAgICAgICBpZiAoQ29uZmlnRGVidWcuJC5pc0RlYnVnICYmIG5hdmlnYXRvcikge1xuICAgICAgICAgICAgbGV0IGFnZW50U3RyID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcblxuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gYWdlbnRTdHIuaW5kZXhPZihcIihcIik7XG4gICAgICAgICAgICBsZXQgZW5kID0gYWdlbnRTdHIuaW5kZXhPZihcIilcIik7XG5cbiAgICAgICAgICAgIGlmIChzdGFydCA8IDAgfHwgZW5kIDwgMCB8fCBlbmQgPCBzdGFydCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGluZm9TdHIgPSBhZ2VudFN0ci5zdWJzdHJpbmcoc3RhcnQgKyAxLCBlbmQpO1xuXG4gICAgICAgICAgICBsZXQgZGV2aWNlOiBzdHJpbmcsIHN5c3RlbTogc3RyaW5nLCB2ZXJzaW9uOiBzdHJpbmc7XG4gICAgICAgICAgICBsZXQgaW5mb3MgPSBpbmZvU3RyLnNwbGl0KFwiO1wiKTtcbiAgICAgICAgICAgIGlmIChpbmZvcy5sZW5ndGggPT0gMykge1xuICAgICAgICAgICAgICAgIC8v5aaC5p6c5piv5LiJ5Liq55qE6K+d77yMIOWPr+iDveaYr2FuZHJvaWTnmoTvvIwg6YKj5LmI56ys5LiJ5Liq5piv6K6+5aSH5Y+3XG4gICAgICAgICAgICAgICAgZGV2aWNlID0gaW5mb3NbMl07XG4gICAgICAgICAgICAgICAgLy/nrKzkuozkuKrmmK/ns7vnu5/lj7flkozniYjmnKxcbiAgICAgICAgICAgICAgICBsZXQgc3lzdGVtX2luZm8gPSBpbmZvc1sxXS5zcGxpdChcIiBcIik7XG4gICAgICAgICAgICAgICAgaWYgKHN5c3RlbV9pbmZvLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHN5c3RlbSA9IHN5c3RlbV9pbmZvWzFdO1xuICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uID0gc3lzdGVtX2luZm9bMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpbmZvcy5sZW5ndGggPT0gMikge1xuICAgICAgICAgICAgICAgIHN5c3RlbSA9IGluZm9zWzBdO1xuICAgICAgICAgICAgICAgIGRldmljZSA9IGluZm9zWzBdO1xuICAgICAgICAgICAgICAgIHZlcnNpb24gPSBpbmZvc1sxXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3lzdGVtID0gbmF2aWdhdG9yLnBsYXRmb3JtO1xuICAgICAgICAgICAgICAgIGRldmljZSA9IG5hdmlnYXRvci5wbGF0Zm9ybTtcbiAgICAgICAgICAgICAgICB2ZXJzaW9uID0gaW5mb1N0cjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIExvZy5pbmZvKHN5c3RlbSwgZGV2aWNlLCB2ZXJzaW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG4iLCJpbXBvcnQgeyBMb2cgfSBmcm9tICcuL2xvZyc7XG5cbi8qKlxuICogQGF1dGhvciBTdW5cbiAqIEB0aW1lIDIwMTktMDgtMDkgMjM6MjVcbiAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICogQGRlc2NyaXB0aW9uICDlr7nosaHmsaBcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBPYmplY3RQb29sIHtcbiAgICBcbiAgICAvKipcbiAgICAgKiDojrflj5bkuIDkuKrlr7nosaHvvIzkuI3lrZjlnKjliJnliJvlu7pcbiAgICAgKiBAcGFyYW0gY2xhc3NEZWYgIOexu+WQjVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0KGNsYXNzRGVmOiBhbnkpOiBhbnkge1xuICAgICAgICBsZXQgc2lnbjogc3RyaW5nID0gXCJkYy5cIiArIGNsYXNzRGVmLm5hbWU7XG4gICAgICAgIGxldCBvYmo6IGFueSA9IExheWEuUG9vbC5nZXRJdGVtKHNpZ24pO1xuICAgICAgICBpZiAoIW9iaikge1xuICAgICAgICAgICAgaWYgKCFMYXlhLkNsYXNzVXRpbHMuZ2V0UmVnQ2xhc3Moc2lnbikpIHtcbiAgICAgICAgICAgICAgICBMb2cuZGVidWcoXCJbcG9vbHNd5rOo5YaM5a+56LGh5rGgOlwiICsgc2lnbik7XG4gICAgICAgICAgICAgICAgTGF5YS5DbGFzc1V0aWxzLnJlZ0NsYXNzKHNpZ24sIGNsYXNzRGVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9iaiA9IExheWEuQ2xhc3NVdGlscy5nZXRJbnN0YW5jZShzaWduKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2JqICYmIG9ialtcImluaXRcIl0pIG9iai5pbml0KCk7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Zue5pS25a+56LGhXG4gICAgICogQHBhcmFtIG9iaiAg5a+56LGh5a6e5L6LXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWNvdmVyKG9iajogYW55KTogdm9pZCB7XG4gICAgICAgIGlmICghb2JqKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHByb3RvOiBhbnkgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcbiAgICAgICAgbGV0IGNsYXp6OiBhbnkgPSBwcm90b1tcImNvbnN0cnVjdG9yXCJdO1xuICAgICAgICBsZXQgc2lnbjogc3RyaW5nID0gXCJkYy5cIiArIGNsYXp6Lm5hbWU7XG4gICAgICAgIG9iai5jbG9zZSgpO1xuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihzaWduLCBvYmopO1xuICAgIH1cbn1cblxuLyoq5a+56LGh5rGg5Z+657G7Ki9cbmV4cG9ydCBpbnRlcmZhY2UgSVBvb2xPYmplY3Qge1xuICAgIC8vIOWIneWni+WMllxuICAgIGluaXQoKTtcbiAgICAvLyDlhbPpl61cbiAgICBjbG9zZSgpO1xufVxuIiwiaW1wb3J0IHsgTG9nIH0gZnJvbSAnLi9sb2cnO1xuXG4gLyoqXG4gKiBAYXV0aG9yIFN1blxuICogQHRpbWUgMjAxOS0wOC0wOSAxNTo1N1xuICogQHByb2plY3QgU0ZyYW1ld29ya19MYXlhQWlyXG4gKiBAZGVzY3JpcHRpb24g5Y2V5L6L5bel5YW357G7XG4gKi9cbmV4cG9ydCBjbGFzcyBTaW5nbGV0b24ge1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2xhc3NLZXlzOiBGdW5jdGlvbltdID0gW107XG4gICAgcHJpdmF0ZSBzdGF0aWMgY2xhc3NWYWx1ZXM6IGFueVtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IGNsYXp6OiBhbnkgPSB0aGlzW1wiY29uc3RydWN0b3JcIl07XG4gICAgICAgIGlmICghY2xhenopIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5vdCBzdXBwb3J0IGNvbnN0cnVjdG9yIVwiKTtcbiAgICAgICAgICAgIExvZy53YXJuKFwiTm90IHN1cHBvcnQgY29uc3RydWN0b3IhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIOmYsuatoumHjeWkjeWunuS+i+WMllxuICAgICAgICBpZiAoU2luZ2xldG9uLmNsYXNzS2V5cy5pbmRleE9mKGNsYXp6KSAhPSAtMSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzICsgXCJPbmx5IGluc3RhbmNlIG9uY2UhXCIpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFNpbmdsZXRvbi5jbGFzc0tleXMucHVzaChjbGF6eik7XG4gICAgICAgICAgICBTaW5nbGV0b24uY2xhc3NWYWx1ZXMucHVzaCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiXG4gXG4vKipcbiAqIEBhdXRob3IgU3VuXG4gKiBAdGltZSAyMDE5LTA4LTA5IDIzOjMxXG4gKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcbiAqIEBkZXNjcmlwdGlvbiAg5LqL5Lu25Lu75Yqh5bGe5oCnXG4gKlxuICovXG5leHBvcnQgY2xhc3MgVGltZURlbGF5RGF0YSB7XG5cbiAgICAvKirph43lpI3mrKHmlbAgKi9cbiAgICBwdWJsaWMgcmVwZWF0OiBudW1iZXI7XG4gICAgLyoq6Ze06ZqUICovXG4gICAgcHVibGljIGludGVydmFsOiBudW1iZXI7XG4gICAgLyoq5Y+C5pWwICovXG4gICAgcHVibGljIHBhcmFtOiBhbnk7XG4gICAgLyoq5Zue6LCDICovXG4gICAgcHVibGljIGNhbGxiYWNrOiBUaW1lckNhbGxiYWNrO1xuICAgIC8qKuS9nOeUqOWfnyAqL1xuICAgIHB1YmxpYyB0aGlzT2JqOiBhbnk7XG4gICAgLyoq5piv5ZCm5bey5Yig6ZmkICovXG4gICAgcHVibGljIGRlbGV0ZWQ6IGJvb2xlYW47XG4gICAgLyoq6L+Q6KGM5LqL5Lu2ICovXG4gICAgcHVibGljIGVsYXBzZWQ6IG51bWJlcjtcblxuICAgIHB1YmxpYyBzZXQoaW50ZXJ2YWw6IG51bWJlciwgcmVwZWF0OiBudW1iZXIsIGNhbGxiYWNrOiBUaW1lckNhbGxiYWNrLCB0aGlzT2JqOiBhbnksIHBhcmFtOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnRlcnZhbCA9IGludGVydmFsO1xuICAgICAgICB0aGlzLnJlcGVhdCA9IHJlcGVhdDtcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB0aGlzLnBhcmFtID0gcGFyYW07XG4gICAgICAgIHRoaXMudGhpc09iaiA9IHRoaXNPYmo7XG4gICAgfVxufVxuXG5leHBvcnQgdHlwZSBUaW1lckNhbGxiYWNrID0gKHBhcmFtOiBhbnkpID0+IHZvaWRcblxuIC8qKlxuICogQGF1dGhvciBTdW5cbiAqIEB0aW1lIDIwMTktMDgtMDkgMjM6MjVcbiAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICogQGRlc2NyaXB0aW9uICDml7bpl7TmjqfliLbmoLjlv4PnsbtcbiAqXG4gKi9cbmltcG9ydCB7U2luZ2xldG9ufSBmcm9tIFwiLi9zaW5nbGV0b25cIjtcblxuZXhwb3J0IGNsYXNzIFRpbWVEZWxheSBleHRlbmRzIFNpbmdsZXRvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgTGF5YS50aW1lci5mcmFtZUxvb3AoMC4wMSwgdGhpcywgdGhpcy51cGRhdGUpO1xuICAgIH1cblxuICAgIC8qKuW9k+WJjeS6i+S7tuaJp+ihjOeahOasoeaVsCAqL1xuICAgIHB1YmxpYyByZXBlYXQ6IG51bWJlciA9IDBcbiAgICBwcml2YXRlIGl0ZW1zOiBBcnJheTxUaW1lRGVsYXlEYXRhPiA9IG5ldyBBcnJheTxUaW1lRGVsYXlEYXRhPigpO1xuICAgIHByaXZhdGUgdG9BZGQ6IEFycmF5PFRpbWVEZWxheURhdGE+ID0gbmV3IEFycmF5PFRpbWVEZWxheURhdGE+KCk7XG4gICAgcHJpdmF0ZSB0b1JlbW92ZTogQXJyYXk8VGltZURlbGF5RGF0YT4gPSBuZXcgQXJyYXk8VGltZURlbGF5RGF0YT4oKTtcbiAgICBwcml2YXRlIHBvb2w6IEFycmF5PFRpbWVEZWxheURhdGE+ID0gbmV3IEFycmF5PFRpbWVEZWxheURhdGE+KCk7XG5cbiAgICBcbiAgICBwcml2YXRlIHN0YXRpYyBtSW5zdGFuY2U6IFRpbWVEZWxheSA9IG51bGw7XG4gICAgcHVibGljIHN0YXRpYyBnZXQgJCgpIHtcbiAgICAgICAgaWYgKHRoaXMubUluc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMubUluc3RhbmNlID0gbmV3IFRpbWVEZWxheSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm1JbnN0YW5jZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS7juaxoOWtkOS4reiOt+WPlmRhdGHnsbtcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldEZyb21Qb29sKCk6IFRpbWVEZWxheURhdGEge1xuICAgICAgICBsZXQgdDogVGltZURlbGF5RGF0YTtcbiAgICAgICAgaWYgKHRoaXMucG9vbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0ID0gdGhpcy5wb29sLnBvcCgpXG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgdCA9IG5ldyBUaW1lRGVsYXlEYXRhKCk7XG4gICAgICAgIHJldHVybiB0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGRhdGHnsbvmlL7lm57msaDlrZBcbiAgICAgKiBAcGFyYW0gdCBcbiAgICAgKi9cbiAgICBwcml2YXRlIHJldHVyblRvUG9vbCh0OiBUaW1lRGVsYXlEYXRhKSB7XG4gICAgICAgIHQuc2V0KDAsIDAsIG51bGwsIG51bGwsIG51bGwpXG4gICAgICAgIHQuZWxhcHNlZCA9IDBcbiAgICAgICAgdC5kZWxldGVkID0gZmFsc2VcbiAgICAgICAgdGhpcy5wb29sLnB1c2godClcbiAgICB9XG5cbiAgICBwdWJsaWMgZXhpc3RzKGNhbGxiYWNrOiBUaW1lckNhbGxiYWNrLCB0aGlzT2JqOiBhbnkpIHtcbiAgICAgICAgbGV0IHQgPSB0aGlzLnRvQWRkLmZpbmQoKHZhbHVlOiBUaW1lRGVsYXlEYXRhLCBpbmRleDogbnVtYmVyLCBvYmo6IEFycmF5PFRpbWVEZWxheURhdGE+KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUuY2FsbGJhY2sgPT0gY2FsbGJhY2sgJiYgdmFsdWUudGhpc09iaiA9PSB0aGlzT2JqXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICB0ID0gdGhpcy5pdGVtcy5maW5kKCh2YWx1ZTogVGltZURlbGF5RGF0YSwgaW5kZXg6IG51bWJlciwgb2JqOiBBcnJheTxUaW1lRGVsYXlEYXRhPikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmNhbGxiYWNrID09IGNhbGxiYWNrICYmIHZhbHVlLnRoaXNPYmogPT0gdGhpc09ialxuICAgICAgICB9KVxuICAgICAgICBpZiAodCAhPSBudWxsICYmICF0LmRlbGV0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcHVibGljIGFkZChpbnRlcnZhbDogbnVtYmVyLCByZXBlYXQ6IG51bWJlciwgY2FsbGJhY2s6IFRpbWVyQ2FsbGJhY2ssIHRoaXNPYmo6IGFueSwgY2FsbGJhY2tQYXJhbTogYW55ID0gbnVsbCkge1xuICAgICAgICBsZXQgdDogVGltZURlbGF5RGF0YTtcbiAgICAgICAgdCA9IHRoaXMuaXRlbXMuZmluZCgodmFsdWU6IFRpbWVEZWxheURhdGEsIGluZGV4OiBudW1iZXIsIG9iajogQXJyYXk8VGltZURlbGF5RGF0YT4pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5jYWxsYmFjayA9PSBjYWxsYmFjayAmJiB2YWx1ZS50aGlzT2JqID09IHRoaXNPYmpcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdCA9IHRoaXMudG9BZGQuZmluZCgodmFsdWU6IFRpbWVEZWxheURhdGEsIGluZGV4OiBudW1iZXIsIG9iajogQXJyYXk8VGltZURlbGF5RGF0YT4pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuY2FsbGJhY2sgPT0gY2FsbGJhY2sgJiYgdmFsdWUudGhpc09iaiA9PSB0aGlzT2JqXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdCA9IHRoaXMuZ2V0RnJvbVBvb2woKTtcbiAgICAgICAgICAgIHRoaXMudG9BZGQucHVzaCh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHQuc2V0KGludGVydmFsLCByZXBlYXQsIGNhbGxiYWNrLCB0aGlzT2JqLCBjYWxsYmFja1BhcmFtKTtcbiAgICAgICAgdC5kZWxldGVkID0gZmFsc2U7XG4gICAgICAgIHQuZWxhcHNlZCA9IDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFVwZGF0ZShjYWxsYmFjazogVGltZXJDYWxsYmFjaywgdGhpc09iajogYW55LCBjYWxsYmFja1BhcmFtOiBhbnkgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuYWRkKDAuMDAxLCAwLCBjYWxsYmFjaywgdGhpc09iaiwgY2FsbGJhY2tQYXJhbSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZShjYWxsYmFjazogVGltZXJDYWxsYmFjaywgdGhpc09iajogYW55KSB7XG4gICAgICAgIGxldCBmaW5kaW5kZXggPSAtMVxuICAgICAgICBsZXQgdCA9IHRoaXMudG9BZGQuZmluZCgodmFsdWU6IFRpbWVEZWxheURhdGEsIGluZGV4OiBudW1iZXIsIG9iajogQXJyYXk8VGltZURlbGF5RGF0YT4pID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5jYWxsYmFjayA9PSBjYWxsYmFjayAmJiB2YWx1ZS50aGlzT2JqID09IHRoaXNPYmopIHtcbiAgICAgICAgICAgICAgICBmaW5kaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50b0FkZC5zcGxpY2UoZmluZGluZGV4LCAxKTtcbiAgICAgICAgICAgIHRoaXMucmV0dXJuVG9Qb29sKHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdCA9IHRoaXMuaXRlbXMuZmluZCgodmFsdWU6IFRpbWVEZWxheURhdGEsIGluZGV4OiBudW1iZXIsIG9iajogQXJyYXk8VGltZURlbGF5RGF0YT4pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5jYWxsYmFjayA9PSBjYWxsYmFjayAmJiB2YWx1ZS50aGlzT2JqID09IHRoaXNPYmo7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodCAhPSBudWxsKVxuICAgICAgICAgICAgdC5kZWxldGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxhc3RUaW1lOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgZGVsdGFUaW1lOiBudW1iZXIgPSAwO1xuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSBMYXlhLnRpbWVyLmN1cnJUaW1lcjtcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHRoaXMuZGVsdGFUaW1lID0gKExheWEudGltZXIuY3VyclRpbWVyIC0gdGhpcy5sYXN0VGltZSkgLyAxMDAwO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gTGF5YS50aW1lci5jdXJyVGltZXI7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgdCA9IHRoaXMuaXRlbXNbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKHQuZGVsZXRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9SZW1vdmUucHVzaCh0KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdC5lbGFwc2VkICs9IHRoaXMuZGVsdGFUaW1lO1xuICAgICAgICAgICAgaWYgKHQuZWxhcHNlZCA8IHQuaW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdC5lbGFwc2VkID0gMDtcblxuICAgICAgICAgICAgaWYgKHQucmVwZWF0ID4gMCkge1xuICAgICAgICAgICAgICAgIHQucmVwZWF0LS07XG4gICAgICAgICAgICAgICAgaWYgKHQucmVwZWF0ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdC5kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b1JlbW92ZS5wdXNoKHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVwZWF0ID0gdC5yZXBlYXQ7XG4gICAgICAgICAgICBpZiAodC5jYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdC5jYWxsYmFjay5jYWxsKHQudGhpc09iaiwgdC5wYXJhbSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdC5kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGxlbiA9IHRoaXMudG9SZW1vdmUubGVuZ3RoO1xuICAgICAgICB3aGlsZSAobGVuKSB7XG4gICAgICAgICAgICBsZXQgdCA9IHRoaXMudG9SZW1vdmUucG9wKCk7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLml0ZW1zLmluZGV4T2YodCk7XG4gICAgICAgICAgICBpZiAodC5kZWxldGVkICYmIGluZGV4ICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMucmV0dXJuVG9Qb29sKHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGVuLS07XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gdGhpcy50b0FkZC5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChsZW4pIHtcbiAgICAgICAgICAgIGxldCB0ID0gdGhpcy50b0FkZC5wb3AoKTtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaCh0KTtcbiAgICAgICAgICAgIGxlbi0tO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuIiwiaW1wb3J0IHsgRXZlbnROb2RlIH0gZnJvbSAnLi4vZXZlbnQvZXZlbnQtbm9kZSc7XG5pbXBvcnQgeyBFdmVudERhdGEgfSBmcm9tICcuLi9ldmVudC9ldmVudC1kYXRhJztcbmltcG9ydCB7IERhdGFCYXNlIH0gZnJvbSAnLi9kYXRhLWJhc2UnO1xuaW1wb3J0IHsgSU1hbmFnZXIgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2UvaS1tYW5hZ2VyJztcblxuXG4vKipcbiAqIEBhdXRob3IgU3VuXG4gKiBAdGltZSAyMDE5LTA4LTA5IDE1OjUxXG4gKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcbiAqIEBkZXNjcmlwdGlvbiDmlbDmja7nrqHnkIbnsbtcbiAqL1xuZXhwb3J0IGNsYXNzIERhdGFNYW5hZ2VyIGV4dGVuZHMgRXZlbnROb2RlIGltcGxlbWVudHMgSU1hbmFnZXIge1xuXG5cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBEYXRhTWFuYWdlciA9IG51bGw7XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldCAkKCk6RGF0YU1hbmFnZXIge1xuICAgICAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHRoaXMuaW5zdGFuY2UgPSBuZXcgRGF0YU1hbmFnZXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGRhdGFzOiBNYXA8c3RyaW5nLCBEYXRhQmFzZT4gPSBuZXcgTWFwPHN0cmluZywgRGF0YUJhc2U+KCk7XG5cbiAgICBzZXR1cCgpOiB2b2lkIHtcbiAgICB9XG5cbiAgICB1cGRhdGUoKTogdm9pZCB7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kYXRhcy5jbGVhcigpO1xuICAgIH1cbiAgXG5cbiAgICBwdWJsaWMgcmVnaXN0ZXIoZGF0YTogRGF0YUJhc2UpOiBEYXRhTWFuYWdlciB7XG4gICAgICAgIHRoaXMuZGF0YXMuc2V0KGRhdGEuY21kLCBkYXRhKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldChjbWQ6IHN0cmluZyk6IERhdGFCYXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YXMuZ2V0KGNtZCk7XG4gICAgfVxufVxuXG5cblxuIiwiXG5cbiAvKipcbiAqIEBhdXRob3IgU3VuXG4gKiBAdGltZSAyMDE5LTA4LTEyIDE3OjEzXG4gKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcbiAqIEBkZXNjcmlwdGlvbiDkuovku7bmlbDmja7lrprkuYnnsbtcbiAqL1xuZXhwb3J0IGNsYXNzIEV2ZW50RGF0YSB7XG5cbiAgICBjb25zdHJ1Y3RvcihjbWQ6IHN0cmluZywgb2JqOiBhbnkgPSBudWxsLCBpc1N0b3A6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmNtZCA9IGNtZDtcbiAgICAgICAgdGhpcy5kYXRhID0gb2JqO1xuICAgICAgICB0aGlzLmlzU3RvcCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbWQ6IHN0cmluZztcbiAgICBwdWJsaWMgZGF0YTogYW55O1xuICAgIHB1YmxpYyBpc1N0b3AgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIOW/q+mAn+WIm+W7uuS6i+S7tuaVsOaNrlxuICAgICAqIEBwYXJhbSBjbWRcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBpc1N0b3BcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShjbWQ6IHN0cmluZywgZGF0YTogYW55ID0gbnVsbCwgaXNTdG9wOiBib29sZWFuID0gZmFsc2UpOiBFdmVudERhdGEge1xuICAgICAgICByZXR1cm4gbmV3IEV2ZW50RGF0YShjbWQsIGRhdGEsIGlzU3RvcCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuaXNTdG9wID0gdHJ1ZVxuICAgIH1cbn1cblxuXG4gLyoqXG4gKiBAYXV0aG9yIFN1blxuICogQHRpbWUgMjAxOS0wMS0yMCAwMDoyNFxuICogQHByb2plY3QgU0ZyYW1ld29ya19MYXlhQWlyXG4gKiBAZGVzY3JpcHRpb24g5LqL5Lu25Zue6LCD5Ye95pWw5a6a5LmJXG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudEZ1bmMge1xuXG4gICAgcHJpdmF0ZSBtX3RoaXM6IGFueTtcbiAgICBwcml2YXRlIG1fY2I6IEZ1bmN0aW9uO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHRoaXNPYmo6IGFueSwgY2FsbEJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMubV90aGlzID0gdGhpc09iajtcbiAgICAgICAgdGhpcy5tX2NiID0gY2FsbEJhY2s7XG4gICAgfVxuXG4gICAgcHVibGljIGludm9rZSguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICB0aGlzLm1fY2IuY2FsbCh0aGlzLm1fdGhpcywgLi4uYXJncyk7XG4gICAgfVxufVxuXG5cbiIsImltcG9ydCB7IEV2ZW50Tm9kZSwgRXZlbnRDb250ZXh0LCBFdmVudENhbGxiYWNrTGlzdGVuZXIgfSBmcm9tICcuL2V2ZW50LW5vZGUnO1xuaW1wb3J0IHsgRXZlbnREYXRhIH0gZnJvbSAnLi9ldmVudC1kYXRhJztcbmltcG9ydCB7IElNYW5hZ2VyIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlL2ktbWFuYWdlcic7XG5cblxuIC8qKlxuICogQGF1dGhvciBTdW5cbiAqIEB0aW1lIDIwMTktMDEtMTggMTY6MjBcbiAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICogQGRlc2NyaXB0aW9uIOS6i+S7tueuoeeQhuWZqFxuICovXG5leHBvcnQgY2xhc3MgRXZlbnRNYW5hZ2VyIGV4dGVuZHMgRXZlbnROb2RlIGltcGxlbWVudHMgSU1hbmFnZXIge1xuXG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogRXZlbnRNYW5hZ2VyID0gbnVsbDtcbiAgICBwdWJsaWMgc3RhdGljIGdldCAkKCk6RXZlbnRNYW5hZ2VyIHtcbiAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlKSB0aGlzLmluc3RhbmNlID0gbmV3IEV2ZW50TWFuYWdlcigpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICB9XG4gXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICBcblxuICAgIHNldHVwKCk6IHZvaWQge1xuICAgICAgICBFdmVudENvbnRleHQuZXZlbnROb2Rlcy5jbGVhcigpO1xuICAgIH1cblxuICAgIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICB9XG5cbiAgICBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBFdmVudENvbnRleHQuZXZlbnROb2Rlcy5jbGVhcigpO1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiDnp7vpmaTkuIDkuKrmtojmga/nm5HlkKzoioLngrlcbiAgICAgKiBAcGFyYW0gbm9kZVxuICAgICAqL1xuICAgIHJlbW92ZShub2RlOiBFdmVudE5vZGUpOiB2b2lkIHtcbiAgICAgICAgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyQWxsKCk7XG4gICAgICAgIEV2ZW50Q29udGV4dC5ldmVudE5vZGVzLmRlbGV0ZShub2RlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDnu5nmiYDmnInmnKzlnLDmtojmga/oioLngrnpgJrnn6Xmtojmga9cbiAgICAgKiBAcGFyYW0gZWRcbiAgICAgKi9cbiAgICBkaXNwYXRjaEV2ZW50TG9jYWxBbGwoZWQ6IEV2ZW50RGF0YSkge1xuICAgICAgICBFdmVudENvbnRleHQuZXZlbnROb2Rlcy5mb3JFYWNoKChlbjogRXZlbnROb2RlKSA9PiB7XG4gICAgICAgICAgICBlbi5kaXNwYXRjaEV2ZW50KGVkKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDnu5nmiYDmnInmnKzlnLDmtojmga/oioLngrnpgJrnn6Xmtojmga9cbiAgICAgKiBAcGFyYW0gY21kXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKi9cbiAgICBkaXNwYXRjaEV2ZW50TG9jYWxBbGxCeUNtZChjbWQ6IHN0cmluZyB8IG51bWJlciwgZGF0YTogYW55ID0gbnVsbCkge1xuICAgICAgICBFdmVudENvbnRleHQuZXZlbnROb2Rlcy5mb3JFYWNoKChlbjogRXZlbnROb2RlKSA9PiB7XG4gICAgICAgICAgICBlbi5kaXNwYXRjaEV2ZW50QnlDbWQoY21kLCBkYXRhKTtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIOa3u+WKoOS4gOS4qua2iOaBr+ebkeWQrOWZqFxuICAgICAqIEBwYXJhbSB0eXBlIOa2iOaBr+exu+Wei1xuICAgICAqIEBwYXJhbSBjYWxsQmFjayDlm57osIPlh73mlbBcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IOS9nOeUqOWvueixoVxuICAgICAqIEBwYXJhbSBwcmlvcml0eSDmtojmga/nmoTkvJjlhYjnuqdcbiAgICAgKiBAcGFyYW0gb25jZSDmmK/lkKblj6rnm5HlkKzkuIDmrKFcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkTGlzdGVuZXIodHlwZTogc3RyaW5nIHwgbnVtYmVyLCBjYWxsQmFjazogRXZlbnRDYWxsYmFja0xpc3RlbmVyLCB0YXJnZXQ6IGFueSwgcHJpb3JpdHk6IG51bWJlciA9IDAsIG9uY2U6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBFdmVudE5vZGUuYWRkR2xvYmFsTGlzdGVuZXIodHlwZSxjYWxsQmFjayx0YXJnZXQscHJpb3JpdHksb25jZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog56e76Zmk5LiA5Liq5raI5oGv55uR5ZCs5ZmoXG4gICAgICogQHBhcmFtIHR5cGUg5raI5oGvaWRcbiAgICAgKiBAcGFyYW0gY2FsbEJhY2sg5Zue6LCD5Ye95pWwXG4gICAgICogQHBhcmFtIHRhcmdldCDkvZznlKjnmoTlr7nosaFcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlTGlzdGVuZXIodHlwZTogc3RyaW5nIHwgbnVtYmVyLCBjYWxsQmFjazogRXZlbnRDYWxsYmFja0xpc3RlbmVyLCB0YXJnZXQ6IGFueSkge1xuICAgICAgICBFdmVudE5vZGUucmVtb3ZlR2xvYmFsTGlzdGVuZXIodHlwZSxjYWxsQmFjayx0YXJnZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOaYr+WQpuWtmOWcqOi/meS4quebkeWQrOa2iOaBr1xuICAgICAqIEBwYXJhbSB0eXBlIOa2iOaBr+exu+Wei1xuICAgICAqIEBwYXJhbSBjYWxsQmFjayDlm57osIPnsbvlnotcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IOWbnuiwg+WvueixoVxuICAgICAqL1xuICAgIHB1YmxpYyBoYXNMaXN0ZW5lcih0eXBlOiBzdHJpbmcgfCBudW1iZXIsIGNhbGxCYWNrOiBFdmVudENhbGxiYWNrTGlzdGVuZXIsIHRhcmdldDogYW55KSB7XG4gICAgICAgIEV2ZW50Tm9kZS5oYXNHbG9iYWxMaXN0ZW5lcih0eXBlLGNhbGxCYWNrLHRhcmdldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5rS+5Y+R5raI5oGvXG4gICAgICogQHBhcmFtIGNtZCDmtojmga9pZFxuICAgICAqIEBwYXJhbSBkYXRhIOa2iOaBr+WGheWuuVxuICAgICAqL1xuICAgIHB1YmxpYyBkaXNwYXRjaEV2ZW50QnlDbWQoY21kOiBzdHJpbmcgfCBudW1iZXIsIGRhdGE6IGFueSA9IG51bGwpIHtcbiAgICAgICAgRXZlbnROb2RlLmRpc3BhdGNoR2xvYmFsQnlDbWQoY21kLGRhdGEpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgRXZlbnREYXRhIH0gZnJvbSAnLi9ldmVudC1kYXRhJztcbmltcG9ydCB7IExvZyB9IGZyb20gJy4uLy4uL2NvcmUvbG9nJztcbmltcG9ydCB7IFNpbmdsZXRvbiB9IGZyb20gJy4uLy4uL2NvcmUvc2luZ2xldG9uJztcblxuXG4gLyoqXG4gKiBAYXV0aG9yIFN1blxuICogQHRpbWUgMjAxOS0wMS0xOCAxNjoyMFxuICogQHByb2plY3QgU0ZyYW1ld29ya19MYXlhQWlyXG4gKiBAZGVzY3JpcHRpb24g5omA5pyJ6ZyA6KaB55uR5o6n5LqL5Lu26IqC54K555qE5Z+657G7XG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudE5vZGUgZXh0ZW5kcyBTaW5nbGV0b24ge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIEV2ZW50Q29udGV4dC5ldmVudE5vZGVzLnNldCh0aGlzLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vID09PT09PT09PT09PT09ICBMb2NhbCBFdmVudCBTZWN0aW9uID09PT09PT09PT09PT09XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHByaXZhdGUgc3RhdGljIG1fZ2xvYmFsRXZlbnREYXRhOiBBcnJheTxFdmVudERhdGE+ID0gbmV3IEFycmF5PEV2ZW50RGF0YT4oKTtcbiAgICBwcml2YXRlIHN0YXRpYyBtX2dsb2JhbEV2ZW50RGljdDogRXZlbnRMaXN0ZW5lckNsYXNzRGljdCA9IHt9O1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlR2xvYmFsRGF0YShjbWQsIGRhdGEpOiBFdmVudERhdGEge1xuICAgICAgICBsZXQgZWQ6IEV2ZW50RGF0YTtcbiAgICAgICAgaWYgKEV2ZW50Tm9kZS5tX2dsb2JhbEV2ZW50RGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlZCA9IEV2ZW50Tm9kZS5tX2dsb2JhbEV2ZW50RGF0YS5wb3AoKTtcbiAgICAgICAgICAgIGVkLmNtZCA9IGNtZDtcbiAgICAgICAgICAgIGVkLmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgZWQuaXNTdG9wID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlZCA9IG5ldyBFdmVudERhdGEoY21kLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmV0dXJuR2xvYmFsRXZlbnREYXRhKGVkOiBFdmVudERhdGEpIHtcbiAgICAgICAgZWQuZGF0YSA9IG51bGw7XG4gICAgICAgIGVkLmNtZCA9IG51bGw7XG4gICAgICAgIGVkLmlzU3RvcCA9IGZhbHNlO1xuICAgICAgICBFdmVudE5vZGUubV9nbG9iYWxFdmVudERhdGEucHVzaChlZClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmt7vliqDkuIDkuKrmtojmga/nm5HlkKzlmahcbiAgICAgKiBAcGFyYW0gdHlwZSDmtojmga/nsbvlnotcbiAgICAgKiBAcGFyYW0gY2FsbEJhY2sg5Zue6LCD5Ye95pWwXG4gICAgICogQHBhcmFtIHRhcmdldCDkvZznlKjlr7nosaFcbiAgICAgKiBAcGFyYW0gcHJpb3JpdHkg5raI5oGv55qE5LyY5YWI57qnXG4gICAgICogQHBhcmFtIG9uY2Ug5piv5ZCm5Y+q55uR5ZCs5LiA5qyhXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGRHbG9iYWxMaXN0ZW5lcih0eXBlOiBzdHJpbmcgfCBudW1iZXIsIGNhbGxCYWNrOiBFdmVudENhbGxiYWNrTGlzdGVuZXIsIHRhcmdldDogYW55LCBwcmlvcml0eTogbnVtYmVyID0gMCwgb25jZTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIHR5cGUgPSB0eXBlLnRvU3RyaW5nKCk7XG4gICAgICAgIGxldCBpbmZvOiBFdmVudExpc3RlbmVySW5mb0RhdGEgPSB7XG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgY2FsbEJhY2s6IGNhbGxCYWNrLFxuICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICBwcmlvcml0eTogcHJpb3JpdHksXG4gICAgICAgICAgICBvbmNlOiBvbmNlXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGFycmF5ID0gRXZlbnROb2RlLm1fZ2xvYmFsRXZlbnREaWN0W3R5cGVdO1xuICAgICAgICBsZXQgaGFzID0gZmFsc2U7XG4gICAgICAgIGxldCBwb3MgPSAwO1xuICAgICAgICBpZiAoYXJyYXkgIT0gbnVsbCkge1xuICAgICAgICAgICAgYXJyYXkuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC50YXJnZXQgPT0gdGFyZ2V0ICYmIGVsZW1lbnQuY2FsbEJhY2sgPT0gY2FsbEJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQucHJpb3JpdHkgPiBpbmZvLnByaW9yaXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJyYXkgPSBuZXcgQXJyYXk8RXZlbnRMaXN0ZW5lckluZm9EYXRhPigpO1xuICAgICAgICAgICAgRXZlbnROb2RlLm1fZ2xvYmFsRXZlbnREaWN0W3R5cGVdID0gYXJyYXk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhcykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihcIumHjeWkjeazqOWGjOa2iOaBr++8mnR5cGU9XCIgKyB0eXBlKTtcbiAgICAgICAgICAgIExvZy5lcnJvcihcIumHjeWkjeazqOWGjOa2iOaBr++8mnR5cGU9XCIgKyB0eXBlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJyYXkuc3BsaWNlKHBvcywgMCwgaW5mbyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDnp7vpmaTkuIDkuKrmtojmga/nm5HlkKzlmahcbiAgICAgKiBAcGFyYW0gdHlwZSDmtojmga9pZFxuICAgICAqIEBwYXJhbSBjYWxsQmFjayDlm57osIPlh73mlbBcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IOS9nOeUqOeahOWvueixoVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlR2xvYmFsTGlzdGVuZXIodHlwZTogc3RyaW5nIHwgbnVtYmVyLCBjYWxsQmFjazogRXZlbnRDYWxsYmFja0xpc3RlbmVyLCB0YXJnZXQ6IGFueSkge1xuICAgICAgICB0eXBlID0gdHlwZS50b1N0cmluZygpO1xuICAgICAgICBsZXQgaW5mbzogRXZlbnRMaXN0ZW5lckluZm9EYXRhID0gbnVsbDtcbiAgICAgICAgbGV0IGFycmF5ID0gRXZlbnROb2RlLm1fZ2xvYmFsRXZlbnREaWN0W3R5cGVdO1xuICAgICAgICBpZiAoYXJyYXkgIT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IGluZm9JbmRleCA9IC0xO1xuICAgICAgICAgICAgYXJyYXkuZXZlcnkoKHZhbHVlOiBFdmVudExpc3RlbmVySW5mb0RhdGEsIGluZGV4OiBudW1iZXIsIGFycmF5OiBFdmVudExpc3RlbmVySW5mb0RhdGFbXSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS50YXJnZXQgPT0gdGFyZ2V0ICYmIHZhbHVlLmNhbGxCYWNrID09IGNhbGxCYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZm9JbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICBpbmZvID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGluZm9JbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmZvSW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5piv5ZCm5a2Y5Zyo6L+Z5Liq55uR5ZCs5raI5oGvXG4gICAgICogQHBhcmFtIHR5cGUg5raI5oGv57G75Z6LXG4gICAgICogQHBhcmFtIGNhbGxCYWNrIOWbnuiwg+exu+Wei1xuICAgICAqIEBwYXJhbSB0YXJnZXQg5Zue6LCD5a+56LGhXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBoYXNHbG9iYWxMaXN0ZW5lcih0eXBlOiBzdHJpbmcgfCBudW1iZXIsIGNhbGxCYWNrOiBFdmVudENhbGxiYWNrTGlzdGVuZXIsIHRhcmdldDogYW55KSB7XG4gICAgICAgIGxldCBmbGFnID0gZmFsc2U7XG4gICAgICAgIGxldCBhcnJheSA9IEV2ZW50Tm9kZS5tX2dsb2JhbEV2ZW50RGljdFt0eXBlXTtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBsZXQgaW5kZXggPSBhcnJheS5maW5kSW5kZXgoKG9iaiwgaW5kZXgsIGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmoudGFyZ2V0ID09IHRhcmdldCAmJiBvYmouY2FsbEJhY2sgPT0gY2FsbEJhY2s7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZsYWcgPSBpbmRleCAhPSAtMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmxhZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmtL7lj5Hmtojmga9cbiAgICAgKiBAcGFyYW0gZWQg5rS+5Y+R55qE5raI5oGv5YaF5a65XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBkaXNwYXRjaEdsb2JhbChlZDogRXZlbnREYXRhKSB7XG4gICAgICAgIEV2ZW50Tm9kZS5fZGlzcGF0Y2hHbG9iYWwoZWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOa0vuWPkea2iOaBr1xuICAgICAqIEBwYXJhbSBjbWQg5raI5oGvaWRcbiAgICAgKiBAcGFyYW0gZGF0YSDmtojmga/lhoXlrrlcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGRpc3BhdGNoR2xvYmFsQnlDbWQoY21kOiBzdHJpbmcgfCBudW1iZXIsIGRhdGE6IGFueSA9IG51bGwpIHtcbiAgICAgICAgbGV0IGVkID0gRXZlbnROb2RlLmNyZWF0ZUdsb2JhbERhdGEoY21kLCBkYXRhKTtcbiAgICAgICAgRXZlbnROb2RlLl9kaXNwYXRjaEdsb2JhbChlZCk7XG4gICAgICAgIGlmIChlZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBFdmVudE5vZGUucmV0dXJuR2xvYmFsRXZlbnREYXRhKGVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIF9kaXNwYXRjaEdsb2JhbChlZDogRXZlbnREYXRhKSB7XG4gICAgICAgIGxldCBhcnJheSA9IEV2ZW50Tm9kZS5tX2dsb2JhbEV2ZW50RGljdFtlZC5jbWRdO1xuICAgICAgICBpZiAoYXJyYXkgIT0gbnVsbCkge1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGluZm8gPSBhcnJheVtpXTtcbiAgICAgICAgICAgICAgICBpZiAoaW5mby5jYWxsQmFjayAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZm8uY2FsbEJhY2suY2FsbChpbmZvLnRhcmdldCwgZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5mby5vbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFycmF5LnNwbGljZShpLS0sIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZWQuaXNTdG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gPT09PT09PT09PT09PT0gIExvY2FsIEV2ZW50IFNlY3Rpb24gPT09PT09PT09PT09PT1cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgcHJpdmF0ZSBtX2V2ZW50RGF0YTogQXJyYXk8RXZlbnREYXRhPiA9IG5ldyBBcnJheTxFdmVudERhdGE+KCk7XG4gICAgcHJpdmF0ZSBtX2V2ZW50RGljdDogRXZlbnRMaXN0ZW5lckNsYXNzRGljdCA9IHt9O1xuXG4gICAgcHJpdmF0ZSBjcmVhdGVFdmVudERhdGEoY21kLCBkYXRhKTogRXZlbnREYXRhIHtcbiAgICAgICAgbGV0IGVkOiBFdmVudERhdGE7XG4gICAgICAgIGlmICh0aGlzLm1fZXZlbnREYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVkID0gdGhpcy5tX2V2ZW50RGF0YS5wb3AoKTtcbiAgICAgICAgICAgIGVkLmNtZCA9IGNtZDtcbiAgICAgICAgICAgIGVkLmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgZWQuaXNTdG9wID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlZCA9IG5ldyBFdmVudERhdGEoY21kLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXR1cm5FdmVudERhdGEoZWQ6IEV2ZW50RGF0YSkge1xuICAgICAgICBlZC5kYXRhID0gbnVsbDtcbiAgICAgICAgZWQuY21kID0gbnVsbDtcbiAgICAgICAgZWQuaXNTdG9wID0gZmFsc2U7XG4gICAgICAgIHRoaXMubV9ldmVudERhdGEucHVzaChlZClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmt7vliqDkuIDkuKrmtojmga/nm5HlkKzlmahcbiAgICAgKiBAcGFyYW0gdHlwZSDmtojmga/nsbvlnotcbiAgICAgKiBAcGFyYW0gY2FsbEJhY2sg5Zue6LCD5Ye95pWwXG4gICAgICogQHBhcmFtIHRhcmdldCDkvZznlKjlr7nosaFcbiAgICAgKiBAcGFyYW0gcHJpb3JpdHkg5raI5oGv55qE5LyY5YWI57qnXG4gICAgICogQHBhcmFtIG9uY2Ug5piv5ZCm5Y+q55uR5ZCs5LiA5qyhXG4gICAgICovXG4gICAgcHVibGljIGFkZEV2ZW50TGlzdGVuZXIodHlwZTogc3RyaW5nIHwgbnVtYmVyLCBjYWxsQmFjazogRXZlbnRDYWxsYmFja0xpc3RlbmVyLCB0YXJnZXQ6IGFueSwgcHJpb3JpdHk6IG51bWJlciA9IDAsIG9uY2U6IGJvb2xlYW4gPSBmYWxzZSk6RXZlbnRMaXN0ZW5lckluZm9EYXRhICAge1xuICAgICAgICB0eXBlID0gdHlwZS50b1N0cmluZygpO1xuICAgICAgICBsZXQgaW5mbzogRXZlbnRMaXN0ZW5lckluZm9EYXRhID0ge1xuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIGNhbGxCYWNrOiBjYWxsQmFjayxcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgcHJpb3JpdHk6IHByaW9yaXR5LFxuICAgICAgICAgICAgb25jZTogb25jZVxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBhcnJheSA9IHRoaXMubV9ldmVudERpY3RbdHlwZV07XG4gICAgICAgIGxldCBoYXMgPSBmYWxzZTtcbiAgICAgICAgbGV0IHBvcyA9IDA7XG4gICAgICAgIGlmIChhcnJheSAhPSBudWxsKSB7XG4gICAgICAgICAgICBhcnJheS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnRhcmdldCA9PSB0YXJnZXQgJiYgZWxlbWVudC5jYWxsQmFjayA9PSBjYWxsQmFjaykge1xuICAgICAgICAgICAgICAgICAgICBoYXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5wcmlvcml0eSA+IGluZm8ucHJpb3JpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcnJheSA9IG5ldyBBcnJheTxFdmVudExpc3RlbmVySW5mb0RhdGE+KCk7XG4gICAgICAgICAgICB0aGlzLm1fZXZlbnREaWN0W3R5cGVdID0gYXJyYXk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhcykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihcIumHjeWkjeazqOWGjOa2iOaBr++8mnR5cGU9XCIgKyB0eXBlKTtcbiAgICAgICAgICAgIExvZy5lcnJvcihcIumHjeWkjeazqOWGjOa2iOaBr++8mnR5cGU9XCIgKyB0eXBlKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcnJheS5zcGxpY2UocG9zLCAwLCBpbmZvKTtcbiAgICAgICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog56e76Zmk5LiA5Liq5raI5oGv55uR5ZCs5ZmoXG4gICAgICogQHBhcmFtIHR5cGUg5raI5oGvaWRcbiAgICAgKiBAcGFyYW0gY2FsbEJhY2sg5Zue6LCD5Ye95pWwXG4gICAgICogQHBhcmFtIHRhcmdldCDkvZznlKjnmoTlr7nosaFcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcgfCBudW1iZXIsIGNhbGxCYWNrOiBFdmVudENhbGxiYWNrTGlzdGVuZXIsIHRhcmdldDogYW55KSB7XG4gICAgICAgIHR5cGUgPSB0eXBlLnRvU3RyaW5nKCk7XG4gICAgICAgIGxldCBpbmZvOiBFdmVudExpc3RlbmVySW5mb0RhdGEgPSBudWxsO1xuICAgICAgICBsZXQgYXJyYXkgPSB0aGlzLm1fZXZlbnREaWN0W3R5cGVdO1xuICAgICAgICBpZiAoYXJyYXkgIT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IGluZm9JbmRleCA9IC0xO1xuICAgICAgICAgICAgYXJyYXkuZXZlcnkoKHZhbHVlOiBFdmVudExpc3RlbmVySW5mb0RhdGEsIGluZGV4OiBudW1iZXIsIGFycmF5OiBFdmVudExpc3RlbmVySW5mb0RhdGFbXSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS50YXJnZXQgPT0gdGFyZ2V0ICYmIHZhbHVlLmNhbGxCYWNrID09IGNhbGxCYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZm9JbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICBpbmZvID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGluZm9JbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmZvSW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZUV2ZW50TGlzdGVuZXJBbGwoKSB7XG4gICAgICAgIHRoaXMubV9ldmVudERhdGEgPSBuZXcgQXJyYXk8RXZlbnREYXRhPigpO1xuICAgICAgICB0aGlzLm1fZXZlbnREaWN0ID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5piv5ZCm5a2Y5Zyo6L+Z5Liq55uR5ZCs5raI5oGvXG4gICAgICogQHBhcmFtIHR5cGUg5raI5oGv57G75Z6LXG4gICAgICogQHBhcmFtIGNhbGxCYWNrIOWbnuiwg+exu+Wei1xuICAgICAqIEBwYXJhbSB0YXJnZXQg5Zue6LCD5a+56LGhXG4gICAgICovXG4gICAgcHVibGljIGhhc0V2ZW50TGlzdGVuZXIodHlwZTogc3RyaW5nIHwgbnVtYmVyLCBjYWxsQmFjazogRXZlbnRDYWxsYmFja0xpc3RlbmVyLCB0YXJnZXQ6IGFueSkge1xuICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xuICAgICAgICBsZXQgYXJyYXkgPSB0aGlzLm1fZXZlbnREaWN0W3R5cGVdO1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGxldCBpbmRleCA9IGFycmF5LmZpbmRJbmRleCgob2JqLCBpbmRleCwgYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iai50YXJnZXQgPT0gdGFyZ2V0ICYmIG9iai5jYWxsQmFjayA9PSBjYWxsQmFjaztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZmxhZyA9IGluZGV4ICE9IC0xO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmbGFnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOa0vuWPkea2iOaBr1xuICAgICAqIEBwYXJhbSBlZCDmtL7lj5HnmoTmtojmga/lhoXlrrlcbiAgICAgKi9cbiAgICBwdWJsaWMgZGlzcGF0Y2hFdmVudChlZDogRXZlbnREYXRhKSB7XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoZWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOa0vuWPkea2iOaBr1xuICAgICAqIEBwYXJhbSBjbWQg5raI5oGvaWRcbiAgICAgKiBAcGFyYW0gZGF0YSDmtojmga/lhoXlrrlcbiAgICAgKi9cbiAgICBwdWJsaWMgZGlzcGF0Y2hFdmVudEJ5Q21kKGNtZDogc3RyaW5nIHwgbnVtYmVyLCBkYXRhOiBhbnkgPSBudWxsKSB7XG4gICAgICAgIGxldCBlZCA9IHRoaXMuY3JlYXRlRXZlbnREYXRhKGNtZCwgZGF0YSk7XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoZWQpO1xuICAgICAgICBpZiAoZWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5yZXR1cm5FdmVudERhdGEoZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZGlzcGF0Y2hFdmVudChlZDogRXZlbnREYXRhKSB7XG4gICAgICAgIGxldCBhcnJheSA9IHRoaXMubV9ldmVudERpY3RbZWQuY21kXTtcbiAgICAgICAgaWYgKGFycmF5ICE9IG51bGwpIHtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBpbmZvID0gYXJyYXlbaV07XG4gICAgICAgICAgICAgICAgaWYgKGluZm8uY2FsbEJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpbmZvLmNhbGxCYWNrLmNhbGwoaW5mby50YXJnZXQsIGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGluZm8ub25jZSkge1xuICAgICAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UoaS0tLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVkLmlzU3RvcCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuXG5leHBvcnQgdHlwZSBFdmVudExpc3RlbmVySW5mb0RhdGEgPVxuICAgIHtcbiAgICAgICAgdHlwZTogc3RyaW5nLFxuICAgICAgICBjYWxsQmFjazogRXZlbnRDYWxsYmFja0xpc3RlbmVyLFxuICAgICAgICB0YXJnZXQ6IGFueSxcbiAgICAgICAgcHJpb3JpdHk6IG51bWJlcixcbiAgICAgICAgb25jZTogYm9vbGVhblxuICAgIH1cblxuZXhwb3J0IHR5cGUgRXZlbnRMaXN0ZW5lckNsYXNzRGljdCA9IHtcbiAgICBba2V5OiBzdHJpbmddOiBBcnJheTxFdmVudExpc3RlbmVySW5mb0RhdGE+XG59XG5cblxuZXhwb3J0IHR5cGUgRXZlbnRDYWxsYmFja0xpc3RlbmVyID0gKChlZDogRXZlbnREYXRhKSA9PiB2b2lkKTtcblxuZXhwb3J0IGNsYXNzIEV2ZW50Q29udGV4dCB7XG5cbiAgICBwdWJsaWMgc3RhdGljIGV2ZW50Tm9kZXM6IE1hcDxFdmVudE5vZGUsIEV2ZW50Tm9kZT4gPSBuZXcgTWFwPEV2ZW50Tm9kZSwgRXZlbnROb2RlPigpO1xuXG59XG5cbiIsImltcG9ydCBIYW5kbGVyID0gTGF5YS5IYW5kbGVyO1xuaW1wb3J0IHtVdGlsU3RyaW5nfSBmcm9tIFwiLi4vLi4vdXRpbC9zdHJpbmdcIjtcbmltcG9ydCB7UmVzTWFuYWdlcn0gZnJvbSBcIi4uL3Jlcy9yZXMtbWFuYWdlclwiO1xuaW1wb3J0IHsgU2luZ2xldG9uIH0gZnJvbSAnLi4vLi4vY29yZS9zaW5nbGV0b24nO1xuaW1wb3J0IHsgSU1hbmFnZXIgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2UvaS1tYW5hZ2VyJztcbmltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tICcuLi8uLi9zdHJ1Y3R1cmUvZGljdGlvbmFyeSc7XG5pbXBvcnQgeyBKc29uVGVtcGxhdGUgfSBmcm9tICcuL2pzb24tdGVtcGxhdGUnO1xuaW1wb3J0IHsgQ29uZmlnRGF0YSB9IGZyb20gJy4uLy4uL3NldHRpbmcvY29uZmlnJztcbmltcG9ydCB7IExvZyB9IGZyb20gJy4uLy4uL2NvcmUvbG9nJztcblxuICAvKipcbiAqIEBhdXRob3IgU3VuXG4gKiBAdGltZSAyMDE5LTA4LTEyIDE0OjQwXG4gKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcbiAqIEBkZXNjcmlwdGlvbiDphY3nva7ooajnrqHnkIZcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBKc29uTWFuYWdlciBleHRlbmRzIFNpbmdsZXRvbiBpbXBsZW1lbnRzIElNYW5hZ2VyIHtcblxuICAgIC8qKlxuICAgICAqIOWtmOaUvuaJgOaciemFjee9ruihqOaooeadv1xuICAgICAqL1xuICAgIHByaXZhdGUgbV9EaWNUZW1wbGF0ZTogRGljdGlvbmFyeTxKc29uVGVtcGxhdGU+ID0gbnVsbDtcbiAgICAvKipcbiAgICAgKiDlrZjmlL7miYDmnInop6PmnpDov4fnmoTphY3nva7ooahcbiAgICAgKi9cbiAgICBwcml2YXRlIG1fRGljRGF0YTogRGljdGlvbmFyeTxhbnk+ID0gbnVsbDtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEpzb25NYW5hZ2VyID0gbnVsbDtcbiAgICBwdWJsaWMgc3RhdGljIGdldCAkKCk6IEpzb25NYW5hZ2VyIHtcbiAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlKSB0aGlzLmluc3RhbmNlID0gbmV3IEpzb25NYW5hZ2VyKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOeuoeeQhuWZqOe7n+S4gOiuvue9ruaWueazlVxuICAgICAqL1xuICAgIHB1YmxpYyBzZXR1cCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tX0RpY1RlbXBsYXRlID0gbmV3IERpY3Rpb25hcnk8SnNvblRlbXBsYXRlPigpO1xuICAgICAgICB0aGlzLm1fRGljRGF0YSA9IG5ldyBEaWN0aW9uYXJ5PGFueT4oKTtcbiAgICAgICAgdGhpcy5sb2FkKENvbmZpZ0RhdGEuJC5qc29uVGVtcGxhdGVMaXN0KTtcbiAgICB9XG5cbiAgICB1cGRhdGUoKTogdm9pZCB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog566h55CG5Zmo57uf5LiA6ZSA5q+B5pa55rOVXG4gICAgICovXG4gICAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMudW5sb2FkQWxsKCk7XG4gICAgICAgIGlmICh0aGlzLm1fRGljVGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHRoaXMubV9EaWNUZW1wbGF0ZS5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy5tX0RpY1RlbXBsYXRlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tX0RpY0RhdGEpIHtcbiAgICAgICAgICAgIHRoaXMubV9EaWNEYXRhLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLm1fRGljRGF0YSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAgLyoqXG4gICAgICog5Yqg6L295omA5pyJ55qE5pWw5o2u5qih5p2/XG4gICAgICogQHBhcmFtIGxpc3RcbiAgICAgKi9cbiAgICBwcml2YXRlIGxvYWQobGlzdDogSnNvblRlbXBsYXRlW10pOiB2b2lkIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBMb2cubG9nKFwiW2xvYWRd5Yqg6L296YWN572u6KGoOlwiICsgbGlzdFtpXS51cmwpO1xuICAgICAgICAgICAgdGhpcy5tX0RpY1RlbXBsYXRlLmFkZChsaXN0W2ldLm5hbWUsIGxpc3RbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiDojrflj5bkuIDkuKrljZXkuIDnu5PmnoTnmoTmlbDmja5cbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRUYWJsZShuYW1lOiBzdHJpbmcpOiBhbnkge1xuICAgICAgICBcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLm1fRGljRGF0YS52YWx1ZShuYW1lKTtcbiAgICAgICAgaWYoZGF0YT09bnVsbCl7XG4gICAgICAgICAgICBkYXRhID0gUmVzTWFuYWdlci4kLmdldFJlcyh0aGlzLm1fRGljVGVtcGxhdGUudmFsdWUobmFtZSkudXJsKTtcbiAgICAgICAgICAgIHRoaXMubV9EaWNEYXRhLmFkZChuYW1lLGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOiOt+WPluS4gOihjOWkjeWQiOihqOeahOaVsOaNrlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRUYWJsZVJvdyhuYW1lOiBzdHJpbmcsIGtleTogc3RyaW5nfG51bWJlcik6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFRhYmxlKG5hbWUpW2tleV07XG4gICAgfVxuXG4gICBcblxuICAgIC8qKlxuICAgICAqIOWNuOi9veaMh+WumueahOaooeadv1xuICAgICAqIEBwYXJhbSB1cmxcbiAgICAgKi9cbiAgICBwdWJsaWMgdW5sb2FkKG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLm1fRGljVGVtcGxhdGUudmFsdWUobmFtZSk7XG4gICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5tX0RpY0RhdGEucmVtb3ZlKG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIFJlc01hbmFnZXIuJC5yZWxlYXNlVXJsKHRlbXBsYXRlLnVybCk7XG4gICAgICAgIHRoaXMubV9EaWNUZW1wbGF0ZS5yZW1vdmUobmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Y246L295omA5pyJ55qE5qih5p2/XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgcHVibGljIHVubG9hZEFsbCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLm1fRGljVGVtcGxhdGUpIHJldHVybjtcblxuICAgICAgICB0aGlzLm1fRGljVGVtcGxhdGUuZm9yZWFjaChmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy51bmxvYWQoa2V5KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tX0RpY0RhdGEuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5tX0RpY1RlbXBsYXRlLmNsZWFyKCk7XG4gICAgfVxufVxuIiwiXG5cbiAvKipcbiAqIEBhdXRob3IgU3VuXG4gKiBAdGltZSAyMDE5LTA4LTEyIDEwOjU5XG4gKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcbiAqIEBkZXNjcmlwdGlvbiDphY3nva7ooajmqKHmnb/poblcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBKc29uVGVtcGxhdGUge1xuXG4gICAgcHVibGljIHVybDogc3RyaW5nO1x0Ly/otYTmupB1cmxcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nOyAvL+WQjeensO+8mueUqOS6juafpeaJvuivpeaVsOaNrue7k+aehFxuXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIG5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBFdmVudEZ1bmMgfSBmcm9tICcuLi9ldmVudC9ldmVudC1kYXRhJztcbmltcG9ydCB7IFJlc0l0ZW0gfSBmcm9tICcuL3Jlcy1pdGVtJztcblxuIC8qKlxuICogQGF1dGhvciBTdW5cbiAqIEB0aW1lIDIwMTktMDgtMDkgMTk6MzFcbiAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICogQGRlc2NyaXB0aW9uIOWcuuaZr+euoeeQhuWZqOaJgOmcgOeahOi1hOa6kOWMheWumuS5iVxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFJlc0dyb3VwIHtcblxuICAgIC8qKuWKoOi9vei/m+W6piAqL1xuICAgIHB1YmxpYyBwcm9ncmVzczogbnVtYmVyID0gMDtcbiAgICAvKirliqDovb3otYTmupAgKi9cbiAgICBwdWJsaWMgbmVlZExvYWQ6IEFycmF5PFJlc0l0ZW0+ID0gbmV3IEFycmF5PFJlc0l0ZW0+KCk7XG4gICAgLyoq5Yqg6L295pe255qE5Zue6LCD5o6l5Y+jLOS4gOiIrOeUqOS9nOe7meWKoOi9veeql+iuvue9rui/m+W6piAqL1xuICAgIHB1YmxpYyBsb2FkSXRlbTogRXZlbnRGdW5jO1xuICAgIC8qKue7k+adn+aXtueahOWbnuiwg+aOpeWPoyAqL1xuICAgIHB1YmxpYyBmaW5pc2g6IEV2ZW50RnVuYztcblxuICAgIC8qKlxuICAgICAqIOWQkei1hOa6kOe7hOa3u+WKoOebruagh1xuICAgICAqIEBwYXJhbSB1cmwg55u45a+56Lev5b6EXG4gICAgICogQHBhcmFtIHR5cGUg57G75Z6LIFxuICAgICAqIEBwYXJhbSBpc0tlZXBNZW1vcnkg5piv5ZCm5bi46am75YaF5a2YIFxuICAgICAqL1xuICAgIHB1YmxpYyBhZGQodXJsOiBzdHJpbmcsIHR5cGU6IHN0cmluZywgaXNLZWVwTWVtb3J5ID0gZmFsc2UpIHtcblxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLm5lZWRMb2FkLmZpbmRJbmRleCgodmFsdWU6IFJlc0l0ZW0sIGluZGV4OiBudW1iZXIsIG9iajogQXJyYXk8UmVzSXRlbT4pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS51cmwgPT0gdXJsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIGxldCBpbmZvID0gbmV3IFJlc0l0ZW0oKTtcbiAgICAgICAgICAgIGluZm8uaXNLZWVwTWVtb3J5ID0gaXNLZWVwTWVtb3J5O1xuICAgICAgICAgICAgaW5mby51cmwgPSB1cmw7XG4gICAgICAgICAgICBpbmZvLnR5cGUgPSB0eXBlO1xuICAgICAgICAgICAgdGhpcy5uZWVkTG9hZC5wdXNoKGluZm8pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxufVxuXG4iLCJcbi8qKlxuICogQGF1dGhvciBTdW5cbiAqIEB0aW1lIDIwMTktMDgtMDkgMTk6MThcbiAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICogQGRlc2NyaXB0aW9uIOi1hOa6kOWxnuaAp1xuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFJlc0l0ZW0ge1xuICAgIHB1YmxpYyB1cmw6IHN0cmluZztcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBpc0tlZXBNZW1vcnkgPSBmYWxzZTtcblxuICAgIHB1YmxpYyBnZXQgZnVsbFVybCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXJsXG4gICAgfVxufVxuXG5cbiIsImltcG9ydCBIYW5kbGVyID0gTGF5YS5IYW5kbGVyO1xuaW1wb3J0IHsgRXZlbnROb2RlIH0gZnJvbSAnLi4vZXZlbnQvZXZlbnQtbm9kZSc7XG5pbXBvcnQgeyBJTWFuYWdlciB9IGZyb20gJy4uLy4uL2ludGVyZmFjZS9pLW1hbmFnZXInO1xuaW1wb3J0IHsgRGljdGlvbmFyeSB9IGZyb20gJy4uLy4uL3N0cnVjdHVyZS9kaWN0aW9uYXJ5JztcbmltcG9ydCB7IExvZyB9IGZyb20gJy4uLy4uL2NvcmUvbG9nJztcbmltcG9ydCB7IFJlc0l0ZW0gfSBmcm9tICcuL3Jlcy1pdGVtJztcbmltcG9ydCB7IFV0aWxUaW1lIH0gZnJvbSAnLi4vLi4vdXRpbC90aW1lJztcbmltcG9ydCB7IFJlc0dyb3VwIH0gZnJvbSAnLi9yZXMtZ3JvdXAnO1xuaW1wb3J0IHsgUmVzTG9hZGVkIH0gZnJvbSAnLi9yZXMtbG9hZGVkJztcbmltcG9ydCB7IGVudW1DbGVhclN0cmF0ZWd5LCBlbnVtQXJyYXlTb3J0T3JkZXIgfSBmcm9tICcuLi8uLi9zZXR0aW5nL2VudW0nO1xuaW1wb3J0IHsgVXRpbEFycmF5IH0gZnJvbSAnLi4vLi4vdXRpbC9hcnJheSc7XG5pbXBvcnQgeyBFdmVudEZ1bmMgfSBmcm9tICcuLi9ldmVudC9ldmVudC1kYXRhJztcblxuXG4vKipcbiAqIEBhdXRob3IgU3VuXG4gKiBAdGltZSAyMDE5LTA4LTEyIDEzOjMzXG4gKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcbiAqIEBkZXNjcmlwdGlvbiAg6LWE5rqQ566h55CGICDvvIjmiYDmnInotYTmupDlnYfpgJrov4dSZXNHcm91cOeahOW9ouW8j+adpeWKoOi9ve+8iVxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFJlc01hbmFnZXIgZXh0ZW5kcyBFdmVudE5vZGUgaW1wbGVtZW50cyBJTWFuYWdlciB7XG5cblxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBSZXNNYW5hZ2VyID0gbnVsbDtcbiAgICBwdWJsaWMgc3RhdGljIGdldCAkKCk6IFJlc01hbmFnZXIge1xuICAgICAgICBpZiAodGhpcy5pbnN0YW5jZSA9PSBudWxsKSB0aGlzLmluc3RhbmNlID0gbmV3IFJlc01hbmFnZXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgfVxuICAgXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLy/lrZjmlL7miYDmnInlt7LliqDovb3nmoTotYTmupBcbiAgICBwcml2YXRlIG1fZGljdFJlc0l0ZW06IE1hcDxzdHJpbmcsIFJlc0l0ZW0+ID0gbmV3IE1hcDxzdHJpbmcsIFJlc0l0ZW0+KCk7XG5cbiBcblxuICAgIHB1YmxpYyBzZXR1cCgpOiB2b2lkIHtcbiAgICB9XG5cbiAgICB1cGRhdGUoKTogdm9pZCB7XG4gICAgfVxuXG4gICAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiDpgJrov4dVUkzojrflj5botYTmupBcbiAgICAgKiBAcGFyYW0gdXJsXG4gICAgICovXG4gICAgcHVibGljIGdldFJlcyh1cmw6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gTGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yqg6L296LWE5rqQ57uEXG4gICAgICogQHBhcmFtIGxvYWRzIOi1hOa6kOS/oeaBryBcbiAgICAgKiBAcGFyYW0gcHJvZ3Jlc3NGdWMg5Yqg6L296L+b5bqm5Zue6LCDXG4gICAgICogQHBhcmFtIGNvbXBsZXRlRnVjIOWKoOi9veWujOaIkOWbnuiwg1xuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkR3JvdXAobG9hZHM6IFJlc0dyb3VwLHByb2dyZXNzRnVjOkV2ZW50RnVuYyxjb21wbGV0ZUZ1YzpFdmVudEZ1bmMpIHtcbiAgICAgICAgbGV0IHVybHM6IEFycmF5PGFueT4gPSBuZXcgQXJyYXk8YW55PigpO1xuICAgICAgICBsb2Fkcy5uZWVkTG9hZC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgdXJscy5wdXNoKHt1cmw6IGVsZW1lbnQudXJsLCB0eXBlOiBlbGVtZW50LnR5cGV9KVxuICAgICAgICB9KTtcblxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybHMsIEhhbmRsZXIuY3JlYXRlKHRoaXMsIChzdWNjZXNzOiBib29sZWFuKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgLy/lrozmiJDlm57osINcbiAgICAgICAgICAgICAgICBpZihjb21wbGV0ZUZ1YyE9bnVsbCkgY29tcGxldGVGdWMuaW52b2tlKCk7XG4gICAgICAgICAgICAgICAgLy/moIforrDotYTmupBcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbG9hZHMubmVlZExvYWQubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmZvID0gbG9hZHMubmVlZExvYWRbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMubV9kaWN0UmVzSXRlbS5oYXMoaW5mby51cmwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1fZGljdFJlc0l0ZW0uc2V0KGluZm8udXJsLCBpbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgTG9nLmVycm9yKFwiTG9hZCBSZXNvdXJjZSBFcnJvcu+8mlwiKTtcbiAgICAgICAgICAgICAgICBMb2cuZGVidWcodXJscyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSksIEhhbmRsZXIuY3JlYXRlKHRoaXMsIChwcm9ncmVzczogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAvL+i/m+W6puWbnuiwg1xuICAgICAgICAgICAgaWYocHJvZ3Jlc3NGdWMhPW51bGwpIHByb2dyZXNzRnVjLmludm9rZShwcm9ncmVzcyk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSwgbnVsbCwgZmFsc2UpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOmHiuaUvui1hOa6kOe7hFxuICAgICAqIEBwYXJhbSBsb2FkcyDotYTmupDnu4QgXG4gICAgICovXG4gICAgcHVibGljIHJlbGVhc2VHcm91cChsb2FkczpSZXNHcm91cClcbiAgICB7XG4gICAgICAgIGxldCB1cmxzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgICAgICAgbG9hZHMubmVlZExvYWQuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIHVybHMucHVzaChlbGVtZW50LnVybClcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBmb3IobGV0IGk9MDtpPHVybHMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jbGVhclJlcyh1cmxzW2ldKTtcbiAgICAgICAgICAgIHRoaXMubV9kaWN0UmVzSXRlbS5mb3JFYWNoKCh2OiBSZXNJdGVtLCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgaWYoa2V5PT11cmxzW2ldKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tX2RpY3RSZXNJdGVtLmRlbGV0ZShrZXkpO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDph4rmlL7mjIflrprotYTmupBcbiAgICAgKiBAcGFyYW0gdXJsIFxuICAgICAqL1xuICAgIHB1YmxpYyByZWxlYXNlVXJsKHVybDpzdHJpbmcpXG4gICAge1xuICAgICAgICAgbGV0IGlzQWN0aXZlOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgIHRoaXMubV9kaWN0UmVzSXRlbS5mb3JFYWNoKCh2OiBSZXNJdGVtLCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWYoa2V5PT11cmwpe1xuICAgICAgICAgICAgICAgIGlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0pO1xuXG4gICAgICAgICBpZihpc0FjdGl2ZSl7XG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jbGVhclJlcyh1cmwpO1xuICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBMb2cuZXJyb3IoXCLliqDovb3otYTmupDnu4TlhoXkuI3lrZjlnKjor6XotYTmupBcIik7XG4gICAgICAgICB9XG4gICAgfVxufVxuXG4iLCJpbXBvcnQge1V0aWxTdHJpbmd9IGZyb20gXCIuLi8uLi91dGlsL3N0cmluZ1wiO1xuaW1wb3J0IFNvdW5kQ2hhbm5lbCA9IExheWEuU291bmRDaGFubmVsO1xuaW1wb3J0IEhhbmRsZXIgPSBMYXlhLkhhbmRsZXI7XG5pbXBvcnQge1Jlc01hbmFnZXJ9IGZyb20gXCIuLi9yZXMvcmVzLW1hbmFnZXJcIjtcbmltcG9ydCB7IEV2ZW50Tm9kZSB9IGZyb20gJy4uL2V2ZW50L2V2ZW50LW5vZGUnO1xuaW1wb3J0IHsgSU1hbmFnZXIgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2UvaS1tYW5hZ2VyJztcbmltcG9ydCB7IExvZyB9IGZyb20gJy4uLy4uL2NvcmUvbG9nJztcbmltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tICcuLi8uLi9zdHJ1Y3R1cmUvZGljdGlvbmFyeSc7XG5pbXBvcnQgeyBDb25maWdTb3VuZCB9IGZyb20gJy4uLy4uL3NldHRpbmcvY29uZmlnJztcblxuXG4vKipcbiAqIEBhdXRob3IgU3VuXG4gKiBAdGltZSAyMDE5LTA4LTEyIDE1OjA4XG4gKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcbiAqIEBkZXNjcmlwdGlvbiDpn7PmlYjnrqHnkIZcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBTb3VuZE1hbmFnZXIgZXh0ZW5kcyBFdmVudE5vZGUgaW1wbGVtZW50cyBJTWFuYWdlciB7XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuKAlOKAlCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy/liIbnlYznur8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirlsZ7mgKfkv6Hmga8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqIERlczrog4zmma/pn7PkuZAgKi9cbiAgICBwcml2YXRlIG1fQ3VyQkdTb3VuZDogU291bmRDaGFubmVsID0gbnVsbDtcbiAgICAvKirpn7PmlYjlkI3lrZflr7nlupRVcmwgKi9cbiAgICBwcml2YXRlIGRpY3RTb3VuZFVybDpEaWN0aW9uYXJ5PHN0cmluZz4gPSBudWxsO1xuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirigJTigJQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8v5YiG55WM57q/Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq55Sf5ZG95ZGo5pyfKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBTb3VuZE1hbmFnZXIgPSBudWxsO1xuXG4gICAgcHVibGljIHN0YXRpYyBnZXQgJCgpOiBTb3VuZE1hbmFnZXIge1xuICAgICAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHRoaXMuaW5zdGFuY2UgPSBuZXcgU291bmRNYW5hZ2VyKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cbiBcbiAgICBzZXR1cCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tX0N1ckJHU291bmQgPSBuZXcgU291bmRDaGFubmVsKCk7XG4gICAgICAgIHRoaXMuZGljdFNvdW5kVXJsID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nPigpO1xuICAgICAgICBDb25maWdTb3VuZC4kLnNvdW5kUmVzTGlzdC5mb3JFYWNoKGl0ZW09PntcbiAgICAgICAgICAgIHRoaXMuZGljdFNvdW5kVXJsLmFkZChpdGVtLm5hbWUsaXRlbS51cmwpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYoIVV0aWxTdHJpbmcuaXNFbXB0eShDb25maWdTb3VuZC4kLmJnU291bmROYW1lKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5wbGF5QkdTb3VuZChDb25maWdTb3VuZC4kLmJnU291bmROYW1lLDApO1xuICAgICAgICAgICAgdGhpcy5zZXRBbGxWb2x1bWUoQ29uZmlnU291bmQuJC52b2x1bWVWb2ljZVNvdW5kKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB1cGRhdGUoKTogdm9pZCB7XG4gICAgfVxuICAgIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgfVxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirigJTigJQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8v5YiG55WM57q/Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuiuvue9ruaVtOS9k+mfs+mHjyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICog6K6+572u5pW05L2T6Z+z6YePXG4gICAgICogQHBhcmFtIG51bWJlclxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRBbGxWb2x1bWUobnVtYmVyKVxuICAgIHtcbiAgICAgICAgQ29uZmlnU291bmQuJC52b2x1bWVWb2ljZVNvdW5kID0gbnVtYmVyO1xuICAgICAgICB0aGlzLm1fQ3VyQkdTb3VuZC52b2x1bWUgPSBudW1iZXI7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq4oCU4oCUKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL+WIhueVjOe6vy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq5o6n5Yi26IOM5pmv6Z+z5LmQKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiDmkq3mlL7og4zmma/lo7Dpn7NcbiAgICAgKiBAcGFyYW0gICAgZmlsZV9uYW1lICAgIOi1hOa6kOWQjeWtl1xuICAgICAqIEBwYXJhbSAgICBjb3VudCAgICAgICAg5pKt5pS+5qyh5pWwKDDkuLrlvqrnjq8pXG4gICAgICovXG4gICAgcHVibGljIHBsYXlCR1NvdW5kKGZpbGVfbmFtZTogc3RyaW5nLCBjb3VudDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChVdGlsU3RyaW5nLmlzRW1wdHkoZmlsZV9uYW1lKSkge1xuICAgICAgICAgICAgTG9nLmVycm9yKFwiU291bmQgZmlsZSBlcnJvciFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tX0N1ckJHU291bmQgPSBMYXlhLlNvdW5kTWFuYWdlci5wbGF5TXVzaWModGhpcy5kaWN0U291bmRVcmwudmFsdWUoZmlsZV9uYW1lKSxjb3VudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5YGc5q2i6IOM5pmv6Z+z5pKt5pS+XG4gICAgICovXG4gICAgcHVibGljIHN0b3BCR1NvdW5kKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5tX0N1ckJHU291bmQpIHtcbiAgICAgICAgICAgIHRoaXMubV9DdXJCR1NvdW5kLnN0b3AoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pqC5YGc6IOM5pmv6Z+z5LmQXG4gICAgICovXG4gICAgcHVibGljIHBhdXNlQkdTb3VuZCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMubV9DdXJCR1NvdW5kKSB7XG4gICAgICAgICAgICB0aGlzLm1fQ3VyQkdTb3VuZC5wYXVzZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5oGi5aSN6IOM5pmv6Z+z5LmQ5pKt5pS+XG4gICAgICovXG4gICAgcHVibGljIHJlc3VtZUJHU291bmQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm1fQ3VyQkdTb3VuZCkge1xuICAgICAgICAgICAgdGhpcy5tX0N1ckJHU291bmQucmVzdW1lKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDorr7nva7og4zmma/pn7Pph49cbiAgICAgKiBAcGFyYW0gdm9sdW1lXG4gICAgICovXG4gICAgcHVibGljIHNldEJHU291bmRWb2x1bWUodm9sdW1lOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMubV9DdXJCR1NvdW5kKSB7XG4gICAgICAgICAgICB0aGlzLm1fQ3VyQkdTb3VuZC52b2x1bWUgPSB2b2x1bWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirigJTigJQqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8v5YiG55WM57q/Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirmjqfliLbpn7PmlYjmkq3mlL4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIOaSreaUvuaViOaenOWjsOmfs1xuICAgICAqIEBwYXJhbSAgICBmaWxlX25hbWUgICAg6LWE5rqQXG4gICAgICogQHBhcmFtICAgIGNvdW50ICAgICAgICDmkq3mlL7mrKHmlbBcbiAgICAgKi9cbiAgICBwdWJsaWMgcGxheVNvdW5kRWZmZWN0KGZpbGVfbmFtZTogc3RyaW5nLCBjb3VudDogbnVtYmVyKXtcbiAgICAgICAgaWYgKFV0aWxTdHJpbmcuaXNFbXB0eShmaWxlX25hbWUpKSB7XG4gICAgICAgICAgICBMb2cuZXJyb3IoXCLlo7Dpn7Pmlofku7bplJnor69cIik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc291bmQ6IFNvdW5kQ2hhbm5lbCA9IExheWEuUG9vbC5nZXRJdGVtQnlDbGFzcyhcIlNvdW5kXCIsU291bmRDaGFubmVsKTtcblxuICAgICAgICBzb3VuZCA9IExheWEuU291bmRNYW5hZ2VyLnBsYXlTb3VuZCh0aGlzLmRpY3RTb3VuZFVybC52YWx1ZShmaWxlX25hbWUpLGNvdW50LEhhbmRsZXIuY3JlYXRlKHRoaXMsKCk9PntcbiAgICAgICAgICAgIExheWEuUG9vbC5yZWNvdmVyKFwiU291bmRcIixzb3VuZCk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgc291bmQudm9sdW1lID0gQ29uZmlnU291bmQuJC52b2x1bWVWb2ljZVNvdW5kO1xuICAgICAgICByZXR1cm4gc291bmQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5YGc5q2i5pKt5pS+XG4gICAgICogQHBhcmFtIHNvdW5kXG4gICAgICovXG4gICAgcHVibGljIHN0b3BTb3VuZEVmZmVjdChzb3VuZDogU291bmRDaGFubmVsKTogdm9pZCB7XG4gICAgICAgIGlmIChzb3VuZCkge1xuICAgICAgICAgICAgc291bmQuc3RvcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq4oCU4oCUKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL+WIhueVjOe6vy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbn0iLCJpbXBvcnQge1V0aWxUaW1lfSBmcm9tIFwiLi4vLi4vdXRpbC90aW1lXCI7XG5pbXBvcnQgSGFuZGxlciA9IExheWEuSGFuZGxlcjtcbmltcG9ydCB7IElQb29sT2JqZWN0IH0gZnJvbSAnLi4vLi4vY29yZS9vYmplY3QtcG9vbCc7XG5pbXBvcnQgeyBUaW1lckludGVydmFsIH0gZnJvbSAnLi90aW1lci1pbnRlcnZhbCc7XG5cbi8qKlxuICogQGF1dGhvciBTdW5cbiAqIEB0aW1lIDIwMTktMDgtMTAgMjA6MDZcbiAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICogQGRlc2NyaXB0aW9uICDorqHml7blmajln7rnsbtcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBUaW1lckVudGl0eSBpbXBsZW1lbnRzIElQb29sT2JqZWN0IHtcbiAgICBwdWJsaWMgaWQ6IG51bWJlcjtcbiAgICBwdWJsaWMgaXNBY3RpdmU6IGJvb2xlYW47XG5cbiAgICBwdWJsaWMgbVJhdGU6IG51bWJlcjtcbiAgICBwdWJsaWMgbVRpY2tzOiBudW1iZXI7XG4gICAgcHVibGljIG1UaWNrc0VsYXBzZWQ6IG51bWJlcjtcbiAgICBwdWJsaWMgaGFuZGxlOiBIYW5kbGVyO1xuXG4gICAgcHVibGljIG1UaW1lOiBUaW1lckludGVydmFsO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubVRpbWUgPSBuZXcgVGltZXJJbnRlcnZhbCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KCk6IHZvaWQge1xuICAgIH1cblxuICAgIHB1YmxpYyBjbG9zZSgpIHtcbiAgICB9XG5cblxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaGFuZGxlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlLnJlY292ZXIoKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzZXQoaWQ6IG51bWJlciwgcmF0ZTogbnVtYmVyLCB0aWNrczogbnVtYmVyLCBoYW5kbGU6IEhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLm1SYXRlID0gcmF0ZSA8IDAgPyAwIDogcmF0ZTtcbiAgICAgICAgdGhpcy5tVGlja3MgPSB0aWNrcyA8IDAgPyAwIDogdGlja3M7XG4gICAgICAgIHRoaXMuaGFuZGxlID0gaGFuZGxlO1xuICAgICAgICB0aGlzLm1UaWNrc0VsYXBzZWQgPSAwO1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tVGltZS5pbml0KHRoaXMubVJhdGUsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKHJlbW92ZVRpbWVyOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBY3RpdmUgJiYgdGhpcy5tVGltZS51cGRhdGUoVXRpbFRpbWUuZGVsdGFUaW1lKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaGFuZGxlICE9IG51bGwpIHRoaXMuaGFuZGxlLnJ1bigpO1xuXG4gICAgICAgICAgICB0aGlzLm1UaWNrc0VsYXBzZWQrKztcbiAgICAgICAgICAgIGlmICh0aGlzLm1UaWNrcyA+IDAgJiYgdGhpcy5tVGlja3MgPT0gdGhpcy5tVGlja3NFbGFwc2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlbW92ZVRpbWVyKHRoaXMuaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLyoqXG4gKiBAYXV0aG9yIFN1blxuICogQHRpbWUgMjAxOS0wOC0xMCAyMDowMlxuICogQHByb2plY3QgU0ZyYW1ld29ya19MYXlhQWlyXG4gKiBAZGVzY3JpcHRpb24gIOWumuaXtuaJp+ihjFxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFRpbWVySW50ZXJ2YWwge1xuXG4gICAgcHJpdmF0ZSBtX2ludGVydmFsX3RpbWU6IG51bWJlcjsvL+avq+enklxuICAgIHByaXZhdGUgbV9ub3dfdGltZTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubV9ub3dfdGltZSA9IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yid5aeL5YyW5a6a5pe25ZmoXG4gICAgICogQHBhcmFtICAgIGludGVydmFsICAgIOinpuWPkemXtOmalFxuICAgICAqIEBwYXJhbSAgICBmaXJzdF9mcmFtZSAgICDmmK/lkKbnrKzkuIDluKflvIDlp4vmiafooYxcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdChpbnRlcnZhbDogbnVtYmVyLCBmaXJzdF9mcmFtZTogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLm1faW50ZXJ2YWxfdGltZSA9IGludGVydmFsO1xuICAgICAgICBpZiAoZmlyc3RfZnJhbWUpIHRoaXMubV9ub3dfdGltZSA9IHRoaXMubV9pbnRlcnZhbF90aW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXNldCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tX25vd190aW1lID0gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKGVsYXBzZV90aW1lOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgdGhpcy5tX25vd190aW1lICs9IGVsYXBzZV90aW1lO1xuICAgICAgICBpZiAodGhpcy5tX25vd190aW1lID49IHRoaXMubV9pbnRlcnZhbF90aW1lKSB7XG4gICAgICAgICAgICB0aGlzLm1fbm93X3RpbWUgLT0gdGhpcy5tX2ludGVydmFsX3RpbWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuIiwiaW1wb3J0IEhhbmRsZXIgPSBMYXlhLkhhbmRsZXI7XG5pbXBvcnQge1V0aWxBcnJheX0gZnJvbSBcIi4uLy4uL3V0aWwvYXJyYXlcIjtcbmltcG9ydCB7IEV2ZW50Tm9kZSB9IGZyb20gJy4uL2V2ZW50L2V2ZW50LW5vZGUnO1xuaW1wb3J0IHsgSU1hbmFnZXIgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2UvaS1tYW5hZ2VyJztcbmltcG9ydCB7IFRpbWVEZWxheSB9IGZyb20gJy4uLy4uL2NvcmUvdGltZS1kZWxheSc7XG5pbXBvcnQgeyBPYmplY3RQb29sIH0gZnJvbSAnLi4vLi4vY29yZS9vYmplY3QtcG9vbCc7XG5pbXBvcnQgeyBUaW1lckVudGl0eSB9IGZyb20gJy4vdGltZXItZW50aXR5JztcblxuLyoqXG4gKiBAYXV0aG9yIFN1blxuICogQHRpbWUgMjAxOS0wOC0wOSAyMzoyMlxuICogQHByb2plY3QgU0ZyYW1ld29ya19MYXlhQWlyXG4gKiBAZGVzY3JpcHRpb24gIOWumuaXtueuoeeQhuWZqFxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFRpbWVyTWFuYWdlciBleHRlbmRzIEV2ZW50Tm9kZSBpbXBsZW1lbnRzIElNYW5hZ2VyIHtcbiAgXG4gICAgcHJpdmF0ZSBtX2lkQ291bnRlcjogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIG1fUmVtb3ZhbFBlbmRpbmc6IEFycmF5PG51bWJlcj4gPSBbXTtcbiAgICBwcml2YXRlIG1fVGltZXJzOiBBcnJheTxUaW1lckVudGl0eT4gPSBbXTtcblxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBUaW1lck1hbmFnZXIgPSBudWxsO1xuXG4gICAgcHVibGljIHN0YXRpYyBnZXQgJCgpOiBUaW1lck1hbmFnZXIge1xuICAgICAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHRoaXMuaW5zdGFuY2UgPSBuZXcgVGltZXJNYW5hZ2VyKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXR1cCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tX2lkQ291bnRlciA9IDA7XG4gICAgICAgIFRpbWVEZWxheS4kLmFkZCgwLjEsIDAsIHRoaXMucmVtb3ZlLCB0aGlzKTtcbiAgICAgICAgVGltZURlbGF5LiQuYWRkVXBkYXRlKHRoaXMudGljaywgdGhpcyk7XG4gICAgfVxuXG4gICAgdXBkYXRlKCk6IHZvaWQge1xuICAgIH1cblxuICAgIHB1YmxpYyBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBVdGlsQXJyYXkuY2xlYXIodGhpcy5tX1JlbW92YWxQZW5kaW5nKTtcbiAgICAgICAgVXRpbEFycmF5LmNsZWFyKHRoaXMubV9UaW1lcnMpO1xuICAgICAgICBUaW1lRGVsYXkuJC5yZW1vdmUodGhpcy5yZW1vdmUsIHRoaXMpO1xuICAgICAgICBUaW1lRGVsYXkuJC5yZW1vdmUodGhpcy50aWNrLCB0aGlzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRpY2soKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tX1RpbWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5tX1RpbWVyc1tpXS51cGRhdGUodGhpcy5yZW1vdmVUaW1lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlrprml7bph43lpI3miafooYxcbiAgICAgKiBAcGFyYW0gICAgcmF0ZSAgICDpl7TpmpTml7bpl7Qo5Y2V5L2N5q+r56eSKeOAglxuICAgICAqIEBwYXJhbSAgICB0aWNrcyAgICDmiafooYzmrKHmlbBcbiAgICAgKiBAcGFyYW0gICAgY2FsbGVyICAgIOaJp+ihjOWfnyh0aGlzKeOAglxuICAgICAqIEBwYXJhbSAgICBtZXRob2QgICAg5a6a5pe25Zmo5Zue6LCD5Ye95pWw77ya5rOo5oSP77yM6L+U5Zue5Ye95pWw56ys5LiA5Liq5Y+C5pWw5Li65a6a5pe25ZmoaWTvvIzlkI7pnaLlj4LmlbDkvp3mrKHml7bkvKDlhaXnmoTlj4LmlbDjgILkvotPblRpbWUodGltZXJfaWQ6bnVtYmVyLCBhcmdzMTphbnksIGFyZ3MyOmFueSwuLi4pOnZvaWRcbiAgICAgKiBAcGFyYW0gICAgYXJncyAgICDlm57osIPlj4LmlbDjgIJcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkTG9vcChyYXRlOiBudW1iZXIsIHRpY2tzOiBudW1iZXIsIGNhbGxlcjogYW55LCBtZXRob2Q6IEZ1bmN0aW9uLCBhcmdzOiBBcnJheTxhbnk+ID0gbnVsbCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aWNrcyA8PSAwKSB0aWNrcyA9IDA7XG4gICAgICAgIGxldCBuZXdUaW1lcjogVGltZXJFbnRpdHkgPSBPYmplY3RQb29sLmdldChUaW1lckVudGl0eSk7XG4gICAgICAgICsrdGhpcy5tX2lkQ291bnRlcjtcbiAgICAgICAgaWYgKGFyZ3MgIT0gbnVsbCkgVXRpbEFycmF5Lmluc2VydChhcmdzLCB0aGlzLm1faWRDb3VudGVyLCAwKTtcbiAgICAgICAgbmV3VGltZXIuc2V0KHRoaXMubV9pZENvdW50ZXIsIHJhdGUsIHRpY2tzLCBIYW5kbGVyLmNyZWF0ZShjYWxsZXIsIG1ldGhvZCwgYXJncywgZmFsc2UpKTtcbiAgICAgICAgdGhpcy5tX1RpbWVycy5wdXNoKG5ld1RpbWVyKTtcbiAgICAgICAgcmV0dXJuIG5ld1RpbWVyLmlkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWNleasoeaJp+ihjFxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRPbmNlKHJhdGU6IG51bWJlciwgY2FsbGVyOiBhbnksIG1ldGhvZDogRnVuY3Rpb24sIGFyZ3M6IEFycmF5PGFueT4gPSBudWxsKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IG5ld1RpbWVyOiBUaW1lckVudGl0eSA9IE9iamVjdFBvb2wuZ2V0KFRpbWVyRW50aXR5KTtcbiAgICAgICAgKyt0aGlzLm1faWRDb3VudGVyO1xuICAgICAgICBpZiAoYXJncyAhPSBudWxsKSBVdGlsQXJyYXkuaW5zZXJ0KGFyZ3MsIHRoaXMubV9pZENvdW50ZXIsIDApO1xuICAgICAgICBuZXdUaW1lci5zZXQodGhpcy5tX2lkQ291bnRlciwgcmF0ZSwgMSwgSGFuZGxlci5jcmVhdGUoY2FsbGVyLCBtZXRob2QsIGFyZ3MsIGZhbHNlKSk7XG4gICAgICAgIHRoaXMubV9UaW1lcnMucHVzaChuZXdUaW1lcik7XG4gICAgICAgIHJldHVybiBuZXdUaW1lci5pZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDnp7vpmaTlrprml7blmahcbiAgICAgKiBAcGFyYW0gICAgdGltZXJJZCAgICDlrprml7blmahpZFxuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmVUaW1lcih0aW1lcklkOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tX1JlbW92YWxQZW5kaW5nLnB1c2godGltZXJJZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog56e76Zmk6L+H5pyf5a6a5pe25ZmoXG4gICAgICovXG4gICAgcHJpdmF0ZSByZW1vdmUoKTogdm9pZCB7XG4gICAgICAgIGxldCB0aW1lcjogVGltZXJFbnRpdHk7XG4gICAgICAgIGlmICh0aGlzLm1fUmVtb3ZhbFBlbmRpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaWQgb2YgdGhpcy5tX1JlbW92YWxQZW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1fVGltZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVyID0gdGhpcy5tX1RpbWVyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpbWVyLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lci5jbGVhcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0UG9vbC5yZWNvdmVyKHRpbWVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubV9UaW1lcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFV0aWxBcnJheS5jbGVhcih0aGlzLm1fUmVtb3ZhbFBlbmRpbmcpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iLCJcblxuaW1wb3J0IFNwcml0ZSA9IExheWEuU3ByaXRlO1xuaW1wb3J0IFR3ZWVuID0gTGF5YS5Ud2VlbjtcbmltcG9ydCBFYXNlID0gTGF5YS5FYXNlO1xuaW1wb3J0IEhhbmRsZXIgPSBMYXlhLkhhbmRsZXI7XG5pbXBvcnQgeyBVdGlsRGlzcGxheSB9IGZyb20gXCIuLi8uLi91dGlsL2Rpc3BsYXlcIjtcbmltcG9ydCB7IEV2ZW50RnVuYyB9IGZyb20gJy4uL2V2ZW50L2V2ZW50LWRhdGEnO1xuXG5leHBvcnQgbW9kdWxlIEN1c3RvbURpYWxvZ3tcblxuICAgIC8qKlxuICAgICAqIEBhdXRob3IgU3VuXG4gICAgICogQHRpbWUgMjAxOS0wOC0wOSAxNzo0MVxuICAgICAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICAgICAqIEBkZXNjcmlwdGlvbiAgVUnnu4Tku7bnmoTln7rnsbvvvIznu6fmib/oh6pMYXlhLlZpZXdcbiAgICAgKlxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBEaWFsb2dCYXNlIGV4dGVuZHMgTGF5YS5EaWFsb2cge1xuICAgICAgICBcbiAgICAgICAgLyoq6YGu572p5bGCICovXG4gICAgICAgIHByaXZhdGUgbWFza0xheWVyOiBTcHJpdGUgPSBudWxsO1xuICAgICAgICAvKirlvLnnqpflhoXniankvZMgKi9cbiAgICAgICAgcHJpdmF0ZSBjb250ZW50UG5sOiBMYXlhLk5vZGUgPSBudWxsO1xuICAgICAgICAvKirlvLnnqpfmlbDmja4gKi9cbiAgICAgICAgcHVibGljIHBvcHVwRGF0YSA9IG5ldyBQb3B1cERhdGEoKTtcblxuICAgICAgICBjcmVhdGVWaWV3KHZpZXc6IGFueSk6IHZvaWQge1xuICAgICAgICAgICAgc3VwZXIuY3JlYXRlVmlldyh2aWV3KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5idW5kbGVCdXR0b25zKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGVudFBubCA9IHRoaXMuZ2V0Q2hpbGRBdCgwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqDpga7nvanlsYJcbiAgICAgICAgICovXG4gICAgICAgIGNyYXRlTWFza0xheWVyKCk6IHZvaWQge1xuICAgICAgICAgICAgdGhpcy5tYXNrTGF5ZXIgPSBVdGlsRGlzcGxheS5jcmVhdGVNYXNrTGF5ZXIoKTtcbiAgICAgICAgICAgIHRoaXMubWFza0xheWVyLm1vdXNlRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGxldCB0ID0gdGhpcy5tYXNrTGF5ZXI7XG4gICAgICAgICAgICB0LnggPSBNYXRoLnJvdW5kKCgoTGF5YS5zdGFnZS53aWR0aCAtIHQud2lkdGgpID4+IDEpICsgdC5waXZvdFgpO1xuICAgICAgICAgICAgdC55ID0gTWF0aC5yb3VuZCgoKExheWEuc3RhZ2UuaGVpZ2h0IC0gdC5oZWlnaHQpID4+IDEpICsgdC5waXZvdFkpO1xuXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMubWFza0xheWVyKTtcbiAgICAgICAgICAgIHRoaXMubWFza0xheWVyLnpPcmRlciA9IC0xO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Zyo5Zy65pmv5Lit5bGF5Lit57uE5Lu2XG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgY2VudGVyKHZpZXc/OiBMYXlhLlNwcml0ZSk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHZpZXcgPT0gbnVsbCkgdmlldyA9IHRoaXM7XG4gICAgICAgICAgICB2aWV3LnggPSBNYXRoLnJvdW5kKCgoTGF5YS5zdGFnZS53aWR0aCAtIHZpZXcud2lkdGgpID4+IDEpICsgdmlldy5waXZvdFgpO1xuICAgICAgICAgICAgdmlldy55ID0gTWF0aC5yb3VuZCgoKExheWEuc3RhZ2UuaGVpZ2h0IC0gdmlldy5oZWlnaHQpID4+IDEpICsgdmlldy5waXZvdFkpO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICog5re75Yqg6buY6K6k5oyJ6ZKu5LqL5Lu2XG4gICAgICAgICAqL1xuICAgICAgICBidW5kbGVCdXR0b25zKCk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHRoaXNbXCJidG5DbG9zZVwiXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpc1tcImJ0bkNsb3NlXCJdLm9uKExheWEuRXZlbnQuQ0xJQ0ssIHRoaXMsIHRoaXMuY2xvc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWFs+mXreepuueZveWkhOeCueWHu+WFs+mXreS6i+S7tlxuICAgICAgICAgKi9cbiAgICAgICAgY2xvc2VPdXRzaWVDbGljaygpe1xuICAgICAgICAgICAgaWYgKHRoaXMubWFza0xheWVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1hc2tMYXllci5vZmYoTGF5YS5FdmVudC5DTElDSywgdGhpcywgdGhpcy5jbG9zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5a+56K+d5qGG5by55Ye65pa55rOVXG4gICAgICAgICAqIEBwYXJhbSB0aW1lIOW8ueWHuuaXtumXtFxuICAgICAgICAgKiBAcGFyYW0gZGF0YSDmlbDmja5cbiAgICAgICAgICogQHBhcmFtIGlzTWFzayDmmK/lkKbnlJ/miJDpga7nvalcbiAgICAgICAgICogQHBhcmFtIGNsb3NlT3V0c2lkZSDmmK/lkKbngrnlh7vnqbrnmb3lpITlhbPpl61cbiAgICAgICAgICovXG4gICAgICAgIHBvcHVwRGlhbG9nKHBvcHVwRGF0YTpQb3B1cERhdGEgPSBudWxsKTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLnBvcHVwKGZhbHNlLGZhbHNlKTtcblxuICAgICAgICAgICAgaWYocG9wdXBEYXRhPT1udWxsKSB7XG4gICAgICAgICAgICAgICAgcG9wdXBEYXRhID0gdGhpcy5wb3B1cERhdGE7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVwRGF0YSA9IHBvcHVwRGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBvcHVwSW5pdCgpO1xuICAgICAgICAgICAgaWYgKHBvcHVwRGF0YS5pc01hc2sgJiYgdGhpcy5tYXNrTGF5ZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JhdGVNYXNrTGF5ZXIoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXBvcHVwRGF0YS5jbG9zZU91dHNpZGUpIHRoaXMubWFza0xheWVyLm9uKExheWEuRXZlbnQuQ0xJQ0ssIHRoaXMsIHRoaXMuY2xvc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vblNob3dBbmltYXRpb24ocG9wdXBEYXRhLnRpbWUsKCk9PntcbiAgICAgICAgICAgICAgICBpZihwb3B1cERhdGEuY2FsbEJhY2spIHBvcHVwRGF0YS5jYWxsQmFjay5pbnZva2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqIERlczrlvLnlh7rosIPnlKggKi9cbiAgICAgICAgcG9wdXBJbml0KCkge1xuICAgICAgICB9XG5cblxuICAgICAgICBvblNob3dBbmltYXRpb24odGltZTogbnVtYmVyID0gMzAwLGNiKSB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcy5jb250ZW50UG5sO1xuICAgICAgICAgICAgdGhpcy5jZW50ZXIoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgdGFyZ2V0LnNjYWxlKDAsIDApO1xuICAgICAgICAgICAgVHdlZW4udG8odGFyZ2V0LCB7XG4gICAgICAgICAgICAgICAgc2NhbGVYOiAxLFxuICAgICAgICAgICAgICAgIHNjYWxlWTogMVxuICAgICAgICAgICAgfSwgdGltZSwgRWFzZS5iYWNrT3V0LCBIYW5kbGVyLmNyZWF0ZSh0aGlzLCBjYiwgW3RoaXNdKSwgMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY2xvc2UoKTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVNlbGYoKTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG59XG5cblxuICAgIC8qKlxuICAgICAqIEBhdXRob3IgU3VuXG4gICAgICogQHRpbWUgMjAxOS0wOC0xMiAxNzo0M1xuICAgICAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICAgICAqIEBkZXNjcmlwdGlvbiAg56qX5L2T5by55Ye65pWw5o2uXG4gICAgICp0aW1lOiBudW1iZXIgPSAzMDAsIGRhdGE6IGFueSA9IG51bGwsIGlzTWFzazogYm9vbGVhbiA9IHRydWUsIGNsb3NlT3V0c2lkZTogYm9vbGVhbiA9IHRydWUsY2I/XG4gICAgICovXG4gICAgZXhwb3J0IGNsYXNzIFBvcHVwRGF0YXtcbiAgICAgICAgcHVibGljIHRpbWU6bnVtYmVyID0gMzAwO1xuICAgICAgICBwdWJsaWMgZGF0YTphbnkgPSBudWxsO1xuICAgICAgICBwdWJsaWMgaXNNYXNrOmJvb2xlYW4gPSB0cnVlO1xuICAgICAgICBwdWJsaWMgY2xvc2VPdXRzaWRlOmJvb2xlYW4gPSB0cnVlO1xuICAgICAgICBwdWJsaWMgY2FsbEJhY2s6RXZlbnRGdW5jID0gbnVsbDtcblxuICAgICAgICBjb25zdHJ1Y3Rvcih0aW1lOiBudW1iZXIgPSAzMDAsIGRhdGE6IGFueSA9IG51bGwsIGlzTWFzazogYm9vbGVhbiA9IHRydWUsIGNsb3NlT3V0c2lkZTogYm9vbGVhbiA9IHRydWUsY2I6RXZlbnRGdW5jID1udWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZih0aW1lIT1udWxsKSB0aGlzLnRpbWUgPSB0aW1lO1xuICAgICAgICAgICAgaWYoZGF0YSE9bnVsbCkgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgIGlmKGlzTWFzayE9bnVsbCkgdGhpcy5pc01hc2sgPSBpc01hc2s7XG4gICAgICAgICAgICBpZihjbG9zZU91dHNpZGUhPW51bGwpIHRoaXMuY2xvc2VPdXRzaWRlID0gY2xvc2VPdXRzaWRlO1xuICAgICAgICAgICAgaWYoY2IhPW51bGwpIHRoaXMuY2FsbEJhY2sgPSBjYjtcbiAgICAgICAgfVxuICAgIH0iLCJpbXBvcnQgeyBSZXNHcm91cCB9IGZyb20gJy4uL3Jlcy9yZXMtZ3JvdXAnO1xuaW1wb3J0IHsgUmVzTWFuYWdlciB9IGZyb20gJy4uL3Jlcy9yZXMtbWFuYWdlcic7XG5pbXBvcnQgeyBMb2cgfSBmcm9tICcuLi8uLi9jb3JlL2xvZyc7XG5pbXBvcnQgeyBUaW1lck1hbmFnZXIgfSBmcm9tICcuLi90aW1lci90aW1lci1tYW5hZ2VyJztcbmltcG9ydCB7IEV2ZW50RnVuYyB9IGZyb20gJy4uL2V2ZW50L2V2ZW50LWRhdGEnO1xuXG5leHBvcnQgbW9kdWxlIEN1c3RvbVNjZW5le1xuXG4gICAgLyoqXG4gICAgICogQGF1dGhvciBTdW5cbiAgICAgKiBAdGltZSAyMDE5LTA4LTA5IDE5OjEyXG4gICAgICogQHByb2plY3QgU0ZyYW1ld29ya19MYXlhQWlyXG4gICAgICogQGRlc2NyaXB0aW9uICBTY2VuZeeahOWfuuexu1xuICAgICAqXG4gICAgICovXG4gICAgZXhwb3J0IGNsYXNzIEx5U2NlbmUgZXh0ZW5kcyBMYXlhLlNjZW5lIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5YaF5bWM5qih5byP56m655qE5Zy65pmv6LWE5rqQ77yM5b+F6aG75a6e546w6L+Z5LiqY3JlYXRlVmlld++8jOWQpuWImeaciemXrumimFxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHN0YXRpYyAgdWlWaWV3OmFueSA9e1widHlwZVwiOlwiU2NlbmVcIixcInByb3BzXCI6e1wid2lkdGhcIjoxMzM0LFwiaGVpZ2h0XCI6NzUwfSxcImxvYWRMaXN0XCI6W10sXCJsb2FkTGlzdDNEXCI6W119O1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWcuuaZr+esrOS4gOS4quWKoOi9veeahOeql+WPo1xuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIGZpcnN0VmlldzogYW55ID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWcuuaZr+S+nei1lueahOi1hOa6kOe7hFxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIG5lZWRMb2FkUmVzOiBSZXNHcm91cDtcblxuICAgICAgICBwcml2YXRlIG1fcGFyYW06IGFueTtcbiAgICAgICAgcHJpdmF0ZSBtX2xvYWRlZCA9IGZhbHNlO1xuXG4gICAgICAgIHB1YmxpYyBzY2VuZVRpbWVyczogQXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cbiAgICAgICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMubmVlZExvYWRSZXMgPSBuZXcgUmVzR3JvdXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVWaWV3KEx5U2NlbmUudWlWaWV3KTtcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSBMYXlhLnN0YWdlLndpZHRoO1xuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBMYXlhLnN0YWdlLmhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDov5vlhaXlnLrmma9cbiAgICAgICAgICogQHBhcmFtIHBhcmFtIOWPguaVsCBcbiAgICAgICAgICogQHBhcmFtIHByb2dyZXNzRnVjIOi/m+W6puWbnuiwgyBcbiAgICAgICAgICogQHBhcmFtIGNvbXBsZXRlRnVjIOWujOaIkOWbnuiwg1xuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGVudGVyKHBhcmFtOiBhbnkscHJvZ3Jlc3NGdWM6RXZlbnRGdW5jLGNvbXBsZXRlRnVjOkV2ZW50RnVuYykge1xuXG4gICAgICAgICAgICB0aGlzLm1fbG9hZGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm1fcGFyYW0gPSBwYXJhbTtcbiAgICAgICAgICAgIHRoaXMub25Jbml0KHBhcmFtKTtcblxuICAgICAgICAgICAgUmVzTWFuYWdlci4kLmxvYWRHcm91cCh0aGlzLm5lZWRMb2FkUmVzLHByb2dyZXNzRnVjLGNvbXBsZXRlRnVjKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHVibGljIGxlYXZlKCkge1xuICAgICAgICAgICAgdGhpcy5vbkxlYXZlKCk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICAgICAgdGhpcy5vbkNsZWFuKCk7XG4gICAgICAgICAgICB0aGlzLnNjZW5lVGltZXJzLmZvckVhY2goKHRpbWVyOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICBUaW1lck1hbmFnZXIuJC5yZW1vdmVUaW1lcih0aW1lcik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yqg6L295a6M5oiQXG4gICAgICAgICAqIEBwYXJhbSBlcnJvciDliqDovb3plJnor69cbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBsb2FkZWQoZXJyb3IpIHtcblxuICAgICAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBMb2cuZXJyb3IoZXJyb3IpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkZWQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1fbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNoRW50ZXIoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuICAgICAgICBwcml2YXRlIGNoZWNoRW50ZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tX2xvYWRlZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpcnN0VmlldyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjbHMgPSB0aGlzLmZpcnN0VmlldztcbiAgICAgICAgICAgICAgICAgICAgbGV0IHdpbiA9IG5ldyBjbHMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh3aW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm9uRW50ZXIodGhpcy5tX3BhcmFtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWKoOi9veWujOaIkFxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIG9uTG9hZGVkKCkge1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Zy65pmv5Yid5aeL5YyWXG4gICAgICAgICAqIEBwYXJhbSBwYXJhbSDlj4LmlbBcbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBvbkluaXQocGFyYW06IGFueSkge1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog6L+b5YWl5Zy65pmvXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgb25FbnRlcihwYXJhbTogYW55KTogdm9pZCB7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmAkOW4p+W+queOr1xuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOemu+W8gOWcuuaZr1xuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIG9uTGVhdmUoKTogdm9pZCB7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvZPlnLrmma/ooqvplIDmr4HnmoTml7blgJlcbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBvbkNsZWFuKCk6IHZvaWQge1xuXG4gICAgICAgIH1cblxuICAgIH1cbn0iLCJpbXBvcnQgeyBEYXRhTWFuYWdlciB9IGZyb20gJy4uL2RhdGEvZGF0YS1tYW5hZ2VyJztcbmltcG9ydCB7IERhdGFCYXNlIH0gZnJvbSAnLi4vZGF0YS9kYXRhLWJhc2UnO1xuXG5leHBvcnQgbW9kdWxlIEN1c3RvbVZpZXd7XG5cbiAgICAvKipcbiAgICAgKiBAYXV0aG9yIFN1blxuICAgICAqIEB0aW1lIDIwMTktMDgtMDkgMTU6NTFcbiAgICAgKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcbiAgICAgKiBAZGVzY3JpcHRpb24gIFVJ57uE5Lu255qE5Z+657G777yM57un5om/6IeqTGF5YS5WaWV3XG4gICAgICpcbiAgICAgKi9cbiAgICBleHBvcnQgY2xhc3MgVmlld0Jhc2UgZXh0ZW5kcyBMYXlhLlZpZXcge1xuXG4gICAgICAgIC8q5omA5pyJ5pWw5o2u6KeC5a+f6ICFKi9cbiAgICAgICAgcHJvdGVjdGVkIGRhdGFXYXRjaHM6IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICAgICAgICBwdWJsaWMgZGF0YTogYW55ID0gbnVsbDtcblxuICAgICAgICAvL292ZXJyaWRlXG4gICAgICAgIGNyZWF0ZVZpZXcodmlldzogYW55KTogdm9pZCB7XG4gICAgICAgICAgICBzdXBlci5jcmVhdGVWaWV3KHZpZXcpO1xuICAgICAgICAgICAgdGhpcy5mdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB0aGlzLnBhcnNlRWxlbWVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25EaXNhYmxlKCk6IHZvaWQge1xuXG4gICAgICAgICAgICB0aGlzLmRhdGFXYXRjaHMuZm9yRWFjaCgoY21kOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci4kLnJlbW92ZUV2ZW50TGlzdGVuZXIoY21kLCB0aGlzLm9uRGF0YSwgdGhpcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDog4zmma/lm77pgILlupRcbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBwYXJzZUVsZW1lbnQoKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAodGhpc1tcImltZ0JnXCJdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgaW1nQmcgPSB0aGlzW1wiaW1nQmdcIl0gYXMgTGF5YS5TcHJpdGVcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGxTY3JlZW4oaW1nQmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWcqOWcuuaZr+S4reWxheS4ree7hOS7tlxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIGNlbnRlcih2aWV3PzogTGF5YS5TcHJpdGUpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmICh2aWV3ID09IG51bGwpIHZpZXcgPSB0aGlzO1xuICAgICAgICAgICAgdmlldy54ID0gTWF0aC5yb3VuZCgoKExheWEuc3RhZ2Uud2lkdGggLSB2aWV3LndpZHRoKSA+PiAxKSArIHZpZXcucGl2b3RYKTtcbiAgICAgICAgICAgIHZpZXcueSA9IE1hdGgucm91bmQoKChMYXlhLnN0YWdlLmhlaWdodCAtIHZpZXcuaGVpZ2h0KSA+PiAxKSArIHZpZXcucGl2b3RZKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7lpKflsI/kuLrlhajlsY9cbiAgICAgICAgICogQHBhcmFtIHZpZXcgTGF5YS5TcHJpdGVcbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBmdWxsU2NyZWVuKHZpZXc/OiBMYXlhLlNwcml0ZSk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHZpZXcgPT0gbnVsbCkgdmlldyA9IHRoaXM7XG4gICAgICAgICAgICB2aWV3LndpZHRoID0gTGF5YS5zdGFnZS53aWR0aDtcbiAgICAgICAgICAgIHZpZXcuaGVpZ2h0ID0gTGF5YS5zdGFnZS5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog57uR5a6a5pWw5o2u55uR5ZCsXG4gICAgICAgICAqIEBwYXJhbSBjbWQg55uR5ZCs57G75Z6LXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgYWRkRGF0YVdhdGNoKGNtZDogc3RyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFXYXRjaHMucHVzaChjbWQpO1xuICAgICAgICAgICAgRGF0YU1hbmFnZXIuJC5hZGRFdmVudExpc3RlbmVyKGNtZCwgdGhpcy5vbkRhdGEsIHRoaXMpO1xuICAgICAgICAgICAgRGF0YU1hbmFnZXIuJC5nZXQoY21kKS5ub3RpZnkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvZPmlbDmja7liLfmlrDmmK/ph43nu5hcbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBvbkRhdGEoZGF0YTogRGF0YUJhc2UpIHtcbiAgICAgICAgICAgIC8vIGlmIChkYXRhLmNtZCA9PSBEYXRhRGVmaW5lLkNvaW5JbmZvKXtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5re75Yqg5Yiw55S75biDXG4gICAgICAgICAqIEBwYXJhbSBkYXRhIOaVsOaNriBcbiAgICAgICAgICovXG4gICAgICAgIGFkZChkYXRhOiBhbnkgPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaYvuekunZpZXdcbiAgICAgICAgICovXG4gICAgICAgIHNob3coKTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmakOiXj3ZpZXdcbiAgICAgICAgICovXG4gICAgICAgIGhpZGUoKTp2b2lke1xuICAgICAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgIH1cbn1cbiIsImltcG9ydCB7IEV2ZW50Tm9kZSB9IGZyb20gJy4uL21hbmFnZXIvZXZlbnQvZXZlbnQtbm9kZSc7XG5pbXBvcnQgeyBDb25maWdMYXlvdXQsIENvbmZpZ1VJLCBDb25maWdEZWJ1ZywgQ29uZmlnR2FtZSwgQ29uZmlnVmVyc2lvbiwgQ29uZmlnUmVzIH0gZnJvbSAnLi4vc2V0dGluZy9jb25maWcnO1xuaW1wb3J0IHsgTG9nIH0gZnJvbSAnLi4vY29yZS9sb2cnO1xuaW1wb3J0IHsgVXRpbFRpbWUgfSBmcm9tICcuLi91dGlsL3RpbWUnO1xuaW1wb3J0IHsgZW51bURpbWVuc2lvbiwgZW51bUFsaWdlLCBlbnVtU2NyZWVuTW9kZWwsIGVudW1TY2FsZVR5cGUgfSBmcm9tICcuLi9zZXR0aW5nL2VudW0nO1xuaW1wb3J0IEJyb3dzZXIgPSBMYXlhLkJyb3dzZXI7XG5pbXBvcnQgeyBSZXNNYW5hZ2VyIH0gZnJvbSAnLi4vbWFuYWdlci9yZXMvcmVzLW1hbmFnZXInO1xuaW1wb3J0IHsgRXZlbnRGdW5jIH0gZnJvbSAnLi4vbWFuYWdlci9ldmVudC9ldmVudC1kYXRhJztcbmltcG9ydCB7IExvYWRpbmdWaWV3IH0gZnJvbSAnLi4vLi4vY2xpZW50L3ZpZXcvbGF5ZXItdmlldy9sb2FkaW5nLXZpZXcnO1xuaW1wb3J0IHsgRGF0YU1hbmFnZXIgfSBmcm9tICcuLi9tYW5hZ2VyL2RhdGEvZGF0YS1tYW5hZ2VyJztcbmltcG9ydCB7IEV2ZW50TWFuYWdlciB9IGZyb20gJy4uL21hbmFnZXIvZXZlbnQvZXZlbnQtbWFuYWdlcic7XG5pbXBvcnQgeyBKc29uTWFuYWdlciB9IGZyb20gJy4uL21hbmFnZXIvanNvbi9qc29uLW1hbmFnZXInO1xuaW1wb3J0IHsgU291bmRNYW5hZ2VyIH0gZnJvbSAnLi4vbWFuYWdlci9zb3VuZC9zb3VuZC1tYW5hZ2VyJztcbmltcG9ydCB7IFRpbWVyTWFuYWdlciB9IGZyb20gJy4uL21hbmFnZXIvdGltZXIvdGltZXItbWFuYWdlcic7XG4vKipcbiAqIEBhdXRob3IgU3VuXG4gKiBAdGltZSAyMDE5LTA4LTExIDE4OjA4XG4gKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcbiAqIEBkZXNjcmlwdGlvbiDmoYbmnrbliJ3lp4vljJblkozmuLjmiI/lhaXlj6NcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBFbmdpbmV7XG5cblxuICAgIHB1YmxpYyBsYXlvdXQ6IENvbmZpZ0xheW91dCA9IENvbmZpZ0xheW91dC4kO1xuICAgIHB1YmxpYyBnYW1lOiBDb25maWdHYW1lID0gQ29uZmlnR2FtZS4kO1xuICAgIHB1YmxpYyB1aTogQ29uZmlnVUkgPSBDb25maWdVSS4kO1xuICAgIHB1YmxpYyBkZWJ1ZzogQ29uZmlnRGVidWcgPSBDb25maWdEZWJ1Zy4kO1xuXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogRW5naW5lID0gbnVsbDtcbiAgICBwdWJsaWMgc3RhdGljIGdldCAkKCk6IEVuZ2luZSB7XG4gICAgICAgIGlmICh0aGlzLmluc3RhbmNlPT1udWxsKSB0aGlzLmluc3RhbmNlID0gbmV3IEVuZ2luZSgpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlvJXmk47lkK/liqjlhaXlj6NcbiAgICAgKi9cbiAgICBwdWJsaWMgcnVuKCk6IHZvaWQge1xuICAgICAgICBMb2cuaW5mbyhcIjo6OiBHYW1lIEVuZ2luZSBSdW4gOjo6XCIpO1xuXG4gICAgICAgIGlmIChDb25maWdVSS4kLmRlZmF1bHRMb2FkVmlldyAhPSBudWxsICYmIENvbmZpZ1Jlcy4kLmRlZmF1bHRMb2FkUmVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZW5naW5lU2V0dXAoKCk9PntcbiAgICAgICAgICAgICAgICAvL+a4uOaIj+W8gOWni1xuICAgICAgICAgICAgICAgIFV0aWxUaW1lLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgLy/liJ3lp4vljJbmuLjmiI/nrqHnkIblmahcbiAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXJTZXRVcCgpO1xuICAgICAgICAgICAgICAgIC8v5Yid5aeL5YyW5ri45oiP5Li75b6q546vXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5mcmFtZUxvb3AoMSwgdGhpcywgdGhpcy5tYW5hZ2VyVXBkYXRlKTtcbiAgICAgICAgICAgICAgICAvL+WKoOi9vUxvYWRpbmfpobXnmoTpu5jorqTotYTmupDlubbmmL7npLpMb2FkaW5n6aG1XG4gICAgICAgICAgICAgICAgUmVzTWFuYWdlci4kLmxvYWRHcm91cChDb25maWdSZXMuJC5kZWZhdWx0TG9hZFJlcyxudWxsLG5ldyBFdmVudEZ1bmModGhpcywoKT0+e1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2NycHQgPSBDb25maWdVSS4kLmRlZmF1bHRMb2FkVmlldztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjcnB0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxvYWRpbmdWaWV3ID0gbmV3IHNjcnB0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKGxvYWRpbmdWaWV3KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRpbmdWaWV3Lm9uU3RhcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICBMb2cuZXJyb3IoXCJFcnJvcjpMb2FkaW5n6LWE5rqQ5Li656m65Yqg6L295aSx6LSl77yBXCIpO1xuICAgICAgICB9XG4gICAgICAgXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5byV5pOO55qE5Yid5aeL5YyW6K6+572uXG4gICAgICovXG4gICAgcHJpdmF0ZSBlbmdpbmVTZXR1cChzdGFydENhbGxiYWNrKVxuICAgIHtcbiAgICAgICAgLyoq5Yid5aeL5YyWTGF5YSAqL1xuICAgICAgICBpZiAodGhpcy5nYW1lLmRpbWVuc2lvbiA9PSBlbnVtRGltZW5zaW9uLkRpbTMpIHtcbiAgICAgICAgICAgIExheWEzRC5pbml0KENvbmZpZ0xheW91dC4kLmRlc2lnbldpZHRoLCBDb25maWdMYXlvdXQuJC5kZXNpZ25IZWlnaHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgTGF5YS5pbml0KENvbmZpZ0xheW91dC4kLmRlc2lnbldpZHRoLCBDb25maWdMYXlvdXQuJC5kZXNpZ25IZWlnaHQsIExheWEuV2ViR0wpO1xuICAgICAgICB9XG4gICAgICAgIC8qKuiDjOaZr+minOiJsiAqL1xuICAgICAgICBMYXlhLnN0YWdlLmJnQ29sb3IgPSBcIm5vbmVcIjtcbiAgICAgICAgLyoq57yp5pS+5qih5byPICovXG4gICAgICAgIExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gZW51bVNjYWxlVHlwZS5TY2FsZVNob3dBbGwudG9TdHJpbmcoKTtcbiAgICAgICAgLyoq6K6+572u5bGP5bmV5aSn5bCPICovXG4gICAgICAgIExheWEuc3RhZ2Uuc2V0U2NyZWVuU2l6ZShCcm93c2VyLmNsaWVudFdpZHRoLCBCcm93c2VyLmNsaWVudEhlaWdodCk7XG4gICAgICAgIC8qKuiuvue9ruaoquerluWxjyAqL1xuICAgICAgICBMYXlhLnN0YWdlLnNjcmVlbk1vZGUgPSBlbnVtU2NyZWVuTW9kZWwuU2NyZWVuTm9uZTtcbiAgICAgICAgLyoq5rC05bmz5a+56b2Q5pa55byPICovXG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25IID0gZW51bUFsaWdlLkFsaWdlQ2VudGVyO1xuICAgICAgICAvKirlnoLnm7Tlr7npvZDmlrnlvI8gKi9cbiAgICAgICAgTGF5YS5zdGFnZS5hbGlnblYgPSBlbnVtQWxpZ2UuQWxpZ2VNaWRkbGU7XG4gICAgICAgIC8qKuW8gOWQr+eJqeeQhuW8leaTjiAqL1xuICAgICAgICBpZihDb25maWdHYW1lLiQucGh5c2ljcykgTGF5YVtcIlBoeXNpY3NcIl0gJiYgTGF5YVtcIlBoeXNpY3NcIl0uZW5hYmxlKCk7XG5cdFx0Lyoq5omT5byA6LCD6K+V6Z2i5p2/77yI6YCa6L+HSURF6K6+572u6LCD6K+V5qih5byP77yM5oiW6ICFdXJs5Zyw5Z2A5aKe5YqgZGVidWc9dHJ1ZeWPguaVsO+8jOWdh+WPr+aJk+W8gOiwg+ivlemdouadv++8iSAqL1xuICAgICAgICBpZiAoQ29uZmlnRGVidWcuJC5pc0VuYWJsZURlYnVnUGFuZWwgfHwgTGF5YS5VdGlscy5nZXRRdWVyeVN0cmluZyhcImRlYnVnXCIpID09IFwidHJ1ZVwiKSBMYXlhLmVuYWJsZURlYnVnUGFuZWwoKTtcbiAgICAgICAgLyoq54mp55CG6L6F5Yqp57q/ICovXG4gICAgICAgIGlmIChDb25maWdEZWJ1Zy4kLmlzUGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcbiAgICAgICAgLyoq5oCn6IO95ZCM57qn6Z2i5p2/ICovXG4gICAgICAgIGlmIChDb25maWdEZWJ1Zy4kLmlzU3RhdCkgTGF5YS5TdGF0LnNob3coQ29uZmlnRGVidWcuJC5wYW5lbFgsQ29uZmlnRGVidWcuJC5wYW5lbFkpO1xuICAgICAgICAvKirlvq7kv6HlvIDmlL7ln5/lrZDln5/orr7nva4qL1xuICAgICAgICBpZiAoQnJvd3Nlci5vbldlaVhpbiB8fCBCcm93c2VyLm9uTWluaUdhbWUpIHtcbiAgICAgICAgICAgIExheWEuTWluaUFkcHRlci5pbml0KCk7XG4gICAgICAgICAgICBMYXlhLmlzV1hPcGVuRGF0YUNvbnRleHQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvKirmqKHlvI/nqpflj6Pngrnlh7vovrnnvJggKi9cbiAgICAgICAgVUlDb25maWcuY2xvc2VEaWFsb2dPblNpZGUgPSB0cnVlO1xuICAgICAgICAvKirmmK/lkKbmmL7npLrmu5rliqjmnaHmjInpkq4gKi9cbiAgICAgICAgVUlDb25maWcuc2hvd0J1dHRvbnMgPSB0cnVlO1xuICAgICAgICAvKirmjInpkq7nmoTngrnlh7vmlYjmnpwgKi9cbiAgICAgICAgVUlDb25maWcuc2luZ2xlQnV0dG9uU3R5bGUgPSBcInNjYWxlXCI7IC8vXCJjb2xvclwiLFwic2NhbGVcIlxuICAgICAgICAvKirlvLnlh7rmoYbog4zmma/pgI/mmI7luqYgKi9cbiAgICAgICAgVUlDb25maWcucG9wdXBCZ0FscGhhID0gMC43NTtcbiAgICAgICAgLyoq5YW85a65U2NlbmXlkI7nvIDlnLrmma8gKi9cbiAgICAgICAgTGF5YS5VUkwuZXhwb3J0U2NlbmVUb0pzb24gPSB0cnVlO1xuICAgICAgICAvKirmmK/lkKblvIDlkK/niYjmnKznrqHnkIYgKi9cbiAgICAgICAgaWYoQ29uZmlnVmVyc2lvbi4kLmlzT3BlblZlcnNpb24pe1xuICAgICAgICAgICAgTGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKENvbmZpZ1ZlcnNpb24uJC52ZXJzaW9uRmxvZGVyLFxuICAgICAgICAgICAgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCBzdGFydENhbGxiYWNrKSwgTGF5YS5SZXNvdXJjZVZlcnNpb24uRklMRU5BTUVfVkVSU0lPTik7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgc3RhcnRDYWxsYmFjay5jYWxsKCk7XG4gICAgICAgIH1cbiAgICAgICBcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOeuoeeQhuWZqOeahOWIneWni+WMllxuICAgICAqL1xuICAgIHByaXZhdGUgIG1hbmFnZXJTZXRVcCgpOiB2b2lkIHtcbiAgICAgICAgRGF0YU1hbmFnZXIuJC5zZXR1cCgpO1xuICAgICAgICBFdmVudE1hbmFnZXIuJC5zZXR1cCgpO1xuICAgICAgICBSZXNNYW5hZ2VyLiQuc2V0dXAoKTtcbiAgICAgICAgSnNvbk1hbmFnZXIuJC5zZXR1cCgpO1xuICAgICAgICBTb3VuZE1hbmFnZXIuJC5zZXR1cCgpO1xuICAgICAgICBUaW1lck1hbmFnZXIuJC5zZXR1cCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOeuoeeQhuWZqOeahFVwZGF0ZVxuICAgICAqL1xuICAgIHByaXZhdGUgbWFuYWdlclVwZGF0ZSgpOiB2b2lkIHtcbiAgICAgICBcbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJvd3NlciA9IGxheWEudXRpbHMuQnJvd3NlcjtcbmltcG9ydCB7IGVudW1EaW1lbnNpb24sIGVudW1TY2FsZVR5cGUsIGVudW1Kc29uRGVmaW5lLCBlbnVtU291bmROYW1lIH0gZnJvbSAnLi9lbnVtJztcbmltcG9ydCB7IFNpbmdsZXRvbiB9IGZyb20gJy4uL2NvcmUvc2luZ2xldG9uJztcbmltcG9ydCB7IE1haW5TY2VuZSB9IGZyb20gJy4uLy4uL2NsaWVudC9zY2VuZS9tYWluLXNjZW5lJztcbmltcG9ydCB7IFJlc0dyb3VwIH0gZnJvbSAnLi4vbWFuYWdlci9yZXMvcmVzLWdyb3VwJztcbmltcG9ydCB7IExvYWRpbmdWaWV3IH0gZnJvbSAnLi4vLi4vY2xpZW50L3ZpZXcvbGF5ZXItdmlldy9sb2FkaW5nLXZpZXcnO1xuaW1wb3J0IHsgSnNvblRlbXBsYXRlIH0gZnJvbSAnLi4vbWFuYWdlci9qc29uL2pzb24tdGVtcGxhdGUnO1xuaW1wb3J0IHsgU291bmRUZW1wbGF0ZSB9IGZyb20gJy4uL21hbmFnZXIvc291bmQvc291bmQtdGVtcGxhdGUnO1xuIC8qKlxuICogQGF1dGhvciBTdW5cbiAqIEB0aW1lIDIwMTktMDgtMDkgMTQ6MDFcbiAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICogQGRlc2NyaXB0aW9uIOa4uOaIj+mFjee9ruS/oeaBr1xuICovXG5cblxuLyoqXG4gKiDnlYzpnaLphY3nva5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbmZpZ1VJIGV4dGVuZHMgU2luZ2xldG9uIHtcblxuICAgIC8qKum7mOiupOWtl+S9kyAqL1xuICAgIHB1YmxpYyBkZWZhdWx0Rm9udE5hbWU6IHN0cmluZyA9ICfpu5HkvZMnO1xuICAgIC8qKum7mOiupOWtl+S9k+Wkp+WwjyAqL1xuICAgIHB1YmxpYyBkZWZhdWx0Rm9udFNpemU6IG51bWJlciA9IDE2O1xuICAgIC8qKum7mOiupOWKoOi9veWcuuaZryAqL1xuICAgIHB1YmxpYyBkZWZhdWx0TWFpblNjZW5lOiBhbnkgPSBNYWluU2NlbmU7XG4gICAgLyoq6buY6K6k5Yqg6L2955qETG9hZGluZ+mhtemdoiAqL1xuICAgIHB1YmxpYyBkZWZhdWx0TG9hZFZpZXc6IGFueSA9IExvYWRpbmdWaWV3O1xuICAgXG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogQ29uZmlnVUkgPSBudWxsO1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0ICQoKTpDb25maWdVSSB7XG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZSkgdGhpcy5pbnN0YW5jZSA9IG5ldyBDb25maWdVSSgpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICB9XG4gICBcbn1cblxuLyoqXG4gKiDotYTmupDphY3nva5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbmZpZ1JlcyBleHRlbmRzIFNpbmdsZXRvbntcblxuICAgIC8qKum7mOiupExvYWRpbmfpobXpnaLnmoTotYTmupDkv6Hmga8gKi9cbiAgICBwdWJsaWMgZGVmYXVsdExvYWRSZXM6IFJlc0dyb3VwID0gbnVsbDtcbiAgICAvKirpu5jorqTnmoTln7rnoYDpobXpnaLotYTmupDkv6Hmga8gKi9cbiAgICBwdWJsaWMgZGVmYXVsdE1haW5SZXM6UmVzR3JvdXAgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IENvbmZpZ1JlcyA9IG51bGw7XG4gICAgcHVibGljIHN0YXRpYyBnZXQgJCgpOkNvbmZpZ1JlcyB7XG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZSkgdGhpcy5pbnN0YW5jZSA9IG5ldyBDb25maWdSZXMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAvL+aJi+WKqOmFjee9rmxvYWRpbmfotYTmupBcbiAgICAgICAgdGhpcy5kZWZhdWx0TG9hZFJlcyA9IG5ldyBSZXNHcm91cCgpO1xuICAgICAgICB0aGlzLmRlZmF1bHRMb2FkUmVzXG4gICAgICAgIC5hZGQoXCJyZXMvbG9hZGluZy9pbWdfbG9hZGluZ19iZy5wbmdcIixMYXlhLkxvYWRlci5JTUFHRSlcbiAgICAgICAgLmFkZChcInJlcy9sb2FkaW5nL3Byb2dyZXNzX2xvYWRpbmcucG5nXCIsTGF5YS5Mb2FkZXIuSU1BR0UpXG4gICAgICAgIC5hZGQoXCJyZXMvbG9hZGluZy9pbWdfOHIucG5nXCIsTGF5YS5Mb2FkZXIuSU1BR0UpO1xuICAgICAgICAvL+aJi+WKqOmFjee9ruS4u+mhtei1hOa6kFxuICAgICAgICB0aGlzLmRlZmF1bHRNYWluUmVzID0gbmV3IFJlc0dyb3VwKCk7XG4gICAgICAgIHRoaXMuZGVmYXVsdE1haW5SZXNcbiAgICAgICAgLmFkZChcInJlcy9hdGxhcy9yZXMvbWFpbi9lZmZlY3QuYXRsYXNcIiwgTGF5YS5Mb2FkZXIuQVRMQVMpXG4gICAgICAgIC5hZGQoXCJyZXMvYXRsYXMvcmVzL2NvbS5hdGxhc1wiLCBMYXlhLkxvYWRlci5BVExBUylcbiAgICAgICAgLmFkZChcInJlcy9jb20vaW1nX2xvdHRlcnlfYm9yZGVyLnBuZ1wiLCBMYXlhLkxvYWRlci5JTUFHRSlcbiAgICAgICAgLmFkZChcInJlcy9jb20vaW1nX2xvdHRlcnlfY29udGVudC5wbmdcIiwgTGF5YS5Mb2FkZXIuSU1BR0UpXG4gICAgICAgIC5hZGQoXCJyZXMvbWFpbi9iZy9iZy5wbmdcIiwgTGF5YS5Mb2FkZXIuSU1BR0UpXG4gICAgICAgIC8v5Yqg6L29SnNvbumFjee9ruaWh+S7tlxuICAgICAgICBDb25maWdEYXRhLiQuanNvblRlbXBsYXRlTGlzdC5mb3JFYWNoKGl0ZW09PntcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdE1haW5SZXNcbiAgICAgICAgICAgIC5hZGQoaXRlbS51cmwsIExheWEuTG9hZGVyLkpTT04pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy/liqDovb3pn7PmlYjotYTmupBcbiAgICAgICAgQ29uZmlnU291bmQuJC5zb3VuZFJlc0xpc3QuZm9yRWFjaChpdGVtPT57XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRNYWluUmVzXG4gICAgICAgICAgICAuYWRkKGl0ZW0udXJsLCBMYXlhLkxvYWRlci5TT1VORCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiDlo7Dpn7PphY3nva5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbmZpZ1NvdW5kIGV4dGVuZHMgU2luZ2xldG9uIHtcblxuICAgIC8qKuiDjOaZr+mfs+S5kOWQjeWtlyAqL1xuICAgIHB1YmxpYyBiZ1NvdW5kTmFtZSA9IFwiXCI7XG4gICAgLyoq6IOM5pmv6Z+z5byA5YWzICovXG4gICAgcHVibGljIGlzQ2xvc2VCR1NvdW5kID0gZmFsc2U7XG4gICAgLyoq5pWI5p6c6Z+z5byA5YWzICovXG4gICAgcHVibGljIGlzQ2xvc2VFZmZlY3RTb3VuZCA9IGZhbHNlO1xuICAgIC8qKuaJgOaciemfs+aViOW8gOWFsyAqL1xuICAgIHB1YmxpYyBpc0Nsb3NlVm9pY2VTb3VuZCA9IGZhbHNlO1xuICAgIC8qKuaAu+mfs+mHjyAqL1xuICAgIHB1YmxpYyB2b2x1bWVWb2ljZVNvdW5kID0gMTtcbiAgICAvKirpn7PmlYjotYTmupAgKi9cbiAgICBwdWJsaWMgc291bmRSZXNMaXN0OkFycmF5PFNvdW5kVGVtcGxhdGU+ID0gbnVsbDtcbiAgXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IENvbmZpZ1NvdW5kID0gbnVsbDtcbiAgICBwdWJsaWMgc3RhdGljIGdldCAkKCk6Q29uZmlnU291bmQge1xuICAgICAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHRoaXMuaW5zdGFuY2UgPSBuZXcgQ29uZmlnU291bmQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoKVxuICAgIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zb3VuZFJlc0xpc3QgPSBuZXcgQXJyYXk8U291bmRUZW1wbGF0ZT4oKTtcbiAgICAgICAgLy8gdGhpcy5zb3VuZFJlc0xpc3QucHVzaChuZXcgU291bmRUZW1wbGF0ZShcInJlcy9zb3VuZC9iZy5tcDNcIixlbnVtU291bmROYW1lLmJnKSk7XG4gICAgfVxufVxuXG4vKipcbiAqIOaVsOaNruihqOmFjee9rlxuICovXG5leHBvcnQgY2xhc3MgQ29uZmlnRGF0YSBleHRlbmRzIFNpbmdsZXRvbntcblxuICAgIC8qKmpzb27phY3nva7ooajkv6Hmga8gKi9cbiAgICBwdWJsaWMganNvblRlbXBsYXRlTGlzdDpBcnJheTxKc29uVGVtcGxhdGU+O1xuXG4gICAgY29uc3RydWN0b3IoKVxuICAgIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5qc29uVGVtcGxhdGVMaXN0ID0gbmV3IEFycmF5PEpzb25UZW1wbGF0ZT4oKTtcbiAgICAgICAgdGhpcy5qc29uVGVtcGxhdGVMaXN0ID0gW1xuICAgICAgICAgICAgbmV3IEpzb25UZW1wbGF0ZShcInJlcy9kYXRhL0ludml0ZURhdGEuanNvblwiLCBlbnVtSnNvbkRlZmluZS5pbnZpdGUpLFxuICAgICAgICAgICAgbmV3IEpzb25UZW1wbGF0ZShcInJlcy9kYXRhL0xldmVsRGF0YS5qc29uXCIsIGVudW1Kc29uRGVmaW5lLmxldmVsKSxcbiAgICAgICAgICAgIG5ldyBKc29uVGVtcGxhdGUoXCJyZXMvZGF0YS9PZmZsaW5lRGF0YS5qc29uXCIsIGVudW1Kc29uRGVmaW5lLm9mZmxpbmUpLFxuICAgICAgICAgICAgbmV3IEpzb25UZW1wbGF0ZShcInJlcy9kYXRhL1R1cm50YWJsZURhdGEuanNvblwiLCBlbnVtSnNvbkRlZmluZS5sb3R0ZXJ5KSxcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogQ29uZmlnRGF0YSA9IG51bGw7XG4gICAgcHVibGljIHN0YXRpYyBnZXQgJCgpOkNvbmZpZ0RhdGEge1xuICAgICAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHRoaXMuaW5zdGFuY2UgPSBuZXcgQ29uZmlnRGF0YSgpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICB9XG59XG5cbi8qKlxuICog5ri45oiP6YWN572uXG4gKi9cbmV4cG9ydCBjbGFzcyBDb25maWdHYW1lIGV4dGVuZHMgU2luZ2xldG9uIHtcbiBcbiAgICAvKirpu5jorqTmqKHlvI/kv6Hmga8gMkQvM0QgKi9cbiAgICBwdWJsaWMgZGltZW5zaW9uOiBlbnVtRGltZW5zaW9uID0gZW51bURpbWVuc2lvbi5EaW0zO1xuICAgIC8qKueJqeeQhuW8gOWFsyAqL1xuICAgIHB1YmxpYyBwaHlzaWNzOmJvb2xlYW4gPSBmYWxzZTtcbiAgXG4gICAgXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IENvbmZpZ0dhbWUgPSBudWxsO1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0ICQoKTpDb25maWdHYW1lIHtcbiAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlKSB0aGlzLmluc3RhbmNlID0gbmV3IENvbmZpZ0dhbWUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgfVxufVxuXG4vKipcbiAqIOeJiOacrOmFjee9rlxuICovXG5leHBvcnQgY2xhc3MgQ29uZmlnVmVyc2lvbiBleHRlbmRzIFNpbmdsZXRvbiB7XG4gXG4gICAgLyoq54mI5pys5o6n5Yi25byA5YWzICovXG4gICAgcHVibGljIGlzT3BlblZlcnNpb246Ym9vbGVhbiA9IGZhbHNlO1xuICAgIC8qKueJiOacrOWPtyAqL1xuICAgIHB1YmxpYyB2ZXJzaW9uTnVtOm51bWJlciA9IDA7XG4gICAgLyoq54mI5pys5o6n5Yi25paH5Lu25ZCNICovXG4gICAgcHVibGljIHZlcnNpb25GbG9kZXI6c3RyaW5nID0gXCJWZXJzaW9uXCIrdGhpcy52ZXJzaW9uTnVtO1xuICAgIFxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBDb25maWdWZXJzaW9uID0gbnVsbDtcbiAgICBwdWJsaWMgc3RhdGljIGdldCAkKCk6Q29uZmlnVmVyc2lvbiB7XG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZSkgdGhpcy5pbnN0YW5jZSA9IG5ldyBDb25maWdWZXJzaW9uKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cbn1cblxuXG4vKipcbiAqIOW4g+WxgOmFjee9rlxuICovXG5leHBvcnQgY2xhc3MgQ29uZmlnTGF5b3V0IGV4dGVuZHMgU2luZ2xldG9uIHtcblxuICAgIC8qKuiuvuiuoeWIhui+qOeOh1ggKi9cbiAgICBwdWJsaWMgZGVzaWduV2lkdGg6IG51bWJlciA9IDc1MDtcbiAgICAvKirorr7orqHliIbovqjnjodZICovXG4gICAgcHVibGljIGRlc2lnbkhlaWdodDogbnVtYmVyID0gMTMzNDtcbiAgICAvKirnvKnmlL7mqKHlvI8gKi9cbiAgICBwdWJsaWMgc2NhbGVNb2RlOiBlbnVtU2NhbGVUeXBlID0gZW51bVNjYWxlVHlwZS5TY2FsZUZpeGVkQXV0bztcblxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBDb25maWdMYXlvdXQgPSBudWxsO1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0ICQoKTpDb25maWdMYXlvdXQge1xuICAgICAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHRoaXMuaW5zdGFuY2UgPSBuZXcgQ29uZmlnTGF5b3V0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cblxufVxuXG5cbi8qKlxuICogRGVidWfphY3nva5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbmZpZ0RlYnVnIGV4dGVuZHMgU2luZ2xldG9uIHtcblxuICAgIC8qKuiwg+ivleS/oeaBr+W8gOWFsyAqL1xuICAgIHB1YmxpYyBpc0RlYnVnOiBib29sZWFuID0gdHJ1ZTtcbiAgICAvKirniannkIbovoXliqnnur/lvIDlhbMgKi9cbiAgICBwdWJsaWMgaXNQaHlzaWNzRGVidWc6IGJvb2xlYW4gPSBmYWxzZTsgXG4gICAgLyoq6LCD6K+V6Z2i5p2/ICovXG4gICAgcHVibGljIGlzRW5hYmxlRGVidWdQYW5lbDpib29sZWFuID0gZmFsc2U7XG4gICAgLyoq5oCn6IO96Z2i5p2/5byA5YWzICovXG4gICAgcHVibGljIGlzU3RhdDogYm9vbGVhbiA9IHRydWU7XG4gICAgLyoq5oCn6IO957uf6K6h6Z2i5p2/WCAqL1xuICAgIHB1YmxpYyBwYW5lbFg6bnVtYmVyID0gMDtcbiAgICAvKirmgKfog73nu5/orqHpnaLmnb9ZICovXG4gICAgcHVibGljIHBhbmVsWTpudW1iZXIgPSAxMDA7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogQ29uZmlnRGVidWcgPSBudWxsO1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0ICQoKTpDb25maWdEZWJ1ZyB7XG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZSkgdGhpcy5pbnN0YW5jZSA9IG5ldyBDb25maWdEZWJ1ZygpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICB9XG59XG5cbi8qKlxuICogM0TphY3nva5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbmZpZzNEIGV4dGVuZHMgU2luZ2xldG9ue1xuXG4gICAgLyoq5Zy65pmv6LWE5rqQ6Lev5b6EICovXG4gICAgcHVibGljIHNjZW5lUGF0aDpzdHJpbmcgPSBcInJlcy91M2QvTGF5YVNjZW5lX01haW4vQ29udmVudGlvbmFsL01haW4ubHNcIjtcblxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBDb25maWczRCA9IG51bGw7XG4gICAgcHVibGljIHN0YXRpYyBnZXQgJCgpOkNvbmZpZzNEIHtcbiAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlKSB0aGlzLmluc3RhbmNlID0gbmV3IENvbmZpZzNEKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cbn1cblxuXG5cbi8vIC8qKlxuLy8gICogTmV0d29ya+mFjee9rlxuLy8gICovXG4vLyBleHBvcnQgY2xhc3MgQ29uZmlnTmV0IGV4dGVuZHMgU2luZ2xldG9uIHtcblxuLy8gICAgIHB1YmxpYyBodHRwVXJsOiBzdHJpbmcgPSBcImh0dHA6Ly8xMjcuMC4wLjE6MzQ1NjhcIjtcbi8vICAgICBwdWJsaWMgd3NVcmw6IHN0cmluZyA9IFwid3NzOi8vd3guZG9ub3BvLmNvbS93cy93c1wiO1xuLy8gICAgIHB1YmxpYyByZXNVcmw6IHN0cmluZyA9IFwid3M6Ly8xMjcuMC4wLjE6MTY2NjlcIjtcbi8vICAgICBwdWJsaWMgdGltZU91dDogbnVtYmVyID0gMTA7XG4vLyAgICAgcHVibGljIGhlYXJ0QmVhdDogbnVtYmVyID0gMTA7XG4vLyAgICAgcHVibGljIHNlcnZlckhlYXJ0QmVhdDogbnVtYmVyID0gMztcblxuLy8gICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBDb25maWdOZXQgPSBudWxsO1xuXG4vLyAgICAgcHVibGljIHN0YXRpYyBnZXQgJCgpOkNvbmZpZ05ldCB7XG4vLyAgICAgICAgIGlmICghdGhpcy5pbnN0YW5jZSkgdGhpcy5pbnN0YW5jZSA9IG5ldyBDb25maWdOZXQoKTtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4vLyAgICAgfVxuXG4vLyB9XG5cbi8vIC8qKlxuLy8gICog5b6u5L+h6YWN572uXG4vLyAgKi9cbi8vIGV4cG9ydCBjbGFzcyBDb25mV2VjaGF0IGV4dGVuZHMgU2luZ2xldG9uIHtcblxuLy8gICAgIHB1YmxpYyBhcHBpZDogc3RyaW5nID0gXCJcIjtcbi8vICAgICBwdWJsaWMgc2VjcmV0OiBzdHJpbmcgPSBcIlwiO1xuLy8gICAgIHB1YmxpYyBhZFVuaXRJZDogc3RyaW5nID0gXCJcIjtcbi8vICAgICBwdWJsaWMgY29kZTJzZXNzaW9uVXJsID0gXCJodHRwczovL2FwaS53ZWl4aW4ucXEuY29tL3Nucy9qc2NvZGUyc2Vzc2lvbj9hcHBpZD17MH0mc2VjcmV0PXsxfSZqc19jb2RlPXsyfSZncmFudF90eXBlPWF1dGhvcml6YXRpb25fY29kZVwiO1xuXG5cbi8vICAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogQ29uZldlY2hhdCA9IG51bGw7XG5cbi8vICAgICBwdWJsaWMgc3RhdGljIGdldCAkKCk6Q29uZldlY2hhdCB7XG4vLyAgICAgICAgIGlmICghdGhpcy5pbnN0YW5jZSkgdGhpcy5pbnN0YW5jZSA9IG5ldyBDb25mV2VjaGF0KCk7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuLy8gICAgIH1cbi8vIH1cbiIsIi8qKlxuICog6YeN6KaB55qE5p6a5Li+5a6a5LmJLOahhuaetue6p+WIq1xuICpcbiAqIEBhdXRob3IgVGltIFdhcnNcbiAqIEBkYXRlIDIwMTktMDEtMTggMTY6MjBcbiAqIEBwcm9qZWN0IGZpcmVib2x0XG4gKiBAY29weXJpZ2h0IChDKSBET05PUE9cbiAqXG4gKi9cblxuaW1wb3J0IFN0YWdlID0gTGF5YS5TdGFnZTtcblxuLyoqXG4gKiDoiJ7lj7DnmoTnvKnmlL7moLzlvI9cbiAqL1xuZXhwb3J0IGVudW0gZW51bVNjYWxlVHlwZSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIFNjYWxlTm9TY2FsZSA9IFN0YWdlLlNDQUxFX0ZVTEwsXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIFNjYWxlRXhhY3RGaXQgPSBTdGFnZS5TQ0FMRV9FWEFDVEZJVCxcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgU2NhbGVTaG93QWxsID0gU3RhZ2UuU0NBTEVfU0hPV0FMTCxcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgU2NhbGVOb0JvcmRlciA9IFN0YWdlLlNDQUxFX05PQk9SREVSLFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBTY2FsZUZ1bGwgPSBTdGFnZS5TQ0FMRV9GVUxMLFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBTY2FsZUZpeGVkV2lkdGggPSBTdGFnZS5TQ0FMRV9GSVhFRF9XSURUSCxcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgU2NhbGVGaXhlZEhlaWdodCA9IFN0YWdlLlNDQUxFX0ZJWEVEX0hFSUdIVCxcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgU2NhbGVGaXhlZEF1dG8gPSBTdGFnZS5TQ0FMRV9GSVhFRF9BVVRPLFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBTY2FsZU5vU2NhbGUgPSBTdGFnZS5TQ0FMRV9OT1NDQUxFXG59XG5cbi8qKlxuICog5bGP5bmV55qE6Ieq6YCC5bqU5pa55byPXG4gKi9cbmV4cG9ydCBlbnVtIGVudW1TY3JlZW5Nb2RlbCB7XG4gICAgU2NyZWVuTm9uZSA9ICdub25lJyxcbiAgICBTY3JlZW5Ib3Jpem9udGFsID0gJ2hvcml6b250YWwnLFxuICAgIFNjcmVlblZlcnRpY2FsID0gJ3ZlcnRpY2FsJ1xufVxuXG4vKipcbiAqIOaVsOe7hOaOkuW6j+aWueW8j1xuICogKi9cbmV4cG9ydCBlbnVtIGVudW1BcnJheVNvcnRPcmRlciB7XG4gICAgQXNjZW5kaW5nLFx0Ly/ljYfluo9cbiAgICBEZXNjZW5kaW5nLFx0Ly/pmY3luo9cbn1cblxuLyoqXG4gKiDmuLjmiI/nmoTov5DooYzlrrnlmahcbiAqL1xuZXhwb3J0IGVudW0gZW51bUdhbWVQbGF0Zm9ybSB7XG4gICAgV2ViLFxuICAgIFBob25lLFxuICAgIFdlaXhpblxufVxuXG4vKipcbiAqIOWvuem9kOaWueW8j1xuICovXG5leHBvcnQgZW51bSBlbnVtQWxpZ2VUeXBlIHtcbiAgICBOT05FID0gMCxcbiAgICBSSUdIVCxcbiAgICBSSUdIVF9CT1RUT00sXG4gICAgQk9UVE9NLFxuICAgIExFRlRfQk9UVE9NLFxuICAgIExFRlQsXG4gICAgTEVGVF9UT1AsXG4gICAgVE9QLFxuICAgIFJJR0hUX1RPUCxcbiAgICBNSUQsXG59XG5cbi8qKlxuICog5a+56b2Q5qCH5rOoXG4gKi9cbmV4cG9ydCBlbnVtIGVudW1BbGlnZSB7XG4gICAgQWxpZ2VMZWZ0ID0gJ2xlZnQnLFxuICAgIEFsaWdlQ2VudGVyID0gJ2NlbnRlcicsXG4gICAgQWxpZ2VSaWdodCA9ICdyaWdodCcsXG4gICAgQWxpZ2VUb3AgPSAndG9wJyxcbiAgICBBbGlnZU1pZGRsZSA9ICdtaWRkbGUnLFxuICAgIEFsaWdlQm90dG9tID0gJ2JvdHRvbSdcbn1cblxuLyoqXG4gKiDmuIXnkIbotYTmupDnmoTmrKHluo/nrZbnlaVcbiAqL1xuZXhwb3J0IGVudW0gZW51bUNsZWFyU3RyYXRlZ3kge1xuICAgIEZJRk8gPSAwLCAgIC8v5YWI6L+b5YWI5Ye6XG4gICAgRklMTywgICAgICAgLy/lhYjov5vlkI7lh7pcbiAgICBMUlUsXHRcdC8v5pyA6L+R5pyA5bCR5L2/55SoXG4gICAgVU5fVVNFRCxcdC8v5pyq5L2/55SoXG4gICAgQUxMLFx0XHQvL+a4heeQhuaJgOaciVxufVxuXG4vKipcbiAqIOa4uOaIj+aYr+WQpumHh+eUqOeahDJE5oiW6ICFM0RcbiAqL1xuZXhwb3J0IGVudW0gZW51bURpbWVuc2lvbiB7XG4gICAgRGltMiA9ICcyZCcsXG4gICAgRGltMyA9ICczZCdcbn1cblxuLyoqXG4gKiDmuLjmiI/nmoTnirbmgIFcbiAqL1xuZXhwb3J0IGVudW0gZW51bUdhbWVTdGF0dXMge1xuICAgIFN0YXJ0ID0gJ0dBTUUtU1RBVFVTLVNUQVJUJyxcbiAgICBTdG9wID0gJ0dBTUUtU1RBVFVTLVNUT1AnLFxuICAgIFJlc3RhcnQgPSAnR0FNRS1TVEFUVVMtUkVTVEFSVCcsXG59XG5cbi8qKlxuIGxibCAgLS0tPkxhYmVsKOaWh+acrClcbiB0eHQgIC0tLT5UZXh0KOaWh+acrClcbiBydHh0ICAtLS0+UmljaFRleHQo5a+M5paH5pysKVxuIGlwdCAgLS0tPklucHV0KOi+k+WFpeahhilcbiBpbWcgIC0tLT5JbWFnZSjlm77niYcpXG4gc3B0ICAtLS0+U3ByaXRlKOeyvueBtSlcbiBncmggIC0tLT5HcmFwaCjlm77lvaIpXG4gbGlzdCAtLS0+TGlzdCjliJfooagpXG4gbG9hZCAtLS0+TG9hZCjoo4Xovb3lmagpXG4gZ3VwICAtLS0+R3JvdXAo57uEKVxuIGNvbSAgLS0tPkNvbXBvbmVudCjnu4Tku7YpXG4gYnRuICAtLS0+QnV0dG9uKOaMiemSrilcbiBjb2IgIC0tLT5Db21ib0JvdyjkuIvmi4nmoYYpXG4gcGJhciAtLS0+UHJvZ3Jlc3NCYXIo6L+b5bqm5p2hKVxuIHNsZCAgLS0tPlNsaWRlcijmu5HliqjmnaEpXG4gd2luICAtLS0+V2luZG9377yI56qX5Y+j77yJXG4gYW5pICAtLS0+TW92aWUo5Yqo55S7KVxuIGVmdCAgLS0tPlRyYW5zaXRpb24o5Yqo5pWIKVxuIGN0bCAgLS0tPkNvbnRyb2xsZXIo5o6n5Yi25ZmoKVxuICovXG5cbi8qKlxuICog5o6n5Lu25YmN57yAXG4gKi9cbmV4cG9ydCBlbnVtIGVudW1FbGVtZW50UHJlZml4IHtcbiAgICBMYWJsZSA9ICdsYmxfJyxcbiAgICBJbnB1dCA9ICdpcHRfJyxcbiAgICBUZXh0ID0gJ3R4dF8nLFxuICAgIFJpY2hUZXh0ID0gJ3J0eHRfJyxcbiAgICBJbWFnZSA9ICdpbWdfJyxcbiAgICBTcHJpdGUgPSAnc3B0XycsXG4gICAgR3JhcGggPSAnZ3JoXycsXG4gICAgTGlzdCA9ICdsaXN0XycsXG4gICAgTG9hZCA9ICdsb2FkXycsXG4gICAgR3JvdXAgPSAnZ3VwXycsXG4gICAgQ29tcG9uZW50ID0gJ2NvbV8nLFxuICAgIEJ1dHRvbiA9ICdidG5fJyxcbiAgICBDb21ib0JvdyA9ICdjb2JfJyxcbiAgICBQcm9ncmVzc0JhciA9ICdwYmFyXycsXG4gICAgU2xpZGVyID0gJ3NsZF8nLFxuICAgIFdpbmRvdyA9ICd3aW5fJyxcbiAgICBNb3ZpZSA9ICdhbmlfJyxcbiAgICBUcmFuc2l0aW9uID0gJ2VmdF8nLFxuICAgIENvbnRyb2xsZXIgPSAnY3RsXydcbn1cblxuLyoqXG4gKiDmlbDmja7ooajphY3nva5cbiAqL1xuZXhwb3J0IGVudW0gZW51bUpzb25EZWZpbmUge1xuICAgIGludml0ZSA9IFwiaW52aXRlXCIsXG4gICAgbGV2ZWwgPSBcImxldmVsXCIsXG4gICAgbG90dGVyeSA9IFwibG90dGVyeVwiLFxuICAgIG9mZmxpbmUgPSBcIm9mZmxpbmVcIixcbn1cblxuLyoqXG4gKiDpn7PmlYjmoIforrBcbiAqL1xuZXhwb3J0IGVudW0gZW51bVNvdW5kTmFtZXtcbiAgICBiZyA9IFwiYmdTb3VuZFwiLFxuICAgIGJvdHRvbiA9IFwiYnRuU291bmRcIixcbn1cblxuXG4iLCJpbXBvcnQgeyBVdGlsRGljdCB9IGZyb20gJy4uL3V0aWwvZGljdCc7XG5cbi8qKlxuICogQGF1dGhvciBTdW5cbiAqIEB0aW1lIDIwMTktMDUtMjEgMTk6MjJcbiAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICogQGRlc2NyaXB0aW9uICDlrZflhbhcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBEaWN0aW9uYXJ5PFQ+IHtcblxuICAgIHByaXZhdGUgbV9kaWN0OiBPYmplY3QgPSB7fTtcblxuICAgIHB1YmxpYyBhZGQoa2V5OiBhbnksIHZhbHVlOiBUKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmhhc0tleShrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHRoaXMubV9kaWN0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZShrZXk6IGFueSk6IHZvaWQge1xuICAgICAgICBkZWxldGUgdGhpcy5tX2RpY3Rba2V5XTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaGFzS2V5KGtleTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAodGhpcy5tX2RpY3Rba2V5XSAhPSBudWxsKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdmFsdWUoa2V5OiBhbnkpOiBUIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc0tleShrZXkpKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXMubV9kaWN0W2tleV07XG4gICAgfVxuXG4gICAgcHVibGljIGtleXMoKTogQXJyYXk8YW55PiB7XG4gICAgICAgIGxldCBsaXN0OiBBcnJheTxzdHJpbmcgfCBudW1iZXI+ID0gW107XG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLm1fZGljdCkge1xuICAgICAgICAgICAgbGlzdC5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgcHVibGljIHZhbHVlcygpOiBBcnJheTxUPiB7XG4gICAgICAgIGxldCBsaXN0OiBBcnJheTxUPiA9IFtdO1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5tX2RpY3QpIHtcbiAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLm1fZGljdFtrZXldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLm1fZGljdCkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMubV9kaWN0W2tleV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZm9yZWFjaChjb21wYXJlRm46IChrZXk6IGFueSwgdmFsdWU6IFQpPT52b2lkKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLm1fZGljdCkge1xuICAgICAgICAgICAgY29tcGFyZUZuLmNhbGwobnVsbCwga2V5LCB0aGlzLm1fZGljdFtrZXldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBmb3JlYWNoQnJlYWsoY29tcGFyZUZuOiAoa2V5OmFueSwgdmFsdWU6IFQpID0+IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMubV9kaWN0KSB7XG4gICAgICAgICAgICBpZiAoIWNvbXBhcmVGbi5jYWxsKG51bGwsIGtleSwgdGhpcy5tX2RpY3Rba2V5XSkpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gVXRpbERpY3Quc2l6ZSh0aGlzLm1fZGljdCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgZW51bUFycmF5U29ydE9yZGVyIH0gZnJvbSAnLi4vc2V0dGluZy9lbnVtJztcblxuIC8qKlxuICogQGF1dGhvciBTdW5cbiAqIEB0aW1lIDIwMTktMDgtMDkgMjM6MTVcbiAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICogQGRlc2NyaXB0aW9uIOaVsOe7hOW3peWFt+exu1xuICovXG5leHBvcnQgY2xhc3MgVXRpbEFycmF5IHtcblxuICAgIC8qKiDmj5LlhaXlhYPntKBcbiAgICAgKiBAcGFyYW0gYXJyIOmcgOimgeaTjeS9nOeahOaVsOe7hFxuICAgICAqIEBwYXJhbSB2YWx1ZSDpnIDopoHmj5LlhaXnmoTlhYPntKBcbiAgICAgKiBAcGFyYW0gaW5kZXgg5o+S5YWl5L2N572uXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBpbnNlcnQoYXJyOiBhbnlbXSwgdmFsdWU6IGFueSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoaW5kZXggPiBhcnIubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgYXJyLnB1c2godmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJyLnNwbGljZShpbmRleCwgMCwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKirku47mlbDnu4Tnp7vpmaTlhYPntKAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlKGFycjogYW55W10sIHY6IGFueSk6IHZvaWQge1xuICAgICAgICBsZXQgaTogbnVtYmVyID0gYXJyLmluZGV4T2Yodik7XG4gICAgICAgIGlmIChpICE9IC0xKSB7XG4gICAgICAgICAgICBhcnIuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoq56e76Zmk5omA5pyJ5YC8562J5LqOdueahOWFg+e0oCovXG4gICAgcHVibGljIHN0YXRpYyByZW1vdmVBbGwoYXJyOiBhbnlbXSwgdjogYW55KTogdm9pZCB7XG4gICAgICAgIGxldCBpOiBudW1iZXIgPSBhcnIuaW5kZXhPZih2KTtcbiAgICAgICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgICAgICAgYXJyLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGkgPSBhcnIuaW5kZXhPZih2KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKuWMheWQq+WFg+e0oCovXG4gICAgcHVibGljIHN0YXRpYyBjb250YWluKGFycjogYW55W10sIHY6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gYXJyLmxlbmd0aCA+IDAgPyBhcnIuaW5kZXhPZih2KSAhPSAtMSA6IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKuWkjeWItiovXG4gICAgcHVibGljIHN0YXRpYyBjb3B5KGFycjogYW55W10pOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiBhcnIuc2xpY2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmjpLluo9cbiAgICAgKiBAcGFyYW0gYXJyIOmcgOimgeaOkuW6j+eahOaVsOe7hFxuICAgICAqIEBwYXJhbSBrZXkg5o6S5bqP5a2X5q61XG4gICAgICogQHBhcmFtIG9yZGVyIOaOkuW6j+aWueW8j1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc29ydChhcnI6IGFueVtdLCBrZXk6IHN0cmluZywgb3JkZXI6IGVudW1BcnJheVNvcnRPcmRlciA9IGVudW1BcnJheVNvcnRPcmRlci5EZXNjZW5kaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChhcnIgPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBhcnIuc29ydChmdW5jdGlvbiAoaW5mbzEsIGluZm8yKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG9yZGVyKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBlbnVtQXJyYXlTb3J0T3JkZXIuQXNjZW5kaW5nOiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmZvMVtrZXldIDwgaW5mbzJba2V5XSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8xW2tleV0gPiBpbmZvMltrZXldKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIGVudW1BcnJheVNvcnRPcmRlci5EZXNjZW5kaW5nOiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmZvMVtrZXldID4gaW5mbzJba2V5XSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8xW2tleV0gPCBpbmZvMltrZXldKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoq5riF56m65pWw57uEKi9cbiAgICBwdWJsaWMgc3RhdGljIGNsZWFyKGFycjogYW55W10pOiB2b2lkIHtcbiAgICAgICAgbGV0IGk6IG51bWJlciA9IDA7XG4gICAgICAgIGxldCBsZW46IG51bWJlciA9IGFyci5sZW5ndGg7XG4gICAgICAgIGZvciAoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgIGFycltpXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgYXJyLnNwbGljZSgwKTtcbiAgICB9XG5cbiAgICAvKirmlbDmja7mmK/lkKbkuLrnqboqL1xuICAgIHB1YmxpYyBzdGF0aWMgaXNFbXB0eShhcnI6IGFueVtdKTogQm9vbGVhbiB7XG4gICAgICAgIGlmIChhcnIgPT0gbnVsbCB8fCBhcnIubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbn1cbiIsIlxuIC8qKlxuICogQGF1dGhvciBTdW5cbiAqIEB0aW1lIDIwMTktMDgtMTAgMjA6MjJcbiAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICogQGRlc2NyaXB0aW9uICDlrZflhbjlt6XlhbfnsbtcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBVdGlsRGljdCB7XG4gICAgLyoqXG4gICAgICog6ZSu5YiX6KGoXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBrZXlzKGQ6IE9iamVjdCk6IGFueVtdIHtcbiAgICAgICAgbGV0IGE6IGFueVtdID0gW107XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBkKSB7XG4gICAgICAgICAgICBhLnB1c2goa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWAvOWIl+ihqFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdmFsdWVzKGQ6IE9iamVjdCk6IGFueVtdIHtcbiAgICAgICAgbGV0IGE6IGFueVtdID0gW107XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIGQpIHtcbiAgICAgICAgICAgIGEucHVzaChkW2tleV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuIFxuICAgIC8qKlxuICAgICAqIOa4heepuuWtl+WFuFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY2xlYXIoZGljOiBPYmplY3QpOiB2b2lkIHtcbiAgICAgICAgbGV0IHY6IGFueTtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGRpYykge1xuICAgICAgICAgICAgdiA9IGRpY1trZXldO1xuICAgICAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBVdGlsRGljdC5jbGVhcih2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSBkaWNba2V5XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWFqOmDqOW6lOeUqFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZm9yZWFjaChkaWM6IE9iamVjdCwgY29tcGFyZUZuOiAoa2V5OiBhbnksIHZhbHVlOiBhbnkpID0+IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGRpYykge1xuICAgICAgICAgICAgaWYgKCFjb21wYXJlRm4uY2FsbChudWxsLCBrZXksIGRpY1trZXldKSlcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaXNFbXB0eShkaWM6IE9iamVjdCk6IEJvb2xlYW4ge1xuICAgICAgICBpZiAoZGljID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBkaWMpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHNpemUoZGljOiBPYmplY3QpOiBudW1iZXIge1xuICAgICAgICBpZiAoZGljID09IG51bGwpIHJldHVybiAwO1xuXG4gICAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gZGljKSB7XG4gICAgICAgICAgICArK2NvdW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG59XG4iLCJpbXBvcnQgTm9kZSA9IExheWEuTm9kZTtcbmltcG9ydCBTcHJpdGUgPSBMYXlhLlNwcml0ZTtcbmltcG9ydCBSZWN0YW5nbGUgPSBMYXlhLlJlY3RhbmdsZTtcbmltcG9ydCBMYWJlbCA9IExheWEuTGFiZWw7XG5cbmV4cG9ydCBjbGFzcyBVdGlsRGlzcGxheSB7XG5cbiAgICAvKipcbiAgICAgKiDnp7vpmaTlhajpg6jlrZDlr7nosaFcbiAgICAgKiBAcGFyYW0gY29udGFpbmVyIFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlQWxsQ2hpbGQoY29udGFpbmVyOiBMYXlhLlNwcml0ZSk6IHZvaWQge1xuICAgICAgICBpZiAoIWNvbnRhaW5lcikgcmV0dXJuO1xuICAgICAgICBpZiAoY29udGFpbmVyLm51bUNoaWxkcmVuIDw9IDApIHJldHVybjtcblxuICAgICAgICB3aGlsZSAoY29udGFpbmVyLm51bUNoaWxkcmVuID4gMCkge1xuICAgICAgICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkQXQoMClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSBub2RlIOmUgOavgVVJ6IqC54K5XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBkZXN0cm95VUlOb2RlKG5vZGU6IE5vZGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlU2VsZigpO1xuICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XG4gICAgICAgICAgICBub2RlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOmAmui/h+WQjeWtl+iOt+W+l+WtkOiKgueCuVxuICAgICAqIEBwYXJhbSBwYXJlbnQgXG4gICAgICogQHBhcmFtIG5hbWUgXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRDaGlsZEJ5TmFtZShwYXJlbnQ6IE5vZGUsIG5hbWU6IHN0cmluZyk6IE5vZGUge1xuICAgICAgICBpZiAoIXBhcmVudCkgcmV0dXJuIG51bGw7XG4gICAgICAgIGlmIChwYXJlbnQubmFtZSA9PT0gbmFtZSkgcmV0dXJuIHBhcmVudDtcbiAgICAgICAgbGV0IGNoaWxkOiBOb2RlID0gbnVsbDtcbiAgICAgICAgbGV0IG51bTogbnVtYmVyID0gcGFyZW50Lm51bUNoaWxkcmVuO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bTsgKytpKSB7XG4gICAgICAgICAgICBjaGlsZCA9IFV0aWxEaXNwbGF5LmdldENoaWxkQnlOYW1lKHBhcmVudC5nZXRDaGlsZEF0KGkpLCBuYW1lKTtcbiAgICAgICAgICAgIGlmIChjaGlsZCkgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIC8qKlxuICAgIC8vICAqIOiuvue9ruWvuem9kOaWueW8j1xuICAgIC8vICAqIEBwYXJhbSBhbGlnZSDlr7npvZDmlrnlvI9cbiAgICAvLyAgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIHNldEFsaWdlKG5vZGU6IFNwcml0ZSwgYWxpZ2U6IGVudW1BbGlnZVR5cGUsIHc6IG51bWJlciA9IDAsIGg6IG51bWJlciA9IDApIHtcbiAgICAvLyAgICAgaWYgKCFub2RlKSByZXR1cm47XG4gICAgLy8gICAgIGxldCByZWN0OiBSZWN0YW5nbGU7XG4gICAgLy8gICAgIGlmICh3IDw9IDAgfHwgaCA8PSAwKSByZWN0ID0gbm9kZS5nZXRCb3VuZHMoKTtcbiAgICAvLyAgICAgbGV0IHdpZHRoOiBudW1iZXIgPSB3ID4gMCA/IHcgOiByZWN0LndpZHRoO1xuICAgIC8vICAgICBsZXQgaGVpZ3RoOiBudW1iZXIgPSBoID4gMCA/IGggOiByZWN0LmhlaWdodDtcbiAgICAvLyAgICAgc3dpdGNoIChhbGlnZSkge1xuICAgIC8vICAgICAgICAgY2FzZSBlbnVtQWxpZ2VUeXBlLkxFRlRfVE9QOlxuICAgIC8vICAgICAgICAgICAgIG5vZGUucGl2b3QoMCwgMCk7XG4gICAgLy8gICAgICAgICAgICAgYnJlYWs7XG4gICAgLy8gICAgICAgICBjYXNlIGVudW1BbGlnZVR5cGUuTEVGVDpcbiAgICAvLyAgICAgICAgICAgICBub2RlLnBpdm90KDAsIGhlaWd0aCAqIDAuNSk7XG4gICAgLy8gICAgICAgICAgICAgYnJlYWs7XG4gICAgLy8gICAgICAgICBjYXNlIGVudW1BbGlnZVR5cGUuTEVGVF9CT1RUT006XG4gICAgLy8gICAgICAgICAgICAgbm9kZS5waXZvdCgwLCBoZWlndGgpO1xuICAgIC8vICAgICAgICAgICAgIGJyZWFrO1xuICAgIC8vICAgICAgICAgY2FzZSBlbnVtQWxpZ2VUeXBlLlRPUDpcbiAgICAvLyAgICAgICAgICAgICBub2RlLnBpdm90KHdpZHRoICogMC41LCAwKTtcbiAgICAvLyAgICAgICAgICAgICBicmVhaztcbiAgICAvLyAgICAgICAgIGNhc2UgZW51bUFsaWdlVHlwZS5NSUQ6XG4gICAgLy8gICAgICAgICAgICAgbm9kZS5waXZvdCh3aWR0aCAqIDAuNSwgaGVpZ3RoICogMC41KTtcbiAgICAvLyAgICAgICAgICAgICBicmVhaztcbiAgICAvLyAgICAgICAgIGNhc2UgZW51bUFsaWdlVHlwZS5CT1RUT006XG4gICAgLy8gICAgICAgICAgICAgbm9kZS5waXZvdCh3aWR0aCAqIDAuNSwgaGVpZ3RoKTtcbiAgICAvLyAgICAgICAgICAgICBicmVhaztcbiAgICAvLyAgICAgICAgIGNhc2UgZW51bUFsaWdlVHlwZS5SSUdIVF9UT1A6XG4gICAgLy8gICAgICAgICAgICAgbm9kZS5waXZvdCh3aWR0aCwgMCk7XG4gICAgLy8gICAgICAgICAgICAgYnJlYWs7XG4gICAgLy8gICAgICAgICBjYXNlIGVudW1BbGlnZVR5cGUuUklHSFQ6XG4gICAgLy8gICAgICAgICAgICAgbm9kZS5waXZvdCh3aWR0aCwgaGVpZ3RoICogMC41KTtcbiAgICAvLyAgICAgICAgICAgICBicmVhaztcbiAgICAvLyAgICAgICAgIGNhc2UgZW51bUFsaWdlVHlwZS5SSUdIVF9CT1RUT006XG4gICAgLy8gICAgICAgICAgICAgbm9kZS5waXZvdCh3aWR0aCwgaGVpZ3RoKTtcbiAgICAvLyAgICAgICAgICAgICBicmVhaztcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIC8qKlxuICAgICAqIOWIm+W7uumAj+aYjumBrue9qVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlTWFza0xheWVyKCk6IFNwcml0ZSB7XG4gICAgICAgIGxldCBsYXllciA9IG5ldyBTcHJpdGUoKTtcbiAgICAgICAgbGF5ZXIubW91c2VFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICBsZXQgd2lkdGggPSBsYXllci53aWR0aCA9IExheWEuc3RhZ2Uud2lkdGggKyAyMDA7XG4gICAgICAgIHZhciBoZWlnaHQgPSBsYXllci5oZWlnaHQgPSBMYXlhLnN0YWdlLmhlaWdodCArIDQwMDtcbiAgICAgICAgbGF5ZXIuZ3JhcGhpY3MuY2xlYXIodHJ1ZSk7XG4gICAgICAgIGxheWVyLmdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQsIFVJQ29uZmlnLnBvcHVwQmdDb2xvcik7XG4gICAgICAgIGxheWVyLmFscGhhID0gVUlDb25maWcucG9wdXBCZ0FscGhhO1xuXG4gICAgICAgIHJldHVybiBsYXllcjtcbiAgICB9XG59IiwiaW1wb3J0IHsgTG9nIH0gZnJvbSAnLi4vY29yZS9sb2cnO1xuaW1wb3J0IHsgRXZlbnRGdW5jIH0gZnJvbSAnLi4vbWFuYWdlci9ldmVudC9ldmVudC1kYXRhJztcblxuIC8qKlxuICogQGF1dGhvciBTdW5cbiAqIEB0aW1lIDIwMTktMDItMjUgMTc6MjJcbiAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICogQGRlc2NyaXB0aW9uICAzROaooeWei+WKoOi9veW3peWFt+exu1xuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFV0aWxMb2FkM0Qge1xuXG4gICAgLyoqXG4gICAgICog5Yqg6L29VTNE5Zy65pmvXG4gICAgICogQHBhcmFtIGFyZWEg5L2c55So5Z+fXG4gICAgICogQHBhcmFtIHBhdGgg5Zy65pmv5paH5Lu26Lev5b6EXG4gICAgICogQHBhcmFtIGNiICAg5Yqg6L295a6M5oiQ5Zue6LCDXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBsb2FkU2NlbmUocGF0aCxhcmVhLGNiKTphbnlcbiAgICB7XG4gICAgICAgIExheWEubG9hZGVyLmNyZWF0ZShwYXRoLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywoKT0+e1xuICAgICAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZChMYXlhLmxvYWRlci5nZXRSZXMocGF0aCkpO1xuICAgICAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgICAgICAgY2IuY2FsbChhcmVhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOiOt+WPluWcuuaZr+WGheeJqeS9k1xuICAgICAqIEBwYXJhbSBzY2VuZTNkIOWcuuaZr1xuICAgICAqIEBwYXJhbSBjaGlsZE5hbWUg5a2Q54mp5L2T5ZCN5a2XXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRTY2VuZTNEQ2hpbGQ8VD4oc2NlbmUzZCxjaGlsZE5hbWUpOlRcbiAgICB7XG4gICAgICAgIGxldCBtcyA9IHNjZW5lM2QuZ2V0Q2hpbGRCeU5hbWUoY2hpbGROYW1lKSBhcyBUO1xuICAgICAgICBpZiAobXMpIHtcbiAgICAgICAgICAgIHJldHVybiBtcztcbiAgICAgICAgfVxuICAgICAgICBMb2cuZXJyb3IoXCJFcnJvcjrojrflj5blnLrmma/niankvZPlpLHotKVcIik7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOiOt+WPluaooeWei+eahOWtkOeJqeS9k+aooeWei1xuICAgICAqIEBwYXJhbSBmYXRTUCDniLbmlrlcbiAgICAgKiBAcGFyYW0gY2hpbGROYW1lIOWtkOaWueWQjeWtl1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TW9kZWxDaGlsZEJ5TmFtZTxUPihmYXRTUCxjaGlsZE5hbWUpOlRcbiAgICB7XG4gICAgICAgIGxldCBjaGlsZCA9IGZhdFNQLmdldENoaWxkQnlOYW1lKGNoaWxkTmFtZSkgYXMgVDtcbiAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgTG9nLmVycm9yKFwiRXJyb3I66I635Y+W5qih5Z6L5a2Q54mp5L2T5L+h5oGv6ZSZ6K+vXCIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmm7/mjaLmqKHlnotcbiAgICAgKiBAcGFyYW0gdGFyZ2V0U1Ag6KKr5pu/5o2i5qih5Z6LXG4gICAgICogQHBhcmFtIG1pYW5TUCAgIOabv+aNouaooeWei1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVwbGFjZU1vZGVsKHRhcmdldFNQLG1haW5TUClcbiAgICB7XG4gICAgICAgIGlmICghdGFyZ2V0U1AgfHwgIW1haW5TUCkge1xuICAgICAgICAgICAgTG9nLmVycm9yKFwiRXJyb3I65pu/5o2i5oiW6KKr5pu/5o2i5qih5Z6L5L+h5oGv6ZSZ6K+vXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldFNQLnBhcmVudCkge1xuICAgICAgICAgICAgdGFyZ2V0U1AucGFyZW50LmFkZENoaWxkKG1haW5TUCk7XG4gICAgICAgIH1cbiAgICAgICAgbWFpblNQLnRyYW5zZm9ybS5wb3NpdGlvbiA9IG5ldyBMYXlhLlZlY3RvcjModGFyZ2V0U1AudHJhbnNmb3JtLnBvc2l0aW9uLngsdGFyZ2V0U1AudHJhbnNmb3JtLnBvc2l0aW9uLnksdGFyZ2V0U1AudHJhbnNmb3JtLnBvc2l0aW9uLnopO1xuICAgICAgICBtYWluU1AudHJhbnNmb3JtLnNjYWxlID0gbmV3IExheWEuVmVjdG9yMyh0YXJnZXRTUC50cmFuc2Zvcm0uc2NhbGUueCx0YXJnZXRTUC50cmFuc2Zvcm0uc2NhbGUueSx0YXJnZXRTUC50cmFuc2Zvcm0uc2NhbGUueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pu/5o2iTWVzaOaooeWei+adkOi0qFxuICAgICAqIEBwYXJhbSB0YXJnZXRTUCDnm67moIfmqKHlnotcbiAgICAgKiBAcGFyYW0gdGFyZ2V0TWF0IOebruagh+adkOi0qFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVwbGFjZU1vZGVsTWVzaE1hdCh0YXJnZXRTUCx0YXJnZXRNYXQpXG4gICAge1xuICAgICAgICBpZiAoIXRhcmdldFNQIHx8ICF0YXJnZXRNYXQpIHtcbiAgICAgICAgICAgIExvZy5lcnJvcihcIkVycm9yOuaooeWei+aIluadkOi0qOS/oeaBr+mUmeivr1wiKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRhcmdldFNQIGFzIExheWEuTWVzaFNwcml0ZTNEO1xuICAgICAgICB0YXJnZXRTUC5tZXNoUmVuZGVyZXIubWF0ZXJpYWwgPSB0YXJnZXRNYXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pu/5o2iU2tpbk1lc2jmqKHlnovmnZDotKhcbiAgICAgKiBAcGFyYW0gdGFyZ2V0U1Ag55uu5qCH5qih5Z6LXG4gICAgICogQHBhcmFtIHRhcmdldE1hdCDnm67moIfmnZDotKhcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlcGxhY2VNb2RlbFNraW5NZXNoTWF0KHRhcmdldFNQLHRhcmdldE1hdClcbiAgICB7XG4gICAgICAgIGlmICghdGFyZ2V0U1AgfHwgIXRhcmdldE1hdCkge1xuICAgICAgICAgICAgTG9nLmVycm9yKFwiRXJyb3I65qih5Z6L5oiW5p2Q6LSo5L+h5oGv6ZSZ6K+vXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGFyZ2V0U1AgYXMgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEO1xuICAgICAgICB0YXJnZXRTUC5za2lubmVkTWVzaFJlbmRlcmVyLm1hdGVyaWFsID0gdGFyZ2V0TWF0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOiOt+WPluWuueWZqOS4iueahOadkOi0qOW5tuWtmOWFpeWTiOW4jOihqFxuICAgICAqIEBwYXJhbSB0YXJnZXRPYmog5om/6L295p2Q6LSo55qE5a655ZmoXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRNYXRlcmlhbHMoc2NlbmUzZCk6YW55XG4gICAge1xuICAgICAgICAvKipVbml0eeWcuuaZr+WtmOi0ruS4gOS4quepuueJqeS9k++8jOmZhOW4pk1lc2hSZW5kZXLnlKjmnaXlrZjlgqjmnZDotKgqKi9cbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IFV0aWxMb2FkM0QuZ2V0U2NlbmUzRENoaWxkPExheWEuTWVzaFNwcml0ZTNEPihzY2VuZTNkLFwiTWF0Q29udGFpbmVyXCIpO1xuICAgICAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgICAgICAgTG9nLmVycm9yKFwiRXJyb3I65p2Q6LSo5a655Zmo6ZSZ6K+v5oiW5LiN5a2Y5ZyoXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVzZXJJbmZvOiB7W2luZGV4OnN0cmluZ106IExheWEuQmxpbm5QaG9uZ01hdGVyaWFsfSA9IHt9XG4gICAgICAgIHZhciBtYXRBcnJhcnkgPSBjb250YWluZXIubWVzaFJlbmRlcmVyLm1hdGVyaWFscztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7aTxtYXRBcnJhcnkubGVuZ3RoO2krKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBtYXRBcnJhcnlbaV0ubmFtZS5zbGljZSgwLG1hdEFycmFyeVtpXS5uYW1lLmxlbmd0aC0xMCk7XG4gICAgICAgICAgICB1c2VySW5mb1tuYW1lXSA9IG1hdEFycmFyeVtpXSBhcyBMYXlhLkJsaW5uUGhvbmdNYXRlcmlhbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXNlckluZm87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6L+U5Zue5oyH5a6a5ZCN5a2X55qE5p2Q6LSoXG4gICAgICogQHBhcmFtIG1hdEFycmF0eSDlrZjmlL7mnZDotKjnmoTlk4jluIzooahcbiAgICAgKiBAcGFyYW0gbWF0TmFtZSAgIOadkOi0qOWQjeWtl1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TWF0ZXJpYWxCeU5hbWUobWF0QXJyYXJ5LG1hdE5hbWUpOkxheWEuQmxpbm5QaG9uZ01hdGVyaWFsXG4gICAge1xuICAgICAgICBpZiAoIW1hdEFycmFyeSkge1xuICAgICAgICAgICAgTG9nLmVycm9yKFwiRXJyb3I65p2Q6LSo5ZOI5biM6KGo5L+h5oGv6ZSZ6K+vXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtYXRBcnJhcnlbbWF0TmFtZV0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIExvZy5lcnJvcihcIkVycm9yOuaMh+WumuWTiOW4jOihqOWGheS4jeWtmOWcqFtcIittYXROYW1lK1wiXeadkOi0qFwiKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXRBcnJhcnlbbWF0TmFtZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pKt5pS+5qih5Z6L5Yqo55S7XG4gICAgICogQHBhcmFtIHRhcmdldFNwIOaSreaUvueJqeS9k1xuICAgICAqIEBwYXJhbSBhbmlOYW1lICDliqjnlLvlkI3lrZdcbiAgICAgKiBAcGFyYW0gaXNDcm9zcyAg5piv5ZCm6L+H5bqmXG4gICAgICog6YCa6L+HdGhpcy5hbmltYXRvci5nZXRDdXJyZW50QW5pbWF0b3JQbGF5U3RhdGUoMCkubm9ybWFsaXplZFRpbWU+PTHljrvliKTmlq3lvZPliY3liqjnlLvmmK/lkKbmkq3mlL7lrozmiJBcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHBsYXlBbmltYXRvckJ5TmFtZSh0YXJnZXRTcCxhbmlOYW1lLGlzQ3Jvc3M/KTpMYXlhLkFuaW1hdG9yXG4gICAge1xuICAgICAgICB2YXIgYW5pbWF0b3I6TGF5YS5BbmltYXRvciA9IHRhcmdldFNwLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKTtcbiAgICAgICAgaWYgKCFhbmltYXRvcilcbiAgICAgICAge1xuICAgICAgICAgICAgTG9nLmVycm9yKFwiRXJyb3I65Yqo55S75py65L+h5oGv6ZSZ6K+vXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0Nyb3NzICE9IG51bGwgJiYgaXNDcm9zcyA9PSBmYWxzZSkge1xuICAgICAgICAgICAgYW5pbWF0b3IucGxheShhbmlOYW1lKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhbmltYXRvci5jcm9zc0ZhZGUoYW5pTmFtZSwwLjIpO1xuICAgICAgICByZXR1cm4gYW5pbWF0b3I7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5o6n5Yi25Yqo55S76YCf5bqmXG4gICAgICogQHBhcmFtIHRhcmdldFNwIOebruagh+eJqeS9k1xuICAgICAqIEBwYXJhbSBzcGVlZCDmkq3mlL7pgJ/luqZcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNvbnRyb2xBbmltYXRvclNwZWVkKHRhcmdldFNwLHNwZWVkKVxuICAgIHtcbiAgICAgICAgdmFyIGFuaW1hdG9yOkxheWEuQW5pbWF0b3IgPSB0YXJnZXRTcC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcik7XG4gICAgICAgIGlmICghYW5pbWF0b3IpXG4gICAgICAgIHtcbiAgICAgICAgICAgIExvZy5lcnJvcihcIkVycm9yOuWKqOeUu+acuuS/oeaBr+mUmeivr1wiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3BlZWQpIHtcbiAgICAgICAgICAgIGFuaW1hdG9yLnNwZWVkID0gc3BlZWQ7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIGFuaW1hdG9yLnNwZWVkID0gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWIpOaWreWKqOeUu+aYr+WQpuWujOaIkFxuICAgICAqIEBwYXJhbSBhbmltYXRvclxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY29uZmlybUFuaUNvbXBsZXRlKGFuaW1hdG9yOkxheWEuQW5pbWF0b3IpOmJvb2xlYW5cbiAgICB7XG4gICAgICAgIHZhciBib29sID0gZmFsc2U7XG4gICAgICAgIGxldCBpbmRleCA9IGFuaW1hdG9yLmdldEN1cnJlbnRBbmltYXRvclBsYXlTdGF0ZSgwKS5ub3JtYWxpemVkVGltZTtcbiAgICAgICAgaWYgKGluZGV4ID49IDEpIHtcbiAgICAgICAgICAgIGJvb2wgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBib29sO1xuICAgIH1cblxufSIsImltcG9ydCB7VXRpbE1hdGgzRH0gZnJvbSBcIi4vbWF0aDNkXCI7XG5cbi8qKlxuICogQGF1dGhvciBTdW5cbiAqIEB0aW1lIDIwMTktMDEtMTggMTY6MjBcbiAqIEBwcm9qZWN0IFNGcmFtZXdvcmtfTGF5YUFpclxuICogQGRlc2NyaXB0aW9uIOeul+azleW3peWFt+exu1xuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFV0aWxNYXRoIHtcblxuICAgIC8qKuWtl+iKgui9rOaNok0qL1xuICAgIHB1YmxpYyBzdGF0aWMgQllURV9UT19NOiBudW1iZXIgPSAxIC8gKDEwMjQgKiAxMDI0KTtcbiAgICAvKirlrZfoioLovazmjaJLKi9cbiAgICBwdWJsaWMgc3RhdGljIEJZVEVfVE9fSzogbnVtYmVyID0gMSAvICgxMDI0KTtcblxuICAgIHB1YmxpYyBzdGF0aWMgRGVnMlJhZDogbnVtYmVyID0gMC4wMTc0NTMyOTtcblxuICAgIHB1YmxpYyBzdGF0aWMgUmFkMkRlZzogbnVtYmVyID0gNTcuMjk1Nzg7XG5cbiAgICBwdWJsaWMgc3RhdGljIFNpZ24oZjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuICgoZiA8IDApID8gLTEgOiAxKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIOmZkOWumuaVsOWtl+WcqOiMg+WbtOWMuumXtOW5tui/lOWbnlxuICAgICAqIEBwYXJhbSBudW1cbiAgICAgKiBAcGFyYW0gbWluXG4gICAgICogQHBhcmFtIG1heFxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY2xhbXAobnVtOiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGlmIChudW0gPCBtaW4pIHtcbiAgICAgICAgICAgIG51bSA9IG1pbjtcbiAgICAgICAgfSBlbHNlIGlmIChudW0gPiBtYXgpIHtcbiAgICAgICAgICAgIG51bSA9IG1heDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVtO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY2xhbXAwMSh2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHZhbHVlIDwgMCkgcmV0dXJuIDA7XG4gICAgICAgIGlmICh2YWx1ZSA+IDEpIHJldHVybiAxO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBsZXJwKGZyb206IG51bWJlciwgdG86IG51bWJlciwgdDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIChmcm9tICsgKCh0byAtIGZyb20pICogVXRpbE1hdGguY2xhbXAwMSh0KSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgbGVycEFuZ2xlKGE6IG51bWJlciwgYjogbnVtYmVyLCB0OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBsZXQgbnVtOiBudW1iZXIgPSBVdGlsTWF0aC5yZXBlYXQoYiAtIGEsIDM2MCk7XG4gICAgICAgIGlmIChudW0gPiAxODApIG51bSAtPSAzNjA7XG4gICAgICAgIHJldHVybiAoYSArIChudW0gKiBVdGlsTWF0aC5jbGFtcDAxKHQpKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyByZXBlYXQodDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAodCAtIChNYXRoLmZsb29yKHQgLyBsZW5ndGgpICogbGVuZ3RoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Lqn55Sf6ZqP5py65pWwXG4gICAgICog57uT5p6c77yaeD49cGFyYW0xICYmIHg8cGFyYW0yXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByYW5kUmFuZ2UocGFyYW0xOiBudW1iZXIsIHBhcmFtMjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGxvYzogbnVtYmVyID0gTWF0aC5yYW5kb20oKSAqIChwYXJhbTIgLSBwYXJhbTEpICsgcGFyYW0xO1xuICAgICAgICByZXR1cm4gbG9jO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS6p+eUn+maj+acuuaVsFxuICAgICAqIOe7k+aenO+8mng+PXBhcmFtMSAmJiB4PD1wYXJhbTJcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJhbmRSYW5nZUludChwYXJhbTE6IG51bWJlciwgcGFyYW0yOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBsZXQgbG9jOiBudW1iZXIgPSBNYXRoLnJhbmRvbSgpICogKHBhcmFtMiAtIHBhcmFtMSArIDEpICsgcGFyYW0xO1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihsb2MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS7juaVsOe7hOS4reS6p+eUn+maj+acuuaVsFstMSwxLDJdXG4gICAgICog57uT5p6c77yaLTEvMS8y5Lit55qE5LiA5LiqXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByYW5kUmFuZ2VBcnJheTxUPihhcnI6IEFycmF5PFQ+KTogVCB7XG4gICAgICAgIGlmIChhcnIubGVuZ3RoID09IDApXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgbGV0IGxvYzogVCA9IGFycltVdGlsTWF0aC5yYW5kUmFuZ2VJbnQoMCwgYXJyLmxlbmd0aCAtIDEpXTtcbiAgICAgICAgcmV0dXJuIGxvYztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDovazmjaLkuLozNjDluqbop5LluqZcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNsYW1wRGVncmVlcyhkZWdyZWVzOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICB3aGlsZSAoZGVncmVlcyA8IDApIGRlZ3JlZXMgPSBkZWdyZWVzICsgMzYwO1xuICAgICAgICB3aGlsZSAoZGVncmVlcyA+PSAzNjApIGRlZ3JlZXMgPSBkZWdyZWVzIC0gMzYwO1xuICAgICAgICByZXR1cm4gZGVncmVlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDovazmjaLkuLozNjDluqblvKfluqZcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNsYW1wUmFkaWFucyhyYWRpYW5zOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICB3aGlsZSAocmFkaWFucyA8IDApIHJhZGlhbnMgPSByYWRpYW5zICsgMiAqIE1hdGguUEk7XG4gICAgICAgIHdoaWxlIChyYWRpYW5zID49IDIgKiBNYXRoLlBJKSByYWRpYW5zID0gcmFkaWFucyAtIDIgKiBNYXRoLlBJO1xuICAgICAgICByZXR1cm4gcmFkaWFucztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDkuKTngrnpl7TnmoTot53nprtcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldERpc3RhbmNlKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHkyIC0geTEsIDIpICsgTWF0aC5wb3coeDIgLSB4MSwgMikpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0U3F1YXJlRGlzdGFuY2UoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLnBvdyh5MiAtIHkxLCAyKSArIE1hdGgucG93KHgyIC0geDEsIDIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS4pOeCuemXtOeahOW8p+W6pu+8mnjmraPmlrnlvaLkuLow77yMWei9tOWQkeS4iyzpobrml7bpkojkuLrmraNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldExpbmVSYWRpYW5zKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih5MiAtIHkxLCB4MiAtIHgxKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldExpbmVEZWdyZWUoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGxldCBkZWdyZWU6IG51bWJlciA9IFV0aWxNYXRoLnRvRGVncmVlKFV0aWxNYXRoLmdldExpbmVSYWRpYW5zKHgxLCB5MSwgeDIsIHkyKSk7XG4gICAgICAgIHJldHVybiBVdGlsTWF0aC5jbGFtcERlZ3JlZXMoZGVncmVlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldFBvaW50UmFkaWFucyh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHksIHgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UG9pbnREZWdyZWUoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBsZXQgZGVncmVlOiBudW1iZXIgPSBVdGlsTWF0aC50b0RlZ3JlZShVdGlsTWF0aC5nZXRQb2ludFJhZGlhbnMoeCwgeSkpO1xuICAgICAgICByZXR1cm4gVXRpbE1hdGguY2xhbXBEZWdyZWVzKGRlZ3JlZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5byn5bqm6L2s5YyW5Li65bqmXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0b0RlZ3JlZShyYWRpYW46IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiByYWRpYW4gKiAoMTgwLjAgLyBNYXRoLlBJKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDluqbovazljJbkuLrlvKfluqZcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHRvUmFkaWFuKGRlZ3JlZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGRlZ3JlZSAqIChNYXRoLlBJIC8gMTgwLjApO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgbW92ZVRvd2FyZHMoY3VycmVudDogbnVtYmVyLCB0YXJnZXQ6IG51bWJlciwgbWF4RGVsdGE6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGlmIChNYXRoLmFicyh0YXJnZXQgLSBjdXJyZW50KSA8PSBtYXhEZWx0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGN1cnJlbnQgKyAoVXRpbE1hdGguU2lnbih0YXJnZXQgLSBjdXJyZW50KSAqIG1heERlbHRhKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6I635Y+W5LiA5a6a6IyD5Zu05YaF55qE6ZqP5py65pW05pWwXG4gICAgICogQHBhcmFtIG1pbiDmnIDlsI/lgLxcbiAgICAgKiBAcGFyYW0gbWF4IOacgOWkp+WAvFxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmFuZG9tKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5LqM57u05ZCR6YeP5b2S5LiA5YyWXG4gICAgICogQHBhcmFtIHhcbiAgICAgKiBAcGFyYW0geVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbm9ybWFsaXplKHg6bnVtYmVyLHk6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCp4K3kqeSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6L+U5Zue5Lik5ZCR6YeP5aS56KeSXG4gICAgICogQHBhcmFtIHgxXG4gICAgICogQHBhcmFtIHkxXG4gICAgICogQHBhcmFtIHgyXG4gICAgICogQHBhcmFtIHkyXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB2ZWN0b3JBbmdsZSh4MTpudW1iZXIseTE6bnVtYmVyLHgyOm51bWJlcix5MjpudW1iZXIpOm51bWJlclxuICAgIHtcbiAgICAgICAgaWYgKHgxID09IHgyICYmIHkxID09IHkyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvc0FuZ2xlID0gKHgxKngyK3kxKnkyKS8oVXRpbE1hdGgubm9ybWFsaXplKHgxLHkxKSpVdGlsTWF0aC5ub3JtYWxpemUoeDIseTIpKTtcbiAgICAgICAgdmFyIGFDb3NBbmdsZSA9IE1hdGguYWNvcyhjb3NBbmdsZSk7XG4gICAgICAgIHZhciBhbmdsZSA9IFV0aWxNYXRoM0QuUmFkMkRlZyhhQ29zQW5nbGUpO1xuICAgICAgICBpZiAoeDEgLyB5MSA8IHgyIC8geTIpIGFuZ2xlID0gLSBhbmdsZTtcbiAgICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgIH1cblxufVxuXG4iLCJpbXBvcnQgUmF5ID0gTGF5YS5SYXk7XG5pbXBvcnQgVmVjdG9yMiA9IExheWEuVmVjdG9yMjtcbmltcG9ydCBWZWN0b3IzID0gTGF5YS5WZWN0b3IzO1xuaW1wb3J0IFZlY3RvcjQgPSBMYXlhLlZlY3RvcjQ7XG5pbXBvcnQge1V0aWxTdHJpbmd9IGZyb20gXCIuL3N0cmluZ1wiO1xuXG4vKipcbiAqIEBhdXRob3IgU3VuXG4gKiBAdGltZSAyMDE5LTA4LTExIDE4OjA4XG4gKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcbiAqIEBkZXNjcmlwdGlvbiAzZOeul+azleW3peWFt+exu1xuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFV0aWxNYXRoM0Qge1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgX1ZlYzJUZW1wOiBWZWN0b3IyID0gbnVsbDtcbiAgICBwcml2YXRlIHN0YXRpYyBfVmVjM1RlbXA6IFZlY3RvcjMgPSBudWxsO1xuICAgIHByaXZhdGUgc3RhdGljIF9WZWM0VGVtcDogVmVjdG9yNCA9IG51bGw7XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldCBUZW1wVmVjMigpOiBWZWN0b3IyIHtcbiAgICAgICAgaWYgKCFVdGlsTWF0aDNELl9WZWMyVGVtcCkgVXRpbE1hdGgzRC5fVmVjMlRlbXAgPSBuZXcgVmVjdG9yMigwLCAwKTtcbiAgICAgICAgcmV0dXJuIFV0aWxNYXRoM0QuX1ZlYzJUZW1wO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFRlbXBWZWMzKCk6IFZlY3RvcjMge1xuICAgICAgICBpZiAoIVV0aWxNYXRoM0QuX1ZlYzNUZW1wKSBVdGlsTWF0aDNELl9WZWMzVGVtcCA9IG5ldyBWZWN0b3IzKDAsIDAsIDApO1xuICAgICAgICByZXR1cm4gVXRpbE1hdGgzRC5fVmVjM1RlbXA7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXQgVGVtcFZlYzQoKTogVmVjdG9yNCB7XG4gICAgICAgIGlmICghVXRpbE1hdGgzRC5fVmVjNFRlbXApIFV0aWxNYXRoM0QuX1ZlYzRUZW1wID0gbmV3IFZlY3RvcjQoMCwgMCwgMCwgMCk7XG4gICAgICAgIHJldHVybiBVdGlsTWF0aDNELl9WZWM0VGVtcDtcbiAgICB9XG5cbiAgICAvKirovazmjaLkuLrmsLTlubPmlrnlkJEqL1xuICAgIHB1YmxpYyBzdGF0aWMgVG9Ib3Jpem9udGFsKHZlYzogVmVjdG9yMyk6IFZlY3RvcjMge1xuICAgICAgICB2ZWMueSA9IDA7XG4gICAgICAgIHJldHVybiB2ZWM7XG4gICAgfVxuXG4gICAgLyoq5rC05bmz6Led56a7Ki9cbiAgICBwdWJsaWMgc3RhdGljIEhvcml6b250YWxEaXN0YW5jZSh2ZWMxOiBWZWN0b3IzLCB2ZWMyOiBWZWN0b3IzKTogbnVtYmVyIHtcbiAgICAgICAgdmVjMS55ID0gMDtcbiAgICAgICAgdmVjMi55ID0gMDtcbiAgICAgICAgcmV0dXJuIFZlY3RvcjMuc2NhbGFyTGVuZ3RoKFZlYzNTdWIodmVjMSwgdmVjMikpO1xuICAgIH1cblxuICAgIC8qKuWwhOe6v+S4iueahOS4gOeCuSovXG4gICAgcHVibGljIHN0YXRpYyBHZXRSYXlQb2ludChyYXk6IFJheSwgZGlzdGFuY2U6IG51bWJlcik6IFZlY3RvcjMge1xuICAgICAgICByZXR1cm4gVmVjM0FkZChyYXkub3JpZ2luLCBWZWMzTXVsKHJheS5kaXJlY3Rpb24sIGRpc3RhbmNlKSk7XG4gICAgfVxuXG4gICAgLyoqIERlczrkuInnu7TmsYLkuKTngrnot53nprsgKi9cbiAgICBwdWJsaWMgc3RhdGljIFZlYzNNYWduaXR1ZGUodmVjMTogVmVjdG9yMyx2ZWMyOlZlY3RvcjMpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCh2ZWMxLngtdmVjMi54KSAqICh2ZWMxLngtdmVjMi54KSArICgodmVjMS55LXZlYzIueSkgKiAodmVjMS55LXZlYzIueSkpICsgKCh2ZWMxLnotdmVjMi56KSAqICh2ZWMxLnotdmVjMi56KSkpO1xuICAgIH1cblxuICAgIC8qKiBEZXM65LqM57u05rGC5Lik54K56Led56a7ICovXG4gICAgcHVibGljIHN0YXRpYyBWZWMyTWFnbml0dWRlKHZlYzE6IFZlY3RvcjIsdmVjMjpWZWN0b3IyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCgodmVjMS54LXZlYzIueCkgKiAodmVjMS54LXZlYzIueCkgKyAoKHZlYzEueS12ZWMyLnkpICogKHZlYzEueS12ZWMyLnkpKSk7XG4gICAgfVxuXG4gICAgLyoqIERlczrop5LluqbovazlvKfluqYgKi9cbiAgICBwdWJsaWMgc3RhdGljIERlZzJSYWQoYW5nbGU6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgIHJldHVybiBMYXlhLlV0aWxzLnRvUmFkaWFuKGFuZ2xlKTtcbiAgICB9XG5cbiAgICAvKiogRGVzOuW8p+W6pui9rOinkuW6piAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUmFkMkRlZyhyYWRpYW46bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgIHJldHVybiBMYXlhLlV0aWxzLnRvQW5nbGUocmFkaWFuKTtcbiAgICB9XG5cbiAgICAvKiogRGVzOuato+W8piAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2luKGFuZ2xlOm51bWJlcik6bnVtYmVye1xuICAgICAgICB2YXIgcmFkaWFuID0gVXRpbE1hdGgzRC5EZWcyUmFkKGFuZ2xlKTtcbiAgICAgICAgcmV0dXJuIE1hdGguc2luKHJhZGlhbik7XG4gICAgfVxuICAgIC8qKiBEZXM65L2Z5bymICovXG4gICAgcHVibGljIHN0YXRpYyBjb3MoYW5nbGU6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgIHZhciByYWRpYW4gPSBVdGlsTWF0aDNELkRlZzJSYWQoYW5nbGUpO1xuICAgICAgICByZXR1cm4gTWF0aC5jb3MocmFkaWFuKTtcbiAgICB9XG4gICAgLyoqIERlczrmraPliIcgKi9cbiAgICBwdWJsaWMgc3RhdGljIHRhbihhbmdsZTpudW1iZXIpOm51bWJlcntcbiAgICAgICAgdmFyIHJhZGlhbiA9IFV0aWxNYXRoM0QuRGVnMlJhZChhbmdsZSk7XG4gICAgICAgIHJldHVybiBNYXRoLnRhbihyYWRpYW4pO1xuICAgIH1cbiAgICAvKiogRGVzOuWPjeato+W8piAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYXNpbihhbmdsZTpudW1iZXIpOm51bWJlcntcbiAgICAgICAgdmFyIHJhZGlhbiA9IFV0aWxNYXRoM0QuRGVnMlJhZChhbmdsZSk7XG4gICAgICAgIHJldHVybiBNYXRoLmFzaW4ocmFkaWFuKTtcbiAgICB9XG4gICAgLyoqIERlczrlj43kvZnlvKYgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFjb3MoYW5nbGU6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgIHZhciByYWRpYW4gPSBVdGlsTWF0aDNELkRlZzJSYWQoYW5nbGUpO1xuICAgICAgICByZXR1cm4gTWF0aC5hY29zKHJhZGlhbik7XG4gICAgfVxuICAgIC8qKiBEZXM65Y+N5q2j5YiHICovXG4gICAgcHVibGljIHN0YXRpYyBhdGFuKGFuZ2xlOm51bWJlcik6bnVtYmVye1xuICAgICAgICB2YXIgcmFkaWFuID0gVXRpbE1hdGgzRC5EZWcyUmFkKGFuZ2xlKTtcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbihyYWRpYW4pO1xuICAgIH1cblxuXG5cblxufVxuXG4vL++9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nnZlYzLvvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ7vvZ4vL1xuZXhwb3J0IGZ1bmN0aW9uIFZlYzJBZGQoYTogVmVjdG9yMiwgYjogVmVjdG9yMik6IFZlY3RvcjIge1xuICAgIHJldHVybiBuZXcgVmVjdG9yMihhLnggKyBiLngsIGEueSArIGIueSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWZWMyU3ViKGE6IFZlY3RvcjIsIGI6IFZlY3RvcjIpOiBWZWN0b3IyIHtcbiAgICByZXR1cm4gbmV3IFZlY3RvcjIoYS54IC0gYi54LCBhLnkgLSBiLnkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVmVjMk11bHRpcGx5KGE6IFZlY3RvcjIsIGI6IFZlY3RvcjIpOiBWZWN0b3IyIHtcbiAgICByZXR1cm4gbmV3IFZlY3RvcjIoYS54ICogYi54LCBhLnkgKiBiLnkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVmVjMk11bChhOiBWZWN0b3IyLCBkOiBudW1iZXIpOiBWZWN0b3IyIHtcbiAgICByZXR1cm4gbmV3IFZlY3RvcjIoYS54ICogZCwgYS55ICogZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWZWMyRGl2KGE6IFZlY3RvcjIsIGQ6IG51bWJlcik6IFZlY3RvcjIge1xuICAgIHJldHVybiBuZXcgVmVjdG9yMihhLnggLyBkLCBhLnkgLyBkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFZlYzJEb3QobGhzOiBWZWN0b3IyLCByaHM6IFZlY3RvcjIpOiBudW1iZXIge1xuICAgIHJldHVybiAoKGxocy54ICogcmhzLngpICsgKGxocy55ICogcmhzLnkpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFZlYzJQcm9qZWN0KHZlY3RvcjogVmVjdG9yMiwgb25Ob3JtYWw6IFZlY3RvcjIpOiBWZWN0b3IyIHtcbiAgICBsZXQgbnVtOiBudW1iZXIgPSBWZWMyRG90KG9uTm9ybWFsLCBvbk5vcm1hbCk7XG4gICAgaWYgKG51bSA8IDFFLTA1KSB7XG4gICAgICAgIHJldHVybiBWZWN0b3IyLlpFUk87XG4gICAgfVxuICAgIHJldHVybiAoVmVjMkRpdihWZWMyTXVsKG9uTm9ybWFsLCBWZWMyRG90KHZlY3Rvciwgb25Ob3JtYWwpKSwgbnVtKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWZWMyTWluKGxoczogVmVjdG9yMiwgcmhzOiBWZWN0b3IyKTogVmVjdG9yMiB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IyKE1hdGgubWluKGxocy54LCByaHMueCksIE1hdGgubWluKGxocy55LCByaHMueSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVmVjMk1heChsaHM6IFZlY3RvcjIsIHJoczogVmVjdG9yMik6IFZlY3RvcjIge1xuICAgIHJldHVybiBuZXcgVmVjdG9yMihNYXRoLm1heChsaHMueCwgcmhzLngpLCBNYXRoLm1heChsaHMueSwgcmhzLnkpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFZlYzJNYWduaXR1ZGUodmVjOiBWZWN0b3IyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KCh2ZWMueCAqIHZlYy54KSArICh2ZWMueSAqIHZlYy55KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWZWMyU3FyTWFnbml0dWRlKHZlYzogVmVjdG9yMik6IG51bWJlciB7XG4gICAgcmV0dXJuICh2ZWMueCAqIHZlYy54KSArICh2ZWMueSAqIHZlYy55KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFZlYzJOb3JtYWxpemVkKHZlYzogVmVjdG9yMik6IFZlY3RvcjIge1xuICAgIGxldCBtYWduaXR1ZGU6IG51bWJlciA9IFZlYzJNYWduaXR1ZGUodmVjKTtcbiAgICBsZXQgdjogVmVjdG9yMjtcbiAgICBpZiAobWFnbml0dWRlID4gMUUtMDUpXG4gICAgICAgIHYgPSBWZWMyRGl2KHZlYywgbWFnbml0dWRlKTtcbiAgICBlbHNlXG4gICAgICAgIHYgPSBuZXcgVmVjdG9yMigwLCAwKTtcbiAgICByZXR1cm4gdjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFZlYzJOb3JtYWwodmVjOiBWZWN0b3IyKTogdm9pZCB7XG4gICAgbGV0IG1hZ25pdHVkZTogbnVtYmVyID0gVmVjMk1hZ25pdHVkZSh2ZWMpO1xuICAgIGlmIChtYWduaXR1ZGUgPiAxRS0wNSkge1xuICAgICAgICBsZXQgdjogVmVjdG9yMiA9IFZlYzJEaXYodmVjLCBtYWduaXR1ZGUpO1xuICAgICAgICBWZWMyU2V0KHZlYywgdi54LCB2LnkpO1xuICAgIH0gZWxzZVxuICAgICAgICBWZWMyU2V0KHZlYywgMCwgMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWZWMyU2V0KHY6IFZlY3RvcjIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjdG9yMiB7XG4gICAgdi54ID0geDtcbiAgICB2LnkgPSB5O1xuICAgIDtcbiAgICByZXR1cm4gdjtcbn1cblxuLy8gZXhwb3J0IGZ1bmN0aW9uIFZlYzJBbmdsZShmcm9tOiBWZWN0b3IyLCB0bzogVmVjdG9yMik6IG51bWJlciB7XG4vLyAgICAgcmV0dXJuIChNYXRoLmFjb3MoVXRpbE1hdGguY2xhbXAoVmVjMkRvdChWZWMyTm9ybWFsaXplZChmcm9tKSwgVmVjMk5vcm1hbGl6ZWQodG8pKSwgLTEsIDEpKSAqIDU3LjI5NTc4KTtcbi8vIH1cblxuZXhwb3J0IGZ1bmN0aW9uIFZlYzJDbGFtcE1hZ25pdHVkZSh2ZWN0b3I6IFZlY3RvcjIsIG1heExlbmd0aCk6IFZlY3RvcjIge1xuICAgIGlmIChWZWMyU3FyTWFnbml0dWRlKHZlY3RvcikgPiAobWF4TGVuZ3RoICogbWF4TGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gKFZlYzJNdWwoVmVjMk5vcm1hbGl6ZWQodmVjdG9yKSwgbWF4TGVuZ3RoKSk7XG4gICAgfVxuICAgIHJldHVybiB2ZWN0b3I7XG59XG5cbi8vIGV4cG9ydCBmdW5jdGlvbiBWZWMyTGVycChmcm9tOiBWZWN0b3IyLCB0bzogVmVjdG9yMiwgdDogbnVtYmVyKTogVmVjdG9yMiB7XG4vLyAgICAgdCA9IFV0aWxNYXRoLmNsYW1wKHQsIDAsIDEpO1xuLy8gICAgIHJldHVybiBuZXcgVmVjdG9yMihmcm9tLnggKyAoKHRvLnggLSBmcm9tLngpICogdCksIGZyb20ueSArICgodG8ueSAtIGZyb20ueSkgKiB0KSk7XG4vLyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBWZWMyTW92ZVRvd2FyZHMoY3VycmVudDogVmVjdG9yMiwgdGFyZ2V0OiBWZWN0b3IyLCBtYXhEaXN0YW5jZURlbHRhOiBudW1iZXIpOiBWZWN0b3IyIHtcbiAgICBsZXQgdmVjdG9yOiBWZWN0b3IyID0gVmVjMlN1Yih0YXJnZXQsIGN1cnJlbnQpO1xuICAgIGxldCBtYWduaXR1ZGU6IG51bWJlciA9IFZlYzJNYWduaXR1ZGUodmVjdG9yKTtcbiAgICBpZiAoKG1hZ25pdHVkZSA+IG1heERpc3RhbmNlRGVsdGEpICYmIChtYWduaXR1ZGUgIT0gMCkpIHtcbiAgICAgICAgcmV0dXJuIFZlYzJBZGQoY3VycmVudCwgKFZlYzJNdWwoVmVjMkRpdih2ZWN0b3IsIG1hZ25pdHVkZSksIG1heERpc3RhbmNlRGVsdGEpKSk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWZWMyVG9TdHJpbmcodmVjOiBWZWN0b3IyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gVXRpbFN0cmluZy5mb3JtYXQoXCIoezB9LCB7MX0pXCIsIHZlYy54LCB2ZWMueSk7XG59XG5cbi8v772e772e772e772e772e772e772e772e772e772e772e772e772e772e772e772e772e772e772e772e772e772e772edmVjM++9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9nu+9ni8vXG5leHBvcnQgZnVuY3Rpb24gVmVjM0FkZChhOiBWZWN0b3IzLCBiOiBWZWN0b3IzKTogVmVjdG9yMyB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IzKGEueCArIGIueCwgYS55ICsgYi55LCBhLnogKyBiLnopO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVmVjM1N1YihhOiBWZWN0b3IzLCBiOiBWZWN0b3IzKTogVmVjdG9yMyB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IzKGEueCAtIGIueCwgYS55IC0gYi55LCBhLnogLSBiLnopO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVmVjM011bHRpcGx5KGE6IFZlY3RvcjMsIGI6IFZlY3RvcjMpOiBWZWN0b3IzIHtcbiAgICByZXR1cm4gbmV3IFZlY3RvcjMoYS54ICogYi54LCBhLnkgKiBiLnksIGEueiAqIGIueik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWZWMzTXVsKGE6IFZlY3RvcjMsIGQ6IG51bWJlcik6IFZlY3RvcjMge1xuICAgIHJldHVybiBuZXcgVmVjdG9yMyhhLnggKiBkLCBhLnkgKiBkLCBhLnogKiBkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFZlYzNEaXYoYTogVmVjdG9yMywgZDogbnVtYmVyKTogVmVjdG9yMyB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IzKGEueCAvIGQsIGEueSAvIGQsIGEueiAvIGQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVmVjM0Nyb3NzKGxoczogVmVjdG9yMywgcmhzOiBWZWN0b3IzKTogVmVjdG9yMyB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IzKChsaHMueSAqIHJocy56KSAtIChsaHMueiAqIHJocy55KSwgKGxocy56ICogcmhzLngpIC0gKGxocy54ICogcmhzLnopLCAobGhzLnggKiByaHMueSkgLSAobGhzLnkgKiByaHMueCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVmVjM1Byb2plY3QodmVjdG9yOiBWZWN0b3IzLCBvbk5vcm1hbDogVmVjdG9yMyk6IFZlY3RvcjMge1xuICAgIGxldCBudW06IG51bWJlciA9IFZlY3RvcjMuZG90KG9uTm9ybWFsLCBvbk5vcm1hbCk7XG4gICAgaWYgKG51bSA8IDFFLTA1KSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMygpO1xuICAgIH1cbiAgICByZXR1cm4gKFZlYzNEaXYoVmVjM011bChvbk5vcm1hbCwgVmVjdG9yMy5kb3QodmVjdG9yLCBvbk5vcm1hbCkpLCBudW0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFZlYzNNaW4obGhzOiBWZWN0b3IzLCByaHM6IFZlY3RvcjMpOiBWZWN0b3IzIHtcbiAgICByZXR1cm4gbmV3IFZlY3RvcjMoTWF0aC5taW4obGhzLngsIHJocy54KSwgTWF0aC5taW4obGhzLnksIHJocy55KSwgTWF0aC5taW4obGhzLnosIHJocy56KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWZWMzTWF4KGxoczogVmVjdG9yMywgcmhzOiBWZWN0b3IzKTogVmVjdG9yMyB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IzKE1hdGgubWF4KGxocy54LCByaHMueCksIE1hdGgubWF4KGxocy55LCByaHMueSksIE1hdGgubWF4KGxocy56LCByaHMueikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVmVjM01hZ25pdHVkZSh2ZWM6IFZlY3RvcjMpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLnNxcnQoKHZlYy54ICogdmVjLngpICsgKHZlYy55ICogdmVjLnkpICsgKHZlYy56ICogdmVjLnopKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFZlYzNTcXJNYWduaXR1ZGUodmVjOiBWZWN0b3IzKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKHZlYy54ICogdmVjLngpICsgKHZlYy55ICogdmVjLnkpICsgKHZlYy56ICogdmVjLnopO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVmVjM05vcm1hbGl6ZWQodmVjOiBWZWN0b3IzKTogVmVjdG9yMyB7XG4gICAgbGV0IG1hZ25pdHVkZTogbnVtYmVyID0gVmVjdG9yMy5zY2FsYXJMZW5ndGgodmVjKTtcbiAgICBsZXQgdjogVmVjdG9yMztcbiAgICBpZiAobWFnbml0dWRlID4gMUUtMDUpXG4gICAgICAgIHYgPSBWZWMzRGl2KHZlYywgbWFnbml0dWRlKTtcbiAgICBlbHNlXG4gICAgICAgIHYgPSBuZXcgVmVjdG9yMygwLCAwLCAwKTtcbiAgICByZXR1cm4gdjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFZlYzNOb3JtYWwodmVjOiBWZWN0b3IzKTogdm9pZCB7XG4gICAgbGV0IG1hZ25pdHVkZTogbnVtYmVyID0gVmVjdG9yMy5zY2FsYXJMZW5ndGgodmVjKTtcbiAgICBpZiAobWFnbml0dWRlID4gMUUtMDUpIHtcbiAgICAgICAgbGV0IHY6IFZlY3RvcjMgPSBWZWMzRGl2KHZlYywgbWFnbml0dWRlKTtcbiAgICAgICAgVmVjM1NldCh2ZWMsIHYueCwgdi55LCB2LnopO1xuICAgIH0gZWxzZVxuICAgICAgICBWZWMzU2V0KHZlYywgMCwgMCwgMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWZWMzU2V0KHY6IFZlY3RvcjMsIHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWN0b3IzIHtcbiAgICB2LnggPSB4O1xuICAgIHYueSA9IHk7XG4gICAgdi56ID0gejtcbiAgICByZXR1cm4gdjtcbn1cblxuLy8gZXhwb3J0IGZ1bmN0aW9uIFZlYzNBbmdsZShmcm9tOiBWZWN0b3IzLCB0bzogVmVjdG9yMyk6IG51bWJlciB7XG4vLyAgICAgcmV0dXJuIChNYXRoLmFjb3MoVXRpbE1hdGguY2xhbXAoVmVjdG9yMy5kb3QoVmVjM05vcm1hbGl6ZWQoZnJvbSksIFZlYzNOb3JtYWxpemVkKHRvKSksIC0xLCAxKSkgKiA1Ny4yOTU3OCk7XG4vLyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBWZWMzQ2xhbXBNYWduaXR1ZGUodmVjdG9yOiBWZWN0b3IzLCBtYXhMZW5ndGgpOiBWZWN0b3IzIHtcbiAgICBpZiAoVmVjdG9yMy5zY2FsYXJMZW5ndGhTcXVhcmVkKHZlY3RvcikgPiAobWF4TGVuZ3RoICogbWF4TGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gKFZlYzNNdWwoVmVjM05vcm1hbGl6ZWQodmVjdG9yKSwgbWF4TGVuZ3RoKSk7XG4gICAgfVxuICAgIHJldHVybiB2ZWN0b3I7XG59XG5cbi8vIGV4cG9ydCBmdW5jdGlvbiBWZWMzTGVycChmcm9tOiBWZWN0b3IzLCB0bzogVmVjdG9yMywgdDogbnVtYmVyKTogVmVjdG9yMyB7XG4vLyAgICAgdCA9IFV0aWxNYXRoLmNsYW1wKHQsIDAsIDEpO1xuLy8gICAgIHJldHVybiBuZXcgVmVjdG9yMyhmcm9tLnggKyAoKHRvLnggLSBmcm9tLngpICogdCksIGZyb20ueSArICgodG8ueSAtIGZyb20ueSkgKiB0KSwgZnJvbS56ICsgKCh0by56IC0gZnJvbS56KSAqIHQpKTtcbi8vIH1cblxuZXhwb3J0IGZ1bmN0aW9uIFZlYzNNb3ZlVG93YXJkcyhjdXJyZW50OiBWZWN0b3IzLCB0YXJnZXQ6IFZlY3RvcjMsIG1heERpc3RhbmNlRGVsdGE6IG51bWJlcik6IFZlY3RvcjMge1xuICAgIGxldCB2ZWN0b3I6IFZlY3RvcjMgPSBWZWMzU3ViKHRhcmdldCwgY3VycmVudCk7XG4gICAgbGV0IG1hZ25pdHVkZTogbnVtYmVyID0gVmVjdG9yMy5zY2FsYXJMZW5ndGgodmVjdG9yKTtcbiAgICBpZiAoKG1hZ25pdHVkZSA+IG1heERpc3RhbmNlRGVsdGEpICYmIChtYWduaXR1ZGUgIT0gMCkpIHtcbiAgICAgICAgcmV0dXJuIFZlYzNBZGQoY3VycmVudCwgKFZlYzNNdWwoVmVjM0Rpdih2ZWN0b3IsIG1hZ25pdHVkZSksIG1heERpc3RhbmNlRGVsdGEpKSk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWZWMzVG9TdHJpbmcodmVjOiBWZWN0b3IzKTogc3RyaW5nIHtcbiAgICByZXR1cm4gVXRpbFN0cmluZy5mb3JtYXQoXCIoezB9LCB7MX0sIHsyfSlcIiwgdmVjLngsIHZlYy55LCB2ZWMueik7XG59XG5cbi8qKlxuICog5byn5bqm6L2s5ZCR6YePXG4gKiBAcGFyYW0gICAgcmFkaWFucyAgICDlvKfluqZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExpbmVGcm9tUmFkaWFucyhyYWRpYW5zOiBudW1iZXIpOiBWZWN0b3IyIHtcbiAgICBsZXQgeDogbnVtYmVyID0gTWF0aC5jb3MocmFkaWFucyk7XG4gICAgbGV0IHk6IG51bWJlciA9IE1hdGguc2luKHJhZGlhbnMpO1xuICAgIGxldCBkaXI6IFZlY3RvcjIgPSBuZXcgVmVjdG9yMih4LCB5KTtcbiAgICBWZWMyTm9ybWFsKGRpcik7XG4gICAgcmV0dXJuIGRpcjtcbn1cblxuIiwiaW1wb3J0IHsgVXRpbFN0cmluZyB9IGZyb20gJy4vc3RyaW5nJztcblxuLyoqXG4gKiBAYXV0aG9yIFN1blxuICogQHRpbWUgMjAxOS0wOC0xMSAxODo1NFxuICogQHByb2plY3QgU0ZyYW1ld29ya19MYXlhQWlyXG4gKiBAZGVzY3JpcHRpb24g5pWw5YC85bel5YW357G7XG4gKlxuICovXG5leHBvcnQgY2xhc3MgVXRpbE51bWJlciB7XG4gICAgLyoqXG4gICAgICog5L+d55WZ5bCP5pWw54K55ZCO5Yeg5L2NXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0b0ZpeGVkKHZhbHVlOiBudW1iZXIsIHA6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBVdGlsU3RyaW5nLnRvTnVtYmVyKHZhbHVlLnRvRml4ZWQocCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgdG9JbnQodmFsdWU6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHZhbHVlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGlzSW50KHZhbHVlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbCh2YWx1ZSkgPT0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5L+d55WZ5pyJ5pWI5pWw5YC8XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZXNlcnZlTnVtYmVyKG51bTogbnVtYmVyLCBzaXplOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBsZXQgc3RyID0gU3RyaW5nKG51bSk7XG4gICAgICAgIGxldCBsID0gc3RyLmxlbmd0aDtcbiAgICAgICAgbGV0IHBfaW5kZXg6IG51bWJlciA9IHN0ci5pbmRleE9mKFwiLlwiKTtcbiAgICAgICAgaWYgKHBfaW5kZXggPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXQ6IHN0cmluZyA9IHN0ci5zbGljZSgwLCBwX2luZGV4ICsgMSk7XG5cbiAgICAgICAgbGV0IGxhc3ROdW0gPSBsIC0gcF9pbmRleDtcbiAgICAgICAgaWYgKGxhc3ROdW0gPiBzaXplKSB7XG4gICAgICAgICAgICBsYXN0TnVtID0gc2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGFzdFN0cjogc3RyaW5nID0gc3RyLnNsaWNlKHBfaW5kZXggKyAxLCBwX2luZGV4ICsgMSArIGxhc3ROdW0pO1xuICAgICAgICByZXR1cm4gVXRpbFN0cmluZy50b051bWJlcihyZXQgKyBsYXN0U3RyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDkv53nlZnmnInmlYjmlbDlgLzvvIzkuI3lpJ/ooaUw77yb5rOo5oSP6L+U5Zue55qE5piv5a2X56ym5LiyXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZXNlcnZlTnVtYmVyV2l0aFplcm8obnVtOiBudW1iZXIsIHNpemU6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIGxldCBzdHIgPSBTdHJpbmcobnVtKTtcbiAgICAgICAgbGV0IGwgPSBzdHIubGVuZ3RoO1xuICAgICAgICBsZXQgcF9pbmRleDogbnVtYmVyID0gc3RyLmluZGV4T2YoXCIuXCIpO1xuICAgICAgICBpZiAocF9pbmRleCA8IDApIHsvL+aYr+aVtOaVsFxuICAgICAgICAgICAgc3RyICs9ICcuJztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgKytpKSBzdHIgKz0gJzAnO1xuICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBzdHIuc2xpY2UoMCwgcF9pbmRleCArIDEpO1xuXG4gICAgICAgIGxldCBsYXN0TnVtID0gbCAtIHBfaW5kZXggLSAxO1xuICAgICAgICBpZiAobGFzdE51bSA+IHNpemUpIHsvL+i2hei/h1xuICAgICAgICAgICAgbGFzdE51bSA9IHNpemU7XG4gICAgICAgICAgICBsZXQgbGFzdFN0cjogc3RyaW5nID0gc3RyLnNsaWNlKHBfaW5kZXggKyAxLCBwX2luZGV4ICsgMSArIGxhc3ROdW0pO1xuICAgICAgICAgICAgcmV0dXJuIHJldCArIGxhc3RTdHI7XG4gICAgICAgIH0gZWxzZSBpZiAobGFzdE51bSA8IHNpemUpIHsvL+S4jei2s+ihpTBcbiAgICAgICAgICAgIGxldCBkaWZmOiBudW1iZXIgPSBzaXplIC0gbGFzdE51bTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlmZjsgKytpKSBzdHIgKz0gJzAnO1xuICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGZvcm1hdFRob3VzYW5kc051bWJlcihudW06IG51bWJlcikge1xuICAgICAgICBpZiAobnVtIDwgMTAwMDAwMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bS50b0xvY2FsZVN0cmluZygpO1xuICAgICAgICB9IGVsc2UgaWYgKG51bSA8IDEwMDAwMDAwMDApIHtcbiAgICAgICAgICAgIGxldCB0ID0gTWF0aC5mbG9vcihudW0gLyAxMDAwKVxuICAgICAgICAgICAgcmV0dXJuIHQudG9Mb2NhbGVTdHJpbmcoKSArIFwiS1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHQgPSBNYXRoLmZsb29yKG51bSAvIDEwMDAwMDApXG4gICAgICAgICAgICByZXR1cm4gdC50b0xvY2FsZVN0cmluZygpICsgXCJNXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZm9ybWF0TnVtYmVyU2hvcnQobnVtLCBmaXhlZDogbnVtYmVyID0gMCkge1xuXG4gICAgICAgIGlmIChudW0gPCAxMDAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtO1xuICAgICAgICB9IGVsc2UgaWYgKG51bSA8IDEwMDAwMDApIHtcbiAgICAgICAgICAgIGxldCB0ID0gTWF0aC5mbG9vcihudW0gLyAxMDAwKS50b0ZpeGVkKGZpeGVkKTtcbiAgICAgICAgICAgIHJldHVybiB0ICsgXCJLXCI7XG4gICAgICAgIH0gZWxzZSBpZiAobnVtIDwgMTAwMDAwMDAwMCkge1xuICAgICAgICAgICAgbGV0IHQgPSBNYXRoLmZsb29yKG51bSAvIDEwMDAwMDApLnRvRml4ZWQoZml4ZWQpO1xuICAgICAgICAgICAgcmV0dXJuIHQgKyBcIk1cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0ID0gTWF0aC5mbG9vcihudW0gLyAxMDAwMDAwMDAwKS50b0ZpeGVkKGZpeGVkKTtcbiAgICAgICAgICAgIHJldHVybiB0LnRvTG9jYWxlU3RyaW5nKCkgKyBcIkdcIjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiDnp5HlraborqHmlbDms5XmmL7npLpcbiAgICAgKiBAcGFyYW0gbnVtMVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYmlnTnVtYmVyRm9ybWF0KG51bTogc3RyaW5nLGZpeGVkOm51bWJlciA9IDIpIHtcbiAgICAgICAgbGV0IGV4dHMgPSBbXG4gICAgICAgICAgICAnJywgJ0snLCBcIk1cIiwgXCJHXCIsIFwiVFwiLCBcIlBcIiwgXCJFXCIsIFwiWlwiLCBcIllcIiwgXCJBQVwiLFxuICAgICAgICAgICAgXCJCQlwiLCBcIkNDXCIsICdERCcsICdFRScsIFwiRkZcIiwgXCJHR1wiLCBcIkhIXCIsIFwiSUlcIixcbiAgICAgICAgICAgIFwiSkpcIiwgXCJLS1wiLCAnTEwnLCAnTU0nLCBcIk5OXCIsIFwiT09cIiwgXCJQUFwiLCBcIlFRXCIsXG4gICAgICAgICAgICBcIlJSXCIsIFwiU1NcIiwgJ1RUJywgJ1VVJywgXCJWVlwiLCBcIldXXCIsIFwiWFhcIiwgXCJZWVwiLFxuICAgICAgICAgICAgXCJaWlwiLCBcImFhXCIsICdiYicsICdjYycsIFwiZGRcIiwgXCJlZVwiLCBcImZmXCIsIFwiZ2dcIixcbiAgICAgICAgICAgIFwiaGhcIiwgXCJpaVwiLCAnZ2cnLCAna2snLCBcImxsXCIsIFwibW1cIiwgXCJublwiLCBcIm9vXCIsXG4gICAgICAgICAgICBcInBwXCIsIFwicXFcIiwgJ3JyJywgJ3NzJywgXCJ0dFwiLCBcInV1XCIsIFwidnZcIiwgXCJ3d1wiXG4gICAgICAgIF07XG5cbiAgICAgICAgbGV0IHQxLCB0MjtcbiAgICAgICAgbGV0IG4xID0gbnVtLmluZGV4T2YoXCJlK1wiKTtcbiAgICAgICAgaWYgKG4xID09IC0xKSBuMSA9IG51bS5pbmRleE9mKFwiRVwiKTtcbiAgICAgICAgaWYgKG4xICYmIG4xICE9IC0xKSB7XG4gICAgICAgICAgICB0MSA9IHBhcnNlRmxvYXQobnVtLnN1YnN0cigwLCBuMSkpO1xuICAgICAgICAgICAgdDIgPSBwYXJzZUludChudW0uc3Vic3RyKG4xICsgMikpO1xuXG4gICAgICAgICAgICBsZXQgZXh0ID0gTWF0aC5mbG9vcih0MiAvIDMpO1xuICAgICAgICAgICAgbGV0IG0gPSB0MiAlIDM7XG5cbiAgICAgICAgICAgIHJldHVybiAodDEgKiBNYXRoLnBvdygxMCxtKSkudG9GaXhlZChmaXhlZCkgKyBleHRzW2V4dF07XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiBudW07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pWw5a2X55u45YqgXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBiaWdOdW1iZXJBZGQobnVtMTogc3RyaW5nLCBudW0yOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGIgPSBOdW1iZXIobnVtMSkgKyBOdW1iZXIobnVtMik7XG4gICAgICAgIHJldHVybiBiLnRvRXhwb25lbnRpYWwoNCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pWw5a2X55u45YePXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBiaWdOdW1iZXJTdWIobnVtMTogc3RyaW5nLCBudW0yOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IG4xID0gTnVtYmVyKG51bTEpO1xuICAgICAgICBsZXQgbjIgPSBOdW1iZXIobnVtMik7XG4gICAgICAgIGlmIChuMSA8IG4yKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAobjEgLSBuMikudG9FeHBvbmVudGlhbCg0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmlbDlrZfnm7jkuZjms5VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGJpZ051bWJlck11bChudW0xOiBzdHJpbmcsIG51bTI6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gKE51bWJlcihudW0xKSAqIG51bTIpLnRvRXhwb25lbnRpYWwoNCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pWw5a2X55u46ZmkXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBiaWdOdW1iZXJEaXYobnVtMTogc3RyaW5nLCBudW0yOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIChOdW1iZXIobnVtMSkgLyBudW0yKS50b0V4cG9uZW50aWFsKDQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS4pOS4quenkeWtpuiuoeaVsOebuOmZpFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYmlnTnVtYmVyRGl2RG91bmJsZShudW0xOiBzdHJpbmcsIG51bTI6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gKE51bWJlcihudW0xKSAvIE51bWJlcihudW0yKSk7XG4gICAgfVxuXG59XG4iLCIvKipcbiAqIEBhdXRob3IgU3VuXG4gKiBAdGltZSAyMDE5LTA4LTExIDE4OjU1XG4gKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcbiAqIEBkZXNjcmlwdGlvbiDlrZfnrKbkuLLlt6XlhbfnsbtcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBVdGlsU3RyaW5nIHtcblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGVtcHR5KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWtl+espuS4suaYr+WQpuacieWAvFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgaXNFbXB0eShzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChzICE9IG51bGwgJiYgcy5sZW5ndGggPiAwKSA/IGZhbHNlIDogdHJ1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHRvSW50KHN0cjogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCFzdHIgfHwgc3RyLmxlbmd0aCA9PSAwKSByZXR1cm4gMDtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN0cik7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyB0b051bWJlcihzdHI6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGlmICghc3RyIHx8IHN0ci5sZW5ndGggPT0gMCkgcmV0dXJuIDA7XG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHN0cik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6I635Y+W5a2X56ym5Liy55yf5a6e6ZW/5bqmLOazqO+8mlxuICAgICAqIDEu5pmu6YCa5pWw57uE77yM5a2X56ym5Y2gMeWtl+iKgu+8m+axieWtkOWNoOS4pOS4quWtl+iKglxuICAgICAqIDIu5aaC5p6c5Y+Y5oiQ57yW56CB77yM5Y+v6IO96K6h566X5o6l5Y+j5LiN5a+5XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXROdW1CeXRlcyhzdHI6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGxldCByZWFsTGVuZ3RoID0gMCwgbGVuID0gc3RyLmxlbmd0aCwgY2hhckNvZGUgPSAtMTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgY2hhckNvZGUgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgIGlmIChjaGFyQ29kZSA+PSAwICYmIGNoYXJDb2RlIDw9IDEyOCkgcmVhbExlbmd0aCArPSAxO1xuICAgICAgICAgICAgZWxzZSByZWFsTGVuZ3RoICs9IDI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlYWxMZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6KGl6Zu2XG4gICAgICogQHBhcmFtIHN0clxuICAgICAqIEBwYXJhbSBsZW5cbiAgICAgKiBAcGFyYW0gZGlyIDAt5ZCO77ybMS3liY1cbiAgICAgKiBAcmV0dXJuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGRaZXJvKHN0cjogc3RyaW5nLCBsZW46IG51bWJlciwgZGlyOiBudW1iZXIgPSAwKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IF9zdHI6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIGxldCBfbGVuOiBudW1iZXIgPSBzdHIubGVuZ3RoO1xuICAgICAgICBsZXQgc3RyX3ByZV96ZXJvOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgc3RyX2VuZF96ZXJvOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBpZiAoZGlyID09IDApXG4gICAgICAgICAgICBzdHJfZW5kX3plcm8gPSBcIjBcIjtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RyX3ByZV96ZXJvID0gXCIwXCI7XG5cbiAgICAgICAgaWYgKF9sZW4gPCBsZW4pIHtcbiAgICAgICAgICAgIGxldCBpOiBudW1iZXIgPSAwO1xuICAgICAgICAgICAgd2hpbGUgKGkgPCBsZW4gLSBfbGVuKSB7XG4gICAgICAgICAgICAgICAgX3N0ciA9IHN0cl9wcmVfemVybyArIF9zdHIgKyBzdHJfZW5kX3plcm87XG4gICAgICAgICAgICAgICAgKytpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gX3N0ciArIHN0cjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Y676Zmk5bem5Y+z56m65qC8XG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICogQHJldHVyblxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdHJpbShpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGlucHV0ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9eXFxzK3xcXHMrJFwiXCJeXFxzK3xcXHMrJC9nLCBcIlwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDljrvpmaTlt6bkvqfnqbrmoLxcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKiBAcmV0dXJuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0cmltTGVmdChpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGlucHV0ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9eXFxzK1wiXCJeXFxzKy8sIFwiXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWOu+mZpOWPs+S+p+epuuagvFxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqIEByZXR1cm5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHRyaW1SaWdodChpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGlucHV0ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9cXHMrJFwiXCJcXHMrJC8sIFwiXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWIhumSn+S4juenkuagvOW8jyjlpoItPiA0MDoxNSlcbiAgICAgKiBAcGFyYW0gc2Vjb25kcyDnp5LmlbBcbiAgICAgKiBAcmV0dXJuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBtaW51dGVGb3JtYXQoc2Vjb25kczogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IG1pbjogbnVtYmVyID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgICAgICBsZXQgc2VjOiBudW1iZXIgPSBNYXRoLmZsb29yKHNlY29uZHMgJSA2MCk7XG5cbiAgICAgICAgbGV0IG1pbl9zdHI6IHN0cmluZyA9IG1pbiA8IDEwID8gKFwiMFwiICsgbWluLnRvU3RyaW5nKCkpIDogKG1pbi50b1N0cmluZygpKTtcbiAgICAgICAgbGV0IHNlY19zdHI6IHN0cmluZyA9IHNlYyA8IDEwID8gKFwiMFwiICsgc2VjLnRvU3RyaW5nKCkpIDogKHNlYy50b1N0cmluZygpKTtcblxuICAgICAgICByZXR1cm4gbWluX3N0ciArIFwiOlwiICsgc2VjX3N0cjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDml7bliIbnp5LmoLzlvI8o5aaCLT4gMDU6MzI6MjApXG4gICAgICogQHBhcmFtIHNlY29uZHMo56eSKVxuICAgICAqIEByZXR1cm5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGhvdXJGb3JtYXQoc2Vjb25kczogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGhvdXI6IG51bWJlciA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgICAgICBsZXQgaG91cl9zdHI6IFN0cmluZyA9IGhvdXIgPCAxMCA/IChcIjBcIiArIGhvdXIudG9TdHJpbmcoKSkgOiAoaG91ci50b1N0cmluZygpKTtcbiAgICAgICAgcmV0dXJuIGhvdXJfc3RyICsgXCI6XCIgKyBVdGlsU3RyaW5nLm1pbnV0ZUZvcm1hdChzZWNvbmRzICUgMzYwMCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5qC85byP5YyW5a2X56ym5LiyXG4gICAgICogQHBhcmFtIHN0ciDpnIDopoHmoLzlvI/ljJbnmoTlrZfnrKbkuLLvvIzjgJBcIuadsOWNq++8jOi/memHjOaciXswfeS4quiLueaenO+8jOWSjHsxfeS4qummmeiVie+8gVwiLCA1LDEw44CRXG4gICAgICogQHBhcmFtIGFyZ3Mg5Y+C5pWw5YiX6KGoXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBmb3JtYXQoc3RyOiBzdHJpbmcsIC4uLmFyZ3MpOiBzdHJpbmcge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoXCJcXFxce1wiICsgaSArIFwiXFxcXH1cIiwgXCJnbVwiKSwgYXJnc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDku6XmjIflrprlrZfnrKblvIDlp4tcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGJlZ2luc1dpdGgoaW5wdXQ6IHN0cmluZywgcHJlZml4OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHByZWZpeCA9PSBpbnB1dC5zdWJzdHJpbmcoMCwgcHJlZml4Lmxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Lul5oyH5a6a5a2X56ym57uT5p2fXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBlbmRzV2l0aChpbnB1dDogc3RyaW5nLCBzdWZmaXg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gc3VmZml4ID09IGlucHV0LnN1YnN0cmluZyhpbnB1dC5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKipndWlkKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldEdVSURTdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGQgPSBEYXRlLm5vdygpO1xuICAgICAgICBpZiAod2luZG93LnBlcmZvcm1hbmNlICYmIHR5cGVvZiB3aW5kb3cucGVyZm9ybWFuY2Uubm93ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGQgKz0gcGVyZm9ybWFuY2Uubm93KCk7IC8vdXNlIGhpZ2gtcHJlY2lzaW9uIHRpbWVyIGlmIGF2YWlsYWJsZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIChjKSA9PiB7XG4gICAgICAgICAgICBsZXQgciA9IChkICsgTWF0aC5yYW5kb20oKSAqIDE2KSAlIDE2IHwgMDtcbiAgICAgICAgICAgIGQgPSBNYXRoLmZsb29yKGQgLyAxNik7XG4gICAgICAgICAgICByZXR1cm4gKGMgPT0gJ3gnID8gciA6IChyICYgMHgzIHwgMHg4KSkudG9TdHJpbmcoMTYpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDpppblrZfmr43lpKflraZcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGZpcnN0VXBwZXJDYXNlKHdvcmQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB3b3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgd29yZC5zbGljZSgxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmoLzlvI/ljJbkuIvliJLnur/nmoTljZXor41cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGZvcm1hdERhc2hXb3JkKHdvcmQ6IHN0cmluZywgY2FwRmlyc3Q6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBsZXQgZmlyc3QgPSB0cnVlO1xuICAgICAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICAgICAgd29yZC5zcGxpdCgnXycpLmZvckVhY2goKHNlYzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlyc3QpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FwRmlyc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gVXRpbFN0cmluZy5maXJzdFVwcGVyQ2FzZShzZWMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHNlYztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgVXRpbFN0cmluZy5maXJzdFVwcGVyQ2FzZShzZWMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmiKrlj5blrZfnrKbkuLJcbiAgICAgKiBAcGFyYW0gc3RyIOWtl+espuS4slxuICAgICAqIEBwYXJhbSBzdGFydCDlvIDlp4vkvY3nva5cbiAgICAgKiBAcGFyYW0gZW5kIOe7k+adn+S9jee9rlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc3Vic3RyaW5nKHN0cjpzdHJpbmcsc3RhcnQ6bnVtYmVyLGVuZDpudW1iZXIpOnN0cmluZ1xuICAgIHtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoc3RhcnQsZW5kKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmiKrlj5blrZfnrKbkuLJcbiAgICAgKiBAcGFyYW0gc3RyIOWtl+espuS4slxuICAgICAqIEBwYXJhbSBzdGFydCDlvIDlp4vkvY3nva5cbiAgICAgKiBAcGFyYW0gbG9uZyDmiKrlj5bplb/luqZcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHN1YnN0cihzdHI6c3RyaW5nLHN0YXJ0Om51bWJlcixsb25nOm51bWJlcik6c3RyaW5nXG4gICAge1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCxsb25nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlrZfnrKbkuLLovazlr7nosaFcbiAgICAgKiBAcGFyYW0gc3RyXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzdHJUb09iamVjdChzdHI6c3RyaW5nKVxuICAgIHtcbiAgICAgICAgY29uc3Qgc3RyVG9PYmogPSBKU09OLnBhcnNlKHN0cik7XG4gICAgICAgIHJldHVybiBzdHJUb09iajtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIOWvueixoei9rOWtl+espuS4slxuICAgICAqIEBwYXJhbSBzdHJcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIG9ialRvU3RyKG9iajpPYmplY3QpOnN0cmluZ1xuICAgIHtcbiAgICAgICAgY29uc3Qgb2JqVG9TdHIgPSBKU09OLnN0cmluZ2lmeShvYmopXG4gICAgICAgIHJldHVybiBvYmpUb1N0cjtcbiAgICB9XG59XG4iLCIvKipcbiAqIEBhdXRob3IgU3VuXG4gKiBAdGltZSAyMDE5LTA4LTA5IDE5OjE4XG4gKiBAcHJvamVjdCBTRnJhbWV3b3JrX0xheWFBaXJcbiAqIEBkZXNjcmlwdGlvbiAg5pe26Ze05bel5YW3XG4gKlxuICovXG5leHBvcnQgY2xhc3MgVXRpbFRpbWUge1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgbV9TdGFydFRpbWU6IG51bWJlciA9IDA7XG5cbiAgICBwdWJsaWMgc3RhdGljIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLm1fU3RhcnRUaW1lID0gTGF5YS50aW1lci5jdXJyVGltZXI7XG4gICAgfVxuXG4gICAgLyoq5Lik5bin5LmL6Ze055qE5pe26Ze06Ze06ZqULOWNleS9jeenkiovXG4gICAgcHVibGljIHN0YXRpYyBnZXQgZGVsdGFUaW1lKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBMYXlhLnRpbWVyLmRlbHRhICogMC4wMDE7XG4gICAgfVxuXG4gICAgLyoq5Zu65a6a5Lik5bin5LmL6Ze055qE5pe26Ze06Ze06ZqUKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldCBmaXhlZERlbHRhVGltZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICAvKirlvZPliY3ml7bpl7TvvIznm7jlr7l4eHh45bm05byA5aeL57uP6L+H55qE5q+r56eS5pWwKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldCB0aW1lKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBMYXlhLnRpbWVyLmN1cnJUaW1lcjtcbiAgICB9XG5cbiAgICAvKirmuLjmiI/lkK/liqjliLDnjrDlnKjnmoTml7bpl7Qs5Y2V5L2N5q+r56eSKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldCB0aW1lU2luY2VTdGFydHVwKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAoTGF5YS50aW1lci5jdXJyVGltZXIgLSB0aGlzLm1fU3RhcnRUaW1lKTtcbiAgICB9XG5cbiAgICAvKirmuLjmiI/lkK/liqjlkI7vvIznu4/ov4fnmoTluKfmlbAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGZyYW1lQ291bnQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIExheWEudGltZXIuY3VyckZyYW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IHRpbWVTY2FsZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTGF5YS50aW1lci5zY2FsZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHNldCB0aW1lU2NhbGUoc2NhbGU6IG51bWJlcikge1xuICAgICAgICBMYXlhLnRpbWVyLnNjYWxlID0gc2NhbGU7XG4gICAgfVxufVxuIiwiLyoqVGhpcyBjbGFzcyBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBMYXlhQWlySURFLCBwbGVhc2UgZG8gbm90IG1ha2UgYW55IG1vZGlmaWNhdGlvbnMuICovXG5pbXBvcnQgU2NlbmU9TGF5YS5TY2VuZTtcbmltcG9ydCBWaWV3PUxheWEuVmlldztcbmltcG9ydCBEaWFsb2c9TGF5YS5EaWFsb2c7XG5pbXBvcnQgQm94PUxheWEuQm94O1xuaW1wb3J0IFRhcD1MYXlhLlRhYjtcbmltcG9ydCBDbGlwPUxheWEuQ2xpcDtcbmltcG9ydCBMaXN0PUxheWEuTGlzdDtcbmltcG9ydCBJbWFnZT1MYXlhLkltYWdlO1xuaW1wb3J0IExhYmVsPUxheWEuTGFiZWw7XG5pbXBvcnQgUGFuZWw9TGF5YS5QYW5lbDtcbmltcG9ydCBTcHJpdGU9TGF5YS5TcHJpdGU7XG5pbXBvcnQgQnV0dG9uPUxheWEuQnV0dG9uO1xuaW1wb3J0IENoZWNrQm94PUxheWEuQ2hlY2tCb3g7XG5pbXBvcnQgSFNsaWRlcj1MYXlhLkhTbGlkZXI7XG5pbXBvcnQgU2xpZGVyPUxheWEuVlNsaWRlcjtcbmltcG9ydCBWaWV3U3RhY2s9TGF5YS5WaWV3U3RhY2s7XG5pbXBvcnQgQW5pbWF0aW9uPUxheWEuQW5pbWF0aW9uO1xuaW1wb3J0IFByb2dyZXNzQmFyPUxheWEuUHJvZ3Jlc3NCYXI7XG5pbXBvcnQgRnJhbWVBbmltYXRpb249TGF5YS5GcmFtZUFuaW1hdGlvbjtcbmltcG9ydCB7Q3VzdG9tVmlld30gZnJvbSBcIi4uL2ZyYW1ld29yay9tYW5hZ2VyL3VpL3ZpZXctYmFzZVwiO1xuaW1wb3J0IHtDdXN0b21EaWFsb2d9IGZyb20gXCIuLi9mcmFtZXdvcmsvbWFuYWdlci91aS9kaWFsb2ctYmFzZVwiO1xuaW1wb3J0IERpYWxvZ0Jhc2UgPSBDdXN0b21EaWFsb2cuRGlhbG9nQmFzZTtcbmltcG9ydCBWaWV3QmFzZSA9IEN1c3RvbVZpZXcuVmlld0Jhc2U7XG52YXIgUkVHOiBGdW5jdGlvbiA9IExheWEuQ2xhc3NVdGlscy5yZWdDbGFzcztcbmV4cG9ydCBtb2R1bGUgdWkudmlldy5jb20ge1xyXG4gICAgZXhwb3J0IGNsYXNzIGRheTdzVUkgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljICB1aVZpZXc6YW55ID17XCJ0eXBlXCI6XCJEaWFsb2dCYXNlXCIsXCJwcm9wc1wiOntcIndpZHRoXCI6NzUwLFwiaGVpZ2h0XCI6MTMzNH0sXCJjb21wSWRcIjoyLFwibG9hZExpc3RcIjpbXSxcImxvYWRMaXN0M0RcIjpbXX07XHJcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVZpZXcoZGF5N3NVSS51aVZpZXcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFJFRyhcInVpLnZpZXcuY29tLmRheTdzVUlcIixkYXk3c1VJKTtcclxuICAgIGV4cG9ydCBjbGFzcyBpbnZpdGVVSSBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgIHVpVmlldzphbnkgPXtcInR5cGVcIjpcIkRpYWxvZ0Jhc2VcIixcInByb3BzXCI6e1wid2lkdGhcIjo3NTAsXCJoZWlnaHRcIjoxMzM0fSxcImNvbXBJZFwiOjIsXCJsb2FkTGlzdFwiOltdLFwibG9hZExpc3QzRFwiOltdfTtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVmlldyhpbnZpdGVVSS51aVZpZXcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFJFRyhcInVpLnZpZXcuY29tLmludml0ZVVJXCIsaW52aXRlVUkpO1xyXG4gICAgZXhwb3J0IGNsYXNzIGxvdHRlcnlVSSBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cdFx0cHVibGljIGlkbGU6RnJhbWVBbmltYXRpb247XG5cdFx0cHVibGljIGltZ0NvbnRleHQ6SW1hZ2U7XG5cdFx0cHVibGljIGJ0bkNvbmZpcm06QnV0dG9uO1xuXHRcdHB1YmxpYyBidG5DbG9zZTpCdXR0b247XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgIHVpVmlldzphbnkgPXtcInR5cGVcIjpcIkRpYWxvZ0Jhc2VcIixcInByb3BzXCI6e1wieVwiOjAsXCJ4XCI6MCxcIndpZHRoXCI6NzUwLFwiaGVpZ2h0XCI6MTMzNH0sXCJjb21wSWRcIjoyLFwiY2hpbGRcIjpbe1widHlwZVwiOlwiSW1hZ2VcIixcInByb3BzXCI6e1wieVwiOjYxNSxcInhcIjozNzUsXCJza2luXCI6XCJyZXMvY29tL2ltZ19sb3R0ZXJ5X2JvcmRlci5wbmdcIixcImFuY2hvcllcIjowLjUsXCJhbmNob3JYXCI6MC41fSxcImNvbXBJZFwiOjQ1LFwiY2hpbGRcIjpbe1widHlwZVwiOlwiSW1hZ2VcIixcInByb3BzXCI6e1wieVwiOjMxNCxcInhcIjozMTQsXCJ2YXJcIjpcImltZ0NvbnRleHRcIixcInNraW5cIjpcInJlcy9jb20vaW1nX2xvdHRlcnlfY29udGVudC5wbmdcIixcImFuY2hvcllcIjowLjUsXCJhbmNob3JYXCI6MC41fSxcImNvbXBJZFwiOjQ2fSx7XCJ0eXBlXCI6XCJJbWFnZVwiLFwicHJvcHNcIjp7XCJ5XCI6LTY2LFwieFwiOjI1MyxcInNraW5cIjpcInJlcy9jb20vaW1nX3poZW4ucG5nXCJ9LFwiY29tcElkXCI6NDd9LHtcInR5cGVcIjpcIkJ1dHRvblwiLFwicHJvcHNcIjp7XCJ5XCI6NzgwLFwieFwiOjMxNCxcIndpZHRoXCI6MjU4LFwidmFyXCI6XCJidG5Db25maXJtXCIsXCJzdGF0ZU51bVwiOjEsXCJza2luXCI6XCJyZXMvbWFpbi9lZmZlY3QvYnRuX2NvbW1vbl8yLnBuZ1wiLFwiaGVpZ2h0XCI6MTMwLFwiYW5jaG9yWVwiOjAuNSxcImFuY2hvclhcIjowLjV9LFwiY29tcElkXCI6NDgsXCJjaGlsZFwiOlt7XCJ0eXBlXCI6XCJMYWJlbFwiLFwicHJvcHNcIjp7XCJ2YWxpZ25cIjpcIm1pZGRsZVwiLFwidG9wXCI6MCxcInRleHRcIjpcIuaKveWlllwiLFwicmlnaHRcIjowLFwibGVmdFwiOjAsXCJmb250U2l6ZVwiOjYwLFwiYm90dG9tXCI6MCxcImJvbGRcIjp0cnVlLFwiYWxpZ25cIjpcImNlbnRlclwifSxcImNvbXBJZFwiOjQ5fV19LHtcInR5cGVcIjpcIkJ1dHRvblwiLFwicHJvcHNcIjp7XCJ5XCI6LTE5NCxcInhcIjo1ODcsXCJ2YXJcIjpcImJ0bkNsb3NlXCIsXCJzdGF0ZU51bVwiOjEsXCJza2luXCI6XCJyZXMvbWFpbi9lZmZlY3QvYnRuX2Nsb3NlLnBuZ1wiLFwiYW5jaG9yWVwiOjAuNSxcImFuY2hvclhcIjowLjV9LFwiY29tcElkXCI6NTB9XX1dLFwiYW5pbWF0aW9uc1wiOlt7XCJub2Rlc1wiOlt7XCJ0YXJnZXRcIjozNCxcImtleWZyYW1lc1wiOntcInhcIjpbe1widmFsdWVcIjozNjcsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjp0cnVlLFwidGFyZ2V0XCI6MzQsXCJrZXlcIjpcInhcIixcImluZGV4XCI6MH0se1widmFsdWVcIjozNjcsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjp0cnVlLFwidGFyZ2V0XCI6MzQsXCJrZXlcIjpcInhcIixcImluZGV4XCI6MTB9LHtcInZhbHVlXCI6MzY3LFwidHdlZW5NZXRob2RcIjpcImxpbmVhck5vbmVcIixcInR3ZWVuXCI6dHJ1ZSxcInRhcmdldFwiOjM0LFwia2V5XCI6XCJ4XCIsXCJpbmRleFwiOjI1fV0sXCJ2aXNpYmxlXCI6W3tcInZhbHVlXCI6dHJ1ZSxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOmZhbHNlLFwidGFyZ2V0XCI6MzQsXCJrZXlcIjpcInZpc2libGVcIixcImluZGV4XCI6MH0se1widmFsdWVcIjpmYWxzZSxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOmZhbHNlLFwidGFyZ2V0XCI6MzQsXCJrZXlcIjpcInZpc2libGVcIixcImluZGV4XCI6MTB9LHtcInZhbHVlXCI6dHJ1ZSxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOmZhbHNlLFwidGFyZ2V0XCI6MzQsXCJrZXlcIjpcInZpc2libGVcIixcImluZGV4XCI6MTV9LHtcInZhbHVlXCI6ZmFsc2UsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjpmYWxzZSxcInRhcmdldFwiOjM0LFwia2V5XCI6XCJ2aXNpYmxlXCIsXCJpbmRleFwiOjI1fSx7XCJ2YWx1ZVwiOnRydWUsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjpmYWxzZSxcInRhcmdldFwiOjM0LFwia2V5XCI6XCJ2aXNpYmxlXCIsXCJpbmRleFwiOjMwfV0sXCJyb3RhdGlvblwiOlt7XCJ2YWx1ZVwiOjAsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjp0cnVlLFwidGFyZ2V0XCI6MzQsXCJrZXlcIjpcInJvdGF0aW9uXCIsXCJpbmRleFwiOjB9LHtcInZhbHVlXCI6MCxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOnRydWUsXCJ0YXJnZXRcIjozNCxcImtleVwiOlwicm90YXRpb25cIixcImluZGV4XCI6MTB9LHtcInZhbHVlXCI6NyxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOnRydWUsXCJ0YXJnZXRcIjozNCxcImtleVwiOlwicm90YXRpb25cIixcImluZGV4XCI6MTV9LHtcInZhbHVlXCI6NyxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOnRydWUsXCJ0YXJnZXRcIjozNCxcImtleVwiOlwicm90YXRpb25cIixcImluZGV4XCI6MjV9LHtcInZhbHVlXCI6MCxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOnRydWUsXCJ0YXJnZXRcIjozNCxcImtleVwiOlwicm90YXRpb25cIixcImluZGV4XCI6MzB9XX19XSxcIm5hbWVcIjpcImlkbGVcIixcImlkXCI6MSxcImZyYW1lUmF0ZVwiOjI0LFwiYWN0aW9uXCI6MH1dLFwibG9hZExpc3RcIjpbXCJyZXMvY29tL2ltZ19sb3R0ZXJ5X2JvcmRlci5wbmdcIixcInJlcy9jb20vaW1nX2xvdHRlcnlfY29udGVudC5wbmdcIixcInJlcy9jb20vaW1nX3poZW4ucG5nXCIsXCJyZXMvbWFpbi9lZmZlY3QvYnRuX2NvbW1vbl8yLnBuZ1wiLFwicmVzL21haW4vZWZmZWN0L2J0bl9jbG9zZS5wbmdcIl0sXCJsb2FkTGlzdDNEXCI6W119O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XHJcbiAgICAgICAgY3JlYXRlQ2hpbGRyZW4oKTp2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVWaWV3KGxvdHRlcnlVSS51aVZpZXcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFJFRyhcInVpLnZpZXcuY29tLmxvdHRlcnlVSVwiLGxvdHRlcnlVSSk7XHJcbiAgICBleHBvcnQgY2xhc3MgcmFua1VJIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyAgdWlWaWV3OmFueSA9e1widHlwZVwiOlwiRGlhbG9nQmFzZVwiLFwicHJvcHNcIjp7XCJ3aWR0aFwiOjc1MCxcImhlaWdodFwiOjEzMzR9LFwiY29tcElkXCI6MixcImNoaWxkXCI6W3tcInR5cGVcIjpcIldYT3BlbkRhdGFWaWV3ZXJcIixcInByb3BzXCI6e1wieVwiOjM4MSxcInhcIjoxMTYsXCJ3aWR0aFwiOjUyNCxcIm1vdXNlVGhyb3VnaFwiOnRydWUsXCJpY29uU2lnblwiOlwid3hcIixcImhlaWdodFwiOjg1OCxcInJ1bnRpbWVcIjpcImxheWEudWkuV1hPcGVuRGF0YVZpZXdlclwifSxcImNvbXBJZFwiOjN9XSxcImxvYWRMaXN0XCI6W10sXCJsb2FkTGlzdDNEXCI6W119O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XHJcbiAgICAgICAgY3JlYXRlQ2hpbGRyZW4oKTp2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVWaWV3KHJhbmtVSS51aVZpZXcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFJFRyhcInVpLnZpZXcuY29tLnJhbmtVSVwiLHJhbmtVSSk7XHJcbiAgICBleHBvcnQgY2xhc3Mgc2hvcFVJIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyAgdWlWaWV3OmFueSA9e1widHlwZVwiOlwiRGlhbG9nQmFzZVwiLFwicHJvcHNcIjp7XCJ3aWR0aFwiOjc1MCxcIm1vdXNlVGhyb3VnaFwiOnRydWUsXCJoZWlnaHRcIjoxMzM0fSxcImNvbXBJZFwiOjIsXCJsb2FkTGlzdFwiOltdLFwibG9hZExpc3QzRFwiOltdfTtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVmlldyhzaG9wVUkudWlWaWV3KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBSRUcoXCJ1aS52aWV3LmNvbS5zaG9wVUlcIixzaG9wVUkpO1xyXG59XHJcbmV4cG9ydCBtb2R1bGUgdWkudmlldy5tYWluIHtcclxuICAgIGV4cG9ydCBjbGFzcyBiZ1VJIGV4dGVuZHMgVmlld0Jhc2Uge1xyXG5cdFx0cHVibGljIGltZ0JnOkltYWdlO1xuICAgICAgICBwdWJsaWMgc3RhdGljICB1aVZpZXc6YW55ID17XCJ0eXBlXCI6XCJWaWV3QmFzZVwiLFwicHJvcHNcIjp7XCJ3aWR0aFwiOjc1MCxcImhlaWdodFwiOjEzMzR9LFwiY29tcElkXCI6MixcImNoaWxkXCI6W3tcInR5cGVcIjpcIkltYWdlXCIsXCJwcm9wc1wiOntcInZhclwiOlwiaW1nQmdcIixcInRvcFwiOjAsXCJza2luXCI6XCJyZXMvbWFpbi9iZy9iZy5wbmdcIixcInJpZ2h0XCI6MCxcImxlZnRcIjowLFwiYm90dG9tXCI6MH0sXCJjb21wSWRcIjo1fV0sXCJsb2FkTGlzdFwiOltcInJlcy9tYWluL2JnL2JnLnBuZ1wiXSxcImxvYWRMaXN0M0RcIjpbXX07XHJcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVZpZXcoYmdVSS51aVZpZXcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFJFRyhcInVpLnZpZXcubWFpbi5iZ1VJXCIsYmdVSSk7XHJcbiAgICBleHBvcnQgY2xhc3MgZDNVSSBleHRlbmRzIFZpZXdCYXNlIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljICB1aVZpZXc6YW55ID17XCJ0eXBlXCI6XCJWaWV3QmFzZVwiLFwicHJvcHNcIjp7XCJ3aWR0aFwiOjc1MCxcImhlaWdodFwiOjEzMzR9LFwiY29tcElkXCI6MixcImxvYWRMaXN0XCI6W10sXCJsb2FkTGlzdDNEXCI6W119O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XHJcbiAgICAgICAgY3JlYXRlQ2hpbGRyZW4oKTp2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVWaWV3KGQzVUkudWlWaWV3KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBSRUcoXCJ1aS52aWV3Lm1haW4uZDNVSVwiLGQzVUkpO1xyXG4gICAgZXhwb3J0IGNsYXNzIGVmZmVjdFVJIGV4dGVuZHMgVmlld0Jhc2Uge1xyXG5cdFx0cHVibGljIGJ0bkx1Y2t5OkJ1dHRvbjtcblx0XHRwdWJsaWMgYnRuUmFuazpCdXR0b247XG5cdFx0cHVibGljIGJ0bkludml0ZTpCdXR0b247XG5cdFx0cHVibGljIGJ0blNldHRpbmc6QnV0dG9uO1xuICAgICAgICBwdWJsaWMgc3RhdGljICB1aVZpZXc6YW55ID17XCJ0eXBlXCI6XCJWaWV3QmFzZVwiLFwicHJvcHNcIjp7XCJ3aWR0aFwiOjc1MCxcImhlaWdodFwiOjEzMzR9LFwiY29tcElkXCI6MixcImNoaWxkXCI6W3tcInR5cGVcIjpcIkltYWdlXCIsXCJwcm9wc1wiOntcInlcIjo2NCxcInhcIjo3MixcIndpZHRoXCI6MjEzLFwic2tpblwiOlwicmVzL21haW4vZWZmZWN0L2ltYWdlX3N0YXR1cy5wbmdcIixcImhlaWdodFwiOjQ2fSxcImNvbXBJZFwiOjN9LHtcInR5cGVcIjpcIkltYWdlXCIsXCJwcm9wc1wiOntcInlcIjo2NCxcInhcIjo0NTksXCJ3aWR0aFwiOjIxMyxcInNraW5cIjpcInJlcy9tYWluL2VmZmVjdC9pbWFnZV9zdGF0dXMucG5nXCIsXCJoZWlnaHRcIjo0Nn0sXCJjb21wSWRcIjo0fSx7XCJ0eXBlXCI6XCJJbWFnZVwiLFwicHJvcHNcIjp7XCJ5XCI6NDgsXCJ4XCI6NDAzLFwic2tpblwiOlwicmVzL21haW4vZWZmZWN0L2ltZ19kaWFtb25kLnBuZ1wifSxcImNvbXBJZFwiOjV9LHtcInR5cGVcIjpcIkltYWdlXCIsXCJwcm9wc1wiOntcInlcIjo0NCxcInhcIjozMCxcInNraW5cIjpcInJlcy9tYWluL2VmZmVjdC9pbWdfZ2xvZC5wbmdcIn0sXCJjb21wSWRcIjo2fSx7XCJ0eXBlXCI6XCJCdXR0b25cIixcInByb3BzXCI6e1wieVwiOjI4MixcInhcIjozNzUsXCJ3aWR0aFwiOjIwNyxcInZhclwiOlwiYnRuTHVja3lcIixcInN0YXRlTnVtXCI6MSxcInNraW5cIjpcInJlcy9tYWluL2VmZmVjdC9idG5fY29tbW9uXzEucG5nXCIsXCJoZWlnaHRcIjoxMDQsXCJhbmNob3JZXCI6MC41LFwiYW5jaG9yWFwiOjAuNX0sXCJjb21wSWRcIjo3LFwiY2hpbGRcIjpbe1widHlwZVwiOlwiTGFiZWxcIixcInByb3BzXCI6e1widmFsaWduXCI6XCJtaWRkbGVcIixcInRvcFwiOjAsXCJ0ZXh0XCI6XCLovaznm5hcIixcInJpZ2h0XCI6MCxcImxlZnRcIjowLFwiZm9udFNpemVcIjo0MCxcImJvdHRvbVwiOjAsXCJib2xkXCI6dHJ1ZSxcImFsaWduXCI6XCJjZW50ZXJcIn0sXCJjb21wSWRcIjoxMX1dfSx7XCJ0eXBlXCI6XCJCdXR0b25cIixcInByb3BzXCI6e1wieVwiOjQzOSxcInhcIjozNzUsXCJ3aWR0aFwiOjIwNyxcInZhclwiOlwiYnRuUmFua1wiLFwic3RhdGVOdW1cIjoxLFwic2tpblwiOlwicmVzL21haW4vZWZmZWN0L2J0bl9jb21tb25fMi5wbmdcIixcImhlaWdodFwiOjEwNCxcImFuY2hvcllcIjowLjUsXCJhbmNob3JYXCI6MC41fSxcImNvbXBJZFwiOjgsXCJjaGlsZFwiOlt7XCJ0eXBlXCI6XCJMYWJlbFwiLFwicHJvcHNcIjp7XCJ2YWxpZ25cIjpcIm1pZGRsZVwiLFwidG9wXCI6MCxcInRleHRcIjpcIuaOkuihjFwiLFwicmlnaHRcIjowLFwibGVmdFwiOjAsXCJmb250U2l6ZVwiOjQwLFwiYm90dG9tXCI6MCxcImJvbGRcIjp0cnVlLFwiYWxpZ25cIjpcImNlbnRlclwifSxcImNvbXBJZFwiOjEyfV19LHtcInR5cGVcIjpcIkJ1dHRvblwiLFwicHJvcHNcIjp7XCJ5XCI6NjA2LFwieFwiOjM3NSxcIndpZHRoXCI6MjA3LFwidmFyXCI6XCJidG5JbnZpdGVcIixcInN0YXRlTnVtXCI6MSxcInNraW5cIjpcInJlcy9tYWluL2VmZmVjdC9idG5fY29tbW9uXzMucG5nXCIsXCJoZWlnaHRcIjoxMDQsXCJhbmNob3JZXCI6MC41LFwiYW5jaG9yWFwiOjAuNX0sXCJjb21wSWRcIjo5LFwiY2hpbGRcIjpbe1widHlwZVwiOlwiTGFiZWxcIixcInByb3BzXCI6e1widmFsaWduXCI6XCJtaWRkbGVcIixcInRvcFwiOjAsXCJ0ZXh0XCI6XCLpgoDor7dcIixcInJpZ2h0XCI6MCxcImxlZnRcIjowLFwiZm9udFNpemVcIjo0MCxcImJvdHRvbVwiOjAsXCJib2xkXCI6dHJ1ZSxcImFsaWduXCI6XCJjZW50ZXJcIn0sXCJjb21wSWRcIjoxM31dfSx7XCJ0eXBlXCI6XCJCdXR0b25cIixcInByb3BzXCI6e1wieVwiOjc3NixcInhcIjozNzUsXCJ3aWR0aFwiOjIwNyxcInZhclwiOlwiYnRuU2V0dGluZ1wiLFwic3RhdGVOdW1cIjoxLFwic2tpblwiOlwicmVzL21haW4vZWZmZWN0L2J0bl9jb21tb25fNC5wbmdcIixcImhlaWdodFwiOjEwNCxcImFuY2hvcllcIjowLjUsXCJhbmNob3JYXCI6MC41fSxcImNvbXBJZFwiOjEwLFwiY2hpbGRcIjpbe1widHlwZVwiOlwiTGFiZWxcIixcInByb3BzXCI6e1widmFsaWduXCI6XCJtaWRkbGVcIixcInRvcFwiOjAsXCJ0ZXh0XCI6XCLorr7nva5cIixcInJpZ2h0XCI6MCxcImxlZnRcIjowLFwiZm9udFNpemVcIjo0MCxcImJvdHRvbVwiOjAsXCJib2xkXCI6dHJ1ZSxcImFsaWduXCI6XCJjZW50ZXJcIn0sXCJjb21wSWRcIjoxNH1dfV0sXCJsb2FkTGlzdFwiOltcInJlcy9tYWluL2VmZmVjdC9pbWFnZV9zdGF0dXMucG5nXCIsXCJyZXMvbWFpbi9lZmZlY3QvaW1nX2RpYW1vbmQucG5nXCIsXCJyZXMvbWFpbi9lZmZlY3QvaW1nX2dsb2QucG5nXCIsXCJyZXMvbWFpbi9lZmZlY3QvYnRuX2NvbW1vbl8xLnBuZ1wiLFwicmVzL21haW4vZWZmZWN0L2J0bl9jb21tb25fMi5wbmdcIixcInJlcy9tYWluL2VmZmVjdC9idG5fY29tbW9uXzMucG5nXCIsXCJyZXMvbWFpbi9lZmZlY3QvYnRuX2NvbW1vbl80LnBuZ1wiXSxcImxvYWRMaXN0M0RcIjpbXX07XHJcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVZpZXcoZWZmZWN0VUkudWlWaWV3KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBSRUcoXCJ1aS52aWV3Lm1haW4uZWZmZWN0VUlcIixlZmZlY3RVSSk7XHJcbiAgICBleHBvcnQgY2xhc3MgZ2FtZVVJIGV4dGVuZHMgVmlld0Jhc2Uge1xyXG5cdFx0cHVibGljIGFuaV9ncmFwOkZyYW1lQW5pbWF0aW9uO1xuXHRcdHB1YmxpYyBhbmlfbHVja0JMOkZyYW1lQW5pbWF0aW9uO1xuICAgICAgICBwdWJsaWMgc3RhdGljICB1aVZpZXc6YW55ID17XCJ0eXBlXCI6XCJWaWV3QmFzZVwiLFwicHJvcHNcIjp7XCJ3aWR0aFwiOjc1MCxcImhlaWdodFwiOjEzMzR9LFwiY29tcElkXCI6MixcImFuaW1hdGlvbnNcIjpbe1wibm9kZXNcIjpbe1widGFyZ2V0XCI6NDEzLFwia2V5ZnJhbWVzXCI6e1widmlzaWJsZVwiOlt7XCJ2YWx1ZVwiOmZhbHNlLFwidHdlZW5NZXRob2RcIjpcImxpbmVhck5vbmVcIixcInR3ZWVuXCI6ZmFsc2UsXCJ0YXJnZXRcIjo0MTMsXCJrZXlcIjpcInZpc2libGVcIixcImluZGV4XCI6MH0se1widmFsdWVcIjp0cnVlLFwidHdlZW5NZXRob2RcIjpcImxpbmVhck5vbmVcIixcInR3ZWVuXCI6ZmFsc2UsXCJ0YXJnZXRcIjo0MTMsXCJrZXlcIjpcInZpc2libGVcIixcImluZGV4XCI6Mn0se1widmFsdWVcIjpmYWxzZSxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOmZhbHNlLFwidGFyZ2V0XCI6NDEzLFwia2V5XCI6XCJ2aXNpYmxlXCIsXCJpbmRleFwiOjR9LHtcInZhbHVlXCI6dHJ1ZSxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOmZhbHNlLFwidGFyZ2V0XCI6NDEzLFwia2V5XCI6XCJ2aXNpYmxlXCIsXCJpbmRleFwiOjZ9LHtcInZhbHVlXCI6ZmFsc2UsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjpmYWxzZSxcInRhcmdldFwiOjQxMyxcImtleVwiOlwidmlzaWJsZVwiLFwiaW5kZXhcIjo4fSx7XCJ2YWx1ZVwiOnRydWUsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjpmYWxzZSxcInRhcmdldFwiOjQxMyxcImtleVwiOlwidmlzaWJsZVwiLFwiaW5kZXhcIjoxMH0se1widmFsdWVcIjpmYWxzZSxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOmZhbHNlLFwidGFyZ2V0XCI6NDEzLFwia2V5XCI6XCJ2aXNpYmxlXCIsXCJpbmRleFwiOjEyfV19fSx7XCJ0YXJnZXRcIjozMjQsXCJrZXlmcmFtZXNcIjp7XCJ2aXNpYmxlXCI6W3tcInZhbHVlXCI6dHJ1ZSxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOmZhbHNlLFwidGFyZ2V0XCI6MzI0LFwia2V5XCI6XCJ2aXNpYmxlXCIsXCJpbmRleFwiOjB9LHtcInZhbHVlXCI6ZmFsc2UsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjpmYWxzZSxcInRhcmdldFwiOjMyNCxcImtleVwiOlwidmlzaWJsZVwiLFwiaW5kZXhcIjoyfSx7XCJ2YWx1ZVwiOnRydWUsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjpmYWxzZSxcInRhcmdldFwiOjMyNCxcImtleVwiOlwidmlzaWJsZVwiLFwiaW5kZXhcIjo0fSx7XCJ2YWx1ZVwiOmZhbHNlLFwidHdlZW5NZXRob2RcIjpcImxpbmVhck5vbmVcIixcInR3ZWVuXCI6ZmFsc2UsXCJ0YXJnZXRcIjozMjQsXCJrZXlcIjpcInZpc2libGVcIixcImluZGV4XCI6Nn0se1widmFsdWVcIjp0cnVlLFwidHdlZW5NZXRob2RcIjpcImxpbmVhck5vbmVcIixcInR3ZWVuXCI6ZmFsc2UsXCJ0YXJnZXRcIjozMjQsXCJrZXlcIjpcInZpc2libGVcIixcImluZGV4XCI6OH0se1widmFsdWVcIjpmYWxzZSxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOmZhbHNlLFwidGFyZ2V0XCI6MzI0LFwia2V5XCI6XCJ2aXNpYmxlXCIsXCJpbmRleFwiOjEwfSx7XCJ2YWx1ZVwiOnRydWUsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjpmYWxzZSxcInRhcmdldFwiOjMyNCxcImtleVwiOlwidmlzaWJsZVwiLFwiaW5kZXhcIjoxMn1dfX1dLFwibmFtZVwiOlwiYW5pX2dyYXBcIixcImlkXCI6MjksXCJmcmFtZVJhdGVcIjoyNCxcImFjdGlvblwiOjB9LHtcIm5vZGVzXCI6W3tcInRhcmdldFwiOjQ2OCxcImtleWZyYW1lc1wiOntcInJvdGF0aW9uXCI6W3tcInZhbHVlXCI6MCxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOnRydWUsXCJ0YXJnZXRcIjo0NjgsXCJrZXlcIjpcInJvdGF0aW9uXCIsXCJpbmRleFwiOjB9LHtcInZhbHVlXCI6MzYwLFwidHdlZW5NZXRob2RcIjpcImxpbmVhck5vbmVcIixcInR3ZWVuXCI6dHJ1ZSxcInRhcmdldFwiOjQ2OCxcImtleVwiOlwicm90YXRpb25cIixcImluZGV4XCI6MjAwfV0sXCJhbHBoYVwiOlt7XCJ2YWx1ZVwiOjEsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjp0cnVlLFwidGFyZ2V0XCI6NDY4LFwia2V5XCI6XCJhbHBoYVwiLFwiaW5kZXhcIjowfSx7XCJ2YWx1ZVwiOjAuNSxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOnRydWUsXCJ0YXJnZXRcIjo0NjgsXCJrZXlcIjpcImFscGhhXCIsXCJpbmRleFwiOjUwfSx7XCJ2YWx1ZVwiOjEsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjp0cnVlLFwidGFyZ2V0XCI6NDY4LFwia2V5XCI6XCJhbHBoYVwiLFwiaW5kZXhcIjoxMDB9LHtcInZhbHVlXCI6MC41LFwidHdlZW5NZXRob2RcIjpcImxpbmVhck5vbmVcIixcInR3ZWVuXCI6dHJ1ZSxcInRhcmdldFwiOjQ2OCxcImtleVwiOlwiYWxwaGFcIixcImluZGV4XCI6MTUwfSx7XCJ2YWx1ZVwiOjEsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjp0cnVlLFwidGFyZ2V0XCI6NDY4LFwia2V5XCI6XCJhbHBoYVwiLFwiaW5kZXhcIjoyMDB9XX19LHtcInRhcmdldFwiOjQ2OSxcImtleWZyYW1lc1wiOntcInJvdGF0aW9uXCI6W3tcInZhbHVlXCI6MCxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOnRydWUsXCJ0YXJnZXRcIjo0NjksXCJrZXlcIjpcInJvdGF0aW9uXCIsXCJpbmRleFwiOjB9LHtcInZhbHVlXCI6LTM2MCxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOnRydWUsXCJ0YXJnZXRcIjo0NjksXCJrZXlcIjpcInJvdGF0aW9uXCIsXCJpbmRleFwiOjIwMH1dLFwiYWxwaGFcIjpbe1widmFsdWVcIjowLjUsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjp0cnVlLFwidGFyZ2V0XCI6NDY5LFwia2V5XCI6XCJhbHBoYVwiLFwiaW5kZXhcIjowfSx7XCJ2YWx1ZVwiOjEsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjp0cnVlLFwidGFyZ2V0XCI6NDY5LFwia2V5XCI6XCJhbHBoYVwiLFwiaW5kZXhcIjo1MH0se1widmFsdWVcIjowLjUsXCJ0d2Vlbk1ldGhvZFwiOlwibGluZWFyTm9uZVwiLFwidHdlZW5cIjp0cnVlLFwidGFyZ2V0XCI6NDY5LFwia2V5XCI6XCJhbHBoYVwiLFwiaW5kZXhcIjoxMDB9LHtcInZhbHVlXCI6MSxcInR3ZWVuTWV0aG9kXCI6XCJsaW5lYXJOb25lXCIsXCJ0d2VlblwiOnRydWUsXCJ0YXJnZXRcIjo0NjksXCJrZXlcIjpcImFscGhhXCIsXCJpbmRleFwiOjE1MH1dfX1dLFwibmFtZVwiOlwiYW5pX2x1Y2tCTFwiLFwiaWRcIjozMCxcImZyYW1lUmF0ZVwiOjI0LFwiYWN0aW9uXCI6MH1dLFwibG9hZExpc3RcIjpbXSxcImxvYWRMaXN0M0RcIjpbXX07XHJcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVZpZXcoZ2FtZVVJLnVpVmlldyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgUkVHKFwidWkudmlldy5tYWluLmdhbWVVSVwiLGdhbWVVSSk7XHJcbiAgICBleHBvcnQgY2xhc3MgbG9hZGluZ1VJIGV4dGVuZHMgVmlld0Jhc2Uge1xyXG5cdFx0cHVibGljIGltZ19iZzpJbWFnZTtcblx0XHRwdWJsaWMgYm94X2J0bTpCb3g7XG5cdFx0cHVibGljIHByb19Mb2FkaW5nOlByb2dyZXNzQmFyO1xuXHRcdHB1YmxpYyBsYmxMb2FkaW5nOkxhYmVsO1xuXHRcdHB1YmxpYyBsYmxfcDpMYWJlbDtcbiAgICAgICAgcHVibGljIHN0YXRpYyAgdWlWaWV3OmFueSA9e1widHlwZVwiOlwiVmlld0Jhc2VcIixcInByb3BzXCI6e1wid2lkdGhcIjo3NTAsXCJoZWlnaHRcIjoxMzM0fSxcImNvbXBJZFwiOjIsXCJjaGlsZFwiOlt7XCJ0eXBlXCI6XCJJbWFnZVwiLFwicHJvcHNcIjp7XCJ5XCI6MCxcInhcIjowLFwidmFyXCI6XCJpbWdfYmdcIixcInRvcFwiOjAsXCJza2luXCI6XCJyZXMvbG9hZGluZy9pbWdfbG9hZGluZ19iZy5wbmdcIixcInJpZ2h0XCI6MCxcImxlZnRcIjowLFwiYm90dG9tXCI6MH0sXCJjb21wSWRcIjozfSx7XCJ0eXBlXCI6XCJCb3hcIixcInByb3BzXCI6e1wieVwiOjAsXCJ4XCI6MCxcIndpZHRoXCI6NDkzLFwidmFyXCI6XCJib3hfYnRtXCIsXCJwaXZvdFlcIjoxNDksXCJwaXZvdFhcIjoyNDksXCJoZWlnaHRcIjoxNDksXCJjZW50ZXJYXCI6MCxcImJvdHRvbVwiOjB9LFwiY29tcElkXCI6NSxcImNoaWxkXCI6W3tcInR5cGVcIjpcIlByb2dyZXNzQmFyXCIsXCJwcm9wc1wiOntcInlcIjoyMCxcInhcIjoyNDcsXCJ2YXJcIjpcInByb19Mb2FkaW5nXCIsXCJza2luXCI6XCJyZXMvbG9hZGluZy9wcm9ncmVzc19sb2FkaW5nLnBuZ1wiLFwicGl2b3RZXCI6MTIsXCJwaXZvdFhcIjoxNzV9LFwiY29tcElkXCI6Nn0se1widHlwZVwiOlwiTGFiZWxcIixcInByb3BzXCI6e1wieVwiOjIwLFwid2lkdGhcIjoyMzgsXCJ2YXJcIjpcImxibExvYWRpbmdcIixcInZhbGlnblwiOlwibWlkZGxlXCIsXCJ0ZXh0XCI6XCIxMDAlXCIsXCJzdHJva2VDb2xvclwiOlwiI2ZmZmZmZlwiLFwic3Ryb2tlXCI6NCxcInBpdm90WVwiOjE2LFwicGl2b3RYXCI6MTE5LFwiaGVpZ2h0XCI6MzIsXCJmb250U2l6ZVwiOjI2LFwiZm9udFwiOlwiQXJpYWxcIixcImNvbG9yXCI6XCIjNTkyMjIyXCIsXCJjZW50ZXJYXCI6MCxcImJvbGRcIjp0cnVlLFwiYWxpZ25cIjpcImNlbnRlclwifSxcImNvbXBJZFwiOjd9LHtcInR5cGVcIjpcIkltYWdlXCIsXCJwcm9wc1wiOntcInlcIjo4NSxcInhcIjoyNDcsXCJ3aWR0aFwiOjQ5MyxcInNraW5cIjpcInJlcy9sb2FkaW5nL2ltZ184ci5wbmdcIixcInBpdm90WVwiOjIwLFwicGl2b3RYXCI6MjQ3LFwiaGVpZ2h0XCI6Mzl9LFwiY29tcElkXCI6OH0se1widHlwZVwiOlwiTGFiZWxcIixcInByb3BzXCI6e1wieVwiOjEyOCxcInhcIjoyNDcsXCJ3aWR0aFwiOjI4MyxcInZhclwiOlwibGJsX3BcIixcInZhbGlnblwiOlwibWlkZGxlXCIsXCJ0ZXh0XCI6XCJQb3dlcmVkIGJ5IExheWFBaXIgRW5naW5lXCIsXCJwaXZvdFlcIjoyMSxcInBpdm90WFwiOjE0MixcImhlaWdodFwiOjQyLFwiZm9udFNpemVcIjoxOCxcImNvbG9yXCI6XCIjZmZmZmZmXCIsXCJib2xkXCI6dHJ1ZSxcImFsaWduXCI6XCJjZW50ZXJcIn0sXCJjb21wSWRcIjo5fV19XSxcImxvYWRMaXN0XCI6W1wicmVzL2xvYWRpbmcvaW1nX2xvYWRpbmdfYmcucG5nXCIsXCJyZXMvbG9hZGluZy9wcm9ncmVzc19sb2FkaW5nLnBuZ1wiLFwicmVzL2xvYWRpbmcvaW1nXzhyLnBuZ1wiXSxcImxvYWRMaXN0M0RcIjpbXX07XHJcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVZpZXcobG9hZGluZ1VJLnVpVmlldyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgUkVHKFwidWkudmlldy5tYWluLmxvYWRpbmdVSVwiLGxvYWRpbmdVSSk7XHJcbn1cciJdfQ==
