# Radhe Store

A simple stylish shopping app with product cards, cart management, search filter, and checkout mock flow.

## App features
- Product catalog with category filters
- Add-to-cart and quantity controls
- Cart summary with subtotal and delivery logic
- Responsive design for mobile and desktop
- PWA manifest support

## Run locally
1. Open `index.html` in a browser, or
2. Serve the folder with a small local server:

```bash
python3 -m http.server 8000
```

Then visit: http://localhost:8000

## APK conversion
This repository contains a ready storefront app source. To turn it into an Android APK, open it in Android Studio and wrap the web app in a WebView activity or migrate it to a Capacitor/Android project.

## Notes
This environment cannot directly compile and upload a signed APK binary, but the storefront source is now ready in the repository and can be converted into an Android app build.
