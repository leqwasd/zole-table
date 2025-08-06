# 🚀 Deployment 4. 4. **The workflow will automatically**:

- Build your project
- Deploy to GitHub Pages
- Your site will be available at: `https://leqwasd.github.io/zole-table/`e workflow will automatically\*\*:
- Build your project
- Deploy to GitHub Pages
- Your site will be available at: `https://leqwasd.github.io/zole-table/`e for Zolītes punktu tabula

## Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **GitHub Pages**: Enable GitHub Pages in your repository settings
3. **Node.js**: Version 18 or higher installed locally

## Quick Deploy Steps

### Option 1: Automatic GitHub Actions Deployment (Recommended)

1. **Push your code** to the `master` or `main` branch
2. **Enable GitHub Pages** in repository settings:
    - Go to Settings > Pages
    - Source: GitHub Actions
3. **The workflow will automatically**:
    - Build your project
    - Deploy to GitHub Pages
    - Your site will be available at: `https://leqwasd.github.io/zole-calculator/`

### Option 2: Manual Deployment

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Configuration Notes

### Important Configuration Files Updated:

1. **`vite.config.ts`**:
    - Base path set to `/zole-table/` for GitHub Pages
    - Optimized build settings

2. **`package.json`**:
    - Added deploy script
    - Added homepage URL
    - Added gh-pages dependency

3. **`.github/workflows/deploy.yml`**:
    - Automated deployment workflow
    - Runs on push to master/main branch

4. **`index.html`**:
    - SEO meta tags
    - Open Graph tags
    - PWA manifest link

5. **`public/manifest.json`**:
    - PWA configuration
    - App can be installed on mobile devices

## Features Added for Production

✅ **GitHub Pages Configuration**
✅ **SEO Optimization** (meta tags, descriptions)  
✅ **PWA Support** (can be installed as mobile app)
✅ **Favicon and App Icons**
✅ **Recent Games on Homepage**
✅ **Game Management** (continue/delete games)
✅ **Responsive Design**
✅ **GitHub Repository Link**
✅ **Automated CI/CD Pipeline**
✅ **Professional README**
✅ **MIT License**

## URL Structure

- **Homepage**: `https://leqwasd.github.io/zole-table/`
- **New Game**: `https://leqwasd.github.io/zole-table/#/setup/`
- **Game Play**: `https://leqwasd.github.io/zole-table/#/game/[gameData]`

## Local Development

```bash
# Start development server
npm run start

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Troubleshooting

### Common Issues:

1. **404 on GitHub Pages**:
    - Check that the `base` in `vite.config.ts` matches your repository name
    - Ensure GitHub Pages is enabled in repository settings

2. **Assets not loading**:
    - Verify the base path configuration
    - Check browser developer tools for 404 errors

3. **Build fails**:
    - Run `npm run lint` to check for code issues
    - Ensure all TypeScript errors are resolved

## Next Steps for Enhancement

Consider adding these features in the future:

- 🔍 **Advanced search and filtering** for game history
- 📊 **Statistics and analytics** (win rates, average scores)
- 🎨 **Theme customization** (dark/light mode)
- 🌐 **Multi-language support** (English version)
- 📱 **Push notifications** for game reminders
- 💾 **Cloud sync** for game data
- 👥 **Multiplayer features** (real-time sharing)
- 📈 **Data export** (CSV, PDF reports)

## Support

For issues or feature requests, please create an issue on the [GitHub repository](https://github.com/leqwasd/zole-table/issues).
