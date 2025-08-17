import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Trash2, Eye, LogOut, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SiteImage {
  id: string;
  image_type: 'hero' | 'gallery';
  file_path: string;
  alt_text: string | null;
  display_order: number;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<SiteImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    fetchImages();
  }, [navigate]);

  const fetchImages = async () => {
    try {
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

      setImages((data || []) as SiteImage[]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, imageType: 'hero' | 'gallery') => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Errore",
        description: "Seleziona un file immagine valido",
        variant: "destructive",
      });
      return;
    }

    // Check gallery limit
    const galleryImages = images.filter(img => img.image_type === 'gallery');
    if (imageType === 'gallery' && galleryImages.length >= 15) {
      toast({
        title: "Limite raggiunto",
        description: "Puoi caricare massimo 15 immagini nella gallery",
        variant: "destructive",
      });
      return;
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

      toast({
        title: "Successo",
        description: "Immagine caricata con successo",
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

  const getImageUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('admin-images')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const logout = () => {
    sessionStorage.removeItem('admin_authenticated');
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
              Immagine Hero ({heroImages.length}/1)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'hero');
                  }}
                  disabled={uploading || heroImages.length >= 1}
                  className="mb-4"
                />
                {heroImages.length >= 1 && (
                  <p className="text-sm text-muted-foreground">
                    Elimina l'immagine esistente per caricarne una nuova
                  </p>
                )}
              </div>
              
              <div className="space-y-4">
                {heroImages.map((image) => (
                  <div key={image.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <img
                      src={getImageUrl(image.file_path)}
                      alt={image.alt_text || ''}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Hero Image</p>
                      <Badge variant="secondary">Principale</Badge>
                    </div>
                    <div className="flex gap-2">
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
                        onClick={() => deleteImage(image)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Images Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Gallery Images ({galleryImages.length}/15)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'gallery');
              }}
              disabled={uploading || galleryImages.length >= 15}
              className="mb-4"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="border rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(image.file_path)}
                    alt={image.alt_text || ''}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">Ordine: {image.display_order}</Badge>
                      <div className="flex gap-2">
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
                          onClick={() => deleteImage(image)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {galleryImages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nessuna immagine nella gallery. Carica la prima immagine!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;