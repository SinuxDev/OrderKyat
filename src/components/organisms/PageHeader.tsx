"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon, ArrowLeft, Settings } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  showSettings?: boolean;
  onSettings?: () => void;
  icon: LucideIcon;
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  banner?: ReactNode;
  hideMobileActions?: boolean;
}

export default function PageHeader({
  showBack = false,
  onBack,
  showSettings = false,
  onSettings,
  icon: Icon,
  title,
  subtitle,
  actions,
  banner,
  hideMobileActions = false,
}: PageHeaderProps) {
  return (
    <div className="sticky top-0 left-0 right-0 z-10 bg-white border-b border-slate-200 shadow-sm w-full">
      <div className="w-full px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1">
            {/* Back Button */}
            {showBack && onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex-shrink-0 text-slate-700 hover:text-slate-900 hover:bg-slate-100 h-8 sm:h-9 px-1.5 sm:px-2 md:px-3"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden md:inline text-sm ml-1">Back</span>
              </Button>
            )}

            {/* Icon Badge */}
            <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white" />
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-900 truncate">
                {title}
              </h1>
              {subtitle && (
                <div className="text-xs text-slate-600 hidden lg:block">
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          {/* Actions + Settings Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Custom Actions  */}
            {actions && (
              <div
                className={
                  hideMobileActions
                    ? "hidden sm:flex items-center gap-1.5 sm:gap-2"
                    : "flex items-center gap-1.5 sm:gap-2"
                }
              >
                {actions}
              </div>
            )}

            {/* Settings Button  */}
            {showSettings && onSettings && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSettings}
                className="gap-1 sm:gap-1.5 h-8 sm:h-9 px-2 sm:px-3 flex-shrink-0"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-sm">Store Settings</span>
                <span className="hidden sm:inline lg:hidden text-sm">
                  Settings
                </span>
                {/* Mobile */}
                <span className="sr-only sm:not-sr-only">Settings</span>
              </Button>
            )}
          </div>
        </div>

        {/* Optional Banner */}
        <AnimatePresence>
          {banner && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {banner}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
