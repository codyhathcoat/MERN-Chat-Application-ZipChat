import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatInterface from "../ChatInterface";
import { sendMessage } from "../SendMessage";

jest.mock("../SendMessage");

beforeEach(() => {
    jest.clearAllMocks();
});

test("renders input field and send button", () => {
    render(<ChatInterface chatroomId="123" senderId="456" onMessageSent={jest.fn()} />);

    expect(screen.getByPlaceholderText(/type here/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
});

test("sends a message successfully", async () => {
    const mockOnMessageSent = jest.fn();
    const mockMessage = { _id: "m1", content: "Hello!", senderId: "456" };
    const sender = {_id: "456", name: "TestUser" };
    
    sendMessage.mockResolvedValueOnce(mockMessage);

    render(<ChatInterface chatroomId="123" sender={sender} onMessageSent={mockOnMessageSent} />);

    fireEvent.change(screen.getByPlaceholderText(/type here/i), { target: { value: "Hello!" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => expect(mockOnMessageSent).toHaveBeenCalledWith(mockMessage));
    expect(screen.getByPlaceholderText(/type here/i)).toHaveValue(""); //input should be cleared
});

test("does not send an empty message", async () => {
    const mockOnMessageSent = jest.fn();

    render(<ChatInterface chatroomId="123" senderId="456" onMessageSent={mockOnMessageSent} />);

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(sendMessage).not.toHaveBeenCalled();
    expect(mockOnMessageSent).not.toHaveBeenCalled();
});

test("handles message sending failure", async () => {
    const sender  = {_id: "456", name: "Test User" };
    sendMessage.mockRejectedValueOnce(new Error("Failed to send message"));

    render(<ChatInterface chatroomId="123" sender={sender} onMessageSent={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/type here/i), { target: { value: "Hello!" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => expect(sendMessage).toHaveBeenCalledTimes(1));
});
