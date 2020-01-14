package com.app.yuejuanjiazhang;

import android.content.Context;
import android.util.Log;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;

public class MyCookies {
    public static void setCookies(Context context, String url, String cookie){
        Public.cookiestr = cookie;
        CookieSyncManager.createInstance(context);
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setCookie(url, cookie);//cookies格式自定义
        CookieSyncManager.getInstance().sync();
    }
    public static String getCookie(Context context, String url) {
        if(Public.cookiestr.equals("")){
            CookieSyncManager.createInstance(context);
            CookieManager cookieManager = CookieManager.getInstance();
            Public.cookiestr  = cookieManager.getCookie(url);
            Log.v("YJ cookies", Public.cookiestr);
        }
        return Public.cookiestr;
    }
    public static void removeCookie(Context context) {
        Public.cookiestr = "";
        CookieSyncManager.createInstance(context);
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.removeAllCookie();
        CookieSyncManager.getInstance().sync();
    }
}
