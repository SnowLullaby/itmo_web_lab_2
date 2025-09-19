package ru.web.model;

import ru.web.dto.ResponseDTO;
import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Named;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Named("hitList")
@SessionScoped
public class HitList implements Serializable {
    private final List<ResponseDTO> responses;

    public HitList() {
        this.responses = new ArrayList<>();
    }

    public void addAll(List<ResponseDTO> newResponses) {
        this.responses.addAll(newResponses);
    }

    public List<ResponseDTO> getAll() {
        return new ArrayList<>(responses);
    }

    public int size() {
        return responses.size();
    }

    public void clear() {
        responses.clear();
    }
}