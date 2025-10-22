package com.turksat.EU_Patent_Registration_Project.blockchain.repository;

import com.turksat.EU_Patent_Registration_Project.blockchain.model.Wallet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.Optional;

@Repository
public class PatentRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void save(String email, String walletAddress,String privateKey,String publicKey) {
        String sql = "INSERT INTO gsignip.bc_patent_wallets (email, address,private_key,public_key) VALUES (?, ?,?,?)";
        jdbcTemplate.update(sql, email, walletAddress,privateKey,publicKey);
    }


    public Optional<Wallet> findByEmail(String email) {
        String sql = "SELECT email, address, private_key, public_key FROM gsignip.bc_patent_wallets WHERE email = ?";
        try {
            Wallet wallet = jdbcTemplate.queryForObject(sql, (rs, rowNum) -> new Wallet(
                    rs.getString("email"),
                    rs.getString("address"),
                    rs.getString("private_key"),
                    rs.getString("public_key")
            ), email);
            return Optional.ofNullable(wallet);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }


    public int insertPatent(
            String transactionHash,
            String email,
            String walletAddress,
            String contractAddress,
            String ipfsHash,
            String applicationId,
            String status
    ) {
        String sql = """
                INSERT INTO gsignip.bc_patent_registry (
                    transaction_hash,
                    email,
                    wallet_address,
                    contract_address,
                    ipfs_hash,
                    application_id,
                    status,
                    create_time
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        return jdbcTemplate.update(sql,
                transactionHash,
                email,
                walletAddress,
                contractAddress,
                ipfsHash,
                applicationId,
                status,
                new Timestamp(System.currentTimeMillis()) // create_time
        );
    }




}