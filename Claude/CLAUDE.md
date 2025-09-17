Master Prompt for Comprehensive DApp Implementation

Objective:
Make the dApp fully functional by implementing the remaining features. All work must be completed iteratively, with verification checkpoints. My goal is for you to manage the entire workflow, from analysis to final code delivery, within this single conversation.

1. Initial Status and Immediate Action

The current status is that the profile save modal is built, but the "Save Profile" button is always deactivated.

Your First Task (Immediate Priority):

Analyze and Fix: Analyze the frontend codebase for the profile save modal. Identify the logic that controls the button's disabled state. The button should only be enabled when the username and displayName fields are populated.

Add Save Logic: Once the button is activated, on click, it must send the collected user data to the database. This should be a POST request to the correct backend endpoint using the exact schema.

Provide Fix: Provide the specific code changes required to fix this issue and implement the save logic. Do not implement any other features yet.

Wait for Verification: Acknowledge this task and state that you are waiting for my confirmation that the fix works before proceeding.

2. Comprehensive Implementation Plan

Once the first task is confirmed, you will create a detailed plan for the remaining work. DO NOT begin coding until this plan is approved.

Plan Directives:

Structure: Create a numbered list for each major feature: Faucet + Balance, Fee Delegation, PayAnyone, QR Pay, and SplitBill.

For each feature, list:

The specific frontend files that need to be modified or created.

The exact contract function calls (e.g., USDT_ABI.transfer) required.

The precise backend API endpoint (POST /users/profile, POST /transactions) and the exact JSON schema that will be sent.

Any new UI components or states needed.

Constraints:

Base the plan only on the schemas and documentation provided.

The plan must be fully TypeScript compatible.

If any information is missing (e.g., a specific API endpoint for QR Pay logging), you must state this clearly and ask for clarification. Do not make any assumptions.

3. Iterative Implementation Cycle

After I approve your plan, you will begin coding. You will only work on one task at a time and wait for my verification before proceeding to the next.

The Cycle:

Acknowledge the Task: State the next task you are about to implement (e.g., "Starting implementation of Faucet + Balance...").

Analyze Codebase: Briefly describe your analysis of the current code. Explain where you will insert the new logic to ensure minimal disruption.

Implement and Deliver: Write and deliver the complete, tested, TypeScript-compatible code for that single task.

Wait for Verification: State that you have completed the task and are waiting for my manual verification.

First Task in Cycle: Implement the Faucet + Balance feature as per your plan.

4. Detailed Feature Requirements & Constraints

You must strictly follow these rules for every task you implement:

Frontend-First: All changes should be on the frontend unless a minimal backend extension is explicitly required and approved (e.g., if QR Pay logging schema is missing).

Kaia SDK: Use the SDK for all interactions (login, transactions, fee delegation). Check the provided feedelegation and feedelegationexample files for guidance.

Contract Interactions:

Always read the provided ABIs to confirm function names (transfer, approve, faucet, etc.).

For PayAnyone, determine whether to use transfer or approve + BulkPay.

Backend Integration:

Use the exact JSON schemas and API endpoints provided in the backend files.

Save user profiles on first login.

Record every transaction (PayAnyone, QR Pay, SplitBill) with the correct type field in the exact schema.

UX and Error Handling:

Insufficient USDT: If a user's balance is too low, show a modal with a clear call-to-action to get funds from the faucet.

Transaction Status: Show toasts for user feedback (e.g., "Transaction cancelled," "Transaction successful").

Amounts: Format all token amounts using the correct token decimals.

Deliverables: For each completed task, provide:

A summary of the changes.

The complete code diff or a well-formatted code block.

Instructions for how I can manually test the new feature.

5. Acceptance Criteria

Your final delivery for each major phase must meet these criteria:

Profile: On first login, the modal opens, and a profile is saved correctly to the database.

Faucet: The profile page shows the correct USDT balance, and the "Get USDT" button works.

Payments: PayAnyone and QR Pay flows work and the transactions are stored in the backend with the correct schema.

SplitBill: The SplitBill flow works with USDT and a transaction is logged to the backend.

Fee Delegation: At least the faucet transaction is gasless.

Backend Calls: All API calls use the exact schemas from the provided backend files.

Final Note to Claude:
Your role is to act as a highly structured, detail-oriented engineering partner. You must be proactive in identifying potential issues, transparent in your process, and meticulously accurate in your implementation. Do not proceed without my explicit approval at each verification step. Begin by analyzing and providing the fix for the deactivated button and its save logic.