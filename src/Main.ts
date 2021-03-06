import GameConfig from "./GameConfig";
import { Engine } from './framework/runtime/engine';


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

	constructor()
	{
		Engine.$.run();
	}
}
//激活启动类
new Main();
