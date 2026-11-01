# Sentinel Angular Front-End

This folder contains an Angular `src` implementation of the Sentinel incident-review interface, using the original Sentinel palette and layout patterns.

## Integration
1. Back up your existing Angular `src` folder.
2. Copy this project's `src` folder into your existing Angular workspace, replacing the old `src` files.
3. Keep your existing `package.json` and `angular.json` (the uploaded archive contained `src` only, not the full workspace configuration).
4. Run `npm install` if needed, then `ng serve`.

## Login and registration logic reused
- `src/app/login/login.ts` uses the same reactive form, required/email/minimum-password validation, and `UsersService.isExist()` login check from your uploaded project.
- `src/app/register/register.ts` keeps the template-driven registration form and its validation rules.
- `src/app/services/users.ts` preserves the `UsersService` localStorage-backed user list, `addUser()`, `getUsers()`, and `isExist()` logic.
- Registration stores users in browser `localStorage`. This is a front-end demo only; there is no server/API and passwords are not securely stored. Do not use this approach for a production authentication system.

## Demo behavior
- The incidents, model scores, notifications and review history are mock data based on the supplied Sentinel HTML.
- Video playback displays an explicit preview-unavailable message; no video source was included.
- Review decisions and settings work in the current browser session; the theme preference is saved locally.
- The archive provided by you included `src` but no `package.json` or `angular.json`, so those workspace files are not included here.
