import { Actor } from "apify";
import { PlaywrightCrawler } from "crawlee";
import router from "./routes.js"; // Import the router correctly

// Initialize the Apify SDK
await Actor.init();

try {
    // Read input data from JSON file
    const input = await Actor.getInput();

    // Destructure input for use
    const { startUrl, userIDs, GD_USER, GD_PWD } = input;

    // Validate input
    if (!startUrl || typeof startUrl !== "string") {
        throw new Error(
            "Invalid input: 'startUrl' must be a valid URL string."
        );
    }
    if (
        !Array.isArray(userIDs) ||
        userIDs.length === 0 ||
        userIDs.some((user) => typeof user !== "string")
    ) {
        throw new Error(
            "Invalid input: 'userIDs' must be a non-empty array of objects containing string 'id'."
        );
    }
    if (!GD_USER || typeof GD_USER !== "string") {
        throw new Error("Invalid input: 'GD_USER' must be a valid string.");
    }
    if (!GD_PWD || typeof GD_PWD !== "string") {
        throw new Error("Invalid input: 'GD_PWD' must be a valid string.");
    }

    // Extract the list of user IDs from the objects
    // Create a proxy configuration if needed
    const proxyConfiguration = await Actor.createProxyConfiguration();

    const crawler = new PlaywrightCrawler({
        requestHandlerTimeoutSecs: 2400,
        maxConcurrency: 1,
        proxyConfiguration, // Your proxy configuration
        requestHandler: router, // Pass the router as the request handler
        launchContext: {
            launchOptions: {
                headless: true,
            },
        },
    });

    // Start the crawler with the specified startUrl
    await crawler.run([
        { url: startUrl, userData: { GD_USER, GD_PWD, userIDs } },
    ]); // Pass user data
} catch (error) {
    // Log error messages
    console.error(`Error occurred: ${error.message}`);
    console.error(error.stack); // Log the stack trace
} finally {
    await Actor.exit();
}
