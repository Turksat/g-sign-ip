package com.turksat.EU_Patent_Registration_Project.webAPI.controllers;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.UserService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.*;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.UserRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.UserResponseDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService _userService) {
        this.userService = _userService;
    }

    @GetMapping("/getall")
    public ResponseEntity<DataResult<List<UserResponseDTO>>> getAllUsers() {
        DataResult<List<UserResponseDTO>> result = userService.getAllUsers();
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<DataResult<UserResponseDTO>> getUserById(@PathVariable int id) {
        DataResult<UserResponseDTO> result = userService.getUserById(id);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PostMapping("/create")
    public ResponseEntity<Result> createsUser(@RequestBody UserRequestDTO userRequestDTO) {
        Result result = userService.createUser(userRequestDTO);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Result> updateUser(@PathVariable int id, @RequestBody UserRequestDTO userRequestDTO) {
        Result result = userService.updateUser(id, userRequestDTO);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Result> deleteUser(@PathVariable int id) {
        Result result = userService.deleteUser(id);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }
}
