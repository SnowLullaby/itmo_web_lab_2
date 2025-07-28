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
        String servletPath = req.getServletPath();
        String pathInfo = req.getPathInfo();

        if (!"GET".equalsIgnoreCase(method) && !"POST".equalsIgnoreCase(method)) {
            ResponseBuilder.sendError(resp, 405, "Метод не поддерживается");
            return;
        }

        if (isValidPath(servletPath, pathInfo)) {
            chain.doFilter(request, response);
        } else {
            ResponseBuilder.sendError(resp, 404, "Запрос к несуществующему ресурсу");
        }
    }

    private boolean isValidPath(String servletPath, String pathInfo) {
        if (servletPath == null) return false;

        if ("/controller".equals(servletPath)) {
            return pathInfo == null || "/clear".equals(pathInfo);
        }

        return servletPath.isEmpty() ||
                "/index.jsp".equals(servletPath) ||
                "/result.jsp".equals(servletPath) ||
                servletPath.startsWith("/scripts/") ||
                servletPath.startsWith("/images/") ||
                servletPath.endsWith(".css") ||
                servletPath.endsWith(".js") ||
                servletPath.endsWith(".jpg");
    }
}