import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import Login from '../Login';
import axios from 'axios';
import { MemoryRouter, useNavigate } from 'react-router-dom';

jest.mock('axios'); //Mock axios

//Mock use navigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        //useNavigate: jest.fn(),
        useNavigate: () => mockedUsedNavigate,
    };
});

beforeEach(() => {
    localStorage.clear();
});

test('successful login navigates to /home and stores token', async() => {
    //Set up mock response for axios
    axios.post.mockResolvedValueOnce({
        data: {
            token: 'fakeToken123',
            redirect: false,
        },
    });

    //Renter the component in Memory router to provide context.
    render(<MemoryRouter><Login setIsLoggedIn={jest.fn()} /></MemoryRouter>)

    //Simulate a user entering information.
    //Fire event from React testing lib to simulate events like clicks or typing
    fireEvent.change(screen.getByLabelText(/username/i), {
        target: {value: 'testuser'},
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
        target: {value: 'password123'},
    })

    //Submit the form.
    fireEvent.click(screen.getByRole('button', {name: /login/i}));

    //waitFor helps with asyncronous updates like API calls
    await waitFor(() => {
        //Verify the user is directed to the home page.
        //expect(somevalue).toBe(expectedValue);
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/home');
        expect(localStorage.getItem('token')).toBe('fakeToken123');
        expect(localStorage.getItem('username')).toBe('testuser');
        
    })
});

//Test for a successful login. (test('descr', () => {test code}))
test('successful login navigates to /name and stores token', async() => {

    //Set up mock response for axios
    const fake_response = {
        data: {
            token: 'fakeToken123',
            redirect: true,
        },
    };

    axios.post.mockResolvedValueOnce(fake_response);

        //Renter the component in Memory router to provide context.
    render(<MemoryRouter><Login setIsLoggedIn={jest.fn()} /></MemoryRouter>)

    //Simulate a user entering information.
    //Fire event from React testing lib to simulate events like clicks or typing
    fireEvent.change(screen.getByLabelText(/username/i), {
        target: {value: 'newuser'},
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
        target: {value: 'newpassword'},
    })

    //Submit the form.
    fireEvent.click(screen.getByRole('button', {name: /login/i}));

    //waitFor helps with asyncronous updates like API calls
    await waitFor(() => {
        //Verify the user is directed to the home page.
        //expect(somevalue).toBe(expectedValue);
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/name');
        expect(localStorage.getItem('token')).toBe('fakeToken123');
        expect(localStorage.getItem('username')).toBe('newuser');
        
    })
});
//Test a failed login.
test('failed login displays error message', async() => {
    axios.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<MemoryRouter><Login setIsLoggedIn={jest.fn()} /></MemoryRouter>)

    fireEvent.change(screen.getByLabelText(/username/i), {
        target: {value: 'wronguser'},
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
        target: {value: 'wrongpassword'},
    });
    fireEvent.click(screen.getByRole('button', {name: /login/i}));

    await waitFor(() => {
        expect(screen.getByText(/login failed. please check your credentials./i)).toBeInTheDocument();
    });
});

test("username and password inputs should enforce character limits", () => {
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>

    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, {target: {value: "a".repeat(35) }});
    fireEvent.change(passwordInput, {target: {value: "b".repeat(35) }});

    expect(screen.getByDisplayValue('a'.repeat(30))).toBeInTheDocument();
    expect(screen.getByDisplayValue('b'.repeat(30))).toBeInTheDocument();
})
