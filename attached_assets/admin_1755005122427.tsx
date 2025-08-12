import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Trash2, Upload } from "lucide-react";

const downloadLinkSchema = z.object({
  quality: z.string().min(1, "Quality is required"),
  size: z.string().min(1, "Size is required"),
  url: z.string().url("Invalid URL").or(z.literal("#"))
});

const movieUploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.number().min(1900).max(2030),
  genre: z.string().min(1, "Genre is required"),
  language: z.string().min(1, "Language is required"),
  quality: z.string().min(1, "Quality is required"),
  resolution: z.string().min(1, "Resolution is required"),
  size: z.string().min(1, "Size is required"),
  poster: z.string().url("Invalid poster URL"),
  category: z.string().min(1, "Category is required"),
  plot: z.string().optional(),
  director: z.string().optional(),
  cast: z.string().optional(),
  duration: z.string().optional(),
  screenshots: z.array(z.string().url()).default([]),
  downloadLinks: z.array(downloadLinkSchema).min(1, "At least one download link is required")
});

type MovieUploadForm = z.infer<typeof movieUploadSchema>;

const categories = [
  "Latest Releases", "Chorki", "Hoichoi", "Animation Movies", 
  "Animation Series", "Bangla Dubbed", "Hindi", "South Hindi Dubbed",
  "Hollywood", "DC Movies", "Marvel", "Bangla Old Movies"
];

const qualities = ["HDTC", "WEB-DL", "CAM", "HD Restored"];
const resolutions = ["480p", "720p", "1080p", "4K"];

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [screenshots, setScreenshots] = useState<string[]>([""]);
  const [downloadLinks, setDownloadLinks] = useState([{ quality: "", size: "", url: "#" }]);

  const form = useForm<MovieUploadForm>({
    resolver: zodResolver(movieUploadSchema),
    defaultValues: {
      title: "",
      year: new Date().getFullYear(),
      genre: "",
      language: "",
      quality: "",
      resolution: "",
      size: "",
      poster: "",
      category: "",
      plot: "",
      director: "",
      cast: "",
      duration: "",
      screenshots: [],
      downloadLinks: [{ quality: "", size: "", url: "#" }]
    }
  });

  // Fill sample data function
  const fillSampleData = () => {
    const sampleData = {
      title: "Sample Movie Title",
      year: 2025,
      genre: "Action, Drama, Thriller",
      language: "Hindi",
      quality: "WEB-DL",
      resolution: "1080p",
      size: "2.5GB",
      poster: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
      category: "Latest Releases",
      plot: "This is a sample movie plot summary for testing purposes.",
      director: "Sample Director",
      cast: "Actor 1, Actor 2, Actor 3",
      duration: "2h 30min",
      screenshots: ["https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      downloadLinks: [
        { quality: "1080p", size: "2.5GB", url: "https://example.com/download/1080p" },
        { quality: "720p", size: "1.5GB", url: "https://example.com/download/720p" },
        { quality: "480p", size: "800MB", url: "https://example.com/download/480p" }
      ]
    };

    // Set form values
    form.reset(sampleData);
    
    // Update local state
    setScreenshots(sampleData.screenshots);
    setDownloadLinks(sampleData.downloadLinks);

    toast({
      title: "Sample Data Loaded!",
      description: "All fields have been filled with sample data for testing.",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("🚀 Mutation function called with data:", data);
      
      try {
        console.log("🌐 Making API request to /api/movies...");
        const response = await apiRequest("https://cine-freak-clone-git-main-rajus-projects-5dda1627.vercel.app/api/movies", {
          method: "POST",
          body: data
        });
        console.log("✅ API request successful:", response);
        return response;
      } catch (error) {
        console.error("❌ API request failed:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Movie uploaded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/movies"] });
      form.reset();
      setScreenshots([""]);
      setDownloadLinks([{ quality: "", size: "", url: "#" }]);
    },
    onError: (error) => {
      console.error("Upload mutation error:", error);
      toast({
        title: "Error",
        description: `Failed to upload movie: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MovieUploadForm) => {
    console.log("🎯 Form submitted with data:", data);
    console.log("🎯 Form validation errors:", form.formState.errors);
    console.log("🎯 Form is valid:", form.formState.isValid);
    console.log("🎯 Mutation state:", uploadMutation);
    console.log("🎯 Screenshots:", screenshots);
    console.log("🎯 Download Links:", downloadLinks);
    
    // Manual validation for download links
    const validDownloadLinks = downloadLinks.filter(dl => dl.quality && dl.size);
    if (validDownloadLinks.length === 0) {
      console.log("❌ No valid download links found");
      toast({
        title: "Error",
        description: "Please add at least one download link with quality and size",
        variant: "destructive",
      });
      return;
    }
    
    // Create complete movie data
    const completeData = {
      ...data,
      screenshots: screenshots.filter(s => s.trim()),
      downloadLinks: validDownloadLinks
    };
    
    console.log("✅ Submitting complete data:", completeData);
    uploadMutation.mutate(completeData);
  };

  const addScreenshot = () => setScreenshots([...screenshots, ""]);
  const removeScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };
  const updateScreenshot = (index: number, value: string) => {
    const updated = [...screenshots];
    updated[index] = value;
    setScreenshots(updated);
  };

  const addDownloadLink = () => setDownloadLinks([...downloadLinks, { quality: "", size: "", url: "#" }]);
  const removeDownloadLink = (index: number) => {
    setDownloadLinks(downloadLinks.filter((_, i) => i !== index));
  };
  const updateDownloadLink = (index: number, field: string, value: string) => {
    const updated = [...downloadLinks];
    updated[index] = { ...updated[index], [field]: value };
    setDownloadLinks(updated);
  };

  return (
    <div className="min-h-screen cine-bg-dark p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="cine-bg-card cine-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Upload className="h-6 w-6" />
                Movie Upload - Admin Panel
              </CardTitle>
              <Button
                type="button"
                onClick={fillSampleData}
                variant="outline"
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
              >
                Fill Sample Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-white">Movie Title *</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    className="cine-input"
                    placeholder="Enter movie title"
                  />
                  {form.formState.errors.title && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="year" className="text-white">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    {...form.register("year", { valueAsNumber: true })}
                    className="cine-input"
                    placeholder="2024"
                  />
                  {form.formState.errors.year && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.year.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="genre" className="text-white">Genre *</Label>
                  <Input
                    id="genre"
                    {...form.register("genre")}
                    className="cine-input"
                    placeholder="Action, Drama, Comedy"
                  />
                  {form.formState.errors.genre && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.genre.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="language" className="text-white">Language *</Label>
                  <Input
                    id="language"
                    {...form.register("language")}
                    className="cine-input"
                    placeholder="Hindi, English, Bengali"
                  />
                  {form.formState.errors.language && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.language.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category" className="text-white">Category *</Label>
                  <Select onValueChange={(value) => form.setValue("category", value)}>
                    <SelectTrigger className="cine-input">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.category.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="quality" className="text-white">Quality *</Label>
                  <Select onValueChange={(value) => form.setValue("quality", value)}>
                    <SelectTrigger className="cine-input">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualities.map(q => (
                        <SelectItem key={q} value={q}>{q}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.quality && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.quality.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="resolution" className="text-white">Resolution *</Label>
                  <Select onValueChange={(value) => form.setValue("resolution", value)}>
                    <SelectTrigger className="cine-input">
                      <SelectValue placeholder="Select resolution" />
                    </SelectTrigger>
                    <SelectContent>
                      {resolutions.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.resolution && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.resolution.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="size" className="text-white">File Size *</Label>
                  <Input
                    id="size"
                    {...form.register("size")}
                    className="cine-input"
                    placeholder="2.5GB"
                  />
                  {form.formState.errors.size && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.size.message}</p>
                  )}
                </div>
              </div>

              {/* Media URLs */}
              <div>
                <Label htmlFor="poster" className="text-white">Poster URL *</Label>
                <Input
                  id="poster"
                  {...form.register("poster")}
                  className="cine-input"
                  placeholder="https://example.com/poster.jpg"
                />
                {form.formState.errors.poster && (
                  <p className="text-red-400 text-sm mt-1">{form.formState.errors.poster.message}</p>
                )}
              </div>

              {/* Screenshots */}
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-white">Screenshots</Label>
                  <Button type="button" onClick={addScreenshot} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Screenshot
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {screenshots.map((screenshot, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={screenshot}
                        onChange={(e) => updateScreenshot(index, e.target.value)}
                        className="cine-input flex-1"
                        placeholder="https://example.com/screenshot.jpg"
                      />
                      {screenshots.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeScreenshot(index)}
                          size="sm"
                          variant="outline"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Links */}
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-white">Download Links *</Label>
                  <Button type="button" onClick={addDownloadLink} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {downloadLinks.map((link, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <Select
                        value={link.quality}
                        onValueChange={(value) => updateDownloadLink(index, "quality", value)}
                      >
                        <SelectTrigger className="cine-input">
                          <SelectValue placeholder="Quality" />
                        </SelectTrigger>
                        <SelectContent>
                          {resolutions.map(r => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={link.size}
                        onChange={(e) => updateDownloadLink(index, "size", e.target.value)}
                        className="cine-input"
                        placeholder="Size (e.g., 1.2GB)"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => updateDownloadLink(index, "url", e.target.value)}
                        className="cine-input"
                        placeholder="Download URL"
                      />
                      {downloadLinks.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeDownloadLink(index)}
                          size="sm"
                          variant="outline"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="director" className="text-white">Director</Label>
                  <Input
                    id="director"
                    {...form.register("director")}
                    className="cine-input"
                    placeholder="Director name"
                  />
                </div>

                <div>
                  <Label htmlFor="duration" className="text-white">Duration</Label>
                  <Input
                    id="duration"
                    {...form.register("duration")}
                    className="cine-input"
                    placeholder="2h 30min"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cast" className="text-white">Cast</Label>
                <Input
                  id="cast"
                  {...form.register("cast")}
                  className="cine-input"
                  placeholder="Actor 1, Actor 2, Actor 3"
                />
              </div>

              <div>
                <Label htmlFor="plot" className="text-white">Plot Summary</Label>
                <Textarea
                  id="plot"
                  {...form.register("plot")}
                  className="cine-input"
                  placeholder="Enter movie plot summary..."
                  rows={4}
                />
              </div>

              {/* Debug Information */}
              {Object.keys(form.formState.errors).length > 0 && (
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                  <h3 className="text-red-400 font-semibold mb-2">Form Validation Errors:</h3>
                  <ul className="text-red-300 text-sm space-y-1">
                    {Object.entries(form.formState.errors).map(([field, error]) => (
                      <li key={field}>
                        <strong>{field}:</strong> {error?.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload Movie"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}