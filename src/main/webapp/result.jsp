<%@ page import="ru.web.dto.RequestDTO" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html>
<head><title>Результат</title></head>
<body>
<h1>Запрос обработан!</h1>
<%
    RequestDTO dto = (RequestDTO) session.getAttribute("dto");
    if (dto != null) {
%>
<p>X: <%= dto.x() %></p>
<p>Y: <%= java.util.Arrays.toString(dto.y()) %></p>
<p>R: <%= dto.r() %></p>
<%
    }
%>
<a href="${pageContext.request.contextPath}/">Назад</a>
</body>
</html>