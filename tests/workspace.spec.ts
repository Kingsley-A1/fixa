import { expect, test } from "@playwright/test";
test("homepage leads into a responsive sample workspace", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Great at repairs/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "Explore the live demo" }).click();
  await expect(
    page.getByRole("heading", { name: "A clearer day starts here." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test("new repairs persist, can be searched, filtered and updated", async ({
  page,
}) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "New repair job" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Customer name").fill("Alex Test");
  await dialog.getByLabel("Device", { exact: false }).fill("TestPhone 14");
  await dialog.getByLabel("What needs fixing?").fill("Cracked front screen");
  await dialog.getByLabel("Estimated amount").fill("55000");
  await dialog.getByRole("button", { name: "Create repair job" }).click();
  await expect(dialog).not.toBeVisible();
  await page
    .getByRole("textbox", { name: "Search workspace" })
    .fill("Alex Test");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  const id = await page.locator("tbody .demo-job-link").innerText();
  await page.locator("tbody .demo-job-link").click();
  await dialog.getByLabel("Repair status").selectOption("Ready to collect");
  await dialog.getByRole("button", { name: "Save status" }).click();
  await page.getByLabel("Filter by status").selectOption("Received");
  await expect(
    page.getByRole("heading", { name: "No matches found" }),
  ).toBeVisible();
  await page.getByLabel("Filter by status").selectOption("Ready to collect");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.reload();
  await page.getByRole("textbox", { name: "Search workspace" }).fill(id);
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Ready to collect");
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.locator("tbody")).not.toContainText("Alex Test");
});
test("directories, empty states, dialog keyboard and unavailable accounts", async ({
  page,
}) => {
  await page.goto("/demo");
  await page
    .getByRole("button", { name: "Customers", exact: true })
    .filter({ visible: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Customer directory" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Devices", exact: true })
    .filter({ visible: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Device register" }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Search workspace" })
    .fill("does not exist");
  await expect(
    page.getByRole("heading", { name: "No matches found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "New repair job" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "New repair job" }),
  ).toBeFocused();
  await page.goto("/register");
  await expect(
    page.getByText("Public registration is not open yet.", { exact: false }),
  ).toBeVisible();
  await page.goto("/login");
  await expect(
    page.getByRole("link", { name: "Explore the demo" }),
  ).toBeVisible();
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/ticket/00000000-0000-0000-0000-000000000000");
  await expect(
    page.getByRole("heading", { name: "That page isn’t here." }),
  ).toBeVisible();
});
test("invalid stored data recovers safely", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("fixa-demo-v1", JSON.stringify([{ id: "invalid" }])),
  );
  await page.goto("/demo");
  await expect(page.locator("tbody tr")).toHaveCount(6);
});
