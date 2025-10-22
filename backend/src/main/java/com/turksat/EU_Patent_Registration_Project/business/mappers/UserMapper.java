package com.turksat.EU_Patent_Registration_Project.business.mappers;

import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.UserRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.UserResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDTO userToUserResponseDTO(User user);

    List<UserResponseDTO> usersToUserResponseDTOs(List<User> users);

    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "userRole", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    User userResponseDTOToUser(UserResponseDTO userResponseDTO);

    UserRequestDTO userToUserRequestDTO(User user);

    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "userRole", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    User userRequestDTOToUser(UserRequestDTO userRequestDTO);
}
