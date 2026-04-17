# Phase II: Progressive Web App / Mobile Capacitor

Per your request, we are moving forward with **Option 3**. We will inherently wrap your stunning Angular ecosystem into a physical Cross-Platform Mobile Application using Capacitor. This prevents us from having to manage two separate codebases while retaining native Android deployment capabilities!

## Goal Description

To install and inject Capacitor securely into the `smart-parking-ui` workspace, generating the native Android `apk` directories and syncing the web-framework dynamically so it effectively acts as a standalone mobile application capable of requesting permissions and executing HTTP endpoints natively from a device.

## User Review Required

> [!IMPORTANT]
> The biggest challenge of Web-to-Mobile wrapper architecture is Networking. Localhost (`localhost:8080`) on an Android phone points to the *phone's* internal system, not your PC running the API Gateway! 
> 
> Therefore, I will need to update your `api.service.ts` to dynamically use `10.0.2.2:8080` (the standard Android bridge IP for PC Localhost) exclusively when it identifies that it's physically running inside an Android wrapper.
> 
> Do you approve this architecture?

## Proposed Changes

We will strictly execute inside the existing `smart-parking-ui` workspace!

---

### [Capacitor Initialization]
Generating the mobile ecosystem inside Angular.
#### [COMMAND] `npm install @capacitor/core @capacitor/cli @capacitor/android`
- We will download the dependencies and execute `npx cap init` natively mapping the web output target to `dist/smart-parking-ui/browser`.
#### [COMMAND] `npx cap add android`
- Will explicitly generate an `/android` folder at the root of `smart-parking-ui` containing standard Gradle wrappers, App Manifests, and Java hooks cleanly managed by Capacitor dynamically!

---

### [Angular Configurations]
Bridging the Web to Mobile.
#### [MODIFY] `smart-parking-ui/capacitor.config.ts`
- Explicitly inject `cleartext: true` server permissions authorizing non-HTTPS traffic so the App can successfully communicate natively on local servers.
#### [MODIFY] `smart-parking-ui/src/app/services/api.service.ts`
- Inject Capacitor Core networking checks mapping environment payloads: If `android` -> route strictly to `10.0.2.2:8080`. Else -> route identically to `localhost:8080`!
#### [MODIFY] `smart-parking-ui/package.json`
- Append the script hook `"build:android": "ng build && npx cap sync android"` explicitly.

## Verification Plan

### Manual Verification
- You will inherently navigate to `smart-parking-ui/android` completely in your local filesystem.
- Open this physically into **Android Studio**.
- Ensure your Java API Gateway and Microservices are successfully running cleanly!
- Compile via Android Studio seamlessly booting the app dynamically onto an Android Emulator—verify the layouts strictly render mobile-proportioned dynamically!
