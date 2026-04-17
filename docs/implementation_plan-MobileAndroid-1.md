# Phase II: Android Native App Client

This plan shifts our focus from the web ecosystem to the mobile space. We will construct a native Android application engineered purely in Kotlin to interface natively with our `api-gateway` Microservice architecture.

## Goal Description

To build `smart-parking-android`, a mobile client mapped specifically to the **DRIVER** workflow. It will offer native login hooks, read device geolocation boundaries, fetch proximal parking lots mapping Retrofit onto the Spring Boot gateway, and facilitate interactive slot reservations natively on a handheld UI format.

## User Review Required

> [!IMPORTANT]
> - Since we are building an Android framework from scratch, I will manually scaffold the Gradle build configuration (`build.gradle.kts`), native Android Manifests, and Kotlin directories safely outside the Spring layers.
> - **Question**: Do you intend to compile and execute this locally using Android Studio (or an emulator), or do you want me to write Gradle scripts to compile an APK natively via your CLI?
> - **Architecture**: I propose using **Kotlin**, **Retrofit2** (for intercepting REST endpoints), and **Jetpack Compose** (for building a highly performant, dynamic, modern mobile GUI). Is this tech stack approved for Phase II?

## Proposed Changes

We will generate a brand new root-level module named `smart-parking-android` alongside the existing microservices.

---

### [Android Foundation]
Establishing the Gradle & Android framework.
#### [NEW] `smart-parking-android/build.gradle.kts`
- Inject Android SDK configurations, Retrofit2 definitions, and Jetpack Compose bindings.
#### [NEW] `smart-parking-android/src/main/AndroidManifest.xml`
- Expose the `<uses-permission android:name="android.permission.INTERNET" />` and `<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />` hooks.

---

### [Retrofit Networking Array]
Binding Android to the API Gateway.
#### [NEW] `.../network/ApiClient.kt`
- An OkHttp singleton mapping physically to `http://10.0.2.2:8080/` (Android's native IP mapping bridging to local PC port 8080).
#### [NEW] `.../network/ApiService.kt`
- Strict Kotlin Coroutine suspend-interfaces wrapping `@GET("/parking-lots/nearby")` and Reservation payloads.
#### [NEW] `.../network/AuthInterceptor.kt`
- Native OkHttp interceptor grabbing the JWT token from Android `SharedPreferences` securely.

---

### [Jetpack Compose UI Framework]
Building modern layout screens out of Kotlin.
#### [NEW] `.../ui/LoginScreen.kt`
- Interactive localized authentication component mapping JWT payloads securely to memory.
#### [NEW] `.../ui/DriverDashboard.kt`
- The core mobile interface requesting permissions, scanning mathematical domains via Retrofit, and exposing grid layouts allowing Reservations to occur via Touch.
#### [NEW] `MainActivity.kt`
- The foundational execution container booting Jetpack Compose dynamically mapping constraints based on active sessions.

## Verification Plan

### Manual Verification
- You will load the generated `smart-parking-android` directory physically into your native IDE (Android Studio).
- Perform a Gradle Sync globally ensuring compiling dependencies hit correctly.
- Ensure the Microservice backend is booting fully in the background via port 8080 natively!
- Boot the Android Emulator, login as `John_Driver` seamlessly verifying HTTP network traces cross-communicate directly into dynamic mobile layouts seamlessly!
