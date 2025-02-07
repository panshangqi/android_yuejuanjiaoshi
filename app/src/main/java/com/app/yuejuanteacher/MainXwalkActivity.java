package com.app.yuejuanteacher;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;

import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import android.webkit.ValueCallback;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.Toast;

import org.xwalk.core.XWalkPreferences;
import org.xwalk.core.XWalkUIClient;
import org.xwalk.core.XWalkView;

public class MainXwalkActivity extends AppCompatActivity {
    XWalkView mXwview;
    Button f5Btn, screenDirection;
    LinearLayout firstScreen;
    boolean isLoadUrl  = false;
    private long time =0;
    int rotate = 0; //0横屏 1竖屏
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_main_xwalk);
        /*
        Android 4.4 SDK19之前，Android 的状态栏是黑色背景，无法修改。
        Android 4.4 推出了透明状态栏的效果。
        Android 5.0  SDK21提供了方法可以直接修改状态栏的颜色。
         */
        if (Build.VERSION.SDK_INT >= 21) {
            Window window = getWindow();
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            //设置修改状态栏
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            //设置状态栏的颜色，和你的app主题或者标题栏颜色设置一致就ok了
            window.setStatusBarColor(getResources().getColor(R.color.theme_color));

        }else{
            //全屏
            getWindow().setFlags(WindowManager.LayoutParams. FLAG_FULLSCREEN , WindowManager.LayoutParams. FLAG_FULLSCREEN);
        }

        mXwview = (XWalkView) findViewById(R.id.xWalkWebView);
        mXwview.addJavascriptInterface(new JSInterface(),"android");

        //添加对javascript支持
        XWalkPreferences.setValue("enable-javascript", true);

        //置是否允许通过file url加载的Javascript可以访问其他的源,包括其他的文件和http,https等其他的源
        XWalkPreferences.setValue(XWalkPreferences.ALLOW_UNIVERSAL_ACCESS_FROM_FILE, true);
        //JAVASCRIPT_CAN_OPEN_WINDOW
        XWalkPreferences.setValue(XWalkPreferences.JAVASCRIPT_CAN_OPEN_WINDOW, true);
        // enable multiple windows.
        XWalkPreferences.setValue(XWalkPreferences.SUPPORT_MULTIPLE_WINDOWS, true);

        f5Btn = (Button)findViewById(R.id.f5_btn);
        screenDirection = (Button)findViewById(R.id.screen_direction);
        firstScreen = (LinearLayout)findViewById(R.id.first_screen);

        if(Public.ENV.equals("development"))
        {
            //开启调式,支持谷歌浏览器调式
            XWalkPreferences.setValue(XWalkPreferences.REMOTE_DEBUGGING, true);
            mXwview.loadUrl("http://192.168.8.107:10033/templates/index.html", null);

        }else{
            f5Btn.setVisibility(View.GONE);
            screenDirection.setVisibility(View.GONE);
            mXwview.loadUrl("file:///android_asset/build/templates/index.html", null);
        }

        mXwview.setUIClient(new XWalkUIClient(mXwview){
            @Override
            public void onPageLoadStarted(XWalkView view, String url) {
                super.onPageLoadStarted(view, url);
                Log.v("YJ start", url);
            }
            @Override
            public void onPageLoadStopped(XWalkView view, String url, LoadStatus status) {
                super.onPageLoadStopped(view, url, status);
                Log.v("YJ finish", url);
                mXwview.load("javascript:window.yuejuanteacher=true;", null);
//                Configuration mConfiguration = MainXwalkActivity.this.getResources().getConfiguration();
//                int ori = mConfiguration.orientation; //获取屏幕方向
//                if(url.indexOf("correct_edit_score") != -1){
//                    //if(ori == mConfiguration.ORIENTATION_PORTRAIT){
//                       // setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);//横屏
//                        Log.v("YJ","旋转为横屏");
//                    //}
//                }else{
//                    //if(ori == mConfiguration.ORIENTATION_LANDSCAPE){
//                       // setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);//竖屏
//                        Log.v("YJ","旋转为竖屏");
//                    //}
//                }
                mXwview.post(new Runnable() {
                    @Override
                    public void run() {
                        try
                        {
                            //Thread.sleep(100);    //延时2秒
                            //firstScreen.setVisibility(View.GONE);
                            Public.fadeOut(firstScreen, 1300);
                            //Toast.makeText(MainXwalkActivity.this, "load html", Toast.LENGTH_LONG).show();
                        }
                        catch(Exception e)
                        {
                            e.printStackTrace();
                        }
                    }
                });

            }
        });

    }
    public void onClick (View view){
        mXwview.loadUrl("http://192.168.6.108:10033/templates/index.html", null);
        Toast.makeText(MainXwalkActivity.this,"正在刷新F5.",Toast.LENGTH_SHORT).show();
    }
    public void onRotateClick(View view){
        if(rotate==0){
            rotate = 1;

            //setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);//横屏
        }else{
            rotate = 0;
            //setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);//竖屏
        }
        //Toast.makeText(MainXwalkActivity.this,"切换.",Toast.LENGTH_SHORT).show();
    }
    //android 调用 js
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
    }
    @Override
    public void onBackPressed(){
        Log.v("YJ","Back 返回按键");
    }
    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        if (event.getKeyCode() == KeyEvent.KEYCODE_BACK ) {
            //do something.
            return true;
        } else {
            return super.dispatchKeyEvent(event);
        }
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {


            if ((System.currentTimeMillis() - time > 1000)) {
                Toast.makeText(this, "再按一次返回桌面", Toast.LENGTH_SHORT).show();
                time = System.currentTimeMillis();
            }else{
                Intent intent = new Intent();
                intent.setAction("android.intent.action.MAIN");
                intent.addCategory("android.intent.category.HOME");
                startActivity(intent);
            }
            //finish();
            return true;
        }else{
            return super.onKeyDown(keyCode, event);
        }
    }

    //防止内存泄漏
    @Override
    protected void onDestroy() {
        // TODO Auto-generated method stub
        super.onDestroy();
        if (mXwview != null) {
            mXwview.onDestroy();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (mXwview != null) {
            mXwview.pauseTimers();
            mXwview.onHide();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mXwview != null) {
            mXwview.resumeTimers();
            mXwview.onShow();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (mXwview != null) {
            mXwview.onActivityResult(requestCode, resultCode, data);
        }
    }
    @Override
    protected void onNewIntent(Intent intent) {
        if (mXwview != null) {
            mXwview.onNewIntent(intent);
        }
    }

    public class JSInterface{
        @org.xwalk.core.JavascriptInterface
        public void showToast(String ssss) {

            Toast.makeText(MainXwalkActivity.this, ssss, Toast.LENGTH_LONG).show();
        }
        @org.xwalk.core.JavascriptInterface
        public void logv(String msg){
            Log.v("YJ javascript:", msg);
        }

        @org.xwalk.core.JavascriptInterface
        public void setScreenLandscape(){
            MainXwalkActivity.this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);//横屏
        }
        @org.xwalk.core.JavascriptInterface
        public void setScreenPortrait(){
            MainXwalkActivity.this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);//竖屏
        }
    }

}