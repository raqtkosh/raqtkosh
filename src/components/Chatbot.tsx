"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: string; message: string }[]>([]);
  const [currentStep, setCurrentStep] = useState("initial");
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    hospital: "",
  });
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Simulate typing effect
  const simulateTyping = (message: string, callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < message.length) {
          setChatHistory((prev) => [
            ...prev.slice(0, -1),
            { sender: "bot", message: message.slice(0, index + 1) },
          ]);
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          callback();
        }
      }, 50); // Adjust typing speed here
    }, 2000); // Show "Typing..." for 2 seconds
  };

  // Handle user response
  const handleUserResponse = (response: string) => {
    setChatHistory((prev) => [...prev, { sender: "user", message: response }]);
    switch (currentStep) {
      case "initial":
        if (response === "donate blood") {
          simulateTyping("Do you want home delivery or to visit a donation camp?", () => {
            setCurrentStep("donate_option");
          });
        } else if (response === "get blood") {
          simulateTyping("Do you have a doctor's prescription?", () => {
            setCurrentStep("get_blood_doctor");
          });
        }
        break;

      case "donate_option":
        if (response === "home") {
          simulateTyping("You can sign up to get more benefits. Do you still want to continue?", () => {
            setCurrentStep("donate_home_signup");
          });
        } else if (response === "camp") {
          simulateTyping("Here are some nearby donation camps:\n- Camp A\n- Camp B\n- Camp C\n- Camp D", () => {
            setCurrentStep("initial");
          });
        }
        break;

      case "donate_home_signup":
        if (response === "signup") {
          router.push("/sign-up");
        } else if (response === "continue") {
          simulateTyping("Please fill in your basic details.", () => {
            setCurrentStep("donate_home_details");
          });
        }
        break;

      case "donate_home_details":
        if (userDetails.name && userDetails.phone && userDetails.address) {
          simulateTyping("Thank you! We will contact you shortly.", () => {
            setCurrentStep("initial");
          });
        } else {
          simulateTyping("Please provide your name, phone number, and address.", () => {
            setCurrentStep("donate_home_details");
          });
        }
        break;

      case "get_blood_doctor":
        if (response === "no") {
          simulateTyping("Sorry, please get a doctor's prescription first.", () => {
            setCurrentStep("initial");
          });
        } else if (response === "yes") {
          simulateTyping("Do you want to get blood at a hospital or collect it from a nearby center?", () => {
            setCurrentStep("get_blood_option");
          });
        }
        break;

      case "get_blood_option":
        if (response === "hospital") {
          simulateTyping("You can sign up to get more rewards. Do you still want to continue?", () => {
            setCurrentStep("get_blood_hospital_signup");
          });
        } else if (response === "center") {
          simulateTyping("Here are some nearby centers:\n- Center X\n- Center Y\n- Center Z", () => {
            setCurrentStep("initial");
          });
        }
        break;

      case "get_blood_hospital_signup":
        if (response === "signup") {
          router.push("/sign-up");
        } else if (response === "continue") {
          simulateTyping("Please fill in your basic details.", () => {
            setCurrentStep("get_blood_hospital_details");
          });
        }
        break;

      case "get_blood_hospital_details":
        if (userDetails.name && userDetails.phone && userDetails.hospital) {
          simulateTyping("Thank you! We will contact you shortly.", () => {
            setCurrentStep("initial");
          });
        } else {
          simulateTyping("Please provide your name, phone number, and hospital name.", () => {
            setCurrentStep("get_blood_hospital_details");
          });
        }
        break;

      default:
        break;
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Close chatbot when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest(".chatbot-container")) {
        setIsOpen(false);
        setChatHistory([]);
        setCurrentStep("initial");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4">
      {isOpen ? (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col chatbot-container">
          <div className="p-4 bg-red-500 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">RaqtKosh Chatbot</h3>
            <button onClick={() => setIsOpen(false)} className="text-white">
              ×
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`mb-2 ${chat.sender === "user" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${chat.sender === "user" ? "bg-red-500 text-white" : "bg-gray-200 text-black"}`}
                >
                  {chat.message}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="text-left">
                <span className="inline-block p-2 rounded-lg bg-gray-200 text-black">Typing...</span>
              </div>
            )}
          </div>
          <div className="p-4 border-t">
            {currentStep === "initial" && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleUserResponse("donate blood")}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Donate Blood
                </button>
                <button
                  onClick={() => handleUserResponse("get blood")}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Get Blood
                </button>
              </div>
            )}
            {currentStep === "donate_option" && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleUserResponse("home")}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Home
                </button>
                <button
                  onClick={() => handleUserResponse("camp")}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Donation Camp
                </button>
              </div>
            )}
            {currentStep === "donate_home_signup" && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleUserResponse("signup")}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Signup
                </button>
                <button
                  onClick={() => handleUserResponse("continue")}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Continue
                </button>
              </div>
            )}
            {currentStep === "donate_home_details" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserResponse(`name:${userDetails.name}`);
                  handleUserResponse(`phone:${userDetails.phone}`);
                  handleUserResponse(`address:${userDetails.address}`);
                }}
                className="flex flex-col gap-2"
              >
                <input
                  type="text"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Name"
                  required
                />
                <input
                  type="text"
                  value={userDetails.phone}
                  onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Mobile Number"
                  required
                />
                <input
                  type="text"
                  value={userDetails.address}
                  onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Address"
                  required
                />
                <button
                  type="submit"
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Submit
                </button>
              </form>
            )}
            {currentStep === "get_blood_doctor" && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleUserResponse("yes")}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleUserResponse("no")}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  No
                </button>
              </div>
            )}
            {currentStep === "get_blood_option" && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleUserResponse("hospital")}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Hospital
                </button>
                <button
                  onClick={() => handleUserResponse("center")}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Nearby Center
                </button>
              </div>
            )}
            {currentStep === "get_blood_hospital_signup" && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleUserResponse("signup")}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Signup
                </button>
                <button
                  onClick={() => handleUserResponse("continue")}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Continue
                </button>
              </div>
            )}
            {currentStep === "get_blood_hospital_details" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserResponse(`name:${userDetails.name}`);
                  handleUserResponse(`phone:${userDetails.phone}`);
                  handleUserResponse(`hospital:${userDetails.hospital}`);
                }}
                className="flex flex-col gap-2"
              >
                <input
                  type="text"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Name"
                  required
                />
                <input
                  type="text"
                  value={userDetails.phone}
                  onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Mobile Number"
                  required
                />
                <input
                  type="text"
                  value={userDetails.hospital}
                  onChange={(e) => setUserDetails({ ...userDetails, hospital: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Hospital Name"
                  required
                />
                <button
                  type="submit"
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsOpen(true);
            setChatHistory([]);
            setCurrentStep("initial");
            simulateTyping("Welcome to RaqtKosh. How may I help you?", () => {});
          }}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:from-red-600 hover:to-pink-600 transition-all"
        >
          💬
        </button>
      )}
    </div>
  );
}