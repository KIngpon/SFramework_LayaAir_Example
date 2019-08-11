import {ui} from "../../../ui/layaMaxUI";
import Browser = Laya.Browser;
import popupUI =  ui.view.main.popupUI;
import { DataBase } from '../../../framework/manager/data/data-base';


/**
 * @author Sun
 * @time 2019-08-11 19:02
 * @project SFramework_LayaAir
 * @description 弹出层
 *
 */
export class PopupView extends popupUI{

    /*****************************************页面属性管理*****************************************/


    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************页面生命周期*****************************************/
    private static instance: PopupView

    public static get $(): PopupView {
        if (!this.instance) this.instance = new PopupView();
        return this.instance;
    }




    constructor() {
        super();
    }

    onAwake(): void {
        super.onAwake();
        this.Init();
        this.suitInit();

    }


    /**
     * 初始化一次
     */
    public Init() {

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
    suitInit()
    {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }


    /********************************************——**********************************************/
    ////////////////////////////////////////////分界线////////////////////////////////////////////
    /*****************************************页面初始数据*****************************************/

    /** Des:构造是初始化一次 */
    private initOnce()
    {

    }

    /** Des:每次弹出初始化 */
    private initAll()
    {

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
    protected onData(data: DataBase) {
      
    }

    /********************************************——**********************************************/
    ///////////////////////////////////////////-分界线-///////////////////////////////////////////
}