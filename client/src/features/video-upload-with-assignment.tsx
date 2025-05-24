import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, CheckCircle, AlertCircle, Play } from "lucide-react";
import MCQAssignment from "./mcq-assignment";
import { uploadVideo } from "@/apis/uploadApis";


type FileStatus = "idle" | "ready" | "uploading" | "success" | "error";
type AppState = "upload" | "assignment" | "completed";

interface FileInfo {
  file: File;
  preview: string | null;
  status: FileStatus;
  progress: number;
  error?: string;
}

export interface MCQQuestion {
  question: string;
  options: string[];
  answer: string;
  QuestionId: string;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_FILE_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export default function VideoUploadWithAssignment() {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [appState, setAppState] = useState<AppState>("upload");
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error:
          "Invalid file type. Please upload MP4, WebM, or QuickTime video files.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
      };
    }

    return { valid: true };
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    processFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    processFile(file);
  };

  const processFile = (file: File) => {
    const validation = validateFile(file);

    if (!validation.valid) {
      setFileInfo({
        file,
        preview: null,
        status: "error",
        progress: 0,
        error: validation.error,
      });
      return;
    }

    const preview = URL.createObjectURL(file);

    setFileInfo({
      file,
      preview,
      status: "ready",
      progress: 0,
    });
  };

  const handleUpload = async () => {
    if (!fileInfo || fileInfo.status !== "ready") return;

    setFileInfo({ ...fileInfo, status: "uploading", progress: 0 });

    let progressInterval: NodeJS.Timeout | undefined;

    try {
      progressInterval = setInterval(() => {
        setFileInfo((prev) => {
          if (!prev || prev.progress >= 90) return prev;
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 200);

      const mcqGroups = await uploadVideo(fileInfo.file);
      const flatQuestions = mcqGroups.flat();

      if (progressInterval) clearInterval(progressInterval);

      setFileInfo((prev) =>
        prev ? { ...prev, progress: 100, status: "success" } : null
      );

      setQuestions(flatQuestions);
      setTimeout(() => {
        setAppState("assignment");
      }, 1500);
    } catch (error) {
      if (progressInterval) clearInterval(progressInterval);
      console.error(error);
      setFileInfo((prev) =>
        prev
          ? {
              ...prev,
              status: "error",
              error: "Failed to upload or transcribe the video.",
            }
          : null
      );
    }
  };

  const handleAssignmentComplete = (results: any) => {
    console.log("Assignment results:", results);
    setAppState("completed");
  };

  const resetForm = () => {
    if (fileInfo?.preview) {
      URL.revokeObjectURL(fileInfo.preview);
    }
    setFileInfo(null);
    setQuestions([]);
    setAppState("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startNewAssignment = () => {
    resetForm();
  };

  if (appState === "assignment") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Video Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Please answer the following questions based on the uploaded video
              content.
            </p>
            {fileInfo?.preview && (
              <div className="mb-4">
                <video
                  src={fileInfo.preview}
                  controls
                  className="w-full rounded-md border max-h-64"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <MCQAssignment
          questions={questions}
          onComplete={handleAssignmentComplete}
          onBack={() => setAppState("upload")}
        />
      </div>
    );
  }

  if (appState === "completed") {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Assignment Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-6">
            Thank you for completing the assignment! Your responses have been
            submitted successfully.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={startNewAssignment}>Start New Assignment</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Video for Assignment</CardTitle>
      </CardHeader>
      <CardContent>
        {!fileInfo && (
          <div
            className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <div className="text-lg font-medium mb-1">
              Drag and drop your video here
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse (MP4, WebM, QuickTime up to 100MB)
            </p>
            <Button variant="secondary" type="button">
              Select Video
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {fileInfo && (
          <div className="space-y-4">
            {fileInfo.status === "error" ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fileInfo.error}</AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                    {fileInfo.preview ? (
                      <video
                        src={fileInfo.preview}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">
                        {fileInfo.file.name}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetForm}
                        disabled={fileInfo.status === "uploading"}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(fileInfo.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>

                    {(fileInfo.status === "uploading" ||
                      fileInfo.status === "success") && (
                      <div className="mt-2 space-y-2">
                        <Progress value={fileInfo.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {fileInfo.status === "success"
                              ? "Processing complete - Loading assignment..."
                              : `Processing video... ${fileInfo.progress}%`}
                          </span>
                          {fileInfo.status === "success" && (
                            <span className="flex items-center text-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" /> Complete
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {fileInfo.preview && fileInfo.status === "ready" && (
                  <div className="mt-4">
                    <Label htmlFor="video-preview" className="block mb-2">
                      Preview
                    </Label>
                    <video
                      id="video-preview"
                      src={fileInfo.preview}
                      controls
                      className="w-full rounded-md border"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>

      {fileInfo && fileInfo.status !== "error" && (
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={resetForm}
            disabled={fileInfo.status === "uploading"}
          >
            Cancel
          </Button>
          {fileInfo.status === "ready" && (
            <Button onClick={handleUpload}>Upload & Start Assignment</Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
