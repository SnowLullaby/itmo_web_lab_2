package ru.web.filter;

import ru.web.util.builder.ResponseBuilder;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebFilter("/*")
public class RequestValidationFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        String method = req.getMethod();
        String path = req.getServletPath();

        if (!"GET".equalsIgnoreCase(method) && !"POST".equalsIgnoreCase(method)) {
            ResponseBuilder.sendError(resp, 405, "Метод не поддерживается");
            return;
        }

        if (isValidPath(path)) {
            chain.doFilter(request, response);
        } else {
            ResponseBuilder.sendError(resp, 404, "Запрос к несуществующему ресурсу");
        }
    }

    private boolean isValidPath(String path) {
        if (path == null) return false;

        return "/controller".equals(path) ||
                path.isEmpty() ||
                "/index.jsp".equals(path) ||
                "/result.jsp".equals(path) ||
                path.startsWith("/scripts/") ||
                path.startsWith("/images/") ||
                path.endsWith(".css") ||
                path.endsWith(".js") ||
                path.endsWith(".jpg");
    }
}