import React, { useState, useEffect } from "react";
import { RuxButton, RuxIcon } from "@astrouxds/react";
import "./css/WarComments.css";

// --- Helpers ---
const displayedName = (userName) => {
  if (!userName) return "Anonymous";
  return userName.split("@")[0];
};

const relativeDate = (date) => {
  if (!date) return "Just now";
  const now = new Date();
  const commentDate = new Date(date);
  const diffTime = now - commentDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

// --- Recursive Comment Item Component ---
const CommentItem = ({ comment, onReplySubmit }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmit = () => {
    if (replyText.trim()) {
      onReplySubmit(comment._id, replyText);
      setIsReplying(false);
      setReplyText("");
    }
  };

  return (
    <div className="comment-thread">
      <div className="comment-item">
        <div className="comment-avatar-container">
          <RuxIcon icon="person" size="small" className="comment-user-icon" />
        </div>
        <div className="comment-content">
          <div className="comment-meta">
            <span className="comment-author">
              {displayedName(comment.user || comment.author)}
            </span>
            <span className="meta-separator">&bull;</span>
            <span className="comment-date">{relativeDate(comment.date)}</span>
          </div>
          <div className="comment-body">
            <p>{comment.text}</p>
          </div>
          <div className="comment-actions">
            <div className="comment-actions-left">
              <RuxIcon
                icon="thumb-up"
                size="extra-small"
                className="action-icon"
                title="Like"
              />
              <RuxIcon
                icon="thumb-down"
                size="extra-small"
                className="action-icon"
                title="Dislike"
              />
            </div>
            <span
              className="reply-link"
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </span>
          </div>

          {/* Reply Form */}
          {isReplying && (
            <div className="reply-form">
              <textarea
                className="reply-textarea"
                placeholder="What are your thoughts?"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                autoFocus
              />
              <div className="reply-form-actions">
                <div className="reply-buttons-right">
                  <RuxButton
                    secondary
                    size="small"
                    onClick={() => setIsReplying(false)}
                  >
                    Cancel
                  </RuxButton>
                  <RuxButton size="small" onClick={handleSubmit}>
                    Submit
                  </RuxButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recursive Rendering for Nested Comments (Reddit Cascade) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="nested-comments">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Container ---
const WarComments = ({ warViewer }) => {
  const [localComments, setLocalComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  // Initialize local state from props
  useEffect(() => {
    if (warViewer?.comments) {
      // Ensure comments have a 'replies' array if missing
      const formattedComments = warViewer.comments.map((c) => ({
        ...c,
        replies: c.replies || [],
      }));
      setLocalComments(formattedComments);
    } else {
      setLocalComments([]);
    }
    setCurrentPage(1);
  }, [warViewer]);

  // Add Reply Handler (Recursive)
  const handleReplySubmit = (parentId, text) => {
    const newReply = {
      _id: Date.now().toString(), // Temp ID
      user: "You@CurrentSession", // Mock User
      date: new Date().toISOString(),
      text: text,
      replies: [],
    };

    const addReplyToTree = (nodes) => {
      return nodes.map((node) => {
        if (node._id === parentId) {
          return { ...node, replies: [...(node.replies || []), newReply] };
        } else if (node.replies && node.replies.length > 0) {
          return { ...node, replies: addReplyToTree(node.replies) };
        }
        return node;
      });
    };

    setLocalComments((prev) => addReplyToTree(prev));
  };

  // Helper to count total comments including nested ones
  const countTotalComments = (nodes) => {
    let count = 0;
    nodes.forEach((node) => {
      count++;
      if (node.replies) count += countTotalComments(node.replies);
    });
    return count;
  };

  const totalCommentsCount = countTotalComments(localComments);
  const totalPages = Math.ceil(localComments.length / commentsPerPage);

  // Pagination (Applies to Root Level Comments only)
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentRootComments = localComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (!localComments.length) {
    return (
      <div className="war-comments-section empty">
        <p>No comments yet.</p>
      </div>
    );
  }

  return (
    <div className="war-comments-section">
      <div className="comments-header">
        <h3>
          Comments <span className="comment-count">({totalCommentsCount})</span>
        </h3>
      </div>

      <div className="comments-list">
        {currentRootComments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onReplySubmit={handleReplySubmit}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <RuxButton
            disabled={currentPage === 1}
            onClick={handlePrev}
            secondary
            size="small"
          >
            Previous
          </RuxButton>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <RuxButton
            disabled={currentPage === totalPages}
            onClick={handleNext}
            secondary
            size="small"
          >
            Next
          </RuxButton>
        </div>
      )}
    </div>
  );
};

export default WarComments;
