import Link from 'next/link';
import LoginForm from './LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 pt-4 pb-2 lg:px-12">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white hover:text-red-500 transition-colors">
              F1<span className="text-red-500">FANTASY</span>
            </Link>
            
            <Link href="/signup">
              <button className="bg-transparent border border-red-600 hover:bg-red-600 text-red-600 hover:text-white px-6 py-2 rounded-sm font-semibold transition-all">
                Sign Up
              </button>
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="px-6 lg:px-12 flex items-center justify-center min-h-[80vh]">
          <div className="max-w-md w-full">
            <div className="bg-black/30 backdrop-blur-sm border border-gray-700 rounded-lg p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-300">
                  Sign in to manage your F1 fantasy team
                </p>
              </div>

              {/* Login Form Component */}
              <LoginForm />

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Don&#39;t have an account?{' '}
                  <Link href="/signup" className="text-red-500 hover:text-red-400 font-semibold transition-colors">
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}