package ru.web.util.builder;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

public class ResponseBuilder {
    private static final Gson GSON = new Gson();

    public static void sendError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (var writer = response.getWriter()) {
            String json = GSON.toJson(Map.of("error", message));
            writer.write(json);
            writer.flush();
        }
    }

    public static void sendResultsAsJson(HttpServletResponse response, Object data) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(200);

        try (var writer = response.getWriter()) {
            writer.write(GSON.toJson(data));
            writer.flush();
        }
    }

    public static void sendOk(HttpServletResponse response, Object data) throws IOException {
        response.setStatus(200);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (var writer = response.getWriter()) {
            writer.write(GSON.toJson(data));
            writer.flush();
        }
    }
}