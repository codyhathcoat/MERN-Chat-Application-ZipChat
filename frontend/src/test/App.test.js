import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

function mockLocalStorage(token){

  const localStoragemock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStoragemock,
  });

  if(token){
    window.localStorage.setItem('token', token);
  }

}
describe('App component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    window.localStorage.clear();
  });

  test('renders ZipChat  heading', () => {
    render(<App />);
    const heading = screen.getByRole("heading", { name: /Zip\s*Chat/i });
    expect(heading).toBeInTheDocument();
  });

  test('handles expired token', async () => {
    const payload = {
      exp: Math.floor(Date.now() / 1000) - 60 //Expire
    };
    const token = `header. ${btoa(JSON.stringify(payload))}.signature`;

    mockLocalStorage(token);
    render(<App />);

    const heading = screen.getByRole("heading", { name: /Zip\s*Chat/i });
    expect(heading).toBeInTheDocument();
  });

  test('handles invalid token', async () => {
    const invalidToken = `invalid.token.format`;
    mockLocalStorage(invalidToken);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    const heading = screen.getByRole("heading", { name: /Zip\s*Chat/i });
    expect(heading).toBeInTheDocument();

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid token format:'),
      expect.any(Error)
    );
  });

});
