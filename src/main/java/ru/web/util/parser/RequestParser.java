package ru.web.util.parser;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import ru.web.dto.RequestDTO;

import jakarta.servlet.http.HttpServletRequest;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.Arrays;

public class RequestParser {

    private static final Gson GSON = new Gson();

    public static RequestDTO parse(HttpServletRequest request) throws IllegalArgumentException {
        String method = request.getMethod();

        if ("POST".equalsIgnoreCase(method) && isJsonRequest(request)) {
            try (BufferedReader reader = request.getReader()) {
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
                if (sb.isEmpty()) {
                    throw new IllegalArgumentException("Пустое тело JSON");
                }
                return GSON.fromJson(sb.toString(), RequestDTO.class);
            } catch (JsonSyntaxException e) {
                throw new IllegalArgumentException("Некорректный JSON: " + e.getMessage());
            } catch (IOException e) {
                throw new IllegalArgumentException("Ошибка чтения тела запроса");
            }
        }

        String xParam = request.getParameter("x");
        String yParam = request.getParameter("y");
        String rParam = request.getParameter("r");

        Double x = parseDouble(xParam, "x");
        Double r = parseDouble(rParam, "r");

        Double[] y = null;
        if (yParam != null) {
            try {
                y = Arrays.stream(yParam.split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .map(Double::parseDouble)
                        .toArray(Double[]::new);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Параметр y содержит некорректные числа");
            }
        }

        return new RequestDTO(x, y, r);
    }

    private static Double parseDouble(String param, String name) {
        if (param == null || param.trim().isEmpty()) return null;
        try {
            return Double.parseDouble(param.trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Параметр '" + name + "' не является числом");
        }
    }

    private static boolean isJsonRequest(HttpServletRequest request) {
        String contentType = request.getContentType();
        return contentType != null && contentType.contains("application/json");
    }
}