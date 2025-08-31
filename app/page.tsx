"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Eye, Search, X, CheckCircle2, XCircle, Smile, Meh, Frown } from "lucide-react"
import Image from "next/image"
import { AmaderDetails } from "./amader-details"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: string
  isWelcome?: boolean
  hasButtons?: boolean
  buttons?: string[]
  isChooseList?: boolean
}

interface UserData {
  language: string
  blockId: number
  blockName: string
  wardId: number
  wardName: string
  boothId: number
  boothName: string
  name: string
  phone: string
  experience?: string // Added experience field
}

interface LocationItem {
  id: number
  name: string
  name_bn: string
  name_ne: string
}

const translations = {
  English: {
    welcome: "Namaskar",
    welcomeMsg: "To begin the chat, select a language",
    chooseOption: "Please choose an option:",
    option1: "1. Know Your Camp details",
    option2: "2. Share your experience",
    selectBlock: "Please select your Block / Municipality",
    selectWard: "Please select your GP / Ward",
    selectBooth: "Please select your Electoral Booth",
    sharePhone: "To receive further updates, please share your mobile number.",
    chooseList: "Choose list",
    searchBlocks: "Search blocks...",
    searchWards: "Search wards...",
    searchBooths: "Search booths...",
    noResults: "No results found",
    typePhone: "To receive further updates, please share your mobile number.",
    typeExperience: "Type your experience...",
    thankYou: "Thank you for sharing your experience with us! Kindly attend the camp on the scheduled date",
    moreDetailsQuestion: 'Know more details about "Amader Para Amader Samadhan"?',
    yes: "Yes",
    no: "No",
    thankYouForUsing: "Thank you for using our service! Kindly attend the camp on the scheduled date",
    qRecordedPriorities: "Were you able to document the most important works/projects in your booth area by priority?",
    qOverallExperience: "How was your overall experience at the Amader Para Amader Samadhan camp?",
    qInformedProjects: "Were you broadly informed about all projects at this camp?",
    qBoothFacility: "How was the availability and use of booth-level facilities?",
    ratingExcellent: "Excellent",
    ratingGood: "Good",
    ratingAverage: "Average",
    ratingPoor: "Poor",
    submit: "Submit",
    surveyTitle: "Share your experience",
    surveySubtitle: "Please answer the following questions",
  },
  বাংলা: {
    welcome: "নমস্কার",
    welcomeMsg: "চ্যাট আরম্ভ করতে, একটি ভাষা নির্বাচন করুন",
    chooseOption: "অনুগ্রহ করে একটি বিকল্প বেছে নিন:",
    option1: "১. আপনার ক্যাম্পের বিবরণ জানুন",
    option2: "২. আপনার অভিজ্ঞতা শেয়ার করুন",
    selectBlock: "অনুগ্রহ করে আপনার ব্লক / পৌরসভা নির্বাচন করুন",
    selectWard: "অনুগ্রহ করে আপনার জিপি / ওয়ার্ড নির্বাচন করুন",
    selectBooth: "অনুগ্রহ করে আপনার নির্বাচনী বুথ নির্বাচন করুন",
    sharePhone: "পরবর্তী আপডেট পেতে, দয়া করে আপনার মোবাইল নম্বর শেয়ার করুন।",
    chooseList: "তালিকা বেছে নিন",
    searchBlocks: "ব্লক খুঁজুন...",
    searchWards: "ওয়ার্ড খুঁজুন...",
    searchBooths: "বুথ খুঁজুন...",
    noResults: "কোন ফলাফল পাওয়া যায়নি",
    typePhone: "পরবর্তী আপডেট পেতে, দয়া করে আপনার মোবাইল নম্বর শেয়ার করুন।",
    typeExperience: "আপনার অভিজ্ঞতা লিখুন...",
    thankYou: "আপনার অভিজ্ঞতা আমাদের সাথে শেয়ার করার জন্য ধন্যবাদ! অনুগ্রহ করে নির্ধারিত তারিখে ক্যাম্পে উপস্থিত থাকুন।",
    moreDetailsQuestion: '"আমাদের পাড়া আমাদের সমাধান" সম্পর্কে আরও বিস্তারিত জানতে চান?',
    yes: "হ্যাঁ",
    no: "না",
    thankYouForUsing: "আমাদের সেবা ব্যবহার করার জন্য ধন্যবাদ! অনুগ্রহ করে নির্ধারিত তারিখে ক্যাম্পে উপস্থিত থাকুন।",
    qRecordedPriorities: "আপনি আপনার বুথ এলাকার সবচেয়ে গুরুত্বপূর্ণ কাজ / প্রকল্প অগ্রাধিকারের ভিত্তিতে নথিভুক্ত করতে পেরেছেন কী না?",
    qOverallExperience: "আমাদের পাড়া আমাদের সমাধান ক্যাম্পে এসে আপনার সামগ্রিক অভিজ্ঞতা কেমন হলো?",
    qInformedProjects: "এই ক্যাম্পে সমস্ত প্রকল্প সম্পর্কে আপনাকে বিস্তৃত রূপে জানানো হয়েছে কী না?",
    qBoothFacility: "বুথ লেভেল ফেসিলিটির সহজলভ্যতা এবং ব্যবহার কেমন ছিল?",
    ratingExcellent: "দারুণ",
    ratingGood: "ভালো",
    ratingAverage: "মোটামুটি",
    ratingPoor: "খারাপ",
    submit: "জমা দিন",
    surveyTitle: "আপনার অভিজ্ঞতা শেয়ার করুন",
    surveySubtitle: "অনুগ্রহ করে নিচের প্রশ্নগুলির উত্তর দিন",
  },
  हिंदी: {
    welcome: "नमस्कार",
    welcomeMsg: "चैट शुरू करने के लिए, कृपया एक भाषा चुनें",
    chooseOption: "कृपया एक विकल्प चुनें:",
    option1: "१. अपने कैंप की जानकारी जानें",
    option2: "२. अपना अनुभव साझा करें",
    selectBlock: "कृपया अपना ब्लॉक / नगरपालिका चुनें",
    selectWard: "कृपया अपना जीपी / वार्ड चुनें",
    selectBooth: "कृपया अपना चुनावी बूथ चुनें",
    sharePhone: "आगे की अपडेट प्राप्त करने के लिए, कृपया अपना मोबाइल नंबर साझा करें।",
    chooseList: "सूची चुनें",
    searchBlocks: "ब्लॉक खोजें...",
    searchWards: "वार्ड खोजें...",
    searchBooths: "बूथ खोजें...",
    noResults: "कोई परिणाम नहीं मिला",
    typePhone: "आगे की अपडेट प्राप्त करने के लिए, कृपया अपना मोबाइल नंबर साझा करें।",
    typeExperience: "अपना अनुभव टाइप करें...",
    thankYou: "अपना अनुभव हमारे साथ साझा करने के लिए धन्यवाद! कृपया निर्धारित तिथि पर शिविर में उपस्थित हों।",
    moreDetailsQuestion: '"हमारा पाड़ा हमारा समाधान" के बारे में और जानना चाहते हैं?',
    yes: "हाँ",
    no: "नहीं",
    thankYouForUsing: "हमारी सेवा का उपयोग करने के लिए धन्यवाद! कृपया निर्धारित तिथि पर शिविर में उपस्थित हों।",
    qRecordedPriorities: "क्या आप अपने बूथ क्षेत्र के सबसे महत्वपूर्ण कार्य/परियोजनाओं को प्राथमिकता के आधार पर दर्ज कर पाए?",
    qOverallExperience: "‘हमारा पाड़ा हमारा समाधान’ कैंप में आपका समग्र अनुभव कैसा रहा?",
    qInformedProjects: "क्या इस कैंप में आपको सभी परियोजनाओं के बारे में विस्तृत रूप से बताया गया?",
    qBoothFacility: "बूथ-स्तर की सुविधाओं की उपलब्धता और उपयोग कैसा था?",
    ratingExcellent: "उत्कृष्ट",
    ratingGood: "अच्छा",
    ratingAverage: "औसत",
    ratingPoor: "खराब",
    submit: "सबमिट करें",
    surveyTitle: "अपना अनुभव साझा करें",
    surveySubtitle: "कृपया निम्न प्रश्नों के उत्तर दें",
  },
 }
 

let userData: UserData | null = null

function t<K extends keyof (typeof translations)["English"]>(key: K): string {
  // normalize arbitrary language inputs to our translation keys
  const raw = (typeof userData?.language === "string" ? userData?.language : "") || "English"

  // map common variants to our keys
  const normalized =
    raw.trim() === "English" || raw.trim().toLowerCase().startsWith("en")
      ? "English"
      : raw.trim() === "বাংলা" || raw.trim().toLowerCase() === "bangla" || raw.trim().toLowerCase().startsWith("bn")
        ? "বাংলা"
        : raw.trim() === "हिंदी" || raw.trim().toLowerCase() === "hindi" || raw.trim().toLowerCase().startsWith("hi")
          ? "हिंदी"
          : "English"

  const enPack = translations["English"]
  const langPack = (translations as any)?.[normalized] as (typeof translations)["English"] | undefined

  // primary from normalized lang, fallback to English, final fallback to key string
  const fromLang = langPack?.[key]
  const fromEn = enPack?.[key]

  // If both are falsy (shouldn't happen), return the key name
  return (fromLang ?? fromEn ?? String(key)) as string
}

export default function WhatsAppChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [currentStep, setCurrentStep] = useState("welcome")
  const [userDataState, setUserDataState] = useState<UserData>({
    language: "",
    blockId: 0,
    blockName: "",
    wardId: 0,
    wardName: "",
    boothId: 0,
    boothName: "",
    name: "",
    phone: "",
  })

  const [blocks, setBlocks] = useState<LocationItem[]>([])
  const [wards, setWards] = useState<LocationItem[]>([])
  const [booths, setBooths] = useState<LocationItem[]>([])
  const [loading, setLoading] = useState(false)

  const [showBlockList, setShowBlockList] = useState(false)
  const [showWardList, setShowWardList] = useState(false)
  const [showBoothList, setShowBoothList] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [showSurvey, setShowSurvey] = useState(false)
  const [survey, setSurvey] = useState<{
    recorded_priorities?: "yes" | "no"
    overall_experience?: "excellent" | "good" | "average" | "poor"
    informed_projects?: "yes" | "no"
    booth_facility?: "excellent" | "good" | "average" | "poor"
  }>({})

  userData = userDataState

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initial welcome message
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const currentTime = `${hours}:${minutes}`

    const welcomeMessage: Message = {
      id: "1",
      text: "",
      isUser: false,
      timestamp: currentTime, // current time here
      isWelcome: true,
      hasButtons: true,
      buttons: ["English", "বাংলা", "हिंदी"],
    }
    setMessages([welcomeMessage])

    loadBlocks()
  }, [])

  const loadBlocks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/blocks")
      const data = await response.json()
      if (data.success) {
        setBlocks(data.data)
      }
    } catch (error) {
      console.error("Error loading blocks:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadWards = async (blockId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/wards?blockId=${blockId}`)
      const data = await response.json()
      if (data.success) {
        setWards(data.data)
      }
    } catch (error) {
      console.error("Error loading wards:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadBooths = async (wardId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/booths?wardId=${wardId}`)
      const data = await response.json()
      if (data.success) {
        setBooths(data.data)
      }
    } catch (error) {
      console.error("Error loading booths:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveUserData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/save-user-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
      const data = await response.json()
      if (data.success) {
        return data.campInfo.message
      }
      throw new Error(data.error)
    } catch (error) {
      console.error("Error saving user data:", error)
      return "Sorry, there was an error processing your request. Please try again."
    } finally {
      setLoading(false)
    }
  }

  const saveUserDataWithData = async (dataToSave: UserData) => {
    try {
      setLoading(true)
      console.log("[v0] Saving user data:", dataToSave) // Debug log
      const response = await fetch("/api/save-user-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      })
      const data = await response.json()
      console.log("[v0] API response:", data) // Debug log
      if (data.success) {
        return data.campInfo.message
      }
      throw new Error(data.error)
    } catch (error) {
      console.error("Error saving user data:", error)
      return "Sorry, there was an error processing your request. Please try again."
    } finally {
      setLoading(false)
    }
  }

  const saveExperience = async (experienceData: {
    name: string
    phone: string
    experience?: string
    language: string
    answers?: {
      recorded_priorities?: "yes" | "no"
      overall_experience?: "excellent" | "good" | "average" | "poor"
      informed_projects?: "yes" | "no"
      booth_facility?: "excellent" | "good" | "average" | "poor"
    }
  }) => {
    try {
      setLoading(true)
      console.log("[v0] Saving experience data:", experienceData)
      const response = await fetch("/api/save-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experienceData),
      })
      const data = await response.json()
      console.log("[v0] Experience API response:", data)
      if (data.success) {
        return data.message
      }
      throw new Error(data.error)
    } catch (error) {
      console.error("Error saving experience:", error)
      return "Sorry, there was an error processing your request. Please try again."
    } finally {
      setLoading(false)
    }
  }

  const fetchCampDetails = async (wardId: number, boothId: number, language: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/camp-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wardId, boothId, language }),
      })
      const data = await response.json()
      if (data.success) {
        return data.campInfo.message as string
      }
      throw new Error(data.error || "Failed to fetch camp details")
    } catch (error) {
      console.error("Error fetching camp details:", error)
      return "Sorry, there was an error fetching camp details. Please try again."
    } finally {
      setLoading(false)
    }
  }

  const getLocalizedName = (item: LocationItem) => {
    const lang = userData.language
    if (lang === "বাংলা") return item.name_bn
    if (lang === "नेपाली") return item.name_ne
    return item.name
  }

  const addMessage = (
    text: string,
    isUser: boolean,
    hasButtons?: boolean,
    buttons?: string[],
    isChooseList?: boolean,
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      hasButtons,
      buttons,
      isChooseList,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleLanguageSelect = (language: string) => {
    setUserDataState((prev) => ({ ...prev, language }))
    addMessage(language, true)

    setTimeout(() => {
      const updatedUserData = { ...userDataState, language }
      const t_temp = (key: keyof typeof translations.English) => {
        const lang = updatedUserData.language as keyof typeof translations
        return translations[lang]?.[key] || translations.English[key]
      }
      addMessage(t_temp("chooseOption"), false, true, [t_temp("option1"), t_temp("option2")])
      setCurrentStep("options")
    }, 1000)
  }

  const handleOptionSelect = (option: string) => {
    addMessage(option, true)

    if (option === t("option1")) {
      setTimeout(() => {
        addMessage(t("selectBlock"), false, true, [t("chooseList")], true)
        setCurrentStep("block")
      }, 1000)
    } else if (option === t("option2")) {
      setTimeout(() => {
        addMessage(t("sharePhone"), false)
        setCurrentStep("experiencePhone")
      }, 1000)
    } else {
      // Fallback: default to experience path if an unrecognized option arrives
      setTimeout(() => {
        addMessage(t("sharePhone"), false)
        setCurrentStep("phone")
      }, 1000)
    }
  }

  const handleBlockSelect = () => {
    setShowBlockList(true)
    setSearchTerm("")
  }

  const selectBlock = (block: LocationItem) => {
    setUserDataState((prev) => ({ ...prev, blockId: block.id, blockName: block.name }))
    addMessage(getLocalizedName(block), true)
    setShowBlockList(false)
    setSearchTerm("")

    loadWards(block.id)

    setTimeout(() => {
      addMessage(t("selectWard"), false, true, [t("chooseList")], true)
      setCurrentStep("ward")
    }, 1000)
  }

  const handleWardSelect = () => {
    setShowWardList(true)
    setSearchTerm("")
  }

  const selectWard = (ward: LocationItem) => {
    setUserDataState((prev) => ({ ...prev, wardId: ward.id, wardName: ward.name }))
    addMessage(getLocalizedName(ward), true)
    setShowWardList(false)
    setSearchTerm("")

    loadBooths(ward.id)

    setTimeout(() => {
      addMessage(t("selectBooth"), false, true, [t("chooseList")], true)
      setCurrentStep("booth")
    }, 1000)
  }

  const handleBoothSelect = () => {
    setShowBoothList(true)
    setSearchTerm("")
  }

  const selectBooth = (booth: LocationItem) => {
    setUserDataState((prev) => ({ ...prev, boothId: booth.id, boothName: booth.name }))
    addMessage(getLocalizedName(booth), true)
    setShowBoothList(false)
    setSearchTerm("")

    // Fetch and display camp details before asking for phone
    ;(async () => {
      const wardId = userDataState.wardId // ward already selected earlier
      const boothId = booth.id
      const lang = userDataState.language
      const campMessage = await fetchCampDetails(wardId, boothId, lang)
      addMessage(campMessage, false)

      setTimeout(() => {
        // You can change this copy if you want a longer string:
        // e.g. "For more information, please share your mobile number"
        addMessage(t("sharePhone"), false)
        setCurrentStep("phone")
      }, 1000)
    })()
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    if (currentStep === "phone") {
      const updatedUserData = { ...userDataState, name: "", phone: inputValue }
      setUserDataState(updatedUserData)
      addMessage(inputValue, true)
      setInputValue("")

      // Save only; do not display camp details again
      try {
        setLoading(true)
        const response = await fetch("/api/save-user-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUserData),
        })
        const data = await response.json()
        if (!data.success) throw new Error(data.error)

        // Proceed with the rest of the flow as before
        setTimeout(() => {
          addMessage(t("moreDetailsQuestion"), false, true, [t("yes"), t("no")])
          setCurrentStep("continue")
        }, 1000)
      } catch (err) {
        console.error("Error saving user data:", err)
        addMessage("Sorry, there was an error processing your request. Please try again.", false)
      } finally {
        setLoading(false)
      }
    } else if (currentStep === "experiencePhone") {
      setUserDataState((prev) => ({ ...prev, name: "", phone: inputValue }))
      addMessage(inputValue, true)
      setInputValue("")

      setTimeout(() => {
        setShowSurvey(true)
        setCurrentStep("survey")
      }, 400)
    } else if (currentStep === "experience") {
      const experienceData = {
        name: "",
        phone: userDataState.phone,
        experience: inputValue,
        language: userDataState.language,
      }

      addMessage(inputValue, true)
      setInputValue("")

      const responseMessage = await saveExperience(experienceData)
      setTimeout(() => {
        addMessage(responseMessage, false)
        setTimeout(() => {
          addMessage(t("moreDetailsQuestion"), false, true, [t("yes"), t("no")])
          setCurrentStep("continue")
        }, 1200)
      }, 600)
    }
  }

  const handleContinueSelect = (option: string) => {
    addMessage(option, true)

    if (option === t("yes")) {
      setTimeout(() => {
        addMessage("Showing details. Expand categories to explore available works.", false)
        setShowDetails(true)
        setCurrentStep("ended")
      }, 500)
    } else {
      setTimeout(() => {
        addMessage(t("thankYouForUsing"), false)
        setCurrentStep("ended")
      }, 500)
    }
  }

  const allSurveyAnswered =
    survey.recorded_priorities && survey.overall_experience && survey.informed_projects && survey.booth_facility

  const submitSurvey = async () => {
    if (!allSurveyAnswered) return
    const payload = {
      name: "",
      phone: userDataState.phone,
      language: userDataState.language,
      answers: survey,
    }
    const responseMessage = await saveExperience(payload)
    setShowSurvey(false)
    setTimeout(() => {
      addMessage(responseMessage, false)
      setTimeout(() => {
        addMessage(t("moreDetailsQuestion"), false, true, [t("yes"), t("no")])
        setCurrentStep("continue")
      }, 1200)
    }, 600)
  }

  const getFilteredList = (list: LocationItem[]) => {
    if (!searchTerm) return list
    return list.filter(
      (item) =>
        getLocalizedName(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--whatsapp-bg)] max-w-md mx-auto shadow-2xl relative">
      {/* Header */}
      <div className="bg-[var(--whatsapp-dark-green)] text-white p-4 flex items-center gap-3 shadow-lg">
        <ArrowLeft className="w-6 h-6" />
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
          <Image src="/apas.jpg" alt="Jalpaiguri Logo" width={32} height={32} className="rounded-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="font-medium text-base">Amader Para Amader Samadhan Jalpaiguri</h1>
          <p className="text-xs text-white/80 flex items-center gap-1">
            {isOnline ? (
              <>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                online
              </>
            ) : (
              "last seen recently"
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Eye className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity" />
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20 relative">
        <div
          className="fixed inset-0 top-[72px] bottom-0 pointer-events-none z-0"
          style={{
            backgroundImage: "url(/apas-removebg.png)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundAttachment: "fixed",
          }}
        />

        <div className="relative z-10">
          {messages.map((message) => (
            <div key={message.id}>
              {message.isWelcome ? (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl p-6 max-w-xs shadow-lg border border-gray-100">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <Image
                          src="/darjeeling-logo.png"
                          alt="Jalpaiguri Logo"
                          width={100}
                          height={100}
                          className="rounded-full shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center space-y-3 text-sm leading-relaxed">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-800">{t("welcome")}</p>
                        <p className="text-gray-600">{t("welcomeMsg")}</p>
                      </div>
                    </div>
                    {message.hasButtons && (
                      <div className="flex gap-2 mt-6 justify-center">
                        {message.buttons?.map((button, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleLanguageSelect(button)}
                            className="text-sm px-4 py-2 border-2 border-[var(--whatsapp-green)] text-gray-800 bg-white font-medium hover:bg-[var(--whatsapp-green)] hover:text-white transition-all duration-200 rounded-full shadow-sm hover:shadow-md"
                          >
                            {button}
                          </Button>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-[var(--whatsapp-timestamp)] text-right mt-3">{message.timestamp}</div>
                  </div>
                </div>
              ) : (
                <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-2xl p-4 max-w-xs shadow-md ${
                      message.isUser
                        ? "bg-[var(--whatsapp-light-green)] text-black rounded-br-md"
                        : "bg-white text-black rounded-bl-md border border-gray-100"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    {message.hasButtons && (
                      <div className="flex flex-col gap-3 mt-4">
                        {message.buttons?.map((button, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (currentStep === "options") {
                                handleOptionSelect(button)
                              } else if (currentStep === "block" && message.isChooseList) {
                                handleBlockSelect()
                              } else if (currentStep === "ward" && message.isChooseList) {
                                handleWardSelect()
                              } else if (currentStep === "booth" && message.isChooseList) {
                                handleBoothSelect()
                              } else if (currentStep === "continue") {
                                handleContinueSelect(button)
                              }
                            }}
                            className="text-sm px-4 py-2 border-2 border-[var(--whatsapp-green)] text-gray-800 bg-white font-medium hover:bg-[var(--whatsapp-green)] hover:text-white transition-all duration-200 rounded-full shadow-sm hover:shadow-md"
                          >
                            {button}
                          </Button>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-[var(--whatsapp-timestamp)] text-right mt-2 flex items-center justify-end gap-1">
                      {message.timestamp}
                      {message.isUser && <span className="text-blue-500">✓✓</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {(currentStep === "phone" || currentStep === "experiencePhone" || currentStep === "experience") && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-[var(--whatsapp-bg)] border-t border-gray-200">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  currentStep === "phone" || currentStep === "experiencePhone"
                    ? t("typePhone")
                    : currentStep === "experience"
                      ? t("typeExperience")
                      : ""
                }
                className="rounded-full border-none bg-white pr-12 shadow-sm focus:shadow-md transition-shadow"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              size="icon"
              disabled={loading}
              className="rounded-full bg-[var(--whatsapp-green)] hover:bg-[var(--whatsapp-green)]/90 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {showBlockList && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800">{t("selectBlock")}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowBlockList(false)
                  setSearchTerm("")
                }}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("searchBlocks")}
                className="pl-10 rounded-full border-gray-200 focus:border-[var(--whatsapp-green)]"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {loading ? (
                <p className="text-center text-gray-500 py-4">Loading...</p>
              ) : getFilteredList(blocks).length > 0 ? (
                getFilteredList(blocks).map((block) => (
                  <Button
                    key={block.id}
                    variant="ghost"
                    className="w-full justify-start rounded-xl hover:bg-[var(--whatsapp-green)]/10 hover:text-[var(--whatsapp-green)] transition-colors p-3"
                    onClick={() => selectBlock(block)}
                  >
                    {getLocalizedName(block)}
                  </Button>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">{t("noResults")}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showWardList && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800">{t("selectWard")}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowWardList(false)
                  setSearchTerm("")
                }}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("searchWards")}
                className="pl-10 rounded-full border-gray-200 focus:border-[var(--whatsapp-green)]"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {loading ? (
                <p className="text-center text-gray-500 py-4">Loading...</p>
              ) : getFilteredList(wards).length > 0 ? (
                getFilteredList(wards).map((ward) => (
                  <Button
                    key={ward.id}
                    variant="ghost"
                    className="w-full justify-start rounded-xl hover:bg-[var(--whatsapp-green)]/10 hover:text-[var(--whatsapp-green)] transition-colors p-3"
                    onClick={() => selectWard(ward)}
                  >
                    {getLocalizedName(ward)}
                  </Button>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">{t("noResults")}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showBoothList && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800">{t("selectBooth")}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowBoothList(false)
                  setSearchTerm("")
                }}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("searchBooths")}
                className="pl-10 rounded-full border-gray-200 focus:border-[var(--whatsapp-green)]"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {loading ? (
                <p className="text-center text-gray-500 py-4">Loading...</p>
              ) : getFilteredList(booths).length > 0 ? (
                getFilteredList(booths).map((booth) => (
                  <Button
                    key={booth.id}
                    variant="ghost"
                    className="w-full justify-start rounded-xl hover:bg-[var(--whatsapp-green)]/10 hover:text-[var(--whatsapp-green)] transition-colors p-3"
                    onClick={() => selectBooth(booth)}
                  >
                    {getLocalizedName(booth)}
                  </Button>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">{t("noResults")}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showDetails && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center md:items-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-t-3xl md:rounded-3xl p-6 w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDetails(false)}
                className="rounded-full hover:bg-gray-100"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              <AmaderDetails />
            </div>
          </div>
        </div>
      )}

      {showSurvey && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center md:items-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-t-3xl md:rounded-3xl p-6 w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 text-pretty text-balance">{t("surveyTitle")}</h3>
                <p className="text-sm text-gray-600 mt-1">{t("surveySubtitle")}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSurvey(false)}
                className="rounded-full hover:bg-gray-100"
                aria-label="Close survey"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {/* Q1 Yes/No */}
              <div>
                <p className="font-semibold text-gray-800 mb-3 text-pretty">
                  {t("qRecordedPriorities") || translations["English"].qRecordedPriorities}
                </p>
                <div className="flex flex-col gap-3">
                  <SurveyPill
                    active={survey.recorded_priorities === "yes"}
                    onClick={() => setSurvey((s) => ({ ...s, recorded_priorities: "yes" }))}
                    icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
                    label={t("yes")}
                  />
                  <SurveyPill
                    active={survey.recorded_priorities === "no"}
                    onClick={() => setSurvey((s) => ({ ...s, recorded_priorities: "no" }))}
                    icon={<XCircle className="w-6 h-6 text-red-500" />}
                    label={t("no")}
                  />
                </div>
              </div>

              {/* Q2 4-point */}
              <div>
                <p className="font-semibold text-gray-800 mb-3 text-pretty">
                  {t("qOverallExperience") || translations["English"].qOverallExperience}
                </p>
                <div className="flex flex-col gap-3">
                  <SurveyPill
                    active={survey.overall_experience === "excellent"}
                    onClick={() => setSurvey((s) => ({ ...s, overall_experience: "excellent" }))}
                    icon={<Smile className="w-6 h-6 text-amber-500" />}
                    label={t("ratingExcellent")}
                  />
                  <SurveyPill
                    active={survey.overall_experience === "good"}
                    onClick={() => setSurvey((s) => ({ ...s, overall_experience: "good" }))}
                    icon={<Smile className="w-6 h-6 text-yellow-500" />}
                    label={t("ratingGood")}
                  />
                  <SurveyPill
                    active={survey.overall_experience === "average"}
                    onClick={() => setSurvey((s) => ({ ...s, overall_experience: "average" }))}
                    icon={<Meh className="w-6 h-6 text-gray-500" />}
                    label={t("ratingAverage")}
                  />
                  <SurveyPill
                    active={survey.overall_experience === "poor"}
                    onClick={() => setSurvey((s) => ({ ...s, overall_experience: "poor" }))}
                    icon={<Frown className="w-6 h-6 text-blue-500" />}
                    label={t("ratingPoor")}
                  />
                </div>
              </div>

              {/* Q3 Yes/No */}
              <div>
                <p className="font-semibold text-gray-800 mb-3 text-pretty">
                  {t("qInformedProjects") || translations["English"].qInformedProjects}
                </p>
                <div className="flex flex-col gap-3">
                  <SurveyPill
                    active={survey.informed_projects === "yes"}
                    onClick={() => setSurvey((s) => ({ ...s, informed_projects: "yes" }))}
                    icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
                    label={t("yes")}
                  />
                  <SurveyPill
                    active={survey.informed_projects === "no"}
                    onClick={() => setSurvey((s) => ({ ...s, informed_projects: "no" }))}
                    icon={<XCircle className="w-6 h-6 text-red-500" />}
                    label={t("no")}
                  />
                </div>
              </div>

              {/* Q4 4-point */}
              <div>
                <p className="font-semibold text-gray-800 mb-3 text-pretty">
                  {t("qBoothFacility") || translations["English"].qBoothFacility}
                </p>
                <div className="flex flex-col gap-3">
                  <SurveyPill
                    active={survey.booth_facility === "excellent"}
                    onClick={() => setSurvey((s) => ({ ...s, booth_facility: "excellent" }))}
                    icon={<Smile className="w-6 h-6 text-amber-500" />}
                    label={t("ratingExcellent")}
                  />
                  <SurveyPill
                    active={survey.booth_facility === "good"}
                    onClick={() => setSurvey((s) => ({ ...s, booth_facility: "good" }))}
                    icon={<Smile className="w-6 h-6 text-yellow-500" />}
                    label={t("ratingGood")}
                  />
                  <SurveyPill
                    active={survey.booth_facility === "average"}
                    onClick={() => setSurvey((s) => ({ ...s, booth_facility: "average" }))}
                    icon={<Meh className="w-6 h-6 text-gray-500" />}
                    label={t("ratingAverage")}
                  />
                  <SurveyPill
                    active={survey.booth_facility === "poor"}
                    onClick={() => setSurvey((s) => ({ ...s, booth_facility: "poor" }))}
                    icon={<Frown className="w-6 h-6 text-blue-500" />}
                    label={t("ratingPoor")}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={submitSurvey}
                disabled={!allSurveyAnswered || loading}
                className="w-full rounded-full bg-[var(--whatsapp-green)] hover:bg-[var(--whatsapp-green)]/90"
              >
                {t("submit")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SurveyPill({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-2xl p-4 transition-colors border relative
        focus:outline-none focus:ring-2 focus:ring-blue-200
        ${active ? "bg-blue-50 border-blue-400" : "bg-white border-gray-200 hover:bg-gray-50"}`}
      aria-pressed={active}
    >
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 text-left font-medium text-gray-800">{label}</div>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${active ? "border-blue-600" : "border-gray-300"}`}
      >
        {active && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
      </div>
    </button>
  )
}
