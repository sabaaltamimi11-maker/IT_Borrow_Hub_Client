import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Input, FormGroup, Label, Card, CardBody } from "reactstrap";
import DeviceCard from "./DeviceCard";
import { fetchDevices } from "../redux/reducers/deviceReducer";
import axios from "axios";
import logoImg from "../img/img1.png";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const devices = useSelector((state) => state.devices.devices);
  const dispatch = useDispatch();

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    filterDevices();
  }, [searchQuery, categoryFilter, devices]);

  const loadDevices = async () => {
    try {
      setLoading(true);
      await dispatch(fetchDevices());
      setLoading(false);
    } catch (error) {
      console.error("Error loading devices:", error);
      setLoading(false);
    }
  };

  const filterDevices = async () => {
    try {
      if (searchQuery || categoryFilter) {
        const response = await axios.get("https://it-borrowing-system.onrender.com/searchDevices", {
          params: { q: searchQuery, category: categoryFilter },
        });
        setFilteredDevices(response.data);
      } else {
        setFilteredDevices(devices);
      }
    } catch (error) {
      console.error("Error searching devices:", error);
      setFilteredDevices(devices);
    }
  };

  const categories = [...new Set(devices.map((d) => d.category))];
  const displayDevices = searchQuery || categoryFilter ? filteredDevices : devices;

  return (
    <Container className="mt-4">
      {/* Hero Section */}
      <div
        style={{
          padding: "60px 40px",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        <div className="mb-4 d-flex justify-content-center">
          <div
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              padding: "8px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
              position: "relative",
            }}
          >
            {/* Double border effect */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: "4px solid white",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "3px solid #667eea",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "white",
                }}
              >
                <img
                  src={logoImg}
                  alt="IT Borrowing Hub Logo"
                  style={{
                    width: "90%",
                    height: "90%",
                    objectFit: "contain",
                    padding: "10px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <h1
          className="display-3 fw-bold mb-3"
          style={{
            color: "#1a1a2e",
            fontSize: "3.5rem",
            fontWeight: "700",
          }}
        >
          IT Borrowing Hub
        </h1>
        <h2
          className="mb-4"
          style={{
            color: "white",
            fontSize: "1.8rem",
            fontWeight: "600",
          }}
        >
          Device Management System
        </h2>
      </div>

      <div className="page-container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-4" style={{ color: "#1a1a2e" }}>
            <i className="bi bi-devices me-3"></i>
            Available Devices
          </h2>
        </div>

        <Card className="modern-card mb-4">
          <CardBody>
            <Row>
              <Col md={6} className="mb-3">
                <FormGroup>
                  <Label className="fw-bold">
                    <i className="bi bi-search me-2"></i>Search
                  </Label>
                  <Input
                    type="text"
                    placeholder="Search for a device..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="modern-input"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-bold">
                    <i className="bi bi-funnel me-2"></i>Category
                  </Label>
                  <Input
                    type="select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="modern-input"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {loading ? (
          <div className="text-center py-5">
            <div className="loading-spinner"></div>
            <p className="text-muted mt-3">Loading devices...</p>
          </div>
        ) : (
          <Row>
            {displayDevices.length > 0 ? (
              displayDevices.map((device) => (
                <Col md={6} lg={4} xl={3} key={device._id} className="mb-4">
                  <DeviceCard device={device} />
                </Col>
              ))
            ) : (
              <Col>
                <Card className="modern-card">
                  <CardBody className="text-center py-5">
                    <i className="bi bi-inbox" style={{ fontSize: "4rem", color: "#ccc" }}></i>
                    <p className="text-muted mt-3">No devices available</p>
                  </CardBody>
                </Card>
              </Col>
            )}
          </Row>
        )}
      </div>
    </Container>
  );
};

export default HomePage;

