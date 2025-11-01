import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaPhone, FaVideo, FaPlus, FaImage, FaFileAlt, FaEllipsisV, FaBell, FaBellSlash, FaFlag, FaUserSlash, FaTrash } from "react-icons/fa";
import { notificationsAPI, messagesAPI } from "../utils/api";
import Swal from 'sweetalert2';

const dummyConversations = [
  { id: 1, name: "Sarah Chen", lastMessage: "See you tomorrow!", img: "https://i.pravatar.cc/150?img=47" },
  { id: 2, name: "Alex Rodriguez", lastMessage: "Thanks for the help!", img: "https://i.pravatar.cc/150?img=32" },
  { id: 3, name: "Maria Santos", lastMessage: "Let’s start at 5pm.", img: "https://i.pravatar.cc/150?img=14" },
  { id: 4, name: "David Kim", lastMessage: "Got the files.", img: "https://i.pravatar.cc/150?img=55" },
];

function Messages() {
  const location = useLocation();
  const navigate = useNavigate();
  const { code: routeCode } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const initialRecipient = location?.state?.recipient || null;
  const storedChatRaw = typeof window !== 'undefined' ? localStorage.getItem("lastChatRecipient") : null;
  const storedChat = storedChatRaw ? (() => { try { return JSON.parse(storedChatRaw); } catch { return null; } })() : null;

  const [selectedChat, setSelectedChat] = useState(
    initialRecipient
      ? {
          id: initialRecipient.id || `temp-${Date.now()}`,
          name: initialRecipient.name || "Chat",
          lastMessage: "",
          img: initialRecipient.avatar || "https://i.pravatar.cc/150?img=1",
        }
      : null
  );

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const docInputRef = useRef(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [serverConversations, setServerConversations] = useState([]);
  const [unreadBySender, setUnreadBySender] = useState({});
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [incomingVideoCall, setIncomingVideoCall] = useState(null);
  const [outgoingVideoCall, setOutgoingVideoCall] = useState(null);
  const optionsRef = useRef(null);

  // Close options when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowChatOptions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeleteChat = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Delete Chat',
      text: 'Are you sure you want to delete this chat? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (isConfirmed) {
      try {
        // Replace with your actual API call to delete the chat
        // await messagesAPI.deleteChat(selectedChat.id);
        
        // Show a temporary message before removing the chat
        // Update the UI by removing the conversation
        setServerConversations(prev => prev.filter(c => c.id !== selectedChat.id));
        setSelectedChat(null);
        
        // Show generic success message in the UI
        const messageContainer = document.createElement('div');
        messageContainer.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50';
        messageContainer.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Chat deleted successfully</span>
        `;
        
        document.body.appendChild(messageContainer);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
          messageContainer.style.transition = 'opacity 0.5s';
          messageContainer.style.opacity = '0';
          setTimeout(() => {
            if (document.body.contains(messageContainer)) {
              document.body.removeChild(messageContainer);
            }
          }, 500);
        }, 3000);
        
      } catch (error) {
        console.error('Error deleting chat:', error);
        await Swal.fire({
          title: 'Error',
          text: 'Failed to delete chat. Please try again.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
        });
      }
    }
  };

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const resp = await messagesAPI.conversations();
        const list = Array.isArray(resp?.conversations) ? resp.conversations : [];
        setServerConversations(list);
      } catch (_) {}
    };

    const handleAcceptIncomingCall = async () => {
      if (!incomingCall) return;
      const url = incomingCall.room;
      try { window.open(url, "_blank", "noopener,noreferrer"); } catch (_) {}
      try {
        await notificationsAPI.markRead(incomingCall.id);
        try { window.dispatchEvent(new Event('notifications:update')); } catch (_) {}
      } catch (_) {}
      setIncomingCall(null);
    };

    const handleDeclineIncomingCall = async () => {
      if (!incomingCall) return;
      try {
        await notificationsAPI.markRead(incomingCall.id);
        try { window.dispatchEvent(new Event('notifications:update')); } catch (_) {}
      } catch (_) {}
      setIncomingCall(null);
    };

    loadConversations();
    const id = setInterval(loadConversations, 15000);
    return () => clearInterval(id);
  }, [selectedChat?.id]);

  // Track loading state to prevent multiple simultaneous requests
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  
  useEffect(() => {
    let timerId;
    let isMounted = true;
    
    const loadUnread = async () => {
      // Prevent multiple simultaneous requests and rate limit to once per second
      if (isLoading || (Date.now() - lastFetchTime < 1000)) return;
      
      setIsLoading(true);
      setLastFetchTime(Date.now());
      
      try {
        const resp = await notificationsAPI.list();
        if (!isMounted) return;
        
        const all = Array.isArray(resp?.notifications) ? resp.notifications : [];
        const map = {};
        const currentUser = JSON.parse(localStorage.getItem("skillSwapUser"));
        const readPromises = [];
        
        // Reset error count on successful fetch
        setErrorCount(0);
        
        for (const n of all) {
          if (!n || !n.sender || !n.sender._id) continue;
          
          // Count unread messages
          if (n.type === "message" && !n.read) {
            const sid = String(n.sender._id);
            map[sid] = (map[sid] || 0) + 1;
          }
          
          // Handle video call requests
          if (n.type === 'message' && n.meta?.kind === 'video_call_request' && !n.read) {
            const isForCurrentUser = String(n.receiverUserId) === String(currentUser?._id);
            
            if (isForCurrentUser && !incomingVideoCall) {
              const callData = {
                from: n.sender._id,
                fromName: n.sender.username || 'User',
                room: n.meta?.room,
                callType: n.meta?.callType || 'video',
                notificationId: n._id,
                callId: n.meta?.callId || Date.now().toString()
              };
              
              setIncomingVideoCall(callData);
              
              // Play ringtone
              const audio = new Audio('/notification.mp3');
              audio.loop = true;
              audio.play().catch(e => console.log('Audio play failed:', e));
              
              // Stop after 30 seconds if not answered
              const timeout = setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
                if (incomingVideoCall?.notificationId === n._id) {
                  setIncomingVideoCall(null);
                }
              }, 30000);
              
              return () => {
                audio.pause();
                audio.currentTime = 0;
                clearTimeout(timeout);
              };
            }
          }
          
          // Handle call responses
          if (n.type === 'message' && n.meta && 
              ['call_accepted', 'call_declined', 'call_cancelled'].includes(n.meta.kind)) {
            
            const isForCurrentUser = String(n.receiverUserId) === String(currentUser?._id);
            const isFromOutgoingCall = outgoingVideoCall && String(n.sender._id) === String(outgoingVideoCall.to);
            const shouldProcess = isForCurrentUser && (isFromOutgoingCall || n.meta.kind === 'call_cancelled');
            
            if (shouldProcess) {
              // Mark notification as read in background
              if (n._id && !n.read) {
                readPromises.push(
                  notificationsAPI.markRead(n._id)
                    .catch(e => console.error('Error marking notification as read:', e))
                );
              }
              
              if (n.meta.kind === 'call_accepted') {
                // Open the call when accepted
                if (n.meta?.room) {
                  window.open(n.meta.room, "_blank", "noopener,noreferrer");
                }
                // Show call accepted message
                Swal.fire({
                  title: 'Call Accepted',
                  text: `${n.sender.username || 'The user'} accepted your video call`,
                  icon: 'success',
                  timer: 3000,
                  showConfirmButton: false
                });
                setOutgoingVideoCall(null);
              } else if (n.meta.kind === 'call_declined') {
                // Show call declined message
                Swal.fire({
                  title: 'Call Declined',
                  text: `${n.sender.username || 'The user'} declined your video call`,
                  icon: 'info',
                  timer: 3000,
                  showConfirmButton: false
                });
                setOutgoingVideoCall(null);
              } else if (n.meta.kind === 'call_cancelled') {
                // Show call cancelled message if we have an incoming call from this user
                if (incomingVideoCall?.from === n.sender._id) {
                  Swal.fire({
                    title: 'Call Cancelled',
                    text: `${n.sender.username || 'The user'} cancelled the video call`,
                    icon: 'info',
                    timer: 3000,
                    showConfirmButton: false
                  });
                  setIncomingVideoCall(null);
                }
              }
            }
          }
        }
        
        setUnreadBySender(map);
        
        // Process any read promises in the background
        if (readPromises.length > 0) {
          Promise.all(readPromises)
            .then(() => {
              if (isMounted) {
                window.dispatchEvent(new Event('notifications:update'));
              }
            })
            .catch(e => console.error('Error processing read notifications:', e));
        }
        
      } catch (error) {
        console.error('Error loading notifications:', error);
        // Increment error count and implement exponential backoff
        const newErrorCount = errorCount + 1;
        setErrorCount(newErrorCount);
        
        // If we have multiple consecutive errors, increase the retry delay
        if (newErrorCount > 3) {
          console.warn(`Multiple errors (${newErrorCount}), backing off...`);
          // Add a delay before next retry (exponential backoff, max 30s)
          const backoffDelay = Math.min(1000 * Math.pow(2, newErrorCount - 3), 30000);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Initial load
    loadUnread();
    
    // Set up polling with error-based backoff
    const pollInterval = errorCount > 3 ? 30000 : 10000; // 30s on error, 10s normal
    timerId = setInterval(loadUnread, pollInterval);
    
    // Set up event listener for manual refresh
    const onNotifUpdate = () => loadUnread();
    window.addEventListener("notifications:update", onNotifUpdate);
    
    return () => {
      isMounted = false;
      if (timerId) clearInterval(timerId);
      try {
        window.removeEventListener("notifications:update", onNotifUpdate);
      } catch (_) {}
    };
  }, [selectedChat?.id, incomingVideoCall, outgoingVideoCall, isLoading, lastFetchTime, errorCount]);

  const conversations = useMemo(() => {
    // Start with server conversations or fallback to dummy data
    const base = (serverConversations && serverConversations.length > 0) 
      ? serverConversations 
      : dummyConversations;
    
    // Add initial recipient if it doesn't exist
    const seed = initialRecipient || storedChat;
    let result = [...base];
    
    if (seed?.id && !result.some(c => String(c.id) === String(seed.id))) {
      result = [
        {
          id: seed.id || `temp-${Date.now()}`,
          name: seed.name || "Chat",
          lastMessage: "",
          img: seed.avatar || "https://i.pravatar.cc/150?img=1",
        },
        ...result,
      ];
    }
    
    // Apply search filter if there's a query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(conv => 
        conv.name.toLowerCase().includes(query) ||
        (conv.lastMessage && conv.lastMessage.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [serverConversations, initialRecipient, storedChat, searchQuery]);

  const isValidObjectId = (v) => typeof v === 'string' && /^[a-fA-F0-9]{24}$/.test(v);

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const parseAttachmentText = (text) => {
    if (typeof text !== 'string') return null;
    const withFiles = text.match(/^Shared\s+(photo|video|document)s?\s*:\s*(.+)$/i);
    const noFiles = text.match(/^Shared\s+(photo|video|document)s?$/i);
    const m = withFiles || noFiles;
    if (!m) return null;
    const type = m[1]?.toLowerCase();
    let files = [];
    if (withFiles && withFiles[2]) {
      files = withFiles[2].split(',').map((s) => s.trim()).filter(Boolean);
    }
    return { kind: 'attachment', attachmentType: type, files };
  };

  const appendAttachmentNote = async (type, files) => {
    const fileArr = Array.from(files || []);
    if (selectedChat?.id && isValidObjectId(String(selectedChat.id))) {
      try {
        const fd = new FormData();
        fd.append('to', String(selectedChat.id));
        fd.append('type', String(type));
        for (const f of fileArr) fd.append('files', f);
        const resp = await messagesAPI.upload(fd);
        const saved = resp?.message;
        setMessages((prev) => {
          if (!saved) return prev;
          const base = {
            id: saved._id,
            sender: 'me',
            text: saved.text,
            at: saved.createdAt,
            attachmentType: saved.attachmentType,
            attachments: Array.isArray(saved.attachments) ? saved.attachments : [],
          };
          const parsed = parseAttachmentText(base.text);
          const filesFromBackend = (base.attachments || []).map((a) => a.originalName).filter(Boolean);
          const enriched = parsed ? { ...base, ...parsed } : base;
          if (filesFromBackend.length) enriched.files = filesFromBackend;
          if (enriched.attachmentType) enriched.kind = 'attachment';
          return [...prev, enriched];
        });
        try {
          await notificationsAPI.create({
            receiverUserId: String(selectedChat.id),
            type: 'message',
            message: saved?.text || 'Shared attachment',
            meta: { fromChat: true, attachment: type },
          });
        } catch (_) {}
      } catch (_) {
        const names = fileArr.map((f) => f.name);
        const plural = names.length > 1 ? 's' : '';
        const textToSend = names.length ? `Shared ${type}${plural}: ${names.join(', ')}` : `Shared ${type}`;
        setMessages((prev) => {
          const base = { sender: 'me', text: textToSend, at: new Date().toISOString(), kind: 'attachment', attachmentType: type, files: names };
          return [...prev, base];
        });
      }
    } else {
      const names = fileArr.map((f) => f.name);
      const plural = names.length > 1 ? 's' : '';
      const textToSend = names.length ? `Shared ${type}${plural}: ${names.join(', ')}` : `Shared ${type}`;
      setMessages((prev) => {
        const base = { sender: 'me', text: textToSend, at: new Date().toISOString(), kind: 'attachment', attachmentType: type, files: names };
        return [...prev, base];
      });
    }
  };

  const handlePickPhoto = () => photoInputRef.current && photoInputRef.current.click();
  const handlePickVideo = () => videoInputRef.current && videoInputRef.current.click();
  const handlePickDoc = () => docInputRef.current && docInputRef.current.click();

  const onPhotoSelected = async (e) => {
    const files = e.target.files;
    if (files && files.length) {
      await appendAttachmentNote("photo", files);
      e.target.value = "";
    }
    setAttachOpen(false);
  };
  const onVideoSelected = async (e) => {
    const files = e.target.files;
    if (files && files.length) {
      await appendAttachmentNote("video", files);
      e.target.value = "";
    }
    setAttachOpen(false);
  };
  const onDocSelected = async (e) => {
    const files = e.target.files;
    if (files && files.length) {
      await appendAttachmentNote("document", files);
      e.target.value = "";
    }
    setAttachOpen(false);
  };

  const getCallRoom = () => {
    if (routeCode) return String(routeCode);
    const byId = serverConversations.find((c) => String(c.id) === String(selectedChat?.id));
    if (byId?.code) return String(byId.code);
    return selectedChat?.id ? String(selectedChat.id) : "general";
  };

  const handleVideoCallClick = () => {
    const room = getCallRoom();
    const url = `https://meet.jit.si/SkillSwap-${encodeURIComponent(room)}?config.prejoinPageEnabled=false`;
    try { 
      window.open(url, "_blank", "noopener,noreferrer"); 
    } catch (error) {
      console.error('Error opening video call:', error);
      Swal.fire({
        title: 'Error',
        text: 'Could not start video call. Please try again.',
        icon: 'error'
      });
    }
  };
  
  const handleAcceptCall = async (callData) => {
    try {
      // Mark the notification as read
      if (callData.notificationId) {
        await notificationsAPI.markRead(callData.notificationId);
      }
      
      // Open the call URL
      if (callData.room) {
        window.open(callData.room, "_blank", "noopener,noreferrer");
      }
      
      // Clear the incoming call state
      setIncomingVideoCall(null);
      
      // Send call accepted notification
      await notificationsAPI.create({
        receiverUserId: callData.from,
        type: 'message',  // Using 'message' type as it's a valid enum in the schema
        message: 'Video call accepted',
        meta: { 
          kind: 'call_accepted',
          callType: 'video',
          room: callData.room,
          callId: callData.callId,
          from: JSON.parse(localStorage.getItem("skillSwapUser"))._id
        },
      });
      
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  };
  
  const handleDeclineCall = async (callData) => {
    try {
      // Mark the notification as read
      if (callData.notificationId) {
        await notificationsAPI.markRead(callData.notificationId);
      }
      
      // Send call declined notification
      await notificationsAPI.create({
        receiverUserId: callData.from,
        type: 'message',  // Using 'message' type as it's a valid enum in the schema
        message: 'Video call declined',
        meta: { 
          kind: 'call_declined',
          callType: 'video',
          callId: callData.callId,
          from: JSON.parse(localStorage.getItem("skillSwapUser"))._id
        },
      });
      
      // Clear the incoming call state
      setIncomingVideoCall(null);
      
    } catch (error) {
      console.error('Error declining call:', error);
    }
  };
  
  const handleCancelOutgoingCall = async () => {
    if (outgoingVideoCall) {
      // Send call cancelled notification
      try {
        await notificationsAPI.create({
          receiverUserId: outgoingVideoCall.to,
          type: 'message',  // Using 'message' type as it's a valid enum in the schema
          message: 'Video call cancelled',
          meta: { 
            kind: 'call_cancelled',
            callType: 'video',
            callId: outgoingVideoCall.callId,
            from: JSON.parse(localStorage.getItem("skillSwapUser"))._id
          },
        });
      } catch (error) {
        console.error('Error cancelling call:', error);
      }
      
      // Clear the outgoing call state
      setOutgoingVideoCall(null);
    }
  };

  const handleAudioCallClick = async () => {
    const room = getCallRoom();
    const url = `https://meet.jit.si/SkillSwap-${encodeURIComponent(room)}?config.startWithVideoMuted=true&config.prejoinPageEnabled=false`;
    try { window.open(url, "_blank", "noopener,noreferrer"); } catch (_) {}
    try {
      if (selectedChat?.id) {
        await notificationsAPI.create({
          receiverUserId: String(selectedChat.id),
          type: 'message',
          message: 'call',
          meta: { kind: 'call', callType: 'audio', room: url },
        });
        try { window.dispatchEvent(new Event('notifications:update')); } catch (_) {}
      }
    } catch (_) {}
  };

  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dateLabel = (iso) => {
    try {
      const d = new Date(iso);
      const today = startOfDay(new Date());
      const that = startOfDay(d);
      const diffDays = Math.round((today - that) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      return d.toLocaleDateString();
    } catch {
      return "";
    }
  };

  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time part for date comparison
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const compareToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const compareYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (compareDate.getTime() === compareToday.getTime()) {
      return 'Today';
    } else if (compareDate.getTime() === compareYesterday.getTime()) {
      return 'Yesterday';
    } else {
      // Format as 'Month Day, Year' (e.g., 'October 25, 2023')
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  };

  const groupedMessages = React.useMemo(() => {
    const groups = [];
    let currentLabel = null;
    
    // Sort messages by date (oldest first)
    const sortedMessages = [...messages].sort((a, b) => {
      const dateA = new Date(a.at || a.createdAt || new Date().toISOString());
      const dateB = new Date(b.at || b.createdAt || new Date().toISOString());
      return dateA - dateB;
    });

    for (const m of sortedMessages) {
      const messageDate = m.at || m.createdAt || new Date().toISOString();
      const lbl = formatDateLabel(messageDate);
      
      if (lbl !== currentLabel) {
        groups.push({ 
          label: lbl, 
          items: [m],
          date: new Date(messageDate)
        });
        currentLabel = lbl;
      } else {
        groups[groups.length - 1].items.push(m);
      }
    }
    
    return groups;
  }, [messages]);

  const emptyQuote = React.useMemo(() => ({
    q: "To teach is to communicate hope, curiosity, and understanding",
    a: "",
  }), []);

  useEffect(() => {
    if (initialRecipient) {
      setSelectedChat({
        id: initialRecipient.id || `temp-${Date.now()}`,
        name: initialRecipient.name || "Chat",
        lastMessage: "",
        img: initialRecipient.avatar || "https://i.pravatar.cc/150?img=1",
      });
    }
  }, [initialRecipient]);

  useEffect(() => {
    if (!routeCode || !serverConversations?.length) return;
    const match = serverConversations.find((c) => c.code === routeCode);
    if (match) {
      setSelectedChat({ id: match.id, name: match.name, img: match.img, lastMessage: match.lastMessage, code: match.code });
    }
  }, [routeCode, serverConversations]);

  useEffect(() => {
    if (selectedChat && (selectedChat.id || selectedChat.code)) {
      try {
        localStorage.setItem(
          "lastChatRecipient",
          JSON.stringify({ id: selectedChat.id, name: selectedChat.name, avatar: selectedChat.img, code: selectedChat.code })
        );
      } catch (_) {}
    }
  }, [selectedChat?.id, selectedChat?.name, selectedChat?.img, selectedChat?.code]);

  useEffect(() => {
    const load = async () => {
      try {
        if (routeCode) {
          const data = await messagesAPI.byCode(routeCode);
          const mapped = (data?.messages || []).map((m) => {
            const base = {
              id: m._id,
              sender: selectedChat && String(m.from) === String(selectedChat.id) ? "them" : (String(m.from) === String(selectedChat?.id) ? "them" : (m.from && selectedChat ? (String(m.from) === String(selectedChat.id) ? "them" : "me") : (m.to ? "them" : "me"))),
              text: m.text,
              at: m.createdAt,
              attachmentType: m.attachmentType,
              attachments: Array.isArray(m.attachments) ? m.attachments : [],
            };
            const parsed = parseAttachmentText(m.text);
            const enriched = parsed ? { ...base, ...parsed } : base;
            if (parsed) enriched.kind = 'attachment';
            if (!enriched.attachmentType && parsed?.attachmentType) enriched.attachmentType = parsed.attachmentType;
            return enriched;
          });
          setMessages(mapped);
        } else if (selectedChat?.id && isValidObjectId(String(selectedChat.id))) {
          const data = await messagesAPI.listWith(selectedChat.id);
          const mapped = (data?.messages || []).map((m) => {
            const base = {
              id: m._id,
              sender: String(m.from) === String(selectedChat.id) ? "them" : "me",
              text: m.text,
              at: m.createdAt,
              attachmentType: m.attachmentType,
              attachments: Array.isArray(m.attachments) ? m.attachments : [],
            };
            const parsed = parseAttachmentText(m.text);
            const enriched = parsed ? { ...base, ...parsed } : base;
            if (parsed) enriched.kind = 'attachment';
            if (!enriched.attachmentType && parsed?.attachmentType) enriched.attachmentType = parsed.attachmentType;
            return enriched;
          });
          setMessages(mapped);
        } else {
          setMessages([]);
        }
      } catch (e) {
        setMessages([]);
      }
    };
    load();
  }, [selectedChat?.id, routeCode]);

  useEffect(() => {
    const markRead = async () => {
      try {
        if (!selectedChat?.id) return;
        const resp = await notificationsAPI.list();
        const list = Array.isArray(resp?.notifications) ? resp.notifications : [];
        const toMark = list.filter(
          (n) => n.type === "message" && !n.read && (n?.sender?._id && String(n.sender._id) === String(selectedChat.id))
        );
        for (const n of toMark) {
          try { await notificationsAPI.markRead(n._id); } catch (_) {}
        }
        try { window.dispatchEvent(new Event("notifications:update")); } catch (_) {}
      } catch (_) {}
    };
    markRead();
  }, [selectedChat?.id]);

  useEffect(() => {
    if (routeCode) {
      const id = setInterval(async () => {
        try {
          const data = await messagesAPI.byCode(routeCode);
          const mapped = (data?.messages || []).map((m) => {
            const base = {
              id: m._id,
              sender: selectedChat && String(m.from) === String(selectedChat.id) ? "them" : (String(m.from) === String(selectedChat?.id) ? "them" : (m.from && selectedChat ? (String(m.from) === String(selectedChat.id) ? "them" : "me") : (m.to ? "them" : "me"))),
              text: m.text,
              at: m.createdAt,
              attachmentType: m.attachmentType,
              attachments: Array.isArray(m.attachments) ? m.attachments : [],
            };
            const parsed = parseAttachmentText(m.text);
            const enriched = parsed ? { ...base, ...parsed } : base;
            if (parsed) enriched.kind = 'attachment';
            if (!enriched.attachmentType && parsed?.attachmentType) enriched.attachmentType = parsed.attachmentType;
            return enriched;
          });
          setMessages(mapped);
        } catch (_) {}
      }, 5000);
      return () => clearInterval(id);
    }
    if (!selectedChat?.id || !isValidObjectId(String(selectedChat.id))) return;
    const id = setInterval(async () => {
      try {
        const data = await messagesAPI.listWith(selectedChat.id);
        const mapped = (data?.messages || []).map((m) => {
          const base = {
            id: m._id,
            sender: String(m.from) === String(selectedChat.id) ? "them" : "me",
            text: m.text,
            at: m.createdAt,
            attachmentType: m.attachmentType,
            attachments: Array.isArray(m.attachments) ? m.attachments : [],
          };
          const parsed = parseAttachmentText(m.text);
          const enriched = parsed ? { ...base, ...parsed } : base;
          if (parsed) enriched.kind = 'attachment';
          if (!enriched.attachmentType && parsed?.attachmentType) enriched.attachmentType = parsed.attachmentType;
          return enriched;
        });
        setMessages(mapped);
      } catch (_) {}
    }, 5000);
    return () => clearInterval(id);
  }, [selectedChat?.id, routeCode]);

  const handleSend = async () => {
    if (newMessage.trim() === "") return;
    const textToSend = newMessage;
    setNewMessage("");
    if (selectedChat?.id && isValidObjectId(String(selectedChat.id))) {
      try {
        const resp = await messagesAPI.send({ to: selectedChat.id, text: textToSend });
        const saved = resp?.message;
        setMessages((prev) => {
          const base = saved
            ? { id: saved._id, sender: "me", text: saved.text, at: saved.createdAt }
            : { sender: "me", text: textToSend, at: new Date().toISOString() };
          const parsed = parseAttachmentText(base.text);
          return [...prev, (parsed ? { ...base, ...parsed } : base)];
        });
      } catch (e) {
        setNewMessage(textToSend);
        return;
      }
    } else {
      setMessages((prev) => [...prev, { sender: "me", text: textToSend, at: new Date().toISOString() }]);
    }
    try {
      if (selectedChat?.id && isValidObjectId(String(selectedChat.id))) {
        await notificationsAPI.create({
          receiverUserId: String(selectedChat.id),
          type: "message",
          message: textToSend,
          meta: { fromChat: true },
        });
      }
    } catch (_) {
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      <div className="h-full max-w-7xl mx-auto flex rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Left: Conversations */}
        <div className="w-[340px] shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 flex flex-col">
          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold text-slate-900">Messages</div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-10 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 py-2">
            {conversations.map((conv) => {
              const unreadCount = unreadBySender[String(conv.id)] || 0;
              const hasUnread = unreadCount > 0;
              const lastLocal = (conv.id === selectedChat?.id && messages.length > 0) ? messages[messages.length - 1] : null;
              const lastParsed = lastLocal && (lastLocal.kind === 'attachment' ? lastLocal : parseAttachmentText(lastLocal.text));
              const previewText = lastLocal
                ? (lastParsed ? '' : lastLocal.text)
                : conv.lastMessage;

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    if (conv.code) {
                      navigate(`/messages/${conv.code}`);
                    } else {
                      setSelectedChat(conv);
                    }
                  }}
                  className={`relative mx-2 mt-2 flex items-center gap-3 p-3.5 cursor-pointer rounded-xl transition
                  ${selectedChat?.id === conv.id ? "bg-indigo-50 ring-1 ring-indigo-100" : "hover:bg-slate-50"}`}
                >
                  <span className="relative">
                    <img
                      src={conv.img}
                      alt={conv.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={`truncate ${hasUnread ? "font-semibold text-slate-900" : "font-medium text-slate-800"}`}>{conv.name}</div>
                      {hasUnread && (
                        <span
                          title={`${unreadCount} unread`}
                          className="ml-auto inline-flex items-center justify-center min-w-[1.25rem] h-5 px-2 rounded-full text-[11px] font-semibold bg-indigo-600 text-white"
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    <div className={`text-sm truncate w-48 ${hasUnread ? "font-medium text-slate-700" : "text-slate-500"}`}>
                      {previewText}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Chat */}
        <div className="flex-1 flex flex-col bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50">
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur z-10">
                <img
                  src={selectedChat.img}
                  alt={selectedChat.name}
                  className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm"
                />
                <div>
                  <div className="font-medium text-slate-900">{selectedChat.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active now
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    title="Video call"
                    onClick={handleVideoCallClick}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-600 hover:text-indigo-700 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition shadow-sm"
                    aria-label="Video call"
                  >
                    <FaVideo size={18} />
                  </button>
                  <button
                    type="button"
                    title="Audio call"
                    onClick={handleAudioCallClick}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition shadow-sm"
                  >
                    <FaPhone size={16} />
                  </button>
                  <div className="relative" ref={optionsRef}>
                    <button
                      type="button"
                      onClick={() => setShowChatOptions(!showChatOptions)}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 transition shadow-sm"
                      aria-label="Chat options"
                    >
                      <FaEllipsisV size={16} />
                    </button>
                    
                    {/* Chat Options Dropdown */}
                    {showChatOptions && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                        <div className="p-4 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <img
                              src={selectedChat.img}
                              alt={selectedChat.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <div className="font-medium text-slate-900">{selectedChat.name}</div>
                              <div className="text-xs text-slate-500">Active now</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-2">
                          <button
                            onClick={() => {
                              setIsMuted(!isMuted);
                              setShowChatOptions(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                          >
                            {isMuted ? (
                              <>
                                <FaBellSlash className="text-slate-500" />
                                <span>Unmute messages</span>
                              </>
                            ) : (
                              <>
                                <FaBell className="text-slate-500" />
                                <span>Mute messages</span>
                              </>
                            )}
                            <div className="ml-auto">
                              <div className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${isMuted ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'}`}>
                                <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm"></div>
                              </div>
                            </div>
                          </button>
                          
                          <button
                            onClick={() => {
                              // Implement report functionality
                              Swal.fire({
                                title: 'Report User',
                                text: 'Report feature is coming soon!',
                                icon: 'info',
                                confirmButtonColor: '#3085d6',
                              });
                              setShowChatOptions(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                          >
                            <FaFlag className="text-slate-500" />
                            <span>Report</span>
                          </button>
                          
                          <button
                            onClick={async () => {
                              // Implement block functionality
                              const { isConfirmed } = await Swal.fire({
                                title: 'Block User',
                                text: `Are you sure you want to block ${selectedChat.name}?`,
                                icon: 'question',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes, block user',
                                cancelButtonText: 'Cancel',
                                reverseButtons: true
                              });
                              
                              if (isConfirmed) {
                                await Swal.fire({
                                  title: 'Blocked!',
                                  text: 'User has been blocked successfully.',
                                  icon: 'success',
                                  confirmButtonColor: '#3085d6',
                                });
                                setShowChatOptions(false);
                              }
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                          >
                            <FaUserSlash className="text-slate-500" />
                            <span>Block</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setShowChatOptions(false);
                              handleDeleteChat();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <FaTrash className="text-red-500" />
                            <span>Delete chat</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Incoming call banner */}
              {incomingVideoCall && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                    <div className="text-center">
                      <div className="mx-auto h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                        <FaVideo className="text-indigo-600 text-3xl" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">Incoming Video Call</h3>
                      <p className="text-gray-600 mb-6">
                        {incomingVideoCall.fromName} is calling you...
                      </p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleAcceptCall(incomingVideoCall)}
                          className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transform transition hover:scale-110"
                        >
                          <FaPhone className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeclineCall(incomingVideoCall)}
                          className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transform transition hover:scale-110"
                        >
                          <FaPhone className="h-5 w-5 transform rotate-135" />
                        </button>
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        <p>This call will be opened in a new window</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Outgoing call overlay */}
              {outgoingVideoCall && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                    <div className="text-center">
                      <div className="mx-auto h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping"></div>
                          <FaVideo className="relative text-indigo-600 text-3xl" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">Calling {selectedChat?.name || 'User'}...</h3>
                      <p className="text-gray-600 mb-6">
                        Waiting for {selectedChat?.name || 'the user'} to answer
                      </p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={handleCancelOutgoingCall}
                          className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transform transition hover:scale-110"
                        >
                          <FaPhone className="h-5 w-5 transform rotate-135" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-transparent to-slate-50/70">
                {groupedMessages.map((group, gi) => (
                  <div key={gi} className="mb-6">
                    {/* Date separator */}
                    <div className="flex items-center my-4">
                      <div className="flex-1 border-t border-slate-200"></div>
                      <div className="px-4 text-sm text-slate-500 font-medium">
                        {group.label}
                      </div>
                      <div className="flex-1 border-t border-slate-200"></div>
                    </div>
                    <div className="space-y-4">
                      {group.items.map((msg, idx) => (
                        <div
                          key={`${gi}-${idx}`}
                          className={`group flex items-end gap-2 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                          {msg.sender !== "me" && (
                            <img
                              src={selectedChat.img}
                              alt="avatar"
                              className="w-7 h-7 rounded-full shadow-sm"
                            />
                          )}
                          <div className="flex flex-col max-w-[80%] sm:max-w-[70%] lg:max-w-[60%]">
                            <div
                              className={`inline-block px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap break-words align-top shadow-md
                              ${msg.sender === "me" ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white" : "bg-white text-slate-900 border border-slate-200"}`}
                            >
                              {(() => {
                                const parsed = msg.kind === 'attachment' ? { attachmentType: msg.attachmentType } : parseAttachmentText(msg.text);
                                if (parsed) {
                                  const aType = msg.attachmentType || parsed.attachmentType;
                                  const atts = Array.isArray(msg.attachments) ? msg.attachments : [];
                                  if (!atts.length) return null;
                                  return (
                                    <div className="flex items-start gap-2">
                                      {aType === 'document' && (
                                        <FaFileAlt size={14} className={msg.sender === 'me' ? 'text-indigo-100' : 'text-slate-600'} />
                                      )}
                                      <div>
                                        {aType === 'document' ? (
                                          <div className="mt-1 flex flex-col gap-1">
                                            {atts.map((a, i) => {
                                              const url = a?.url && a.url.startsWith('/uploads') ? `${import.meta.env.REACT_APP_API_URL}${a.url}` : a?.url;
                                              return (
                                                <a
                                                  key={i}
                                                  href={url}
                                                  download
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  className={msg.sender === 'me'
                                                    ? 'inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/10 ring-1 ring-white/20 text-[12px] text-indigo-50 hover:bg-white/20'
                                                    : 'inline-flex items-center gap-2 px-2 py-1 rounded-md bg-slate-100 ring-1 ring-slate-200 text-[12px] text-slate-800 hover:bg-slate-200'}
                                                >
                                                  {a.originalName || a.filename}
                                                </a>
                                              );
                                            })}
                                          </div>
                                        ) : aType === 'photo' ? (
                                          <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-[280px]">
                                            {atts.map((a, i) => {
                                              const url = a?.url && a.url.startsWith('/uploads') ? `${import.meta.env.REACT_APP_API_URL}${a.url}` : a?.url;
                                              return (
                                                <a key={i} href={url} target="_blank" rel="noreferrer" className="block">
                                                  <img src={url} alt={a.originalName || a.filename} className="w-full h-24 object-cover rounded-lg ring-1 ring-white/20" />
                                                </a>
                                              );
                                            })}
                                          </div>
                                        ) : (
                                          <div className="mt-1 flex flex-col gap-2 max-w-[280px]">
                                            {atts.map((a, i) => {
                                              const url = a?.url && a.url.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL}${a.url}` : a?.url;
                                              return (
                                                <video key={i} src={url} controls className="w-full rounded-lg max-h-48 ring-1 ring-white/20" />
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }
                                return (<div>{msg.text}</div>);
                              })()}
                              <div className={`mt-1 text-[10px] ${msg.sender === "me" ? "text-indigo-100/80" : "text-slate-500"} text-right`}>
                                {formatTime(msg.at || msg.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Composer */}
              <div className="p-4 border-t border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setAttachOpen((v) => !v)}
                      className="inline-flex items-center justify-center w-11 h-11 rounded-full text-slate-600 bg-white border border-slate-200 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm"
                      aria-label="Add attachment"
                      title="Share photos, videos or documents"
                    >
                      <FaPlus size={18} />
                    </button>
                    {attachOpen && (
                      <div className="absolute bottom-12 left-0 bg-white border border-slate-200 rounded-xl shadow-xl py-2 w-48 z-20">
                        <button
                          type="button"
                          onClick={handlePickPhoto}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-slate-700"
                        >
                          <FaImage size={14} className="text-pink-500" />
                          <span>Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePickVideo}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-slate-700"
                        >
                          <FaVideo size={14} className="text-emerald-600" />
                          <span>Video</span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePickDoc}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-slate-700"
                        >
                          <FaFileAlt size={14} className="text-indigo-600" />
                          <span>Document</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 h-11 px-4 border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 border-slate-200 shadow-sm"
                  />
                  <button
                    onClick={handleSend}
                    className="h-11 px-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                  >
                    Send
                  </button>

                  <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={onPhotoSelected} />
                  <input ref={videoInputRef} type="file" accept="video/*" multiple className="hidden" onChange={onVideoSelected} />
                  <input
                    ref={docInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,application/*"
                    onChange={onDocSelected}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="max-w-md">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-slate-900">Start a conversation</h3>
                <p className="mt-2 text-slate-500">Select a person on the left to view your chat.</p>
                <blockquote className="mt-6 text-slate-600 italic">“{emptyQuote.q}”</blockquote>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;