import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Download, FileText, Calendar } from 'lucide-react';
import { ActionSuccessModal } from '../components/ActionSuccessModal';
interface StatementPageProps {
  onNavigate: (page: string) => void;
}
export function StatementPage({ onNavigate }: StatementPageProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock download
    setShowSuccess(true);
  };
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
            className="mb-4 pl-0">

            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-serif font-bold text-white">
            Account Statements
          </h1>
          <p className="text-gray-400 mt-2">
            Download your transaction history and monthly statements.
          </p>
        </div>

        <Card className="mb-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-orange" /> Generate
            Statement
          </h3>
          <form onSubmit={handleDownload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Start Date"
                type="date"
                required
                value={dateRange.start}
                onChange={(e) =>
                setDateRange({
                  ...dateRange,
                  start: e.target.value
                })
                } />

              <Input
                label="End Date"
                type="date"
                required
                value={dateRange.end}
                onChange={(e) =>
                setDateRange({
                  ...dateRange,
                  end: e.target.value
                })
                } />

            </div>

            <div className="bg-white/5 rounded-lg p-4 text-sm text-gray-400 flex items-start gap-3">
              <Calendar className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>
                Statements include all completed transactions within the
                selected date range. The file will be downloaded as a PDF
                document.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full">
              <Download className="mr-2 h-5 w-5" /> Download Statement (PDF)
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Recent Statements</h3>
          {[
          {
            month: 'October 2023',
            size: '1.2 MB'
          },
          {
            month: 'September 2023',
            size: '1.1 MB'
          },
          {
            month: 'August 2023',
            size: '1.3 MB'
          }].
          map((stmt, i) =>
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-colors">

              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded text-red-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white font-medium">{stmt.month}</p>
                  <p className="text-xs text-gray-500">
                    Statement • {stmt.size}
                  </p>
                </div>
              </div>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuccess(true)}>

                Download
              </Button>
            </div>
          )}
        </div>
      </div>

      <ActionSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Download Started"
        message="Your statement is being generated and will download shortly." />

    </div>);

}