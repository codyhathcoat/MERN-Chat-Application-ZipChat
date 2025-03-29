import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MakeChatroom from "../MakeChatroom";
import { createChatroom } from "../CreateChatroom";

jest.mock("../CreateChatroom");

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("username", "currentUser"); //mock current user
});

test("renders inputs and create button", () => {
    render(<MakeChatroom />);

    expect(screen.getByPlaceholderText(/room name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/usernames/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
});

test("creates a chatroom successfully", async () => {
    createChatroom.mockResolvedValueOnce();
    
    render(<MakeChatroom />);

    fireEvent.change(screen.getByPlaceholderText(/room name/i), { target: { value: "Test Room" } });
    fireEvent.change(screen.getByPlaceholderText(/usernames/i), { target: { value: "user1, user2" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => expect(screen.getByText(/chatroom created successfully/i)).toBeInTheDocument());

    expect(createChatroom).toHaveBeenCalledWith("Test Room", ["user1", "user2", "currentUser"]);
});

test("displays error message when chatroom creation fails", async () => {
    createChatroom.mockRejectedValueOnce({ response: { data: { error: "Server error" } } });

    render(<MakeChatroom />);

    fireEvent.change(screen.getByPlaceholderText(/room name/i), { target: { value: "Test Room" } });
    fireEvent.change(screen.getByPlaceholderText(/usernames/i), { target: { value: "user1, user2" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => expect(screen.getByText(/server error/i)).toBeInTheDocument());
});

test("ensures current user is included in chatroom", async () => {
    createChatroom.mockResolvedValueOnce();

    render(<MakeChatroom />);

    fireEvent.change(screen.getByPlaceholderText(/room name/i), { target: { value: "New Chat" } });
    fireEvent.change(screen.getByPlaceholderText(/usernames/i), { target: { value: "userA" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => expect(createChatroom).toHaveBeenCalledWith("New Chat", ["userA", "currentUser"]));
});
