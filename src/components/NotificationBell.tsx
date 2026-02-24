import React, { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NotificationBellProps {
  userId: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      const { data } = await supabase.
      from('profiles').
      select('notifications').
      eq('user_id', userId).
      single();

      if (data?.notifications) {
        const notifs = Array.isArray(data.notifications) ?
        data.notifications :
        [];
        setNotifications(notifs);
      }
    };

    fetchNotifications();

    const channel = supabase.
    channel(`notifications-${userId}`).
    on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        const newNotifs = payload.new.notifications;
        if (Array.isArray(newNotifs)) {
          setNotifications(newNotifs);
        }
      }
    ).
    subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const notificationCount = notifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleOpen}
        className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors relative">

        <Bell className="h-5 w-5" />
        {notificationCount > 0 &&
        <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#0a0a0a]">
            {notificationCount}
          </span>
        }
      </button>

      {/* MOBILE + DESKTOP MODAL */}
      {isOpen &&
      <>
          {/* Overlay */}
          <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsOpen(false)} />


          {/* Centered Panel */}
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              
              <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Notifications</h3>
                <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white text-sm">

                  Close
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ?
              <div className="p-8 text-center text-gray-500 text-sm">
                    No notifications yet
                  </div> :

              <div className="divide-y divide-white/5">
                    {notifications.
                slice().
                reverse().
                map((notif, idx) =>
                <div
                  key={idx}
                  className="p-4 hover:bg-white/5 transition-colors">

                          <p className="text-sm text-gray-300">{notif}</p>
                        </div>
                )}
                  </div>
              }
              </div>

            </div>
          </div>
        </>
      }
    </div>);

}