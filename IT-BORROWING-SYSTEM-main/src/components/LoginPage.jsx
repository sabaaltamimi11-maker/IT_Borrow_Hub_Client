import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert, FormText } from "reactstrap";
import { login } from "../redux/reducers/authReducer";
import { UserSchemaValidation } from "../validation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = UserSchemaValidation;

  const handleChange = (field, value) => {
    if (field === "email") {
      setEmail(value);
    } else if (field === "password") {
      setPassword(value);
    }
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await validationSchema.validate({ email, password }, { abortEarly: false });
      const result = await dispatch(login({ email, password }));
      if (result.payload && result.payload.message === "success") {
        navigate("/");
      }
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ general: error.response?.data?.message || "An error occurred during login" });
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
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login
              </h2>
              <p className="text-muted">Welcome back! Please login to continue</p>
            </div>
            {errors.general && <Alert color="danger">{errors.general}</Alert>}
            <Form onSubmit={handleSubmit} noValidate>
              <FormGroup className="mb-3">
                <Label className="fw-bold">Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
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
              <FormGroup className="mb-4">
                <Label className="fw-bold">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Enter your password"
                  className="modern-input"
                  invalid={!!errors.password}
                />
                {errors.password && (
                  <FormText color="danger" style={{ fontSize: "0.875rem", marginTop: "0.25rem", color: "#dc3545" }}>
                    {errors.password}
                  </FormText>
                )}
              </FormGroup>
              <Button color="primary" className="btn-gradient w-100" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default LoginPage;

