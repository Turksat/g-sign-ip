package com.turksat.EU_Patent_Registration_Project.core.utils.security;

import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.UserInfoDTO;
import org.springframework.stereotype.Component;

@Component
public class JWTTokenExtractor {
    
    private final JWTUtil jwtUtil;
    
    public JWTTokenExtractor(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }
    
    /**
     * JWT token'dan user bilgilerini çıkarır
     * @param token JWT token
     * @return UserInfoDTO object
     */
    public UserInfoDTO extractUserInfo(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }
        
        // "Bearer " prefix'ini kaldır
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        try {
            return UserInfoDTO.builder()
                .username(jwtUtil.extractUsername(token))
                .firstName(jwtUtil.extractFirstName(token))
                .middleName(jwtUtil.extractMiddleName(token))
                .lastName(jwtUtil.extractLastName(token))
                .email(jwtUtil.extractEmail(token))
                .userId(jwtUtil.extractUserId(token))
                .build();
        } catch (Exception e) {
            // Token parse edilemezse null döndür
            return null;
        }
    }
    
    /**
     * JWT token'dan sadece username'i çıkarır
     * @param token JWT token
     * @return username string
     */
    public String extractUsername(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }
        
        // "Bearer " prefix'ini kaldır
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        try {
            return jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return null;
        }
    }
}
