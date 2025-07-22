"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.address || "");
          setPhone(data.phone || "");
          setAvatar(data.avatar || "");
        });
    }
  }, [status]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, phone, avatar }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      alert("Profile updated!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data?.secure_url) {
      setAvatar(data.secure_url);
    } else {
      alert("Upload failed");
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  if (status === "loading")
    return (
      <p className="text-center text-teal-600 mt-10 font-semibold">Loading...</p>
    );
  if (status === "unauthenticated")
    return (
      <p className="text-center text-red-600 mt-10 font-semibold">
        Please log in first.
      </p>
    );

  return (
    <div className="max-w-xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-teal-700 mb-6 text-center">
        My Profile
      </h1>

      <div className="space-y-3 text-teal-900 font-medium">
        <p>
          <span className="font-semibold">Name:</span> {session?.user?.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {session?.user?.email}
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <input
          type="text"
          className="w-full border border-teal-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="tel"
          className="w-full border border-teal-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="flex items-center gap-5">
          {avatar ? (
            <div className="relative w-16 h-16 rounded-full ring-4 ring-teal-300 shadow-md overflow-hidden">
              <Image
                src={avatar}
                alt="Avatar"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-400 font-semibold">
              No Avatar
            </div>
          )}
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer px-4 py-2 bg-teal-600 text-white rounded-md shadow hover:bg-teal-700 transition select-none"
          >
            Upload Avatar
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`w-full py-3 rounded-md font-semibold text-white transition
            ${
              loading
                ? "bg-teal-300 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-600 via-emerald-500 to-lime-500 hover:brightness-110 shadow-lg"
            }
          `}
        >
          {loading ? "Saving..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
}
