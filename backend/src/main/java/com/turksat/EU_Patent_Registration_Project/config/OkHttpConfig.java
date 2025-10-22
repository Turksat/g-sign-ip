package com.turksat.EU_Patent_Registration_Project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import okhttp3.OkHttpClient;
import java.util.concurrent.TimeUnit;

@Configuration
public class OkHttpConfig {

    @Bean
    public OkHttpClient okHttpClient() {
        return new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(300, TimeUnit.SECONDS) // 5 dakika
                .writeTimeout(60, TimeUnit.SECONDS)
                .build();
    }
}
