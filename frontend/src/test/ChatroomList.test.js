import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChatroomList from "../ChatroomList";
import { getChatrooms } from "../GetChatrooms";

jest.mock("../GetChatrooms");

beforeEach(() => {
    jest.clearAllMocks();
});

//fake chatroom data
const mockChatrooms = [
    { _id: "1", name: "General", members: [{ username: "Alice" }, { username: "Bob" }] },
    { _id: "2", name: "Gaming", members: [{ username: "Charlie" }] },
];

test("shows loading state initially", () => {
    getChatrooms.mockResolvedValueOnce([]);

    act(() => {
        render(
            <MemoryRouter>
                <ChatroomList setRefresh={jest.fn()} />
            </MemoryRouter>
        );
    });

    expect(screen.getByText(/loading chatrooms/i)).toBeInTheDocument();
});

test("fetches and displays chatrooms", async () => {
    getChatrooms.mockResolvedValueOnce(mockChatrooms);
    act(() => {
        render(
            <MemoryRouter>
                <ChatroomList setRefresh={jest.fn()} />
            </MemoryRouter>
        );
    });

    //wait for data to load
    await waitFor(() => expect(screen.getByText("Available Chatrooms")).toBeInTheDocument());

    //check chatrooms are displayed
    mockChatrooms.forEach(chatroom => {
        expect(screen.getByText(chatroom.name)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(chatroom.members.map(m => m.username).join(", "), "i"))).toBeInTheDocument();
    });
});

test("shows none available when list is empty", async () => {
    getChatrooms.mockResolvedValueOnce([]);
    act(() => {
        render(
            <MemoryRouter>
                <ChatroomList setRefresh={jest.fn()} />
            </MemoryRouter>
        );
    });

    await waitFor(() => expect(screen.getByText(/no chatrooms available/i)).toBeInTheDocument());
});

test("handles error while fetching chatrooms", async () => {
    getChatrooms.mockRejectedValueOnce(new Error("Failed to fetch chatrooms"));
    act(() => {
        render(
            <MemoryRouter>
                <ChatroomList setRefresh={jest.fn()} />
            </MemoryRouter>
        );
    });

    await waitFor(() => expect(screen.getByText(/loading chatrooms/i)).toBeInTheDocument());
});

test("deletes a chatroom when delete button is clicked", async () => {
    getChatrooms.mockResolvedValueOnce(mockChatrooms);
    window.confirm = jest.fn(() => true); //mock confirmation dialog

    act(() => {
        render(
            <MemoryRouter>
                <ChatroomList setRefresh={jest.fn()} />
            </MemoryRouter>
        );
    });

    await waitFor(() => expect(screen.getByText("Available Chatrooms")).toBeInTheDocument());

    //find delete button and click
    const deleteButton = screen.getAllByText(/delete/i)[0];
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete this chatroom?");
});
