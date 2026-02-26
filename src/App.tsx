import React, { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { LandingPage } from './pages/LandingPage'
import { SignupPage } from './pages/SignupPage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { AddFundPage } from './pages/AddFundPage'
import { SendPage } from './pages/SendPage'
import { ContactPage } from './pages/ContactPage'
import { PersonalPage } from './pages/PersonalPage'
import { BusinessPage } from './pages/BusinessPage'
import { CommercialPage } from './pages/CommercialPage'
import { InvestmentCryptoPage } from './pages/InvestmentCryptoPage'
import { InheritancePage } from './pages/InheritancePage'
import { LoanPage } from './pages/LoanPage'
import { BillsPage } from './pages/BillsPage'
import { CardsPage } from './pages/CardsPage'
import { StatementPage } from './pages/StatementPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { supabase } from './lib/supabase'

function injectMetaTags() {
  const metaTags = [
    { property: 'og:title', content: 'Bank Vercel' },
    {
      property: 'og:description',
      content:
        'Experience the fusion of classic banking security and futuristic technology. Manage checking, savings, crypto, credit cards, and investments in one seamless banking system.',
    },
    {
      property: 'og:image',
      content:
        'https://cdn.magicpatterns.com/uploads/vSi8HJjfEVuta8MHKtLgQx/vbank.png',
    },
    { property: 'og:url', content: 'https://bankvercel.app' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Bank Vercel' },
    {
      name: 'twitter:description',
      content:
        'Experience the fusion of classic banking security and futuristic technology. Manage checking, savings, crypto, credit cards, and investments in one seamless banking system.',
    },
    {
      name: 'twitter:image',
      content:
        'https://cdn.magicpatterns.com/uploads/vSi8HJjfEVuta8MHKtLgQx/vbank.png',
    },
  ]

  document.title = 'Bank Vercel — Banking Reimagined'

  metaTags.forEach(({ property, name, content }: any) => {
    const selector = property
      ? `meta[property="${property}"]`
      : `meta[name="${name}"]`
    let el = document.querySelector(selector) as HTMLMetaElement | null

    if (!el) {
      el = document.createElement('meta')
      if (property) el.setAttribute('property', property)
      if (name) el.setAttribute('name', name)
      document.head.appendChild(el)
    }

    el.setAttribute('content', content)
  })
}

export function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [session, setSession] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    injectMetaTags()
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)

      if (session) {
        fetchProfile(session.user.id)
        setCurrentPage('dashboard') // ✅ auto go to dashboard after login
      } else {
        setUserProfile(null)
        setCurrentPage('landing')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setCurrentPage('landing')
  }

  const navigate = (page: string) => {
    window.scrollTo(0, 0)
    setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
      </div>
    )
  }

  const protectedPages = [
    'dashboard',
    'add-fund',
    'send',
    'loans',
    'bills',
    'cards',
    'statements',
    'transactions',
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-brand-orange selection:text-white">
      <Navbar
        onNavigate={navigate}
        currentPage={currentPage}
        isLoggedIn={!!session}
        userName={userProfile?.full_name?.split(' ')[0]}
      />

      <main>
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={navigate}
            isAuthenticated={!!session}   // ✅ THIS FIX MAKES IT WORK
          />
        )}

        {currentPage === 'signup' && <SignupPage onNavigate={navigate} />}
        {currentPage === 'login' && <LoginPage onNavigate={navigate} />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'personal' && <PersonalPage onNavigate={navigate} />}
        {currentPage === 'business' && <BusinessPage onNavigate={navigate} />}
        {currentPage === 'commercial' && (
          <CommercialPage onNavigate={navigate} />
        )}
        {currentPage === 'investment-crypto' && (
          <InvestmentCryptoPage onNavigate={navigate} />
        )}
        {currentPage === 'inheritance' && (
          <InheritancePage onNavigate={navigate} />
        )}

        {/* Protected Routes */}
        {currentPage === 'dashboard' && session && (
          <DashboardPage
            onNavigate={navigate}
            userProfile={userProfile}
            onLogout={handleLogout}
          />
        )}

        {currentPage === 'add-fund' && session && (
          <AddFundPage onNavigate={navigate} userProfile={userProfile} />
        )}

        {currentPage === 'send' && session && (
          <SendPage
            onNavigate={navigate}
            userProfile={userProfile}
            onProfileUpdate={() => fetchProfile(session.user.id)}
          />
        )}

        {currentPage === 'loans' && session && (
          <LoanPage onNavigate={navigate} />
        )}

        {currentPage === 'bills' && session && (
          <BillsPage onNavigate={navigate} />
        )}

        {currentPage === 'cards' && session && (
          <CardsPage onNavigate={navigate} userProfile={userProfile} />
        )}

        {currentPage === 'statements' && session && (
          <StatementPage onNavigate={navigate} />
        )}

        {currentPage === 'transactions' && session && (
          <TransactionsPage onNavigate={navigate} userProfile={userProfile} />
        )}

        {/* Access Denied */}
        {protectedPages.includes(currentPage) && !session && (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-400 mb-6">
              Please log in to view this page.
            </p>
            <button
              onClick={() => navigate('login')}
              className="px-6 py-2 bg-gradient-brand rounded-lg text-white"
            >
              Go to Login
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
