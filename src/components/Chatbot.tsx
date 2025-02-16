"use client";

import { useState, useEffect, useRef } from "react";

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

  // Simulate typing effect
  const simulateTyping = (message: string, callback: () => void) => {
    setIsTyping(true); // Show "Typing..."
    setTimeout(() => {
      setIsTyping(false); // Hide "Typing..."
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
          simulateTyping("Please provide your name.", () => {
            setCurrentStep("donate_home_name");
          });
        } else if (response === "camp") {
          simulateTyping("Here are some nearby donation camps:\n- Camp A\n- Camp B\n- Camp C\n- Camp D", () => {
            setCurrentStep("initial");
          });
        }
        break;

      case "donate_home_name":
        setUserDetails({ ...userDetails, name: response });
        simulateTyping("Please provide your phone number.", () => {
          setCurrentStep("donate_home_phone");
        });
        break;

      case "donate_home_phone":
        setUserDetails({ ...userDetails, phone: response });
        simulateTyping("Please provide your address.", () => {
          setCurrentStep("donate_home_address");
        });
        break;

      case "donate_home_address":
        setUserDetails({ ...userDetails, address: response });
        simulateTyping("Thank you! We will contact you shortly.", () => {
          setCurrentStep("initial");
        });
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
          simulateTyping("Please provide your name.", () => {
            setCurrentStep("get_blood_hospital_name");
          });
        } else if (response === "center") {
          simulateTyping("Here are some nearby centers:\n- Center X\n- Center Y\n- Center Z", () => {
            setCurrentStep("initial");
          });
        }
        break;

      case "get_blood_hospital_name":
        setUserDetails({ ...userDetails, name: response });
        simulateTyping("Please provide your phone number.", () => {
          setCurrentStep("get_blood_hospital_phone");
        });
        break;

      case "get_blood_hospital_phone":
        setUserDetails({ ...userDetails, phone: response });
        simulateTyping("Please provide the hospital name.", () => {
          setCurrentStep("get_blood_hospital_details");
        });
        break;

      case "get_blood_hospital_details":
        setUserDetails({ ...userDetails, hospital: response });
        simulateTyping("Please upload the prescription or blood receipt.", () => {
          setCurrentStep("get_blood_hospital_upload");
        });
        break;

      case "get_blood_hospital_upload":
        simulateTyping("Request generated. If details are correct, we will deliver your blood within 30 minutes.", () => {
          setCurrentStep("initial");
          saveDataToDatabase(); // Save data to database
        });
        break;

      default:
        break;
    }
  };

  // Save data to database
  const saveDataToDatabase = () => {
    console.log("Saving data to database:", userDetails);
    // Add your database saving logic here
  };

  // Clear temporary data when chatbot is closed
  const clearTemporaryData = () => {
    setUserDetails({
      name: "",
      phone: "",
      address: "",
      hospital: "",
    });
    setChatHistory([]);
    setCurrentStep("initial");
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  // Close chatbot when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest(".chatbot-container")) {
        setIsOpen(false);
        clearTemporaryData(); // Clear temporary data
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4">
      {isOpen ? (
        <div className="w-80 h-96 bg-gradient-to-br from-pink-100 to-red-100 backdrop-blur-md border border-white/20 shadow-2xl rounded-xl flex flex-col chatbot-container">
          <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-xl flex justify-between items-center">
            <h3 className="font-bold font-poppins">RaqtKosh Chatbot</h3>
            <button
              onClick={() => {
                setIsOpen(false);
                clearTemporaryData(); // Clear temporary data
              }}
              className="text-white hover:text-gray-200 transition-colors"
            >
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
                  className={`inline-block p-2 rounded-lg ${chat.sender === "user" ? "bg-gradient-to-r from-red-500 to-pink-500 text-white" : "bg-white text-gray-800"}`}
                >
                  {chat.message}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="text-left">
                <span className="inline-block p-2 rounded-lg bg-white text-gray-800">Typing...</span>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-white/20">
            {currentStep === "initial" && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleUserResponse("donate blood")}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
                >
                  Donate Blood
                </button>
                <button
                  onClick={() => handleUserResponse("get blood")}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
                >
                  Get Blood
                </button>
              </div>
            )}
            {currentStep === "donate_option" && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleUserResponse("home")}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
                >
                  Home
                </button>
                <button
                  onClick={() => handleUserResponse("camp")}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
                >
                  Donation Camp
                </button>
              </div>
            )}
            {(currentStep === "donate_home_name" ||
              currentStep === "donate_home_phone" ||
              currentStep === "donate_home_address" ||
              currentStep === "get_blood_hospital_name" ||
              currentStep === "get_blood_hospital_phone" ||
              currentStep === "get_blood_hospital_details") && (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full p-2 border border-white/20 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Type here..."
                />
                <button
                  onClick={() => {
                    handleUserResponse(userInput);
                    setUserInput("");
                  }}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
                >
                  Submit
                </button>
              </div>
            )}
            {currentStep === "get_blood_doctor" && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleUserResponse("yes")}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleUserResponse("no")}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
                >
                  No
                </button>
              </div>
            )}
            {currentStep === "get_blood_option" && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleUserResponse("hospital")}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
                >
                  Hospital
                </button>
                <button
                  onClick={() => handleUserResponse("center")}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
                >
                  Nearby Center
                </button>
              </div>
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