import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../Home";
import { MemoryRouter } from "react-router-dom";
//import '@testing-library/jest-dom/extend-expect';

//Mock useNavigate
const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedUsedNavigate,
}));

//Mock other components so we focus on the Home.
jest.mock("../MakeChatroom", () => () => <div data-testid="make-chatroom" />);
jest.mock("../ChatroomList", () => () => <div data-testid="chatroom-list" />);

describe("Home Component", () => {
    beforeEach(() => {
        localStorage.clear();
        mockedUsedNavigate.mockReset();

        localStorage.setItem("username", "testuser");
        localStorage.setItem("first_name", "Test");
        localStorage.setItem("last_name", "User");
        localStorage.setItem("avatarColor", "#123456");
    });

    test("renders the Home with the header", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        expect(screen.getByText("Welcome to the Home Page!")).toBeInTheDocument();
    });

    test("renders MakeChatroom and ChatroomList components", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        expect(screen.getByTestId("make-chatroom")).toBeInTheDocument();
        expect(screen.getByTestId("chatroom-list")).toBeInTheDocument();
    });

    test("navigates to /Name when Profile button is clicked", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        const profileButton = screen.getByText("Profile");
        fireEvent.click(profileButton);

        expect(mockedUsedNavigate).toHaveBeenCalledWith("/Name");
    });

    test("clears local storage and navigates to /login on Sign Out", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        const signOutButton = screen.getByText("Sign Out");
        fireEvent.click(signOutButton);

        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("first_name")).toBeNull();
        expect(localStorage.getItem("last_name")).toBeNull();
        expect(localStorage.getItem("avatarColor")).toBeNull();
        expect(localStorage.getItem("username")).toBeNull();

        expect(mockedUsedNavigate).toHaveBeenCalledWith("/login");
    });

    test("renders wtih fallback values if user has no first_name, last_name, or avatarColor", () => {
        localStorage.clear();

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        expect(screen.getByText("Welcome to the Home Page!")).toBeInTheDocument();

        expect(screen.getByText("Profile")).toBeInTheDocument();
        expect(screen.getByText("Sign Out")).toBeInTheDocument();
    });
});