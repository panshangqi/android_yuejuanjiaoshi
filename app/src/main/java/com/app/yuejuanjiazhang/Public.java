package com.app.yuejuanjiazhang;

import android.app.Application;
import android.content.Context;

public class Public extends Application {
    public static String ENV = "development";
    public static String cookiestr = "";
    public static Context context = null;
    @Override
    public void onCreate(){
        super.onCreate();
        context = getApplicationContext();
    }
}
