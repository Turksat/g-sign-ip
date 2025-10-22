package com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts;

import com.turksat.EU_Patent_Registration_Project.entities.concretes.User;

import java.util.List;

public interface UserRepository {
    List<User> getAllUsers();

    User getUserById(int id);

    User getUserByEmail(String email);

    User getUserByApplicationNo(String applicationNo);

    void createUser(User user);

    void updateUser(User user);

    void deleteUser(int id);

    boolean existsById(int id);

    boolean existsByEmail(String email);
}
