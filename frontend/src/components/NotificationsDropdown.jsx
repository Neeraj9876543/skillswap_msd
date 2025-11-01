import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaBell } from "react-icons/fa";
const NotificationsDropdown = ({
  isOpen,
  onClose,
  notifications = [],
  onAccept,
  onMarkRead,
  loadingById = {},
}) => {
  if (!isOpen) return null;
  const hasItems = Array.isArray(notifications) && notifications.length > 0;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="p-3 border-b border-gray-200 bg-indigo-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-700">
              <FaBell size={14} />
              <h3 className="font-medium">Notifications</h3>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg" aria-label="Close">×</button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {!hasItems ? (
              <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
            ) : (
              <ul>
                {notifications.map((n) => {
                  const senderDisplay =
                    (n?.sender && (n?.sender?.name || n?.sender?.email)) ||
                    n?.meta?.senderName ||
                    n?.meta?.senderEmail ||
                    "Unknown";
                  const isUnread = !n.read;
                  const canAccept = n.type === "request" && !(n.meta && n.meta.accepted);
                  const isLoading = loadingById[n._id];
                  return (
                    <li key={n._id} className={`border-b border-gray-100 last:border-0 ${isUnread ? "bg-blue-50" : "bg-white"}`}>
                      <div className="p-3 hover:bg-gray-50">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">{senderDisplay}</span> {n.message}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          {canAccept ? (
                            <button
                              onClick={() => onAccept(n)}
                              disabled={!!isLoading}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-white ${isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
                            >
                              <FaCheck size={10} /> {isLoading ? "Accepting..." : "Accept"}
                            </button>
                          ) : (
                            n.type === "request" && n.meta?.accepted && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                Accepted
                              </span>
                            )
                          )}
                          {isUnread && (
                            <button
                              onClick={() => onMarkRead(n)}
                              className="ml-auto text-xs text-indigo-600 hover:text-indigo-700"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default NotificationsDropdown;
