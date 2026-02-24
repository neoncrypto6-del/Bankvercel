import React, { useEffect, useState, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabase';
import { NotificationBell } from '../components/NotificationBell';
import {
  TrendingUp,
  CreditCard,
  FileText,
  Settings,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  User,
  Upload,
  X,
  Check,
  BarChart2,
  Users,
  Loader2,
  Wallet,
  ChevronRight,
  Lock,
  Key } from
'lucide-react';
interface DashboardPageProps {
  onNavigate: (page: string) => void;
  userProfile: any;
  onLogout: () => void;
}
export function DashboardPage({
  onNavigate,
  userProfile,
  onLogout
}: DashboardPageProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<
    'profile' | 'verification' | 'kin' | 'password' | 'pin'>(
    'profile');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(userProfile?.balance ?? 0);
  const [txLoading, setTxLoading] = useState(true);
  const prevBalanceRef = useRef<number>(userProfile?.balance ?? 0);
  // Next of kin state
  const [kinData, setKinData] = useState<any>(null);
  const [kinForm, setKinForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    dob: ''
  });
  const [kinLoading, setKinLoading] = useState(false);
  const [kinSuccess, setKinSuccess] = useState(false);
  const [kinError, setKinError] = useState<string | null>(null);
  // Password Change State
  const [passForm, setPassForm] = useState({
    old: '',
    new: '',
    confirm: ''
  });
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  // PIN Creation State
  const [pinForm, setPinForm] = useState({
    pin: '',
    confirm: ''
  });
  const [pinLoading, setPinLoading] = useState(false);
  const [pinMsg, setPinMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  // Verification uploads
  const [uploadStatus, setUploadStatus] = useState<
    Record<string, 'idle' | 'uploading' | 'done' | 'error'>>(
    {});
  const [uploadError, setUploadError] = useState<Record<string, string>>({});
  const [nokUploadStatus, setNokUploadStatus] = useState<
    Record<string, 'idle' | 'uploading' | 'done' | 'error'>>(
    {});
  const [nokUploadError, setNokUploadError] = useState<Record<string, string>>(
    {}
  );
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const nokFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  // Fetch transactions
  useEffect(() => {
    if (!userProfile?.user_id) return;
    const fetchTransactions = async () => {
      setTxLoading(true);
      const { data, error } = await supabase.
      from('transactions').
      select('*').
      eq('user_id', userProfile.user_id).
      order('created_at', {
        ascending: false
      }).
      limit(4); // Only fetch latest 4 for dashboard
      if (!error && data) setTransactions(data);
      setTxLoading(false);
    };
    fetchTransactions();
  }, [userProfile?.user_id]);
  // Fetch Next of Kin Data
  useEffect(() => {
    if (userProfile?.user_id && showSettings && settingsTab === 'kin') {
      const fetchKin = async () => {
        const { data } = await supabase.
        from('next_of_kin').
        select('*').
        eq('user_id', userProfile.user_id).
        single();
        if (data) {
          setKinData(data);
          setKinForm({
            name: data.name || '',
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
            dob: data.dob || ''
          });
        }
      };
      fetchKin();
    }
  }, [userProfile?.user_id, showSettings, settingsTab]);
  // Realtime balance subscription
  useEffect(() => {
    if (!userProfile?.user_id) return;
    setBalance(userProfile?.balance ?? 0);
    prevBalanceRef.current = userProfile?.balance ?? 0;
    const channel = supabase.
    channel(`profile-balance-${userProfile.user_id}`).
    on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `user_id=eq.${userProfile.user_id}`
      },
      async (payload) => {
        const newBal = payload.new?.balance;
        const oldBal = prevBalanceRef.current;
        if (newBal !== undefined && newBal !== oldBal) {
          setBalance(newBal);
          const diff = newBal - oldBal;
          // Auto-insert a transaction record for admin balance changes
          const txRecord = {
            user_id: userProfile.user_id,
            type: diff > 0 ? 'received' : 'sent',
            amount: Math.abs(diff),
            description:
            diff > 0 ?
            `$${Math.abs(diff).toFixed(2)} has been added to your account` :
            `$${Math.abs(diff).toFixed(2)} withdrawn from your balance`,
            created_at: new Date().toISOString()
          };
          const { data: inserted } = await supabase.
          from('transactions').
          insert([txRecord]).
          select().
          single();
          if (inserted) {
            setTransactions((prev) => [inserted, ...prev].slice(0, 4));
          }
          prevBalanceRef.current = newBal;
        }
      }
    ).
    subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile?.user_id, userProfile?.balance]);
  // Realtime new transaction subscription
  useEffect(() => {
    if (!userProfile?.user_id) return;
    const channel = supabase.
    channel(`transactions-feed-${userProfile.user_id}`).
    on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'transactions',
        filter: `user_id=eq.${userProfile.user_id}`
      },
      (payload) => {
        setTransactions((prev) => {
          // Avoid duplicates
          if (prev.find((t) => t.id === payload.new.id)) return prev;
          return [payload.new, ...prev].slice(0, 4);
        });
      }
    ).
    subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile?.user_id]);
  // Upload verification doc
  const handleDocUpload = async (docType: string, file: File) => {
    if (!userProfile?.user_id) return;
    setUploadStatus((s) => ({
      ...s,
      [docType]: 'uploading'
    }));
    setUploadError((e) => ({
      ...e,
      [docType]: ''
    }));
    try {
      const ext = file.name.split('.').pop() || 'bin';
      const safeName = `${userProfile.user_id}/verification/${docType}-${Date.now()}.${ext}`;
      const { error: storageError } = await supabase.storage.
      from('documents').
      upload(safeName, file, {
        upsert: true,
        contentType: file.type || 'application/octet-stream'
      });
      if (storageError) throw new Error(storageError.message);
      const { data: urlData } = supabase.storage.
      from('documents').
      getPublicUrl(safeName);
      const { error: dbError } = await supabase.from('documents').insert([
      {
        user_id: userProfile.user_id,
        doc_type: docType,
        file_url: urlData.publicUrl
      }]
      );
      if (dbError) throw new Error(dbError.message);
      setUploadStatus((s) => ({
        ...s,
        [docType]: 'done'
      }));
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadStatus((s) => ({
        ...s,
        [docType]: 'error'
      }));
      setUploadError((e) => ({
        ...e,
        [docType]: err.message || 'Upload failed'
      }));
    }
  };
  // Upload next-of-kin doc
  const handleNokDocUpload = async (docType: string, file: File) => {
    if (!userProfile?.user_id) return;
    setNokUploadStatus((s) => ({
      ...s,
      [docType]: 'uploading'
    }));
    setNokUploadError((e) => ({
      ...e,
      [docType]: ''
    }));
    try {
      const ext = file.name.split('.').pop() || 'bin';
      const safeName = `${userProfile.user_id}/nok/${docType}-${Date.now()}.${ext}`;
      const { error: storageError } = await supabase.storage.
      from('documents').
      upload(safeName, file, {
        upsert: true,
        contentType: file.type || 'application/octet-stream'
      });
      if (storageError) throw new Error(storageError.message);
      const { data: urlData } = supabase.storage.
      from('documents').
      getPublicUrl(safeName);
      const { error: dbError } = await supabase.from('documents').insert([
      {
        user_id: userProfile.user_id,
        doc_type: `nok-${docType}`,
        file_url: urlData.publicUrl
      }]
      );
      if (dbError) throw new Error(dbError.message);
      setNokUploadStatus((s) => ({
        ...s,
        [docType]: 'done'
      }));
    } catch (err: any) {
      console.error('NOK upload error:', err);
      setNokUploadStatus((s) => ({
        ...s,
        [docType]: 'error'
      }));
      setNokUploadError((e) => ({
        ...e,
        [docType]: err.message || 'Upload failed'
      }));
    }
  };
  const handleSaveKin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.user_id) return;
    setKinLoading(true);
    setKinError(null);
    try {
      const { data, error } = await supabase.
      from('next_of_kin').
      upsert(
        [
        {
          user_id: userProfile.user_id,
          name: kinForm.name,
          address: kinForm.address,
          phone: kinForm.phone,
          email: kinForm.email,
          dob: kinForm.dob,
          is_verified: false
        }],

        {
          onConflict: 'user_id'
        }
      ).
      select().
      single();
      if (error) throw error;
      setKinData(data);
      setKinSuccess(true);
      setTimeout(() => setKinSuccess(false), 3000);
    } catch (err: any) {
      setKinError(err.message || 'Failed to save next of kin');
    } finally {
      setKinLoading(false);
    }
  };
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    if (passForm.new !== passForm.confirm) {
      setPassMsg({
        type: 'error',
        text: 'New passwords do not match'
      });
      return;
    }
    if (passForm.new.length < 6) {
      setPassMsg({
        type: 'error',
        text: 'Password must be at least 6 characters'
      });
      return;
    }
    setPassLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passForm.new
      });
      if (error) throw error;
      // Also update the plain text password in profiles table as requested
      await supabase.
      from('profiles').
      update({
        password: passForm.new
      }).
      eq('user_id', userProfile.user_id);
      setPassMsg({
        type: 'success',
        text: 'Password updated successfully'
      });
      setPassForm({
        old: '',
        new: '',
        confirm: ''
      });
    } catch (err: any) {
      setPassMsg({
        type: 'error',
        text: err.message || 'Failed to update password'
      });
    } finally {
      setPassLoading(false);
    }
  };
  const handleCreatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinMsg(null);
    if (pinForm.pin.length !== 4 || !/^\d+$/.test(pinForm.pin)) {
      setPinMsg({
        type: 'error',
        text: 'PIN must be 4 digits'
      });
      return;
    }
    if (pinForm.pin !== pinForm.confirm) {
      setPinMsg({
        type: 'error',
        text: 'PINs do not match'
      });
      return;
    }
    setPinLoading(true);
    try {
      const { error } = await supabase.
      from('profiles').
      update({
        pin: pinForm.pin
      }).
      eq('user_id', userProfile.user_id);
      if (error) throw error;
      setPinMsg({
        type: 'success',
        text: 'PIN created successfully'
      });
      setPinForm({
        pin: '',
        confirm: ''
      });
    } catch (err: any) {
      setPinMsg({
        type: 'error',
        text: err.message || 'Failed to create PIN'
      });
    } finally {
      setPinLoading(false);
    }
  };
  const verificationDocs = [
  {
    key: 'id-front',
    label: 'ID Card Front'
  },
  {
    key: 'id-back',
    label: 'ID Card Back'
  },
  {
    key: 'ssn-doc',
    label: 'SSN Document'
  },
  {
    key: 'w2',
    label: 'W2 Document'
  },
  {
    key: 'proof-of-address',
    label: 'Proof of Address'
  }];

  const nokDocs = [
  {
    key: 'id-front',
    label: 'ID Card Front'
  },
  {
    key: 'id-back',
    label: 'ID Card Back'
  },
  {
    key: 'w2',
    label: 'W2 Document'
  },
  {
    key: 'proof-of-address',
    label: 'Proof of Address'
  }];

  const quickAccess = [
  {
    icon: DollarSign,
    label: 'Loan',
    action: () => onNavigate('loans')
  },
  {
    icon: TrendingUp,
    label: 'Invest',
    action: () => onNavigate('investment-crypto')
  },
  {
    icon: FileText,
    label: 'Bills',
    action: () => onNavigate('bills')
  },
  {
    icon: CreditCard,
    label: 'Cards',
    action: () => onNavigate('cards')
  },
  {
    icon: BarChart2,
    label: 'Statement',
    action: () => onNavigate('statements')
  },
  {
    icon: Wallet,
    label: 'Wallet',
    action: () => onNavigate('add-fund')
  }];

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };
  const UploadButton = ({
    docKey,
    label,
    status,
    errorMsg,
    onUpload,
    inputRef







  }: {docKey: string;label: string;status: string;errorMsg?: string;onUpload: (key: string, file: File) => void;inputRef: React.MutableRefObject<Record<string, HTMLInputElement | null>>;}) =>
  <div>
      <input
      type="file"
      accept="image/*,.pdf"
      ref={(el) => {
        inputRef.current[docKey] = el;
      }}
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onUpload(docKey, file);
        e.target.value = '';
      }} />

      <button
      type="button"
      onClick={() => inputRef.current[docKey]?.click()}
      disabled={status === 'uploading'}
      className={`w-full border border-dashed rounded-xl p-5 text-center transition-colors ${status === 'done' ? 'border-green-500/40 bg-green-500/10' : status === 'error' ? 'border-red-500/40 bg-red-500/10' : 'border-white/20 hover:bg-white/5 hover:border-white/30'}`}>

        {status === 'uploading' ?
      <Loader2 className="h-6 w-6 text-brand-orange mx-auto mb-2 animate-spin" /> :
      status === 'done' ?
      <Check className="h-6 w-6 text-green-400 mx-auto mb-2" /> :

      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
      }
        <p
        className={`text-sm font-medium ${status === 'done' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-white'}`}>

          {label}
        </p>
        <p className="text-xs mt-1 text-gray-500">
          {status === 'done' ?
        'Uploaded ✓' :
        status === 'uploading' ?
        'Uploading...' :
        status === 'error' ?
        'Failed — click to retry' :
        'Click to upload'}
        </p>
        {status === 'error' && errorMsg &&
      <p className="text-xs mt-1 text-red-400 break-words">{errorMsg}</p>
      }
      </button>
    </div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">
              Welcome, {userProfile?.full_name?.split(' ')[0] || 'User'}!
            </h1>
            <div className="flex items-center mt-2 space-x-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-gray-300 border border-white/10 capitalize">
                {userProfile?.account_type || 'Checking'} Account
              </span>
              {userProfile?.is_verified &&
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/20 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </span>
              }
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <NotificationBell userId={userProfile?.user_id} />

            <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Settings">

              <Settings className="h-5 w-5" />
            </button>
            <Button variant="outline" onClick={onLogout}>
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Balance Card */}
            <Card className="relative overflow-hidden border border-white/10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-brand"></div>
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <img
                  src="/vbank.png"
                  alt=""
                  className="h-40 w-auto" />

              </div>
              <div className="relative z-10 pt-2">
                <p className="text-gray-400 text-sm mb-1">Total Balance</p>
                <h2 className="text-5xl font-bold text-white mb-2">
                  $
                  {balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </h2>
                <p className="text-xs text-gray-500 mb-6">
                  Acct: ****{userProfile?.account_number?.slice(-4) || '0000'}
                </p>
                <div className="flex gap-4">
                  <Button className="flex-1" onClick={() => onNavigate('send')}>
                    <ArrowUpRight className="mr-2 h-4 w-4" /> Send Money
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => onNavigate('add-fund')}>

                    <ArrowDownLeft className="mr-2 h-4 w-4" /> Add Funds
                  </Button>
                </div>
              </div>
            </Card>

            {/* Transaction History */}
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif font-semibold text-white">
                  Transaction History
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => onNavigate('transactions')}>

                  See All <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>

              {txLoading ?
              <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
                </div> :
              transactions.length === 0 ?
              <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No transactions yet</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your transaction history will appear here
                  </p>
                </div> :

              <div className="space-y-3">
                  {transactions.map((tx) =>
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">

                      <div className="flex items-center gap-4">
                        <div
                      className={`p-2 rounded-full ${tx.type === 'received' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/10 text-red-400'}`}>

                          {tx.type === 'received' ?
                      <ArrowDownLeft className="h-5 w-5" /> :

                      <ArrowUpRight className="h-5 w-5" />
                      }
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {tx.description || (
                        tx.type === 'received' ? 'Received' : 'Sent')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(tx.created_at)}
                          </p>
                        </div>
                      </div>
                      <span
                    className={`font-semibold ${tx.type === 'received' ? 'text-green-400' : 'text-red-400'}`}>

                        {tx.type === 'received' ? '+' : '-'}$
                        {Math.abs(tx.amount).toFixed(2)}
                      </span>
                    </div>
                )}
                </div>
              }
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Access */}
            <Card title="Quick Access">
              <div className="grid grid-cols-3 gap-3">
                {quickAccess.map((item, idx) =>
                <button
                  key={idx}
                  onClick={item.action}
                  className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/10 transition-colors gap-2 group">

                    <div className="p-3 rounded-full bg-white/5 group-hover:bg-brand-orange/20 transition-colors">
                      <item.icon className="h-5 w-5 text-gray-300 group-hover:text-brand-orange" />
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-white">
                      {item.label}
                    </span>
                  </button>
                )}
              </div>
            </Card>

            {/* Account Details */}
            <Card title="Account Details">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Account Number
                  </p>
                  <p className="text-white font-mono text-sm">
                    {userProfile?.account_number || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Routing Number
                  </p>
                  <p className="text-white font-mono text-sm">
                    {userProfile?.routing_number || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Account Type
                  </p>
                  <p className="text-white text-sm capitalize">
                    {userProfile?.account_type || '—'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Settings Overlay */}
      {showSettings &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center flex-shrink-0">
              <h2 className="text-2xl font-serif font-bold text-white">
                Account Settings
              </h2>
              <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-white transition-colors">

                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden flex-col md:flex-row min-h-0">
              {/* Sidebar */}
              <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-white/10 p-4 space-y-1 flex-shrink-0 bg-black/20">
                {[
              {
                key: 'profile',
                label: 'Profile',
                icon: User
              },
              {
                key: 'verification',
                label: 'Verification',
                icon: ShieldCheck
              },
              {
                key: 'kin',
                label: 'Next of Kin',
                icon: Users
              },
              {
                key: 'password',
                label: 'Change Password',
                icon: Lock
              },
              {
                key: 'pin',
                label: 'Create PIN',
                icon: Key
              }].
              map(({ key, label, icon: Icon }) =>
              <button
                key={key}
                onClick={() => setSettingsTab(key as any)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors text-sm ${settingsTab === key ? 'bg-gradient-brand text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>

                    <Icon className="h-4 w-4" /> {label}
                  </button>
              )}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* PROFILE TAB */}
                {settingsTab === 'profile' &&
              <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                  {
                    label: 'Full Name',
                    value: userProfile?.full_name
                  },
                  {
                    label: 'Email',
                    value: userProfile?.email
                  },
                  {
                    label: 'Phone',
                    value: userProfile?.phone
                  },
                  {
                    label: 'Date of Birth',
                    value: userProfile?.dob
                  },
                  {
                    label: 'Account Type',
                    value: userProfile?.account_type
                  },
                  {
                    label: 'Account Number',
                    value: userProfile?.account_number
                  },
                  {
                    label: 'Routing Number',
                    value: userProfile?.routing_number
                  }].
                  map(({ label, value }) =>
                  <div
                    key={label}
                    className="bg-white/5 rounded-lg p-4 border border-white/5">

                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            {label}
                          </p>
                          <p className="text-white font-medium">
                            {value || '—'}
                          </p>
                        </div>
                  )}
                      <div className="md:col-span-2 bg-white/5 rounded-lg p-4 border border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          Address
                        </p>
                        <p className="text-white font-medium">
                          {userProfile?.address || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
              }

                {/* VERIFICATION TAB */}
                {settingsTab === 'verification' &&
              <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">
                        Identity Verification
                      </h3>
                      {userProfile?.is_verified ?
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/20 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span> :

                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium border border-yellow-500/20">
                          Pending Review
                        </span>
                  }
                    </div>
                    <p className="text-gray-400 text-sm">
                      Upload your documents to verify your identity. Accepted
                      formats: JPG, PNG, PDF.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {verificationDocs.map(({ key, label }) =>
                  <UploadButton
                    key={key}
                    docKey={key}
                    label={label}
                    status={uploadStatus[key] || 'idle'}
                    errorMsg={uploadError[key]}
                    onUpload={handleDocUpload}
                    inputRef={fileInputRefs} />

                  )}
                    </div>
                  </div>
              }

                {/* NEXT OF KIN TAB */}
                {settingsTab === 'kin' &&
              <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">
                        Next of Kin Details
                      </h3>
                      {userProfile?.next_of_kin_verified &&
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/20 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                  }
                    </div>

                    {kinData &&
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          Saved Details
                          {userProfile?.next_of_kin_verified &&
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded border border-green-500/20">
                              Verified
                            </span>
                    }
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs uppercase">
                              Name
                            </p>
                            <p className="text-white">{kinData.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs uppercase">
                              Phone
                            </p>
                            <p className="text-white">{kinData.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs uppercase">
                              Email
                            </p>
                            <p className="text-white">{kinData.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs uppercase">
                              DOB
                            </p>
                            <p className="text-white">{kinData.dob}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-gray-500 text-xs uppercase">
                              Address
                            </p>
                            <p className="text-white">{kinData.address}</p>
                          </div>
                        </div>
                      </div>
                }

                    {kinError &&
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                        {kinError}
                      </div>
                }
                    {kinSuccess &&
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-sm flex items-center gap-2">
                        <Check className="h-4 w-4" /> Next of kin details saved
                        successfully.
                      </div>
                }

                    <form onSubmit={handleSaveKin} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                      label="Full Name"
                      placeholder="Name"
                      value={kinForm.name}
                      onChange={(e) =>
                      setKinForm({
                        ...kinForm,
                        name: e.target.value
                      })
                      }
                      required />

                        <Input
                      label="Phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={kinForm.phone}
                      onChange={(e) =>
                      setKinForm({
                        ...kinForm,
                        phone: e.target.value
                      })
                      }
                      required />

                        <Input
                      label="Email"
                      type="email"
                      placeholder="Email Address"
                      value={kinForm.email}
                      onChange={(e) =>
                      setKinForm({
                        ...kinForm,
                        email: e.target.value
                      })
                      }
                      required />

                        <Input
                      label="Date of Birth"
                      type="date"
                      value={kinForm.dob}
                      onChange={(e) =>
                      setKinForm({
                        ...kinForm,
                        dob: e.target.value
                      })
                      }
                      required />

                      </div>
                      <Input
                    label="Address"
                    placeholder="Full Address"
                    value={kinForm.address}
                    onChange={(e) =>
                    setKinForm({
                      ...kinForm,
                      address: e.target.value
                    })
                    }
                    required />

                      <Button
                    type="submit"
                    className="w-full"
                    isLoading={kinLoading}>

                        {kinData ?
                    'Update Details' :
                    'Save Next of Kin Details'}
                      </Button>
                    </form>

                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-white font-semibold mb-2">
                        Verification Documents
                      </h4>
                      <p className="text-gray-400 text-sm mb-4">
                        Upload next of kin identity documents. Accepted: JPG,
                        PNG, PDF.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nokDocs.map(({ key, label }) =>
                    <UploadButton
                      key={key}
                      docKey={key}
                      label={label}
                      status={nokUploadStatus[key] || 'idle'}
                      errorMsg={nokUploadError[key]}
                      onUpload={handleNokDocUpload}
                      inputRef={nokFileInputRefs} />

                    )}
                      </div>
                    </div>
                  </div>
              }

                {/* CHANGE PASSWORD TAB */}
                {settingsTab === 'password' &&
              <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">
                      Change Password
                    </h3>

                    {passMsg &&
                <div
                  className={`p-3 rounded-lg text-sm flex items-center gap-2 ${passMsg.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>

                        {passMsg.type === 'success' ?
                  <Check className="h-4 w-4" /> :

                  <X className="h-4 w-4" />
                  }
                        {passMsg.text}
                      </div>
                }

                    <form
                  onSubmit={handleChangePassword}
                  className="space-y-4 max-w-md">

                      <Input
                    label="Old Password"
                    type="password"
                    placeholder="••••••••"
                    value={passForm.old}
                    onChange={(e) =>
                    setPassForm({
                      ...passForm,
                      old: e.target.value
                    })
                    }
                    required />

                      <Input
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    value={passForm.new}
                    onChange={(e) =>
                    setPassForm({
                      ...passForm,
                      new: e.target.value
                    })
                    }
                    required />

                      <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="••••••••"
                    value={passForm.confirm}
                    onChange={(e) =>
                    setPassForm({
                      ...passForm,
                      confirm: e.target.value
                    })
                    }
                    required />

                      <Button type="submit" isLoading={passLoading}>
                        Update Password
                      </Button>
                    </form>
                  </div>
              }

                {/* CREATE PIN TAB */}
                {settingsTab === 'pin' &&
              <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">
                      Create Transaction PIN
                    </h3>
                    <p className="text-gray-400 text-sm">
                      This 4-digit PIN will be required to approve all
                      transactions in the app.
                    </p>

                    {pinMsg &&
                <div
                  className={`p-3 rounded-lg text-sm flex items-center gap-2 ${pinMsg.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>

                        {pinMsg.type === 'success' ?
                  <Check className="h-4 w-4" /> :

                  <X className="h-4 w-4" />
                  }
                        {pinMsg.text}
                      </div>
                }

                    <form
                  onSubmit={handleCreatePin}
                  className="space-y-4 max-w-xs">

                      <Input
                    label="4-Digit PIN"
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    value={pinForm.pin}
                    onChange={(e) =>
                    setPinForm({
                      ...pinForm,
                      pin: e.target.value
                    })
                    }
                    required
                    className="text-center tracking-widest text-lg" />

                      <Input
                    label="Confirm PIN"
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    value={pinForm.confirm}
                    onChange={(e) =>
                    setPinForm({
                      ...pinForm,
                      confirm: e.target.value
                    })
                    }
                    required
                    className="text-center tracking-widest text-lg" />

                      <Button
                    type="submit"
                    className="w-full"
                    isLoading={pinLoading}>

                        Set PIN
                      </Button>
                    </form>
                  </div>
              }
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}