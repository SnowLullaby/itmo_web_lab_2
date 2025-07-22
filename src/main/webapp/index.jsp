<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Web lab 1</title>
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
                    <button type="button" onclick="handleSubmission('getFormData')">Отправить</button>
                    <div class="error-message">Недопустимые данные для ввода</div>
                </div>
            </form>
        </div>
        <div class="graph-cell">
            <canvas id="graphCanvas" width="500" height="500" onclick="handleSubmission('getCanvasData', event)"></canvas>
            <div class="method-switcher">
                <input type="radio" id="method_post" name="method" value="POST" checked><label for="method_post">POST</label>
                <input type="radio" id="method_get" name="method" value="GET"><label for="method_get">GET</label>
                <div class="slider"></div>
            </div>
        </div>
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
                <th>Время выполнения</th>
            </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>
<script src="scripts/buttonSelector.js"></script>
<script src="scripts/validator.js"></script>
<script src="scripts/graph.js"></script>
<script src="scripts/script.js"></script>
</body>
</html>