import React from "react";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../ProtectedRoute";
import { MemoryRouter } from "react-router-dom";

jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return {
        ...actual,
        Outlet: () => <div data-testid="protected-outlet" />, //mock outlet content
        Navigate: ({ to }) => <div data-testid="redirect" data-to={to} /> //Mock  navigate
    };
});

describe("ProtectedRoute", () => {

    beforeEach(() => {
        localStorage.clear();
    });

    test("renders Outlet when token exists", () => {
        localStorage.setItem("token", "valid-token");

        render(
            <MemoryRouter>
                <ProtectedRoute />
            </MemoryRouter>
        );

        expect(screen.getByTestId("protected-outlet")).toBeInTheDocument();
    });

    test("redirects to /login when token does not exist", () => {
        render(
            <MemoryRouter>
                <ProtectedRoute />
            </MemoryRouter>
        );

        const redirect = screen.getByTestId("redirect");
        expect(redirect).toBeInTheDocument();
        expect(redirect.getAttribute("data-to")).toBe("/login");
    });
});