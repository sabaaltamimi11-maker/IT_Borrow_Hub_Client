import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
  Row,
  Col,
  FormText,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { addPost } from "../redux/reducers/postReducer";
import { PostSchemaValidation } from "../validation";

const NewPost = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    text: "",
    rating: 5,
    image: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validationSchema = PostSchemaValidation;

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
      if (!user || !user._id) {
        alert("Please login to add a review");
        navigate("/login");
        return;
      }
      await validationSchema.validate({
        deviceId: deviceId,
        userId: user._id,
        text: formData.text,
        rating: parseInt(formData.rating),
        image: formData.image,
      }, { abortEarly: false });
      const result = await dispatch(addPost({
        deviceId: deviceId,
        userId: user._id,
        text: formData.text,
        rating: parseInt(formData.rating),
        image: formData.image,
        lat: null,
        lng: null,
      })).unwrap();
      alert("Review added successfully!");
      navigate(`/device/${deviceId}`);
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ general: error.response?.data?.message || "An error occurred while adding the review" });
      }
    } finally {
      setLoading(false);
    }
  };


  if (!user) {
    return (
      <Container className="mt-4">
        <Alert color="warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Please login to add a review
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4" style={{ maxWidth: "600px" }}>
      <div className="page-container">
        <Card className="modern-card">
          <CardBody>
            <h2 className="mb-4 fw-bold">
              <i className="bi bi-star me-2"></i>
              Add Review
            </h2>
            {errors.general && <Alert color="danger">{errors.general}</Alert>}
            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <Label className="fw-bold">Rating (1-5)</Label>
                <Input
                  type="select"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="modern-input"
                  invalid={!!errors.rating}
                >
                  <option value={5}>5 ⭐⭐⭐⭐⭐</option>
                  <option value={4}>4 ⭐⭐⭐⭐</option>
                  <option value={3}>3 ⭐⭐⭐</option>
                  <option value={2}>2 ⭐⭐</option>
                  <option value={1}>1 ⭐</option>
                </Input>
                {errors.rating && (
                  <FormText color="danger" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    {errors.rating}
                  </FormText>
                )}
              </FormGroup>
              <FormGroup className="mb-3">
                <Label className="fw-bold">Review Comment *</Label>
                <Input
                  type="textarea"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  placeholder="Write your review here..."
                  rows={5}
                  className="modern-input"
                  invalid={!!errors.text}
                  required
                />
                {errors.text && (
                  <FormText color="danger" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    {errors.text}
                  </FormText>
                )}
              </FormGroup>
              <FormGroup className="mb-4">
                <Label className="fw-bold">Image URL (Optional)</Label>
                <Input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="modern-input"
                  invalid={!!errors.image}
                />
                {errors.image && (
                  <FormText color="danger" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    {errors.image}
                  </FormText>
                )}
              </FormGroup>
              <Row>
                <Col md={9}>
                  <div className="d-flex gap-2">
                    <Button color="primary" className="btn-gradient" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Adding...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          POST
                        </>
                      )}
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => navigate(`/device/${deviceId}`)}
                      type="button"
                    >
                      Cancel
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
};

export default NewPost;

