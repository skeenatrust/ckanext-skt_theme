// fixes header menu collapse
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNavigation = document.querySelector('.main-navigation');
  
  // toggle
  if (mobileMenuToggle && mainNavigation) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenuToggle.classList.toggle('active');
      mainNavigation.classList.toggle('active');
    });
  }
  
  document.addEventListener('click', function(event) {
    if (mainNavigation && mobileMenuToggle) {
      const isClickInsideNav = mainNavigation.contains(event.target);
      const isClickOnToggle = mobileMenuToggle.contains(event.target);
      
      if (!isClickInsideNav && !isClickOnToggle && mainNavigation.classList.contains('active')) {
        mainNavigation.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      }
    }
  });
  
  window.addEventListener('resize', function() {
    if (window.innerWidth > 992 && mainNavigation && mainNavigation.classList.contains('active')) {
      mainNavigation.classList.remove('active');
      if (mobileMenuToggle) {
        mobileMenuToggle.classList.remove('active');
      }
    }
  });
  
  let lastScrollTop = 0;
  const header = document.querySelector('.masthead');
  
  if (header) {
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScrollTop = scrollTop;
    });
  }
});

// count up animation
(function() {
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    function countUp() {
        const counters = document.querySelectorAll('.count-up');
        
        counters.forEach(counter => {
            if (isInViewport(counter) && !counter.classList.contains('counted')) {
                counter.classList.add('counted');
                
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const increment = Math.ceil(target / (duration / 16)); // Update every ~16ms for 60fps
                
                let current = 0;
                const timer = setInterval(() => {
                    current += increment;
                    
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = current;
                    }
                }, 16);
            }
        });
    }
    
    document.addEventListener("DOMContentLoaded", function() {
        countUp();

        window.addEventListener('scroll', countUp);
    });
})();

// facet collapse
(function() {
    const STORAGE_KEY = 'ckan_facet_states';
    const currentPage = window.location.pathname + window.location.search;
    const pageStorageKey = STORAGE_KEY + '_' + btoa(currentPage).replace(/[^a-zA-Z0-9]/g, '');
    
    function loadFacetStates() {
        try {
            const saved = localStorage.getItem(pageStorageKey);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }
    
    const savedStates = loadFacetStates();
    const collapsedFacets = Object.keys(savedStates).filter(key => savedStates[key]);
    
    if (collapsedFacets.length > 0) {
        // Inject CSS to hide collapsed facets immediately
        const style = document.createElement('style');
        style.id = 'facet-preload-styles';
        
        const css = collapsedFacets.map(facetName => 
            `[data-facet="${facetName}"] .facet-content { max-height: 0 !important; overflow: hidden; }`
        ).join('\n');
        
        style.textContent = css;
        document.head.appendChild(style);
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = 'ckan_facet_states';
    const currentPage = window.location.pathname + window.location.search;
    const pageStorageKey = STORAGE_KEY + '_' + btoa(currentPage).replace(/[^a-zA-Z0-9]/g, '');
    
    function loadFacetStates() {
        try {
            const saved = localStorage.getItem(pageStorageKey);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.warn('Failed to load facet states:', e);
            return {};
        }
    }
    
    function saveFacetStates(states) {
        try {
            localStorage.setItem(pageStorageKey, JSON.stringify(states));
        } catch (e) {
            console.warn('Failed to save facet states:', e);
        }
    }
    
    function getFacetId(header) {
        const section = header.closest('.facet-section');
        return section ? section.getAttribute('data-facet') : null;
    }
    
    function applyFacetState(header, isCollapsed, immediate = false) {
        const content = header.nextElementSibling;
        
        if (isCollapsed) {
            header.setAttribute('aria-expanded', 'false');
            if (immediate) {
                content.style.maxHeight = '0';
                content.style.overflow = 'hidden';
            } else {
                content.style.maxHeight = '0';
            }
            content.classList.add('collapsed');
        } else {
            header.setAttribute('aria-expanded', 'true');
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.overflow = '';
            content.classList.remove('collapsed');
        }
    }
    
    const preloadStyles = document.getElementById('facet-preload-styles');
    if (preloadStyles) {
        preloadStyles.remove();
    }
    
    const facetHeaders = document.querySelectorAll('.facet-header');
    const savedStates = loadFacetStates();
    
    facetHeaders.forEach(header => {
        const facetId = getFacetId(header);
        
        if (facetId && savedStates.hasOwnProperty(facetId)) {
            applyFacetState(header, savedStates[facetId], true);
        } else {
            applyFacetState(header, false, true);
        }
        
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const newCollapsedState = isExpanded;
            
            applyFacetState(this, newCollapsedState, false);
            
            if (facetId) {
                const currentStates = loadFacetStates();
                currentStates[facetId] = newCollapsedState;
                saveFacetStates(currentStates);
            }
        });
        
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    function cleanupOldStates() {
        try {
            const allKeys = Object.keys(localStorage);
            const facetKeys = allKeys.filter(key => key.startsWith(STORAGE_KEY));
            
            if (facetKeys.length > 10) {
                facetKeys.sort().slice(0, facetKeys.length - 10).forEach(key => {
                    localStorage.removeItem(key);
                });
            }
        } catch (e) {
            console.warn('Failed to clean up old facet states:', e);
        }
    }
    
    cleanupOldStates();
});