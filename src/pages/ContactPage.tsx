import React from 'react';
import { Card } from '../components/ui/Card';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
export function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-gray-400">
            We're here to help you with your banking needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="h-full">
            <h2 className="text-2xl font-serif font-bold text-white mb-6">
              Get in Touch
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-white/10 p-3 rounded-lg mr-4">
                  <MapPin className="h-6 w-6 text-brand-magenta" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Visit Us</h3>
                  <p className="text-gray-400">
                    111 W 57th St Unit Quadplex 80
                  </p>
                  <p className="text-gray-400">New York, NY 10019</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white/10 p-3 rounded-lg mr-4">
                  <Mail className="h-6 w-6 text-brand-red" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Email Support</h3>
                  <p className="text-gray-400">support@bankvercel.app</p>
                  <p className="text-sm text-gray-500 mt-1">
                    24/7 Response Time
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white/10 p-3 rounded-lg mr-4">
                  <Phone className="h-6 w-6 text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Phone Support</h3>
                  <p className="text-gray-400">1-600-TO-VECEL</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Mon-Fri, 9am - 6pm EST
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="h-full">
            <h2 className="text-2xl font-serif font-bold text-white mb-6">
              Send a Message
            </h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-4 py-3 rounded-lg glass-input focus:outline-none focus:border-white/30" />

                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-4 py-3 rounded-lg glass-input focus:outline-none focus:border-white/30" />

              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-lg glass-input focus:outline-none focus:border-white/30" />

              <textarea
                rows={4}
                placeholder="How can we help you?"
                className="w-full px-4 py-3 rounded-lg glass-input focus:outline-none focus:border-white/30 resize-none">
              </textarea>
              <button
                type="button"
                className="w-full py-3 rounded-lg bg-gradient-brand text-white font-medium hover:opacity-90 transition-opacity">

                Send Message
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>);

}