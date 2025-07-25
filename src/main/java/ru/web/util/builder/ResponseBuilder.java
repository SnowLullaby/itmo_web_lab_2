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

        String json = String.format("{\"error\": \"%s\"}", message);
        response.getWriter().write(json);
        response.getWriter().flush();
    }

    public static void sendJson(HttpServletResponse response, Object data) throws IOException {
        response.setStatus(200);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(GSON.toJson(data));
        response.getWriter().flush();
    }

    public static void sendWithRedirect(HttpServletResponse response, String redirectUrl) throws IOException {
        response.setStatus(200);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String json = GSON.toJson(Map.of(
                "status", "success",
                "redirect", redirectUrl
        ));

        response.getWriter().write(json);
        response.getWriter().flush();
    }
}