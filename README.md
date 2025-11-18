# Personal Website

A modern, responsive personal website with 6 interactive pages showcasing your professional profile, hobbies, and skills.

## Features

### 🏠 Home Page
- Hero section with introduction
- Feature cards linking to other pages
- Call-to-action section
- Responsive navigation

### 🎯 Hobbies Page
- Interactive hobby cards with detailed information
- Dynamic showcase section that updates based on selected hobby
- Statistics and progress indicators
- Hover effects and smooth transitions

### 🔍 Discover Page
- Interactive timeline of your journey
- Key discoveries and learnings
- Interactive quiz to learn more about you
- Dynamic content based on user interaction

### 📄 Resume Page
- Professional resume layout
- Contact information sidebar
- Skills categorization
- Experience timeline
- Projects showcase
- Print and download functionality

### 💼 Career Page
- Career interests with progress bars
- Goals timeline (short, medium, long-term)
- Current learning path
- Professional values
- Interactive elements

### 🎮 Game Page
- **Memory Match Game**: Test memory with card matching
- **Tech Quiz**: Programming and technology questions
- **Typing Challenge**: Improve typing speed and accuracy
- **Snake Game**: Classic snake game with modern controls
- Leaderboard and statistics tracking

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Interactive functionality and games
- **Font Awesome**: Icons throughout the site
- **Google Fonts**: Inter font family for modern typography

## File Structure

```
misproject1/
├── index.html          # Home page
├── hobbies.html        # Hobbies page
├── discover.html       # Discover page
├── resume.html         # Resume page
├── career.html         # Career interests page
├── game.html           # Interactive games page
├── styles.css          # Main stylesheet
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Customization Guide

### 1. Personal Information
Replace placeholder content with your actual information:

- **Name**: Update "Your Name" throughout all files
- **Contact Info**: Update email, phone, location in `resume.html`
- **Social Links**: Update LinkedIn, GitHub, Twitter links in footer
- **Profile Image**: Replace the Font Awesome icon with your actual photo

### 2. Content Updates

#### Home Page (`index.html`)
- Update hero title and subtitle
- Modify feature card descriptions
- Customize call-to-action text

#### Hobbies Page (`hobbies.html`)
- Update hobby cards with your actual hobbies
- Modify hobby data in `script.js` (hobbyData object)
- Update statistics and descriptions

#### Discover Page (`discover.html`)
- Update timeline with your actual journey
- Modify discovery cards with your experiences
- Update quiz data in `script.js` (quizData object)

#### Resume Page (`resume.html`)
- Replace all professional experience
- Update education information
- Modify skills and certifications
- Add your actual projects

#### Career Page (`career.html`)
- Update career interests and expertise levels
- Modify goals timeline with your aspirations
- Update learning path with your current studies
- Customize professional values

### 3. Styling Customization

#### Colors
The main color scheme uses:
- Primary: `#2563eb` (blue)
- Secondary: `#64748b` (gray)
- Background: `#f8fafc` (light gray)
- Text: `#1e293b` (dark gray)

To change colors, update the CSS variables or search and replace color values in `styles.css`.

#### Fonts
The site uses Inter font family. To change fonts:
1. Update the Google Fonts link in HTML files
2. Update the `font-family` property in `styles.css`

### 4. Adding New Games

To add a new game to the Game page:

1. Add a new game card in `game.html`
2. Create a new game container section
3. Add game initialization function in `script.js`
4. Update the `startGame()` function to handle your new game

### 5. Responsive Design

The website is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Features

- Optimized CSS with efficient selectors
- Minimal JavaScript with event delegation
- Responsive images and icons
- Smooth animations and transitions
- Mobile-first design approach

## Getting Started

1. Open `index.html` in your web browser
2. Navigate through the different pages using the navigation menu
3. Try the interactive features and games
4. Customize the content to match your personal information

## Future Enhancements

Potential improvements you could add:
- Dark mode toggle
- More interactive games
- Blog section
- Contact form with backend integration
- Portfolio gallery
- Multi-language support
- Progressive Web App (PWA) features

## License

This project is open source and available under the MIT License.

---

**Note**: Remember to replace all placeholder content with your actual information before using this website professionally.

