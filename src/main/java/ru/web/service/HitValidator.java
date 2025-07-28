package ru.web.service;

public class HitValidator {
    public static boolean validateHit(double x, double y, double r) {
        return validateTriangle(x, y, r) || validateCircle(x, y, r) || validateSquare(x, y, r);
    }

    private static boolean validateSquare(double x, double y, double r) {
        return x >= 0 && y >= 0 && x <= r && y <= r;
    }

    private static boolean validateCircle(double x, double y, double r) {
        return x <= 0 && y >= 0 && x >= -r && y <= r  && x * x + y * y <= r * r;
    }

    private static boolean validateTriangle(double x, double y, double r) {
        return x <= 0 && y <= 0 && x >= -r && y >= -r && -x - r <= y;
    }
}