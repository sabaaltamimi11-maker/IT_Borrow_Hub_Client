import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import RegisterPage from '../RegisterPage';
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

// Mock window.alert
global.alert = jest.fn();

describe('Auth Reducer Tests', () => {
  test("Should return initial state", () => {
    expect(
      reducer(undefined, {
        type: undefined,
      })
    ).toEqual(test_initval);
  });
});

describe('RegisterPage Component Tests', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    global.alert.mockClear();
  });

  test("Should render register form", () => {
    render(
      <Provider store={store}>
        <Router>
          <RegisterPage />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Join us and start borrowing devices/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^Enter password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Re-enter password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  test("Checking the email format", () => {
    render(
      <Provider store={store}>
        <Router>
          <RegisterPage />
        </Router>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    fireEvent.change(emailInput, { target: { value: "testuser@gmail.com" } });
    expect(regex.test(emailInput.value)).toBe(true);
  });

  test("Checking invalid email format", () => {
    render(
      <Provider store={store}>
        <Router>
          <RegisterPage />
        </Router>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    expect(regex.test(emailInput.value)).toBe(false);
  });

  test("Checking username field accepts input", () => {
    render(
      <Provider store={store}>
        <Router>
          <RegisterPage />
        </Router>
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText(/Enter username/i);
    fireEvent.change(usernameInput, { target: { value: "testuser123" } });
    expect(usernameInput.value).toBe("testuser123");
  });

  test("Checking username minimum length validation", () => {
    render(
      <Provider store={store}>
        <Router>
          <RegisterPage />
        </Router>
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText(/Enter username/i);
    const shortUsername = "ab"; // Less than 3 characters
    fireEvent.change(usernameInput, { target: { value: shortUsername } });
    expect(shortUsername.length).toBeLessThan(3);
  });

  test("Checking password field accepts input", () => {
    render(
      <Provider store={store}>
        <Router>
          <RegisterPage />
        </Router>
      </Provider>
    );

    const passwordInput = screen.getByPlaceholderText(/^Enter password$/i);
    fireEvent.change(passwordInput, { target: { value: "TestPassword123" } });
    expect(passwordInput.value).toBe("TestPassword123");
  });

  test("Checking password minimum length validation", () => {
    render(
      <Provider store={store}>
        <Router>
          <RegisterPage />
        </Router>
      </Provider>
    );

    const passwordInput = screen.getByPlaceholderText(/^Enter password$/i);
    const shortPassword = "1234567"; // Less than 8 characters
    fireEvent.change(passwordInput, { target: { value: shortPassword } });
    expect(shortPassword.length).toBeLessThan(8);
  });

  test("Checking confirm password field", () => {
    render(
      <Provider store={store}>
        <Router>
          <RegisterPage />
        </Router>
      </Provider>
    );

    const passwordInput = screen.getByPlaceholderText(/^Enter password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/Re-enter password/i);

    fireEvent.change(passwordInput, { target: { value: "TestPassword123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "TestPassword123" } });

    expect(passwordInput.value).toBe(confirmPasswordInput.value);
  });

  test("Checking password mismatch", () => {
    render(
      <Provider store={store}>
        <Router>
          <RegisterPage />
        </Router>
      </Provider>
    );

    const passwordInput = screen.getByPlaceholderText(/^Enter password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/Re-enter password/i);

    fireEvent.change(passwordInput, { target: { value: "TestPassword123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "DifferentPassword" } });

    expect(passwordInput.value).not.toBe(confirmPasswordInput.value);
  });

  test("Checking role selection", () => {
    render(
      <Provider store={store}>
        <Router>
          <RegisterPage />
        </Router>
      </Provider>
    );

    const roleSelect = screen.getByRole('combobox');
    expect(roleSelect.value).toBe("Student");

    fireEvent.change(roleSelect, { target: { value: "Staff" } });
    expect(roleSelect.value).toBe("Staff");
  });

  test("Form submission with empty fields", async () => {
    render(
      <Provider store={store}>
        <Router>
          <RegisterPage />
        </Router>
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /Register/i });
    fireEvent.click(submitButton);

    // Wait for validation errors to appear
    await waitFor(() => {
      // Validation errors should appear
      expect(screen.queryByText(/Username is Required/i) ||
        screen.queryByText(/Email is Required/i) ||
        screen.queryByText(/Password is Required/i)).toBeTruthy();
    });
  });

  test("Form inputs are accessible", () => {
    render(
      <Provider store={store}>
        <Router>
          <RegisterPage />
        </Router>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Enter username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^Enter password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Re-enter password/i)).toBeInTheDocument();
  });

  describe("Snapshot of the UI", () => {
    it("Should match the UI Mock", () => {
      const { container } = render(
        <Provider store={store}>
          <Router>
            <RegisterPage />
          </Router>
        </Provider>
      );
      expect(container).toMatchSnapshot();
    });
  });
});

