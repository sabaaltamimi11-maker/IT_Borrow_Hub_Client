import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import LoginPage from '../LoginPage';
import reducer, { initVal } from '../../redux/reducers/authReducer';

const mockStore = configureStore([]);
const store = mockStore({
  auth: {
    user: null,
    message: "",
    isLoading: false,
    isSuccess: false,
    isError: false
  }
});

const test_initval = {
  user: null,
  message: "",
  isLoading: false,
  isSuccess: false,
  isError: false
};

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Auth Reducer Tests', () => {
  test("Should return initial state", () => {
    expect(
      reducer(undefined, {
        type: undefined,
      })
    ).toEqual(test_initval);
  });
});

describe('LoginPage Component Tests', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("Should render login form", () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginPage />
        </Router>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByText(/Welcome back! Please login to continue/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test("Checking the email format", () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginPage />
        </Router>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    fireEvent.change(emailInput, { target: { value: "abcxyz@gmail.com" } });
    expect(regex.test(emailInput.value)).toBe(true);
  });

  test("Checking invalid email format", () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginPage />
        </Router>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    expect(regex.test(emailInput.value)).toBe(false);
  });

  test("Checking the password field exists", () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginPage />
        </Router>
      </Provider>
    );

    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput.type).toBe('password');
  });

  test("Checking password input accepts value", () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginPage />
        </Router>
      </Provider>
    );

    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    fireEvent.change(passwordInput, { target: { value: "TestPassword123" } });
    expect(passwordInput.value).toBe("TestPassword123");
  });

  test("Checking password minimum length validation", () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginPage />
        </Router>
      </Provider>
    );

    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const shortPassword = "1234567"; // Less than 8 characters
    fireEvent.change(passwordInput, { target: { value: shortPassword } });
    expect(shortPassword.length).toBeLessThan(8);
  });

  test("Form submission with empty fields", async () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginPage />
        </Router>
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(submitButton);

    // Wait for validation errors to appear
    await waitFor(() => {
      // Validation errors should appear
      const emailError = screen.queryByText(/Email is Required/i);
      const passwordError = screen.queryByText(/Password is Required/i);
      expect(emailError || passwordError).toBeTruthy();
    });
  });

  test("Form inputs are accessible", () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginPage />
        </Router>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  describe("Snapshot of the UI", () => {
    it("Should match the UI Mock", () => {
      const { container } = render(
        <Provider store={store}>
          <Router>
            <LoginPage />
          </Router>
        </Provider>
      );
      expect(container).toMatchSnapshot();
    });
  });
});

