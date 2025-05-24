import axios from "axios";

export const uploadVideo = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("video", file);

  const response = await axios.post("http://localhost:5000/api/videos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(response.data.mcqQuestions)
  return response.data.mcqQuestions;
};
