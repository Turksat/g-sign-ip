package com.turksat.EU_Patent_Registration_Project.blockchain.component;

import com.turksat.EU_Patent_Registration_Project.blockchain.repository.PatentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


@Component
public class DbTestRunner implements CommandLineRunner {

    private final PatentRepository repository;

    public DbTestRunner(PatentRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
       // repository.save("example@email.com", "0x123...","hgfgfj","jbjkbjh");
    }
}