import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import Chatrooms from "../Chatrooms";

jest.mock("axios");

const mockChatroomsData = [
    { _id: "1", name: "Chatroom 1" },
    { _id: "2", name: "Chatroom 2" },
];

test("renders chatrooms correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: mockChatroomsData });

    render(<Chatrooms refresh={false} />);

    await waitFor(() => expect(screen.getByText("Chatroom 1")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Chatroom 2")).toBeInTheDocument());
});

test("fetches and renders chatrooms when 'refresh' prop changes", async () => {
    axios.get.mockResolvedValueOnce({ data: mockChatroomsData });

    const { rerender } = render(<Chatrooms refresh={false} />);

    await waitFor(() => expect(screen.getByText("Chatroom 1")).toBeInTheDocument());

    rerender(<Chatrooms refresh={true} />);

    await waitFor(() => expect(screen.getByText("Chatroom 1")).toBeInTheDocument());
});

test("handles error if fetching chatrooms fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch chatrooms"));

    render(<Chatrooms refresh={false} />);

    await waitFor(() => expect(screen.queryByText("Chatroom 1")).not.toBeInTheDocument());
});
