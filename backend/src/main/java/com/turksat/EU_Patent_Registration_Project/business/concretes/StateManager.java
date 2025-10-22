package com.turksat.EU_Patent_Registration_Project.business.concretes;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.StateService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ResultStatus;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.SuccessDataResult;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.StateRepository;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.StateResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.State;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StateManager implements StateService {
    private final StateRepository stateRepository;

    public StateManager(StateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }

    @Override
    public DataResult<List<StateResponseDTO>> getAllStates() {
        List<State> states = stateRepository.getAllStates();
        List<StateResponseDTO> stateDTOs = states.stream()
                .map(state -> new StateResponseDTO(
                        state.getStateId(),
                        state.getStateName(),
                        state.getCountryId()))
                .collect(Collectors.toList());

        return new SuccessDataResult<>(
                stateDTOs,
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    @Override
    public DataResult<List<StateResponseDTO>> getStatesByCountryId(int countryId) {
        List<State> states = stateRepository.getStatesByCountryId(countryId);
        List<StateResponseDTO> stateDTOs = states.stream()
                .map(state -> new StateResponseDTO(
                        state.getStateId(),
                        state.getStateName(),
                        state.getCountryId()))
                .collect(Collectors.toList());

        return new SuccessDataResult<>(
                stateDTOs,
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    @Override
    public DataResult<StateResponseDTO> getStateById(int id) {
        State state = stateRepository.getStateById(id);
        StateResponseDTO stateDTO = new StateResponseDTO(
                state.getStateId(),
                state.getStateName(),
                state.getCountryId());

        return new SuccessDataResult<>(
                stateDTO,
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }
}
