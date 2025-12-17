import React from "react";
import { Card, CardBody, Badge, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DeviceCard = ({ device }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

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

  const getStatusText = (status) => {
    switch (status) {
      case "Available":
        return "Available";
      case "Borrowed":
        return "Borrowed";
      case "Damaged":
        return "Damaged";
      default:
        return status;
    }
  };

  // Default laptop image if no image provided
  // Check if device.image exists and is not empty
  const deviceImage = device.image && device.image.trim() !== "" 
    ? device.image 
    : "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop";

  return (
    <Card
      className="mb-4"
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        border: "none",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)";
      }}
    >
      {/* Image Section */}
      <div
        style={{
          position: "relative",
          height: "200px",
          background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
          overflow: "hidden",
        }}
      >
        <img
          src={deviceImage}
          alt={device.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.9,
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        
        {/* Icon in top-left */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            width: "40px",
            height: "40px",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <i className="bi bi-laptop" style={{ fontSize: "20px", color: "#667eea" }}></i>
        </div>

        {/* Status Badge in top-right */}
        <Badge
          color={getStatusColor(device.status)}
          pill
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            padding: "6px 12px",
            fontSize: "0.85rem",
            fontWeight: "600",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          {getStatusText(device.status)}
        </Badge>
      </div>

      {/* Text Section - Dark Blue Background */}
      <CardBody
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%)",
          color: "white",
          padding: "20px",
        }}
      >
        {/* Device Name */}
        <h5
          className="fw-bold mb-2"
          style={{
            fontSize: "1.5rem",
            color: "white",
            marginBottom: "8px",
          }}
        >
          {device.name}
        </h5>

        {/* Category */}
        <p
          className="mb-2"
          style={{
            color: "#a0b8d0",
            fontSize: "0.9rem",
            marginBottom: "8px",
          }}
        >
          {device.category}
        </p>

        {/* Serial Number */}
        <div
          className="d-flex justify-content-between align-items-center mb-3"
          style={{
            marginBottom: "16px",
          }}
        >
          <span style={{ color: "#a0b8d0", fontSize: "0.85rem" }}>Serial:</span>
          <span style={{ color: "white", fontSize: "0.85rem", fontWeight: "500" }}>
            {device.serialNumber || "N/A"}
          </span>
        </div>

        {/* Action Button */}
        {user ? (
          device.status === "Available" && user.role !== "Admin" ? (
            <Button
              color="success"
              block
              className="fw-bold"
              style={{
                borderRadius: "8px",
                padding: "12px",
                fontSize: "1rem",
                background: "#28a745",
                border: "none",
                boxShadow: "0 4px 6px rgba(40, 167, 69, 0.3)",
              }}
              onClick={() => navigate(`/device/${device._id}`)}
            >
              <i className="bi bi-cart-plus me-2"></i>
              Borrow Now
            </Button>
          ) : (
            <Button
              color="secondary"
              block
              className="fw-bold"
              style={{
                borderRadius: "8px",
                padding: "12px",
                fontSize: "1rem",
                border: "none",
              }}
              onClick={() => navigate(`/device/${device._id}`)}
            >
              <i className="bi bi-eye me-2"></i>
              View Details
            </Button>
          )
        ) : (
          <Button
            color="success"
            block
            className="fw-bold"
            style={{
              borderRadius: "8px",
              padding: "12px",
              fontSize: "1rem",
              background: "#28a745",
              border: "none",
              boxShadow: "0 4px 6px rgba(40, 167, 69, 0.3)",
            }}
            onClick={() => navigate("/login")}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Sign In to Borrow
          </Button>
        )}
      </CardBody>
    </Card>
  );
};

export default DeviceCard;
