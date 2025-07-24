package ru.web.util.validator;

import ru.web.dto.RequestDTO;

public class DTOValidator {
    public static ValidationResult validate(RequestDTO parsed) {
        if (parsed == null) {
            return new ValidationResult(false, "JSON не может быть пустым");
        }

        if (parsed.x() == null) {
            return new ValidationResult(false, "X не задан");
        }

        if (parsed.x() < -2 || parsed.x() > 2) {
            return new ValidationResult(false, "X должен быть числом от -2 до 2");
        }

        if (parsed.r() == null) {
            return new ValidationResult(false, "R не задан");
        }

        if (parsed.r() < -5 || parsed.r() > 5) {
            return new ValidationResult(false, "R должен быть числом от -5 до 5");
        }

        if (parsed.y() == null || parsed.y().length == 0) {
            return new ValidationResult(false, "R не задан");
        }

        for (Double y : parsed.y()) {
            if (y == null) {
                return new ValidationResult(false, "Значение Y не может быть null");
            }
            if (y < 1 || y > 3) {
                return new ValidationResult(false, "Y должен быть числом от 1 до 3");
            }
        }

        return new ValidationResult(true, null);
    }
}