package com.turksat.EU_Patent_Registration_Project.business.utils;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Utility class for safe Base64 encoding and decoding operations
 */
public class Base64Utils {
    
    private static final Logger logger = LoggerFactory.getLogger(Base64Utils.class);
    
    /**
     * Safely encode byte array to Base64 string
     * @param data byte array to encode
     * @return Base64 encoded string or null if encoding fails
     */
    public static String encodeSafely(byte[] data) {
        if (data == null || data.length == 0) {
            return null;
        }
        
        try {
            // Use Apache Commons Codec for better encoding
            String encoded = Base64.encodeBase64String(data);
            
            // Validate the encoded string
            if (encoded != null && !encoded.isEmpty()) {
                // Test decoding to ensure it's valid
                try {
                    byte[] decoded = Base64.decodeBase64(encoded);
                    if (decoded.length == data.length) {
                        logger.debug("Base64 encoding successful for {} bytes", data.length);
                        return encoded;
                    } else {
                        logger.error("Base64 encoding validation failed: original length={}, decoded length={}", 
                                   data.length, decoded.length);
                        return null;
                    }
                } catch (Exception e) {
                    logger.error("Base64 encoding validation failed during decode test", e);
                    return null;
                }
            }
            
            return encoded;
        } catch (Exception e) {
            logger.error("Base64 encoding failed for {} bytes", data.length, e);
            return null;
        }
    }
    
    /**
     * Safely decode Base64 string to byte array
     * @param base64String Base64 encoded string
     * @return decoded byte array or null if decoding fails
     */
    public static byte[] decodeSafely(String base64String) {
        if (base64String == null || base64String.isEmpty()) {
            return null;
        }
        
        try {
            // Remove any whitespace and newlines
            String cleaned = base64String.replaceAll("\\s", "");
            
            // Validate Base64 string format
            if (!Base64.isBase64(cleaned)) {
                logger.error("Invalid Base64 string format: {}", base64String);
                return null;
            }
            
            byte[] decoded = Base64.decodeBase64(cleaned);
            logger.debug("Base64 decoding successful for {} characters, result: {} bytes", 
                        base64String.length(), decoded.length);
            return decoded;
        } catch (Exception e) {
            logger.error("Base64 decoding failed for string: {}", base64String, e);
            return null;
        }
    }
    
    /**
     * Check if a string is valid Base64
     * @param base64String string to validate
     * @return true if valid Base64, false otherwise
     */
    public static boolean isValidBase64(String base64String) {
        if (base64String == null || base64String.isEmpty()) {
            return false;
        }
        
        try {
            // Remove whitespace and newlines
            String cleaned = base64String.replaceAll("\\s", "");
            return Base64.isBase64(cleaned);
        } catch (Exception e) {
            logger.error("Base64 validation failed for string: {}", base64String, e);
            return false;
        }
    }
}
