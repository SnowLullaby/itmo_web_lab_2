package ru.web.model;

import ru.web.dto.ResponseDTO;
import jakarta.servlet.ServletContext;
import java.util.ArrayList;
import java.util.List;

public class HitList {
    private static final String CONTEXT_ATTR = "allResponses";
    private final List<ResponseDTO> responses;

    private HitList() {
        this.responses = new ArrayList<>();
    }

    public static HitList getInstance(ServletContext context) {
        synchronized (context) {
            HitList hitList = (HitList) context.getAttribute(CONTEXT_ATTR);
            if (hitList == null) {
                hitList = new HitList();
                context.setAttribute(CONTEXT_ATTR, hitList);
            }
            return hitList;
        }
    }

    public void addAll(List<ResponseDTO> newResponses) {
        synchronized (this) {
            this.responses.addAll(newResponses);
        }
    }

    public List<ResponseDTO> getAll() {
        synchronized (this) {
            return new ArrayList<>(responses);
        }
    }

    public int size() {
        synchronized (this) {
            return responses.size();
        }
    }

    public void clear(ServletContext context) {
        synchronized (this) {
            responses.clear();
        }
        synchronized (context) {
            context.removeAttribute(CONTEXT_ATTR);
        }
    }
}