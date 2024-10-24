import { createPlaywrightRouter } from "crawlee";

const router = createPlaywrightRouter();

// Default handler for processing the start URL
router.addDefaultHandler(async ({ log, page, request }) => {
    log.info(`Processing the start URL: ${request.loadedUrl}`);

    const { GD_USER, GD_PWD, userIDs } = request.userData; // Extract user data from request

    console.log(userIDs);

    // Perform the login
    await page.fill('input[type="email"]', GD_USER); // Use GD_USER directly
    await page.fill('input[type="password"]', GD_PWD); // Use GD_PWD directly
    await page.click('button[type="submit"]');

    log.info("Login successful! Waiting for the target page.");
    await page.waitForLoadState("load");

    for (const user of userIDs) {
        const userId = user.id;
        log.info(`Working with user ID: ${userId}`);
        try {
            // Click the button to add a sales representative
            await page.click(
                ".adi-bucket-item.adi-filter-item-wrapper.s-bucket-item.s-attr-filter.s-id-attr_outc00_financeout_users_id"
            );

            await page.waitForTimeout(2500);

            await page.waitForSelector(
                "label.input-checkbox-label.s-select-all-checkbox >> input.input-checkbox"
            );

            // Search for the user ID
            await page.getByPlaceholder("Search…").fill(userId);

            await page.waitForTimeout(2500);

            const checkbox = page.locator(
                "input.input-checkbox.gd-checkbox-selection"
            );
            if ((await checkbox.count()) > 0) {
                await checkbox.click(); // Simulate user interaction
            } else {
                log.warn(`Checkbox for user ID ${userId} not found.`);
            }

            const button = page.locator('button[title="Apply"]');
            await button.click();

            await page.waitForTimeout(2500);

            // Wait for save button to appear, instead of using fixed wait
            await page.waitForSelector('text="Save"');
            const button2 = page.locator('text="Save"');
            await button2.click();
            await button2.click(); // Click multiple times if necessary (check if required)

            await page.click(".s-save-button");

            log.info(`User saved: ${userId}`);
        } catch (e) {
            log.error(`Error processing user ID ${userId}: ${e.message}`);
            log.debug(e.stack); // Log the stack trace for better debugging
        }
    }

    // Click the save button at the end
    const saveButton = page.locator('text="Save"');
    await saveButton.click();
    await saveButton.click(); // Click again if necessary
    await page.click(".s-save-button");

    log.info("Everything went great! Closing the scraper.");
});

export default router;
