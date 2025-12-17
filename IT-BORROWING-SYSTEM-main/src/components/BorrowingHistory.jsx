import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Table, Badge, Alert, Card, CardBody, Button } from "reactstrap";
import { fetchUserBorrowings } from "../redux/reducers/borrowingReducer";

const BorrowingHistory = () => {
  const user = useSelector((state) => state.auth.user);
  const userBorrowings = useSelector((state) => state.borrowings.userBorrowings);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadBorrowings();
    }
  }, [user]);

  const loadBorrowings = async () => {
    try {
      await dispatch(fetchUserBorrowings(user._id));
    } catch (error) {
      console.error("Error loading borrowings:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Active":
        return "info";
      case "Returned":
        return "success";
      case "Overdue":
        return "danger";
      default:
        return "secondary";
    }
  };

  if (!user) {
    return (
      <Container className="mt-4">
        <Alert color="warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Please login to view your borrowings
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="page-container">
        <h2 className="mb-4 fw-bold">
          <i className="bi bi-clock-history me-2"></i>
          My Borrowing History
        </h2>
        {userBorrowings.length > 0 ? (
          <Card className="modern-card">
            <CardBody className="p-0">
              <Table responsive hover className="mb-0">
                <thead style={{ background: "#f8f9fa" }}>
                  <tr>
                    <th className="px-4 py-3">Device Name</th>
                    <th className="px-4 py-3">Borrow Date</th>
                    <th className="px-4 py-3">Expected Return</th>
                    <th className="px-4 py-3">Actual Return</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Fine</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userBorrowings.map((borrowing) => {
                    // Get device name from various possible formats
                    let deviceName = "Not specified";
                    
                    // Debug logging
                    if (borrowing._id === userBorrowings[0]?._id) {
                      console.log("First borrowing full data:", borrowing);
                      console.log("Device array:", borrowing.device);
                      console.log("DeviceId:", borrowing.deviceId);
                    }
                    
                    // Check if device is an array (most common case)
                    if (borrowing.device && Array.isArray(borrowing.device) && borrowing.device.length > 0) {
                      const deviceObj = borrowing.device[0];
                      deviceName = deviceObj?.name || deviceObj?.deviceName || "Not specified";
                    } 
                    // Check if device is a single object (not array)
                    else if (borrowing.device && typeof borrowing.device === 'object' && !Array.isArray(borrowing.device)) {
                      deviceName = borrowing.device.name || borrowing.device.deviceName || "Not specified";
                    }
                    // Check deviceId directly (populated object)
                    else if (borrowing.deviceId && typeof borrowing.deviceId === 'object' && borrowing.deviceId.name) {
                      deviceName = borrowing.deviceId.name;
                    }
                    
                    return (
                    <tr key={borrowing._id}>
                      <td className="px-4 py-3">
                        <strong>{deviceName}</strong>
                      </td>
                      <td className="px-4 py-3">
                        {new Date(borrowing.borrowDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(borrowing.returnDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {borrowing.actualReturnDate
                          ? new Date(borrowing.actualReturnDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          color={getStatusColor(borrowing.status)}
                          className="status-badge"
                        >
                          {borrowing.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {borrowing.fine > 0 ? (
                          <span className="text-danger fw-bold">
                            {borrowing.fine} OMR
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {borrowing.fine > 0 && borrowing.paymentStatus !== "Paid" && (
                          <Button
                            color="success"
                            size="sm"
                            onClick={() => navigate(`/payment/${borrowing._id}`)}
                            className="btn-gradient"
                          >
                            <i className="bi bi-credit-card me-1"></i>
                            Pay Fine
                          </Button>
                        )}
                        {borrowing.paymentStatus === "Paid" && (
                          <Badge color="success">
                            <i className="bi bi-check-circle me-1"></i>Paid
                          </Badge>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        ) : (
          <Card className="modern-card">
            <CardBody className="text-center py-5">
              <i className="bi bi-inbox" style={{ fontSize: "4rem", color: "#ccc" }}></i>
              <p className="text-muted mt-3">No borrowings found</p>
            </CardBody>
          </Card>
        )}
      </div>
    </Container>
  );
};

export default BorrowingHistory;

