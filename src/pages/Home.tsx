import { useState, useEffect } from "react";
import { Loader2, Search, Filter } from "lucide-react";
import BatchCard from "@/components/BatchCard";
import Navbar from "@/components/Navbar";
import { harvests } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Harvest {
  _id: string;
  crop: string;
  harvestDate: string;
  farmer: {
    name: string;
    location: string;
  };
  quantity: number;
  unit: string;
  status: string;
}

const Home = () => {
  const [harvestsData, setHarvestsData] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchHarvests();
  }, []);

  const fetchHarvests = async () => {
    try {
      setLoading(true);
      const response = await harvests.getAll();
      setHarvestsData(response.data);
    } catch (error) {
      console.error('Error fetching harvests:', error);
      toast({
        title: "Error",
        description: "Failed to load harvest data. Please try again.",
        variant: "destructive",
      });
      // Mock data for development
      setHarvestsData([
        {
          _id: "1",
          crop: "Organic Tomatoes",
          harvestDate: "2024-01-15",
          farmer: { name: "John Smith", location: "Valley Farm, CA" },
          quantity: 500,
          unit: "kg",
          status: "delivered"
        },
        {
          _id: "2",
          crop: "Sweet Corn",
          harvestDate: "2024-01-10",
          farmer: { name: "Maria Garcia", location: "Sunset Ranch, TX" },
          quantity: 800,
          unit: "kg",
          status: "shipped"
        },
        {
          _id: "3",
          crop: "Organic Carrots",
          harvestDate: "2024-01-08",
          farmer: { name: "David Chen", location: "Green Valley, OR" },
          quantity: 300,
          unit: "kg",
          status: "processing"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHarvests = harvestsData.filter(harvest => {
    const matchesSearch = harvest.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         harvest.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         harvest.farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || harvest.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const statuses = ["all", ...Array.from(new Set(harvestsData.map(h => h.status)))];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Track Your Food's Journey
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Discover the complete story behind your fresh produce, from farm to table.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by crop, farmer, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {statuses.map(status => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Harvest Batches Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading harvest data...</span>
          </div>
        ) : filteredHarvests.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">No harvest batches found</p>
            <Button onClick={fetchHarvests} variant="outline">
              Refresh Data
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHarvests.map((harvest) => (
              <BatchCard key={harvest._id} batch={harvest} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;