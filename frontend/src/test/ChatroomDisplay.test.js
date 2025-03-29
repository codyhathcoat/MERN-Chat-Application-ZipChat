import React from 'react';
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import ChatroomDisplay from "../ChatroomDisplay";
import { getChatroom } from "../GetChatroom";
import { getUserId } from "../GetUserId";

jest.mock("../GetChatroom");
jest.mock("../GetUserId");

//mock chatroom id
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({ chatroomId: "12345" }),
}));

beforeEach(() => {
    jest.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

//fake chatroom data
const mockChatroomData = {
    _id: "12345",
    name: "Test Chatroom",
    members: [
        { _id: "1", username: "UserOne", first_name: "User", last_name: "One", avatarColor: "#ff0000" },
        { _id: "2", username: "UserTwo", first_name: "User", last_name: "Two", avatarColor: "#00ff00" },
    ],
    messages: [
        { _id: "m1", sender: { _id: "1" }, content: "Hello!", timestamp: new Date().toISOString() },
        { _id: "m2", sender: { _id: "2" }, content: "Hi there!", timestamp: new Date().toISOString() },
    ],
};

//fake user
const mockUserId = "1";

test("shows loading status", async () => {
    getChatroom.mockResolvedValueOnce([]);
    getUserId.mockResolvedValueOnce(mockUserId);

    await act(async () =>  {
        render(
            <MemoryRouter>
                <ChatroomDisplay />
            </MemoryRouter>
        );
    });

    expect(screen.getByText(/loading chatroom/i)).toBeInTheDocument();
});

test("fetches the chatroom details", async () => {
    getChatroom.mockResolvedValueOnce(mockChatroomData);
    getUserId.mockResolvedValueOnce(mockUserId);

    await act(async () => {
        render(
            <MemoryRouter>
                <ChatroomDisplay />
            </MemoryRouter>
        );
    });

    // Wait for chatroom data to be fetched
    await waitFor(() => expect(screen.getByText(mockChatroomData.name)).toBeInTheDocument());

    //members
    for (const member of mockChatroomData.members) {
        expect(screen.getByText(member.username)).toBeInTheDocument();
    }

    //messages
    for (const msg of mockChatroomData.messages) {
        expect(screen.getByText(msg.content)).toBeInTheDocument();
    }
});

test("displays the no messages message if chatroom is empty", async () => {
    getChatroom.mockResolvedValueOnce({ ...mockChatroomData, messages: [] });
    getUserId.mockResolvedValueOnce(mockUserId);

    await act(async () => {
        render(
            <MemoryRouter>
                <ChatroomDisplay />
            </MemoryRouter>
        );
    });

    await waitFor(() => expect(screen.getByText(/no messages yet/i)).toBeInTheDocument());
});

test("handles API errors", async () => {
    getChatroom.mockRejectedValueOnce(new Error("Failed to fetch chatroom"));
    getUserId.mockRejectedValueOnce(new Error("Failed to fetch user ID"));

    await act(async () => {
        render(
            <MemoryRouter>
                <ChatroomDisplay />
            </MemoryRouter>
        );
    });

    await waitFor(() => expect(screen.getByText(/failed to load chatroom/i)).toBeInTheDocument());
});

