package com.turksat.EU_Patent_Registration_Project.blockchain.model;

public class Wallet {

    private Long id;
    private String email;
    private String address;
    private String privateKey;
    private String publicKey;

    public Wallet(){}
    // Constructor
    public Wallet(String email, String address, String privateKey, String publicKey) {
        this.email = email;
        this.address = address;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }


    // Getters & Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public String getAddress() {
        return address;
    }

    public String getPrivateKey() {
        return privateKey;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setPrivateKey(String privateKey) {
        this.privateKey = privateKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }
}
