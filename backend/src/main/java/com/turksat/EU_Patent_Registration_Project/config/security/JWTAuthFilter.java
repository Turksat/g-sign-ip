package com.turksat.EU_Patent_Registration_Project.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.turksat.EU_Patent_Registration_Project.business.adapters.CustomUserDetailsService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ErrorResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ResultStatus;
import com.turksat.EU_Patent_Registration_Project.core.utils.security.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTAuthFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    public JWTAuthFilter(JWTUtil jwtUtil, CustomUserDetailsService customUserDetailsService) {
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Public endpoint'ler için JWT validation yapma
        String requestURI = request.getRequestURI();
        if (requestURI.startsWith("/api/countries/") ||
                requestURI.equals("/api/auth/login") ||
                requestURI.equals("/api/users/create")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                username = jwtUtil.extractUsername(token);
            }
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                if (jwtUtil.validateToken(username, userDetails, token)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                            null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                }

            }
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException ex) {
            handleJwtException(response, "JWT has expired", ResultStatus.JWT_EXPIRED);
        } catch (MalformedJwtException ex) {
            handleJwtException(response, "Invalid JWT token", ResultStatus.JWT_INVALID);
        } catch (Exception ex) {
            handleJwtException(response, "Authentication failed", ResultStatus.UNAUTHORIZED);
        }
    }

    private void handleJwtException(HttpServletResponse response, String message, ResultStatus status)
            throws IOException {
        response.setStatus(status.getHttpStatus().value());
        response.setContentType("application/json");
        response.getWriter().write(new ObjectMapper().writeValueAsString(
                new ErrorResult(message, status.getCode())));
    }

}
