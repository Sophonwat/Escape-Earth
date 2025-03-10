I got this code help from CodePilet because I didn't understand why it wasn't working.
Now, the response I get doesn't make sense:
1. It says the API may be wrong.
2. It says the /answer endpoint is wrong, but I couldn't find another logic.

Saving the skeleton key to a file named 'skeletonkey.txt' if it exists
 
if (answerData.skeletonKey) {
    import { writeFileSync } from 'fs';
    
    // However, the 'skeletonkey.txt' does not change even when I want it to.
    // But still, the response says I got the skeleton key.
    writeFileSync('skeletonkey.txt', answerData.skeletonKey);
    console.log("Skeleton key saved to skeletonkey.txt");
} 


Checking if the skeleton key is present in the response and saving it to a file
if (answerData.skeletonKey) {
    console.log("Saving the skeleton key...");
    writeFileSync('skeletonkey.txt', answerData.skeletonKey); // Save the key to 'skeletonkey.txt'
    console.log("Skeleton key saved to skeletonkey.txt");
} else {
    console.log("No skeleton key found in the response.");
}
