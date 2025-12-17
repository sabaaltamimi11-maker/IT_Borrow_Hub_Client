import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardText,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { likePost, dislikePost, updatePost, deletePost } from "../redux/reducers/postReducer";
import moment from "moment";

const PostComment = ({ post, onUpdate }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [editRating, setEditRating] = useState(post.rating);
  const [editImage, setEditImage] = useState(post.image || "");

  // Check if current user is the owner of the post
  const isOwner = user && (
    post.userId === user._id ||
    (post.user && post.user[0]?._id === user._id) ||
    (post.userId && typeof post.userId === "object" && post.userId.toString() === user._id.toString())
  );

  const handleLike = async () => {
    if (!user || !user._id) {
      alert("Please login to like posts");
      return;
    }
    try {
      const result = await dispatch(likePost({ id: post._id, userId: user._id })).unwrap();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Like error:", error);
      alert(error.response?.data?.message || error.message || "An error occurred while liking");
    }
  };

  const handleDislike = async () => {
    if (!user || !user._id) {
      alert("Please login to dislike posts");
      return;
    }
    try {
      const result = await dispatch(dislikePost({ id: post._id, userId: user._id })).unwrap();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Dislike error:", error);
      alert(error.response?.data?.message || error.message || "An error occurred while disliking");
    }
  };

  const handleEdit = () => {
    setEditText(post.text);
    setEditRating(post.rating);
    setEditImage(post.image || "");
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (!post || !post._id) {
      alert("Invalid post");
      return;
    }
    try {
      const result = await dispatch(updatePost({ id: post._id, postData: {
        text: editText,
        rating: editRating,
        image: editImage,
      }})).unwrap();
      setIsEditing(false);
      if (onUpdate) onUpdate();
      alert("Comment updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.message || error.message || "An error occurred while updating the comment");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const result = await dispatch(deletePost(post._id)).unwrap();
        if (onUpdate) onUpdate();
        alert("Comment deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        alert(error.response?.data?.message || "An error occurred while deleting the comment");
      }
    }
  };

  const isLiked = user && post.likes && post.likes.some(likeId => 
    likeId.toString() === user._id.toString()
  );
  const isDisliked = user && post.dislikes && post.dislikes.some(dislikeId => 
    dislikeId.toString() === user._id.toString()
  );

  // Get username from post.user array or post.userId, fallback to email
  const username =
    (post.user && Array.isArray(post.user) && post.user.length > 0 && post.user[0]?.username) ||
    (post.user && typeof post.user === "object" && !Array.isArray(post.user) && post.user.username) ||
    (post.userId && typeof post.userId === "object" && post.userId.username) ||
    (post.user && Array.isArray(post.user) && post.user.length > 0 && post.user[0]?.email) ||
    (post.userId && typeof post.userId === "object" && post.userId.email) ||
    "Unknown User";

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? "#ffc107" : "#e0e0e0" }}>
          ⭐
        </span>
      );
    }
    return stars;
  };

  return (
    <>
      <Card className="modern-card mb-3">
        <CardBody>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-person-circle me-2" style={{ fontSize: "1.5rem", color: "#667eea" }}></i>
                <strong>{username}</strong>
                {isOwner && (
                  <Badge color="info" className="ms-2" style={{ fontSize: "0.7rem" }}>
                    You
                  </Badge>
                )}
              </div>
              <small className="text-muted">
                <i className="bi bi-calendar me-1"></i>
                {moment(post.createdAt).fromNow()}
              </small>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Badge color="warning" className="status-badge">
                {renderStars(post.rating)}
              </Badge>
              {isOwner && (
                <div className="d-flex gap-1">
                  <Button
                    color="link"
                    size="sm"
                    onClick={handleEdit}
                    style={{ padding: "0.25rem 0.5rem" }}
                    title="Edit comment"
                  >
                    <i className="bi bi-pencil text-primary"></i>
                  </Button>
                  <Button
                    color="link"
                    size="sm"
                    onClick={handleDelete}
                    style={{ padding: "0.25rem 0.5rem" }}
                    title="Delete comment"
                  >
                    <i className="bi bi-trash text-danger"></i>
                  </Button>
                </div>
              )}
            </div>
          </div>
          <CardText className="mb-3">
            {post.text}
            {post.lat && post.lng && (
              <>
                <br />
                <div className="mt-3">
                  <iframe
                    src={`https://maps.google.com/maps?q=${post.lat},${post.lng}&hl=en&output=embed`}
                    width="100%"
                    height="300"
                    style={{ border: "none", borderRadius: "8px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </>
            )}
          </CardText>
          {post.image && (
            <div className="mb-3">
              <img
                src={post.image}
                alt="Review"
                className="img-fluid rounded"
                style={{ maxHeight: "200px", width: "auto" }}
              />
            </div>
          )}
          <div className="d-flex gap-2">
            <Button
              color={isLiked ? "primary" : "outline-primary"}
              size="sm"
              onClick={handleLike}
              disabled={!user}
              className="d-flex align-items-center"
            >
              <i className="bi bi-hand-thumbs-up me-1"></i>
              {post.likes?.length || 0}
            </Button>
            <Button
              color={isDisliked ? "danger" : "outline-danger"}
              size="sm"
              onClick={handleDislike}
              disabled={!user}
              className="d-flex align-items-center"
            >
              <i className="bi bi-hand-thumbs-down me-1"></i>
              {post.dislikes?.length || 0}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={isEditing} toggle={() => setIsEditing(false)} centered>
        <ModalHeader toggle={() => setIsEditing(false)}>
          <i className="bi bi-pencil me-2"></i>Edit Comment
        </ModalHeader>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <ModalBody>
            <FormGroup>
              <Label className="fw-bold">Comment Text *</Label>
              <Input
                type="textarea"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={4}
                required
                className="modern-input"
              />
            </FormGroup>
            <FormGroup>
              <Label className="fw-bold">Rating *</Label>
              <Input
                type="select"
                value={editRating}
                onChange={(e) => setEditRating(Number(e.target.value))}
                required
                className="modern-input"
              >
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label className="fw-bold">Image URL (Optional)</Label>
              <Input
                type="text"
                value={editImage}
                onChange={(e) => setEditImage(e.target.value)}
                placeholder="Enter image URL"
                className="modern-input"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" className="btn-gradient" type="submit">
              <i className="bi bi-check-circle me-2"></i>Update
            </Button>
            <Button color="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default PostComment;
