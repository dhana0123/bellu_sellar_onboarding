// Database connection no longer needed with in-memory storage
// This file is kept for compatibility but exports nothing
export default function() {
  // No-op function since we're using in-memory storage
  return Promise.resolve();
}