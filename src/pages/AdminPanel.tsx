import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Trash2, Eye, LogOut, Image, Edit, Plus, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SiteImage {
  id: string;
  image_type: 'hero' | 'gallery';
  file_path: string;
  alt_text: string | null;
  display_order: number;
}

interface SortableImageProps {
  image: SiteImage;
  onEdit: (image: SiteImage) => void;
  onDelete: (image: SiteImage) => void;
  getImageUrl: (filePath: string) => string;
}

const SortableImage: React.FC<SortableImageProps> = ({ image, onEdit, onDelete, getImageUrl }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg overflow-hidden bg-background shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative">
        <img
          src={getImageUrl(image.file_path)}
          alt={image.alt_text || ''}
          className="w-full h-48 object-cover"
        />
        <div 
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 p-1 bg-black/50 rounded cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">Ordine: {image.display_order}</Badge>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(image)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-1" />
            Modifica
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(getImageUrl(image.file_path), '_blank')}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(image)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<SiteImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<SiteImage | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Check if user is authenticated
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin-login'); return; }
      const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      if (isAdmin !== true) { await supabase.auth.signOut(); navigate('/admin-login'); return; }
      fetchImages();
    };
    checkAdmin();
  }, [navigate]);

  const fetchImages = async () => {
    try {
      console.log('Fetching images from database...');
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .order('image_type', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching images:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare le immagini",
          variant: "destructive",
        });
        return;
      }

      console.log('Images fetched:', data);
      setImages((data || []) as SiteImage[]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, imageType: 'hero' | 'gallery', replaceImage?: SiteImage) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Errore",
        description: "Seleziona un file immagine valido",
        variant: "destructive",
      });
      return;
    }

    // Check gallery limit only for new images
    if (!replaceImage) {
      const galleryImages = images.filter(img => img.image_type === 'gallery');
      if (imageType === 'gallery' && galleryImages.length >= 15) {
        toast({
          title: "Limite raggiunto",
          description: "Puoi caricare massimo 15 immagini nella gallery",
          variant: "destructive",
        });
        return;
      }

      const heroImages = images.filter(img => img.image_type === 'hero');
      if (imageType === 'hero' && heroImages.length >= 1) {
        toast({
          title: "Limite raggiunto",
          description: "Puoi avere solo una immagine hero",
          variant: "destructive",
        });
        return;
      }
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${imageType}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('admin-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Errore upload",
          description: uploadError.message,
          variant: "destructive",
        });
        return;
      }

      if (replaceImage) {
        // Replace existing image
        // Delete old file
        await supabase.storage
          .from('admin-images')
          .remove([replaceImage.file_path]);

        // Update database record
        const { error: dbError } = await supabase
          .from('site_images')
          .update({
            file_path: fileName,
            alt_text: `${imageType} image`,
          })
          .eq('id', replaceImage.id);

        if (dbError) {
          console.error('Database error:', dbError);
          toast({
            title: "Errore database",
            description: dbError.message,
            variant: "destructive",
          });
          return;
        }

        setEditingImage(null);
      } else {
        // Get the next display order
        const maxOrder = Math.max(
          0,
          ...images
            .filter(img => img.image_type === imageType)
            .map(img => img.display_order)
        );

        // Save to database
        const { error: dbError } = await supabase
          .from('site_images')
          .insert([{
            image_type: imageType,
            file_path: fileName,
            alt_text: `${imageType} image`,
            display_order: maxOrder + 1
          }]);

        if (dbError) {
          console.error('Database error:', dbError);
          toast({
            title: "Errore database",
            description: dbError.message,
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: "Successo",
        description: replaceImage ? "Immagine sostituita con successo" : "Immagine caricata con successo",
      });

      fetchImages();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Errore",
        description: "Errore durante il caricamento",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (image: SiteImage) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('admin-images')
        .remove([image.file_path]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('site_images')
        .delete()
        .eq('id', image.id);

      if (dbError) {
        console.error('Database delete error:', dbError);
        toast({
          title: "Errore",
          description: dbError.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Successo",
        description: "Immagine eliminata con successo",
      });

      fetchImages();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const galleryImages = images.filter(img => img.image_type === 'gallery');
    const oldIndex = galleryImages.findIndex(img => img.id === active.id);
    const newIndex = galleryImages.findIndex(img => img.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(galleryImages, oldIndex, newIndex);

    // Update display_order for all affected images
    try {
      const updates = newOrder.map((img, index) => ({
        id: img.id,
        display_order: index + 1
      }));

      for (const update of updates) {
        await supabase
          .from('site_images')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      toast({
        title: "Successo",
        description: "Ordine immagini aggiornato",
      });

      fetchImages();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'aggiornamento dell'ordine",
        variant: "destructive",
      });
    }
  };

  const getImageUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('admin-images')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const heroImages = images.filter(img => img.image_type === 'hero');
  const galleryImages = images.filter(img => img.image_type === 'gallery');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Pannello Admin</h1>
          <Button onClick={logout} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Hero Images Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Foto di Copertina ({heroImages.length}/1)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {heroImages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-4">Nessuna foto di copertina caricata</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'hero');
                      }}
                      disabled={uploading}
                      className="max-w-sm mx-auto"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <img
                      src={getImageUrl(heroImages[0].file_path)}
                      alt={heroImages[0].alt_text || ''}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Foto di Copertina</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingImage(heroImages[0])}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifica
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(getImageUrl(heroImages[0].file_path), '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteImage(heroImages[0])}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {editingImage?.id === heroImages[0].id && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Seleziona una nuova immagine per sostituire quella attuale:</p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'hero', editingImage);
                          }}
                          disabled={uploading}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingImage(null)}
                        >
                          Annulla
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gallery Images Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Griglia Gallery ({galleryImages.length}/15)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {galleryImages.length < 15 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <Plus className="w-6 h-6 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-2">Aggiungi nuova foto alla gallery</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'gallery');
                        }}
                        disabled={uploading}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {galleryImages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nessuna immagine nella gallery. Carica la prima immagine!</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Trascina le immagini per riordinarle. Usa l'icona di presa per muoverle.
                  </p>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={galleryImages.map(img => img.id)}
                      strategy={rectSortingStrategy}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {galleryImages.map((image) => (
                          <SortableImage
                            key={image.id}
                            image={image}
                            onEdit={setEditingImage}
                            onDelete={deleteImage}
                            getImageUrl={getImageUrl}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                  
                  {editingImage && editingImage.image_type === 'gallery' && (
                    <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                      <h3 className="font-medium mb-2">Modifica immagine</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Seleziona una nuova immagine per sostituire quella attuale:
                      </p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'gallery', editingImage);
                          }}
                          disabled={uploading}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          onClick={() => setEditingImage(null)}
                        >
                          Annulla
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;