
export interface Expert {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  specialization: string;
  experience: string;
  rating: number;
  reviews: number;
}

export interface EnhancedExpertSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpertSelected: (expertId: number) => void;
  serviceTitle: string;
}
