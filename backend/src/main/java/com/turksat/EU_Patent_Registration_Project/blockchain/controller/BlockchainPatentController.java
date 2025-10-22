package com.turksat.EU_Patent_Registration_Project.blockchain.controller;

import com.turksat.EU_Patent_Registration_Project.blockchain.model.Wallet;
import com.turksat.EU_Patent_Registration_Project.blockchain.service.PatentService;
import com.turksat.EU_Patent_Registration_Project.blockchain.service.WalletGenerator;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.math.BigInteger;

@RestController
@RequestMapping("/api/patents")
public class BlockchainPatentController {

    @Autowired
    private PatentService patentService;
    @Autowired
    private  ApplicationRepository applicationRepository;

    @PostMapping("/register")
    public ResponseEntity<String> registerPatent(
            @RequestParam String applicationNumber,
            @RequestParam String email,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam Integer pstatus,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            // MultipartFile → File dönüşümü
            File tempFile = File.createTempFile("upload-", file.getOriginalFilename());
            file.transferTo(tempFile);
            BigInteger status = BigInteger.valueOf(pstatus);
            // Patent kaydını başlat
            String result = patentService.registerPatent(applicationNumber, email, title, description, tempFile,status);

            // Geçici dosyayı temizle
            tempFile.delete();

            if (result != null) {
                return ResponseEntity.ok("Patent başarıyla kaydedildi. Tx Hash: " + result);
            } else {
                return ResponseEntity.status(500).body("Patent kaydı başarısız oldu.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Hata: " + e.getMessage());
        }
    }

    @PostMapping("/registerpatentblockchain")
    public ResponseEntity<String> registerPatentByApplicationNo(  @RequestParam String applicationNumber){
        String result = null;
        try {
             result = patentService.registerPatent(applicationRepository.getApplicationByApplicationNo(applicationNumber),
                    applicationRepository.getApplicationDocumentsByApplicationNo(applicationNumber));

        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body("Hata: " + e.getMessage());
        }

        return ResponseEntity.ok("Patent başarıyla kaydedildi. Tx Hash: " + result);
    }

    @PostMapping("/createwallet")
    public ResponseEntity<Wallet> createWallet( ){
        String result = null;
        try {
            Wallet wallet = WalletGenerator.createWallet();
            return ResponseEntity.ok(wallet);

        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }

    }
}
