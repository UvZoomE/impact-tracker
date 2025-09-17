// src/WarComments.jsx
import React, { useState, useEffect } from 'react';
import { RuxButton } from '@astrouxds/react'; // Adjust import
import StarRating from './StarRating'; // Adjust import

/**
 * @typedef {Object} Comment
 * @property {string} [_id]
 * @property {string} [author]
 * @property {string | Date} date
 * @property {number} rating
 * @property {string} text
 */

/**
 * @typedef {Object} WarViewer
 * @property {Comment[]} [comments]
 */

/**
 * @param {Object} props
 * @param {WarViewer} props.warViewer
 */
const WarComments = ({ warViewer }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  useEffect(() => {
    const comments = warViewer.comments || [];
    const maxPage = Math.ceil(comments.length / commentsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    } else if (maxPage === 0) {
      setCurrentPage(1);
    }
  }, [warViewer.comments, currentPage, commentsPerPage]);

  return warViewer.comments?.length > 0 ? (
    <div className="war-comments-section">
      <h4>Comments</h4>
      <ul className="comments-list">
        {warViewer.comments
          .slice(
            (currentPage - 1) * commentsPerPage,
            currentPage * commentsPerPage
          )
          .map((comment, index) => (
            <li key={comment._id || index} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">
                  {comment.author || 'Anonymous'}
                </span>
                <span className="comment-date">
                  {new Date(comment.date).toLocaleDateString()}
                </span>
              </div>
              <StarRating rating={comment.rating} size="small" />
              <p className="comment-text">{comment.text}</p>
              <hr className="comment-divider" />
            </li>
          ))}
      </ul>
      <div className="pagination">
        <RuxButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          secondary
        >
          Previous
        </RuxButton>
        <span className="page-info">
          Page {currentPage} of{' '}
          {Math.ceil((warViewer.comments?.length || 0) / commentsPerPage)}
        </span>
        <RuxButton
          disabled={
            currentPage ===
            Math.ceil((warViewer.comments?.length || 0) / commentsPerPage)
          }
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(
                prev + 1,
                Math.ceil((warViewer.comments?.length || 0) / commentsPerPage)
              )
            )
          }
          secondary
        >
          Next
        </RuxButton>
      </div>
    </div>
  ) : (
    <p>No comments yet.</p>
  );
};

export default WarComments;