import { Calendar, MapPin, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BatchCardProps {
  batch: {
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
  };
}

const BatchCard = ({ batch }: BatchCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/batch/${batch._id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'harvested':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'processing':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'delivered':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card className="group hover:shadow-card-hover transition-all duration-300 bg-gradient-card border-border/50 cursor-pointer" onClick={handleViewDetails}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {batch.crop}
            </h3>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(batch.status)}`}>
              {batch.status}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {batch.quantity} {batch.unit}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{batch.farmer.name}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{batch.farmer.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Harvested {formatDate(batch.harvestDate)}</span>
          </div>
        </div>

        <Button 
          variant="ghost" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default BatchCard;