package com.turksat.EU_Patent_Registration_Project.business.utils;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicLong;
import java.security.SecureRandom;

@Service
public class IdGeneratorService {
    
    // Thread-safe sequence counter
    private static final AtomicLong sequenceCounter = new AtomicLong(1);
    
    // Secure random for additional uniqueness
    private static final SecureRandom secureRandom = new SecureRandom();
    
    // Last timestamp to ensure uniqueness within same millisecond
    private static volatile long lastTimestamp = 0;
    
    // Default constructor (no dependencies needed)
    public IdGeneratorService() {
        // No database dependencies
    }
    
    public String generateCustomId(String prefix) {
        // Get current timestamp
        long currentTimestamp = System.currentTimeMillis();
        
        // Ensure uniqueness within same millisecond
        synchronized (this) {
            if (currentTimestamp <= lastTimestamp) {
                currentTimestamp = lastTimestamp + 1;
            }
            lastTimestamp = currentTimestamp;
        }
        
        // Get current year
        int year = LocalDateTime.now().getYear();
        String yearSuffix = String.format("%02d", year % 100); // 2025 -> 25
        
        // Get sequence number (thread-safe)
        long sequence = sequenceCounter.getAndIncrement();
        if (sequence > 9999999) { // Reset if exceeds 7 digits
            sequenceCounter.set(1);
            sequence = 1;
        }
        String sequencePart = String.format("%07d", sequence);
        
        // Get random part for additional uniqueness (3 digits)
        int randomPart = secureRandom.nextInt(1000);
        String randomPartStr = String.format("%03d", randomPart);
        
        // Format: TYPE + YEAR + SEQUENCE + RANDOM
        // Example: PT250000123 + 456 = PT250000123456
        return prefix + yearSuffix + sequencePart + randomPartStr;
    }
    
    /**
     * Alternative method using UUID-based approach
     */
    public String generateCustomIdWithUUID(String prefix) {
        int year = LocalDateTime.now().getYear();
        String yearSuffix = String.format("%02d", year % 100);
        
        // Generate UUID and take first 8 characters
        String uuid = java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        
        // Format: TYPE + YEAR + UUID
        // Example: PT25 + A1B2C3D4 = PT25A1B2C3D4
        return prefix + yearSuffix + uuid;
    }
    
    /**
     * Alternative method using timestamp-based approach
     */
    public String generateCustomIdWithTimestamp(String prefix) {
        LocalDateTime now = LocalDateTime.now();
        
        // Format: TYPE + YEAR + MONTH + DAY + HOUR + MINUTE + SECOND + MILLISECOND
        String timestamp = now.format(DateTimeFormatter.ofPattern("yyMMddHHmmssSSS"));
        
        // Example: PT25 + 0101153025123 = PT250101153025123
        return prefix + timestamp;
    }
}
