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
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Trash2, Upload, Lock } from "lucide-react";
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [screenshots, setScreenshots] = useState([""]);
    const [downloadLinks, setDownloadLinks] = useState([{ quality: "", size: "", url: "#" }]);
    const form = useForm({
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
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === "iam22raju") {
            setIsAuthenticated(true);
            toast({
                title: "Access Granted!",
                description: "Welcome to the admin panel.",
            });
        }
        else {
            toast({
                title: "Access Denied",
                description: "Incorrect password. Please try again.",
                variant: "destructive",
            });
        }
    };
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
        mutationFn: async (data) => {
            const response = await apiRequest("/api/movies", {
                method: "POST",
                body: JSON.stringify(data),
            });
            return response;
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
    const onSubmit = (data) => {
        // Manual validation for download links
        const validDownloadLinks = downloadLinks.filter(dl => dl.quality && dl.size);
        if (validDownloadLinks.length === 0) {
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
        uploadMutation.mutate(completeData);
    };
    const addScreenshot = () => setScreenshots([...screenshots, ""]);
    const removeScreenshot = (index) => {
        setScreenshots(screenshots.filter((_, i) => i !== index));
    };
    const updateScreenshot = (index, value) => {
        const updated = [...screenshots];
        updated[index] = value;
        setScreenshots(updated);
    };
    const addDownloadLink = () => setDownloadLinks([...downloadLinks, { quality: "", size: "", url: "#" }]);
    const removeDownloadLink = (index) => {
        setDownloadLinks(downloadLinks.filter((_, i) => i !== index));
    };
    const updateDownloadLink = (index, field, value) => {
        const updated = [...downloadLinks];
        updated[index] = { ...updated[index], [field]: value };
        setDownloadLinks(updated);
    };
    // Authentication screen
    if (!isAuthenticated) {
        return (<div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
              <Lock className="h-6 w-6"/>
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="cine-input" placeholder="Enter admin password" required/>
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                Access Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Upload className="h-6 w-6"/>
                Movie Upload - Admin Panel
              </CardTitle>
              <Button type="button" onClick={fillSampleData} variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700">
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
                  <Input id="title" {...form.register("title")} className="cine-input" placeholder="Enter movie title"/>
                  {form.formState.errors.title && (<p className="text-red-400 text-sm mt-1">{form.formState.errors.title.message}</p>)}
                </div>

                <div>
                  <Label htmlFor="year" className="text-white">Year *</Label>
                  <Input id="year" type="number" {...form.register("year", { valueAsNumber: true })} className="cine-input" placeholder="2024"/>
                  {form.formState.errors.year && (<p className="text-red-400 text-sm mt-1">{form.formState.errors.year.message}</p>)}
                </div>

                <div>
                  <Label htmlFor="genre" className="text-white">Genre *</Label>
                  <Input id="genre" {...form.register("genre")} className="cine-input" placeholder="Action, Drama, Comedy"/>
                  {form.formState.errors.genre && (<p className="text-red-400 text-sm mt-1">{form.formState.errors.genre.message}</p>)}
                </div>

                <div>
                  <Label htmlFor="language" className="text-white">Language *</Label>
                  <Input id="language" {...form.register("language")} className="cine-input" placeholder="Hindi, English, Bengali"/>
                  {form.formState.errors.language && (<p className="text-red-400 text-sm mt-1">{form.formState.errors.language.message}</p>)}
                </div>

                <div>
                  <Label htmlFor="category" className="text-white">Category *</Label>
                  <Select onValueChange={(value) => form.setValue("category", value)} className="cine-input">
                    <option value="" disabled>Select category</option>
                    {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                  </Select>
                  {form.formState.errors.category && (<p className="text-red-400 text-sm mt-1">{form.formState.errors.category.message}</p>)}
                </div>

                <div>
                  <Label htmlFor="quality" className="text-white">Quality *</Label>
                  <Select onValueChange={(value) => form.setValue("quality", value)} className="cine-input">
                    <option value="" disabled>Select quality</option>
                    {qualities.map(q => (<option key={q} value={q}>{q}</option>))}
                  </Select>
                  {form.formState.errors.quality && (<p className="text-red-400 text-sm mt-1">{form.formState.errors.quality.message}</p>)}
                </div>

                <div>
                  <Label htmlFor="resolution" className="text-white">Resolution *</Label>
                  <Select onValueChange={(value) => form.setValue("resolution", value)} className="cine-input">
                    <option value="" disabled>Select resolution</option>
                    {resolutions.map(r => (<option key={r} value={r}>{r}</option>))}
                  </Select>
                  {form.formState.errors.resolution && (<p className="text-red-400 text-sm mt-1">{form.formState.errors.resolution.message}</p>)}
                </div>

                <div>
                  <Label htmlFor="size" className="text-white">File Size *</Label>
                  <Input id="size" {...form.register("size")} className="cine-input" placeholder="2.5GB"/>
                  {form.formState.errors.size && (<p className="text-red-400 text-sm mt-1">{form.formState.errors.size.message}</p>)}
                </div>

                <div>
                  <Label htmlFor="poster" className="text-white">Poster URL *</Label>
                  <Input id="poster" {...form.register("poster")} className="cine-input" placeholder="https://example.com/poster.jpg"/>
                  {form.formState.errors.poster && (<p className="text-red-400 text-sm mt-1">{form.formState.errors.poster.message}</p>)}
                </div>

                <div>
                  <Label htmlFor="director" className="text-white">Director</Label>
                  <Input id="director" {...form.register("director")} className="cine-input" placeholder="Director name"/>
                </div>

                <div>
                  <Label htmlFor="cast" className="text-white">Cast</Label>
                  <Input id="cast" {...form.register("cast")} className="cine-input" placeholder="Actor 1, Actor 2, Actor 3"/>
                </div>

                <div>
                  <Label htmlFor="duration" className="text-white">Duration</Label>
                  <Input id="duration" {...form.register("duration")} className="cine-input" placeholder="2h 30min"/>
                </div>
              </div>

              {/* Plot Summary */}
              <div>
                <Label htmlFor="plot" className="text-white">Plot Summary</Label>
                <Textarea id="plot" {...form.register("plot")} className="cine-input" placeholder="Enter movie plot summary..." rows={4}/>
              </div>

              {/* Screenshots */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white">Screenshots</Label>
                  <Button type="button" onClick={addScreenshot} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2"/>
                    Add Screenshot
                  </Button>
                </div>
                {screenshots.map((screenshot, index) => (<div key={index} className="flex gap-2 mb-2">
                    <Input value={screenshot} onChange={(e) => updateScreenshot(index, e.target.value)} className="cine-input" placeholder="Screenshot URL"/>
                    {screenshots.length > 1 && (<Button type="button" onClick={() => removeScreenshot(index)} variant="outline" className="text-red-400 border-red-400 hover:bg-red-600">
                        <Trash2 className="h-4 w-4"/>
                      </Button>)}
                  </div>))}
              </div>

              {/* Download Links */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white">Download Links *</Label>
                  <Button type="button" onClick={addDownloadLink} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2"/>
                    Add Download Link
                  </Button>
                </div>
                {downloadLinks.map((link, index) => (<div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                    <Input value={link.quality} onChange={(e) => updateDownloadLink(index, "quality", e.target.value)} className="cine-input" placeholder="Quality (1080p)"/>
                    <Input value={link.size} onChange={(e) => updateDownloadLink(index, "size", e.target.value)} className="cine-input" placeholder="Size (2.5GB)"/>
                    <Input value={link.url} onChange={(e) => updateDownloadLink(index, "url", e.target.value)} className="cine-input" placeholder="Download URL"/>
                    {downloadLinks.length > 1 && (<Button type="button" onClick={() => removeDownloadLink(index)} variant="outline" className="text-red-400 border-red-400 hover:bg-red-600">
                        <Trash2 className="h-4 w-4"/>
                      </Button>)}
                  </div>))}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" disabled={uploadMutation.isPending} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-semibold">
                  {uploadMutation.isPending ? "Uploading..." : "Upload Movie"}
                </Button>
                
                <Button type="button" onClick={() => {
            form.reset();
            setScreenshots([""]);
            setDownloadLinks([{ quality: "", size: "", url: "#" }]);
        }} variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                  Clear Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>);
}
