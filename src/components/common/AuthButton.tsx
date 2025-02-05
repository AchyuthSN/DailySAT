import { useEffect, useState } from "react";
import { handleSignOut } from "./server-actions";
import { determineAuthStatus } from "@/lib/authStatus";

  
const AuthButton = () => {
  const [status, setStatus] = useState<boolean | null>(null)

  useEffect(() => {
    const handleGetAuthStatus = async () => {
      const status = await determineAuthStatus()
      setStatus(status)
    }

    handleGetAuthStatus();
  }, [])


  const handleToggleStatus = () => {
    setStatus((prevStatus) => !prevStatus)
  }


    return (
      <>
      {status && (
        <div>
            <button
              onClick={() => { handleSignOut(); handleToggleStatus(); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Sign out
            </button>
        </div>
      )}
      </>
    )
}

export default AuthButton
