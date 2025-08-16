
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { 
  Image as ImageIcon, 
  Download,
  Share2,
  Trash2,
  Calendar,
  Palette,
  X,
  Copy
} from "lucide-react";

interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  style?: string;
  size?: string;
  createdAt: Date;
  model?: string;
}

interface ImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageGallery({ isOpen, onClose }: ImageGalleryProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load images from localStorage on component mount
  useEffect(() => {
    const storedImages = localStorage.getItem('catalyst-generated-images');
    if (storedImages) {
      try {
        const parsedImages = JSON.parse(storedImages).map((img: any) => ({
          ...img,
          createdAt: new Date(img.createdAt)
        }));
        setImages(parsedImages);
      } catch (error) {
        console.error('Error loading images from storage:', error);
      }
    }
  }, [isOpen]);

  // Download image
  const downloadImage = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `catalyst-image-${image.id}.${image.imageUrl.includes('svg') ? 'svg' : 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: t('downloadImage'),
        description: "Imagem baixada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro ao baixar",
        description: "Não foi possível baixar a imagem.",
        variant: "destructive",
      });
    }
  };

  // Copy image URL to clipboard
  const copyImageUrl = (imageUrl: string) => {
    navigator.clipboard.writeText(imageUrl).then(() => {
      toast({
        title: "URL copiada!",
        description: "O link da imagem foi copiado para a área de transferência.",
      });
    });
  };

  // Delete image
  const deleteImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);
    localStorage.setItem('catalyst-generated-images', JSON.stringify(updatedImages));
    
    toast({
      title: t('deleteImage'),
      description: "Imagem removida da galeria.",
    });
    
    if (selectedImage?.id === imageId) {
      setSelectedImage(null);
    }
  };

  // Share image (opens share dialog or copies URL)
  const shareImage = async (image: GeneratedImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Imagem gerada pelo Catalyst IA',
          text: `Imagem criada com o prompt: "${image.prompt}"`,
          url: image.imageUrl
        });
      } catch (error) {
        // Fallback to copying URL
        copyImageUrl(image.imageUrl);
      }
    } else {
      copyImageUrl(image.imageUrl);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Gallery Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0" aria-describedby="image-gallery-description">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl">{t('imageGallery')}</DialogTitle>
                  <p id="image-gallery-description" className="text-sm text-muted-foreground">
                    {images.length} {images.length === 1 ? 'imagem' : 'imagens'} geradas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? 'Lista' : 'Grade'}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 px-6 pb-6">
            {images.length === 0 ? (
              <div className="text-center py-20">
                <div className="h-20 w-20 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('noImagesYet')}</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {t('generateFirstImage')}
                </p>
              </div>
            ) : (
              <div className={`
                ${viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
                  : 'space-y-4'
                }
              `}>
                {images.map((image) => (
                  <Card 
                    key={image.id} 
                    className={`
                      cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]
                      ${viewMode === 'list' ? 'flex' : ''}
                    `}
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className={`${viewMode === 'list' ? 'w-32 flex-shrink-0' : ''}`}>
                      <img 
                        src={image.imageUrl} 
                        alt={image.prompt}
                        className={`
                          w-full object-cover rounded-t-lg
                          ${viewMode === 'list' ? 'h-24 rounded-l-lg rounded-t-none' : 'h-48'}
                        `}
                      />
                    </div>
                    
                    <CardContent className={`p-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="space-y-2">
                        <p className="text-sm font-medium line-clamp-2">
                          {image.prompt}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(image.createdAt)}
                        </div>
                        
                        {image.style && (
                          <Badge variant="secondary" className="text-xs">
                            <Palette className="h-3 w-3 mr-1" />
                            {image.style}
                          </Badge>
                        )}
                        
                        <div className="flex gap-1 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadImage(image);
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              shareImage(image);
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteImage(image.id);
                            }}
                            className="h-7 w-7 p-0 hover:bg-destructive/20 hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Image Detail Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0" aria-describedby="image-detail-description">
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg">Detalhes da Imagem</DialogTitle>
                <p id="image-detail-description" className="sr-only">Visualizar detalhes da imagem selecionada</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="flex flex-col lg:flex-row gap-6 px-6 pb-6">
              {/* Image Display */}
              <div className="flex-1">
                <img 
                  src={selectedImage.imageUrl} 
                  alt={selectedImage.prompt}
                  className="w-full h-auto max-h-96 object-contain rounded-lg border"
                />
              </div>

              {/* Image Info */}
              <div className="lg:w-80 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{t('imagePrompt')}</h3>
                  <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                    {selectedImage.prompt}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{t('generatedOn')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedImage.createdAt)}
                  </p>
                </div>

                {selectedImage.style && (
                  <div>
                    <h3 className="font-semibold mb-2">Estilo</h3>
                    <Badge variant="secondary">
                      <Palette className="h-3 w-3 mr-1" />
                      {selectedImage.style}
                    </Badge>
                  </div>
                )}

                {selectedImage.size && (
                  <div>
                    <h3 className="font-semibold mb-2">Tamanho</h3>
                    <p className="text-sm text-muted-foreground">{selectedImage.size}</p>
                  </div>
                )}

                <div className="space-y-2 pt-4 border-t">
                  <Button 
                    onClick={() => downloadImage(selectedImage)}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('downloadImage')}
                  </Button>
                  
                  <Button 
                    onClick={() => shareImage(selectedImage)}
                    className="w-full"
                    variant="outline"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {t('shareImage')}
                  </Button>
                  
                  <Button 
                    onClick={() => copyImageUrl(selectedImage.imageUrl)}
                    className="w-full"
                    variant="outline"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar URL
                  </Button>
                  
                  <Button 
                    onClick={() => deleteImage(selectedImage.id)}
                    className="w-full"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('deleteImage')}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Export function to save images to gallery from other components
export const addImageToGallery = (imageData: {
  imageUrl: string;
  prompt: string;
  style?: string;
  size?: string;
  model?: string;
}) => {
  const storedImages = localStorage.getItem('catalyst-generated-images');
  const existingImages = storedImages ? JSON.parse(storedImages) : [];
  
  const newImage: GeneratedImage = {
    ...imageData,
    id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date()
  };

  const updatedImages = [newImage, ...existingImages];
  localStorage.setItem('catalyst-generated-images', JSON.stringify(updatedImages));
  
  return newImage;
};
