package ru.web.model;

import ru.web.dto.ResponseDTO;

import jakarta.servlet.http.HttpSession;

import java.util.*;

public class HitList {
    private static final String SESSION_ATTR = "allResponses";
    private final List<ResponseDTO> responses;

    private HitList() {
        this.responses = new ArrayList<>();
    }

    public static HitList getInstance(HttpSession session) {
        HitList hitList = (HitList) session.getAttribute(SESSION_ATTR);
        if (hitList == null) {
            hitList = new HitList();
            session.setAttribute(SESSION_ATTR, hitList);
        }
        return hitList;
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

    public void clear(HttpSession session) {
        responses.clear();
        session.removeAttribute(SESSION_ATTR);
    }
}