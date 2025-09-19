package ru.web.controller;

import jakarta.inject.Inject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import ru.web.dto.*;
import ru.web.model.HitList;
import ru.web.service.HitValidator;
import ru.web.util.builder.ResponseBuilder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/area-check")
public class AreaCheckServlet extends HttpServlet {
    @Inject
    private HitList hitList;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        processRequest(request, response);
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        RequestDTO dto = (RequestDTO) request.getSession().getAttribute("dto");
        if (dto == null) {
            ResponseBuilder.sendError(response, 400, "Нет данных для проверки");
            return;
        }

        List<ResponseDTO> currentResponses = new ArrayList<>();
        long startTime = System.nanoTime();

        for (double y : dto.y()) {
            String currentTime = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            boolean hit = HitValidator.validateHit(dto.x(), y, dto.r());
            long executionTime = System.nanoTime() - startTime;
            currentResponses.add(new ResponseDTO(dto.x(), y, dto.r(), hit, currentTime, executionTime));
        }

        hitList.addAll(currentResponses);

        request.getSession().setAttribute("currentResponses", currentResponses);

        try {
            response.sendRedirect(request.getContextPath() + "/result.jsp");
        } catch (Exception e) {
            ResponseBuilder.sendError(response, 500, "Ошибка отображения результата");
        }
    }
}