document.addEventListener('DOMContentLoaded', () => {
    // Animated Text for Hero Section
    const animatedRoleElement = document.getElementById('animated-role');
    if (animatedRoleElement) {
        const roles = ["Graphic Designer", "UI/UX Designer", "Motion Designer", "3D Artist", "Frontend Developer"];
        let currentRoleIndex = 0; let currentCharIndex = 0; let isDeleting = false;
        const typingSpeed = 120; const deletingSpeed = 70; const pauseBeforeDelete = 2000; const pauseBeforeNewType = 300;
        function typeDeleteAnimation() {
            const currentRole = roles[currentRoleIndex];
            if (isDeleting) {
                animatedRoleElement.textContent = currentRole.substring(0, currentCharIndex - 1); currentCharIndex--;
                if (currentCharIndex === 0) { isDeleting = false; currentRoleIndex = (currentRoleIndex + 1) % roles.length; setTimeout(typeDeleteAnimation, pauseBeforeNewType); } else { setTimeout(typeDeleteAnimation, deletingSpeed); }
            } else {
                animatedRoleElement.textContent = currentRole.substring(0, currentCharIndex + 1); currentCharIndex++;
                if (currentCharIndex === currentRole.length) { isDeleting = true; setTimeout(typeDeleteAnimation, pauseBeforeDelete); } else { setTimeout(typeDeleteAnimation, typingSpeed); }
            }
        }
        setTimeout(typeDeleteAnimation, pauseBeforeNewType);
    }

    // Mobile Navigation Toggle
    const burger = document.querySelector('.burger'); 
    const nav = document.querySelector('.nav-links'); 
    const navLinks = document.querySelectorAll('.nav-links li');
    if (burger && nav && navLinks.length > 0) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            navLinks.forEach((link, index) => { if (link.style.animation) { link.style.animation = ''; } else { link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`; }});
            burger.classList.toggle('toggle');
        });
        navLinks.forEach(link => { 
            link.addEventListener('click', (e) => { 
                if (nav.classList.contains('nav-active')) { 
                    nav.classList.remove('nav-active'); 
                    burger.classList.remove('toggle'); 
                    navLinks.forEach(linkAnimate => linkAnimate.style.animation = ''); 
                }
            }); 
        });
    }

    // Animate elements on scroll
    const elementInView = (el, dividend = 1) => { 
        if (!el) return false;
        const elementTop = el.getBoundingClientRect().top; 
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend); 
    };
    const displayScrollElement = (element) => { 
        if (!element) return;
        if (element.classList.contains('portfolio-item-hidden') && !element.classList.contains('portfolio-item-visible')) {
            // Stays hidden
        } else {
            element.classList.add('is-visible');
        }
    };
    const handleScrollAnimation = () => { 
        const allScrollElements = document.querySelectorAll('.animate-on-scroll');
        allScrollElements.forEach((el) => { 
            if (elementInView(el, 1.25)) { 
                displayScrollElement(el); 
            } 
        }); 
    };
    window.addEventListener('scroll', handleScrollAnimation); 
    handleScrollAnimation(); 

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear'); 
    if (currentYearSpan) { 
        currentYearSpan.textContent = new Date().getFullYear(); 
    }

    // Instagram Embed Processing
    function processInstagramEmbeds() { 
        if (window.instgrm && window.instgrm.Embeds) { 
            window.instgrm.Embeds.process(); 
        } 
    }
    
    // Software Scroller Setup
    function setupSoftwareScroller() { 
        const scrollerContainer = document.querySelector('.software-scroller-container'); 
        if (!scrollerContainer) return; 
        const softwareList = scrollerContainer.querySelector('.software-list'); 
        if (!softwareList || !softwareList.children.length) return; 
        if (softwareList.scrollWidth <= scrollerContainer.clientWidth * 1.5 && softwareList.children.length > 3) { 
             const originalItemsHTML = softwareList.innerHTML; 
             softwareList.innerHTML += originalItemsHTML; 
        }
    }
    if (document.querySelector('.software-scroller-container')) {
        setupSoftwareScroller();
    }
    
    // "Show More" Functionality for Instagram Embeds
    const portfolioContentArea = document.getElementById('portfolio-content-area'); 
    if (portfolioContentArea) {
        const showMoreButton = portfolioContentArea.querySelector('#showMoreInstaButton');
        const portfolioGrid = portfolioContentArea.querySelector('.portfolio-grid');

        if (showMoreButton && portfolioGrid) {
            const allPortfolioItems = Array.from(portfolioGrid.querySelectorAll('.portfolio-item'));
            const itemsPerRowDesktop = 5;
            const itemsPerRowMobile = 2; 
            let initiallyVisibleCount;

            const updateInitiallyVisibleCount = () => {
                if (window.innerWidth >= 1200) { // Large Desktop (5 columns)
                    initiallyVisibleCount = 5;
                } else if (window.innerWidth >= 992) { // Desktop (4 columns)
                    initiallyVisibleCount = 4;
                } else if (window.innerWidth >= 769) { // Tablet (3 columns)
                    initiallyVisibleCount = 3;
                } else { // Mobile (2 columns)
                    initiallyVisibleCount = 2; // Show first 2 on mobile by default
                }
            };
            
            const updatePortfolioVisibility = () => {
                updateInitiallyVisibleCount();
                allPortfolioItems.forEach((item, index) => {
                    if (index < initiallyVisibleCount) {
                        item.classList.remove('portfolio-item-hidden');
                        item.classList.add('portfolio-item-visible');
                        // Animate initially visible items
                        if (elementInView(item, 1.25)) {
                            item.classList.add('is-visible');
                        }
                    } else {
                        item.classList.add('portfolio-item-hidden');
                        item.classList.remove('portfolio-item-visible');
                        item.classList.remove('is-visible'); // Ensure it's not marked for animation if hidden
                    }
                });

                const hiddenItemsCurrent = allPortfolioItems.filter(item => item.classList.contains('portfolio-item-hidden'));
                if (hiddenItemsCurrent.length === 0) {
                    showMoreButton.style.display = 'none';
                } else {
                    showMoreButton.style.display = 'inline-block';
                }
                 // Process embeds after initial visibility setup
                setTimeout(processInstagramEmbeds, 100);
            };

            updatePortfolioVisibility(); // Initial setup

            showMoreButton.addEventListener('click', () => {
                const currentVisibleItems = portfolioGrid.querySelectorAll('.portfolio-item:not(.portfolio-item-hidden)');
                const hiddenItemsRemaining = Array.from(portfolioGrid.querySelectorAll('.portfolio-item.portfolio-item-hidden'));
                
                let itemsToLoadCount = 0;
                if (window.innerWidth >= 1200) itemsToLoadCount = itemsPerRowDesktop;
                else if (window.innerWidth >= 992) itemsToLoadCount = itemsPerRowDesktop; // Or adjust if you want 4
                else if (window.innerWidth >= 769) itemsToLoadCount = itemsPerRowDesktop; // Or adjust if you want 3
                else itemsToLoadCount = itemsPerRowMobile;


                const itemsToShow = hiddenItemsRemaining.slice(0, itemsToLoadCount); 
                
                itemsToShow.forEach(item => {
                    item.classList.remove('portfolio-item-hidden');
                    item.classList.add('portfolio-item-visible');
                    
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    void item.offsetWidth; 

                    if (elementInView(item, 1.25)) {
                        item.classList.add('is-visible');
                    }
                });
                
                // After showing, check again
                const finalHiddenItems = Array.from(portfolioGrid.querySelectorAll('.portfolio-item.portfolio-item-hidden'));
                if (finalHiddenItems.length === 0) {
                    showMoreButton.style.display = 'none';
                }
                
                setTimeout(processInstagramEmbeds, 150);
            });

            window.addEventListener('resize', updatePortfolioVisibility); // Update on resize

        } else if (showMoreButton) {
             showMoreButton.style.display = 'none';
        }
    }

    // Contact Form Handling & Success Popup
    const contactForm = document.getElementById('myForm'); 
    const submitButton = document.getElementById('submitButton'); 
    const formLoadingText = document.getElementById('formLoading'); 
    const successPopup = document.getElementById('successPopup');
    if (contactForm) { 
        contactForm.addEventListener('submit', function() { 
            if (submitButton) submitButton.disabled = true; 
            if (formLoadingText) formLoadingText.style.display = 'block'; 
        }); 
    }
    window.formSubmitted = function() { 
        if (submitButton) submitButton.disabled = false; 
        if (formLoadingText) formLoadingText.style.display = 'none'; 
        if (contactForm) contactForm.reset();  
        if (successPopup) successPopup.classList.add('show'); 
    }
    window.closePopup = function() { 
        if (successPopup) successPopup.classList.remove('show'); 
    }
    if (successPopup) { 
        successPopup.addEventListener('click', function(event) { 
            if (event.target === successPopup) { 
                closePopup(); 
            } 
        }); 
    }

    // Initial call to process any embeds visible on page load
    if (document.querySelector('.instagram-media')) {
        if (window.instgrm && window.instgrm.Embeds) {
            processInstagramEmbeds();
        } else {
            const observer = new MutationObserver((mutationsList, obs) => {
                if (window.instgrm && window.instgrm.Embeds) {
                    processInstagramEmbeds();
                    obs.disconnect(); 
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                if (window.instgrm && window.instgrm.Embeds) {
                    processInstagramEmbeds();
                }
                observer.disconnect(); 
            }, 2500);
        }
    }
});
