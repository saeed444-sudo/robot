document.addEventListener('DOMContentLoaded', () => {
    // Check for required libraries
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded');
        return;
    }

    if (typeof gsap === 'undefined') {
        console.error('GSAP is not loaded');
        return;
    }

    // Preloader animation
    const preloader = document.querySelector('.preloader');
    const progressFill = document.querySelector('.progress-fill');
    const mainContainer = document.querySelector('.main-container');
    
    // Simulate loading
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 10;
        progressFill.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                gsap.to(preloader, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        preloader.style.display = 'none';
                        mainContainer.classList.add('loaded');
                        initApp();
                    }
                });
            }, 500);
        }
    }, 200);

    // Initialize main application
    function initApp() {
        // Cursor effects
        const cursorCore = document.querySelector('.cursor-core');
        const cursorAura = document.querySelector('.cursor-aura');
        
        function updateCursorPosition(e) {
            cursorCore.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            cursorAura.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            
            // Update project card hover light position
            document.documentElement.style.setProperty('--x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--y', `${e.clientY}px`);
        }

        function handleCursorEnter() {
            cursorCore.style.transform = 'scale(2)';
            cursorAura.style.transform = 'scale(3)';
        }

        function handleCursorLeave() {
            cursorCore.style.transform = 'scale(1)';
            cursorAura.style.transform = 'scale(1)';
        }

        document.addEventListener('mousemove', updateCursorPosition);

        // Interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .cyber-card, .neon-input');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleCursorEnter);
            el.addEventListener('mouseleave', handleCursorLeave);
        });

        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        themeToggle.addEventListener('click', toggleTheme);

        // GSAP animations
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate sections on scroll
        gsap.utils.toArray('section').forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 1
            });
        });

        // Parallax effects
        gsap.to('.dynamic-gradient', {
            scrollTrigger: {
                scrub: 1
            },
            y: 100,
            duration: 2
        });

        // Cube animation control
        const cube = document.querySelector('.skill-cube');
        cube.addEventListener('mouseenter', () => {
            gsap.to(cube, { animationPlayState: 'paused' });
        });
        cube.addEventListener('mouseleave', () => {
            gsap.to(cube, { animationPlayState: 'running' });
        });

        // Skill bars animation
        const skillBars = document.querySelectorAll('.skill-fill');
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            ScrollTrigger.create({
                trigger: bar,
                start: "top 80%",
                onEnter: () => {
                    bar.style.width = level;
                }
            });
        });

        // Initialize terminal
        initTerminal();

        // Form submission
        const contactForm = document.getElementById('cyber-form');
        contactForm.addEventListener('submit', handleFormSubmit);

        // Project card hover effects
        const projectCards = document.querySelectorAll('.cyber-card');
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });

        // Audio toggle
        const audioToggle = document.querySelector('.audio-toggle');
        audioToggle.addEventListener('click', toggleAudio);
    }

    function toggleTheme() {
        document.body.classList.toggle('alt-theme');
        const toggleSwitch = document.querySelector('.toggle-switch');
        toggleSwitch.classList.toggle('active');
        
        const toggleLabel = document.querySelector('.toggle-label');
        toggleLabel.textContent = document.body.classList.contains('alt-theme') ? 'PINK' : 'CYAN';
    }

    function toggleAudio() {
        const audioToggle = document.querySelector('.audio-toggle');
        audioToggle.textContent = audioToggle.textContent === 'AUDIO ON' ? 'AUDIO OFF' : 'AUDIO ON';
        
        // In a real implementation, you would toggle Web Audio API here
        console.log('Audio toggled - would connect to Web Audio API in full implementation');
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Here you would typically send the form data to a server
        console.log('Form submitted:', data);
        alert('Transmission sent! I\'ll get back to you soon.');
        e.target.reset();
    }

    // Terminal functionality
    function initTerminal() {
        const terminal = {
            output: document.querySelector('.terminal-output'),
            input: document.querySelector('.command-line'),
            commands: {
                help: this.showHelp,
                projects: this.showProjects,
                contact: this.showContact,
                clear: this.clearTerminal,
                theme: () => { toggleTheme(); this.addLine("Theme toggled"); }
            },
            
            bootSequence() {
                const messages = [
                    "> Booting Nexus OS...",
                    "> Loading cyber modules...",
                    "> Establishing quantum connection...",
                    "> System ready. Type 'help' for commands"
                ];
                
                messages.forEach((msg, i) => {
                    setTimeout(() => {
                        this.addLine(msg);
                        if (i === messages.length - 1) {
                            this.addLine("", true);
                        }
                    }, i * 800);
                });
            },
            
            addLine(text, isPrompt = false) {
                const line = document.createElement('p');
                line.textContent = text;
                this.output.appendChild(line);
                
                if (isPrompt) {
                    this.input.focus();
                }
                
                this.output.scrollTop = this.output.scrollHeight;
            },
            
            processCommand(cmd) {
                this.addLine(`> ${cmd}`);
                
                const command = cmd.toLowerCase().trim();
                const found = Object.keys(this.commands).find(key => command.startsWith(key));
                
                if (found) {
                    this.commands[found].call(this);
                } else {
                    this.addLine(`Command not found: ${command}`);
                    this.addLine("Type 'help' for available commands");
                }
                
                this.addLine("", true);
            },
            
            showHelp() {
                const helpText = [
                    "Available commands:",
                    "help - Show this help message",
                    "projects - List featured projects",
                    "contact - Show contact information",
                    "theme - Toggle color theme",
                    "clear - Clear terminal history"
                ];
                
                helpText.forEach(line => this.addLine(line));
            },
            
            showProjects() {
                const projects = [
                    "NEURAL HUD - AI-powered interface",
                    "QUANTUM DASH - Data visualization",
                    "CYBER CITY - 3D web environment"
                ];
                
                this.addLine("Featured Projects:");
                projects.forEach(proj => this.addLine(`- ${proj}`));
            },
            
            showContact() {
                const contacts = [
                    "GitHub: github.com/yourusername",
                    "LinkedIn: linkedin.com/in/yourprofile",
                    "Email: your.email@example.com"
                ];
                
                this.addLine("Contact Methods:");
                contacts.forEach(contact => this.addLine(`- ${contact}`));
            },
            
            clearTerminal() {
                this.output.innerHTML = '';
            }
        };

        // Set up terminal event listeners
        terminal.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                terminal.processCommand(terminal.input.value);
                terminal.input.value = '';
            }
        });

        // Start terminal boot sequence
        terminal.bootSequence();
    }

    // Cleanup function for potential SPA transitions
    function cleanup() {
        // Remove all event listeners here if needed
        // This would be more comprehensive in a real application
        document.removeEventListener('mousemove', updateCursorPosition);
    }
});