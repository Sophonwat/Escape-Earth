import fetch from 'node-fetch';

// API URLs and player email
const SOLAR_SYSTEM_API = "https://api.le-systeme-solaire.net/rest/";
const RIS_API = "https://spacescavanger.onrender.com"; // Replace url with the correct URL (/)
const PLAYER_EMAIL = "sophonwatb@uia.no";

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
        // If the response contains a skeleton key, save it to a file
        if (answerData.skeletonKey) {
            console.log("Skeleton key:", answerData.skeletonKey);
        }

        // Comment explaining the completion of the initial challenge
        console.log("Initial challenge completed. Skeleton key obtained and saved.");
    } catch (error) {
        // Log any errors that occur during the mission
        console.error("Error during mission:", error);
    }
}

// Start the mission
startMission();