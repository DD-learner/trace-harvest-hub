import { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { Camera, X, FlashlightIcon as Flashlight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const QRScanner = ({ onScan, onClose, isOpen }: QRScannerProps) => {
  const [flashlight, setFlashlight] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleResult = (result: any) => {
    if (result?.text) {
      // Extract harvest ID from QR code result
      let harvestId = result.text;
      
      // If QR contains a URL, extract the ID from it
      if (harvestId.includes('/')) {
        const parts = harvestId.split('/');
        harvestId = parts[parts.length - 1];
      }
      
      toast({
        title: "QR Code Scanned!",
        description: `Harvest ID: ${harvestId}`,
      });
      
      onScan(harvestId);
      onClose();
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner Error:', error);
    setScanError('Camera access denied or not available');
    toast({
      title: "Camera Error",
      description: "Please allow camera access to scan QR codes",
      variant: "destructive",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md mx-auto bg-card shadow-glow">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Scan QR Code</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Scanner */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg bg-black aspect-square">
                <QrReader
                  onResult={handleResult}
                  constraints={{
                    facingMode: 'environment'
                  }}
                  containerStyle={{
                    width: '100%',
                    height: '100%',
                  }}
                  videoContainerStyle={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                
                {/* Scan overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                      {/* Corner indicators */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center mt-4">
                <Button
                  variant={flashlight ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFlashlight(!flashlight)}
                  className="gap-2"
                >
                  <Flashlight className="w-4 h-4" />
                  {flashlight ? 'Turn Off' : 'Turn On'} Flash
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Position the QR code within the frame to scan
              </p>
              {scanError && (
                <p className="text-sm text-destructive mt-2">{scanError}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRScanner;