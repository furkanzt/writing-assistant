"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Brain, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    targetExam: "",
  })
  const [emailError, setEmailError] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [userCode, setUserCode] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()

  const validateEmail = (email: string) => {
    // Check if email ends with @metu.edu.tr
    if (!email.endsWith("@metu.edu.tr")) {
      setEmailError("Email must be a valid METU email address (@metu.edu.tr)")
      return false
    }
    setEmailError("")
    return true
  }

  const handleSendVerification = () => {
    if (!validateEmail(formData.email)) return

    // Generate a random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setVerificationCode(code)
    setVerificationSent(true)

    // In a real app, you would send this code via email
    // For demo purposes, we'll just show it in the UI
    console.log(`Verification code: ${code}`)
  }

  const handleVerifyCode = () => {
    if (userCode === verificationCode) {
      setIsVerified(true)
    } else {
      alert("Invalid verification code. Please try again.")
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isVerified) {
      alert("Please verify your email before registering.")
      return
    }

    // Save user data to localStorage
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      targetExam: formData.targetExam,
      verified: true,
    }
    localStorage.setItem("userData", JSON.stringify(userData))

    router.push("/dashboard")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "email") {
      validateEmail(value)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Brain className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join and start improving your writing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@metu.edu.tr"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}

              {!verificationSent && !isVerified && formData.email && !emailError && (
                <Button type="button" variant="outline" className="mt-2 w-full" onClick={handleSendVerification}>
                  Send Verification Code
                </Button>
              )}

              {verificationSent && !isVerified && (
                <div className="mt-2 space-y-2">
                  <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Verification Required</AlertTitle>
                    <AlertDescription>
                      A verification code has been sent to your email. Please enter it below.
                      <br />
                      <span className="text-xs">(For demo: {verificationCode})</span>
                    </AlertDescription>
                  </Alert>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter verification code"
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                    />
                    <Button type="button" onClick={handleVerifyCode}>
                      Verify
                    </Button>
                  </div>
                </div>
              )}

              {isVerified && (
                <Alert className="mt-2 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Email Verified</AlertTitle>
                  <AlertDescription>Your email has been successfully verified.</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetExam">Target Exam</Label>
              <Select onValueChange={(value) => handleInputChange("targetExam", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your target exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ielts">IELTS</SelectItem>
                  <SelectItem value="toefl">TOEFL</SelectItem>
                  <SelectItem value="metu-epe">METU EPE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={
                !isVerified || !formData.firstName || !formData.lastName || !formData.password || !formData.targetExam
              }
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-red-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
