import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Scan, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import QRScanner from "@/components/QRScanner";

const Home = () => {
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const handleQRScan = (harvestId: string) => {
    navigate(`/batch/${harvestId}`);
  };

  const handleStartScan = () => {
    setShowScanner(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <QrCode className="w-16 h-16 mx-auto mb-6 text-primary-foreground" />
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Scan & Trace
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
              Discover the complete journey of your food from farm to table. Simply scan the QR code on your product to see its full supply chain story.
            </p>
            <Button 
              size="lg" 
              onClick={handleStartScan}
              className="bg-card hover:bg-card/90 text-foreground shadow-glow gap-3 px-8 py-4 text-lg"
            >
              <Scan className="w-6 h-6" />
              Start Scanning
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our QR codes contain the complete supply chain information for your product
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="text-center shadow-card hover:shadow-card-hover transition-all">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">1. Scan QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Use your phone's camera to scan the QR code on your product packaging
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="text-center shadow-card hover:shadow-card-hover transition-all">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Info className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">2. View Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  See the complete journey including harvest, testing, processing, and transport
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="text-center shadow-card hover:shadow-card-hover transition-all">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">3. Trust & Verify</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get complete transparency about the origin and quality of your food
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Trace Your Food?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start by scanning the QR code on any participating product
            </p>
            <Button 
              size="lg" 
              onClick={handleStartScan}
              className="gap-3 px-8 py-4 text-lg"
            >
              <Scan className="w-6 h-6" />
              Open Camera Scanner
            </Button>
          </div>
        </div>
      </section>

      {/* QR Scanner Modal */}
      <QRScanner 
        isOpen={showScanner}
        onScan={handleQRScan}
        onClose={() => setShowScanner(false)}
      />
    </div>
  );
};

export default Home;