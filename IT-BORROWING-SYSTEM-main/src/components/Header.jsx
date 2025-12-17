import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  Collapse,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
} from "reactstrap";
import axios from "axios";
import { logout } from "../redux/reducers/authReducer";
import logoImg from "../img/img2.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Filter out notifications older than 10 minutes every minute
  useEffect(() => {
    if (notifications.length > 0) {
      const filterInterval = setInterval(() => {
        const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => {
            if (!notification.timestamp) return true; // Keep notifications without timestamp
            const notificationTime = new Date(notification.timestamp).getTime();
            return notificationTime >= tenMinutesAgo;
          })
        );
      }, 60000); // Check every minute
      return () => clearInterval(filterInterval);
    }
  }, [notifications.length]);

  const loadNotifications = async () => {
    try {
      const response = await axios.get(`https://it-borrowing-system.onrender.com/getNotifications/${user._id}`);
      const allNotifications = response.data;
      
      // Filter out notifications older than 10 minutes (600,000 milliseconds)
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
      const recentNotifications = allNotifications.filter((notification) => {
        if (!notification.timestamp) return true; // Keep notifications without timestamp
        const notificationTime = new Date(notification.timestamp).getTime();
        return notificationTime >= tenMinutesAgo;
      });
      
      setNotifications(recentNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggle = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleNotificationDropdown = () => setNotificationDropdownOpen(!notificationDropdownOpen);
  
  const getNotificationColor = (type) => {
    switch (type) {
      case "Payment":
        return "success";
      case "PendingPayment":
        return "warning";
      case "Overdue":
        return "danger";
      case "Warning":
        return "warning";
      default:
        return "info";
    }
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case "Payment":
        return "bi-check-circle";
      case "PendingPayment":
        return "bi-clock";
      case "Overdue":
        return "bi-exclamation-triangle";
      case "Warning":
        return "bi-exclamation-circle";
      default:
        return "bi-info-circle";
    }
  };

  return (
    <Navbar
      light
      expand="md"
      className="mb-4"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderBottom: "2px solid #dee2e6",
      }}
    >
      <NavbarBrand tag={Link} to="/" className="fw-bold d-flex align-items-center" style={{ color: "#333" }}>
        <img
          src={logoImg}
          alt="IT Borrowing System Logo"
          style={{
            height: "40px",
            width: "auto",
            marginRight: "10px",
            objectFit: "contain",
          }}
        />
        <span style={{ color: "#333" }}>IT Borrowing System</span>
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="/" style={{ color: "#333" }}>
              Home
            </NavLink>
          </NavItem>
          {user && (
            <>
              {user.role !== "Admin" && (
                <NavItem>
                  <NavLink tag={Link} to="/borrowings" style={{ color: "#333" }}>
                    My Borrowings
                  </NavLink>
                </NavItem>
              )}
              {user.role === "Admin" && (
                <NavItem>
                  <NavLink tag={Link} to="/admin" style={{ color: "#333" }}>
                    Dashboard
                  </NavLink>
                </NavItem>
              )}
            </>
          )}
        </Nav>
        <Nav className="ms-auto" navbar>
          {user ? (
            <>
              {notifications.length > 0 && (
                <NavItem className="me-3 d-flex align-items-center">
                  <Dropdown
                    isOpen={notificationDropdownOpen}
                    toggle={toggleNotificationDropdown}
                    direction="down"
                  >
                    <DropdownToggle
                      tag="div"
                      style={{ cursor: "pointer" }}
                      className="d-flex align-items-center"
                    >
                      <Badge
                        color="danger"
                        pill
                        id="notificationBadge"
                        style={{ cursor: "pointer" }}
                      >
                        {notifications.length}
                      </Badge>
                    </DropdownToggle>
                    <DropdownMenu end style={{ minWidth: "300px", maxWidth: "400px" }}>
                      <DropdownItem header>
                        <i className="bi bi-bell me-2"></i>
                        Notifications ({notifications.length})
                      </DropdownItem>
                      <DropdownItem divider />
                      {notifications.map((notification, index) => (
                        <DropdownItem
                          key={index}
                          style={{
                            whiteSpace: "normal",
                            padding: "12px",
                            borderLeft: `4px solid ${
                              notification.type === "Payment"
                                ? "#28a745"
                                : notification.type === "PendingPayment"
                                ? "#ffc107"
                                : notification.type === "Overdue"
                                ? "#dc3545"
                                : "#ffc107"
                            }`,
                          }}
                        >
                          <div className="d-flex align-items-start">
                            <i
                              className={`bi ${getNotificationIcon(notification.type)} me-2`}
                              style={{
                                color:
                                  notification.type === "Payment"
                                    ? "#28a745"
                                    : notification.type === "PendingPayment"
                                    ? "#ffc107"
                                    : notification.type === "Overdue"
                                    ? "#dc3545"
                                    : "#ffc107",
                                fontSize: "1.2rem",
                                marginTop: "2px",
                              }}
                            ></i>
                            <div className="flex-grow-1">
                              <div
                                className="fw-bold mb-1"
                                style={{
                                  fontSize: "0.9rem",
                                  color: "#333",
                                }}
                              >
                                {notification.type === "Payment" && "Payment Received"}
                                {notification.type === "PendingPayment" && "Pending Payment"}
                                {notification.type === "Overdue" && "Overdue Device"}
                                {notification.type === "Warning" && "Return Reminder"}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#666",
                                  lineHeight: "1.4",
                                }}
                              >
                                {notification.message}
                              </div>
                              {notification.timestamp && (
                                <div
                                  className="mt-1"
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "#999",
                                  }}
                                >
                                  {new Date(notification.timestamp).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </DropdownItem>
                      ))}
                      {notifications.length === 0 && (
                        <DropdownItem disabled>
                          <div className="text-center text-muted py-2">
                            No notifications
                          </div>
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </NavItem>
              )}
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle
                  caret
                  className="btn-gradient"
                  style={{ border: "none" }}
                >
                  <i className="bi bi-person-circle me-2"></i>
                  {user.username}
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem header>
                    <small className="text-muted">{user.email}</small>
                    <br />
                    <Badge color={user.role === "Admin" ? "primary" : "secondary"}>
                      {user.role}
                    </Badge>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink tag={Link} to="/login" style={{ color: "#333" }}>
                  Login
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/register" style={{ color: "#333" }}>
                  Register
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Header;
