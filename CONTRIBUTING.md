# Contributing to Schools Curriculum Mapping Tool

Thank you for your interest in contributing to the Schools Curriculum Mapping Tool! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs
- Use the GitHub issue tracker
- Include detailed steps to reproduce the bug
- Provide your browser/device information
- Include screenshots if applicable

### Suggesting Features
- Use the GitHub issue tracker with the "enhancement" label
- Describe the feature and its benefits for schools
- Consider the impact on mobile users
- Think about accessibility and usability

### Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (especially on mobile devices)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development
```bash
# Clone your fork
git clone https://github.com/yourusername/Schools-Curriculum-Mapping.git
cd Schools-Curriculum-Mapping

# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run check
```

### Testing Guidelines
- Test on multiple devices (desktop, tablet, mobile)
- Test with different screen sizes
- Verify all CRUD operations work correctly
- Check mobile responsiveness
- Test with slow network connections

## 📝 Code Style

### TypeScript
- Use TypeScript for all new code
- Follow existing type definitions
- Add proper type annotations
- Use interfaces for object shapes

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Use Tailwind CSS for styling
- Keep components focused and reusable

### Backend Code
- Use Express.js patterns
- Follow existing API structure
- Add proper error handling
- Use Zod for validation

## 🎯 Areas for Contribution

### High Priority
- [ ] SQLite database migration
- [ ] Azure AD integration
- [ ] Advanced reporting features
- [ ] Bulk import/export improvements

### Medium Priority
- [ ] Additional mobile optimizations
- [ ] Performance improvements
- [ ] Accessibility enhancements
- [ ] Documentation improvements

### Low Priority
- [ ] UI/UX improvements
- [ ] Additional language support
- [ ] Advanced filtering options
- [ ] Integration with other school systems

## 📱 Mobile-First Development

Since this tool is designed for schools with mobile users:
- Always test on mobile devices
- Ensure touch-friendly interfaces
- Optimize for slow network connections
- Consider offline capabilities

## 🔐 Security Considerations

When contributing:
- Never commit sensitive data
- Follow security best practices
- Validate all user inputs
- Consider authentication and authorization

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the project's style guide
- [ ] All tests pass
- [ ] Mobile responsiveness verified
- [ ] No console errors
- [ ] Documentation updated if needed

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested on tablet
- [ ] All CRUD operations work

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] My changes generate no new warnings
```

## 🏫 School-Specific Considerations

When contributing, remember this tool is for schools:
- Consider teacher workflows
- Think about administrative needs
- Ensure data privacy compliance
- Make it easy for non-technical users

## 📞 Getting Help

If you need help:
- Check existing issues and discussions
- Create a new issue with detailed information
- Join our community discussions

## 🙏 Thank You

Thank you for contributing to making education technology better for schools around the world! 