package com.turksat.EU_Patent_Registration_Project.business.concretes;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.GenderService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ResultStatus;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.SuccessDataResult;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.GenderRepository;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.GenderResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.Gender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GenderManager implements GenderService {
    private final GenderRepository genderRepository;

    public GenderManager(GenderRepository genderRepository) {
        this.genderRepository = genderRepository;
    }

    @Override
    public DataResult<List<GenderResponseDTO>> getAllGenders() {
        List<Gender> genders = genderRepository.getAllGenders();
        List<GenderResponseDTO> genderDTOs = genders.stream()
                .map(gender -> new GenderResponseDTO(
                        gender.getGenderId(),
                        gender.getGenderName()))
                .collect(Collectors.toList());

        return new SuccessDataResult<>(
                genderDTOs,
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    @Override
    public DataResult<GenderResponseDTO> getGenderById(int id) {
        Gender gender = genderRepository.getGenderById(id);
        GenderResponseDTO genderDTO = new GenderResponseDTO(
                gender.getGenderId(),
                gender.getGenderName());

        return new SuccessDataResult<>(
                genderDTO,
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }
}
