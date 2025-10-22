package com.turksat.EU_Patent_Registration_Project.blockchain.service;

import com.turksat.EU_Patent_Registration_Project.blockchain.model.Wallet;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.ECKeyPair;
import org.web3j.crypto.Keys;
import org.web3j.crypto.WalletUtils;




import java.io.File;
import java.security.SecureRandom;

public class WalletGenerator {



    public static Wallet createWallet() throws Exception{


        //todo : sonra burası düzenlenecek
        Wallet wallet = new Wallet();
        wallet.setAddress("0xdeb08e2b96f0b600ff6fb039d91b1f69b067e85f");
        wallet.setPrivateKey("3e59a96e1d96a5ccb34d538cac3b4ea7cd9ee421a066789b028cc6c296b66d67");
        wallet.setPublicKey("ed341e642d02609aa90c59c2895a4f3be25e45d48c969326f7e335eb037a8e36bec5322ef7a03e68d3bf1571df5d7d40a5f37718049a68f75c76a1aea538c766\n" +
                "0xdeb08e2b96f0b600ff6fb039d91b1f69b067e85f");

        return wallet;

        /**
        // Şifre belirle (keystore dosyasını koruyacak)
        String password = "ErtugrulStrongPassword";

        // Keystore dosyasını kaydedeceğin klasör
        String walletDirectory = "wallets"; // örn: ./wallets

        // Klasör oluştur
        new File(walletDirectory).mkdirs();

        SecureRandom random = SecureRandom.getInstance("NativePRNGNonBlocking");
        // Yeni key pair oluştur
        ECKeyPair keyPair = Keys.createEcKeyPair(random);

        // Şifrelenmiş cüzdan dosyasını oluştur
        String walletFileName = WalletUtils.generateWalletFile(password, keyPair, new File(walletDirectory), true);

        // Cüzdan adresini al
        Credentials credentials = WalletUtils.loadCredentials(password, walletDirectory + "/" + walletFileName);

        System.out.println("✅ Wallet oluşturuldu:");
        System.out.println("Wallet File: " + walletFileName);
        System.out.println("Address: " + credentials.getAddress());
        System.out.println("Private Key: " + keyPair.getPrivateKey().toString(16));
        System.out.println("Public Key: " + keyPair.getPublicKey().toString(16));

        wallet.setAddress(credentials.getAddress());
        wallet.setPrivateKey(keyPair.getPrivateKey().toString(16));
        wallet.setPublicKey(keyPair.getPublicKey().toString(16));

        return wallet;

         */
    }

    public static void main(String[] args) throws Exception {
        Wallet wallet = WalletGenerator.createWallet();
        System.out.println(wallet.getAddress());
    }
}
