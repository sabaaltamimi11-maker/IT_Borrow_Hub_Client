import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Badge,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { fetchUserBorrowings } from "../redux/reducers/borrowingReducer";
import axios from "axios";

const PaymentPage = () => {
  const { borrowingId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const userBorrowings = useSelector((state) => state.borrowings.userBorrowings);
  const [borrowing, setBorrowing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadBorrowing();
  }, [borrowingId, user]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserBorrowings(user._id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (userBorrowings.length > 0) {
      const foundBorrowing = userBorrowings.find((b) => b._id === borrowingId);
      if (!foundBorrowing) {
        setError("Borrowing record not found");
        setLoading(false);
        return;
      }
      if (foundBorrowing.fine <= 0) {
        setError("No fine to pay for this borrowing");
        setLoading(false);
        return;
      }
      if (foundBorrowing.paymentStatus === "Paid") {
        setError("This fine has already been paid");
        setLoading(false);
        return;
      }
      setBorrowing(foundBorrowing);
      setLoading(false);
    }
  }, [userBorrowings, borrowingId]);

  const loadBorrowing = async () => {
    try {
      await dispatch(fetchUserBorrowings(user._id));
    } catch (error) {
      console.error("Error loading borrowing:", error);
      setError("Error loading borrowing information");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    try {
      const paymentData = {
        paymentMethod,
        cardNumber: paymentMethod === "card" ? cardNumber : "",
        cardName: paymentMethod === "card" ? cardName : "",
        expiryDate: paymentMethod === "card" ? expiryDate : "",
        cvv: paymentMethod === "card" ? cvv : "",
      };

      await axios.post(`https://it-borrowing-system.onrender.com/payFine/${borrowingId}`, paymentData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/borrowings");
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.response?.data?.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center py-5">
          <div className="loading-spinner"></div>
          <p className="text-muted mt-3">Loading payment information...</p>
        </div>
      </Container>
    );
  }

  if (!borrowing) {
    return (
      <Container className="mt-4">
        <Alert color="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error || "Borrowing record not found"}
        </Alert>
      </Container>
    );
  }

  // Get device name
  const deviceName =
    (borrowing.device && Array.isArray(borrowing.device) && borrowing.device.length > 0
      ? borrowing.device[0].name
      : borrowing.deviceId && typeof borrowing.deviceId === "object" && borrowing.deviceId.name
      ? borrowing.deviceId.name
      : "Unknown Device") || "Unknown Device";

  return (
    <Container className="mt-4">
      <div className="page-container">
        <Card className="modern-card">
          <CardBody>
            <CardTitle tag="h3" className="mb-4 fw-bold">
              <i className="bi bi-credit-card me-2"></i>Payment for Fine
            </CardTitle>

            {success ? (
              <Alert color="success" className="text-center">
                <i className="bi bi-check-circle me-2" style={{ fontSize: "2rem" }}></i>
                <h5>Payment Successful!</h5>
                <p>Your payment has been processed successfully. You will be redirected shortly.</p>
              </Alert>
            ) : (
              <>
                <div className="mb-4 p-3" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
                  <h5 className="mb-3">Payment Details</h5>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <strong>Device:</strong> {deviceName}
                    </div>
                    <div className="col-md-6 mb-2">
                      <strong>Borrow Date:</strong>{" "}
                      {new Date(borrowing.borrowDate).toLocaleDateString()}
                    </div>
                    <div className="col-md-6 mb-2">
                      <strong>Return Date:</strong>{" "}
                      {new Date(borrowing.returnDate).toLocaleDateString()}
                    </div>
                    <div className="col-md-6 mb-2">
                      <strong>Status:</strong>{" "}
                      <Badge color="warning">{borrowing.status}</Badge>
                    </div>
                    <div className="col-12 mt-2">
                      <h4 className="text-danger fw-bold">
                        <i className="bi bi-currency-exchange me-2"></i>
                        Total Fine: {borrowing.fine} OMR
                      </h4>
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert color="danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label className="fw-bold">Payment Method</Label>
                    <Input
                      type="select"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="modern-input"
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="cash">Cash Payment</option>
                    </Input>
                  </FormGroup>

                  {paymentMethod === "card" && (
                    <>
                      <FormGroup>
                        <Label className="fw-bold">Card Number</Label>
                        <Input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                          placeholder="1234 5678 9012 3456"
                          maxLength="16"
                          required
                          className="modern-input"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label className="fw-bold">Cardholder Name</Label>
                        <Input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Riham Ali"
                          required
                          className="modern-input"
                        />
                      </FormGroup>
                      <div className="row">
                        <div className="col-md-6">
                          <FormGroup>
                            <Label className="fw-bold">Expiry Date</Label>
                            <Input
                              type="text"
                              value={expiryDate}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "");
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + "/" + value.slice(2, 4);
                                }
                                setExpiryDate(value);
                              }}
                              placeholder="MM/YY"
                              maxLength="5"
                              required
                              className="modern-input"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-6">
                          <FormGroup>
                            <Label className="fw-bold">CVV</Label>
                            <Input
                              type="text"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                              placeholder="123"
                              maxLength="3"
                              required
                              className="modern-input"
                            />
                          </FormGroup>
                        </div>
                      </div>
                    </>
                  )}

                  {paymentMethod === "cash" && (
                    <Alert color="info">
                      <i className="bi bi-info-circle me-2"></i>
                      Please visit the IT department to complete your cash payment.
                    </Alert>
                  )}

                  <div className="d-flex gap-2 mt-4">
                    <Button
                      type="submit"
                      color="success"
                      className="btn-gradient"
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Pay {borrowing.fine} OMR
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate("/borrowings")}
                      disabled={processing}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </Container>
  );
};

export default PaymentPage;

