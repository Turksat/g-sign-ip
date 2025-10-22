package com.turksat.EU_Patent_Registration_Project.blockchain.service;

import com.turksat.EU_Patent_Registration_Project.blockchain.contracts.PatentRegistry;
import com.turksat.EU_Patent_Registration_Project.blockchain.ipfs.PinataUploader;
import com.turksat.EU_Patent_Registration_Project.blockchain.model.Wallet;
import com.turksat.EU_Patent_Registration_Project.blockchain.repository.PatentRepository;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.UserRepository;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.Application;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.ApplicationDocument;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

import org.web3j.tx.gas.StaticGasProvider;
import org.web3j.utils.Convert;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.file.Files;
import java.util.List;
import java.util.Objects;
import java.util.Optional;


@Service
public class PatentService {

    @Autowired
    private PatentRepository patentRepository;
    @Autowired
    private  UserRepository userRepository;

    private final String systemWalletPrivateKey = "XXXX";
    private final String providerUrl = "https://eth-sepolia.g.alchemy.com/v2/UELs3LGk5w8BmGo3jrzCy";
    private final String contractAddress = "XXXX";

    private final Integer DOCUMENT_TYPE_ID = 2;
    private final BigInteger FIRST_APPLY_STATUS = new BigInteger("0");

    public String registerPatent(String applicationNumber, String email, String title, String description, File file, BigInteger status) {
        try {
            String walletAddress = getOrCreateWalletAddress(email);
            if (walletAddress == null) {
                throw new IllegalStateException("Wallet oluşturulamadı.");
            }

            String ipfsHash = PinataUploader.uploadFileToPinata(file);

            String transactionHash = sendPatentToBlockchain(applicationNumber, walletAddress, title, description, ipfsHash,status);
            if (transactionHash != null) {

                String statusDescription =  status.intValue() == 0 ? "Registered" : status.intValue() == 1 ? "Granted" : "NotGranted";

                int registered = patentRepository.insertPatent(
                        transactionHash, email, walletAddress, contractAddress, ipfsHash, applicationNumber,statusDescription
                );
                System.out.println("Patent veritabanına kaydedildi. Status: Registered" );
                return "successful";
            }

        } catch (Exception e) {
            System.err.println("Patent kaydı başarısız: " + e.getMessage());
            e.printStackTrace();
        }

        return "failed";
    }

    public String registerPatent(Application patentApplication, List<ApplicationDocument> applicationDocuments) {

        File    tempFile = null;
        String  applicationNo = patentApplication.getApplicationNo();
        String  titleOfInvention = patentApplication.getTitleOfInvention();
        String  titleOfSummary = patentApplication.getInventionSummary();

        User    user = userRepository.getUserByApplicationNo(applicationNo);
        String email = user.getEmail();

        List<ApplicationDocument> list = applicationDocuments.stream().filter(e -> e.getApplicationDocumentTypeId() == DOCUMENT_TYPE_ID).toList();

        if(Objects.nonNull(list)){
            ApplicationDocument applicationDocument = list.get(0);
            byte[] fileContent = applicationDocument.getFile();
            String fileName = applicationDocument.getFileName();
            String fileExtension = applicationDocument.getFileExtension();

            try {
                tempFile = Files.createTempFile(fileName,fileExtension).toFile();
                try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                    fos.write(fileContent);
                }

            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        String result = registerPatent(applicationNo,email,titleOfInvention,titleOfSummary,tempFile,FIRST_APPLY_STATUS);


        return result;
    }

    private String getOrCreateWalletAddress(String email) {
        Optional<Wallet> walletOpt = patentRepository.findByEmail(email);

        if (walletOpt.isPresent()) {
            System.out.println("Cüzdan bulundu: " + walletOpt.get().getAddress());
            return walletOpt.get().getAddress();
        }

        try {
            Wallet wallet = WalletGenerator.createWallet();
            patentRepository.save(email, wallet.getAddress(), wallet.getPrivateKey(), wallet.getPublicKey());
            System.out.println("Yeni cüzdan oluşturuldu: " + wallet.getAddress());
            return wallet.getAddress();
        } catch (Exception e) {
            System.err.println("Yeni cüzdan oluşturulurken hata oluştu: " + e.getMessage());
            return null;
        }
    }

    private String sendPatentToBlockchain(String applicationNumber, String createdBy, String title, String description, String ipfsHash,BigInteger status) {
        try {


            Web3j web3 = Web3j.build(new HttpService(providerUrl));
            Credentials credentials = Credentials.create(systemWalletPrivateKey);
            TransactionManager txManager = new RawTransactionManager(web3, credentials);

            // 2. Gas ayarları
            BigInteger gasPrice = Convert.toWei("15", Convert.Unit.GWEI).toBigInteger();
            BigInteger gasLimit = BigInteger.valueOf(6_000_000L);
            ContractGasProvider gasProvider = new StaticGasProvider(gasPrice, gasLimit);

            // 3. Sözleşme nesnesi
            PatentRegistry patentRegistry = PatentRegistry.load(contractAddress, web3, txManager, gasProvider);


            TransactionReceipt receipt = patentRegistry
                    .registerPatent(createdBy, applicationNumber, title, description, ipfsHash,status)
                    .send();
            System.out.println("Patent kaydı gönderiliyor blockchain'e...");
            // ✅ 4. Transaction hash
            System.out.println("✅ Transaction hash: " + receipt.getTransactionHash());

            return receipt.getTransactionHash();
        } catch (Exception e) {
            System.err.println("Blockchain kaydı başarısız: " + e.getMessage());
            return null;
        }
    }
}
