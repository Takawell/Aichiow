// lib/traceMoe.ts

import axios from "axios";
import { TraceMoeResponse } from "@/types/trace";

export async function searchAnimeByImage(base64Image: string): Promise<TraceMoeResponse | null> {
  try {
    const response = await axios.post("https://api.trace.moe/search", {
      image: base64Image,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Trace.moe API error:", error);
    return null;
  }
}
