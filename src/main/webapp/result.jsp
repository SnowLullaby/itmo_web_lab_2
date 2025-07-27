<%@ page import="java.util.List, ru.web.dto.ResponseDTO" %>
<%@ page import="java.time.format.DateTimeFormatter" %>
<%@ page import="java.time.LocalDateTime" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Results</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/style.css">
</head>
<body>
<div class="main-container">
    <div class="header">
        Вавилина Екатерина Андреевна<br>
        Группа P3230, Вариант 973474
    </div>
    <div class="results-container">
        <table id="resultsTable">
            <thead>
            <tr>
                <th>X</th>
                <th>Y</th>
                <th>R</th>
                <th>Попадание</th>
                <th>Время запроса</th>
                <th>Время выполнения (нс)</th>
            </tr>
            </thead>
            <tbody>
            <%
                @SuppressWarnings("unchecked")
                List<ResponseDTO> currentResponses = (List<ResponseDTO>) request.getAttribute("currentResponses");

                DateTimeFormatter inputFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
                DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("dd.MM.yy HH:mm:ss");

                if (currentResponses != null && !currentResponses.isEmpty()) {
                    for (ResponseDTO r : currentResponses) {
                        LocalDateTime dateTime = LocalDateTime.parse(r.currentTime(), inputFormatter);
                        String formattedTime = dateTime.format(outputFormatter);
            %>
            <tr>
                <td><%= r.x() %></td>
                <td><%= r.y() %></td>
                <td><%= r.r() %></td>
                <td data-result="<%= r.hit() %>"><%= r.hit() ? "Да" : "Нет" %></td>
                <td><%= formattedTime %></td>
                <td><%= r.executionTime() %></td>
            </tr>
            <%
                }
            } else {
            %>
            <tr>
                <td colspan="6">Нет данных для отображения</td>
            </tr>
            <%
                }
            %>
            </tbody>
        </table>
        <div style="text-align: center; margin-top: 20px;">
            <a href="${pageContext.request.contextPath}/" class="back-link">
                <button type="button" style="padding: 10px 20px; background-color: #a341a1; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Назад
                </button>
            </a>
        </div>
    </div>
</div>
</body>
</html>