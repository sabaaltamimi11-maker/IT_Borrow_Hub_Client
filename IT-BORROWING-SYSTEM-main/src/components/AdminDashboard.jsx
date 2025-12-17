import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Badge,
  Alert,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { fetchDevices, addDevice, updateDevice, deleteDevice } from "../redux/reducers/deviceReducer";
import { fetchBorrowings, updateBorrowing, deleteBorrowing } from "../redux/reducers/borrowingReducer";
import { fetchUsers, updateUser, deleteUser } from "../redux/reducers/userReducer";
import axios from "axios";
import classnames from "classnames";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [stats, setStats] = useState({});
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showBorrowingModal, setShowBorrowingModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deviceForm, setDeviceForm] = useState({
    name: "",
    serialNumber: "",
    category: "",
    status: "Available",
    location: "",
    description: "",
    image: "",
    lat: null,
    lng: null,
  });
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [borrowingForm, setBorrowingForm] = useState({
    status: "",
    conditionAfter: "",
    fine: 0,
    notes: "",
  });
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    role: "Student",
    status: "Active",
  });

  const devices = useSelector((state) => state.devices.devices);
  const borrowings = useSelector((state) => state.borrowings.borrowings);
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users?.users || []);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        function (position) {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        function (error) {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const loadData = async () => {
    try {
      await dispatch(fetchDevices());
      await dispatch(fetchBorrowings());
      await dispatch(fetchUsers());

      const statsResponse = await axios.get("https://it-borrowing-system.onrender.com/getStats");
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "3") {
      loadData();
    }
  }, [activeTab]);

  const handleDeviceSubmit = async (e) => {
    e.preventDefault();
    try {
      const deviceData = {
        ...deviceForm,
        lat: deviceForm.lat || null,
        lng: deviceForm.lng || null,
      };
      if (editingItem) {
        const result = await dispatch(updateDevice({ id: editingItem._id, deviceData: deviceData })).unwrap();
        alert("Device updated successfully!");
      } else {
        const result = await dispatch(addDevice(deviceData)).unwrap();
        alert("Device added successfully!");
      }
      await loadData();
      setShowDeviceModal(false);
      resetDeviceForm();
    } catch (error) {
      console.error("Error submitting device:", error);
      alert(error.response?.data?.message || error.message || "An error occurred");
    }
  };

  const handleShareLocation = () => {
    if (!lat || !lng) {
      alert("Location not available. Please allow location access.");
      return;
    }
    setDeviceForm({
      ...deviceForm,
      lat: lat,
      lng: lng,
    });
    alert("Location shared successfully!");
  };

  const handleBorrowingUpdate = async () => {
    if (!editingItem || !editingItem._id) {
      alert("No borrowing selected for update");
      return;
    }
    
    try {
      const result = await dispatch(updateBorrowing({ id: editingItem._id, borrowingData: borrowingForm })).unwrap();
      setShowBorrowingModal(false);
      resetBorrowingForm();
      loadData();
      alert("Borrowing updated successfully!");
    } catch (error) {
      console.error("Update borrowing error:", error);
      alert(error.response?.data?.message || error.message || "An error occurred");
    }
  };

  const handleUserUpdate = async () => {
    if (!editingItem || !editingItem._id) {
      alert("No user selected for update");
      return;
    }
    try {
      const result = await dispatch(updateUser({ id: editingItem._id, userData: userForm })).unwrap();
      alert("User updated successfully!");
      setShowUserModal(false);
      resetUserForm();
      loadData();
    } catch (error) {
      console.error("Update user error:", error);
      alert(error.response?.data?.message || error.message || "An error occurred");
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      if (type === "device") {
        const result = await dispatch(deleteDevice(id)).unwrap();
        alert("Device deleted successfully!");
        loadData();
      } else if (type === "borrowing") {
        const result = await dispatch(deleteBorrowing(id)).unwrap();
        alert("Borrowing deleted successfully!");
        loadData();
      } else if (type === "user") {
        const result = await dispatch(deleteUser(id)).unwrap();
        alert("User deleted successfully!");
        loadData();
      }
    } catch (error) {
      console.error("Delete error:", error);
      // Better error handling to show server message
      // When using rejectWithValue, error data is in error.payload
      const errorMessage = 
        error?.payload?.message || 
        error?.response?.data?.message || 
        error?.message || 
        (error?.response?.status === 400 ? "Cannot delete this item. It may be in use or have active borrowings." : "An error occurred while deleting");
      alert(errorMessage);
    }
  };

  const openEditModal = (type, item) => {
    if (!item || !item._id) {
      alert("Invalid item selected");
      return;
    }
    
    setEditingItem(item);
    if (type === "device") {
      setDeviceForm({
        name: item.name || "",
        serialNumber: item.serialNumber || "",
        category: item.category || "",
        status: item.status || "Available",
        location: item.location || "",
        description: item.description || "",
        image: item.image || "",
        lat: item.lat || null,
        lng: item.lng || null,
      });
      setShowDeviceModal(true);
    } else if (type === "borrowing") {
      setBorrowingForm({
        status: item.status || "Pending",
        conditionAfter: item.conditionAfter || "",
        fine: item.fine || 0,
        notes: item.notes || "",
      });
      setShowBorrowingModal(true);
    } else if (type === "user") {
      setUserForm({
        username: item.username || "",
        email: item.email || "",
        role: item.role || "Student",
        status: item.status || "Active",
      });
      setShowUserModal(true);
    }
  };

  const resetDeviceForm = () => {
    setDeviceForm({
      name: "",
      serialNumber: "",
      category: "",
      status: "Available",
      location: "",
      description: "",
      image: "",
      lat: null,
      lng: null,
    });
    setEditingItem(null);
  };

  const resetBorrowingForm = () => {
    setBorrowingForm({
      status: "",
      conditionAfter: "",
      fine: 0,
      notes: "",
    });
    // Don't reset editingItem here - it should be reset when modal closes
  };

  const resetUserForm = () => {
    setUserForm({
      username: "",
      email: "",
      role: "Student",
      status: "Active",
    });
    setEditingItem(null);
  };

  return (
    <Container className="mt-4">
      <div className="page-container">
        <h2 className="mb-4 fw-bold">
          <i className="bi bi-speedometer2 me-2"></i>
          Admin Dashboard
        </h2>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="modern-card">
            <CardBody>
              <CardTitle className="fw-bold">
                <i className="bi bi-devices me-2 text-primary"></i>
                Total Devices
              </CardTitle>
              <h2 className="mt-2" style={{ color: "#667eea" }}>{stats.totalDevices || 0}</h2>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="modern-card">
            <CardBody>
              <CardTitle className="fw-bold">
                <i className="bi bi-check-circle me-2 text-success"></i>
                Available Devices
              </CardTitle>
              <h2 className="mt-2" style={{ color: "#28a745" }}>{stats.availableDevices || 0}</h2>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="modern-card">
            <CardBody>
              <CardTitle className="fw-bold">
                <i className="bi bi-clock-history me-2 text-info"></i>
                Active Borrowings
              </CardTitle>
              <h2 className="mt-2" style={{ color: "#17a2b8" }}>{stats.activeBorrowings || 0}</h2>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="modern-card">
            <CardBody>
              <CardTitle className="fw-bold">
                <i className="bi bi-exclamation-triangle me-2 text-danger"></i>
                Overdue Borrowings
              </CardTitle>
              <h2 className="mt-2 text-danger">{stats.overdueBorrowings || 0}</h2>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => setActiveTab("1")}
          >
            Devices
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => setActiveTab("2")}
          >
            Borrowings
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "3" })}
            onClick={() => setActiveTab("3")}
          >
            Users
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Card className="mt-3">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">
                  <i className="bi bi-devices me-2"></i>
                  Device Management
                </h4>
                <Button
                  color="primary"
                  className="btn-gradient"
                  onClick={() => {
                    resetDeviceForm();
                    setShowDeviceModal(true);
                  }}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Device
                </Button>
              </div>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th><i className="bi bi-tag me-2"></i>Name</th>
                    <th><i className="bi bi-upc-scan me-2"></i>Serial Number</th>
                    <th><i className="bi bi-folder me-2"></i>Category</th>
                    <th><i className="bi bi-info-circle me-2"></i>Status</th>
                    <th><i className="bi bi-gear me-2"></i>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devices && devices.length > 0 ? devices.map((device) => (
                    <tr key={device._id}>
                      <td>{device.name}</td>
                      <td>{device.serialNumber}</td>
                      <td>{device.category}</td>
                      <td>
                        <Badge
                          color={
                            device.status === "Available"
                              ? "success"
                              : device.status === "Borrowed"
                              ? "warning"
                              : "danger"
                          }
                        >
                          {device.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          color="info"
                          size="sm"
                          className="me-2"
                          onClick={() => openEditModal("device", device)}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Edit
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete("device", device._id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        <i className="bi bi-inbox me-2"></i>No devices found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </TabPane>

        <TabPane tabId="2">
          <Card className="mt-3">
            <CardBody>
              <h4 className="mb-3 fw-bold">
                <i className="bi bi-clock-history me-2"></i>
                Borrowing Management
              </h4>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th><i className="bi bi-laptop me-2"></i>Device</th>
                    <th><i className="bi bi-person me-2"></i>User</th>
                    <th><i className="bi bi-calendar-check me-2"></i>Borrow Date</th>
                    <th><i className="bi bi-calendar-x me-2"></i>Return Date</th>
                    <th><i className="bi bi-info-circle me-2"></i>Status</th>
                    <th><i className="bi bi-currency-dollar me-2"></i>Fine</th>
                    <th><i className="bi bi-credit-card me-2"></i>Payment</th>
                    <th><i className="bi bi-gear me-2"></i>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowings.map((borrowing) => (
                    <tr key={borrowing._id}>
                      <td>
                        {borrowing.device && Array.isArray(borrowing.device) && borrowing.device.length > 0
                          ? borrowing.device[0].name
                          : borrowing.deviceId && typeof borrowing.deviceId === 'object' && borrowing.deviceId.name
                          ? borrowing.deviceId.name
                          : "Not specified"}
                      </td>
                      <td>
                        {borrowing.user && Array.isArray(borrowing.user) && borrowing.user.length > 0
                          ? borrowing.user[0].username
                          : borrowing.userId && typeof borrowing.userId === 'object' && borrowing.userId.username
                          ? borrowing.userId.username
                          : "Not specified"}
                      </td>
                      <td>
                        {new Date(borrowing.borrowDate).toLocaleDateString()}
                      </td>
                      <td>
                        {new Date(borrowing.returnDate).toLocaleDateString()}
                      </td>
                      <td>
                        <Badge
                          color={
                            borrowing.status === "Active"
                              ? "info"
                              : borrowing.status === "Returned"
                              ? "success"
                              : borrowing.status === "Overdue"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {borrowing.status}
                        </Badge>
                      </td>
                      <td>
                        {borrowing.fine > 0 ? (
                          <span className="text-danger fw-bold">{borrowing.fine} OMR</span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {borrowing.fine > 0 ? (
                          <Badge
                            color={
                              borrowing.paymentStatus === "Paid"
                                ? "success"
                                : borrowing.paymentStatus === "Pending"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {borrowing.paymentStatus === "Paid" ? (
                              <>
                                <i className="bi bi-check-circle me-1"></i>Paid
                              </>
                            ) : (
                              <>
                                <i className="bi bi-clock me-1"></i>Pending
                              </>
                            )}
                          </Badge>
                        ) : (
                          <Badge color="light">Not Required</Badge>
                        )}
                      </td>
                      <td>
                        <Button
                          color="info"
                          size="sm"
                          className="me-2"
                          onClick={() =>
                            openEditModal("borrowing", borrowing)
                          }
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Edit
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() =>
                            handleDelete("borrowing", borrowing._id)
                          }
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </TabPane>

        <TabPane tabId="3">
          <Card className="mt-3">
            <CardBody>
              <h4 className="mb-3 fw-bold">
                <i className="bi bi-people me-2"></i>
                User Management
              </h4>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th><i className="bi bi-person-badge me-2"></i>Username</th>
                    <th><i className="bi bi-envelope me-2"></i>Email</th>
                    <th><i className="bi bi-shield-check me-2"></i>Role</th>
                    <th><i className="bi bi-info-circle me-2"></i>Status</th>
                    <th><i className="bi bi-gear me-2"></i>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <Badge
                            color={
                              user.status === "Active" ? "success" : "danger"
                            }
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            color="info"
                            size="sm"
                            className="me-2"
                            onClick={() => openEditModal("user", user)}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete("user", user._id)}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </TabPane>
      </TabContent>

      {/* Device Modal */}
      <Modal isOpen={showDeviceModal} toggle={() => setShowDeviceModal(false)}>
        <ModalHeader toggle={() => setShowDeviceModal(false)}>
          {editingItem ? "Edit Device" : "Add New Device"}
        </ModalHeader>
        <Form onSubmit={handleDeviceSubmit}>
          <ModalBody>
            <FormGroup>
              <Label className="fw-bold">
                <i className="bi bi-tag me-2"></i>Device Name
              </Label>
              <Input
                type="text"
                value={deviceForm.name}
                onChange={(e) =>
                  setDeviceForm({ ...deviceForm, name: e.target.value })
                }
                required
              />
            </FormGroup>
            {!editingItem && (
              <FormGroup>
                <Label className="fw-bold">
                  <i className="bi bi-upc-scan me-2"></i>Serial Number
                </Label>
                <Input
                  type="text"
                  value={deviceForm.serialNumber}
                  onChange={(e) =>
                    setDeviceForm({
                      ...deviceForm,
                      serialNumber: e.target.value,
                    })
                  }
                  required
                />
              </FormGroup>
            )}
            <FormGroup>
              <Label className="fw-bold">
                <i className="bi bi-folder me-2"></i>Category
              </Label>
              <Input
                type="text"
                value={deviceForm.category}
                onChange={(e) =>
                  setDeviceForm({ ...deviceForm, category: e.target.value })
                }
                required
              />
            </FormGroup>
            <FormGroup>
              <Label className="fw-bold">
                <i className="bi bi-info-circle me-2"></i>Status
              </Label>
              <Input
                type="select"
                value={deviceForm.status}
                onChange={(e) =>
                  setDeviceForm({ ...deviceForm, status: e.target.value })
                }
              >
                <option value="Available">Available</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Damaged">Damaged</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label className="fw-bold">
                <i className="bi bi-geo-alt me-2"></i>Location
              </Label>
              <Input
                type="text"
                value={deviceForm.location}
                onChange={(e) =>
                  setDeviceForm({ ...deviceForm, location: e.target.value })
                }
                placeholder="Enter location text (optional)"
              />
              <div className="mt-2">
                <Button
                  color="danger"
                  size="sm"
                  onClick={handleShareLocation}
                  disabled={!lat || !lng}
                  type="button"
                >
                  <i className="bi bi-geo-alt me-2"></i>
                  SHARE LOCATION
                </Button>
                {deviceForm.lat && deviceForm.lng && (
                  <span className="ms-2 text-success">
                    <i className="bi bi-check-circle me-1"></i>
                    Location saved ({deviceForm.lat.toFixed(6)}, {deviceForm.lng.toFixed(6)})
                  </span>
                )}
              </div>
            </FormGroup>
            <FormGroup>
              <Label className="fw-bold">
                <i className="bi bi-file-text me-2"></i>Description
              </Label>
              <Input
                type="textarea"
                value={deviceForm.description}
                onChange={(e) =>
                  setDeviceForm({ ...deviceForm, description: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label className="fw-bold">
                <i className="bi bi-image me-2"></i>Image URL
              </Label>
              <Input
                type="text"
                value={deviceForm.image}
                onChange={(e) =>
                  setDeviceForm({ ...deviceForm, image: e.target.value })
                }
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" className="btn-gradient" type="submit">
              <i className="bi bi-check-circle me-2"></i>Save
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                setShowDeviceModal(false);
                resetDeviceForm();
              }}
            >
              <i className="bi bi-x-circle me-2"></i>Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Borrowing Modal */}
      <Modal
        isOpen={showBorrowingModal}
        toggle={() => {
          setShowBorrowingModal(false);
          setEditingItem(null);
          resetBorrowingForm();
        }}
      >
        <ModalHeader toggle={() => {
          setShowBorrowingModal(false);
          setEditingItem(null);
          resetBorrowingForm();
        }}>
          Update Borrowing Status
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label className="fw-bold">
              <i className="bi bi-info-circle me-2"></i>Status
            </Label>
            <Input
              type="select"
              value={borrowingForm.status}
              onChange={(e) =>
                setBorrowingForm({ ...borrowingForm, status: e.target.value })
              }
            >
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Returned">Returned</option>
              <option value="Overdue">Overdue</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label className="fw-bold">
              <i className="bi bi-clipboard-check me-2"></i>Device Condition After Return
            </Label>
            <Input
              type="textarea"
              value={borrowingForm.conditionAfter}
              onChange={(e) =>
                setBorrowingForm({
                  ...borrowingForm,
                  conditionAfter: e.target.value,
                })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label className="fw-bold">
              <i className="bi bi-currency-dollar me-2"></i>Fine (OMR)
            </Label>
            <Input
              type="number"
              value={borrowingForm.fine}
              onChange={(e) =>
                setBorrowingForm({
                  ...borrowingForm,
                  fine: parseFloat(e.target.value),
                })
              }
              min="0"
            />
          </FormGroup>
          <FormGroup>
            <Label className="fw-bold">
              <i className="bi bi-sticky me-2"></i>Notes
            </Label>
            <Input
              type="textarea"
              value={borrowingForm.notes}
              onChange={(e) =>
                setBorrowingForm({ ...borrowingForm, notes: e.target.value })
              }
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" className="btn-gradient" onClick={handleBorrowingUpdate}>
            <i className="bi bi-check-circle me-2"></i>Save
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setShowBorrowingModal(false);
              resetBorrowingForm();
              setEditingItem(null);
            }}
          >
            <i className="bi bi-x-circle me-2"></i>Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* User Modal */}
      <Modal isOpen={showUserModal} toggle={() => setShowUserModal(false)}>
        <ModalHeader toggle={() => setShowUserModal(false)}>
          Edit User
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label className="fw-bold">
              <i className="bi bi-person-badge me-2"></i>Username
            </Label>
            <Input
              type="text"
              value={userForm.username}
              onChange={(e) =>
                setUserForm({ ...userForm, username: e.target.value })
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="fw-bold">
              <i className="bi bi-envelope me-2"></i>Email Address
            </Label>
            <Input
              type="email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="fw-bold">
              <i className="bi bi-shield-check me-2"></i>Role
            </Label>
            <Input
              type="select"
              value={userForm.role}
              onChange={(e) =>
                setUserForm({ ...userForm, role: e.target.value })
              }
            >
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label className="fw-bold">
              <i className="bi bi-info-circle me-2"></i>Status
            </Label>
            <Input
              type="select"
              value={userForm.status}
              onChange={(e) =>
                setUserForm({ ...userForm, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" className="btn-gradient" onClick={handleUserUpdate}>
            <i className="bi bi-check-circle me-2"></i>Save
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setShowUserModal(false);
              resetUserForm();
            }}
          >
            <i className="bi bi-x-circle me-2"></i>Cancel
          </Button>
        </ModalFooter>
      </Modal>
      </div>
    </Container>
  );
};

export default AdminDashboard;

