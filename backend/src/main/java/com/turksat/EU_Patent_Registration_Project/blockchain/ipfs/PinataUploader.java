package com.turksat.EU_Patent_Registration_Project.blockchain.ipfs;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.PrintWriter;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.util.UUID;

public class PinataUploader {

    private static final String PINATA_API_KEY = "XXX";
    private static final String PINATA_API_SECRET = "XXXX";
    private static final String PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    public static void main(String[] args) throws Exception {
        File file = new File("/Users/esaruhan/Downloads/edk-yeni-hizmet2.html"); // Aynı klasördeki dosya
        if (!file.exists()) {
            System.err.println("❌ Dosya bulunamadı: " + file.getAbsolutePath());
            return;
        }

        String cid = uploadFileToPinata(file);
        System.out.println("✅ IPFS CID: " + cid);
        System.out.println("🔗 Link: https://gateway.pinata.cloud/ipfs/" + cid);
    }

    public static String uploadFileToPinata(File file) throws Exception {
        String boundary = UUID.randomUUID().toString();
        HttpClient client = HttpClient.newHttpClient();

        // Dosya içeriğini multipart/form-data ile oluştur
        byte[] fileBytes = Files.readAllBytes(file.toPath());

        String LINE = "\r\n";
        var byteStream = new ByteArrayOutputStream();
        var writer = new PrintWriter(byteStream);

        // Form başlangıcı
        writer.append("--").append(boundary).append(LINE);
        writer.append("Content-Disposition: form-data; name=\"file\"; filename=\"" + file.getName() + "\"").append(LINE);
        writer.append("Content-Type: application/octet-stream").append(LINE).append(LINE);
        writer.flush();
        byteStream.write(fileBytes);
        writer.append(LINE).flush();
        writer.append("--").append(boundary).append("--").append(LINE);
        writer.close();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(PINATA_URL))
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .header("pinata_api_key", PINATA_API_KEY)
                .header("pinata_secret_api_key", PINATA_API_SECRET)
                .POST(HttpRequest.BodyPublishers.ofByteArray(byteStream.toByteArray()))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("❌ Pinata yükleme hatası: " + response.body());
        }

        String body = response.body();
        String cid = body.split("\"IpfsHash\":\"")[1].split("\"")[0]; // basit JSON ayıklama
        return cid;
    }
}
