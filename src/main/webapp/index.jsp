<%@ page import="ru.web.model.HitList" %>
<%@ page import="ru.web.dto.ResponseDTO" %>
<%@ page import="java.util.List" %>
<%@ page import="java.time.format.DateTimeFormatter" %>
<%@ page import="java.time.LocalDateTime" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Web lab 2</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="main-container">
    <div class="header">
        Вавилина Екатерина Андреевна<br>
        Группа P3230, Вариант 973474
    </div>
    <div class="form-graph-container">
        <div class="form-cell">
            <form id="pointForm">
                <div class="form-block">
                    <label for="x">X:</label><br>
                    <input type="text" id="x" name="x" placeholder="Введите X (-3...5)"><br>
                </div>
                <div class="form-block">
                    <label>Y:</label><br>
                    <div class="button-group" id="yButtons">
                        <% for(int y = -4; y <= 4; y++) { %>
                            <button type="button" class="y-button" data-value="<%= y %>"><%= y %></button>
                        <% } %>
                    </div>
                    <input type="hidden" id="y" name="y" value="">
                </div>
                <div class="form-block">
                    <label for="r">R:</label><br>
                    <select id="r" name="r">
                        <option value="" selected>Выберите R</option>
                        <% for (double r = 1; r <= 3; r += 0.5) { %>
                            <option value="<%= r %>"><%= r %></option>
                        <% } %>
                    </select>
                </div>
                <div class="form-block">
                    <button type="button" onclick="handleSubmit('getFormData')">Отправить</button>
                    <div class="error-message">Недопустимые данные для ввода</div>
                </div>
            </form>
        </div>
        <div class="graph-cell">
            <canvas id="graphCanvas" width="500" height="500" onclick="handleSubmit('getCanvasData', event)"></canvas>
            <div class="method-switcher">
                <input type="radio" id="method_post" name="method" value="POST" checked><label for="method_post">POST</label>
                <input type="radio" id="method_get" name="method" value="GET"><label for="method_get">GET</label>
                <div class="slider"></div>
            </div>
        </div>
    </div>
    <div class="results-container">
        <button type="button" class="clear-button" onclick="clearHistory()">Очистить историю</button>
        <table id="resultsTable">
            <thead>
            <tr>
                <th>X</th>
                <th>Y</th>
                <th>R</th>
                <th>Попадание</th>
                <th>Время запроса</th>
                <th>Время выполнения</th>
            </tr>
            </thead>
            <tbody>
            <%
                HitList hitList = HitList.getInstance(request.getSession());
                List<ResponseDTO> allResponses = hitList.getAll();

                DateTimeFormatter inputFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
                DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("dd.MM.yy HH:mm:ss");

                java.text.DecimalFormat df = new java.text.DecimalFormat("#.####");
                df.setRoundingMode(java.math.RoundingMode.HALF_UP);

                if (allResponses != null && !allResponses.isEmpty()) {
                    java.util.Collections.reverse(allResponses);
                    for (ResponseDTO r : allResponses) {
                        LocalDateTime dateTime = LocalDateTime.parse(r.currentTime(), inputFormatter);
                        String formattedTime = dateTime.format(outputFormatter);

            %>
            <tr>
                <td><%= df.format(r.x()) %></td>
                <td><%= df.format(r.y()) %></td>
                <td><%= df.format(r.r()) %></td>
                <td data-result="<%= r.hit() %>"><%= r.hit() ? "Попадание" : "Промах" %></td>
                <td><%= formattedTime %></td>
                <td><%= r.executionTime() %> ns</td>
            </tr>
            <%
                    }
                }
            %>
            </tbody>
        </table>
    </div>
</div>
<script src="${pageContext.request.contextPath}/scripts/buttonSelector.js"></script>
<script src="${pageContext.request.contextPath}/scripts/states.js"></script>
<script src="${pageContext.request.contextPath}/scripts/validator.js"></script>
<script src="${pageContext.request.contextPath}/scripts/graph.js"></script>
<script src="${pageContext.request.contextPath}/scripts/script.js"></script>
<script>
    window.ALL_POINTS_FROM_SESSION = [
        <%
            List<ResponseDTO> points = hitList.getAll();
            for (int i = 0; i < points.size(); i++) {
                ResponseDTO p = points.get(i);
        %>
        {
            x: <%= p.x() %>,
            y: <%= p.y() %>,
            r: <%= p.r() %>,
            hit: <%= p.hit() %>
        }<%= i < points.size() - 1 ? "," : "" %>
        <%
            }
        %>
    ];

    document.addEventListener('DOMContentLoaded', () => {
        loadFormState();
        drawGraph(currentR);
    });
</script>
</body>
</html>