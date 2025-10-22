package com.turksat.EU_Patent_Registration_Project.core.utils.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JWTUtil {
    private final SecretKey secretKey;
    private final long EXPIRATION_TIME = 1000 * 60 * 40 * 100; // 40 min son 100 abartı

    public JWTUtil(@Value("${jwt.secret}") String SECRET) {
        this.secretKey = Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateTokenWithUserInfo(String username, String firstName, String middleName, String lastName,
            String email) {
        return Jwts.builder()
                .setSubject(username)
                .claim("firstName", firstName)
                .claim("middleName", middleName)
                .claim("lastName", lastName)
                .claim("email", email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateTokenWithUserInfo(String username, String firstName, String middleName, String lastName,
            String email, int userRoleId) {
        return Jwts.builder()
                .setSubject(username)
                .claim("firstName", firstName)
                .claim("middleName", middleName)
                .claim("lastName", lastName)
                .claim("email", email)
                .claim("userRoleId", userRoleId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateTokenWithUserInfo(String username, String firstName, String middleName, String lastName,
            String email, int userRoleId, String phoneNumber, int phoneNumberCountryCodeId) {
        return Jwts.builder()
                .setSubject(username)
                .claim("firstName", firstName)
                .claim("middleName", middleName)
                .claim("lastName", lastName)
                .claim("email", email)
                .claim("userRoleId", userRoleId)
                .claim("phoneNumber", phoneNumber)
                .claim("phoneNumberCountryCodeId", phoneNumberCountryCodeId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateTokenWithUserInfo(String username, String firstName, String middleName, String lastName,
            String email, int userRoleId, String phoneNumber, int phoneNumberCountryCodeId, int userId) {
        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .claim("firstName", firstName)
                .claim("middleName", middleName)
                .claim("lastName", lastName)
                .claim("email", email)
                .claim("userRoleId", userRoleId)
                .claim("phoneNumber", phoneNumber)
                .claim("phoneNumberCountryCodeId", phoneNumberCountryCodeId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractFirstName(String token) {
        return extractClaims(token).get("firstName", String.class);
    }

    public String extractMiddleName(String token) {
        return extractClaims(token).get("middleName", String.class);
    }

    public String extractLastName(String token) {
        return extractClaims(token).get("lastName", String.class);
    }

    public String extractEmail(String token) {
        return extractClaims(token).get("email", String.class);
    }

    public Integer extractUserRoleId(String token) {
        return extractClaims(token).get("userRoleId", Integer.class);
    }

    public String extractPhoneNumber(String token) {
        return extractClaims(token).get("phoneNumber", String.class);
    }

    public Integer extractPhoneNumberCountryCodeId(String token) {
        return extractClaims(token).get("phoneNumberCountryCodeId", Integer.class);
    }

    public Integer extractUserId(String token) {
        return extractClaims(token).get("userId", Integer.class);
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String username, UserDetails userDetails, String token) {
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
}
