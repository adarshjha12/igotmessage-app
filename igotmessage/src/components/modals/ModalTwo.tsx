"use client";

import { useState } from "react";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AlertTriangle, X } from "lucide-react";

interface Props {
    setShowModal: (val: boolean) => void
    setAiButtonClicked: (val: boolean) => void
}
export default function AIFeatureUnavailableModal({setShowModal, setAiButtonClicked} : Props) {
  const [isOpen, setIsOpen] = useState(true); // or control with props

  return (
    <Dialog open={isOpen} onClose={() => {
      setIsOpen(false)
      setShowModal(false)
      setAiButtonClicked(false)
      }} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-md rounded-2xl bg-white dark:bg-[#1f1f1f] p-6 shadow-lg space-y-4 border border-gray-200 dark:border-gray-700 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-6 w-6" />
              <DialogTitle className="text-lg font-semibold">Feature Unavailable</DialogTitle>
            </div>
            <button onClick={() => {
              setIsOpen(false)
              setShowModal(false)
              setAiButtonClicked(false)
              }}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition" />
            </button>
          </div>

          <Description className="text-sm text-gray-600 dark:text-gray-300">
            This AI feature is currently <strong>unavailable</strong> due to server and compute costs.
            We're working on optimizing it and bringing it back soon.
          </Description>

          <div className="mt-4">
            <button
              onClick={() => {
                setIsOpen(false)
                setShowModal(false)
                setAiButtonClicked(false)
            }
            }
              className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white cursor-pointer font-medium hover:opacity-90 transition"
            >
              Okay, Got it
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
