package com.turksat.EU_Patent_Registration_Project.business.adapters;

import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.UserRepository;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository    ;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user;
        try {
            user = userRepository.getUserByEmail(username);
        }
        catch (Exception e) {
            throw new UsernameNotFoundException(e.getMessage());
        }
        return user;
    }
}
