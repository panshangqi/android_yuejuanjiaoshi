package com.app.yuejuanjiazhang;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.SslErrorHandler;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.Toast;

import android.webkit.ValueCallback;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class MainActivity extends AppCompatActivity {
    WebView webView;
    WebSettings webSettings;
    WebViewClient webViewClient;
    Button f5Btn, screenDirection;
    boolean isLoadUrl  = false;
    private long time =0;
    int rotate = 0; //0横屏 1竖屏
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);
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

        webView = (WebView) findViewById(R.id.webView);
        f5Btn = (Button)findViewById(R.id.f5_btn);
        screenDirection = (Button)findViewById(R.id.screen_direction);
        //webView.loadUrl("http://baidu.com");
        webSettings = webView.getSettings();
        // 设置与Js交互的权限
        webSettings.setJavaScriptEnabled(true);

        // 设置允许JS弹窗
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAppCacheMaxSize(1024 * 1024 * 8);// 实现8倍缓存
        webSettings.setAllowFileAccess(true);
        webSettings.setAppCacheEnabled(true);
        String appCachePath = getApplication().getCacheDir().getAbsolutePath();
        String appDatabasePath = getPrePath(appCachePath) + "/app_database";
        Log.v("YJX appCachePath",appCachePath);
        Log.v("YJX appDatabasePath",appDatabasePath);
        webSettings.setAppCachePath(appCachePath);
        webSettings.setDatabaseEnabled(true);
        webSettings.setDatabasePath(appDatabasePath);

        Log.v("YJX",String.valueOf(Build.VERSION.SDK_INT));
        if (Build.VERSION.SDK_INT >= 16) {
            webSettings.setAllowUniversalAccessFromFileURLs(true);
            //是否允许file:// 协议下的js跨域加载http或者https的地址。
        }else{
            try{
                Class<?> clazz = webSettings.getClass();
                Method method = clazz.getMethod("setAllowUniversalAccessFromFileURLs", boolean.class);
                if (method != null) {
                    method.invoke(webSettings, true);
                }
            }catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        if(Build.VERSION.SDK_INT >= 17){
            webView.addJavascriptInterface(new JavaSriptInterface(this), "android");
        }
        webView.setWebViewClient(new WebViewClient() {

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
//                if(!isLoadUrl){
//                    isLoadUrl = true;
//                    view.loadUrl(url);
//                    Log.v("YJ first",url);
//                }
                Log.v("YJ",url);
                super.onPageStarted(view, url, favicon);
            }
            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                Log.v("YJ","proceed Ssl");
                handler.proceed(); // 接受所有证书
            }
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                //view.loadUrl(url);
                return true;//代表由应用处理，就是不再加载，前面已经加载了一次
            }

        });
        if(Public.ENV.equals("development")){
            //google浏览器输入chrome://inspect 可进行调试
            if (Build.VERSION.SDK_INT >= 19){
                Log.v("YJ debug", "setWebContentsDebuggingEnabled true");
                WebView.setWebContentsDebuggingEnabled(true);
            }
            webView.loadUrl("http://192.168.68.228:10033/templates/index.html");
            //webView.loadUrl("https://www.baidu.com");

        }else{
            f5Btn.setVisibility(View.GONE);
            webView.loadUrl("file:///android_asset/build/templates/index.html");
        }


    }
    public void onClick (View view){
        webView.reload();
        Toast.makeText(MainActivity.this,"正在刷新F5.",Toast.LENGTH_SHORT).show();
    }
    public void onRotateClick(View view){
        if(rotate==0){
            rotate = 1;

            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);//横屏
        }else{
            rotate = 0;
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);//竖屏
        }
        Toast.makeText(MainActivity.this,"切换.",Toast.LENGTH_SHORT).show();
    }
    //android 调用 js
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        //Log.v("YJ Change:", String.valueOf(webView.getWidth()) +","+ Log.v("YJ Change:", String.valueOf(webView.getHeight())));
        if(newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE){
            Toast.makeText(getApplicationContext(), "横屏", Toast.LENGTH_SHORT).show();

            sendEvent2HTML(webView, "YJ_SCREEN_EVENT_LANDSCAPE", "{type: 0, text: '横屏'}");
        }else{
            Toast.makeText(getApplicationContext(), "竖屏", Toast.LENGTH_SHORT).show();
            sendEvent2HTML(webView, "YJ_SCREEN_EVENT_PORTRAIT", "{type: 1, text: '竖屏'}");
        }
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && event.getRepeatCount() == 0) {
//            if (webView.canGoBack()) {
//                //webView.goBack();
//                //finish();
//
//            } else {
//                Log.v("YJ","KEYCODE_BACK finish");
//                finish();
//                return true;
//            }
            if ((System.currentTimeMillis() - time > 1000)) {
                Toast.makeText(this, "再按一次返回桌面", Toast.LENGTH_SHORT).show();
                time = System.currentTimeMillis();
            }else{
                Intent intent = new Intent();
                intent.setAction("android.intent.action.MAIN");
                intent.addCategory("android.intent.category.HOME");
                startActivity(intent);
            }

            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
    private static int getStatusBarHeight(Context context) {
        int statusBarHeight = 0;
        Resources res = context.getResources();
        int resourceId = res.getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            statusBarHeight = res.getDimensionPixelSize(resourceId);
        }
        return statusBarHeight;
    }
    private String getPrePath(String curPath){
        int pos = curPath.lastIndexOf('/');
        return curPath.substring(0, pos);
    }
    private void sendEvent2HTML(final WebView webView, final String eventName, final String eventMsg){
        if(Build.VERSION.SDK_INT >= 19){
            webView.post(new Runnable() {
                @Override
                public void run() {
                    String script = "var evt = document.createEvent(\"HTMLEvents\");";
                    script += "evt.initEvent(\""+ eventName +"\", false, false);";
                    script += "evt.message="+eventMsg+";";
                    script += "window.dispatchEvent(evt);";
                    webView.evaluateJavascript(script, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String value) {
                            //此处为 js 返回的结果
                        }
                    });
                }
            });
        }else{
            String errMsg = "sendEvent2HTML SDK_INT="+String.valueOf(Build.VERSION.SDK_INT);
            Toast.makeText(MainActivity.this, errMsg, Toast.LENGTH_LONG).show();
        }
    }
}