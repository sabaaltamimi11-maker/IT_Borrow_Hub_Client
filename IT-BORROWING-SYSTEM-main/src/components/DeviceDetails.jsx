import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Badge,
  Button,
  Row,
  Col,
  Alert,
} from "reactstrap";
import BorrowingForm from "./BorrowingForm";
import PostComment from "./PostComment";
import { useDispatch } from "react-redux";
import { fetchDevice } from "../redux/reducers/deviceReducer";
import { fetchDevicePosts } from "../redux/reducers/postReducer";

const DeviceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const currentDevice = useSelector((state) => state.devices.currentDevice);
  const devicePosts = useSelector((state) => state.posts.devicePosts);
  const [device, setDevice] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showBorrowingForm, setShowBorrowingForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDevice();
    loadPosts();
  }, [id]);

  useEffect(() => {
    if (currentDevice) {
      setDevice(currentDevice);
      setLoading(false);
    }
  }, [currentDevice]);

  useEffect(() => {
    if (devicePosts) {
      setPosts(devicePosts);
    }
  }, [devicePosts]);

  const loadDevice = async () => {
    try {
      await dispatch(fetchDevice(id));
    } catch (error) {
      console.error("Error loading device:", error);
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      await dispatch(fetchDevicePosts(id));
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const handlePostUpdate = () => {
    loadPosts();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "success";
      case "Borrowed":
        return "warning";
      case "Damaged":
        return "danger";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center py-5">
          <div className="loading-spinner"></div>
          <p className="text-muted mt-3">Loading device details...</p>
        </div>
      </Container>
    );
  }

  if (!device) {
    return (
      <Container className="mt-4">
        <Alert color="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Device not found
        </Alert>
      </Container>
    );
  }

  const canBorrow = device.status === "Available" && user && user.role !== "Admin";

  return (
    <Container className="mt-4">
      <div className="page-container">
        <Row>
          <Col md={8}>
            <Card className="modern-card mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <CardTitle tag="h2" className="fw-bold mb-0">
                    {device.name}
                  </CardTitle>
                  <Badge
                    color={getStatusColor(device.status)}
                    className="status-badge"
                  >
                    {device.status}
                  </Badge>
                </div>
                <CardText className="mb-3">
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <i className="bi bi-upc-scan me-2 text-primary"></i>
                      <strong>Serial Number:</strong> {device.serialNumber}
                    </div>
                    <div className="col-md-6 mb-2">
                      <i className="bi bi-tag me-2 text-primary"></i>
                      <strong>Category:</strong> {device.category}
                    </div>
                    <div className="col-md-6 mb-2">
                      <i className="bi bi-geo-alt me-2 text-primary"></i>
                      <strong>Location:</strong> {device.location || "Not specified"}
                      {device.lat && device.lng && (
                        <div className="mt-2">
                          <Button
                            color="info"
                            size="sm"
                            onClick={() => {
                              window.open(
                                `https://www.google.com/maps?q=${device.lat},${device.lng}`,
                                "_blank"
                              );
                            }}
                          >
                            <i className="bi bi-map me-2"></i>
                            View on Map
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 mb-2">
                      <i className="bi bi-calendar me-2 text-primary"></i>
                      <strong>Purchase Date:</strong>{" "}
                      {new Date(device.purchaseDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardText>
                {device.description && (
                  <CardText className="mb-4">
                    <strong>Description:</strong>
                    <p className="mt-2">{device.description}</p>
                  </CardText>
                )}
                <div className="d-flex gap-2 flex-wrap">
                  {canBorrow && (
                    <Button
                      color="primary"
                      className="btn-gradient"
                      onClick={() => setShowBorrowingForm(true)}
                    >
                      <i className="bi bi-cart-plus me-2"></i>
                      Request Borrowing
                    </Button>
                  )}
                  {user && (
                    <Button
                      color="success"
                      onClick={() => navigate(`/newpost/${device._id}`)}
                    >
                      <i className="bi bi-star me-2"></i>
                      Add Review
                    </Button>
                  )}
                </div>
                {!user && (
                  <Alert color="info" className="mt-3">
                    <i className="bi bi-info-circle me-2"></i>
                    Please login to request borrowing this device
                  </Alert>
                )}
                {user && user.role === "Admin" && device.status === "Available" && (
                  <Alert color="warning" className="mt-3">
                    <i className="bi bi-info-circle me-2"></i>
                    Admins cannot request to borrow devices
                  </Alert>
                )}
              </CardBody>
            </Card>

            <h4 className="mb-4 fw-bold">
              <i className="bi bi-chat-dots me-2"></i>
              Reviews & Comments
            </h4>
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostComment
                  key={post._id}
                  post={post}
                  onUpdate={handlePostUpdate}
                />
              ))
            ) : (
              <Card className="modern-card">
                <CardBody className="text-center py-4">
                  <i className="bi bi-inbox" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                  <p className="text-muted mt-3">No reviews yet. Be the first to review!</p>
                </CardBody>
              </Card>
            )}
          </Col>
          <Col md={4}>
            <Card className="modern-card">
              <CardBody>
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-lightbulb me-2"></i>
                  Similar Devices
                </h5>
                <CardText className="text-muted">
                  <small>
                    You can search for other devices in the same category:{" "}
                    <strong>{device.category}</strong>
                  </small>
                </CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <BorrowingForm
          isOpen={showBorrowingForm}
          toggle={() => setShowBorrowingForm(false)}
          device={device}
        />
      </div>
    </Container>
  );
};

export default DeviceDetails;

