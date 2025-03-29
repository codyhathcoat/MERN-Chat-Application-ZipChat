import axios from "axios";
import { getUserId } from '../GetUserId';

jest.mock('axios'); //Mock axios

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();

});

test("fetches and returns user ID successfully", async () => {
    localStorage.setItem("username", "testuser");


    axios.get.mockResolvedValueOnce({
        data: {id: "12345"},
    });

    const userId = await getUserId();

    expect(userId).toBe("12345");
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/auth/testuser");
    expect(console.log).toHaveBeenCalledWith("User ID:", "12345");
});

test("handles API error correctly", async () => {
    localStorage.setItem("username", "testuser");

    axios.get.mockRejectedValueOnce({
        response: {data: "User not found"},
    });

    const userId = await getUserId();
    expect(userId).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith("Error fetching UID:", "User not found");
});

test("handles network errors gracefully", async () => {
    localStorage.setItem("username", "testuser");

    axios.get.mockRejectedValueOnce(new Error("Network error"));

    const userId = await getUserId();

    expect(userId).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith("Error fetching UID:",  "Network error");
});