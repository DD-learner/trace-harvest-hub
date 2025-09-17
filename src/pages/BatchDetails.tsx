import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, User, Truck, FlaskConical, Package, QrCode, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { harvests } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface BatchDetails {
  _id: string;
  crop: string;
  harvestDate: string;
  farmer: {
    name: string;
    location: string;
    certifications: string[];
  };
  quantity: number;
  unit: string;
  status: string;
  labTests?: {
    date: string;
    results: {
      pesticides: string;
      freshness: string;
      quality: string;
    };
  }[];
  processingSteps?: {
    step: string;
    date: string;
    location: string;
    notes: string;
  }[];
  transportEvents?: {
    from: string;
    to: string;
    date: string;
    temperature: string;
    duration: string;
  }[];
  qrScanned?: boolean;
}

const BatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<BatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchBatchDetails(id);
    }
  }, [id]);

  const fetchBatchDetails = async (batchId: string) => {
    try {
      setLoading(true);
      const response = await harvests.getById(batchId);
      setBatch(response.data);
    } catch (error) {
      console.error('Error fetching batch details:', error);
      toast({
        title: "Error",
        description: "Failed to load batch details. Please try again.",
        variant: "destructive",
      });
      
      // Mock data for development
      setBatch({
        _id: batchId,
        crop: "Organic Tomatoes",
        harvestDate: "2024-01-15",
        farmer: {
          name: "John Smith",
          location: "Valley Farm, California",
          certifications: ["USDA Organic", "Non-GMO Project"]
        },
        quantity: 500,
        unit: "kg",
        status: "delivered",
        labTests: [
          {
            date: "2024-01-16",
            results: {
              pesticides: "None detected",
              freshness: "Excellent",
              quality: "Grade A"
            }
          }
        ],
        processingSteps: [
          {
            step: "Washing & Sorting",
            date: "2024-01-16",
            location: "Valley Processing Center",
            notes: "Sorted by size and quality, cold water wash"
          },
          {
            step: "Packaging",
            date: "2024-01-17",
            location: "Valley Processing Center",
            notes: "Packed in biodegradable containers"
          }
        ],
        transportEvents: [
          {
            from: "Valley Farm",
            to: "Processing Center",
            date: "2024-01-16",
            temperature: "4°C",
            duration: "2 hours"
          },
          {
            from: "Processing Center",
            to: "Distribution Hub",
            date: "2024-01-18",
            temperature: "4°C",
            duration: "6 hours"
          }
        ],
        qrScanned: true
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-muted rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Batch Not Found</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Batches
          </Button>
        </div>

        {/* QR Scanned Alert */}
        {batch.qrScanned && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">QR Code Scanned</p>
                  <p className="text-sm text-muted-foreground">This batch was accessed via QR code scan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Batch Overview */}
        <Card className="mb-8 bg-gradient-card shadow-card">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{batch.crop}</CardTitle>
                <Badge variant="secondary" className="mb-4">
                  Batch #{batch._id}
                </Badge>
              </div>
              <Badge 
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20"
              >
                {batch.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{batch.farmer.name}</p>
                  <p className="text-sm text-muted-foreground">{batch.farmer.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Harvested</p>
                  <p className="text-sm text-muted-foreground">{formatDate(batch.harvestDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Quantity</p>
                  <p className="text-sm text-muted-foreground">{batch.quantity} {batch.unit}</p>
                </div>
              </div>
            </div>

            {/* Certifications */}
            {batch.farmer.certifications && batch.farmer.certifications.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-foreground mb-2">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {batch.farmer.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="bg-accent/10">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Supply Chain Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Lab Tests */}
          {batch.labTests && batch.labTests.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-primary" />
                  Lab Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {batch.labTests.map((test, index) => (
                  <div key={index} className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Tested on {formatDate(test.date)}
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Pesticides:</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-600">
                          {test.results.pesticides}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Freshness:</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-600">
                          {test.results.freshness}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Quality:</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-600">
                          {test.results.quality}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Processing Steps */}
          {batch.processingSteps && batch.processingSteps.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Processing History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batch.processingSteps.map((step, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <h4 className="font-medium text-foreground">{step.step}</h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        {formatDate(step.date)} • {step.location}
                      </p>
                      <p className="text-sm text-muted-foreground">{step.notes}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transport Events */}
          {batch.transportEvents && batch.transportEvents.length > 0 && (
            <Card className="shadow-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Transportation History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batch.transportEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{event.from}</span>
                          <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                          <span className="font-medium text-foreground">{event.to}</span>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{formatDate(event.date)}</span>
                          <span>Temp: {event.temperature}</span>
                          <span>Duration: {event.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default BatchDetails;