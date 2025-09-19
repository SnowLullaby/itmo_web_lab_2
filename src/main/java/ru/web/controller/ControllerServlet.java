package ru.web.controller;

import ru.web.dto.RequestDTO;
import ru.web.model.HitList;
import ru.web.util.parser.RequestParser;
import ru.web.util.validator.DTOValidator;
import ru.web.util.builder.ResponseBuilder;

import jakarta.inject.Inject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/controller/*")
public class ControllerServlet extends HttpServlet {
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
        String pathInfo = request.getPathInfo();

        if ("/clear".equals(pathInfo)) {
            handleClear(response);
            return;
        }

        if ("/results".equals(pathInfo)) {
            handleResults(response);
            return;
        }

        handleAreaCheck(request, response);
    }

    private void handleClear(HttpServletResponse response) throws IOException {
        hitList.clear();
        ResponseBuilder.sendOk(response, "Очищено");
    }

    private void handleResults(HttpServletResponse response) throws IOException {
        ResponseBuilder.sendResultsAsJson(response, hitList.getAll());
    }

    private void handleAreaCheck(HttpServletRequest request, HttpServletResponse response) throws IOException {
        RequestDTO dto;

        try {
            dto = RequestParser.parse(request);
        } catch (IllegalArgumentException e) {
            ResponseBuilder.sendError(response, 400, e.getMessage());
            return;
        }

        var validationResult = DTOValidator.validate(dto);
        if (!validationResult.isValid()) {
            ResponseBuilder.sendError(response, 400, validationResult.errorMessage());
            return;
        }

        request.getSession().setAttribute("dto", dto);

        try {
            request.getRequestDispatcher("/area-check").forward(request, response);
        } catch (Exception e) {
            ResponseBuilder.sendError(response, 500, "Ошибка при обработке");
        }
    }
}