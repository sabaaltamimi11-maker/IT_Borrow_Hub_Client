import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  FormText,
} from "reactstrap";
import { register } from "../redux/reducers/authReducer";
import { RegisterSchemaValidation } from "../validation";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = RegisterSchemaValidation;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      await dispatch(register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }));
      alert("Registration successful! You can now login");
      navigate("/login");
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ general: error.response?.data?.message || "An error occurred during registration" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <Container style={{ maxWidth: "500px" }}>
        <Card className="modern-card">
          <CardBody className="p-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold" style={{ color: "#667eea" }}>
                <i className="bi bi-person-plus me-2"></i>
                Create Account
              </h2>
              <p className="text-muted">Join us and start borrowing devices</p>
            </div>
            {errors.general && <Alert color="danger">{errors.general}</Alert>}
            <Form onSubmit={handleSubmit} noValidate>
              <FormGroup className="mb-3">
                <Label className="fw-bold">Username</Label>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="modern-input"
                  invalid={!!errors.username}
                />
                {errors.username && (
                  <FormText color="danger" style={{ fontSize: "0.875rem", marginTop: "0.25rem", color: "#dc3545" }}>
                    {errors.username}
                  </FormText>
                )}
              </FormGroup>
              <FormGroup className="mb-3">
                <Label className="fw-bold">Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="modern-input"
                  invalid={!!errors.email}
                />
                {errors.email && (
                  <FormText color="danger" style={{ fontSize: "0.875rem", marginTop: "0.25rem", color: "#dc3545" }}>
                    {errors.email}
                  </FormText>
                )}
              </FormGroup>
              <FormGroup className="mb-3">
                <Label className="fw-bold">Account Type</Label>
                <Input
                  type="select"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="modern-input"
                  invalid={!!errors.role}
                >
                  <option value="Student">Student</option>
                  <option value="Staff">Staff</option>
                </Input>
                {errors.role && (
                  <FormText color="danger" style={{ fontSize: "0.875rem", marginTop: "0.25rem", color: "#dc3545" }}>
                    {errors.role}
                  </FormText>
                )}
              </FormGroup>
              <FormGroup className="mb-3">
                <Label className="fw-bold">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="modern-input"
                  invalid={!!errors.password}
                />
                {errors.password && (
                  <FormText color="danger" style={{ fontSize: "0.875rem", marginTop: "0.25rem", color: "#dc3545" }}>
                    {errors.password}
                  </FormText>
                )}
              </FormGroup>
              <FormGroup className="mb-4">
                <Label className="fw-bold">Confirm Password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="modern-input"
                  invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <FormText color="danger" style={{ fontSize: "0.875rem", marginTop: "0.25rem", color: "#dc3545" }}>
                    {errors.confirmPassword}
                  </FormText>
                )}
              </FormGroup>
              <Button color="primary" className="btn-gradient w-100" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default RegisterPage;

