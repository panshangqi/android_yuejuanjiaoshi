package com.app.yuejuanjiazhang;

import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.content.pm.ActivityInfo;
import android.webkit.WebView;
import android.widget.Toast;
import android.webkit.ValueCallback;
public class JavaSriptInterface {
    Context context;
    public JavaSriptInterface(Context c) {
        context= c;
    }

    /**
     * 与js交互时用到的方法，在js里直接调用的
     */
    @JavascriptInterface
    public void showToast(String ssss) {

        Toast.makeText(context, ssss, Toast.LENGTH_LONG).show();
    }
    @JavascriptInterface
    public void logv(String msg){
        Log.v("YJ javascript:", msg);
    }

    @JavascriptInterface
    public void setScreenLandscape(){
        ((MainActivity)this.context).setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);//横屏
    }
    @JavascriptInterface
    public void setScreenPortrait(){
        ((MainActivity)this.context).setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);//竖屏
    }
    @JavascriptInterface
    public void test(final String callback){
        String result = "callback success";
        Log.v("YJ callback", callback);
        final WebView webView = ((MainActivity)this.context).webView;
        webView.post(new Runnable() {
            @Override
            public void run() {
                String script = "window."+callback+"();";
                webView.evaluateJavascript(script, new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        //此处为 js 返回的结果
                    }
                });

            }
        });
    }
}
