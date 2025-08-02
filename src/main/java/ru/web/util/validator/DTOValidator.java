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

        if (parsed.x() < -3 || parsed.x() > 5) {
            return new ValidationResult(false, "X должен быть числом от -3 до 5");
        }

        if (parsed.y() == null || parsed.y().length == 0) {
            return new ValidationResult(false, "Y не задан");
        }

        for (Double y : parsed.y()) {
            if (y == null) {
                return new ValidationResult(false, "Значение Y не может быть null");
            }
            if (y < -4 || y > 4) {
                return new ValidationResult(false, "Y должен быть числом от -4 до 4");
            }
        }

        if (parsed.r() == null) {
            return new ValidationResult(false, "R не задан");
        }

        if (parsed.r() < 1 || parsed.r() > 3) {
            return new ValidationResult(false, "R должен быть числом от 1 до 3");
        }

        return new ValidationResult(true, null);
    }

    private DTOValidator(){}
}