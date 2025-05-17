import LoginForm from "@/components/login-form"

export const metadata = {
  title: "Login - GemnEyes EPOS",
  description: "Login to the GemnEyes Hair and Beauty EPOS system",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  )
}
