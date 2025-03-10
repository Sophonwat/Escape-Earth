import fetch from 'node-fetch';
import { writeFileSync } from 'fs';

// API URLs and player email
const SOLAR_SYSTEM_API = "https://api.le-systeme-solaire.net/rest/";
const RIS_API = "https://spacescavanger.onrender.com"; // Replace url with the correct URL (/)
const PLAYER_EMAIL = "Sophonwatb@uia.no";

async function startMission() {
    try {
        //Start the mission by calling the /start endpoint
        //This sends a GET request to the RIS API to begin the mission
        let response = await fetch(`${RIS_API}/start?player=${PLAYER_EMAIL}`); 
        if (!response.ok) {
            throw new Error(`Failed to start mission: ${response.statusText}`);
        }
            // contains data about the mission
        let startData = await response.json();
        console.log("Mission started:", startData);

        // fetch data about the Sun from the solar system API
        //this sends a GET request to get information about the Sun, the center of our solar system
        response = await fetch(`${SOLAR_SYSTEM_API}bodies/sun`);
        if (!response.ok) {
            throw new Error(`Failed to fetch solar system data: ${response.statusText}`);
        }
        // Check if the response is in JSON format, if not throw an error
        let contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Expected JSON, but received ${contentType}`);
        }
        // Parse the response as JSON, which has information about the Sun
        let sunData = await response.json();
        console.log("Sun data:", sunData);

        // Find the access pin by subtracting the Sun mean radius from its equatorial radius.
        // Equatorial radius – the distance from the center of the Sun to its surface at the equator.
        // Mean radius – the average distance from the center of the Sun to its surface.
        let equatorialRadius = sunData.equaRadius;
        let meanRadius = sunData.meanRadius;
        let accessPin = equatorialRadius - meanRadius;
        console.log("Access pin:", accessPin);

        // Submit the access pin as the answer to the /answer endpoint
        // This sends a POST request with the access pin and player email to the RIS API
        response = await fetch(`${RIS_API}/answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answer: accessPin, player: PLAYER_EMAIL })
        });
        if (!response.ok) {
            throw new Error(`Failed to submit answer: ${response.statusText}`);
        }
        // Parse the response as JSON, which contains the skeleton key
        let answerData = await response.json();
        console.log("Answer submitted:", answerData);

        // Save the skeleton key to a file named skeletonkey.txt if it exists
        /*if (answerData.skeletonKey) {
            writeFileSync('skeletonkey.txt', answerData.skeletonKey);
            console.log("Skeleton key saved to skeletonkey.txt");
        }*/

            if (answerData.skeletonKey) {
                console.log("Saving the skeleton key...");
                writeFileSync('skeletonkey.txt', answerData.skeletonKey);
                console.log("Skeleton key saved to skeletonkey.txt");
            } else {
                console.log("No skeleton key found in the response.");
            }

        // Comment explaining the completion of the initial challenge
        console.log("Initial challenge completed. Skeleton key obtained and saved.");
    } catch (error) {
        // Log any errors that occur during the mission
        console.error("Error during mission:", error);
    }
}

startMission();




// I got this code help from CodePilet because I didn't understand why it wasn't working.
// Now, the response I get doesn't make sense:
// 1. It says the API may be wrong.
// 2. It says the /answer endpoint is wrong, but I couldn't find another logic.

// Saving the skeleton key to a file named 'skeletonkey.txt' if it exists
/* 
if (answerData.skeletonKey) {
    import { writeFileSync } from 'fs';
    
    // However, the 'skeletonkey.txt' does not change even when I want it to.
    // But still, the response says I got the skeleton key.
    writeFileSync('skeletonkey.txt', answerData.skeletonKey);
    console.log("Skeleton key saved to skeletonkey.txt");
} 
*/

/* Checking if the skeleton key is present in the response and saving it to a file
if (answerData.skeletonKey) {
    console.log("Saving the skeleton key...");
    writeFileSync('skeletonkey.txt', answerData.skeletonKey); // Save the key to 'skeletonkey.txt'
    console.log("Skeleton key saved to skeletonkey.txt");
} else {
    console.log("No skeleton key found in the response.");
}
 */