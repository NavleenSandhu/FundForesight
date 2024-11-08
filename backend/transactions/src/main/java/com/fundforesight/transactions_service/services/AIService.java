package com.fundforesight.transactions_service.services;

import java.io.IOException;
import java.time.Duration;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class AIService {
    private final String apiKey;
    private OkHttpClient client;
    private final int maxRetries = 5;
    private final Duration retryDelay = Duration.ofSeconds(2);

    public AIService(@Value("${OPEN_AI_API_KEY}") String apiKey) {
        this.apiKey = apiKey;
        this.client = new OkHttpClient();
    }

    public JSONArray getResponse(String prompt, int size) throws IOException {
        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-4o mini");
        JSONArray messages = new JSONArray();
        messages.put(new JSONObject()
                .put("role", "user")
                .put("content", prompt));
        requestBody.put("messages", messages);
        RequestBody body = RequestBody.create(requestBody.toString(), MediaType.get("application/json; charset=utf-8"));

        Request request = new Request.Builder()
                .url("https://api.openai.com/v1/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .post(body)
                .build();

        int attempts = 0;
        JSONArray longestArray = new JSONArray(); // To track the longest valid response

        while (attempts < maxRetries) {
            try {
                Response response = client.newCall(request).execute();
                if (response.body() != null) {
                    String responseBody = response.body().string();
                    JSONObject jsonResponse = new JSONObject(responseBody);

                    // Attempt to parse JSON and retrieve IDs
                    String textResponse = jsonResponse
                            .getJSONArray("choices")
                            .getJSONObject(0)
                            .getJSONObject("message")
                            .getString("content")
                            .trim();

                    int opening = textResponse.indexOf("[");
                    int closing = textResponse.indexOf("]");
                    if (opening != -1 && closing != -1) {
                        JSONArray result = new JSONArray(textResponse.substring(opening, closing + 1));

                        // Check if the result length is equal to the required size
                        if (result.length() == size) {
                            return result; // Return if we got the correct number of IDs
                        }

                        // Update longestArray if the current result is longer
                        if (result.length() > longestArray.length()) {
                            longestArray = result; // Record the longest array
                        }
                    }
                }
            } catch (IOException | org.json.JSONException e) {
                System.out.println("Error parsing JSON response, retrying... " + (attempts + 1) + " of " + maxRetries);
            }
            attempts++;

            try {
                Thread.sleep(retryDelay.toMillis());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new IOException("Retry interrupted", e);
            }
        }
        System.out.println("Attempts taken: " + attempts);
        // Return the longest array recorded after all attempts
        return longestArray;
    }

}
