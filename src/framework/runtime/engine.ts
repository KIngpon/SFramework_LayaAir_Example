import { EventNode } from '../manager/event/event-node';
import { ConfigLayout, ConfigUI, ConfigDebug, ConfigGame, ConfigVersion } from '../setting/config';
import { Log } from '../core/log';
import { UtilTime } from '../util/time';
import { enumDimension, enumAlige, enumScreenModel, enumScaleType } from '../setting/enum';
import Browser = Laya.Browser;
import { SceneManager } from '../manager/scene/scene-manager';
import { ResManager } from '../manager/res/res-manager';
/**
 * @author Sun
 * @time 2019-08-11 18:08
 * @project SFramework_LayaAir
 * @description 框架初始化和游戏入口
 *
 */
export class Engine{


    public layout: ConfigLayout = ConfigLayout.$;
    public game: ConfigGame = ConfigGame.$;
    public ui: ConfigUI = ConfigUI.$;
    public debug: ConfigDebug = ConfigDebug.$;


    constructor() {
    }

    private static instance: Engine = null;
    public static get $(): Engine {
        if (this.instance==null) this.instance = new Engine();
        return this.instance;
    }

    /**
     * 引擎启动入口
     */
    public run(): void {
        Log.info("::: Game Engine Run :::");

        // if (ConfigUI.$.defaultLoadView != null && ConfigUI.$.defaultLoadRes != null) {
        //     //游戏开始
        //     UtilTime.start();
        //     //初始化游戏管理器
        //     this.managerSetUp();
        //     //初始化游戏主循环
        //     Laya.timer.frameLoop(1, this, this.managerUpdate);
        //     //加载Loading页的默认资源
        //     ResManager.$.loadManualAny(ConfigUI.$.defaultLoadRes,()=>{
        //         let loadView = SceneManager.$.showLoadingView();
        //         loadView.onStart();
        //     });
        // } else {
        //    Log.error("Error:Loading资源为空加载失败！");
        // }
       
        this.engineSetup(()=>{
            //游戏开始
            UtilTime.start();
            //初始化游戏管理器
            this.managerSetUp();
            //初始化游戏主循环
            Laya.timer.frameLoop(1, this, this.managerUpdate);
            //加载Loading页
            let loadView = SceneManager.$.showLoadingView();
            loadView.onStart();
        });
       
       
    }

    /**
     * 引擎的初始化设置
     */
    private engineSetup(startCallback)
    {
        /**初始化Laya */
        if (this.game.dimension == enumDimension.Dim3) {
            Laya3D.init(ConfigLayout.$.designWidth, ConfigLayout.$.designHeight);
        } else {
            Laya.init(ConfigLayout.$.designWidth, ConfigLayout.$.designHeight, Laya.WebGL);
        }
        /**背景颜色 */
        Laya.stage.bgColor = "none";
        /**缩放模式 */
        Laya.stage.scaleMode = enumScaleType.ScaleShowAll.toString();
        /**设置屏幕大小 */
        Laya.stage.setScreenSize(Browser.clientWidth, Browser.clientHeight);
        /**设置横竖屏 */
        Laya.stage.screenMode = enumScreenModel.ScreenNone;
        /**水平对齐方式 */
        Laya.stage.alignH = enumAlige.AligeCenter;
        /**垂直对齐方式 */
        Laya.stage.alignV = enumAlige.AligeMiddle;
        /**开启物理引擎 */
        if(ConfigGame.$.physics) Laya["Physics"] && Laya["Physics"].enable();
		/**打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板） */
        if (ConfigDebug.$.isEnableDebugPanel || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
        /**物理辅助线 */
        if (ConfigDebug.$.isPhysicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
        /**性能同级面板 */
        if (ConfigDebug.$.isStat) Laya.Stat.show(ConfigDebug.$.panelX,ConfigDebug.$.panelY);
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
        if(ConfigVersion.$.isOpenVersion){
            Laya.ResourceVersion.enable(ConfigVersion.$.versionFloder,
            Laya.Handler.create(this, startCallback), Laya.ResourceVersion.FILENAME_VERSION);
        }else{
            startCallback.call();
        }
       

    }

    /**
     * 管理器的初始化
     */
    private  managerSetUp(): void {
        // DataManager.$.setup();
        // EventManager.$.setup();
        // InputManager.$.setup();
        // ResManager.$.setup();
        // JsonManager.$.setup();
        // LocaleManager.$.setup();
        // NetManager.$.setup();
        // ObjectManager.$.setup();
        // SceneManager.$.setup();
        // SoundManager.$.setup();
        // TimerManager.$.setup();
    }

    /**
     * 管理器的Update
     */
    private managerUpdate(): void {
       
    }

}