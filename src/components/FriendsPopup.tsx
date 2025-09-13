"use client";
import { useState } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { LineFriend } from "@/lib/line-auth";

interface FriendsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: any) => void;
  friends: LineFriend[];
}

export default function FriendsPopup({ isOpen, onClose, onSelectContact, friends }: FriendsPopupProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = friends.filter(friend =>
    friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFriendClick = (friend: any) => {
    onSelectContact(friend);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Friends</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {filteredFriends.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.userId}
                    onClick={() => handleFriendClick(friend)}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="relative w-16 h-16">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img 
                          src={friend.pictureUrl || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50)}.jpg`}
                          alt={friend.displayName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 50)}.jpg`;
                          }}
                        />
                      </div>
                      {/* Random notification count for demo */}
                      {Math.random() > 0.7 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          {Math.floor(Math.random() * 3) + 1}
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 truncate">{friend.displayName}</p>
                      <p className="text-xs font-medium text-gray-500">
                        {friend.statusMessage || 'LINE Friend'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No friends found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
