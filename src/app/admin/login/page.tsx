"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";

import {
  Eye,
  EyeOff,
  Shield,
  Lock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";


const ERROR_MESSAGES: Record<string, string> = {

  "auth/invalid-credential":
    "Incorrect email or password. Please try again.",

  "auth/invalid-email":
    "Invalid email format.",

  "auth/user-disabled":
    "This account has been disabled.",

  "auth/user-not-found":
    "No account found with this email.",

  "auth/wrong-password":
    "Incorrect email or password.",

  "auth/too-many-requests":
    "Too many attempts. Try again later.",

  "auth/network-request-failed":
    "Network error. Check your connection.",

};



export default function AdminLoginPage() {


  const router = useRouter();


  const {
    setAdminData,
    clearAdminData,
  } = useAdminAuthStore();



  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");




  const handleAdminLogin = async (
    e: React.FormEvent
  ) => {


    e.preventDefault();


    setError("");

    setSuccess("");

    setLoading(true);



    try {


      const cleanEmail =
        email.trim();



      console.log(
        "Login Email:",
        cleanEmail
      );



      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );



      const firebaseUser =
        userCredential.user;



      console.log(
        "Firebase UID:",
        firebaseUser.uid
      );



      const userRef =
        doc(
          db,
          "users",
          firebaseUser.uid
        );



      const userSnap =
        await getDoc(userRef);



      if (!userSnap.exists()) {


        console.log(
          "No Firestore user document"
        );


        await signOut(auth);


        setError(
          "Admin profile not found in database."
        );


        return;

      }



      const userData =
        userSnap.data();



      console.log(
        "Firestore User Data:",
        userData
      );



      const roleCode =
        Number(
          userData.roleCode
        );



      if (
        roleCode !== 0 &&
        roleCode !== 1
      ) {


        await signOut(auth);


        clearAdminData();



        setError(
          "Access denied. Admin permission required."
        );


        return;

      }



      setAdminData(

        firebaseUser,

        userData.roleName ||
          "admin",

        roleCode,

        userData.permissions ||
          []

      );



      setSuccess(
        "Access granted. Redirecting..."
      );



      setTimeout(() => {

        router.push(
          "/admin/dashboard"
        );

      }, 800);



    } catch (err: any) {


      console.error(
        "Admin Login Error:",
        err
      );


      clearAdminData();



      const code =
        err?.code;



      setError(

        ERROR_MESSAGES[code] ||

        "Invalid credentials. Please try again."

      );


    } finally {


      setLoading(false);


    }


  };



  return (

    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-gradient-to-br from-gray-100 via-gray-50 to-white">


      <div className="absolute w-[500px] h-[500px] bg-gray-300/40 blur-[140px] top-[-150px] left-[-150px]" />

      <div className="absolute w-[500px] h-[500px] bg-gray-300/30 blur-[140px] bottom-[-150px] right-[-150px]" />



      <div className="w-full max-w-md z-10">


        <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-2xl p-8">



          <div className="text-center mb-8">


            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-500 to-rose-400 flex items-center justify-center mb-4">

              <Shield
                className="text-white"
                size={22}
              />

            </div>



            <h1 className="text-2xl font-bold text-gray-900">

              Cinderella Admin

            </h1>


            <p className="text-xs text-gray-500 mt-2 tracking-[0.35em] uppercase">

              Secure Login Portal

            </p>


          </div>




          {error && (

            <div className="mb-5 flex gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">

              <AlertCircle size={17}/>

              <p>{error}</p>

            </div>

          )}





          {success && (

            <div className="mb-5 flex gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">

              <CheckCircle2 size={17}/>

              <p>{success}</p>

            </div>

          )}






          <form
            onSubmit={handleAdminLogin}
            className="space-y-5"
          >



            <div>

              <label className="text-xs text-gray-600">
                Email
              </label>


              <input

                type="email"

                required

                value={email}

                onChange={(e)=>
                  setEmail(e.target.value)
                }

                placeholder="admin@cinderella.com"

                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200"

              />

            </div>





            <div>


              <label className="text-xs text-gray-600">
                Password
              </label>



              <div className="relative mt-2">


                <input

                  type={
                    showPassword
                    ? "text"
                    : "password"
                  }

                  required

                  value={password}

                  onChange={(e)=>
                    setPassword(
                      e.target.value
                    )
                  }

                  className="w-full px-4 py-3 rounded-xl border border-gray-200 pr-12"

                />



                <button

                  type="button"

                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }

                  className="absolute right-3 top-3 text-gray-500"

                >

                  {
                    showPassword
                    ?
                    <EyeOff size={20}/>
                    :
                    <Eye size={20}/>
                  }

                </button>


              </div>


            </div>





            <button

              disabled={loading}

              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-gray-500 to-rose-400"

            >

              <span className="flex justify-center gap-2">

                <Lock size={18}/>

                {
                  loading
                  ?
                  "Signing in..."
                  :
                  "Access Admin Panel"
                }

              </span>


            </button>



          </form>





          <p className="text-center text-xs text-gray-500 mt-6">

            Authorized access only • Cinderella System

          </p>



        </div>


      </div>


    </div>

  );

}