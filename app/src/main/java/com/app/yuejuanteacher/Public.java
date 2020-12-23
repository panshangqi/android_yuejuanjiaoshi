package com.app.yuejuanteacher;

import android.app.Application;
import android.content.Context;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;

public class Public extends Application {
    public static String ENV = "development1";
    public static String cookiestr = "";
    public static Context context = null;
    @Override
    public void onCreate(){
        super.onCreate();
        context = getApplicationContext();
    }
//    public static void fadeIn(View view, float startAlpha, float endAlpha, long duration) {
//        if (view.getVisibility() == View.VISIBLE) return;
//
//        view.setVisibility(View.VISIBLE);
//        Animation animation = new AlphaAnimation(startAlpha, endAlpha);
//        animation.setDuration(duration);
//        view.startAnimation(animation);
//    }
//
//    public static void fadeIn(View view) {
//        fadeIn(view, 0F, 1F, 400);
//
//        // We disabled the button in fadeOut(), so enable it here.
//        view.setEnabled(true);
//    }

    public static void fadeOut(View view,int duration) {
        if (view.getVisibility() != View.VISIBLE) return;

        // Since the button is still clickable before fade-out animation
        // ends, we disable the button first to block click.
        view.setEnabled(false);
        Animation animation = new AlphaAnimation(1F, 0F);
        animation.setDuration(duration);
        view.startAnimation(animation);
        view.setVisibility(View.GONE);
    }
}

/*
h5调试：chrome://inspect/#devices
android模拟器连接androidStudio：adb.exe connect 127.0.0.1:62001


 */
