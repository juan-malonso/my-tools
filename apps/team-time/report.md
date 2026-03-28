# Architecture Review Report and Detailed Refactoring Plan: "Team Time" Project

**Date:** 24/05/2024
**Author:** Gemini Code Assist (Software Architect)

## 1. Executive Summary

The "Team Time" project has a functional foundation, but a thorough analysis reveals significant opportunities to improve code quality, maintainability, scalability, and architectural clarity. The proposed refactoring focuses on decoupling responsibilities, optimizing state management, improving module organization, and making support scripts more robust.

This report details a structured action plan in atomic tasks, each with its objectives, specific steps, and acceptance criteria, facilitating incremental implementation and verification by development agents or teams.

**Main Refactoring Objectives:**

1.  **Decouple Business Logic from the UI:** Separate state management and actions from presentational components.
2.  **Improve Code Organization:** Centralize utilities, modularize components, and standardize file structure.
3.  **Increase Performance and Stability:** Optimize custom hooks to prevent unnecessary re-renders.
4.  **Improve Script Maintainability:** Refactor shell scripts to be more readable, debuggable, and robust.

---

## 2. Detailed Analysis and Action Plan

### 2.1. Area: State Management and Business Logic

#### 2.1.1. Observation: "God" Component (`src/app/page.tsx`)

The file `/Users/jonso/Documents/my-tools/apps/team-time/src/app/page.tsx` takes on too many responsibilities, acting as a "God Component". This includes:

- Managing multiple states (`iniDate`, `endDate`, `isSettingsOpen`, `defaultBadgeKey`, `baseUrl`, `version`, `imports`).
- Defining business logic for configuration (`useConfig`).
- Implementing utilities (`getDate`, `useCustomState`).
- Handling configuration import and export logic (`applyExternalConfig`, `createExportableConfig`, `handleExport`, `handleImport`, `handleConfigChange`, `handleConfigExport`).
- Rendering the main UI structure and passing props to child components.

This concentration of responsibilities hinders readability, maintenance, reusability, and unit testing of the code.

#### 2.1.2. Recommendation: Centralize State Logic in a Custom Hook

**Objective:** Extract all state logic and related functions from `page.tsx` into a custom, reusable hook, leaving `page.tsx` as a purely presentational component.

**Acceptance Criteria:**

- The `/Users/jonso/Documents/my-tools/apps/team-time/src/app/page.tsx` file is significantly reduced in lines of code and complexity, focusing only on UI composition.
- A new file `src/hooks/usePlannerState.ts` is created that encapsulates all state logic and configuration manipulation functions.
- The application maintains its full functionality with no visible regressions for the user.
- The `usePlannerState` hook exposes a clear and concise API for consumption by UI components.

**Actions to Perform:**

1.  **Create the hooks directory (if it doesn't exist):**

    ```bash
    mkdir -p /Users/jonso/Documents/my-tools/apps/team-time/src/hooks
    ```

2.  **Create the `usePlannerState.ts` hook file:**

    ```bash
    touch /Users/jonso/Documents/my-tools/apps/team-time/src/hooks/usePlannerState.ts
    ```

3.  **Move Logic to `usePlannerState.ts`:**
    - Move the `useState` declarations for `iniDate`, `endDate`, `isSettingsOpen`, `defaultBadgeKey`, `baseUrl`, `version`, `imports` to the body of the new `usePlannerState` hook.
    - Move the functions `applyExternalConfig`, `createExportableConfig`, `handleExport`, `handleImport`, `handleConfigChange`, `handleConfigExport` to the body of the new `usePlannerState` hook.
    - Move the definitions of `useConfig` and `useCustomState` (and `getDate`) to the new `usePlannerState.ts` file or to more specific utility modules (see Task 2.3.1 and 2.1.3).
    - The `usePlannerState` hook should return an object containing the state and functions that UI components need to interact with the configuration.

4.  **Refactor `src/app/page.tsx`:**
    - Remove all state declarations and functions that were moved to the `usePlannerState` hook.
    - Import and use the new hook: `const { config, iniDate, setIniDate, endDate, setEndDate, defaultBadgeKey, setDefaultBadgeKey, baseUrl, setBaseUrl, version, setVersion, isSettingsOpen, setIsSettingsOpen, handleExport, handleImport, handleConfigChange, handleConfigExport, imports } = usePlannerState();`.
    - Ensure that all props passed to `TaskPlanner` and `SettingsModal` come from the `usePlannerState` hook.

#### 2.1.3. Observation: `useCustomState` Hook Optimization

The `useCustomState` hook (currently in `page.tsx`) returns a new object with new references to the `add`, `set`, `del`, and `raw` functions on each render. This breaks referential stability and can cause unnecessary re-renders in components that consume it, as noted by a React compiler warning.

#### 2.1.4. Recommendation: Memoize Functions and Return Value of `useCustomState`

**Objective:** Ensure referential stability of the functions and the object returned by `useCustomState` to optimize performance.

**Acceptance Criteria:**

- The `add`, `set`, `del`, and `raw` functions within `useCustomState` are wrapped in `useCallback`.
- The return object of `useCustomState` is wrapped in `useMemo`.
- The React compiler warning about manual memoization in `BackgroundTable.tsx` disappears.
- The state management functionality through `useCustomState` remains intact.

**Actions to Perform:**

1.  **Modify `useCustomState` (in `src/hooks/usePlannerState.ts` after Task 2.1.2):**
    - Wrap each function (`add`, `set`, `del`, `raw`) with `useCallback`, specifying the correct dependencies (mainly `setValues`).
    - Wrap the entire object returned from the hook with `useMemo`, with `values` and the memoized functions as dependencies.

    ```diff
    --- a/Users/jonso/Documents/my-tools/apps/team-time/src/hooks/usePlannerState.ts
    +++ b/Users/jonso/Documents/my-tools/apps/team-time/src/hooks/usePlannerState.ts
    @@ -1,6 +1,6 @@
     'use client';

    -import React, { useMemo, useState } from 'react';
    +import React, { useCallback, useMemo, useState } from 'react';

     import { BodyGrid } from '@packages/layout';
     import Script from 'next/script';
    @@ -252,23 +252,27 @@

     function useCustomState<T extends { id: string }>(value: T[]): Utils<T> {
       const [values, setValues] = useState<T[]>(value);
    ```

-
-      return {

*
*      const add = useCallback((value: T) => {
*        setValues((prev) => [...prev, value]);
*      }, []);
*
*      const set = useCallback((value: T) => {
*        setValues((prev) => prev.map((m) => (m.id === value.id ? value : m)));
*      }, []);
*
*      const del = useCallback((id: string) => {
*        setValues((prev) => prev.filter((m) => m.id !== id));
*      }, []);
*
*      const raw = useCallback((values: T[]) => {
*        setValues(values);
*      }, []);
*
*      return useMemo(() => ({
         values,

-        add: (value: T) => {
-          setValues([...values, value]);
-        },
-        set: (value: T) => {
-          setValues(values.map((m) => (m.id === value.id ? value : m)));
-        },
-        del: (id: string) => {
-          setValues(values.filter((m) => m.id !== id));
-        },
-        raw: (values: T[]) => {
-          setValues(values);
-        }
-      };

*        add, set, del, raw
*      }), [values, add, set, del, raw]);

  }

  ```

  ```

### 2.2. Area: Separation of Concerns (SoC)

#### 2.2.1. Observation: Business Logic in UI Components

The file `/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/report/ReportModal.tsx` contains pure business logic functions (`generateWeeklyReport`, `calculateHours`, `getWeek`) that are not directly related to the modal's presentation. This violates the SoC principle and makes reuse and testing of these functions difficult.

#### 2.2.2. Recommendation: Move Report Logic to a Utility Module

**Objective:** Decouple the report generation and calculation logic from the `ReportModal` component, moving it to a dedicated utility module.

**Acceptance Criteria:**

- `ReportModal.tsx` focuses exclusively on UI and user interaction.
- The `generateWeeklyReport`, `calculateHours`, and `getWeek` functions reside in a new utility file.
- `BackgroundTable.tsx` imports `generateWeeklyReport` from the new location.
- Report generation works correctly.

**Actions to Perform:**

1.  **Create a utility file for reports:**

    ```bash
    touch /Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/utils/reportGenerators.ts
    ```

2.  **Move report logic:**
    - Cut the `generateWeeklyReport`, `calculateHours`, and `getWeek` functions from the file `/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/report/ReportModal.tsx`.
    - Paste them into the new file `/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/utils/reportGenerators.ts`.
    - Ensure these functions are exported from `reportGenerators.ts`.

3.  **Update imports:**
    - In `/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/table/BackgroundTable.tsx`, change the import of `generateWeeklyReport` to point to the new path:

      ```diff
      --- a/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/table/BackgroundTable.tsx
      +++ b/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/table/BackgroundTable.tsx
      @@ -12,7 +12,8 @@
         USER_W,
         type ItemDate
       } from '../../utils/handlers';
      -import { ReportModal, generateWeeklyReport } from '../report';
      +import { ReportModal } from '../report';
      +import { generateWeeklyReport } from '../../utils/reportGenerators';

       interface BackgroundTableProps {
         config: Config;
      ```

    - Remove the functions and their associated imports from `/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/report/ReportModal.tsx`.

#### 2.2.3. Observation: Nested Sub-components

The `NavButton` and `SectionHeader` components are defined directly within `ReportModal.tsx`. Although they are small, their internal definition increases the length of the main file and limits their potential reuse in other contexts.

#### 2.2.4. Recommendation: Extract Sub-components to Dedicated Files

**Objective:** Improve modularity and reusability by extracting sub-components into their own files.

**Acceptance Criteria:**

- `ReportModal.tsx` is reduced in size and becomes more readable.
- `NavButton` and `SectionHeader` are independent and exportable components.
- The modal's functionality is not affected.

**Actions to Perform:**

1.  **Create a directory for the report's UI components:**

    ```bash
    mkdir -p /Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/report/ui
    ```

2.  **Move `NavButton`:**
    - **Action:** Create `/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/report/ui/NavButton.tsx`.
    - **Action:** Cut the definition of `NavButton` from `ReportModal.tsx` and paste it into `NavButton.tsx`, exporting it.
    - **Action:** Update the import in `ReportModal.tsx`.

3.  **Move `SectionHeader`:**
    - **Action:** Create `/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/report/ui/SectionHeader.tsx`.
    - **Action:** Cut the definition of `SectionHeader` from `ReportModal.tsx` and paste it into `SectionHeader.tsx`, exporting it.
    - **Action:** Update the import in `ReportModal.tsx`.

#### 2.2.5. Observation: Nested Table Sub-components

Similarly, `SpaceBox`, `MonthBox`, `WeekBox`, `DayBox`, and `BackgroundCell` are defined within `BackgroundTable.tsx`. This makes the file very long and mixes the table's logic with the definition of its visual elements.

#### 2.2.6. Recommendation: Extract Table Sub-components to Dedicated Files

**Objective:** Improve the modularity and clarity of the `BackgroundTable` component by extracting its sub-components.

**Acceptance Criteria:**

- `BackgroundTable.tsx` becomes more concise and focuses on table orchestration.
- Each table element (`SpaceBox`, `MonthBox`, `WeekBox`, `DayBox`, `BackgroundCell`) is an independent component.
- The table rendering works without visual or functional changes.

**Actions to Perform:**

1.  **Create a directory for the table's UI components:**

    ```bash
    mkdir -p /Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/table/ui
    ```

2.  **Move `SpaceBox`:**
    - **Action:** Create `/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/table/ui/SpaceBox.tsx`.
    - **Action:** Cut the definition of `SpaceBox` from `BackgroundTable.tsx` and paste it into `SpaceBox.tsx`, exporting it.
    - **Action:** Update the import in `BackgroundTable.tsx`.

3.  **Move `MonthBox`:**
    - **Action:** Create `/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/table/ui/MonthBox.tsx`.
    - **Action:** Cut the definition of `MonthBox` from `BackgroundTable.tsx` and paste it into `MonthBox.tsx`, exporting it.
    - **Action:** Update the import in `BackgroundTable.tsx`.

4.  **Move `WeekBox`:**
    - **Action:** Create `/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/table/ui/WeekBox.tsx`.
    - **Action:** Cut the definition of `WeekBox` from `BackgroundTable.tsx` and paste it into `WeekBox.tsx`, exporting it.
    - **Action:** Update the import in `BackgroundTable.tsx`.

5.  **Move `DayBox`:**
    - **Action:** Create `/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/table/ui/DayBox.tsx`.
    - **Action:** Cut the definition of `DayBox` from `BackgroundTable.tsx` and paste it into `DayBox.tsx`, exporting it.
    - **Action:** Update the import in `BackgroundTable.tsx`.

6.  **Move `BackgroundCell`:**
    - **Action:** Create `/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/components/table/ui/BackgroundCell.tsx`.
    - **Action:** Cut the definition of `BackgroundCell` from `BackgroundTable.tsx` and paste it into `BackgroundCell.tsx`, exporting it.
    - **Action:** Update the import in `BackgroundTable.tsx`.

### 2.3. Area: File and Module Organization

#### 2.3.1. Observation: Scattered Utilities

The `getDate` function is defined in `src/app/page.tsx`, while `getWeek` is in `src/components/features/task-planner/components/report/ReportModal.tsx`. This indicates a lack of centralization for generic utility functions, especially those related to dates.

#### 2.3.2. Recommendation: Consolidate Date Utilities

**Objective:** Centralize all date-related utility functions into a single module to improve organization and avoid duplication.

**Acceptance Criteria:**

- All date manipulation functions are located in a single utility file.
- Components that use these functions import them from the new location.
- Date logic is consistent and easy to find.

**Actions to Perform:**

1.  **Create a date utilities file:**

    ```bash
    touch /Users/jonso/Documents/my-tools/apps/team-time/src/utils/dateUtils.ts
    ```

2.  **Move `getDate` and `getWeek`:**
    - **Action:** Cut the `getDate` function from `/Users/jonso/Documents/my-tools/apps/team-time/src/app/page.tsx`.
    - **Action:** Cut the `getWeek` function from `/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/utils/reportGenerators.ts` (after Task 2.2.2).
    - **Action:** Paste both functions into `/Users/jonso/Documents/my-tools/apps/team-time/src/utils/dateUtils.ts` and export them.

3.  **Update imports:**
    - In `/Users/jonso/Documents/my-tools/apps/team-time/src/hooks/usePlannerState.ts` (after Task 2.1.2), import `getDate` from `src/utils/dateUtils.ts`.
    - In `/Users/jonso/Documents/my-tools/apps/team-time/src/components/features/task-planner/utils/reportGenerators.ts`, import `getWeek` from `src/utils/dateUtils.ts`.

### 2.4. Area: Support Scripts

#### 2.4.1. Observation: Node.js Logic Embedded in Shell Script (`populate.sh`)

The script `/Users/jonso/Documents/my-tools/apps/team-time/populate.sh` executes a complex JavaScript string directly with `node -e`. This is error-prone, hard to debug, doesn't benefit from JavaScript development tools (linters, formatters), and is not very readable.

#### 2.4.2. Recommendation: Separate JavaScript Logic into a Dedicated File

**Objective:** Improve the readability, maintainability, and robustness of the provisioning script by extracting the JavaScript logic into a separate `.js` file.

**Acceptance Criteria:**

- The `populate.sh` script is simplified, acting as an orchestrator that calls the Node.js script.
- The encryption and data generation logic resides in a well-structured `.js` file.
- The provisioning process works as before.

**Actions to Perform:**

1.  **Create a directory for support scripts:**

    ```bash
    mkdir -p /Users/jonso/Documents/my-tools/apps/team-time/scripts
    ```

2.  **Create the Node.js script file:**

    ```bash
    touch /Users/jonso/Documents/my-tools/apps/team-time/scripts/provision-user.js
    ```

3.  **Move JavaScript logic to `provision-user.js`:**
    - Cut the entire JavaScript code block that is executed with `node -e` from `populate.sh`.
    - Paste it into `/Users/jonso/Documents/my-tools/apps/team-time/scripts/provision-user.js`.
    - Ensure the Node.js script reads environment variables (`TEMP_USER`, `TEMP_PASS`) and writes the resulting JSON to `stdout`.

4.  **Simplify `populate.sh`:**
    - Modify `populate.sh` to call the new Node.js script and capture its output.
    - Use `jq` (if available and an acceptable dependency) or simple `node -p` logic to parse the JSON and extract `hmacId` and `encryptedText`.
    - The `wrangler d1 execute` command should use the values obtained from the Node.js script.

    ```diff
    --- a/Users/jonso/Documents/my-tools/apps/team-time/populate.sh
    +++ b/Users/jonso/Documents/my-tools/apps/team-time/populate.sh
    @@ -10,29 +10,10 @@
     export TEMP_PASS="$password"
     export TEMP_USER="$username"

    ```

-CRYPTO_JSON=$(node -e "
-const crypto = require('crypto');
-const password = process.env.TEMP_PASS;
-const username = process.env.TEMP_USER;
-const defaultData = JSON.stringify({ allocations: {values:[]}, members: {values:[]}, tasks: {values:[]}, modules: {values:[]} });

- -function encryptGCM(text, key) {
- const iv = crypto.randomBytes(12);
- const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
- const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
- return Buffer.concat([iv, encrypted, cipher.getAuthTag()]).toString('base64');
  -}
- -try {
- // 1. Derivar clave maestra
- const masterKey = crypto.pbkdf2Sync(password, username, 100000, 32, 'sha256');
-
- // 2. ID DETERMINÍSTICO (Para búsqueda en DB)
- const hmacId = crypto.createHmac('sha256', masterKey).update(username).digest('base64');
-
- // 3. CONTENIDO ALEATORIO (Seguridad)
- const encryptedText = encryptGCM(defaultData, masterKey);
-
- console.log(JSON.stringify({ hmacId, encryptedText }));
  -} catch (e) { process.exit(1); }
  -")

* # Ejecutar el script de Node.js para generar los datos encriptados
* CRYPTO_JSON=$(node scripts/provision-user.js)

-encryptedId=$(echo $CRYPTO_JSON | node -p "JSON.parse(process.argv[1]).hmacId" "$CRYPTO_JSON")
-encryptedText=$(echo $CRYPTO_JSON | node -p "JSON.parse(process.argv[1]).encryptedText" "$CRYPTO_JSON")

- # Parsear la salida JSON para extraer los valores
- encryptedId=$(echo "$CRYPTO_JSON" | jq -r '.hmacId')
- encryptedText=$(echo "$CRYPTO_JSON" | jq -r '.encryptedText')

  credentials_file="${username}.txt"
     echo -e "Username: ${username}\nPassword: ${password}" > "$credentials_file"

  ````

  ```diff
  --- /dev/null
  +++ b/Users/jonso/Documents/my-tools/apps/team-time/scripts/provision-user.js
  @@ -0,0 +1,24 @@
  +const crypto = require('crypto');
  +
  +const password = process.env.TEMP_PASS;
  +const username = process.env.TEMP_USER;
  +const defaultData = JSON.stringify({ allocations: {values:[]}, members: {values:[]}, tasks: {values:[]}, modules: {values:[]} });
  +
  +function encryptGCM(text, key) {
  +  const iv = crypto.randomBytes(12);
  +  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  +  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  +  return Buffer.concat([iv, encrypted, cipher.getAuthTag()]).toString('base64');
  +}
  +
  +try {
  +  // 1. Derivar clave maestra
  +  const masterKey = crypto.pbkdf2Sync(password, username, 100000, 32, 'sha256');
  +
  +  // 2. ID DETERMINÍSTICO (Para búsqueda en DB)
  +  const hmacId = crypto.createHmac('sha256', masterKey).update(username).digest('base64');
  +
  +  // 3. CONTENIDO ALEATORIO (Seguridad)
  +  const encryptedText = encryptGCM(defaultData, masterKey);
  +
  +  console.log(JSON.stringify({ hmacId, encryptedText }));
  +} catch (e) { process.exit(1); }
  ````

#### 2.4.3. Observation: Lack of Clarity in `init.sh`

The script `/Users/jonso/Documents/my-tools/apps/team-time/init.sh` is functional but lacks comments explaining the purpose of each step, especially the commented-out line for database creation.

#### 2.4.4. Recommendation: Document `init.sh` with Clear Comments

**Objective:** Improve the understanding of the `init.sh` script for new developers or for future reference.

**Acceptance Criteria:**

- The `init.sh` script contains comments explaining each step.
- The commented-out line about DB creation is clearly explained.

**Actions to Perform:**

1.  **Modify `init.sh` to add comments:**

    ```diff
    --- a/Users/jonso/Documents/my-tools/apps/team-time/init.sh
    +++ b/Users/jonso/Documents/my-tools/apps/team-time/init.sh
    @@ -1,9 +1,15 @@
     #!/bin/bash

    ```

- # 1. Optional command if you haven't created the DB in your Cloudflare account yet

* # This script initializes the local D1 database for development.
*
* # --- STEP 1 (Optional) ---
* # Uncomment and run this line if you need to create the database in your Cloudflare account for the first time.
* # For local development, this is not strictly necessary.
  # npx wrangler d1 create team_time_db

- # 2. Initialize / start the database locally by applying the schema

* # --- STEP 2 ---
* # Applies the SQL schema to the local D1 environment.
* # This creates the necessary tables for the application to work correctly on your machine.

  echo "Applying SQL schema to local D1 database..."
  npx wrangler d1 execute team_time_db --local --file=./schema.sql

  ```

  ```

---

## 3. Additional Considerations

### 3.1. File: `/Users/jonso/Documents/my-tools/apps/team-time/next.config.ts`

- **Observation:** Contains Webpack configuration logic for `splitChunks`.
- **Comment:** This configuration is specific to Next.js and Webpack and seems well-placed. No immediate changes are required.

### 3.2. Files in `node_modules`

- **Observation:** `node_modules` files have been provided (e.g., `@cloudflare/next-on-pages`, `@aws-sdk/core`, `@aws-sdk/client-sso`, `@aws-sdk/client-cloudfront`).
- **Comment:** These files are part of the project's dependencies and should not be modified directly. Analyzing them is useful for understanding the context of the dependencies, but any improvements or fixes should come from library updates or configuration of their use, not from direct modification of their code.

---

## 4. Conclusion

This refactoring plan, once implemented, will substantially improve the architecture of the "Team Time" project. By separating concerns, optimizing state management, and organizing the code more logically, a cleaner, easier to understand, maintain, test, and scale codebase will be achieved. It is recommended to tackle these tasks iteratively, prioritizing those that will have the greatest impact on the project's quality and stability.
