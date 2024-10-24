import { createPlaywrightRouter } from "crawlee";

const router = createPlaywrightRouter();

// Default handler for processing the start URL
router.addDefaultHandler(async ({ log, page, request }) => {
    log.info(`Processing the start URL: ${request.loadedUrl}`);

    const { GD_USER, GD_PWD, userIDs } = request.userData; // Extract user data from request

    console.log(userIDs);

    // Perform the login
    await page.fill('input[type="email"]', GD_USER);
    await page.fill('input[type="password"]', GD_PWD);
    await page.click('button[type="submit"]');

    log.info("Login successful! Waiting for the target page.");
    await page.waitForLoadState("load");

    for (const user of userIDs) {
        log.info(`Working with user ID: ${user}`);
        try {
            // Click the button to add a sales representative
            await page.click(
                ".adi-bucket-item.adi-filter-item-wrapper.s-bucket-item.s-attr-filter.s-id-attr_outc00_financeout_users_id"
            );

            await page.waitForTimeout(2500); // Allow time for the page to respond

            await page.waitForSelector(
                "label.input-checkbox-label.s-select-all-checkbox >> input.input-checkbox"
            );

            // Search for the user ID
            await page.getByPlaceholder("Search…").fill(user);
            await page.waitForTimeout(2500); // Allow time for search results

            const checkbox = page.locator(
                "input.input-checkbox.gd-checkbox-selection"
            );
            if ((await checkbox.count()) > 0) {
                await checkbox.click(); // Simulate user interaction
            } else {
                log.warn(`Checkbox for user ID ${user} not found.`);
            }

            const button = page.locator('button[title="Apply"]');
            await button.click();
            await page.waitForTimeout(2500); // Wait for the action to complete

            // Wait for save button to appear
            await page.waitForSelector('text="Save"');
            const saveButton = page.locator('text="Save"');
            await saveButton.click();
            await saveButton.click(); // Click again if necessary

            // Final confirmation save
            await page.click(".s-save-button");

            log.info(`User saved: ${user}`);
        } catch (e) {
            log.error(`Error processing user ID ${user}: ${e.message}`);
            log.debug(e.stack); // Log the stack trace for better debugging
        }
    }

    // Click the save button at the end
    const finalSaveButton = page.locator('text="Save"');
    await finalSaveButton.click();
    await finalSaveButton.click(); // Click again if necessary
    await page.click(".s-save-button");

    log.info("Everything went great! Closing the scraper.");
});

export default router;
