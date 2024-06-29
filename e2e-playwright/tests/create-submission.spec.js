const { test, expect } = require("@playwright/test");

test.describe.serial("Sequential submission update tests", () => {
  test("Create-submission-that-fails", async ({ page }) => {
    await page.goto("http://localhost:7800");

    // Find button
    console.log("Find button");
    await page.waitForSelector('button[type="submitButton"]');
    const submitButton = await page.$('button[type="submitButton"]');

    const isButtonVisible = await submitButton.isVisible();
    expect(isButtonVisible).toBe(true);

    // Send submission with empty code
    console.log("Send submission with empty code");
    await submitButton.click();

    // Wait that the submission status is procesed
    console.log("Wait that the submission status is procesed");
    await page.waitForSelector('span[type="submission-status"]');
    const submissionStatusElement = await page.$(
      'span[type="submission-status"]'
    );
    const submissionStatusElementVisible =
      await submissionStatusElement.isVisible();
    expect(submissionStatusElementVisible).toBe(true);

    // Define a function to check if the status is "processed"
    const isStatusProcessed = async () => {
      const status = await submissionStatusElement.innerText();
      return status.trim().toLowerCase() === "processed";
    };

    // Wait for the status to become "processed" before continuing
    await expect
      .poll(isStatusProcessed, {
        message: 'Waiting for submission status to become "processed"',
        timeout: 10000, // 10 seconds
      })
      .toBeTruthy();

    // Find is correct message
    console.log("Find is correct message");
    await page.waitForSelector('span[type="is-correct"]');
    const correctStatus = await page.$('span[type="is-correct"]');
    const correctStatusVisible = await correctStatus.isVisible();
    expect(correctStatusVisible).toBe(true);

    // Get the value of the is correct message
    console.log("Get the value of the is correct message");
    const correctStatusValue = await correctStatus.innerText();
    expect(correctStatusValue).toBe("No");
  });

  test("Create-submission-that-pass", async ({ page }) => {
    await page.goto("http://localhost:7800");

    // Find button
    console.log("Find button");
    await page.waitForSelector('button[type="submitButton"]');
    const submitButton = await page.$('button[type="submitButton"]');

    const isButtonVisible = await submitButton.isVisible();
    expect(isButtonVisible).toBe(true);

    await page.waitForTimeout(1000);
    // Find assignment id
    console.log("Find assignment title");
    await page.waitForSelector('h3[type="assignment-title"]');
    const assignmentTitleElement = await page.$('h3[type="assignment-title"]');
    const assignmentTitleElementVisible =
      await assignmentTitleElement.isVisible();
    expect(assignmentTitleElementVisible).toBe(true);
    const assignmentTitle = await assignmentTitleElement.innerText();
    console.log(assignmentTitle);

    let code = "";

    if (assignmentTitle === "Hello world") {
      code = 'def hello():\n\treturn "Hello world!"\n';
    } else if (assignmentTitle === "Hello") {
      code = 'def hello():\n\treturn "Hello"';
    } else if (assignmentTitle === "Sum") {
      code = "def sum(n1,n2):\n\treturn n1+n2";
    }

    console.log("code");
    console.log(code);
    // Fill code editor
    console.log("Fill code editor");
    await page.waitForSelector('textarea[type="code-editor"]');

    const codeEditorElement = await page.$('textarea[type="code-editor"]');
    const codeEditorElementVisible = await codeEditorElement.isVisible();
    expect(codeEditorElementVisible).toBe(true);
    await codeEditorElement.fill(code);
    await page.waitForTimeout(1000);

    // Send submission with code
    console.log("Send submission with code");
    await submitButton.click();

    // Wait that the submission status is procesed
    console.log("Wait that the submission status is procesed");
    await page.waitForSelector('span[type="submission-status"]');
    const submissionStatusElement = await page.$(
      'span[type="submission-status"]'
    );
    const submissionStatusElementVisible =
      await submissionStatusElement.isVisible();
    expect(submissionStatusElementVisible).toBe(true);

    // Define a function to check if the status is "processed"
    const isStatusProcessed = async () => {
      const status = await submissionStatusElement.innerText();
      return status.trim().toLowerCase() === "processed";
    };

    // Wait for the status to become "processed" before continuing
    await expect
      .poll(isStatusProcessed, {
        message: 'Waiting for submission status to become "processed"',
        timeout: 10000, // 10 seconds
      })
      .toBeTruthy();

    await page.waitForTimeout(1000);

    // Find is correct message
    console.log("Find is correct message");
    await page.waitForSelector('span[type="is-correct"]');
    const correctStatus = await page.$('span[type="is-correct"]');
    const correctStatusVisible = await correctStatus.isVisible();
    expect(correctStatusVisible).toBe(true);

    // Find grader feedback message
    console.log("Find grader feedback message");
    await page.waitForSelector('p[type="grader-feedback"]');
    const graderFeedback = await page.$('p[type="grader-feedback"]');
    const graderFeedbackVisible = await graderFeedback.isVisible();
    expect(graderFeedbackVisible).toBe(true);

    // Get the value of the is correct message
    console.log("Get the value of the is correct message");
    const correctStatusValue = await correctStatus.innerText();
    expect(correctStatusValue).toBe("Yes");

    // Get the value of the grader feedback message
    const graderFeedbackValue = await graderFeedback.innerText();
    // console log the value
    console.log(graderFeedbackValue);
  });

  test("Create-submission-that-pass-check-next-assignment", async ({
    page,
  }) => {
    await page.goto("http://localhost:7800");

    // Find button
    console.log("Find button");
    await page.waitForSelector('button[type="submitButton"]');
    const submitButton = await page.$('button[type="submitButton"]');

    const isButtonVisible = await submitButton.isVisible();
    expect(isButtonVisible).toBe(true);

    await page.waitForTimeout(1000);
    // Find assignment id
    console.log("Find assignment title");
    await page.waitForSelector('h3[type="assignment-title"]');
    const assignmentTitleElement = await page.$('h3[type="assignment-title"]');
    const assignmentTitleElementVisible =
      await assignmentTitleElement.isVisible();
    expect(assignmentTitleElementVisible).toBe(true);
    const assignmentTitle = await assignmentTitleElement.innerText();
    console.log(assignmentTitle);

    let code = "";

    if (assignmentTitle === "Hello world") {
      code = 'def hello():\n\treturn "Hello world!"\n';
    } else if (assignmentTitle === "Hello") {
      code = 'def hello():\n\treturn "Hello"';
    } else if (assignmentTitle === "Sum") {
      code = "def sum(n1,n2):\n\treturn n1+n2";
    }

    console.log("code");
    console.log(code);
    // Fill code editor
    console.log("Fill code editor");
    await page.waitForSelector('textarea[type="code-editor"]');

    const codeEditorElement = await page.$('textarea[type="code-editor"]');
    const codeEditorElementVisible = await codeEditorElement.isVisible();
    expect(codeEditorElementVisible).toBe(true);
    await codeEditorElement.fill(code);
    await page.waitForTimeout(1000);

    // Send submission with code
    console.log("Send submission with code");
    await submitButton.click();

    // Wait that the submission status is procesed
    console.log("Wait that the submission status is procesed");
    await page.waitForSelector('span[type="submission-status"]');
    const submissionStatusElement = await page.$(
      'span[type="submission-status"]'
    );
    const submissionStatusElementVisible =
      await submissionStatusElement.isVisible();
    expect(submissionStatusElementVisible).toBe(true);

    // Define a function to check if the status is "processed"
    const isStatusProcessed = async () => {
      const status = await submissionStatusElement.innerText();
      return status.trim().toLowerCase() === "processed";
    };

    // Wait for the status to become "processed" before continuing
    await expect
      .poll(isStatusProcessed, {
        message: 'Waiting for submission status to become "processed"',
        timeout: 10000, // 10 seconds
      })
      .toBeTruthy();

    await page.waitForTimeout(1000);

    // Find is correct message
    console.log("Find is correct message");
    await page.waitForSelector('span[type="is-correct"]');
    const correctStatus = await page.$('span[type="is-correct"]');
    const correctStatusVisible = await correctStatus.isVisible();
    expect(correctStatusVisible).toBe(true);

    // Find grader feedback message
    console.log("Find grader feedback message");
    await page.waitForSelector('p[type="grader-feedback"]');
    const graderFeedback = await page.$('p[type="grader-feedback"]');
    const graderFeedbackVisible = await graderFeedback.isVisible();
    expect(graderFeedbackVisible).toBe(true);

    // Get the value of the is correct message
    console.log("Get the value of the is correct message");
    const correctStatusValue = await correctStatus.innerText();
    expect(correctStatusValue).toBe("Yes");

    // Get the value of the grader feedback message
    const graderFeedbackValue = await graderFeedback.innerText();
    // console log the value
    console.log(graderFeedbackValue);
    // Find next assignment button
    console.log("Find next assignment button");
    await page.waitForSelector('button[type="nextButton"]');
    const nextAssignmentButton = await page.$('button[type="nextButton"]');
    const nextAssignmentButtonVisible = await nextAssignmentButton.isVisible();
    expect(nextAssignmentButtonVisible).toBe(true);

    // Click next assignment button
    await nextAssignmentButton.click();

    // Find next assignment title
    console.log("Find next assignment title");
    await page.waitForSelector('h3[type="assignment-title"]');
    const nextAssignmentTitleElement = await page.$(
      'h3[type="assignment-title"]'
    );
    const nextAssignmentTitleElementVisible =
      await nextAssignmentTitleElement.isVisible();
    expect(nextAssignmentTitleElementVisible).toBe(true);
    const nextAssignmentTitle = await nextAssignmentTitleElement.innerText();

    const assertNextAssignmentTitleNotSame = async () => {
      expect(nextAssignmentTitle).not.toBe(assignmentTitle);
    };

    await assertNextAssignmentTitleNotSame();
  });
});
