"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createSupportTicket,
  getUserSupportTicketDetails,
  getUserSupportTickets,
  sendSupportTicketMessage,
  uploadFile,
  uploadSupportMedia,
} from "../apis/support";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "react-toastify";
import moment from "moment";
import { useWebSocket } from "../hooks/useWebSocket";
import { log } from "console";
import { ArrowBackIcon } from "@chakra-ui/icons";

// types/message.ts
export interface MessageModel {
  id?: string;
  message_key: string;
  content?: string;
  message_type: string;
  is_read: boolean;
  created_at: Date;
  updated_at?: Date;
  sender_id: string;
  media_url?: string;
  title?: string;
  status?: string;
}

export default function SupportWidget() {
  const { userToken, profileInfo } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const [stage, setStage] = useState(1);
  const [title, setTitle] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [supportTickets, setSupportTickets] = useState([]);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  console.log("profileInfo?.id", profileInfo);
  const fileInputRef = useRef(null);

  const handleGetTickets = async () => {
    // setLoading(true);
    if (!userToken) return;
    try {
      const response = await getUserSupportTickets(userToken as string);
      console.log("getUserSupportTickets", response);
      if (response?.data?.length > 0) {
        setStage(2);
        setSupportTickets(response?.data);
      }
    } catch (err) {
      const error = err as any;
      toast.error(
        error?.response?.data?.detail || "An unexpected error occurred"
      );
      console.log("Error getting support tickets", error);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  const handleGetTicketDetails = async () => {
    // setLoading(true);
    console.log("selectedTicketId", selectedTicketId);

    if (!selectedTicketId) {
      console.log("right!");

      return;
    }
    if (!userToken) return;
    try {
      const response = await getUserSupportTicketDetails(
        selectedTicketId,
        userToken as string
      );
      console.log("getUserSupportTicketDetails", response);
      // if(response?.data?.length > 0) {
      //   setStage(2);
      setSelectedTicket(response?.data);
      setMessages(response?.data?.messages);
      setStage(3);
      // }
    } catch (err) {
      const error = err as any;
      toast.error(
        error?.response?.data?.detail || "An unexpected error occurred"
      );
      console.log("Error getting support ticket details", error);
      setStage(2);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    handleGetTickets();
  }, [userToken]);

  useEffect(() => {
    if (stage === 2) {
      handleGetTickets();
    }
  }, [stage === 2]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createSupportTicket(
        { title, message_key: description },
        userToken as string
      );
      console.log("createSupportTicket", response);
      setSelectedTicketId(response?.data?.id);
      setTitle("");
      setDescription("");
      // setStage(3);
      // handleGetTickets();
    } catch (err) {
      const error = err as any;
      toast.error(
        error?.response?.data?.detail || "An unexpected error occurred"
      );
      console.log("Error submitting form", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSendTicketMessage = async () => {
  //   // e.preventDefault();
  //   // setLoading(true);
  //   if(message?.length < 1) return;
  //   try {
  //     const response = await sendSupportTicketMessage(
  //       selectedTicketId,
  //       {
  //         message_type: "text",
  //         content: message,
  //         message_key: null
  //       },
  //       userToken as string
  //     );
  //     console.log("sendSupportTicketMessage", response);
  //     // setStage(2);
  //   } catch (err) {
  //     const error = err as any;
  //     toast.error(
  //       error?.response?.data?.detail || "An unexpected error occurred"
  //     );
  //     console.log("Error sending support ticket message", error);
  //   }
  //   // finally {
  //   //   setLoading(false);
  //   // }
  // };
  const handleNewMessage = useCallback((message: MessageModel) => {
    console.log("handleNewMessage", message);

    setMessages((prev) => [...prev, message]);
  }, []);

  const handleSystemEvent = useCallback(
    (message: MessageModel, profileId: string) => {
      // setMessages((prev) =>
      //   prev.map((msg) =>
      //     msg.message_key === message.message_key
      //       ? { ...msg, ...message, is_read: true, sender_id: profileId }
      //       : msg
      //   )
      // );
    },
    []
  );

  const { isConnected, connectionError, sendMessage } = useWebSocket({
    ticketId: selectedTicketId,
    token: userToken as string,
    profileId: profileInfo?.id,
    onMessage: handleNewMessage,
    onSystemEvent: handleSystemEvent,
  });

  const handleImageUpload = async (messageKey: string) => {
    if (!selectedImage) return;

    console.log("selectedImage", selectedImage);
    

    setIsUploading(true);
    try {
      // const imageUrl = await uploadFile(selectedTicketId, selectedImage,userToken as string);
      const imageUrl = await uploadSupportMedia(selectedImage);

      console.log("Image uploaded", imageUrl);
      
      
      const payload = {
        message_type: 'image',
        message_key: messageKey,
        media_url: imageUrl,
        content: message.trim() || undefined,
        ticket_id: selectedTicketId,
      };

      sendMessage(payload);

      const newMessage: MessageModel = {
        message_key: messageKey,
        content: message.trim() || undefined,
        message_type: "image",
        is_read: false,
        created_at: new Date(),
        sender_id: profileInfo?.id,
        media_url: imageUrl,
      };

      console.log("Image uploaded");


      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.log('Image upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const sendTextMessage = useCallback(() => {
    // if (message.trim() || selectedImage) {
    if (message.trim()) {
      const message_key = Date.now().toString();

      if (selectedImage) {
        handleImageUpload(message_key);
      } else {
      const payload = {
        message_type: "text",
        message_key: message_key,
        content: message,
        ticket_id: selectedTicketId,
      };

      sendMessage(payload);

      const newMessage: MessageModel = {
        message_key,
        content: message,
        message_type: "text",
        is_read: false,
        created_at: new Date(),
        sender_id: profileInfo?.id,
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      }
    }
  }, [
    message,
    // , selectedImage
    selectedTicketId,
    sendMessage,
    profileInfo?.id,
  ]);

  useEffect(() => {
    handleGetTicketDetails();
  }, [selectedTicketId]);

  useEffect(() => {
    console.log("messages changed", messages);
  }, [messages]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  return (
    userToken && (
      <div className="support">
          <div
            className="support__bubble"
            onClick={() => {
              setBubbleOpen(!bubbleOpen);
              setOpen(true);
            }}
          >
            {bubbleOpen ? <svg
            width="40" height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="1"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
                  stroke="#fff"
                  stroke-width="1.5"
                ></path>{" "}
              </g>
            </svg> :   <svg
              width="30" height="30"
                      viewBox="0 -0.5 21 21"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      fill="#f8a730"
                      strokeWidth="2"

                      onClick={() => {
                        setImagePreview(null);
                        setSelectedImage(null);
                      }}
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <title>close [#1511]</title>{" "}
                        <desc>Created with Sketch.</desc> <defs> </defs>{" "}
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          {" "}
                          <g
                            id="Dribbble-Light-Preview"
                            transform="translate(-419.000000, -240.000000)"
                            fill="#FFF"
                          >
                            {" "}
                            <g
                              id="icons"
                              transform="translate(56.000000, 160.000000)"
                            >
                              {" "}
                              <polygon
                                id="close-[#1511]"
                                points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"
                              >
                                {" "}
                              </polygon>{" "}
                            </g>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>
                    </svg>}
          </div>
         {!bubbleOpen &&  <>
            {open && <div className="support__bg"></div>}
            {stage === 1 && (
              <div
                className={
                  open
                    ? "support__inner"
                    : "support__inner support__inner-short"
                }
              >
                <div
                  className="support__inner__header"
                  // onClick={() => setOpen(!open)}
                >
                  Support
                </div>
                <div className="support__inner__info">
                  <ArrowBackIcon boxSize="20px" mb="14px" color="#f8a730" cursor="pointer"
                  onClick={() => setStage(2)}
                  />
                  <div className="support__inner__info__title">
                    What do you need help with?
                  </div>
                  <form
                    className="support__inner__info__form"
                    onSubmit={handleCreateTicket}
                  >
                    <label htmlFor="">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                    <label htmlFor="">Description</label>
                    <textarea
                      name=""
                      id=""
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                    <button disabled={loading}>
                      {loading ? "Loading..." : "Submit"}
                    </button>
                  </form>
                </div>
              </div>
            )}
            {stage === 2 && (
              <div
                className={
                  open
                    ? "support__inner"
                    : "support__inner support__inner-short"
                }
              >
                <div
                  className="support__inner__header"
                  // onClick={() => setOpen(!open)}
                >
                  Support
                </div>

                {supportTickets?.map((ticket) => (
                  <div
                    className="support__inner__card"
                    onClick={() => setSelectedTicketId(ticket?.id)}
                  >
                    <div className="support__inner__card__group">
                      <div className="support__inner__card__initials">
                      {profileInfo?.name?.split(" ")[0]?.charAt(0)}
                      {profileInfo?.name?.split(" ")[1]?.charAt(0)}
                      </div>

                      <div>
                        <div className="support__inner__card__message">
                          {ticket?.last_message?.content?.substring(0, 20)}...
                        </div>
                        <div className="support__inner__card__flex">
                          <div className="support__inner__card__who">
                            Support Agent
                          </div>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="#ccc"
                          >
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              {" "}
                              <circle
                                cx="12"
                                cy="12"
                                r="2"
                                fill="#ccc"
                              ></circle>{" "}
                            </g>
                          </svg>
                          <div className="support__inner__card__time">
                            {moment(ticket?.last_message?.created_at).fromNow()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <svg
                      viewBox="-4.5 0 20 20"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      fill="#000000"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <title>arrow_right [#333]</title>{" "}
                        <desc>Created with Sketch.</desc> <defs> </defs>{" "}
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          {" "}
                          <g
                            id="Dribbble-Light-Preview"
                            transform="translate(-425.000000, -6679.000000)"
                            fill="#fa9411"
                          >
                            {" "}
                            <g
                              id="icons"
                              transform="translate(56.000000, 160.000000)"
                            >
                              {" "}
                              <path
                                d="M370.39,6519 L369,6520.406 L377.261,6529.013 L376.38,6529.931 L376.385,6529.926 L369.045,6537.573 L370.414,6539 C372.443,6536.887 378.107,6530.986 380,6529.013 C378.594,6527.547 379.965,6528.976 370.39,6519"
                                id="arrow_right-[#333]"
                              >
                                {" "}
                              </path>{" "}
                            </g>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                  </div>
                ))}

                {open && (
                  <div
                    className="support__inner__new"
                    onClick={() => setStage(1)}
                  >
                    <svg
                      fill="#fff"
                      viewBox="0 0 32 32"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#fff"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <title>pencil</title>{" "}
                        <path d="M0 32l12-4 20-20-8-8-20 20zM4 28l2.016-5.984 4 4zM8 20l12-12 4 4-12 12z"></path>{" "}
                      </g>
                    </svg>
                  </div>
                )}
              </div>
            )}
            {stage === 3 && (
              <div
                className={
                  open ? "support__chat" : "support__chat support__inner-short"
                }
              >
                <div
                  className={"support__chat__header"}
                  onClick={() => setStage(2)}
                >
                  <svg
                    viewBox="0 -0.5 21 21"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <title>close [#1511]</title>{" "}
                      <desc>Created with Sketch.</desc> <defs> </defs>{" "}
                      <g
                        id="Page-1"
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        {" "}
                        <g
                          id="Dribbble-Light-Preview"
                          transform="translate(-419.000000, -240.000000)"
                          fill="#FFF"
                        >
                          {" "}
                          <g
                            id="icons"
                            transform="translate(56.000000, 160.000000)"
                          >
                            {" "}
                            <polygon
                              id="close-[#1511]"
                              points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"
                            >
                              {" "}
                            </polygon>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>{" "}
                    </g>
                  </svg>

                  <div className="support__chat__header__initials">
                  {profileInfo?.name}
                  </div>
                </div>

                <div className="support__chat__inner">
                  {[...messages]?.reverse()?.map((message) => (
                    <div
                      className={
                        message?.sender_id !== profileInfo?.id
                          ? "support__chat__inner__chat support__chat__inner__received"
                          : "support__chat__inner__chat support__chat__inner__sent"
                      }
                    >
                      <div className="support__chat__inner__received__inner">
                        {message?.message_type === "image" && <img src={message?.media_url} alt="" className="support__chat__inner__image" />}
                        {message?.content}
                        <div className="support__chat__inner__chat__time">
                          {moment(message?.created_at).fromNow()}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* <div className="support__chat__inner__chat support__chat__inner__sent">
              <div className="support__chat__inner__sent__inner">
                Hi
                <div className="support__chat__inner__chat__time">3d ago</div>
              </div>
            </div>
            <div className="support__chat__inner__chat support__chat__inner__received">
              <div className="support__chat__inner__received__inner">
                Hello
                <div className="support__chat__inner__chat__time">3d ago</div>
              </div>
            </div>

            <div className="support__chat__inner__chat support__chat__inner__sent">
              <div className="support__chat__inner__sent__inner">
                Hi
                <div className="support__chat__inner__chat__time">3d ago</div>
              </div>
            </div>
            <div className="support__chat__inner__chat support__chat__inner__received">
              <div className="support__chat__inner__received__inner">
                Hello
                <div className="support__chat__inner__chat__time">3d ago</div>
              </div>
            </div>

            <div className="support__chat__inner__chat support__chat__inner__sent">
              <div className="support__chat__inner__sent__inner">
                Hi
                <div className="support__chat__inner__chat__time">3d ago</div>
              </div>
            </div> */}
                </div>

                <div className="support__chat__input">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      style={{ display: "none" }}
                    />
                    <svg
                      viewBox="0 -0.5 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M15.17 11.053L11.18 15.315C10.8416 15.6932 10.3599 15.9119 9.85236 15.9178C9.34487 15.9237 8.85821 15.7162 8.51104 15.346C7.74412 14.5454 7.757 13.2788 8.54004 12.494L13.899 6.763C14.4902 6.10491 15.3315 5.72677 16.2161 5.72163C17.1006 5.71649 17.9463 6.08482 18.545 6.736C19.8222 8.14736 19.8131 10.2995 18.524 11.7L12.842 17.771C12.0334 18.5827 10.9265 19.0261 9.78113 18.9971C8.63575 18.9682 7.55268 18.4695 6.78604 17.618C5.0337 15.6414 5.07705 12.6549 6.88604 10.73L12.253 5"
                          stroke="#f8a730"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                  </div>

                  <input
                    type="text"
                    placeholder="Type your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  <div
                    className="support__chat__input__send"
                    onClick={() => sendTextMessage()}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M20.33 3.66996C20.1408 3.48213 19.9035 3.35008 19.6442 3.28833C19.3849 3.22659 19.1135 3.23753 18.86 3.31996L4.23 8.19996C3.95867 8.28593 3.71891 8.45039 3.54099 8.67255C3.36307 8.89471 3.25498 9.16462 3.23037 9.44818C3.20576 9.73174 3.26573 10.0162 3.40271 10.2657C3.5397 10.5152 3.74754 10.7185 4 10.85L10.07 13.85L13.07 19.94C13.1906 20.1783 13.3751 20.3785 13.6029 20.518C13.8307 20.6575 14.0929 20.7309 14.36 20.73H14.46C14.7461 20.7089 15.0192 20.6023 15.2439 20.4239C15.4686 20.2456 15.6345 20.0038 15.72 19.73L20.67 5.13996C20.7584 4.88789 20.7734 4.6159 20.7132 4.35565C20.653 4.09541 20.5201 3.85762 20.33 3.66996ZM4.85 9.57996L17.62 5.31996L10.53 12.41L4.85 9.57996ZM14.43 19.15L11.59 13.47L18.68 6.37996L14.43 19.15Z"
                          fill="#fff"
                        ></path>{" "}
                      </g>
                    </svg>
                  </div>

                    {imagePreview && (
                  <div className="support__chat__input__image-preview">
                    <img src={imagePreview} alt="Image preview" />

                    <svg
                      viewBox="0 -0.5 21 21"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      fill="#f8a730"

                      onClick={() => {
                        setImagePreview(null);
                        setSelectedImage(null);
                      }}
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <title>close [#1511]</title>{" "}
                        <desc>Created with Sketch.</desc> <defs> </defs>{" "}
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          {" "}
                          <g
                            id="Dribbble-Light-Preview"
                            transform="translate(-419.000000, -240.000000)"
                            fill="#f8a730"
                          >
                            {" "}
                            <g
                              id="icons"
                              transform="translate(56.000000, 160.000000)"
                            >
                              {" "}
                              <polygon
                                id="close-[#1511]"
                                points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"
                              >
                                {" "}
                              </polygon>{" "}
                            </g>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                  </div>
                     )}
                </div>
              </div>
            )}
          </>}
        
      </div>
    )
  );
}
